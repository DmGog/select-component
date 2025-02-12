import { ChangeEvent, useCallback, useEffect, useReducer, useRef, useMemo } from 'react';
import { reducer } from './reducer';
import { Option, SelectEventType } from './types';
import { useHandleClickOutside } from './use-handle-click-outside';

function createSyntheticEventObject<T>(value: T): SelectEventType<T> {
  return {
    target: { value },
  };
}

export const useSelect = <T>(options: Option<T>[], onChange: (event: SelectEventType<T>) => void, value: T) => {
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
