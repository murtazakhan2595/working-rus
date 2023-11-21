import { LiaHomeSolid } from "react-icons/lia";
import { MdOutlinePayment } from "react-icons/md";
import { RiProfileLine } from "react-icons/ri";
import { BiSpreadsheet } from "react-icons/bi";
import { PiShootingStarBold } from "react-icons/pi";

export const tasksTitle = [
  { label: "Task Name", width: "w-44" },

  { label: "Assign By", width: "w-28" },

  { label: "Due Date", width: "w-28" },

  { label: "Status", width: "w-28" },

  { label: "Board", width: "w-28" },

  { label: "Priority", width: "w-28" },
];

export const priorityOptions = [
  { value: 3, label: "🔵 Low" },
  { value: 2, label: "🌕 Medium" },
  { value: 1, label: "🔴 High" },
];

export const statusOptions = [
  { value: "To Do", label: "Todo" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

export const academicOptions = [
  {
    value: "inter",
    label: "Inter",
    value: "bachelors",
    label: "Bachelors",
    value: "masters",
    label: "Masters",
  },
];

export const links = [
  { to: "/", text: "Home", icon: <LiaHomeSolid /> },
  { to: "/profile", text: "Profile", icon: <RiProfileLine /> },
  { to: "/emp-data", text: "Emp Sheet", icon: <BiSpreadsheet /> },
  { to: "/recruitment-form", text: "Recruitment Form", icon: <MdOutlinePayment /> },
  { to: "", text: "Performance", icon: <PiShootingStarBold /> },
];


export const jobTypeOptions = [
  { value: "Internship", label: "Internship" },
  { value: "Contract_Based", label: "Contract Based" },
  { value: "Part_Time", label: "Part Time" },
  { value: "Full_Time", label: "Full Time" },
];

export const employeeTypeOptions = [
  { value: "Intern", label: "Intern" },
  { value: "Fresher", label: "Fresher" },
  { value: "Experienced", label: "Experienced" },
  { value: "Mid_Senior", label: "Mid Senior" },
  { value: "Senior", label: "Senior" },
];