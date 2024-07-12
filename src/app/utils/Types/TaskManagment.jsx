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
  end_date: "",
  priority: "",
  card_members: [],
};
export { Project, AddList, CardTypes };
