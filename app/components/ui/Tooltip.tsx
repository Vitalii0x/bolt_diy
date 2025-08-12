import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { forwardRef, useState, type ForwardedRef, type ReactElement } from 'react';
import { classNames } from '~/utils/classNames';
import { motion, AnimatePresence } from 'framer-motion';

// Original WithTooltip component
interface WithTooltipProps {
  tooltip: React.ReactNode;
  children: ReactElement;
  sideOffset?: number;
  className?: string;
  arrowClassName?: string;
  tooltipStyle?: React.CSSProperties;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
  delay?: number;
}

const WithTooltip = forwardRef(
  (
    {
      tooltip,
      children,
      sideOffset = 5,
      className = '',
      arrowClassName = '',
      tooltipStyle = {},
      position = 'top',
      maxWidth = 250,
      delay = 0,
    }: WithTooltipProps,
    _ref: ForwardedRef<HTMLElement>,
  ) => {
    return (
      <TooltipPrimitive.Provider>
        <TooltipPrimitive.Root delayDuration={delay}>
          <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              side={position}
              className={`
                z-[2000]
                px-2.5
                py-1.5
                max-h-[300px]
                select-none
                rounded-md
                bg-bolt-elements-background-depth-3
                text-bolt-elements-textPrimary
                text-sm
                leading-tight
                shadow-lg
                animate-in
                fade-in-0
                zoom-in-95
                data-[state=closed]:animate-out
                data-[state=closed]:fade-out-0
                data-[state=closed]:zoom-out-95
                ${className}
              `}
              sideOffset={sideOffset}
              style={{
                maxWidth,
                ...tooltipStyle,
              }}
            >
              <div className="break-words">{tooltip}</div>
              <TooltipPrimitive.Arrow
                className={`
                  fill-bolt-elements-background-depth-3
                  ${arrowClassName}
                `}
                width={12}
                height={6}
              />
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      </TooltipPrimitive.Provider>
    );
  },
);

// New Tooltip component with simpler API
interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 300,
  className,
}: TooltipProps) {
  /* controlled open state so AnimatePresence can see it */
  const [open, setOpen] = useState(false);

  /* tiny directional offset for slide‑in */
  const offset = {
    x: side === 'left' ? -4 : side === 'right' ? 4 : 0,
    y: side === 'top' ? -4 : side === 'bottom' ? 4 : 0,
  };

  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root
        delayDuration={delayDuration}
        open={open}
        onOpenChange={setOpen}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>

        <AnimatePresence>
          {open && (
            <TooltipPrimitive.Portal forceMount>
              {/* `asChild` lets us swap in a motion.div while Radix handles popper positioning */}
              <TooltipPrimitive.Content
                asChild
                side={side}
                align={align}
                sideOffset={5}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: -10 }}
                  animate={{
                    opacity: 1,
                    scale: [0.8, 1.05, 0.98, 1],
                    rotate: [0, -8, 8, 0],
                    y: [-10, 2, -2, 0],
                  }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  transition={{
                    duration: 0.1,
                    ease: "easeOut",
                  }}
                  className={classNames(
                    ' rounded-md bg-[#1D2125] dark:bg-[#000] z-999 px-3 py-1.5 text-xs text-white  shadow-md',
                    className,
                  )}
                >
                  {content}
                  <TooltipPrimitive.Arrow className="fill-[#1D2125] dark:fill-[#000]" />
                </motion.div>
              </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
          )}
        </AnimatePresence>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export default WithTooltip;
