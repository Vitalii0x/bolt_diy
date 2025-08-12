'use client';

import { createContext, useContext, useState } from 'react';

export type Framework = {
  label: 'HTML' | 'React' | 'VUE' | 'Next.JS' | 'Vite';
  icon: string;
  promptValue: string;
};

const StarterTemplateContext = createContext<{
  selectedFramework: Framework | null;
  setSelectedFramework: (fw: Framework | null) => void;
}>({
  selectedFramework: null,
  setSelectedFramework: () => {},
});

export function useStarterTemplate() {
  return useContext(StarterTemplateContext);
}

export function StarterTemplateProvider({ children }: { children: React.ReactNode }) {
  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);

  return (
    <StarterTemplateContext.Provider value={{ selectedFramework, setSelectedFramework }}>
      {children}
    </StarterTemplateContext.Provider>
  );
}
