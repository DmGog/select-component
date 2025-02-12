import { ChangeEvent, memo, MutableRefObject, useEffect, useRef, useState } from 'react';
import s from './select.module.css';
import Icon from '@/assets/icon';

export type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const useHandleClickOutside = (elementRef: MutableRefObject<HTMLElement | null>, onClick: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
        onClick();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
};

export const Select = memo(({ options, value, onChange, placeholder = '...select' }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const selectRef = useRef<HTMLDivElement | null>(null);

  function calculateFilteredOptions() {
    const normalizedSearchValue = search.trim().toLowerCase();
    return options.filter(option => option.label.toLowerCase().startsWith(normalizedSearchValue));
  }

  useEffect(() => {
    setFilteredOptions(calculateFilteredOptions());
  }, [options]);

  useHandleClickOutside(selectRef, () => setIsOpen(false));

  const handleSelect = (option: Option) => {
    setSearch('');
    setIsOpen(false);
    selectRef.current?.focus();
    onChange(option.value);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setFilteredOptions(calculateFilteredOptions());
    onChange(search);
  };

  const toggleOption = () => setIsOpen(prev => !prev);

  const displayValue = search || options.find(option => option.value === value)?.label || '';

  const dropdown = (
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

  return (
    <div className={s.selectContainer} ref={selectRef} aria-expanded={isOpen} tabIndex={0}>
      <div className={s.selectInput} onClick={toggleOption} role="combobox" aria-haspopup="listbox" aria-controls="select-dropdown">
        <input type="text" value={displayValue} onChange={handleInputChange} aria-autocomplete="list" placeholder={placeholder} />
        <div className={`${s.icon} ${isOpen ? s.iconOpen : ''}`}>
          <Icon />
        </div>
      </div>
      {isOpen && dropdown}
    </div>
  );
});

Select.displayName = 'Select';
