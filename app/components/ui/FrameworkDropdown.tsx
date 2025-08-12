'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// icons
import htmlIcon from '../../../icons/html-icon.svg';
import reactIcon from '../../../icons/react-icon.svg';
import vueIcon from '../../../icons/vue-icon.svg';
import nextJsIcon from '../../../icons/nextjs-icon.svg';
import viteIcon from '../../../icons/vite-icon.svg';

import { useStarterTemplate } from '@/lib/context/Starter-template-context';

type Framework = {
  label: string;
  icon: string;
  promptValue: string;
};

export const FrameworkDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { selectedFramework, setSelectedFramework } = useStarterTemplate();

  const frameworks = [
  { label: 'Next.JS', icon: nextJsIcon, promptValue: 'NextJS' },
  { label: 'HTML', icon: htmlIcon, promptValue: 'HTML' },
  { label: 'VUE', icon: vueIcon, promptValue: 'Vue' },
  { label: 'React', icon: reactIcon, promptValue: 'React with Tailwind CSS' },
  { label: 'Vite', icon: viteIcon, promptValue: 'Vite with TypeScript and Tailwind' },
];

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-36 h-8 px-3 rounded-md border flex items-center cursor-pointer gap-2
          bg-transparent border-gray-300 text-black dark:bg-[#292E35] dark:border-[#4B525B] dark:text-white"
      >
        <img
          src={selectedFramework?.icon || htmlIcon}
          alt={selectedFramework?.label || 'HTML'}
          className="w-4 h-4"
        />
        <span className="flex-1 text-left">
          {selectedFramework?.label || 'HTML'}
        </span>

        <div className="h-4 w-px mx-2 bg-gray-300 dark:bg-[#4B525B]"></div>

        {/* Dropdown Icon */}
        <svg
          className={`w-3 h-3 text-black dark:text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-50 mt-1 p-1 w-36 rounded-md shadow-lg flex flex-col gap-1
              bg-[#E7E2E0] dark:bg-[#292E35] border border-gray-300 dark:border-[#4B525B]"
          >
            {frameworks.map((fw) => (
              <button
                key={fw.label}
                onClick={() => {
                  setSelectedFramework(fw);
                  setIsOpen(false);
                }}
                className={`flex items-center w-full px-4 py-2 text-sm gap-2 rounded-md
                  ${
                    selectedFramework?.label === fw.label
                      ? 'bg-gray-100 dark:bg-[#373f47] text-black dark:text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-[#373f47] text-black dark:text-white'
                  }`}
              >
                <img src={fw.icon} alt={fw.label} className="w-5 h-5" />
                <span>{fw.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
