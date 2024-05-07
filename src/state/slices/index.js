import { combineReducers } from 'redux';
import userSlice from './UserSlice';
import dropdownSlice from './DropdownSlice';
import ModalSlice from './ModalSlice';
import EmpSlice from './EmpSlice';
import { postTasks } from './DtrPostSlice';
import GetDtrSlice from './GetDtrSlice';
import GetDtrAllSlice from './GetDtrAllSlice';
import GetAssigneDtr from './GetAssigneDtr';

const rootReducer = combineReducers({
  user: userSlice,
  dropdown: dropdownSlice,
  modal: ModalSlice,
  emp: EmpSlice,
  getDtr: GetDtrSlice,
  postDtr: postTasks,
  getDtrAll: GetDtrAllSlice,
  getAssigne: GetAssigneDtr,
});

export default rootReducer;
