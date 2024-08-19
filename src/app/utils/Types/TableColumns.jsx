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
import moment from "moment";
import RenderEmployeesLeaveAllotement from "app/modules/LeaveManagment/Screens/RenderEmployeesLeaveAllotement";
import { IoIosArrowDown } from "react-icons/io";
import { downloadCV } from "app/hooks/recruitment";
import { AiOutlineDownload } from "react-icons/ai";
import {
  ResignationStatusView,
  RenderTerminatedRow,
  RenderResignedRow,
  RenderResignationAction,
} from "app/modules/ExitAndClearance/Sections";
import { IoBagCheckOutline } from "react-icons/io5";
import ApplicationStatus from "app/modules/EmployeesExit/sections/ApplicationStatus";
import RenderExitTableAction from "app/modules/EmployeesExit/sections/RenderExitTableAction";
import { MdOutlineFileDownload } from "react-icons/md";
import { filebase64Download } from "utils/fileUtils";

export const LeaveHistoryColumns = (updateLeaveType) => [
  {
    dataField: "name",
    text: "Employees",
    formatter: (cell, row) => (
      <EmployeeNameInfo
        name={`${row.first_name} ${row.last_name}`}
        department={row.department_name}
        position={row.department_position}
      />
    ),
  },
  {
    dataField: "id",
    text: "ID",
    formatter: (cell, row) => <EmployeeID value={cell} />,
  },
  {
    dataField: "direct_report",
    text: "Report To",
    formatter: (cell, row) => <ManagerName value={cell} />,
  },
  {
    dataField: "leaveTypes",
    text: "Leaves Type",
    formatter: (cell, row) => (
      <RenderLeaveType row={row} updateLeaveType={updateLeaveType} />
    ),
  },
  {
    dataField: "allotedLeaves",
    text: "Leaves Alloted",
  },
  {
    dataField: "usedLeaves",
    text: "Leaves Used",
  },
  {
    dataField: "remainingLeaves",
    text: "Remaining Leaves",
  },
  {
    dataField: "",
    text: "",
    formatter: (cell) => <IoIosArrowDown className="cursor-pointer" />,
    roWExpandOnClick: true,
  },
];

export const EmployeeColumns = [
  {
    dataField: "id",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
  },
  {
    dataField: "name",
    text: "Employees",
    width: "25%",
    formatter: (cell, row) => (
      <EmployeeNameInfo
        name={`${row.first_name} ${row.last_name}`}
        department={row.department_name}
        position={row.department_position}
      />
    ),
  },

  {
    dataField: "user_role",
    text: "Role",
    formatter: (cell, row) => <UserRole value={cell} />,
  },
  {
    dataField: "username",
    text: "Username",
  },
  {
    dataField: "phone",
    text: "Phone no/Email",
    formatter: (cell, row) => (
      <>
        <div className="text-base">{row.mobile_no || ""}</div>
        <div className="text-base">{row.work_email || ""}</div>
      </>
    ),
  },
  {
    dataField: "employee_status",
    text: "Status",
  },
  {
    dataField: "",
    text: "",
    formatter: (cell, row) => <EmployeeAction row={row} />,
  },
];

export const MyLeavesColumns = [
  {
    dataField: "start_date",
    text: "Start Date",
    formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
  },
  {
    dataField: "end_date",
    text: "End Date",
    formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
  },
  {
    dataField: "leave_component_name",
    text: "Leave Type",
  },

  {
    dataField: "total_leave",
    text: "Total Days",
  },
  {
    dataField: "status_hr",
    text: "Status",
    formatter: (cell) => <StatusLabel status={Status(cell)} />,
  },
  {
    dataField: "",
    text: "",
    formatter: (cell, row) => <RenderStatus row={row} />,
  },
];

export const EmployeeResignationsColumns = (handleRowClicked, reload) => {
  const columns = [
    {
      dataField: "emp_name",
      text: "Employees",
      formatter: (cell, row) => (
        <EmployeeNameInfo
          name={cell}
          department={
            row.department_name && row.department_name?.length > 0
              ? row.department_name[0]
              : ""
          }
          position={
            row.department_position && row.department_position?.length > 0
              ? row.department_position[0]
              : ""
          }
        />
      ),
      onClick: (recordIndex, data, row) => {
        handleRowClicked(recordIndex, data, row);
      },
    },
    {
      dataField: "employee_id",
      text: "ID",
      formatter: (cell) => <EmployeeID value={cell} />,
    },
    {
      dataField: "report_to",
      text: "Report To",
      formatter: (cell, row) => <ManagerName value={cell} />,
    },
    {
      dataField: "notice_period",
      text: "Notice Period",
    },
    {
      dataField: "exit_date",
      text: "Exit date",
      formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
    },
    {
      dataField: "",
      text: "Application",
      formatter: (cell, row) => (
        <>
          {row?.resignation_letter ? (
            <div className="justify-start items-center gap-2.5 inline-flex">
              <div className="text-[#5c5e64] text-base font-normal">File</div>
              <button
                onClick={() =>
                  filebase64Download(row?.resignation_letter, row?.emp_name)
                }
              >
                <AiOutlineDownload />
              </button>
            </div>
          ) : (
            "N/A"
          )}
        </>
      ),
    },
    {
      dataField: "status_resignation",
      text: "Status",
      formatter: (cell, row) => <ResignationStatusView row={row} />,
    },
    {
      dataField: "",
      text: "Action",
      formatter: (cell, row) => (
        <RenderResignationAction row={row} reload={reload} />
      ),
    },
  ];
  return columns;
};

export const ExitRequestColumns = (
  handleOptionSelect,
  handleRowClicked,
  reload,
  hideAction = false
) => {
  const columns = [
    {
      dataField: "emp_name",
      text: "Employees",
      onClick: (recordIndex, data, row) => {
        handleRowClicked(recordIndex, data, row);
      },
    },
    {
      dataField: "employee_id",
      text: "ID",
      formatter: (cell) => <EmployeeID value={cell} />,
    },
    {
      dataField: "report_to",
      text: "Report To",
      formatter: (cell, row) => <ManagerName value={cell} />,
    },
    {
      dataField: "notice_period",
      text: "Notice Period",
    },
    {
      dataField: "exit_date",
      text: "Exit date",
    },
    {
      dataField: "",
      text: "Application",
      formatter: (cell, row) => (
        <>
          {row?.resignation_letter ? (
            <div className="justify-start items-center gap-2.5 inline-flex">
              <div className="text-[#5c5e64] text-base font-normal">File</div>
              <button
                onClick={() => filebase64Download(row?.resignation_letter)}
              >
                <AiOutlineDownload />
              </button>
            </div>
          ) : (
            "N/A"
          )}
        </>
      ),
    },
    {
      dataField: "status_resignation",
      text: "Status",
      formatter: (cell, row) => (
        <ApplicationStatus row={row} isTableViewButton={true} />
      ),
    },
  ];

  // Conditionally add the Action column if hideAction is false
  if (!hideAction) {
    columns.push({
      dataField: "",
      text: "Action",
      formatter: (cell, row) => (
        <RenderExitTableAction
          row={row}
          handleOptionSelect={handleOptionSelect}
          reload={reload}
          isTableStyle={true}
        />
      ),
    });
  }

  return columns;
};

export const AllJobApplicationColumns = (
  handleOptionSelect,
  setViewApplicationDetails
) => [
  {
    dataField: "id",
    text: "Candidate ID",
    formatter: (cell, row) => <EmployeeID value={cell} />,
  },
  {
    dataField: "first_name",
    text: "Candidate",
    formatter: (cell, row) => (
      <>
        <div className="text-base text-[#323333] cursor-pointer">
          {cell} {row.last_name}
        </div>
        <div className="font-lato text-base text-baseGray">
          {`Exp. ${row?.Year_of_Experience} years`}
        </div>
      </>
    ),
    onClick: (index, list) => {
      setViewApplicationDetails({ index, list });
    },
  },
  {
    dataField: "phone_number",
    text: "Phone no/Email",
    formatter: (cell, row) => (
      <>
        <div className="text-base font-lato">{cell || ""}</div>
        <div className="text-base font-lato">{row.email || ""}</div>
      </>
    ),
  },
  {
    dataField: "current_salary",
    text: "Current Salary",
    formatter: (cell) => <>{formatNumber(cell)}</>,
  },
  {
    dataField: "expected_salary",
    text: "Expected Salary",
    formatter: (cell) => <>{formatNumber(cell)}</>,
  },
  {
    dataField: "updated_at",
    text: "Applied On",
    formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
  },
  {
    dataField: "",
    text: "Resume",
    formatter: (cell, row) => (
      <>
        <div className="flex gap-x-2 items-center justify-center">
          <span title={row?.cv} className="font-lato text-base text-baseGray">
            File
          </span>
          <button onClick={() => downloadCV(row?.cv, row?.first_name)}>
            <AiOutlineDownload />
          </button>
        </div>
      </>
    ),
  },
  {
    dataField: "application_status",
    text: "Status",
    formatter: (cell) => {
      const role = dropdownOptions.find((obj) => obj.value === cell);
      return <StatusLabel status={role?.label} />;
    },
  },
  {
    dataField: "",
    text: "",
    formatter: (cell, row) => (
      <RenderJobApplicationActions
        row={row}
        handleOptionSelect={handleOptionSelect}
      />
    ),
  },
];

export const AllLeavesApplicationColumns = (reload, userRole) => {
  const columns = [
    {
      dataField: "employee_id",
      text: "Employees",
      formatter: (cell, row) => (
        <EmployeeNameInfo
          name={`${row.name}`}
          department={row.department_name}
          position={row.position}
        />
      ),
    },
    {
      dataField: "employee_id",
      text: "ID",
      formatter: (cell, row) => <EmployeeID value={cell} />,
    },
    {
      dataField: "report_to",
      text: "Report To",
      formatter: (cell, row) => <ManagerName value={cell} />,
    },
    {
      dataField: "leave_component_name",
      text: "Leave Type",
    },
    {
      dataField: "total_leave",
      text: "No. of Leaves",
    },
    {
      dataField: "start_date",
      text: "Start Date",
      formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
    },
    {
      dataField: "end_date",
      text: "End Date",
      formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
    },
    {
      dataField: "status_hr",
      text: "Status",
      formatter: (cell) => <StatusLabel status={Status(cell)} />,
    },
    {
      dataField: "",
      text: "",
      formatter: (cell, row) => <RenderStatus row={row} />,
    },
  ];
  if (userRole === 1 || userRole === 3) {
    columns.push({
      dataField: "action",
      text: "Action",
      formatter: (cell, row) => <RenderLeaveAction row={row} reload={reload} />,
    });
  }

  return columns;
};

export const LeaveAllotmentColumns = (reload) => [
  {
    dataField: "employee_id",
    text: "",
    formatter: (cell, row, list) => (
      <RenderEmployeesLeaveAllotement
        employee={row}
        employeeList={list}
        reload={reload}
      />
    ),
  },
];

export const ExitTerminatedColumns = (reload) => [
  {
    dataField: "employee_id",
    text: "",
    formatter: (cell, row, list) => (
      <RenderTerminatedRow
        terminatedEmployee={row}
        terminatedEmployeeList={list}
        reload={reload}
      />
    ),
  },
];
export const ExitResignedColumns = [
  {
    dataField: "employee_id",
    text: "",
    formatter: (cell, row, list) => (
      <RenderResignedRow
        resignedEmployee={row}
        resignedEmployeeList={list}
      />
    ),
  },
];
