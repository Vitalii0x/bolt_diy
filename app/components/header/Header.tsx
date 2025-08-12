import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { Button } from '../ui/moving-border';
import userIcon from '../../../icons/user-6-line.svg';
import { useEffect, useRef, useState } from 'react';
import { profileStore, updateProfile, } from '~/lib/stores/profile';
import { useSettingsContext } from '@/lib/context/SettingsContext';
import { useSignIn } from '~/lib/context/SignInContext';
import ineruneIcon from '../../../assets/icons/inerune.jpg'
import { motion } from 'framer-motion';
import { themeStore } from '~/lib/stores/theme';

import userIcon2 from '../../../icons/user-3-line.svg'
import settingIcon from '../../../icons/settings-4-line.svg'
import logoutIcon from '../../../icons/logout-teal.svg'
import logoutOrange from '../../../icons/logout-orange.svg'
import { useTab } from '~/lib/context/ProfileContext';
import { Button as RegularButton } from "@/components/ui/Button"
import { Button as AceButton } from "@/components/ui/ace-button"




export function Header() {
  const chat = useStore(chatStore);
  const profile = useStore(profileStore);
  const { setIsSettingsOpen } = useSettingsContext();
  const { openLogin } = useSignIn();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const theme = useStore(themeStore);
  const { activeTab, setActiveTab } = useTab();


  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`https://askblake-stagging-production.up.railway.app/api/auth/get-session`, {
        // const response = await fetch(`http://localhost:3000/api/auth/get-session`, {
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        updateProfile({
          username: userData.user.name ? userData.user.name : userData.user.email,
          avatar: userData.user.image,
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    }
  };


  // for logout

  const logoutRoute = async () => {

    try {
      const response = await fetch(`https://askblake-stagging-production.up.railway.app/api/auth/sign-out`, {
        // const response = await fetch(`http://localhost:3000/api/auth/sign-out`, {
        credentials: 'include',
        method: "POST"
      });

      if (response.ok) {
        updateProfile({
          username: '',
          avatar: '',
          bio: '',
        });
      }
    } catch (error) {

      console.error('Sign-Out failed:', error);
    }

    updateProfile({
      username: '',
      avatar: '',
      bio: '',
    });
  }

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={classNames(`flex justify-between items-end ${chat.started ? 'pl-2.5 pr-.4' : 'pl-.5 pr-.4 pb-2.5'}  pt-2.5 bg-[#E7E2E0]  dark:bg-[#292f35]`, {
        'border-transparent': !chat.started,
        '': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <a href="/" className="text-accent text-center flex items-center">
          <h3 className='text-[18px] font-[franie-regular]'>askblake.</h3>
        </a>
      </div>

      <div className='flex items-center gap-[10px]'>

        {profile?.username ? (
          <>
            <div ref={dropdownRef} className='relative'>

              <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className='text-sm text-white flex items-center dark:bg-[#292F35] justify-center gap-3 border border-[#c9c5c3] dark:hover:bg-[#363c44] dark:border-[#4B525B] pl-4 pr-2 py-1.8 mb-0 rounded-md cursor-pointer'>
                <img
                  src={profile.avatar || userIcon}
                  alt="User Avatar"
                  crossOrigin="anonymous"
                  className="h-5 w-5 rounded-full object-cover"
                />
                <p className='text-[15px] dark:text-white text-black'>{profile.username}</p>
                <p className='w-[1px] h-3 bg-[#4B525B]'></p>
                {/* <SettingsButton onClick={() => setIsSettingsOpen(true)}/> */}
                <div
                  className={classNames('i-ph:caret-down text-black dark:text-white w-4 h-4 transition-transform', isDropdownOpen ? 'rotate-180' : '')}
                />
              </div>

              {/* dropdown */}
              {isDropdownOpen && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }} className="absolute right-0 flex flex-col gap-1 z-50 p-1 mt-1 min-w-[9.5rem] dark:bg-[#292e35] rounded-md bg-[#EFEAE6] shadow-lg bg-bolt-elements-backgroundDefault border border-bolt-elements-borderColor">
                  <div
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsSettingsOpen(true);
                      setTimeout(() => {
                        setActiveTab('profile')
                      }, 100)
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive gap-1 rounded-md group relative cursor-pointer"
                  >
                    <img
                      className="w-5 h-5 invert-100 dark:invert-0"
                      height="24"
                      width="24"
                      crossOrigin="anonymous"
                      src={userIcon2}
                    />
                    <span className="ml-1">
                      Edit Profile
                    </span>
                  </div>
                  <div
                    onClick={() => {
                      setIsSettingsOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-start w-full px-4 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive gap-1 rounded-md group relative cursor-pointer"
                  >
                    <img
                      className="w-5 h-5 invert-100 dark:invert-0"
                      height="24"
                      width="24"
                      crossOrigin="anonymous"
                      src={settingIcon}
                      alt="settings"
                    />
                    <span className="ml-1">Settings</span>
                  </div>
                  <div
                    onClick={() => {
                      logoutRoute(),
                        setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-bolt-elements-textPrimary hover:bg-bolt-elements-item-backgroundActive gap-1 rounded-md group relative cursor-pointer"
                  >
                    <img
                      className="w-5 h-5"
                      height="24"
                      width="24"
                      crossOrigin="anonymous"
                      src={theme === 'dark' ? logoutIcon : logoutOrange}
                    />
                    <span className="ml-1 text-orange-400 dark:text-teal-400">Log Out</span>
                  </div>
                </motion.div>
              )}

            </div>
          </>
        ) : (
          <>
            <div className="text-white" onClick={() => openLogin(true)}>
              {/* <button
                className="relative inline-flex items-center space-x-2 rounded-md bg-slate-800 px-4 py-2.2 text-[12px] text-white shadow-2xl shadow-zinc-900 ring-1 ring-white/10 transition group">
                <span className="absolute inset-0 overflow-hidden rounded-md">
                  <span className="absolute inset-0 bg-[radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>

                <span className="relative z-10 flex items-center space-x-2">
                  <span>Sign up / Login</span>
                </span>

                <span className="pointer-events-none absolute -bottom-px left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-40" />
              </button> */}
              <AceButton>Sign up / Login</AceButton>
            </div>
          </>
        )}
        <RegularButton variant={"theme"}>Feedback</RegularButton>
      </div>



    </header>
  );
}
