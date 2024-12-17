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
};
export { Project, AddList, CardTypes };
