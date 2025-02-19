import moment from "moment";
const Project = {
  name: "",
  description: "",
  start_date: moment(new Date()).format("YYYY-MM-DD"),
  end_date: moment(new Date()).format("YYYY-MM-DD"),
  project_members: [],
  color: "", // Add color field
  profile_picture: null, // Store the primary key of Task Managment attachment
  profile_img: null, // Stores the File Object/ URL of image
  joining_request: [],
  status: "on_going",
};
const CustomField = {
  id: null,
  field_data: {},
  project: null,
};
const CustomFieldData = {
  field_type: null,
  field_name: null,
  value: null,
};
const CustomFieldTypes = {
  INPUT_TEXT: "INPUT_TEXT",
  INPUT_NUMBER: "INPUT_NUMBER",
  SELECT_DROPDOWN: "SELECT_DROPDOWN",
  CHECKBOX: "CHECKBOX",
};
const Task = {
  assigned_by: null,
  assigned_to: [],
  attachment: [],
  board_id: null,
  color: null,
  description: null,
  end_date: null,
  estimated_time: null,
  id: null,
  label: [],
  name: null,
  priority: null,
  project_id: null,
  relation_ship: [],
  start_date: null,
  task_checklist: [],
  status: "TODO",
  is_archive: false,
  custom_fields: [],
  cover_photo: null,
  actual_time:null,
};
const AddList = {
  name: "",
};
const CardTypes = {
  name: "",
  description: "",
  start_date: "",
  end_date: "",
  priority: "",
  assigned_by: "",
  assigned_to: [],
  attachment: [],
  board_id: "",
  project_id: "",
  status: "TODO",
  task_checklist: [],
  relation: [],
  subtasks: [],
};
/**
 * Predefined color options for selection.
 */
const DEFAULT_LIST_COLOR_OPTIONS = [
  "#f2dede", // 80% lighter than #641e16
  "#ebebeb", // 80% lighter than #7b7d7d
  "#f7e6b0", // 80% lighter than #7d6608
  "#d2f2e4", // 80% lighter than #186a3b
  "#d1e8ff", // 80% lighter than #2874a6
  "#eed9f2", // 80% lighter than #6c3483
  "#fad3cf", // 80% lighter than #e74c3c
  "#f6e1d9", // 80% lighter than #CC6633
  "#fff4cc", // 80% lighter than #FFCC00
  "#e6f7d9", // 80% lighter than #669900
  "#d1f4fa", // 80% lighter than #00acc1
  "#d9dbfa", // 80% lighter than #5c6bc0
  "#ffe3b2", // 80% lighter than #ff9800
  "#c6f2da", // 80% lighter than #12B76A
];

export const DEFAULT_PROJECT_COLOR_OPTIONS = [
  "#f7f7f7",
  "#f9e8f7",
  "#e7f9f7",
  "#fdf7e7",
  "#f9f7f9",
];
export {
  Project,
  AddList,
  CardTypes,
  Task,
  CustomField,
  CustomFieldTypes,
  CustomFieldData,
  DEFAULT_LIST_COLOR_OPTIONS,
};
