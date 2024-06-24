import { IoMdArrowDropupCircle } from "react-icons/io";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { FiMinusCircle } from "react-icons/fi";
import { CiViewBoard } from "react-icons/ci";
import { CiCircleMore } from "react-icons/ci";
import { getAllCountries } from "countries-and-timezones";

export const countryOptions = Object.keys(getAllCountries()).map((countryCode) => ({
  value: countryCode,
  label: getAllCountries()[countryCode].name,
}));


export const tasksTitle = [
  { label: "Task Name", width: "w-44" },

  { label: "Assign By", width: "w-28" },

  { label: "Due Date", width: "w-28" },

  { label: "List", width: "w-28" },

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

export const visaOptions = [
  { value: "Visit", label: "Visit Visa" },
  { value: "Tourist", label: "Tourist visa" },
  { value: "Residency", label: "Residency visa" },
  { value: "Golden", label: "Golden visa" },
  { value: "Green", label: "Green visa" },
];

export const academicOptions = [
  {
    value: "inter",
    label: "Inter",
  }, {
    value: "bachelors",
    label: "Bachelors",
  }, {
    value: "masters",
    label: "Masters",
  },
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
  { value: "Part_Time", label: "Part Time" },
  { value: "Full_Time", label: "Full Time" },
  { value: "Contract", label: "Contract" },
  { value: "Freelancer", label: "Freelancer" },
];

export const educationTypeOptions = [
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
  { value: "Intermediate", label: "Intermediate" },
];

export const maritalStatus = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
];

export const locationTypeOptions = [
  { value: "pakistan", label: "Pakistan" },
  { value: "india", label: "India" },
  { value: "uae", label: "UAE" },
];

export const dropdownOptions = [
  { label: "Selected", value: "selected" },
  { label: "Pending", value: "pending" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Offer Made", value: "offer_made" },
  { label: "Onboard", value: "on_board" },
  { label: "Declined", value: "declined" },
  { label: "Contacted", value: "contacted" },
  { label: "Rejected", value: "rejected" },
  { label: "Interview R1 ", value: "interview r1" },
  { label: "Interview R2 ", value: "interview r2" },
  { label: "Interview R3 ", value: "interview r3" },
  { label: "Assessment", value: "assessment" },
];

export const filterDropdownOptions = [
  { label: "Pending", value: "pending" },
  { label: "Selected", value: "selected" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Offer Made", value: "offer_made" },
  { label: "Onboard", value: "on_board" },
  { label: "Declined", value: "declined" },
  { label: "Contacted", value: "contacted" },
  { label: "Rejected", value: "rejected" },
  { label: "Interview R1 ", value: "interview r1" },
  { label: "Interview R2 ", value: "interview r2" },
  { label: "Interview R3 ", value: "interview r3" },
  { label: "Assessment", value: "assessment" },
  { label: "All", value: "" },
];

export const jobsStatusOptions = [
  { label: "Show All", value: "" },
  { label: "Live", value: "live" },
  { label: "Expired", value: "expired" },
];

export const HeadOfDepartment = [
  { label: "Naveed Rahman - CEO", value: "Naveed" },
  { label: "Komal Zaman - Peoples Teams Head", value: "Komal" },
  { label: "Farhan Hayder  - HR Manager", value: "Farhan" },
  { label: "Arshad Ali - BD & Sales", value: "Arshad Ali" },
  { label: "Haris Zaheer - Pre-Sales", value: "Haris" },
  { label: "Sadia Sharafat - Project Management", value: "Sadia" },
  { label: "Asra Fatima - Front End Lead", value: "Asra" },
  { label: "Muhammad Shujat Hussain - Backend Lead", value: "Shujat" },
  { label: "Faisal Iqbal - Operations", value: "Faisal" },
  { label: "Imran Shafi - Marketing", value: "Imran" },
  { label: "Prakash PV - VP Sales", value: "Prakash" },
];

export const UserRoles = [
  { value: 1, label: "Super Admin" },
  { value: 2, label: "Manager" },
  { value: 3, label: "HR" },
  { value: 4, label: "Employee" },
];

export const employeeStatus = [
  { label: "Active", value: "Active" },
  { label: "Terminated", value: "Terminated" },
  { label: "Deceased", value: "Deceased" },
  { label: "Resigned", value: "Resigned" },
  { label: "Probation", value: "Probation" },
  { label: "Notice Period", value: "Notice Period" },
  { label: "Exit", value: "Exit" },
  { label: "Absconded", value: "Absconded" },
  { label: "Legal Case", value: "Legal Case" },
];

export const jobRoles = [
  { label: "Intern", value: "Intern" },
  { label: "Part-Time", value: "Part-Time" },
  { label: "Full-Time", value: "Full-Time" },
  { label: "Contract", value: "Contract" },
  { label: "Freelancer", value: "Freelancer" },
];

export const department = [
  { label: "Project Management", value: "Project_management" },
  { label: "Sales", value: "Sales" },
  { label: "Operations", value: "Operations" },
  { label: "Design", value: "Design" },
  { label: "Marketing", value: "Marketing" },
  { label: "Frontend", value: "Frontend" },
  { label: "Backend", value: "Backend" },
  { label: "Presales", value: "Presales" },
  { label: "HR", value: "HR" },
  { label: "Accounts", value: "Accounts" },
];

export const typeOptions = [
  {
    value: "Project",
    label: (
      <div className="flex items-center gap-x-2">
        <CiViewBoard className="text-2xl text-[#FF61C0]" />
        Project
      </div>
    ),
  },
  {
    value: "Miscellaneous",
    label: (
      <div className="flex items-center gap-x-2">
        <CiCircleMore className="text-2xl text-[#935AF2]" />
        Miscellaneous
      </div>
    ),
  },
];

export const priority2Options = [
  {
    value: "Low",
    label: (
      <div className="flex items-center gap-x-2 text-baseGray ">
        <IoMdArrowDropdownCircle className="text-2xl" /> Low
      </div>
    ),
  },
  {
    value: "Medium",
    label: (
      <div className="flex items-center gap-x-2 text-yellow-500">
        <FiMinusCircle className="text-xl" /> Medium
      </div>
    ),
  },
  {
    value: "High",
    label: (
      <div className="flex items-center gap-x-2 text-red-500">
        <IoMdArrowDropupCircle className="text-2xl" /> High
      </div>
    ),
  },
];

export const status2Options = [
  {
    value: "Pending",
    label: (
      <div className="bg-[#DADADA] text-[#5C5E64] rounded-md py-0.5 px-2">
        Pending
      </div>
    ),
  },
  {
    value: "Inprogress",
    label: (
      <div className="bg-[#FFE8CD] text-[#FF9A1F] rounded-md py-0.5 px-2">
        In Progress
      </div>
    ),
  },
  {
    value: "Completed",
    label: (
      <div className="bg-[#CCEFE3] text-[#5B8C7B] rounded-md py-0.5 px-2">
        Completed
      </div>
    ),
  },
];

export const workplaceTypes = [
  { label: "Remote", value: "REMOTE" },
  { label: "Work from home", value: "Work_From_Home" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "Onsite", value: "ON_SITE" },
];

export const dropdownStyles = {
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#fafbfc",
    border: "none",
    boxShadow: "none",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "16px",
    fontWeight: state.isSelected ? "bold" : "normal",
    color: state.isSelected ? "#000" : "#777",
    padding: "8px 12px",
    backgroundColor: state.isSelected ? "#FAFBFC" : "#FAFBFC",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    overflow: "hidden",
  }),
  scrollbarWidth: (base) => ({
    ...base,
    borderRadius: "8px",
    backgroundColor: "#FAFBFC",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#555",
  }),
};

export const JobSortingFilters = [
  { label: 'Sort by date', name: "updated_at", options: [{ label: 'Newest First', value: 'newest_first' }, { label: "Oldest First", value: 'oldest_first' }] },
  { label: 'Worktype', name: "Job_Type", options: [{ label: 'Remote', value: 'Remote' }, { label: "Hybrid", value: 'Hybrid' }, { label: "Onsite", value: 'Onsite' }] },
  { label: 'Employee Type', name: "Employee_Type", options: [{ label: 'Full-Time', value: 'Full_Time' }, { label: "Internship", value: 'Internees' }, { label: "Part-time", value: 'Part_Time' }] },
  { label: 'Job Level', name: "Work_type", options: [{ label: 'Senior', value: 'Senior_Level' }, { label: "Mid Level", value: 'Mid_Level' }, { label: "Intern", value: 'Internees' }, { label: "Junior", value: 'Junior_Level' }] },

];
