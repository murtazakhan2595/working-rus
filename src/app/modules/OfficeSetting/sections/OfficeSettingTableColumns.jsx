import BranchAction from "../Screens/Branches/BranchAction";
import GraceTimeAction from "../Screens/GraceTime/GraceTimeAction";
import { ShiftActions } from "app/modules/OfficeSetting";
import DepartmentAction from "../Screens/Departments/DepartmentAction";
import DesignationAction from "../Screens/Designations/DesignationAction";
import OnboardingActions from "../Screens/OnboardingChecklist/OnboardingActions";
import { FormatID } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import ClearanceChecklistAction from "../Screens/ClearanceChecklist/ClearanceChecklistAction";
import { DepartmentName } from "utils/getValuesFromTables";

//
export const BranchColumn = (reload) => [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
    formatter: (cell, row) => <FormatID value={cell} prefix={"BR-"} />,
  },
  {
    dataField: "branch_name",
    dataSort: true,
    text: "Name",
  },
  {
    dataField: "branch_number",
    dataSort: true,
    text: "Branch Number",
  },
  {
    dataField: "branch_status",
    text: "Status",
  },

  {
    text: "Action",
    formatter: (_, row, data_list) => (
      <BranchAction reloadData={reload} data={row} BranchList={data_list} />
    ),
    width: "200px",
  },
];
//
export const WorkingHoursColumn = (reload) => [
  {
    dataField: "name",
    text: "Shift Name",
    dataSort: true,
  },
  {
    dataField: "type",
    text: "Shift Type",
    dataSort: true,
  },
  {
    dataField: "starttime",
    text: "Start Time",
    dataSort: true,
    formatter: (cell) => renderDate(cell, "--", "time"),
  },
  {
    dataField: "endtime",
    text: "End Time",
    formatter: (cell) => renderDate(cell, "--", "time"),
    dataSort: true,
  },
  {
    text: "Action",
    formatter: (_, row, data_list) => (
      <ShiftActions data={row} reloadData={reload} ShiftList={data_list} />
    ),
  },
];
// Department Column
export const DepartmentColumn = (reload) => [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
    formatter: (cell, row) => <FormatID value={cell} prefix={"DPT-"} />,
  },
  {
    dataField: "name",
    text: "Name",
    dataSort: true,
  },
  {
    dataField: "description",
    text: "Description",
    dataSort: true,
  },

  {
    text: "Action",
    formatter: (_, row, data_list) => (
      <DepartmentAction
        reloadData={reload}
        data={row}
        DepartmentList={data_list}
      />
    ),
  },
];
// Designation Column
export const DesignationColumn = (reload) => [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
    formatter: (cell, row) => <FormatID value={cell} prefix={"DSG-"} />,
  },
  {
    dataField: "name",
    text: "Name",
    dataSort: true,
  },
  {
    dataField: "description",
    text: "Description",
    dataSort: true,
  },
  {
    text: "Action",
    formatter: (_, row, data_list) => (
      <DesignationAction
        reloadData={reload}
        data={row}
        DesignationList={data_list}
      />
    ),
  },
];
// Onboarding Checklist Column
export const OnboardingChecklistColumn = (reload, originalData = []) => [
  {
    dataField: "name",
    text: "Document Name",
    dataSort: true,
  },
  {
    text: "Action",
    formatter: (cell, row, rowIndex, data_list) => (
      <OnboardingActions
        data={row}
        reload={reload}
        OnboardingList={originalData.length > 0 ? originalData : data_list}
      />
    ),
  },
];

export const GraceTimeColumn = (reload) => [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
    formatter: (cell, row) => <FormatID value={cell} prefix={"GT-"} />,
  },
  {
    dataField: "name",
    dataSort: true,
    text: "Name",
  },
  {
    dataField: "grace_time_minutes",
    text: "Grace Time",
    dataSort: true,
    formatter: (cell) => `${cell}min`,
  },
  {
    dataField: "branches",
    text: "Branch",
    formatter: (cell) => {
      if (!cell || cell.length === 0) {
        return "--";
      }
      return (
        <div className="flex flex-wrap gap-1">
          {cell.map((branch) => (
            <StatusLabel variant={"info"}>
              <BranchName value={branch} />
            </StatusLabel>
          ))}
        </div>
      );
    },
  },
  {
    text: "Action",
    formatter: (_, row, data_list) => (
      <GraceTimeAction reloadData={reload} data={row} DataList={data_list} />
    ),
    width: "80px",
  },
];

export const ClearanceChecklistColumn = (reloadData) => [
  {
    dataField: "id",
    text: "Id",
    sort: true,
    formatter: (cell, row) => <FormatID value={cell} prefix={"CC-"} />,
    headerStyle: {
      width: "80px",
      minWidth: "80px",
    },
  },
  {
    dataField: "name",
    text: "Checklist Name",
    sort: true,
    formatter: (cell) => <span className="font-medium">{cell}</span>,
    headerStyle: {
      minWidth: "180px",
    },
  },
  {
    dataField: "department",
    text: "Department",
    sort: true,
    formatter: (cell) => <DepartmentName value={cell} />,
    headerStyle: {
      minWidth: "130px",
    },
  },
  {
    dataField: "clearance_types",
    text: "Clearance Types",
    sort: false,
    formatter: (cell) => {
      if (!cell || cell.length === 0) {
        return "--";
      }

      const clearanceTypeLabels = {
        job_rotation: "Job Rotation",
        leave_clearance: "Leave Clearance",
        special_leave: "Special Leave",
        internal_transfer: "Internal Transfer",
        external_transfer: "External Transfer",
        resignation: "Resignation",
        termination: "Termination",
      };

      // Show first 2 types and "+X more" if there are more
      const displayTypes = cell.slice(0, 2);
      const remainingCount = cell.length - 2;

      return (
        <div className="flex flex-wrap gap-1">
          {displayTypes.map((type, index) => (
            <StatusLabel key={index} variant={"info"} className="text-xs">
              {clearanceTypeLabels[type] || type}
            </StatusLabel>
          ))}
          {remainingCount > 0 && (
            <StatusLabel variant={"outline"} className="text-xs">
              +{remainingCount} more
            </StatusLabel>
          )}
        </div>
      );
    },
    headerStyle: {
      minWidth: "200px",
    },
  },
  {
    dataField: "assignment_scope",
    text: "Assignment Scope",
    sort: true,
    formatter: (cell) => {
      const scopeLabels = {
        direct: "Direct Reporting",
        indirect: "Indirect Reporting",
      };

      return (
        <StatusLabel variant={"secondary"} className="text-xs">
          {scopeLabels[cell] || cell}
        </StatusLabel>
      );
    },
    headerStyle: {
      minWidth: "140px",
    },
  },
  {
    dataField: "created_by",
    text: "Created By",
    sort: true,
    headerStyle: {
      minWidth: "120px",
    },
  },
  {
    dataField: "created_date",
    text: "Created Date",
    sort: true,
    formatter: (cell) => {
      if (!cell) return "--";
      return new Date(cell).toLocaleDateString();
    },
    headerStyle: {
      minWidth: "120px",
    },
  },
  {
    dataField: "status",
    text: "Status",
    sort: true,
    formatter: (cell) => (
      <StatusLabel variant={cell === "active" ? "success" : "destructive"}>
        {cell === "active" ? "Active" : "Inactive"}
      </StatusLabel>
    ),
    headerStyle: {
      width: "100px",
      minWidth: "100px",
    },
  },
  {
    dataField: "actions",
    text: "Actions",
    sort: false,
    formatter: (cell, row) => (
      <ClearanceChecklistAction data={row} reloadData={reloadData} />
    ),
    headerStyle: {
      width: "80px",
      minWidth: "80px",
    },
  },
];