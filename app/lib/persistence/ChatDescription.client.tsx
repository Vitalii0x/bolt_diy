import { useStore } from '@nanostores/react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Tooltip } from '~/components/ui/Tooltip';
import { useEditChatDescription } from '~/lib/hooks';
import { description as descriptionStore } from '~/lib/persistence';

import pencilLine from '../../../icons/pencil-line.svg';

export function ChatDescription() {
  const initialDescription = useStore(descriptionStore);
  
  const { 
    editing, 
    handleChange, 
    handleBlur, 
    handleSubmit, 
    handleKeyDown, 
    currentDescription, 
    toggleEditMode 
  } = useEditChatDescription({
    initialDescription: initialDescription || '',
    syncWithGlobalStore: true,
  });

  // Return null if no description is available
  if (!initialDescription) {
    return null;
  }

  // Safe truncation function
  const truncateDescription = (text?: string) => {
    if (!text) return '';
    if (text.length > 35) {
      return text.substring(0, 35) + '...';
    }
    return text;
  };

  // Get safe description for display
  const displayDescription = truncateDescription(currentDescription);
  const fullDescription = currentDescription || '';

  return (
    <div className="flex items-center justify-center font-[sf-regular] text-[14px]">
      {editing ? (
        <form onSubmit={handleSubmit} className="flex items-center justify-center">
          <input
            type="text"
            className="bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary rounded px-2 mr-2 w-fit"
            autoFocus
            value={currentDescription || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            style={{ width: `${Math.max((currentDescription?.length || 0) * 8, 100)}px` }}
          />
          <Tooltip content="Save title">
            <div className="flex justify-between items-center p-2 rounded-md bg-[#DACEC4] dark:bg-[#4B525B]">
              <button
                type="submit"
                className="i-ph:check-bold scale-110 hover:text-bolt-elements-item-contentAccent"
                onMouseDown={handleSubmit}
              />
            </div>
          </Tooltip>
        </form>
      ) : (
        <div className="flex items-center w-[calc(var(--chat-min-width)-20px)] justify-between">
          <TooltipProvider>
            <Tooltip content={fullDescription.length > 35 ? fullDescription : undefined}>
              <span className="max-w-[280px] truncate">
                {displayDescription}
              </span>
            </Tooltip>
          </TooltipProvider>
          <Tooltip content="Rename chat">
            <div className="flex justify-between items-center px-2 py-1 rounded-md dark:bg-[#4B525B] bg-[#DACEC4] ml-2">
              <img 
                src={pencilLine} 
                alt="Edit description" 
                className="invert-100 dark:invert-0 scale-110 hover:text-bolt-elements-item-contentAccent cursor-pointer" 
                onClick={(event) => {
                  event.preventDefault();
                  toggleEditMode();
                }} 
              />
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );
}