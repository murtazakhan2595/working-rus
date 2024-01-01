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
  { value: 3, label: "🟢 Low" },
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
  { to: "/employees", text: "Employee Sheet", icon: <BiSpreadsheet /> },
  { to: "/jobs", text: "Recruitment", icon: <MdOutlinePayment /> },
  { to: "", text: "Performance", icon: <PiShootingStarBold /> },
];


export const jobTypeOptions = [
  { value: "Remote", label: "Remote" },
  { value: "Onsite", label: "Onsite" },
  { value: "Hybrid", label: "Hybrid" },

];
 
export const workTypeOptions = [
  { value: "Internees", label: "Internees" },
  { value: "Junior_Level", label: "Junior Level" },
  { value: "Mid_Level", label: "Mid Level" },
  { value: "Mid_Senior", label: "Mid Senior Level" },
  { value: "Senior_Level", label: "Senior Level" },
];

 
export const employeeTypeOptions = [
  { value: "Internees", label: "Intern" },
  { value: "Part_Tiime", label: "Part Time" },
  { value: "Full_Time", label: "Full Time" },
  { value: "Contract", label: "Contract" },
  { value: "Freelancer", label: "Freelancer" },
];
 
export const educationTypeOptions = [
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
  { value: "Intermediate", label: "Intermediate" },
];

export const locationTypeOptions = [
  { value: "pakistan", label: "Pakistan" },
  { value: "india", label: "India" },
  { value: "uae", label: "UAE" },
];

export const dropdownOptions = [
  "selected",
  "shortlisted",
  "offer_made",
  "on_board",
  "declined",
  "contacted",
  "rejected",
];
