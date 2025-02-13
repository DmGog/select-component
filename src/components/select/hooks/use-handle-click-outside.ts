import { MutableRefObject, useEffect } from 'react';

export const useHandleClickOutside = (elementRef: MutableRefObject<HTMLElement | null>, onClick: () => void, isOpen: boolean) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
        onClick();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [elementRef, onClick, isOpen]);
};
