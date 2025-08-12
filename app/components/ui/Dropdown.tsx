// components/ui/Dropdown.tsx
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { type ReactNode } from 'react';
import { classNames } from '~/utils/classNames';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '~/lib/utils';

/* ------------------------------------------------------------------ */
/* ⬤  Item & Separator helpers -------------------------------------- */
/* ------------------------------------------------------------------ */

interface DropdownItemProps {
  children: ReactNode;
  onSelect?: () => void;
  className?: string;
}

export const DropdownItem = ({
  children,
  onSelect,
  className,
}: DropdownItemProps) => (
  <DropdownMenu.Item
    className={classNames(
      'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm',
      'text-bolt-elements-textPrimary hover:text-bolt-elements-textPrimary',
      'dark:hover:bg-[#373f47] hover:bg-[#ddd8d4]',
      'transition-colors cursor-pointer',
      'outline-none',
      className,
    )}
    onSelect={onSelect}
  >
    {children}
  </DropdownMenu.Item>
);

export const DropdownSeparator = () => (
  <DropdownMenu.Separator className="h-px bg-bolt-elements-borderColor my-1" />
);

/* ------------------------------------------------------------------ */
/* ⬤  Root wrapper --------------------------------------------------- */
/* ------------------------------------------------------------------ */

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;

  /* NEW: controlled‐open API -------------------------------------- */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dropdown = ({
  trigger,
  children,
  align = 'end',
  sideOffset = 5,
  open,
  onOpenChange,
}: DropdownProps) => (
  <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
    <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

    {/* AnimatePresence watches the Radix‑controlled `open` state */}
    <AnimatePresence>
      {open && (
        <DropdownMenu.Portal forceMount>
          {/* `asChild` lets us swap in a motion.div and keep Radix positioning */}
          <DropdownMenu.Content
            asChild
            sideOffset={sideOffset}
            align={align}
            /* Radix still handles focus trap & positioning */
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                'min-w-[220px] rounded-lg p-2 z-[1000]',
                'dark:bg-[#292F35] bg-[#EFEAE6]',
                'border border-bolt-elements-borderColor shadow-lg',
                'will-change-[transform,opacity]',
              )}
            >
              {children}
            </motion.div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      )}
    </AnimatePresence>
  </DropdownMenu.Root>
);
