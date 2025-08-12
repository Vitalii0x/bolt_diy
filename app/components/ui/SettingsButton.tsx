import { memo } from 'react';
import settingIcon from '../../../icons/settings-4-line.svg'
import { Tooltip } from './Tooltip';

interface SettingsButtonProps {
  onClick: () => void;
}

export const SettingsButton = memo(({ onClick }: SettingsButtonProps) => {
  return (
    <>
    <Tooltip content="Settings">
    <img src={settingIcon} alt="" onClick={onClick} className='invert-90 w-4 dark:invert-0 cursor-pointer'/>
    </Tooltip>
    </>
  );
});
