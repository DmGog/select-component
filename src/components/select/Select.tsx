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

export const Select = <T extends PrimitiveType>({ options, value, onChange, isPortal = true, placeholder = '...select' }: Props<T>) => {
  const {
    handleSelect,
    handleInputChange,
    isOpen,
    displayValue,
    toggleOption,
    filteredOptions,
    selectRef,
    highlightIndex,
    selectedIndex,
    onKeyDown,
    isKeyboardNavigation,
    handleMouseClick,
    dropdownRef,
    handleOnBlur,
  } = useSelect(options, onChange, value);

  const selectContent = (
    <div
      className={`${s.selectContainer} ${isPortal ? s.selectContainerPortal : ''}`}
      ref={selectRef}
      aria-expanded={isOpen}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-haspopup="listbox"
      aria-owns="dropdown-list"
    >
      <div
        className={s.selectInput}
        onClick={() => {
          toggleOption();
          handleMouseClick();
        }}
        role="combobox"
        aria-expanded={isOpen}
      >
        <input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          aria-controls="dropdown-list"
          onBlur={handleOnBlur}
        />
        <div className={`${s.icon} ${isOpen ? s.iconOpen : ''}`}>
          <Icon />
        </div>
      </div>
      {isOpen && (
        <MemoizedDropdown
          value={value}
          filteredOptions={filteredOptions}
          isOpen={isOpen}
          handleSelect={handleSelect}
          highlightIndex={highlightIndex}
          selectedIndex={selectedIndex}
          isKeyboardNavigation={isKeyboardNavigation}
          dropdownRef={dropdownRef}
        />
      )}
    </div>
  );

  if (isPortal) {
    return createPortal(selectContent, document.body);
  }
  return selectContent;
};
