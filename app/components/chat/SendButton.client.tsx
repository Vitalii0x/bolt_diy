import { AnimatePresence, cubicBezier, motion } from 'framer-motion';
// icon
import telegramFill from '../../../icons/telegram-2-fill.svg';
import arrowRight from '../../../icons/arrow-right-long-line.svg'

interface SendButtonProps {
  show: boolean;
  isStreaming?: boolean;
  disabled?: boolean;
  input: string,
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onImagesSelected?: (images: File[]) => void;
}

const customEasingFn = cubicBezier(0.4, 0, 0.2, 1);

export const SendButton = ({ show, isStreaming, disabled, onClick, input }: SendButtonProps) => {
  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          className={`absolute flex justify-center items-center bottom-[14px] right-[11px] p-4 
    ${input.length > 0 ? 'bg-[#FFD6A7]' : 'bg-[#262629]'} 
    text-white dark:text-black 
    dark:${input.length > 0 ? 'bg-[#00D5BF]' : 'bg-[#4B525B]'}
    hover:brightness-94 color-black rounded-md w-[44px] h-[30px] 
    transition-theme disabled:opacity-50 disabled:cursor-not-allowed`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          disabled={disabled}
          onClick={(event) => {
            event.preventDefault();

            if (!disabled) {
              onClick?.(event);
            }
          }}
        >
          <div className="text-lg">
            {!isStreaming ? <img src={arrowRight} alt="telegram" className='invert-100 dark:invert-0 min-w-[16px] minh-[16px]' /> : <div className="i-ph:stop-circle-bold"></div>}
          </div>
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
};
