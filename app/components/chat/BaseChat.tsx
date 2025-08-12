/*
 * @ts-nocheck
 * Preventing TS checks with files presented in the video for a better presentation.
 */

import type { JSONValue, Message } from 'ai';
import React, { type RefCallback, useEffect, useRef, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { Menu } from '~/components/sidebar/Menu.client';
import { IconButton } from '~/components/ui/IconButton';
import { Workbench } from '~/components/workbench/Workbench.client';
import { classNames } from '~/utils/classNames';
import { PROVIDER_LIST } from '~/utils/constants';
import { Messages } from './Messages.client';
import { SendButton } from './SendButton.client';
import { APIKeyManager, getApiKeysFromCookies } from './APIKeyManager';
import Cookies from 'js-cookie';
import * as Tooltip from '@radix-ui/react-tooltip';

import styles from './BaseChat.module.scss';
import { ExportChatButton } from '~/components/chat/chatExportAndImport/ExportChatButton';
import { ImportButtons } from '~/components/chat/chatExportAndImport/ImportButtons';
import { ExamplePrompts } from '~/components/chat/ExamplePrompts';
import GitCloneButton from './GitCloneButton';

import FilePreview from './FilePreview';
import { ModelSelector } from '~/components/chat/ModelSelector';
import { SpeechRecognitionButton } from '~/components/chat/SpeechRecognition';
import type { ProviderInfo } from '~/types/model';
import { ScreenshotStateManager } from './ScreenshotStateManager';
import { toast } from 'react-toastify';
import StarterTemplates from './StarterTemplates';
import type { ActionAlert, SupabaseAlert, DeployAlert } from '~/types/actions';
import DeployChatAlert from '~/components/deploy/DeployAlert';
import ChatAlert from './ChatAlert';
import type { ModelInfo } from '~/lib/modules/llm/types';
import ProgressCompilation from './ProgressCompilation';
import type { ProgressAnnotation } from '~/types/context';
import type { ActionRunner } from '~/lib/runtime/action-runner';
import { LOCAL_PROVIDERS } from '~/lib/stores/settings';
import { SupabaseChatAlert } from '~/components/chat/SupabaseAlert';
import { SupabaseConnection } from './SupabaseConnection';
import { ExpoQrModal } from '~/components/workbench/ExpoQrModal';
import { expoUrlAtom } from '~/lib/stores/qrCodeStore';
import { useStore } from '@nanostores/react';
import { StickToBottom, useStickToBottomContext } from '~/lib/hooks';

// shadCN
import { TypewriterEffectSmooth } from '../ui/typewriter-effect';
import { GlowingEffect } from '../ui/glowing-effect';
import { FrameworkDropdown } from '../ui/FrameworkDropdown';

// icons
import chatLine from '../../../icons/chat-1-line.svg'
import paintBrush from '../../../icons/paint-brush-line.svg'
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import layoutLine from '../../../icons/layout-left-2-line.svg';
import attachmentIcon from '../../../icons/attachment-2.svg'
import sparkIcon from '../../../icons/sparkling-line.svg'
import { BackgroundLines } from '../ui/background-lines';
import addFill from '../../../icons/add-fill.svg'
import blakeBill from '../../../icons/blakebill.svg'
// social media
import threadIcon from '../../../icons/thread.svg'
import youtubeIcon from '../../../icons/youtube.svg'
import instagramIcon from '../../../icons/instagram.svg'
import linkedinIcon from '../../../icons/linkedin.svg'

// unsupportedBrowsers
import BrowserUnsupportedPopup from './BrowserUnsupportedPopup';
import { Tooltip as SparkTooltip } from '~/components/ui/Tooltip';
import CookiePopup from '../ui/CookiePopup';
import { AnimatedTooltip } from '../ui/Animated-tooltip';
import { Link } from '@remix-run/react';

// team
import Greg from '../../../assets/icons/Greg.svg'
import Mak from '../../../assets/icons/Mak.svg'
import Kevin from '../../../assets/icons/Kevin.svg'
import Abdeil from '../../../assets/icons/Abdeil.svg'
import RoiCalculatorChart from '../roicalculator/RoiCalculatorChart.client';
import { Input } from '../ui';
import { DesignMode } from './DesignMode';


const words = [
  {
    text: "What",
  },
  {
    text: "can i",
  },
  {
    text: "make",
  },
  {
    text: "for you?",
  }
];

const people = [
  {
    id: 1,
    name: "Greg W",
    designation: "Does Nothing",
    image: Greg,
  },
  {
    id: 2,
    name: "Mak M",
    designation: "Develops Something",
    image: Mak,
  },
  {
    id: 3,
    name: "Kevin S",
    designation: "Markets Something",
    image: Kevin,
  },
  {
    id: 4,
    name: "Abdeil W",
    designation: "AI Consults Something",
    image: Abdeil,
  }
];


const homeList = [
  {
    text: "Human Support",
    to: '#'
  },
  {
    text: "Terms",
    to: "#"
  },
  {
    text: "Privacy",
    to: "#"
  },
  {
    text: "Jobs",
    to: "#"
  }
];

const TEXTAREA_MIN_HEIGHT = 76;

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  onStreamingChange?: (streaming: boolean) => void;
  messages?: Message[];
  description?: string;
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  model?: string;
  setModel?: (model: string) => void;
  provider?: ProviderInfo;
  setProvider?: (provider: ProviderInfo) => void;
  providerList?: ProviderInfo[];
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
  importChat?: (description: string, messages: Message[]) => Promise<void>;
  exportChat?: () => void;
  uploadedFiles?: File[];
  setUploadedFiles?: (files: File[]) => void;
  imageDataList?: string[];
  setImageDataList?: (dataList: string[]) => void;
  actionAlert?: ActionAlert;
  clearAlert?: () => void;
  supabaseAlert?: SupabaseAlert;
  clearSupabaseAlert?: () => void;
  deployAlert?: DeployAlert;
  clearDeployAlert?: () => void;
  data?: JSONValue[] | undefined;
  actionRunner?: ActionRunner;
}

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      onStreamingChange,
      model,
      setModel,
      provider,
      setProvider,
      providerList,
      input = '',
      enhancingPrompt,
      handleInputChange,

      // promptEnhanced,
      enhancePrompt,
      sendMessage,
      handleStop,
      importChat,
      exportChat,
      uploadedFiles = [],
      setUploadedFiles,
      imageDataList = [],
      setImageDataList,
      messages,
      actionAlert,
      clearAlert,
      deployAlert,
      clearDeployAlert,
      supabaseAlert,
      clearSupabaseAlert,
      data,
      actionRunner,
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;
    const [apiKeys, setApiKeys] = useState<Record<string, string>>(getApiKeysFromCookies());
    const [modelList, setModelList] = useState<ModelInfo[]>([]);
    const [isModelSettingsCollapsed, setIsModelSettingsCollapsed] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    const [transcript, setTranscript] = useState('');
    const [isModelLoading, setIsModelLoading] = useState<string | undefined>('all');
    const [progressAnnotations, setProgressAnnotations] = useState<ProgressAnnotation[]>([]);
    const expoUrl = useStore(expoUrlAtom);
    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const isDragging = useRef(false);
    const [isROIOpen, setIsROIOpen] = useState<boolean>(false);
    const [isDesignModeOpen, setIsDesignModeOpen] = useState<boolean>(false);
    


    const [topValue, setTopValue] = useState('57px');



    const topListheader = [
      {
        text: "Pricing",
        to: '#',
        fun: () => "",
      },
      {
        text: "FAQ",
        to: "#",
        fun: () => "",
      },
      {
        text: "Saving Calc",
        to: "/roi-calculator",
        fun: () => setIsROIOpen(true)
      }
    ];

    useEffect(() => {
      const updateTop = () => {
        setTopValue(window.innerWidth > 2200 ? '58px' : '57px');
      };

      updateTop(); // run on mount

      window.addEventListener('resize', updateTop);
      return () => window.removeEventListener('resize', updateTop);
    }, []);

    // 1. helpers ---------------------------------------------------------
    const clamp = (val: number, min: number, max: number) =>
      Math.min(Math.max(val, min), max);

    const setChatWidth = (px: number) => {
      document.documentElement.style.setProperty('--chat-min-width', `${px}px`);
    };

    // 2. handlers --------------------------------------------------------
    const onPointerDown = () => {
      isDragging.current = true;
      document.body.style.cursor = 'e-resize';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;

      const newWidth = clamp(e.clientX, 390, 1000); // ⬅️ your min / max
      setChatWidth(newWidth);
    };

    const onPointerUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
    };

    // 3. add / remove global listeners ----------------------------------
    useEffect(() => {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };
    }, []);

    // me

    useEffect(() => {
      if (expoUrl) {
        setQrModalOpen(true);
      }
    }, [expoUrl]);

    useEffect(() => {
      if (data) {
        const progressList = data.filter(
          (x) => typeof x === 'object' && (x as any).type === 'progress',
        ) as ProgressAnnotation[];
        setProgressAnnotations(progressList);
      }
    }, [data]);
    useEffect(() => {
      console.log(transcript);
    }, [transcript]);

    useEffect(() => {
      onStreamingChange?.(isStreaming);
    }, [isStreaming, onStreamingChange]);

    useEffect(() => {
      if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');

          setTranscript(transcript);

          if (handleInputChange) {
            const syntheticEvent = {
              target: { value: transcript },
            } as React.ChangeEvent<HTMLTextAreaElement>;
            handleInputChange(syntheticEvent);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        setRecognition(recognition);
      }
    }, []);

    useEffect(() => {
      if (typeof window !== 'undefined') {
        let parsedApiKeys: Record<string, string> | undefined = {};

        try {
          parsedApiKeys = getApiKeysFromCookies();
          setApiKeys(parsedApiKeys);
        } catch (error) {
          console.error('Error loading API keys from cookies:', error);
          Cookies.remove('apiKeys');
        }

        setIsModelLoading('all');
        fetch('/api/models')
          .then((response) => response.json())
          .then((data) => {
            const typedData = data as { modelList: ModelInfo[] };
            setModelList(typedData.modelList);
          })
          .catch((error) => {
            console.error('Error fetching model list:', error);
          })
          .finally(() => {
            setIsModelLoading(undefined);
          });
      }
    }, [providerList, provider]);

    const onApiKeysChange = async (providerName: string, apiKey: string) => {
      const newApiKeys = { ...apiKeys, [providerName]: apiKey };
      setApiKeys(newApiKeys);
      Cookies.set('apiKeys', JSON.stringify(newApiKeys));

      setIsModelLoading(providerName);

      let providerModels: ModelInfo[] = [];

      try {
        const response = await fetch(`/api/models/${encodeURIComponent(providerName)}`);
        const data = await response.json();
        providerModels = (data as { modelList: ModelInfo[] }).modelList;
      } catch (error) {
        console.error('Error loading dynamic models for:', providerName, error);
      }

      // Only update models for the specific provider
      setModelList((prevModels) => {
        const otherModels = prevModels.filter((model) => model.provider !== providerName);
        return [...otherModels, ...providerModels];
      });
      setIsModelLoading(undefined);
    };

    const startListening = () => {
      if (recognition) {
        recognition.start();
        setIsListening(true);
      }
    };

    const stopListening = () => {
      if (recognition) {
        recognition.stop();
        setIsListening(false);
      }
    };

    const handleSendMessage = (event: React.UIEvent, messageInput?: string) => {
      if (sendMessage) {
        sendMessage(event, messageInput);

        if (recognition) {
          recognition.abort(); // Stop current recognition
          setTranscript(''); // Clear transcript
          setIsListening(false);

          // Clear the input by triggering handleInputChange with empty value
          if (handleInputChange) {
            const syntheticEvent = {
              target: { value: '' },
            } as React.ChangeEvent<HTMLTextAreaElement>;
            handleInputChange(syntheticEvent);
          }
        }
      }
    };

    const handleFileUpload = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';

      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];

        if (file) {
          const reader = new FileReader();

          reader.onload = (e) => {
            const base64Image = e.target?.result as string;
            setUploadedFiles?.([...uploadedFiles, file]);
            setImageDataList?.([...imageDataList, base64Image]);
          };
          reader.readAsDataURL(file);
        }
      };

      input.click();
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;

      if (!items) {
        return;
      }

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();

          const file = item.getAsFile();

          if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
              const base64Image = e.target?.result as string;
              setUploadedFiles?.([...uploadedFiles, file]);
              setImageDataList?.([...imageDataList, base64Image]);
            };
            reader.readAsDataURL(file);
          }

          break;
        }
      }
    };
    const openSideBar = () => {
      setOpen(!open)
    }

    const baseChat = (
      <div
        ref={ref}
        className={classNames(styles.BaseChat, 'relative flex h-full w-full overflow-hidden')}
        data-chat-visible={showChat}
      >



        <ClientOnly>{() => <Menu setOpen={setOpen} open={open} />}</ClientOnly>
        <div className={`flex flex-col lg:flex-row overflow-y-auto w-full h-full bg-[#E7E2E0]  dark:bg-[#292F35] ${chatStarted ? 'mt-0' : 'p-0'} transition-[margin] duration-[350ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]`} style={{
          marginLeft: open ? '340px' : '0px',
        }}>
          <SparkTooltip content={open ? `Close Panel` : `Open Panel`} side="right">
            <div className={`px-2.6 py-1 ${!chatStarted && 'z-99'} hover:bg-[#4B525B] transition-colors duration-[250ms] rounded-md invert-100 dark:invert-0 text-xl ml-3 mt-4 text-white cursor-pointer absolute ${open && 'bg-[#4B525B]'}`} onClick={openSideBar}>
              <img src={layoutLine} alt="sidebar_list" />
            </div>
          </SparkTooltip>

          <div
            className={classNames(
              styles.Chat,
              `flex flex-col ${chatStarted && 'bg-[#EFEAE6] dark:bg-[#1d2125] border border-[#c9c5c3] dark:border-[#4B525B]'} flex-grow ${chatStarted
                ? 'lg:min-w-[var(--chat-min-width)] lg:max-w-[var(--chat-min-width)] fixed bottom-[1.2rem] z-4 rounded-tl-md rounded-l-md rounded-tr-none rounded-r-none rounded-b-none overflow-hidden'
                : 'rounded-md lg:min-w-[40rem]'
              }`
            )}
            style={{ top: topValue }}
          >

            {
              !chatStarted ?
                <BackgroundLines className='bg-[#EFEAE6] dark:bg-[#1d2125] rounded-md border border-[#c9c5c3] dark:border-[#4B525B]'>

                  {!chatStarted && (
                    <div id="intro" className="mt-[24vh] max-w-[35rem] mx-auto text-center px-4 lg:px-0">
                      <TypewriterEffectSmooth words={words} />

                      <p className="text-md lg:text-[18px] mb-8 text-bolt-elements-textSecondary animate-fade-in animation-delay-200">
                        bring ideas to life in seconds or get help on existing projects.
                      </p>
                      <BrowserUnsupportedPopup />
                      <CookiePopup />
                      <RoiCalculatorChart setIsROIOpen={setIsROIOpen} isROIOpen={isROIOpen} />
                    </div>
                  )}

                  <StickToBottom
                    className={classNames('pt-0 px-2 sm:px-2 relative ', {
                      'h-full flex flex-col modern-scrollbar  relative': chatStarted,
                    })}
                    resize="smooth"
                    initial="smooth"
                  >



                    <StickToBottom.Content className="flex flex-col gap-4">
                      <ClientOnly>
                        {() => {
                          return chatStarted ? (
                            <Messages
                              className="flex flex-col w-full flex-1 max-w-chat pb-6 mx-auto z-1"
                              messages={messages}
                              isStreaming={isStreaming}
                            />
                          ) : null;
                        }}
                      </ClientOnly>
                    </StickToBottom.Content>
                    <div
                      className={classNames(`my-auto flex flex-col gap-2 w-full max-w-[42rem] mx-auto z-prompt mb-0 bg-[#d8cdc9] dark:bg-[#16191C] pt-2.5 pb-1.5 px-2.5 rounded-lg`, {
                        'sticky bottom-2 ': chatStarted,
                      })}
                    >
                      <div className="flex flex-col gap-2">
                        {deployAlert && (
                          <DeployChatAlert
                            alert={deployAlert}
                            clearAlert={() => clearDeployAlert?.()}
                            postMessage={(message: string | undefined) => {
                              sendMessage?.({} as any, message);
                              clearSupabaseAlert?.();
                            }}
                          />
                        )}
                        {supabaseAlert && (
                          <SupabaseChatAlert
                            alert={supabaseAlert}
                            clearAlert={() => clearSupabaseAlert?.()}
                            postMessage={(message) => {
                              sendMessage?.({} as any, message);
                              clearSupabaseAlert?.();
                            }}
                          />
                        )}
                        {actionAlert && (
                          <ChatAlert
                            alert={actionAlert}
                            clearAlert={() => clearAlert?.()}
                            postMessage={(message) => {
                              sendMessage?.({} as any, message);
                              clearAlert?.();
                            }}
                          />
                        )}
                      </div>
                      <ScrollToBottom />
                      {progressAnnotations && <ProgressCompilation data={progressAnnotations} />}
                      <div
                        className={classNames(
                          'relative bg-[#FAF7F5] dark:bg-[#292e35] p-0 rounded-lg p-[1px] relative w-full max-w-[40rem] mx-auto z-prompt',

                          /*
                           * {
                           *   'sticky bottom-2': chatStarted,
                           * },
                           */
                        )}
                      >

                        <div>
                          <ClientOnly>
                            {() => (
                              <div className={!isModelSettingsCollapsed ? 'flex absolute -bottom-35  flex-col w-full left-1/2 transform -translate-x-1/2' : ''}>
                                <ModelSelector
                                  key={provider?.name + ':' + modelList.length}
                                  model={model}
                                  setModel={setModel}
                                  modelList={modelList}
                                  provider={provider}
                                  setProvider={setProvider}
                                  providerList={providerList || (PROVIDER_LIST as ProviderInfo[])}
                                  apiKeys={apiKeys}
                                  modelLoading={isModelLoading}
                                />
                                {(providerList || []).length > 0 &&
                                  provider &&
                                  (!LOCAL_PROVIDERS.includes(provider.name) || 'OpenAILike') && (
                                    <APIKeyManager
                                      provider={provider}
                                      apiKey={apiKeys[provider.name] || ''}
                                      setApiKey={(key) => {
                                        onApiKeysChange(provider.name, key);
                                      }}
                                    />
                                  )}
                              </div>
                            )}
                          </ClientOnly>
                        </div>
                        <FilePreview
                          files={uploadedFiles}
                          imageDataList={imageDataList}
                          onRemove={(index) => {
                            setUploadedFiles?.(uploadedFiles.filter((_, i) => i !== index));
                            setImageDataList?.(imageDataList.filter((_, i) => i !== index));
                          }}
                        />
                        <ClientOnly>
                          {() => (
                            <ScreenshotStateManager
                              setUploadedFiles={setUploadedFiles}
                              setImageDataList={setImageDataList}
                              uploadedFiles={uploadedFiles}
                              imageDataList={imageDataList}
                            />
                          )}
                        </ClientOnly>
                        <div
                          className={classNames(
                            'relative shadow-xs backdrop-blur rounded-lg border-bolt-elements-borderColor',
                          )}
                        >
                          <GlowingEffect
                            spread={40}
                            glow={true}
                            disabled={false}
                            proximity={64}
                            inactiveZone={0.01}
                          />
                          <textarea
                            ref={textareaRef}
                            className={classNames(
                              'w-full pl-2.5 pt-2.5 pr-2.5 outline-none resize-none text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent text-sm ',
                              'transition-all duration-200',
                              'hover:border-bolt-elements-focus ',
                            )}
                            onDragEnter={(e) => {
                              e.preventDefault();
                              e.currentTarget.style.border = '2px solid #1488fc';
                            }}
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.style.border = '2px solid #1488fc';
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              e.currentTarget.style.border = '1px solid var(--bolt-elements-borderColor)';
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.style.border = '1px solid var(--bolt-elements-borderColor)';

                              const files = Array.from(e.dataTransfer.files);
                              files.forEach((file) => {
                                if (file.type.startsWith('image/')) {
                                  const reader = new FileReader();

                                  reader.onload = (e) => {
                                    const base64Image = e.target?.result as string;
                                    setUploadedFiles?.([...uploadedFiles, file]);
                                    setImageDataList?.([...imageDataList, base64Image]);
                                  };
                                  reader.readAsDataURL(file);
                                }
                              });
                            }}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                if (event.shiftKey) {
                                  return;
                                }

                                event.preventDefault();

                                if (isStreaming) {
                                  handleStop?.();
                                  return;
                                }

                                // ignore if using input method engine
                                if (event.nativeEvent.isComposing) {
                                  return;
                                }

                                handleSendMessage?.(event);
                              }
                            }}
                            value={input}
                            onChange={(event) => {
                              handleInputChange?.(event);
                            }}
                            onPaste={handlePaste}
                            style={{
                              minHeight: TEXTAREA_MIN_HEIGHT,
                              maxHeight: TEXTAREA_MAX_HEIGHT,
                            }}
                            placeholder="Ask blake to build your enterprise app, data dashboard, or a saas landing page..."
                            translate="no"
                          />
                          {/* <ClientOnly>
                      {() => (
                        <SendButton
                          show={input.length >= 0 || isStreaming || uploadedFiles.length > 0}
                          isStreaming={isStreaming}
                          disabled={!providerList || providerList.length === 0}
                          onClick={(event) => {
                            if (isStreaming) {
                              handleStop?.();
                              return;
                            }

                            if (input.length > 0 || uploadedFiles.length > 0) {
                              handleSendMessage?.(event);
                            }
                          }}
                        />
                      )}
                    </ClientOnly> */}
                          <div className="flex justify-between items-center text-sm rounded-bl-lg rounded-br-lg  p-2.5">

                            <div className="flex gap-0 items-center">
                              <div className='py-1 pr-[6px]'>
                                <FrameworkDropdown />
                              </div>
                              <IconButton className="transition-all px-[6px]" onClick={() => handleFileUpload()}>
                                <div className='bg-[#E7E2E0] dark:bg-[#4B525B] dark:hover:bg-[#4b525bd1] p-2 rounded-md'>
                                  <SparkTooltip content="Attach figma files, screenshots, etc." side='bottom'>
                                    <img src={attachmentIcon} alt="" className='invert-100 dark:invert-0 w-[16px] h-[16px]' />
                                  </SparkTooltip>
                                </div>
                              </IconButton>
                              <SpeechRecognitionButton
                                isListening={isListening}
                                onStart={startListening}
                                onStop={stopListening}
                                disabled={isStreaming}
                              />
                              {/* <IconButton
                                title="Enhance prompt"
                                disabled={input.length === 0 || enhancingPrompt}
                                className={classNames('transition-all', enhancingPrompt ? 'opacity-100' : '')}
                                onClick={() => {
                                  enhancePrompt?.();
                                  toast.success('Prompt enhanced!');
                                }}
                              >
                                {enhancingPrompt ? (
                                  <div className="i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress text-xl animate-spin"></div>
                                ) : (
                                  <SparkTooltip content="Enhance prompt" side='bottom'>
                                    <img src={sparkIcon} alt="" className='invert-100 dark:invert-0' />
                                  </SparkTooltip>
                                )}
                              </IconButton> */}


                              {/* {chatStarted && <ClientOnly>{() => <ExportChatButton exportChat={exportChat} />}</ClientOnly>} */}
                              {/* <IconButton
                          title="Model Settings"
                          className={classNames('transition-all flex items-center gap-1', {
                            'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent':
                              isModelSettingsCollapsed,
                            'bg-bolt-elements-item-backgroundDefault text-bolt-elements-item-contentDefault':
                              !isModelSettingsCollapsed,
                          })}
                          onClick={() => setIsModelSettingsCollapsed(!isModelSettingsCollapsed)}
                          disabled={!providerList || providerList.length === 0}
                        >
                          <div className={`i-ph:caret-${isModelSettingsCollapsed ? 'right' : 'down'} text-lg`} />
                          {isModelSettingsCollapsed ? <span className="text-xs">{model}</span> : <span />}
                        </IconButton> */}

                            </div>
                            {/* {input.length > 3 ? (
                        <div className="text-xs text-bolt-elements-textTertiary">
                          Use <kbd className="kdb px-1.5 py-0.5 rounded bg-bolt-elements-background-depth-2">Shift</kbd>{' '}
                          + <kbd className="kdb px-1.5 py-0.5 rounded bg-bolt-elements-background-depth-2">Return</kbd>{' '}
                          a new line
                        </div>
                      ) : null} */}
                            {/* <SupabaseConnection /> */}
                            <ClientOnly>
                              {() => (
                                <SendButton
                                  show={input.length >= 0 || isStreaming || uploadedFiles.length > 0}
                                  isStreaming={isStreaming}
                                  disabled={!providerList || providerList.length === 0}
                                  input={input}
                                  onClick={(event) => {
                                    if (isStreaming) {
                                      handleStop?.();
                                      return;
                                    }

                                    if (input.length > 0 || uploadedFiles.length > 0) {
                                      handleSendMessage?.(event);
                                    }
                                  }}
                                />
                              )}
                            </ClientOnly>
                            <ExpoQrModal open={qrModalOpen} onClose={() => setQrModalOpen(false)} />
                          </div>
                        </div>

                      </div>
                      <div className='w-full px-[20px] pb-2.5 text-black dark:text-white bg-[#d8cdc9] dark:bg-[#16191C] flex items-center justify-between'>
                        <p className='underline text-[14px]  cursor-pointer'>Prompt Library</p>
                        <img src={addFill} alt="plus" className='cursor-pointer invert-100 dark:invert-0' />
                      </div>
                    </div>
                  </StickToBottom>
                  <div className="flex flex-col justify-center">
                    {/* {!chatStarted && (
                <div className="flex justify-center gap-2">
                  {ImportButtons(importChat)}
                  <GitCloneButton importChat={importChat} />
                </div>
              )} */}
                    <div className="flex flex-col gap-5">
                      {!chatStarted &&
                        ExamplePrompts((event, messageInput) => {
                          if (isStreaming) {
                            handleStop?.();
                            return;
                          }

                          handleSendMessage?.(event, messageInput);
                        })}
                      {/* {!chatStarted && <StarterTemplates />} */}
                    </div>
                  </div>

                  <div className='absolute bottom-5 left-5'>
                    <div className='flex items-center'>
                      <img src={blakeBill} alt="blakebill" className='invert-100 dark:invert-0' />
                    </div>
                  </div>
                  <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-black dark:text-white flex gap-3 text-[14px]">
                    {homeList.map((item, index) => (
                      <React.Fragment key={item.to}>
                        <a href={item.to} className="px-5 hover:underline">{item.text}</a>
                        {index < homeList.length - 1 && (
                          <span className="flex items-center justify-center text-[#4B525B]">|</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className='absolute right-8 bottom-5 flex items-center gap-6 text-black dark:text-white '>
                    <img src={threadIcon} alt="threadIcon" className='cursor-pointer invert-100 dark:invert-0' />
                    <img src={youtubeIcon} alt="youtubeIcon" className='cursor-pointer invert-100 dark:invert-0' />
                    <img src={instagramIcon} alt="instragmIcon" className='cursor-pointer invert-100 dark:invert-0' />
                    <img src={linkedinIcon} alt="linkedinIcon" className='cursor-pointer invert-100 dark:invert-0' />
                  </div>
                  <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex items-center text-black dark:text-white text-[14px]">
                    {topListheader.map((item, index) => (
                      <React.Fragment key={item.to}>
                        <p onClick={() => item.fun()} key={item.to} className="px-5 hover:underline cursor-pointer">{item.text}</p>
                        {index < topListheader.length - 1 && (
                          <span className="flex items-center justify-center text-[#4B525B]">|</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </BackgroundLines> : <>{!chatStarted && (
                  <div id="intro" className="mt-[24vh] max-w-chat mx-auto text-center px-4 lg:px-0">
                    <TypewriterEffectSmooth words={words} />

                    <p className=" tracking-[1px] text-md lg:text-[18px] mb-8 text-bolt-elements-textSecondary animate-fade-in animation-delay-200">
                      bring ideas to life in seconds or get help on existing projects.
                    </p>
                    <BrowserUnsupportedPopup />
                  </div>
                )}
                  {/* this */}

                  {
                    !isDesignModeOpen ? <StickToBottom
                      className={classNames('pt-[2px] relative', {
                        'h-full flex flex-col modern-scrollbar  relative': chatStarted,
                      })}
                      resize="smooth"
                      initial="smooth"
                    >
                      {chatStarted && <div className='px-2 w-full min-h-11.7 z-2 flex items-center border-b border-bolt-elements-borderColor bg-[#EFEAE6] dark:bg-[#1D2125]'>
                        <SparkTooltip content="Open Panel">
                          <div onClick={openSideBar} className={`cursor-pointer ${open && 'bg-[#4B525B]'}  ease-in-out px-3 py-1 hover:bg-[#4B525B] rounded-md invert-100 dark:invert-0`}>
                            <img src={layoutLine} alt="layoutLine" />
                          </div>
                        </SparkTooltip>
                        <SparkTooltip content="Chat Mode">
                          <div className='cursor-pointer hover:bg-[#4B525B] px-3 py-1 rounded-md invert-100 dark:invert-0'>
                            <img src={chatLine} alt="chat-line" />
                          </div>
                        </SparkTooltip>
                        <SparkTooltip content="Design Mode">
                          <div className='cursor-pointer hover:bg-[#4B525B] px-3 py-1 rounded-md invert-100 dark:invert-0'
                            onClick={() => setIsDesignModeOpen(true)}
                          >
                            <img src={paintBrush} alt="paint-brush" />
                          </div>
                        </SparkTooltip>
                      </div>}

                      <></>

                      {chatStarted && <div className=' px-2 w-full min-h-10 z-2 flex items-center border-b border-bolt-elements-borderColor bg-[#EFEAE6] dark:bg-[#1D2125] text-bolt-elements-textPrimary text-sm shadow-[-13px_24px_19px_0px_#efeae6]  dark:shadow-[-13px_24px_19px_0px_#1D2125]'>
                        <ClientOnly>{() => <ChatDescription />}</ClientOnly>
                      </div>}

                      <StickToBottom.Content className="flex flex-col gap-4 mt-2">
                        <ClientOnly>
                          {() => {
                            return chatStarted ? (
                              <Messages
                                className="flex flex-col w-full flex-1 max-w-chat pb-6 mx-auto z-1"
                                messages={messages}
                                isStreaming={isStreaming}
                              />
                            ) : null;
                          }}
                        </ClientOnly>
                      </StickToBottom.Content>

                      <div
                        className={classNames('my-auto flex flex-col gap-2 w-full  mx-auto z-prompt mb-0', {
                          'sticky bottom-0': chatStarted,
                        })}
                      >
                        <div className="flex flex-col gap-2">
                          {deployAlert && (
                            <DeployChatAlert
                              alert={deployAlert}
                              clearAlert={() => clearDeployAlert?.()}
                              postMessage={(message: string | undefined) => {
                                sendMessage?.({} as any, message);
                                clearSupabaseAlert?.();
                              }}
                            />
                          )}
                          {supabaseAlert && (
                            <SupabaseChatAlert
                              alert={supabaseAlert}
                              clearAlert={() => clearSupabaseAlert?.()}
                              postMessage={(message) => {
                                sendMessage?.({} as any, message);
                                clearSupabaseAlert?.();
                              }}
                            />
                          )}
                          {actionAlert && (
                            <ChatAlert
                              alert={actionAlert}
                              clearAlert={() => clearAlert?.()}
                              postMessage={(message) => {
                                sendMessage?.({} as any, message);
                                clearAlert?.();
                              }}
                            />
                          )}
                        </div>
                        <ScrollToBottom />
                        {progressAnnotations && <ProgressCompilation data={progressAnnotations} />}
                        <div
                          className={classNames(
                            'relative bg-[#FAF7F5] dark:bg-[#292e35] p-0  border border-bolt-elements-borderColor rounded-lb-md relative w-full max-w-[40rem] mx-auto z-prompt',

                            /*
                             * {
                             *   'sticky bottom-2': chatStarted,
                             * },
                             */
                          )}
                        >
                          {/* <svg className={classNames(styles.PromptEffectContainer)}>
                    <defs>
                      <linearGradient
                        id="line-gradient"
                        x1="20%"
                        y1="0%"
                        x2="-14%"
                        y2="10%"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="rotate(-45)"
                      >
                        <stop offset="0%" stopColor="#b44aff" stopOpacity="0%"></stop>
                        <stop offset="40%" stopColor="#b44aff" stopOpacity="80%"></stop>
                        <stop offset="50%" stopColor="#b44aff" stopOpacity="80%"></stop>
                        <stop offset="100%" stopColor="#b44aff" stopOpacity="0%"></stop>
                      </linearGradient>
                      <linearGradient id="shine-gradient">
                        <stop offset="0%" stopColor="white" stopOpacity="0%"></stop>
                        <stop offset="40%" stopColor="#ffffff" stopOpacity="80%"></stop>
                        <stop offset="50%" stopColor="#ffffff" stopOpacity="80%"></stop>
                        <stop offset="100%" stopColor="white" stopOpacity="0%"></stop>
                      </linearGradient>
                    </defs>
                    <rect className={classNames(styles.PromptEffectLine)} pathLength="100" strokeLinecap="round"></rect>
                    <rect className={classNames(styles.PromptShine)} x="48" y="24" width="70" height="1"></rect>
                  </svg> */}
                          <div>
                            <ClientOnly>
                              {() => (
                                <div className={!isModelSettingsCollapsed ? 'hidden' : ''}>
                                  <ModelSelector
                                    key={provider?.name + ':' + modelList.length}
                                    model={model}
                                    setModel={setModel}
                                    modelList={modelList}
                                    provider={provider}
                                    setProvider={setProvider}
                                    providerList={providerList || (PROVIDER_LIST as ProviderInfo[])}
                                    apiKeys={apiKeys}
                                    modelLoading={isModelLoading}
                                  />
                                  {(providerList || []).length > 0 &&
                                    provider &&
                                    (!LOCAL_PROVIDERS.includes(provider.name) || 'OpenAILike') && (
                                      <APIKeyManager
                                        provider={provider}
                                        apiKey={apiKeys[provider.name] || ''}
                                        setApiKey={(key) => {
                                          onApiKeysChange(provider.name, key);
                                        }}
                                      />
                                    )}
                                </div>
                              )}
                            </ClientOnly>
                          </div>
                          <FilePreview
                            files={uploadedFiles}
                            imageDataList={imageDataList}
                            onRemove={(index) => {
                              setUploadedFiles?.(uploadedFiles.filter((_, i) => i !== index));
                              setImageDataList?.(imageDataList.filter((_, i) => i !== index));
                            }}
                          />
                          <ClientOnly>
                            {() => (
                              <ScreenshotStateManager
                                setUploadedFiles={setUploadedFiles}
                                setImageDataList={setImageDataList}
                                uploadedFiles={uploadedFiles}
                                imageDataList={imageDataList}
                              />
                            )}
                          </ClientOnly>
                          <div
                            className={classNames(`relative  backdrop-blur ${!chatStarted ? 'rounded-lg' : 'rounded-lb-md shadow-[0px_0px_40px_50px_#efeae6] dark:shadow-[0px_0px_40px_50px_#1D2125]'}`,)} >
                            <GlowingEffect
                              spread={40}
                              glow={true}
                              disabled={false}
                              proximity={64}
                              inactiveZone={0.01}
                            />
                            <textarea
                              ref={textareaRef}
                              className={classNames(
                                'w-full pl-4 pt-4 pr-4 outline-none resize-none text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent text-sm ',
                                'transition-all duration-200',
                                'hover:border-bolt-elements-focus',
                              )}
                              onDragEnter={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.border = '2px solid #1488fc';
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.border = '2px solid #1488fc';
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.border = '1px solid var(--bolt-elements-borderColor)';
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.border = '1px solid var(--bolt-elements-borderColor)';

                                const files = Array.from(e.dataTransfer.files);
                                files.forEach((file) => {
                                  if (file.type.startsWith('image/')) {
                                    const reader = new FileReader();

                                    reader.onload = (e) => {
                                      const base64Image = e.target?.result as string;
                                      setUploadedFiles?.([...uploadedFiles, file]);
                                      setImageDataList?.([...imageDataList, base64Image]);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                });
                              }}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                  if (event.shiftKey) {
                                    return;
                                  }

                                  event.preventDefault();

                                  if (isStreaming) {
                                    handleStop?.();
                                    return;
                                  }

                                  // ignore if using input method engine
                                  if (event.nativeEvent.isComposing) {
                                    return;
                                  }

                                  handleSendMessage?.(event);
                                }
                              }}
                              value={input}
                              onChange={(event) => {
                                handleInputChange?.(event);
                              }}
                              onPaste={handlePaste}
                              style={{
                                minHeight: TEXTAREA_MIN_HEIGHT,
                                maxHeight: TEXTAREA_MAX_HEIGHT,
                              }}
                              placeholder="Ask blake to build your enterprise app, data dashboard, or a saas landing page..."
                              translate="no"
                            />
                            {/* <ClientOnly>
                      {() => (
                        <SendButton
                          show={input.length >= 0 || isStreaming || uploadedFiles.length > 0}
                          isStreaming={isStreaming}
                          disabled={!providerList || providerList.length === 0}
                          onClick={(event) => {
                            if (isStreaming) {
                              handleStop?.();
                              return;
                            }

                            if (input.length > 0 || uploadedFiles.length > 0) {
                              handleSendMessage?.(event);
                            }
                          }}
                        />
                      )}
                    </ClientOnly> */}
                            <div className="flex justify-between items-center text-sm p-4 pt-2">
                              <div className="flex gap-0 items-center">
                                <IconButton className="transition-all" onClick={() => handleFileUpload()}>
                                  <div className='bg-[#E7E2E0] dark:bg-[#4B525B] p-2 rounded-md'>
                                    <SparkTooltip content="Attach figma files, screenshots, etc." side='bottom'>
                                      <img src={attachmentIcon} alt="" className='invert-100 dark:invert-0 w-[16px] h-[16px]' />
                                    </SparkTooltip>
                                  </div>
                                </IconButton>
                                <SpeechRecognitionButton
                                  isListening={isListening}
                                  onStart={startListening}
                                  onStop={stopListening}
                                  disabled={isStreaming}
                                />
                                {/* <IconButton
                                disabled={input.length === 0 || enhancingPrompt}
                                className={classNames('transition-all', enhancingPrompt ? 'opacity-100' : '')}
                                onClick={() => {
                                  enhancePrompt?.();
                                  toast.success('Prompt enhanced!');
                                }}
                              >
                                {enhancingPrompt ? (
                                  <div className="i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress text-xl animate-spin"></div>
                                ) : (
                                  <SparkTooltip content="Enhance prompt" side='bottom'>
                                    <img src={sparkIcon} alt="" className='invert-100 dark:invert-0' />
                                  </SparkTooltip>
                                )}
                              </IconButton> */}


                                {/* {chatStarted && <ClientOnly>{() => <ExportChatButton exportChat={exportChat} />}</ClientOnly>} */}
                                {/* <IconButton
                          title="Model Settings"
                          className={classNames('transition-all flex items-center gap-1', {
                            'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent':
                              isModelSettingsCollapsed,
                            'bg-bolt-elements-item-backgroundDefault text-bolt-elements-item-contentDefault':
                              !isModelSettingsCollapsed,
                          })}
                          onClick={() => setIsModelSettingsCollapsed(!isModelSettingsCollapsed)}
                          disabled={!providerList || providerList.length === 0}
                        >
                          <div className={`i-ph:caret-${isModelSettingsCollapsed ? 'right' : 'down'} text-lg`} />
                          {isModelSettingsCollapsed ? <span className="text-xs">{model}</span> : <span />}
                        </IconButton> */}

                              </div>
                              {/* {input.length > 3 ? (
                        <div className="text-xs text-bolt-elements-textTertiary">
                          Use <kbd className="kdb px-1.5 py-0.5 rounded bg-bolt-elements-background-depth-2">Shift</kbd>{' '}
                          + <kbd className="kdb px-1.5 py-0.5 rounded bg-bolt-elements-background-depth-2">Return</kbd>{' '}
                          a new line
                        </div>
                      ) : null} */}
                              {/* <SupabaseConnection /> */}
                              <ClientOnly>
                                {() => (
                                  <SendButton
                                    show={input.length >= 0 || isStreaming || uploadedFiles.length > 0}
                                    isStreaming={isStreaming}
                                    disabled={!providerList || providerList.length === 0}
                                    input={input}
                                    onClick={(event) => {
                                      if (isStreaming) {
                                        handleStop?.();
                                        return;
                                      }

                                      if (input.length > 0 || uploadedFiles.length > 0) {
                                        handleSendMessage?.(event);
                                      }
                                    }}
                                  />
                                )}
                              </ClientOnly>
                              <ExpoQrModal open={qrModalOpen} onClose={() => setQrModalOpen(false)} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </StickToBottom> : (

                      <>
                        {chatStarted && <div className='px-2 w-full min-h-11.7 z-2 flex items-center border-b border-bolt-elements-borderColor bg-[#EFEAE6] dark:bg-[#1D2125]'>
                          <SparkTooltip content="Open Panel">
                            <div onClick={openSideBar} className={`cursor-pointer ${open && 'bg-[#4B525B]'}  ease-in-out px-3 py-1 hover:bg-[#4B525B] rounded-md invert-100 dark:invert-0`}>
                              <img src={layoutLine} alt="layoutLine" />
                            </div>
                          </SparkTooltip>
                          <SparkTooltip content="Chat Mode">
                            <div className='cursor-pointer hover:bg-[#4B525B] px-3 py-1 rounded-md invert-100 dark:invert-0'>
                              <img src={chatLine} alt="chat-line" />
                            </div>
                          </SparkTooltip>
                          <SparkTooltip content="Design Mode">
                            <div className='cursor-pointer hover:bg-[#4B525B] px-3 py-1 rounded-md invert-100 dark:invert-0'
                              onClick={() => setIsDesignModeOpen(false)}
                            >
                              <img src={paintBrush} alt="paint-brush" />
                            </div>
                          </SparkTooltip>
                        </div>}
                        <p className='p-4 text-white'>Design Mode</p>

                        <DesignMode />
                      </>


                    )
                  }










                  <div className="flex flex-col justify-center">
                    {/* {!chatStarted && (
                <div className="flex justify-center gap-2">
                  {ImportButtons(importChat)}
                  <GitCloneButton importChat={importChat} />
                </div>
              )} */}
                    <div className="flex flex-col gap-5">
                      {!chatStarted &&
                        ExamplePrompts((event, messageInput) => {
                          if (isStreaming) {
                            handleStop?.();
                            return;
                          }

                          handleSendMessage?.(event, messageInput);
                        })}
                      {/* {!chatStarted && <StarterTemplates />} */}
                    </div>
                  </div></>
            }

          </div>

          {
            chatStarted && <div
              onPointerDown={onPointerDown}
              style={{ touchAction: 'none', userSelect: 'none' }}
              className={` ${open ? 'hidden' : 'flex'} fixed top-[55px] right-0 left-[var(--chat-min-width)] w-[6px] ml-[6px] cursor-e-resize bg-transparent hover:bg-gray-400/40 bottom-[1.2rem]transition-colors z-[9999] h-[91.3vh]`} />
          }

          <ClientOnly>
            {() => (
              <Workbench
                actionRunner={actionRunner ?? ({} as ActionRunner)}
                chatStarted={chatStarted}
                isStreaming={isStreaming}
              />
            )}
          </ClientOnly>
        </div>
      </div>
    );

    return <Tooltip.Provider delayDuration={200}>{baseChat}</Tooltip.Provider>;
  },
);

function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      <SparkTooltip content="Jump to Recent">
        <div className="absolute inset-x-0 bottom-40 z-50 flex justify-center pointer-events-none">
          <button
            className="pointer-events-auto cursor-pointer dark:bg-gray-800 px-3 w-10 py-2 rounded-md text-white tracking-wider shadow-xl animate-bounce hover:animate-none"
            onClick={() => scrollToBottom()}
          >
            <svg
              className="w-4 h-4"
              stroke="#00d5bf"
              strokeWidth="2"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
          </button>
        </div>
      </SparkTooltip>
    )
  );
}
