import { selectReducer, Action } from './select.reducer';
import { Option } from '../types/types';

describe('selectReducer', () => {
  const options: Option<string>[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
  ];

  it('should toggle isOpen state', () => {
    const initialState = { isOpen: false, search: null, filteredOptions: options };
    const action: Action = { type: 'TOGGLE_DROPDOWN' };
    const newState = selectReducer(initialState, action);
    expect(newState.isOpen).toBe(true);
  });

  it('should close dropdown and set selected value in search', () => {
    const initialState = { isOpen: true, search: null, filteredOptions: options };
    const action: Action = { type: 'CLOSE_DROPDOWN', payload: 'apple', options };
    const newState = selectReducer(initialState, action);
    expect(newState.isOpen).toBe(false);
    expect(newState.search).toBe('Apple');
  });

  it('should filter options based on search', () => {
    const initialState = { isOpen: true, search: null, filteredOptions: options };
    const action: Action = { type: 'SEARCH_UPDATED', payload: 'app', options };
    const newState = selectReducer(initialState, action);
    expect(newState.filteredOptions).toEqual([{ value: 'apple', label: 'Apple' }]);
  });

  it('should select an option and close dropdown', () => {
    const initialState = { isOpen: true, search: 'apple', filteredOptions: options };
    const action: Action = { type: 'OPTION_SELECTED', payload: { value: 'apple', label: 'Apple' }, options };
    const newState = selectReducer(initialState, action);
    expect(newState.isOpen).toBe(false);
    expect(newState.search).toBe(null);
  });
});
