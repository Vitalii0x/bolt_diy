import { useParams } from '@remix-run/react';
import { classNames } from '~/utils/classNames';
import { type ChatHistoryItem } from '~/lib/persistence';
import WithTooltip, { Tooltip } from '~/components/ui/Tooltip';
import { useEditChatDescription } from '~/lib/hooks';
import { useCallback, useEffect, useState } from 'react';
import { Checkbox } from '~/components/ui/Checkbox';
import { Dropdown, DropdownItem } from '~/components/ui/Dropdown';
// icons
import moreFill from '../../../icons/more-fill.svg'
import downnloadIcon from '../../../icons/download-2-line.svg'
import deleteIcon from '../../../icons/delete-bin-line.svg'
import editIcon from '../../../icons/edit-line.svg'
import duplicateIcon from '../../../icons/file-copy-line.svg'
import shareIcon from '../../../icons/upload-2-line.svg'
interface HistoryItemProps {
  item: ChatHistoryItem;
  onDelete?: (event: React.UIEvent) => void;
  onDuplicate?: (id: string) => void;
  exportChat: (id?: string) => void;
  selectionMode?: boolean;
  isSideBarOpen: boolean;
  isSelected?: boolean;
  onToggleSelection?: (id: string) => void;
}

export function HistoryItem({
  item,
  onDelete,
  onDuplicate,
  exportChat,
  isSideBarOpen,
  selectionMode = false,
  isSelected = false,
  onToggleSelection,
}: HistoryItemProps) {
  const { id: urlId } = useParams();
  const isActiveChat = urlId === item.urlId;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isSideBarOpen) setMenuOpen(false);
  }, [isSideBarOpen]);


  const {
    editing,
    handleChange,
    handleBlur,
    handleSubmit,
    handleKeyDown,
    currentDescription,
    toggleEditMode,
  } = useEditChatDescription({
    initialDescription: item.description,
    customChatId: item.id,
    syncWithGlobalStore: isActiveChat,
  });

  const handleItemClick = useCallback(
    (e: React.MouseEvent) => {
      if (selectionMode) {
        e.preventDefault();
        e.stopPropagation();
        onToggleSelection?.(item.id);
      }
    },
    [selectionMode, item.id, onToggleSelection]
  );

  const handleCheckboxChange = useCallback(() => {
    onToggleSelection?.(item.id);
  }, [item.id, onToggleSelection]);

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (onDelete) {
        onDelete(event as unknown as React.UIEvent);
      }
    },
    [onDelete]
  );

  return (
    <div
      className={classNames(
        'group rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50/80 dark:hover:bg-gray-800/30 overflow-hidden flex justify-between items-center px-3 py-2 transition-colors',
        { 'text-gray-900 dark:text-white bg-gray-50/80 dark:bg-gray-800/30': isActiveChat },
        { 'cursor-pointer': selectionMode }
      )}
      onClick={selectionMode ? handleItemClick : undefined}
    >
      {selectionMode && (
        <div className="flex items-center mr-2" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            id={`select-${item.id}`}
            checked={isSelected}
            onCheckedChange={handleCheckboxChange}
            className="h-4 w-4"
          />
        </div>
      )}

      {editing ? (
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            autoFocus
            value={currentDescription}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="i-ph:check h-4 w-4 text-gray-500 hover:text-purple-500 transition-colors"
            onMouseDown={handleSubmit}
          />
        </form>
      ) : (
        <a
          href={`/chat/${item.urlId}`}
          className="flex w-full relative truncate block"
          onClick={selectionMode ? handleItemClick : undefined}
        >
          <Tooltip side="top" content={currentDescription}>
            <span className="truncate pr-10">{currentDescription}</span>
          </Tooltip>
          <div className="absolute right-0 top-0 bottom-0 flex items-center px-1">
            <Dropdown
              open={menuOpen}
              onOpenChange={setMenuOpen}
              align="start"
              sideOffset={8}
              trigger={
                <img src={moreFill} className='invert-60 dark:invert-0' onClick={(e) => {
                  e.preventDefault();
                   e.stopPropagation();
                 }}/>
                // <DotsThree className='hover:bg-gray-400/20 rounded-md invert-100 dark:invert-0' size={22} color='#fff' onClick={(e) => {
                //   e.preventDefault();
                //   e.stopPropagation();
                // }} />
              }
            >
              <DropdownItem onSelect={() => exportChat(item.id)}>
               <img src={downnloadIcon} alt="" className='invert-60 dark:invert-0'/>
                Download
              </DropdownItem>
              <DropdownItem onSelect={() => alert('Share clicked!')}>
               <img src={shareIcon} alt="" className='invert-60 dark:invert-0'/>
               Share
              </DropdownItem>
              {onDuplicate && (
                <DropdownItem onSelect={() => onDuplicate(item.id)}>
                 <img src={duplicateIcon} alt="" className='invert-60 dark:invert-0'/>
                 Duplicate
                </DropdownItem>
              )}
              <DropdownItem onSelect={() => toggleEditMode()}>
               <img src={editIcon} alt="" className='invert-60 dark:invert-0'/>
               Rename
              </DropdownItem>
              <DropdownItem
                onSelect={handleDeleteClick}
                className="text-red-500 hover:bg-red-200 dark:hover:bg-red-900"
              >
                <img src={deleteIcon} alt="" className='invert-60 dark:invert-0'/>
                Delete
              </DropdownItem>
            </Dropdown>
          </div>
        </a>
      )}
    </div>
  );
}
