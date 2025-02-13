import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
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
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const [{ isOpen, search, filteredOptions }, dispatch] = useReducer(selectReducer, {
    isOpen: false,
    search: '',
    filteredOptions: options,
  });

  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [isKeyboardNavigation, setIsKeyboardNavigation] = useState(false);
  const [lastInteraction, setLastInteraction] = useState<'keyboard' | 'mouse' | null>(null);

  const selectedIndex = useMemo(() => filteredOptions.findIndex(option => option.value === value), [filteredOptions, value]);

  useEffect(() => {
    dispatch({ type: 'SEARCH_UPDATED', payload: search, options });
  }, [options]);

  useEffect(() => {
    if (isOpen && filteredOptions.length > 0) {
      if (lastInteraction === 'keyboard' && selectedIndex !== -1) {
        setHighlightIndex(selectedIndex);
      } else if (lastInteraction === 'mouse') {
        setHighlightIndex(selectedIndex);
      } else {
        setHighlightIndex(-1);
      }
    }
  }, [isOpen, filteredOptions, selectedIndex, lastInteraction]);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const highlightedItem = dropdownRef.current.children[highlightIndex] as HTMLElement;
      if (highlightedItem) {
        dropdownRef.current.scrollTop =
          highlightedItem.offsetTop -
          dropdownRef.current.offsetTop -
          dropdownRef.current.clientHeight / 2 +
          highlightedItem.clientHeight / 2;
      }
    }
  }, [highlightIndex, isOpen, filteredOptions.length]);

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

  const toggleOption = () => {
    dispatch({ type: 'TOGGLE_DROPDOWN' });
    setHighlightIndex(-1);
  };

  const displayValue = useMemo(() => {
    return search || options.find(option => option.value === value)?.label || '';
  }, [search, options, value]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      if (isOpen && highlightIndex !== -1) {
        handleSelect(filteredOptions[highlightIndex]);
      } else {
        toggleOption();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsKeyboardNavigation(true);
      setLastInteraction('keyboard');
      setHighlightIndex(prev => (prev === filteredOptions.length - 1 ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsKeyboardNavigation(true);
      setLastInteraction('keyboard');
      setHighlightIndex(prev => (prev === 0 ? filteredOptions.length - 1 : prev - 1));
    } else if (e.key === 'Escape') {
      toggleOption();
    }
  };

  const handleMouseClick = () => {
    setLastInteraction('mouse');
  };

  return {
    displayValue,
    toggleOption,
    handleInputChange,
    handleSelect,
    isOpen,
    filteredOptions,
    selectRef,
    highlightIndex,
    setHighlightIndex,
    selectedIndex,
    onKeyDown,
    isKeyboardNavigation,
    handleMouseClick,
    dropdownRef,
  };
};
