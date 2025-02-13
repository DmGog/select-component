import { memo, ReactNode, RefObject } from 'react';
import s from './styles/dropdown.module.css';
import { Option, PrimitiveType } from './types/types';

type Props<T extends PrimitiveType> = {
  filteredOptions: Option<T>[];
  value: T;
  isOpen: boolean;
  handleSelect: (option: Option<T>) => void;
  highlightIndex: number;
  selectedIndex: number;
  isKeyboardNavigation: boolean;
  dropdownRef: RefObject<HTMLUListElement>;
};
const Dropdown = <T extends PrimitiveType>({
  filteredOptions,
  value,
  isOpen,
  handleSelect,
  highlightIndex,
  selectedIndex,
  isKeyboardNavigation,
  dropdownRef,
}: Props<T>) => {
  return (
    <ul ref={dropdownRef} className={s.selectDropdown} role="listbox" aria-hidden={!isOpen}>
      {filteredOptions.length > 0 ? (
        filteredOptions.map((option, index) => (
          <li
            key={option.value}
            className={`${s.selectItem} 
                        ${selectedIndex === index ? s.selected : ''}
                        ${isKeyboardNavigation && highlightIndex === index ? s.focused : ''}`}
            onClick={() => handleSelect(option)}
            role="option"
            aria-selected={value === option.value}
          >
            {option.label}
          </li>
        ))
      ) : (
        <li className={s.noOptions} role="alert">
          Нет вариантов для выбора
        </li>
      )}
    </ul>
  );
};

export const MemoizedDropdown = memo(Dropdown) as <T extends PrimitiveType>(props: Props<T>) => ReactNode;
