import moment from "moment";
const Project = {
  name: "",
  description: "",
  start_date: moment(new Date()).format("YYYY-MM-DD"),
  end_date: moment(new Date()).format("YYYY-MM-DD"),
  project_members: [],
  color: "", // Add color field
  profile: null,
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
  relation: [],
  start_date: null,
  task_checklist: [],
  status: "TODO",
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
};
export { Project, AddList, CardTypes, Task };
