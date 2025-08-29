import { countries } from "country-data";
import Config from "constants/config";
import { fetchTaskLabels } from "state/slices/TaskManagmentSlice";
import {
  fetchDepartments,
  fetchDesignations,
  fetchProjects,
  fetchBranches,
  fetchCalendarHoliday,
} from "state/slices/CommonSlice";
import {
  fetchModules,
  fetchUserRoles,
  fetchMyPermissions,
  fetchUserPermittedModules,
} from "state/slices/RolePermissionSlice";
import { setUserProfile } from "state/slices/UserSlice.js";
import {
  fetchEmployees,
  fetchReportingManagers,
  fetchEmployeesDetail,
  fetchUser,
} from "state/slices/EmpSlice";
import { fetchDocumentCategory } from "state/slices/HRDocumentsSlice";
import { fetchUserAttendanceDetails } from "state/slices/AttendanceSlice";
import { ArrowDown, ArrowRight, ArrowUp, Timer } from "lucide-react";
import { lightenColor } from "utils/renderValues";

export const countriesCallingCodes = countries.all
  .filter(
    (country) =>
      country.countryCallingCodes && country.countryCallingCodes.length > 0
  )
  .map((country) => ({
    value: parseInt(country.countryCallingCodes[0].replace("+", "")), // Remove any existing plus signs
    label: `${country.name} (+${country.countryCallingCodes[0].replace(
      "+",
      ""
    )})`,
    alpha2: country.alpha2,
  }));

export const countriesList = countries.all.map((country) => {
  return {
    value: country.name,
    label: country.name,
  };
});

export const CurrencyList = countries.all.map((country) => {
  return {
    value: country.currencies[0] ?? "USD",
    label: `${country.currencies[0] ?? "USD"} - ${country.name}`,
    currency: country.currencies[0] ?? "USD",
  };
});

export const ApprovalHierarchyRequestType = [
  ...(Config.MY_LEAVE_TRACKER
    ? [{ label: "Leave", value: "LEAVE_APPLICATION" }]
    : []),
  ...(Config.MY_CLAIMS ? [{ label: "Claims", value: "MY_CLAIMS" }] : []),
  ...(Config.EMPLOYEE_TRANSFER
    ? [{ label: "Transfer Request by Manager", value: "EMPLOYEE_TRANSFER_MANAGER" }]
    : []),
  ...(Config.MY_TRANSFERS
    ? [{ label: "Transfer Request by Employee", value: "EMPLOYEE_TRANSFER_EMPLOYEE" }]
    : []),
  ...(Config.MY_ASSETS ? [{ label: "Assets", value: "MY_ASSETS" }] : []),
  ...(Config.EXIT_CLEARANCE
    ? [{ label: "Temination", value: "EXIT_CLEARANCE_TERMINATION" }]
    : []),
  ...(Config.EXIT_CLEARANCE
    ? [{ label: "Resignation", value: "EXIT_CLEARANCE_RESIGNATION" }]
    : []),
  ...(Config.TIME_ADJUSTMENTS
    ? [{ label: "Time Adjustments", value: "TIME_ADJUSTMENT" }]
    : []),
  ...(Config.MY_ATTENDANCE
    ? [{ label: "Attendance Adjustments", value: "ATTENDANCE_UPDATION" }]
    : []),
  ...(Config.MY_SHIFT_CALENDAR
    ? [{ label: "Employee Shift Schedule", value: "SHIFT_SCHEDULE_EMPLOYEE" }]
    : []),
  ...(Config.SHIFT_CALENDAR
    ? [{ label: "Manager Shift Schedule", value: "SHIFT_SCHEDULE_MANAGER" }]
    : []),
  ...(Config.EMPLOYEE_TRANSFER
    ? [{ label: "Job Rotation By Manager", value: "JOB_ROTATION_MANAGER" }]
    : []),
  ...(Config.EMPLOYEE_TRANSFER
    ? [{ label: "Job Rotation By Employee", value: "JOB_ROTATION_EMPLOYEE" }]
    : []),
];

export const statusOptions = [
  { value: "To Do", label: "Todo" },
  { value: "In Progress", label: "In Progress" },
  { value: "Done", label: "Done" },
];

export const CustomeFieldTypeOption = [
  { value: "INPUT_TEXT", label: "Text" },
  { value: "INPUT_NUMBER", label: "Number" },
  { value: "SELECT_DROPDOWN", label: "Dropdown" },
  { value: "CHECKBOX", label: "Checkbox" },
];

export const DisbursementTypeOptions = [
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "Exchange", label: "Exchange" },
  { value: "Cash", label: "Cash" },
];

export const dateFormats = [
  { label: "YYYY-MM-DD", value: "%Y-%m-%d" },
  { label: "DD-MM-YYYY", value: "%d-%m-%Y" },
  { label: "MM-DD-YYYY", value: "%m-%d-%Y" },
];

export const probationPeriodOptions = [
  { value: "3 month", label: "3 Month" },
  { value: "6 month", label: "6 Month" },
];

export const assetStatus = [
  { value: "Assigned", label: "Assigned" },
  { value: "Unassigned", label: "Unassigned" },
  { value: "Returned", label: "Returned" },
];

export const days = Array?.from({ length: 31 }, (_, index) => {
  const day = index + 1;
  return { label: day, value: `${day}` };
});

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
export const GenderOptions = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

export const BloodGroupOptions = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
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
  { label: "Pending", value: "pending" },
  { label: "Review", value: "review application" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Schedule 1st Interview", value: "interview r1" },
  { label: "Schedule 2nd Interview", value: "interview r2" },
  { label: "Offer Made", value: "offer_made" },
  { label: "Selected", value: "selected" },
  { label: "Onboard", value: "on_board" },
  { label: "Reject", value: "rejected" },
  { label: "Reconsider", value: "reconsider" },
  { label: "Send Email", value: "send_email" },
  { label: "Declined by Candidate", value: "declined" },
  { label: "Offer Accepted", value: "offer_accepted" },
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
  { label: "All", value: "" },
  { label: "Open", value: "live" },
  { label: "Closed", value: "expired" },
];

export const shiftType = [
  {
    label: "Weekdays",
    value: "Weekdays",
  },
  {
    label: "Weekend",
    value: "Weekend",
  },
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
    <div className="flex flex-row gap-2">
      <div className="font-bold text-neutral-1200">
        {manager?.label?.split(" - ")[0]}
      </div>
      <div className="text-sm text-neutral-1100">
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
export const HRDocumentTargetAudience = [
  { value: "All Employees", label: "All Employees" },
  { value: "Department", label: "Department" },
  { value: "Specific Employee", label: "Specific Employee" },
];
export const HRDocumentCategory = [
  { value: "Policy", label: "Policy" },
  { value: "Compliance", label: "Compliance" },
  { value: "Agreement", label: "Agreement" },
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

export const EmployeeTransferStatus = [
  {
    value: "PENDING",
    label: "Pending Approval",
  },
  {
    value: "ACCEPTED BY MANAGER",
    label: "Accepted by manager",
  },
  {
    value: "REJECTED BY MANAGER",
    label: "Rejected by manager",
  },
  {
    value: "APPROVED",
    label: "Approved",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
];

export const PriorityList = [
  {
    value: 3,
    label: (
      <span className="inline-flex items-center justify-center whitespace-nowrap w-fit gap-x-1 text-mauve-900">
        <ArrowDown size={16} /> Low
      </span>
    ),
    name: <span className="text-mauve-900">Low</span>,
  },
  {
    value: 2,
    label: (
      <span className="inline-flex items-center justify-center text-yellow-500 whitespace-nowrap w-fit gap-x-1">
        <ArrowRight size={16} /> Medium
      </span>
    ),
    name: <span className="text-yellow-500">Medium</span>,
  },
  {
    value: 1,
    label: (
      <span className="inline-flex items-center justify-center text-red-500 whitespace-nowrap w-fit gap-x-1">
        <ArrowUp size={16} /> High
      </span>
    ),
    name: <span className="text-red-500">High</span>,
  },
];

export const TaskStatus = [
  {
    value: "TODO",
    label: <span style={{ color: "#FBBF24" }}>Todo</span>,
    color: "#FBBF24",
    backgroundColor: lightenColor("#FBBF24", 85),
  },
  {
    value: "INPROGRESS",
    label: <span style={{ color: "#2e86c1" }}>In Progress</span>,
    color: "#2e86c1",
    backgroundColor: lightenColor("#2e86c1", 85),
  },
  {
    value: "COMPLETED",
    label: <span style={{ color: "#12B76A" }}>Completed</span>,
    color: "#12B76A",
    backgroundColor: lightenColor("#12B76A", 85),
  },
  {
    value: "Onhold",
    label: <span style={{ color: "#B00D1B" }}>On Hold</span>,
    color: "#B00D1B",
    backgroundColor: lightenColor("#B00D1B", 85),
  },
];

// Assignment Scope options
export const assignmentScopeOptions = [
  { value: "DIRECT", label: "Direct Reporting" },
  { value: "INDIRECT", label: "Indirect Reporting" },
  { value: "DESIGNATION", label: "By Designation" },
];

// Clearance status options based on API response
export const clearanceStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROCESS", label: "In Process" },
  { value: "COMPLETED", label: "Completed" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ONHOLD", label: "On Hold" },
];

export const clearanceRequestStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "NOT_APPLICABLE", label: "Not Applicable" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ONHOLD", label: "On Hold" },
];

export const PriorityListIcons = [
  {
    value: 3,
    label: (
      <span className="inline-flex items-center justify-center whitespace-nowrap w-fit gap-x-2 text-mauve-900 ">
        <ArrowDown className="text-2xl " /> Low
      </span>
    ),
  },
  {
    value: 2,
    label: (
      <span className="inline-flex items-center justify-center text-yellow-500 whitespace-nowrap w-fit gap-x-2">
        <ArrowRight className="text-xl" />
        Medium
      </span>
    ),
  },
  {
    value: 1,
    label: (
      <span className="inline-flex items-center justify-center text-red-500 whitespace-nowrap w-fit gap-x-2">
        <ArrowUp className="text-2xl" />
        High
      </span>
    ),
  },
];

export const relationList = [
  {
    value: "WireFrame",
    label: "WireFrame",
  },
  {
    value: "Design",
    label: "Design",
  },
];

export const ProjectStatusList = [
  {
    value: "upcoming",
    label: <div className="text-plum-1100"> Up Coming </div>,
  },
  {
    value: "on_going",
    label: <div className="text-yellow-500">On Going</div>,
  },
  {
    value: "On_hold",
    label: <div className="text-red-500">On Hold</div>,
  },
  {
    value: "completed",
    label: <div className="text-emerald-500">Completed</div>,
  },
  {
    value: "closed",
    label: <div className="text-mauve-900">Closed</div>,
  },
];

export const status2Options = [
  {
    value: "Pending",
    label: (
      <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 rounded-full bg-gray-50 ring-1 ring-inset ring-gray-500/10">
        Pending
      </div>
    ),
  },
  {
    value: "Inprogress",
    label: (
      <div className="items-center px-2 py-1 text-xs font-medium text-yellow-800 rounded-full bginline-flex bg-yellow-50 ring-1 ring-inset ring-yellow-600/20">
        <Timer />
        In Progress
      </div>
    ),
  },
  {
    value: "Done",
    label: (
      <div className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 rounded-full bg-green-50 ring-1 ring-inset ring-green-600/20">
        Done
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
        options: [
          { label: "ajwa", value: "90", name: "ajwa" },
          { label: "ali", value: "91", name: "ali" },
        ],
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

export const terminationStatus = [
  { label: "Viewed By Manager", value: "viewed by manager" },
  { label: "Accepted by Employee", value: "accepted by employee" },
  { label: "Rejected by Employee", value: "rejected by employee" },
];

export const ResignationStatusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Accepted by Manager", value: "accepted by manager" },
  { label: "Rejected by Manager", value: "rejected by manager" },
  { label: "Accepted by HR", value: "accepted by hr" },
  { label: "Rejected by HR", value: "rejected by hr" },
  { label: "Clearance initiated", value: "initiated clearance" },
  { label: "Exit Interview", value: "exit interview" },
];

export const ResignationReasons = [
  { value: "voluntary", label: "Voluntary" },
  { value: "involuntary", label: "Involuntary" },
  {
    value: "end-of-contract",
    label: "End of Contract",
  },
  { value: "retirement", label: "Retirement" },
  { value: "layoff", label: "Layoff" },
  { value: "dismissal", label: "Dismissal" },
  {
    value: "mutual-agreement",
    label: "Mutual Agreement",
  },
  { value: "relocation", label: "Relocation" },
  {
    value: "health-reasons",
    label: "Health Reasons",
  },
  {
    value: "family-reasons",
    label: "Family Reasons",
  },
  { value: "education", label: "Education" },
  {
    value: "others",
    label: "Other",
  },
];

export const NoticePeriod = [
  {
    value: "1 month",
    label: "1 month",
  },
  {
    value: "2 month",
    label: "2 month",
  },
  {
    value: "3 month",
    label: "3 month",
  },
  // {
  //   value: "0 month",
  //   label: "0 month",
  // },
];
export const TerminationStatusOptions = [
  { label: "Viewed By Manager", value: "viewed by manager" },
  { label: "Accepted by Employee", value: "accepted by employee" },
  { label: "Rejected by Employee", value: "rejected by employee" },
  { label: "Clearance initiated", value: "initiated clearance" },
  { label: "Exit Interview", value: "exit interview" },
];

export const SalaryTypeOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "hourly", label: "Per Hour" },
  { value: "project_based", label: "Project based" },
];
export const revisionLetterOptions = [
  { value: "NOT ISSUED", label: "Not Issued" },
  { value: "DRAFT", label: "Draft" },
  { value: "ISSUED", label: "Issued" },
];
export const revisionStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];
export const GlobalStatusOptions = (Records = true) => [
  ...(Records ? [{ value: "PENDING", label: "Pending" }] : []),
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];
export const HRDocumentsStatus = [
  { value: "PENDING", label: "Pending" },
  { value: "VIEWED", label: "Viewed" },
  { value: "ACKNOWLEDGED", label: "Acknowledged" },
  { value: "EXPIRED", label: "Expired" },
];
export const monthsOptions = [
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" },
];

export const payoutPeriodOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "weekly", label: "Weekly" },
  { value: "per_hour", label: "Per Hour" },
];

export const AssetCondition = [
  { label: "New", value: "New" },
  { label: "Used", value: "Used" },
  { label: "Needs Repair", value: "Needs Repair" },
];

export const AssetCategories = [
  { label: "Computer", value: "Computer" },
  { label: "Laptop", value: "Laptop" },
  { label: "Mobile", value: "Mobile" },
  { label: "Printer", value: "Printer" },
  { label: "Networking", value: "Networking" },
  { label: "Accessory", value: "Accessory" },
  { label: "Furniture", value: "Furniture" },
  { label: "Other", value: "Other" },
];

export const ReligionList = [
  { label: "Christianity", value: "Christianity" },
  { label: "Islam", value: "Islam" },
  { label: "Hinduism", value: "Hinduism" },
  { label: "Buddhism", value: "Buddhism" },
  { label: "Judaism", value: "Judaism" },
  { label: "Sikhism", value: "Sikhism" },
  { label: "Jainism", value: "Jainism" },
  { label: "Shinto", value: "Shinto" },
  { label: "Taoism", value: "Taoism" },
  { label: "Confucianism", value: "Confucianism" },
  { label: "Bahá'í Faith", value: "Bahá'í Faith" },
  { label: "Zoroastrianism", value: "Zoroastrianism" },
  {
    label: "Traditional African Religions",
    value: "Traditional African Religions",
  },
  { label: "Indigenous Religions", value: "Indigenous Religions" },
  { label: "Atheism", value: "Atheism" },
  { label: "Agnosticism", value: "Agnosticism" },
  { label: "Non-religious/Secular", value: "Non-religious/Secular" },
  { label: "Other", value: "Other" },
];

export const handleUpdateProfile = async (dispatch, data) => {
  const userprofile = {
    id: data.id,
    username: data.username,
    is_filled: data.is_filled,
    role: data.user_role,
    organization: data.organization,
  };
  await dispatch(setUserProfile(userprofile));
  const ModuleList = await dispatch(fetchModules());
  const MyPermissions = await dispatch(fetchMyPermissions());
  await dispatch(fetchUser(userprofile.id));
  await dispatch(
    fetchUserPermittedModules({
      modules: ModuleList.payload,
      permissions: MyPermissions.payload,
    })
  );
  await dispatch(fetchEmployees());
  dispatch(fetchEmployeesDetail());
  dispatch(fetchBranches());
  dispatch(fetchDepartments());
  dispatch(fetchDesignations());
  await dispatch(fetchCalendarHoliday(userprofile.id));
  await dispatch(fetchDocumentCategory());
  await dispatch(fetchUserRoles());
  dispatch(fetchReportingManagers());
  await dispatch(fetchUserAttendanceDetails(userprofile.id));
  dispatch(fetchTaskLabels());
  await dispatch(fetchProjects(userprofile));
};
