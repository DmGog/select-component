import { ChangeEvent, memo, MutableRefObject, ReactNode, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { createPortal } from 'react-dom';
import s from './select.module.css';
import Icon from '@/assets/icon';

type PrimitiveType = string | number | null;

export type Option<T> = {
  label: string;
  value: T;
};

type Props<T extends PrimitiveType> = {
  options: Option<T>[];
  value: T;
  onChange: (event: SelectEventType<T>) => void;
  isPortal?: boolean;
  placeholder?: string;
};

type State = {
  isOpen: boolean;
  search: string;
  filteredOptions: Option<any>[];
};

type Action =
  | { type: 'TOGGLE_DROPDOWN' }
  | { type: 'CLOSE_DROPDOWN' }
  | { type: 'SEARCH_UPDATED'; payload: string; options: Option<any>[] }
  | { type: 'OPTION_SELECTED'; payload: Option<any> };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TOGGLE_DROPDOWN':
      return { ...state, isOpen: !state.isOpen };
    case 'CLOSE_DROPDOWN':
      return { ...state, isOpen: false };
    case 'SEARCH_UPDATED':
      return {
        ...state,
        search: action.payload,
        filteredOptions: action.options.filter(option => option.label.toLowerCase().startsWith(action.payload.trim().toLowerCase())),
      };
    case 'OPTION_SELECTED':
      return {
        ...state,
        search: '',
        isOpen: false,
      };
    default:
      return state;
  }
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

function createSyntheticEventObject<T>(value: T): SelectEventType<T> {
  return {
    target: { value },
  };
}

export type SelectEventType<T> = {
  target: {
    value: T;
  };
};

const useSelect = <T,>(options: Option<T>[], onChange: (event: SelectEventType<T>) => void, value: T) => {
  const selectRef = useRef<HTMLDivElement | null>(null);
  const [{ isOpen, search, filteredOptions }, dispatch] = useReducer(reducer, {
    isOpen: false,
    search: '',
    filteredOptions: options,
  });

  useEffect(() => {
    dispatch({ type: 'SEARCH_UPDATED', payload: search, options });
  }, [options]);

  useHandleClickOutside(selectRef, () => dispatch({ type: 'CLOSE_DROPDOWN' }));

  const handleSelect = useCallback(
    (option: Option<T>) => {
      dispatch({ type: 'OPTION_SELECTED', payload: option });
      selectRef.current?.focus();
      onChange(createSyntheticEventObject(option.value));
    },
    [dispatch, onChange],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SEARCH_UPDATED', payload: e.target.value, options });
  };

  const toggleOption = () => dispatch({ type: 'TOGGLE_DROPDOWN' });

  const displayValue = useMemo(() => {
    return search || options.find(option => option.value === value)?.label || '';
  }, [search, options, value]);

  return {
    displayValue,
    toggleOption,
    handleInputChange,
    handleSelect,
    isOpen,
    filteredOptions,
    selectRef,
  };
};

export const Select = <T extends PrimitiveType>({ options, value, onChange, isPortal = false, placeholder = '...select' }: Props<T>) => {
  const { handleSelect, handleInputChange, isOpen, displayValue, toggleOption, filteredOptions, selectRef } = useSelect(
    options,
    onChange,
    value,
  );

  return (
    <div className={s.selectContainer} ref={selectRef} aria-expanded={isOpen} tabIndex={0}>
      <div className={s.selectInput} onClick={toggleOption} role="combobox" aria-haspopup="listbox" aria-controls="select-dropdown">
        <input type="text" value={displayValue} onChange={handleInputChange} aria-autocomplete="list" placeholder={placeholder} />
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

type DropProps<T extends PrimitiveType> = {
  filteredOptions: Option<T>[];
  value: T;
  isOpen: boolean;
  handleSelect: (option: Option<T>) => void;
};

const Dropdown = <T extends PrimitiveType>({ filteredOptions, value, isOpen, handleSelect }: DropProps<T>) => {
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

const MemoizedDropdown = memo(Dropdown) as <T extends PrimitiveType>(props: DropProps<T>) => ReactNode;
