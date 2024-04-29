import { combineReducers } from 'redux';
import userSlice from './UserSlice';
import dropdownSlice from './DropdownSlice';

const rootReducer = combineReducers({
  user: userSlice,
  dropdown: dropdownSlice
});

export default rootReducer;
