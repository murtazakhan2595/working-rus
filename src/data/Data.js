import { LiaHomeSolid } from "react-icons/lia";
import { MdOutlinePayment } from "react-icons/md";
import { LiaWpforms } from "react-icons/lia";
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
  { value: 2, label: "🟡 Medium" },
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
  { to: "/emp-data", text: "Emp Sheet", icon: <BiSpreadsheet /> },
  { to: "", text: "Pay", icon: <MdOutlinePayment /> },
  { to: "", text: "Performance", icon: <PiShootingStarBold /> },
];
