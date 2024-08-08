import { IoMdArrowDropupCircle } from "react-icons/io";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { FiMinusCircle } from "react-icons/fi";
import { CiViewBoard } from "react-icons/ci";
import { CiCircleMore } from "react-icons/ci";
import { getAllCountries } from "countries-and-timezones";
import {
  fetchDepartments,
  fetchLeaveTypes,
  fetchDesignations,
  fetchProjects,
} from "state/slices/CommonSlice";
import { setUserProfile } from "state/slices/UserSlice.js";
import { fetchEmployees, fetchReportingManagers } from "state/slices/EmpSlice";
import { options } from "joi";

export const countryOptions = Object.keys(getAllCountries()).map(
  (countryCode) => ({
    value: countryCode,
    label: getAllCountries()[countryCode].name,
  })
);

export const tasksTitle = [
  { label: "Task Name", width: "w-44" },

  { label: "Assign By", width: "w-28" },

  { label: "Due Date", width: "w-28" },

  { label: "List", width: "w-28" },

  { label: "Priority", width: "w-28" },
];

export const statusOptions = [
  { value: "To Do", label: "Todo" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

export const visaOptions = [
  { value: 1, label: "Visit Visa" },
  { value: 2, label: "Tourist visa" },
  { value: 3, label: "Residency visa" },
  { value: 4, label: "Golden visa" },
  { value: 5, label: "Green visa" },
];

export const academicOptions = [
  {
    value: "inter",
    label: "Inter",
  },
  {
    value: "bachelors",
    label: "Bachelors",
  },
  {
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

export const HeadOfDepartmentOptions = HeadOfDepartment?.map((manager) => ({
  label: (
    <div>
      <div style={{ fontWeight: "bold", color: "#000", marginTop: "25px" }}>
        {manager?.label?.split(" - ")[0]}
      </div>
      <div style={{ fontSize: "13px", color: "#777", fontWeight: "normal" }}>
        {manager?.label?.split(" - ")[1]}
      </div>
    </div>
  ),
  value: manager.value,
}));

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

export const formatNumber = (num) => {
  // const units = ["", "K", "M", "B", "T", "P", "E", "Z", "Y"];
  // let unit = 0;

  // while (num >= 1000 && unit < units.length - 1) {
  //   num /= 1000;
  //   unit++;
  // }

  // Use Intl.NumberFormat to format the number with 2 decimal places
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  return formattedNumber;

  // return formattedNumber + units[unit];
};

export const PriorityList = [
  {
    value: 3,
    label: (
      <div className="flex items-center gap-x-2 text-baseGray ">
        <IoMdArrowDropdownCircle className="text-2xl" /> Low
      </div>
    ),
  },
  {
    value: 2,
    label: (
      <div className="flex items-center gap-x-2 text-yellow-500">
        <FiMinusCircle className="text-xl" /> Medium
      </div>
    ),
  },
  {
    value: 1,
    label: (
      <div className="flex items-center gap-x-2 text-red-500">
        <IoMdArrowDropupCircle className="text-2xl" /> High
      </div>
    ),
  },
];
export const PriorityListIcons = [
  {
    value: 3,
    label: (
      <div className="flex items-center gap-x-2 text-baseGray ">
        <IoMdArrowDropdownCircle className="text-2xl" />
      </div>
    ),
  },
  {
    value: 2,
    label: (
      <div className="flex items-center gap-x-2 text-yellow-500">
        <FiMinusCircle className="text-xl" />
      </div>
    ),
  },
  {
    value: 1,
    label: (
      <div className="flex items-center gap-x-2 text-red-500">
        <IoMdArrowDropupCircle className="text-2xl" />
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
    minWidth: "8rem",
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
  {
    label: "Sort by date",
    name: "sort_by_date",
    options: [
      { label: "Newest First", value: "dsc" },
      { label: "Oldest First", value: "asc" },
    ],
  },
  {
    label: "Worktype",
    name: "Job_Type",
    options: [
      { label: "Remote", value: "Remote" },
      { label: "Hybrid", value: "Hybrid" },
      { label: "Onsite", value: "Onsite" },
    ],
  },
  {
    label: "Employee Type",
    name: "Employee_Type",
    options: [
      { label: "Full-Time", value: "Full_Time" },
      { label: "Internship", value: "Internees" },
      { label: "Part-time", value: "Part_Time" },
    ],
  },
  {
    label: "Job Level",
    name: "Work_type",
    options: [
      { label: "Senior", value: "Senior_Level" },
      { label: "Mid Level", value: "Mid_Level" },
      { label: "Intern", value: "Internees" },
      { label: "Junior", value: "Junior_Level" },
    ],
  },
];
export const TaskSortingFilters = [
  {
    label: "",
    name: "label",
    options: [
      { label: "Finished", value: "" },
      { label: "Unfinished task", value: "asc" },
    ],
  },
  {
    label: "Members",
    name: "assigned_to",
    options: [
      { label: "No Members", value: "noMember" },
      {
        label: "Selected Members",
        value: "asc",
        options: [{ label: "ajwa", value: "90",name:"ajwa" }, { label: "ali", value: "91",name:"ali" }],
      },
    ],
  },
  {
    label: "Due Date",
    name: "end_date",
    options: [
      { label: "No dates", value: "noDate" },
      { label: "Overdates", value: "overdue" },
      { label: "Due the next day", value: "nextday" },
    ],
  },
  {
    label: "Priority",
    name: "priority",
    options: [
      { label: "No priority", value: "noPriority" },
      { label: "High", value: "1" },
      { label: "Medium", value: "2" },
      { label: "Low", value: "3" },
    ],
  },
];

export const LeaveStatus = [
  { label: "Approved", value: "Approved" },
  { label: "Pending", value: "Pending" },
  { label: "Denied", value: "Denied" },
];

export const resignationStatus = [
  { label: "Pending", value: "pending" },
  { label: "Accepted by Manager", value: "accepted by manager" },
  { label: "Rejected by Manager", value: "rejected by manager" },
  { label: "Accepted by HR", value: "accepted by hr" },
  { label: "Rejected by HR", value: "rejected by hr" },
  { label: "Initiated Clearance", value: "initiated clearance" },
  { label: "Exit Interview", value: "exit interview" },
];

export const terminationStatus = [
  { label: "Viewd By Manager", value: "viwed by manager" },
  { label: "Accepted by Employee", value: "accepted by employee" },
  { label: "Rejected by Employee", value: "rejected by employee" },
];

export function getManagerSelected(managers, managersList) {
  if (managers && managersList && managersList.length > 0) {
    managers = managers.split(", ") || [];
    const matchingObjects = managersList.filter((obj) => {
      return managers.find(
        (element) => parseInt(obj.value) === parseInt(element)
      );
    });
    return matchingObjects;
  }

  return managers;
}

export const handleUpdateProfile = (dispatch, data) => {
  const userprofile = {
    id: data.id,
    username: data.username,
    is_filled: data.is_filled,
    role: data.user_role,
  };
  dispatch(setUserProfile(userprofile));
  dispatch(fetchEmployees());
  dispatch(fetchDepartments());
  dispatch(fetchLeaveTypes());
  dispatch(fetchDesignations());
  dispatch(fetchReportingManagers());
  dispatch(fetchProjects(userprofile));
};
