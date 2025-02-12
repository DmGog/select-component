import { ChangeEvent, useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { selectReducer } from '../reducers/select.reducer';
import { Option, SelectEventType } from '../types/types';
import { useHandleClickOutside } from './use-handle-click-outside';

function createSyntheticEventObject<T>(value: T): SelectEventType<T> {
  return {
    target: { value },
  };
}

export const useSelect = <T>(options: Option<T>[], onChange: (event: SelectEventType<T>) => void, value: T) => {
  const selectRef = useRef<HTMLDivElement | null>(null);
  const [{ isOpen, search, filteredOptions }, dispatch] = useReducer(selectReducer, {
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
      dispatch({ type: 'OPTION_SELECTED', payload: option, options });
      selectRef.current?.focus();
      onChange(createSyntheticEventObject(option.value));
    },
    [dispatch, onChange, search],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SEARCH_UPDATED', payload: e.target.value, options });
    const matchedOption = options.find(option => option.label === search);
    const typedValue = search === '' ? (null as T) : matchedOption ? matchedOption.value : (search as T);
    onChange(createSyntheticEventObject(typedValue));
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
