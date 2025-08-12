import { useStore } from '@nanostores/react';
import { memo, useEffect, useState } from 'react';
import { themeStore, toggleTheme } from '~/lib/stores/theme';
import { IconButton } from './IconButton';
import moonIcon from '../../../icons/moon-clear-line.svg'
import { Tooltip } from './Tooltip'
import { MoonStars, SunDim } from '@phosphor-icons/react';

interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch = memo(({ className }: ThemeSwitchProps) => {
  const theme = useStore(themeStore);
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  return (
    domLoaded && (
      <>
        {
          theme === 'dark' ? <Tooltip content="Toggle Light Mode">
            <div className='px-3 py-1 hover:bg-[#4B525B] transition-colors duration-[250ms] rounded-md flex items-center justify-center cursor-pointer'  onClick={toggleTheme}>
            <SunDim size={20} color='white'/>
            </div>

          </Tooltip> : <Tooltip content="Toggle Dark Mode">
            {/* <img src={moonIcon} alt="dark_mode" className='invert-100 cursor-pointer px-3 py-0 hover:bg-[#dfceba] rounded-md' onClick={toggleTheme} /> */}
            <div className='px-3 py-1 hover:bg-[#b4ada4] transition-colors duration-[250ms] rounded-md flex items-center justify-center cursor-pointer'  onClick={toggleTheme}>
            <MoonStars size={20} />
            </div>
          </Tooltip>
        }
      </>
    )
  );
});
