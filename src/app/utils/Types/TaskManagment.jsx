import moment from "moment";
const Project = {
  name: "",
  description: "",
  start_date: moment(new Date()).format("YYYY-MM-DD"),
  end_date: moment(new Date()).format("YYYY-MM-DD"),
  project_members: [],
};
const AddList ={
  name:""
}
const CardTypes = {
  name: "",
  description: "",
  start_date: "",
  end_date: "",
  priority: "",
  created_by: "",
  assigned_to: [],
  attachment: [],
};
export { Project, AddList, CardTypes };
