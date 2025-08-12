import { useState, useEffect } from "react";
import { Button } from "./Button";
import { motion, AnimatePresence } from "framer-motion";

const CookiePopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent');
    if (consentGiven !== null) return;

    const delay = 3000 + Math.random() * 4000; // 3s–7s
    const timer = setTimeout(() => {
      setOpen(true);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const handleResponse = (accepted: boolean) => {
    localStorage.setItem('cookieConsent', String(accepted));
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[517px] p-6 min-h-[175px] max-h-[200px] dark:bg-[#252a30] bg-[#EFEAE6] rounded-lg fixed z-999 left-8 bottom-8 border border-[#c9c5c3] dark:border-[#4B525B] shadow-lg"
        >
          <p className="text-[#101010] dark:text-[#FDFCFD] text-left text-[14px] leading-snug">
            This website uses cookies, pixel tags, and local storage for performance, personalization, and marketing purposes. Our use of some cookies may be considered a sale, sharing for behavioral advertising, or targeted advertising. For more, see our{" "}
            <a href="#" className="underline">terms and conditions</a> and our{" "}
            <a href="#" className="underline">privacy policy</a>.
          </p>
          <Button
            variant="outline"
            className="mt-4.5 w-full text-black dark:text-white bg-[#292E35] border-[#4B525B]"
            onClick={() => handleResponse(true)}
          >
            I understand
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookiePopup;
