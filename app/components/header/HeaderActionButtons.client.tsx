import { useStore } from '@nanostores/react';
import useViewport from '~/lib/hooks';
import { chatStore } from '~/lib/stores/chat';
import { netlifyConnection } from '~/lib/stores/netlify';
import { vercelConnection } from '~/lib/stores/vercel';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { streamingState } from '~/lib/stores/streaming';
import { NetlifyDeploymentLink } from '~/components/chat/NetlifyDeploymentLink.client';
import { VercelDeploymentLink } from '~/components/chat/VercelDeploymentLink.client';
import { useVercelDeploy } from '~/components/deploy/VercelDeploy.client';
import { useNetlifyDeploy } from '~/components/deploy/NetlifyDeploy.client';

// icons
import settingIcon from '../../../icons/settings-6-line.svg'
import downloadLine from '../../../icons/download-2-line.svg'
import cloudDown from '../../../icons/download-cloud-2-line.svg'
import githutIcon from '../../../icons/github-icon.svg'

import { useToast } from "@/lib/context/ToastProvider";
import { PushToGitHubDialog } from '~/components/@settings/tabs/connections/components/PushToGitHubDialog';

import { motion } from 'framer-motion';

interface HeaderActionButtonsProps { }

export function HeaderActionButtons({ }: HeaderActionButtonsProps) {
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const { showChat } = useStore(chatStore);
  const netlifyConn = useStore(netlifyConnection);
  const vercelConn = useStore(vercelConnection);
  const [activePreviewIndex] = useState(0);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[activePreviewIndex];
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployingTo, setDeployingTo] = useState<'netlify' | 'vercel' | null>(null);
  const isSmallViewport = useViewport(1024);
  const canHideChat = showWorkbench || !showChat;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isStreaming = useStore(streamingState);
  const { handleVercelDeploy } = useVercelDeploy();
  const { handleNetlifyDeploy } = useNetlifyDeploy();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onVercelDeploy = async () => {
    setIsDeploying(true);
    setDeployingTo('vercel');

    try {
      await handleVercelDeploy();
    } finally {
      setIsDeploying(false);
      setDeployingTo(null);
    }
  };

  const onNetlifyDeploy = async () => {
    setIsDeploying(true);
    setDeployingTo('netlify');

    try {
      await handleNetlifyDeploy();
    } finally {
      setIsDeploying(false);
      setDeployingTo(null);
    }
  };

  const onDownload = () => {
    workbenchStore.downloadZip();
  };

  const handleSyncFiles = useCallback(async () => {
    setIsSyncing(true);

    try {
      const directoryHandle = await window.showDirectoryPicker();
      await workbenchStore.syncFiles(directoryHandle);
      showToast({
        title: "Files synced successfully",
        description: 'Sucess',
      });
    } catch (error) {
      showToast({
        title: "Failed to Sync",
        description: error.message,
        type: "error"
      })
    } finally {
      setIsSyncing(false);
    }
  }, [])

  function updateChatMestaData(arg0: any) {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="flex">

      <div className="relative" ref={dropdownRef}>
        <div className="flex gap-[10px] rounded-md overflow-hidden mr-1.5 text-sm">

          <Button
            active
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="pl-4 pr-2 py-1.6 bg-transparent border dark:border-[#4B525B] rounded-md dark:bg-[#292F35] dark:text-white  dark:hover:bg-[#4A515A] tranisition-colors duration-[250ms] flex items-center gap-2.5"
          >
            <img src={settingIcon} alt="depoly-icon" className='w-5 invert-50 dark:invert-0' />
           <span className='text-black dark:text-white'>{'Options'}</span> 
           <div className='w-[1px] h-4 bg-[#4B525B]'></div>
            <div
              className={classNames('i-ph:caret-down w-4 h-4 transition-transform dark:text-white text-black', isDropdownOpen ? 'rotate-180' : '')}
            />
          </Button>
        </div>
        {isDropdownOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }} className="absolute right-0 flex flex-col gap-1 z-50 p-3 mt-1 min-w-[20rem] bg-bolt-elements-background-depth-2 rounded-md shadow-lg bg-bolt-elements-backgroundDefault border border-bolt-elements-borderColor">
            <Button
              active
              onClick={() => {
                onDownload();
                setIsDropdownOpen(false);
              }}
              className="flex bg-transparent items-center w-full px-4 py-2.5 text-sm text-sm  hover:bg-bolt-elements-item-backgroundActive gap-2 rounded-md"
            >
              <img src={downloadLine} className="w-5 h-5 invert-100 dark:invert-0" alt="GitHub" />
              <span className="text-[14px] text-black dark:text-white">Download Code</span>
            </Button>
            <Button
              active
              onClick={handleSyncFiles}
              className="flex bg-transparent items-center w-full px-4 py-2.5 text-sm hover:bg-bolt-elements-item-backgroundActive gap-2 rounded-md"
            >
              <img src={cloudDown} className="w-5 h-5 invert-100 dark:invert-0" alt="GitHub" />
              <span className="text-[14px] text-black dark:text-white">{isSyncing ? 'Syncing...' : 'Sync Files'}</span>
            </Button>
            <Button
              active
              onClick={() => {
                setIsPushDialogOpen(true)
                setIsDropdownOpen(false);
              }}
              className="flex bg-transparent items-center w-full px-4 py-2.5 text-sm hover:bg-bolt-elements-item-backgroundActive gap-2 rounded-md"
            >
              <img src={githutIcon} className="w-5 h-5 invert-100 dark:invert-0" alt="GitHub" />
              <span className="text-[14px] text-black dark:text-white">Push to Github</span>
            </Button>
            <div className="h-px bg-bolt-elements-borderColor my-1 mx-2" />
            <Button
              active
              onClick={() => {
                onNetlifyDeploy();
                setIsDropdownOpen(false);
              }}
              disabled={isDeploying || !activePreview || !netlifyConn.user}
              className="flex items-center w-full px-4 py-2.5 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive gap-2 rounded-md group relative"
            >
              <img
                className="w-5 h-5"
                height="24"
                width="24"
                crossOrigin="anonymous"
                src="https://cdn.simpleicons.org/netlify"
              />
              <span className="ml-2 text-[14px]">
                {!netlifyConn.user ? 'No Netlify Account Connected' : 'Deploy to Netlify'}
              </span>
              {netlifyConn.user && <NetlifyDeploymentLink />}
            </Button>
            <Button
              active
              onClick={() => {
                onVercelDeploy();
                setIsDropdownOpen(false);
              }}
              disabled={isDeploying || !activePreview || !vercelConn.user}
              className="flex items-center w-full px-4 py-2.5 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive gap-2 rounded-md group relative"
            >
              <img
                className="w-5 h-5 bg-black p-1 rounded"
                height="24"
                width="24"
                crossOrigin="anonymous"
                src="https://cdn.simpleicons.org/vercel/white"
                alt="vercel"
              />
              <span className="ml-2 text-[14px]">{!vercelConn.user ? 'No Vercel Account Connected' : 'Deploy to Vercel'}</span>
              {vercelConn.user && <VercelDeploymentLink />}
            </Button>
            <Button
              active={false}
              disabled
              className="flex items-center w-full rounded-md px-4 py-2.5 text-sm text-bolt-elements-textTertiary gap-2"
            >
              <span className="sr-only">Coming Soon</span>
              <img
                className="w-5 h-5"
                height="24"
                width="24"
                crossOrigin="anonymous"
                src="https://cdn.simpleicons.org/cloudflare"
                alt="cloudflare"
              />
              <span className="ml-2 text-[14px]">Deploy to Cloudflare (Coming Soon)</span>
            </Button>

            <PushToGitHubDialog
              isOpen={isPushDialogOpen}
              onClose={() => setIsPushDialogOpen(false)}
              onPush={async (repoName, username, token, isPrivate) => {
                try {
                  console.log('Dialog onPush called with isPrivate =', isPrivate);

                  const commitMessage = prompt('Please enter a commit message:', 'Initial commit') || 'Initial commit';
                  const repoUrl = await workbenchStore.pushToGitHub(repoName, commitMessage, username, token, isPrivate);

                  return repoUrl;
                } catch (error) {
                  console.error('Error pushing to GitHub:', error);
                  // toast.error('Failed to push to GitHub');
                  throw error;
                }
              }}
            />
          </motion.div>
        )}

      </div>

    </div>
  );
}

interface ButtonProps {
  active?: boolean;
  disabled?: boolean;
  children?: any;
  onClick?: VoidFunction;
  className?: string;
}

function Button({ active = false, disabled = false, children, onClick, className }: ButtonProps) {
  return (
    <button
      className={classNames(
        'flex items-center p-1.5',
        {
          'bg-bolt-elements-item-backgroundDefault hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary':
            !active,
          'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': active && !disabled,
          'bg-bolt-elements-item-backgroundDefault text-alpha-gray-20 dark:text-alpha-white-20 cursor-not-allowed':
            disabled,
        },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
