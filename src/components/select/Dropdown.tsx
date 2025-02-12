import { memo, ReactNode } from 'react';
import s from './dropdown.module.css';
import { Option, PrimitiveType } from './types';

type Props<T extends PrimitiveType> = {
  filteredOptions: Option<T>[];
  value: T;
  isOpen: boolean;
  handleSelect: (option: Option<T>) => void;
};
const Dropdown = <T extends PrimitiveType>({ filteredOptions, value, isOpen, handleSelect }: Props<T>) => {
  return (
    <ul className={s.selectDropdown} role="listbox" aria-hidden={!isOpen}>
      {filteredOptions.length > 0 ? (
        filteredOptions.map(option => (
          <li
            key={option.value}
            className={`${s.selectItem} ${value === option.value ? s.selected : ''}`}
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
