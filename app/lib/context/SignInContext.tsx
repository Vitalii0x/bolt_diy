import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface SignInContextType {
  isOpen: boolean;
  openLogin: (open: boolean) => void;
  toggle: () => void;
  modalRef: React.RefObject<HTMLDivElement>;
  handleClickOutside: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const SignInContext = createContext<SignInContextType | null>(null);

export const SignInProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, openLogin] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const toggle = () => openLogin(prev => !prev);

  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      openLogin(false);
    }
  };

  return (
    <SignInContext.Provider
      value={{ isOpen, openLogin, toggle, modalRef, handleClickOutside }}
    >
      {children}
    </SignInContext.Provider>
  );
};

export const useSignIn = () => {
  const context = useContext(SignInContext);
  if (!context) throw new Error('useSignIn must be used within SignInProvider');
  return context;
};