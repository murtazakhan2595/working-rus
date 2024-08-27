import FormateLeaveTrackerName from "app/modules/Dashboard/Screens/FormateLeaveTrackerName";
import {
  EmployeeID,
  ManagerName,
  LeaveType,
  LeaveTypeOfEmployee,
  UserRole,
} from "utils/getValuesFromTables";
import { RenderJobApplicationActions } from "app/modules/RecruitmentData/Applications/Sections";
import { dropdownOptions, formatNumber } from "data/Data";
import { EmployeeNameInfo, StatusLabel } from "components";
import EmployeeAction from "app/modules/Employees/Screens/Sections/EmployeeActions";
import {
  Status,
  RenderStatus,
  RenderLeaveType,
  RenderLeaveAction,
} from "app/modules/LeaveManagment/Sections";
import {RenderJobTitle} from "app/modules/Dashboard/Screens/TalentSphere/Sections";
import moment from "moment";
import RenderEmployeesLeaveAllotement from "app/modules/LeaveManagment/Screens/RenderEmployeesLeaveAllotement";
import { IoIosArrowDown } from "react-icons/io";
import { downloadCV } from "app/hooks/recruitment";
import { AiOutlineDownload } from "react-icons/ai";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { IoBagCheckOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { ExternalLink, } from "lucide-react";
export const DashbaordJobApplicationColumns = (navigate) => [
  {
    dataField: "id",
    text: "Open Jobs",
    formatter: (cell, row) => <RenderJobTitle row={row} />,
    width: "40%",
  },

  {
    dataField: "total_applications",
    text: "Applications",
    formatter: (cell, row) => (
      <div className="">
        {cell}
      </div>
    ),
  },
  {
    dataField: "Deadline",
    text: "Expiry Date",
    formatter: (cell) => <>{moment(cell).format("DD MMM YYYY")}</>,
  },
  {
    dataField: "id",
    text: "Links",
    formatter: (cell, row, list) => (
      <Link
        className=""
        to={`/job-description/${cell}`}
      >
        <ExternalLink/>
       
      </Link>
    ),
  },
];

export const DashboardLeaveTrackerColumns = [
  {
    dataField: "id",
    text: "Employee",
    formatter: (cell, row) => (
      <EmployeeNameInfo
        name={`${row.name}`}
        department={row.department_name}
        position={row.position}
      />
    ),
    width: "45%",
  },
  {
    dataField: "date",
    text: "Date",
    formatter: (cell) => (
      <div className="text-[#5c5e64] text-sm font-normal  leading-[18px]">
        {moment(cell).format("DD MMM YYYY")}
      </div>
    ),
  },
  {
    dataField: "status_hr",
    text: "Status",
    formatter: (cell) => <StatusLabel status={Status(cell)} />,
  },
];
