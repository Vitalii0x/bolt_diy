import { IconButton } from '~/components/ui/IconButton';
import { classNames } from '~/utils/classNames';
import micIcon from '../../../icons/mic-line.svg'
import { Tooltip } from '../ui/Tooltip';

export const SpeechRecognitionButton = ({
  isListening,
  onStart,
  onStop,
  disabled,
}: {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled: boolean;
}) => {
  return (
    <IconButton
      disabled={disabled}
      className={classNames('transition-all', {
        'text-bolt-elements-item-contentAccent ': isListening,
      })}
      onClick={isListening ? onStop : onStart}
    >
      <div className='bg-[#E7E2E0] dark:bg-[#4B525B] dark:hover:bg-[#4b525bd1] p-2 rounded-md'>

      {isListening ? <div className="i-ph:microphone-slash text-xl" /> : 
    <Tooltip content="Record your prompt" side='bottom'><img src={micIcon}  className='invert-100 dark:invert-0 w-[16px] h-[16px]' /></Tooltip> }
    </div>
    </IconButton>
  );
};
