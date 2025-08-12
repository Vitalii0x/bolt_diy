import { GitDiff, ImageSquare } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import { memo } from 'react';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';
import { genericMemo } from '~/utils/react';
import { Tooltip } from './Tooltip';

// icons
import codeIcon from '../../../icons/code-s-slash-line.svg'
import diffCode from '../../../icons/flip-horizontal-fill.svg'
import imgLine from '../../../icons/image-line.svg'

export type SliderOptions<T> = {
  left: { value: T; text: string };
  middle?: { value: T; text: string };
  right: { value: T; text: string };
};

interface SliderProps<T> {
  selected: T;
  options: SliderOptions<T>;
  setSelected?: (selected: T) => void;
}

export const Slider = genericMemo(<T,>({ selected, options, setSelected }: SliderProps<T>) => {
  const hasMiddle = !!options.middle;
  const isLeftSelected = hasMiddle ? selected === options.left.value : selected === options.left.value;
  const isMiddleSelected = hasMiddle && options.middle ? selected === options.middle.value : false;

  return (
    <div className="flex items-center flex-wrap shrink-0 gap-1 overflow-hidden rounded-md p-1">
      <SliderButton
        selected={!isLeftSelected && !isMiddleSelected}
        setSelected={() => setSelected?.(options.right.value)}
      >
        <Tooltip content="Preview">
        {/* <ImageSquare size={20} /> */}
        <img src={imgLine} alt="" className='invert-100 dark:invert-0'/>
        </Tooltip>
      </SliderButton>


      <SliderButton selected={isLeftSelected} setSelected={() => setSelected?.(options.left.value)}>
        {/* {options.left.text} */}
        <Tooltip content="Code View">
        <img src={codeIcon} alt="code_icon" className='invert-100 dark:invert-0' />
        </Tooltip>
      </SliderButton>

      {options.middle && (
        <SliderButton selected={isMiddleSelected} setSelected={() => setSelected?.(options.middle!.value)}>
          <Tooltip content="Code Changes View">
          <img src={diffCode} alt="" className='invert-100 dark:invert-0'/>
          </Tooltip>
        </SliderButton>
      )}

      
    </div>
  );
});

interface SliderButtonProps {
  selected: boolean;
  children: string | JSX.Element | Array<JSX.Element | string>;
  setSelected: () => void;
}

const SliderButton = memo(({ selected, children, setSelected }: SliderButtonProps) => {
  return (
    <button
      onClick={setSelected}
      className={classNames(
        'bg-transparent text-sm px-2.5 py-0.5 rounded-sm relative',
        selected
          ? 'dark:text-white text-black'
          : 'text-bolt-elements-item-contentDefault hover:text-bolt-elements-item-contentActive',
      )}
    >
      <span className="relative z-10">{children}</span>
      {selected && (
        <motion.span
          layoutId="pill-tab"
          transition={{ duration: 0.2, ease: cubicEasingFn }}
          className="absolute inset-0 z-0 bg-[#dacec4] dark:bg-[#4b525b] rounded-md"
        ></motion.span>
      )}
    </button>
  );
});
