import { Option } from '../types/types';

type State = {
  isOpen: boolean;
  search: string;
  filteredOptions: Option<any>[];
};

export type Action =
  | { type: 'TOGGLE_DROPDOWN' }
  | { type: 'CLOSE_DROPDOWN' }
  | { type: 'SEARCH_UPDATED'; payload: string; options: Option<any>[] }
  | { type: 'OPTION_SELECTED'; payload: Option<any>; options: Option<any>[] };

export const selectReducer = (state: State, action: Action): State => {
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
        filteredOptions: action.options,
      };
    default:
      return state;
  }
};
