import { createContext, useContext, useRef } from 'react';

const IframeContext = createContext<React.RefObject<HTMLIFrameElement> | null>(null);

export function IframeProvider({ children }: { children: React.ReactNode }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  return <IframeContext.Provider value={iframeRef}>{children}</IframeContext.Provider>;
}

export const useIframeRef = () => {
  const ctx = useContext(IframeContext);
  if (!ctx) throw new Error("useIframeRef must be used within IframeProvider");
  return ctx;
};
