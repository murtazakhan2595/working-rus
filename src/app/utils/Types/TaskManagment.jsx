import moment from "moment";
const Project = {
  name: "",
  description: "",
  start_date: moment(new Date()).format("YYYY-MM-DD"),
  end_date: moment(new Date()).format("YYYY-MM-DD"),
  project_members: [],
};
const AddList ={
  title:""
}
export { Project, AddList };
