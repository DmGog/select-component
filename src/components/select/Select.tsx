import { createPortal } from 'react-dom';
import { Option, PrimitiveType, SelectEventType } from './types/types';
import s from './styles/select.module.css';
import { useSelect } from './hooks/use-select';
import { MemoizedDropdown } from './Dropdown';
import Icon from '@/assets/Icon';

type Props<T extends PrimitiveType> = {
  options: Option<T>[];
  value: T;
  onChange: (event: SelectEventType<T>) => void;
  isPortal?: boolean;
  placeholder?: string;
};

export const Select = <T extends PrimitiveType>({ options, value, onChange, isPortal = false, placeholder = '...select' }: Props<T>) => {
  const { handleSelect, handleInputChange, isOpen, displayValue, toggleOption, filteredOptions, selectRef } = useSelect(
    options,
    onChange,
    value,
  );

  return (
    <div className={s.selectContainer} ref={selectRef} aria-expanded={isOpen} tabIndex={0}>
      <div className={s.selectInput} onClick={toggleOption} role="combobox" aria-haspopup="listbox">
        <input type="text" value={displayValue} onChange={handleInputChange} placeholder={placeholder} />
        <div className={`${s.icon} ${isOpen ? s.iconOpen : ''}`}>
          <Icon />
        </div>
      </div>
      {isOpen &&
        (isPortal ? (
          createPortal(
            <MemoizedDropdown value={value} filteredOptions={filteredOptions} isOpen={isOpen} handleSelect={handleSelect} />,
            document.body,
          )
        ) : (
          <MemoizedDropdown value={value} filteredOptions={filteredOptions} isOpen={isOpen} handleSelect={handleSelect} />
        ))}
    </div>
  );
};
