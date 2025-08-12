// app/contexts/TabContext.tsx
import { createContext, useContext, useState } from 'react';
import { type TabType } from '~/components/@settings';


type TabContextType = {
  activeTab: TabType | null;
  setActiveTab: (tab: TabType | null) => void;
};

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<TabType | null>(null);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export function useTab() {
  const context = useContext(TabContext);
  if (!context) throw new Error('useTab must be used within a <TabProvider>');
  return context;
}
