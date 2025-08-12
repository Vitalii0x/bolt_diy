// components/ToastProvider.tsx
import { createContext, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Toast = {
  id: number;
  title: string;
  description?: string;
  onUndo?: () => void;
  type?: "success" | "error" | "info"; // optional for flexibility
};

type ToastContextType = {
  showToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
};

let toastId = 0;

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, "id">) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`flex justify-between items-center gap-4 rounded-xl shadow-xl p-4 w-[360px]
    ${toast.type === "error" ? "bg-red-600 text-white" : "bg-neutral-900 text-white"}
  `}
            >

              <div className="flex flex-col">
                <div className="text-sm">
                  {toast.title}
                </div>
                {toast.description && (
                  <div className="text-sm text-neutral-300 mt-1">
                    {toast.description}
                  </div>
                )}
              </div>
              {toast.onUndo && (
                <button
                  onClick={toast.onUndo}
                  className="bg-white text-black text-sm px-3 py-1 rounded-md font-medium hover:bg-neutral-200 transition"
                >
                  Undo
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
