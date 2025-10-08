import BranchAction from "../Screens/Branches/BranchAction";
import GraceTimeAction from "../Screens/GraceTime/GraceTimeAction";
import EvaluationTypeAction from "../Screens/EvaluationType/EvaluationTypeAction";
import RatingScaleSetupAction from "../Screens/RatingScaleSetup/RatingScaleSetupAction";
import { ShiftActions } from "app/modules/OfficeSetting";
import { CurrencyActions } from "app/modules/OfficeSetting/Screens";
import DepartmentAction from "../Screens/Departments/DepartmentAction";
import DesignationAction from "../Screens/Designations/DesignationAction";
import OnboardingActions from "../Screens/OnboardingChecklist/OnboardingActions";
import { FormatID, EmployeeName, EmployeeUsername } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import ClearanceChecklistAction from "../Screens/ClearanceChecklist/ClearanceChecklistAction";
import { MultiStatusLabel } from "components";

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

export const CurrencysColumns = (reload) => [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
    formatter: (cell, row) => <FormatID value={cell} prefix={"CUR-"} />,
  },
  {
    dataField: "name",
    dataSort: true,
    text: "Name",
  },
  {
    dataField: "code",
    dataSort: true,
    text: "Code",
  },
  {
    text: "Action",
    formatter: (_, row, data_list) => (
      <CurrencyActions reloadData={reload} data={row} DataList={data_list} />
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
    formatter: (cell, row) => <FormatID value={cell} prefix={"RSS-"} />,
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

export const EvaluationTypeColumn = (reload) => [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
    formatter: (cell) => <FormatID value={cell} prefix={"EVT-"} />,
  },
  {
    dataField: "name",
    dataSort: true,
    text: "Name",
  },
  {
    dataField: "description",
    text: "Description",
    maxWidth: '200px'
  },
  {
    dataField: "created_by",
    text: "Created By",
    formatter: (cell) => (
      <div className="flex flex-col gap-1">
        <span>
          <EmployeeName value={cell} />
        </span>
        <span className="text-neutral-800 text-xs">
          (<EmployeeUsername value={cell} fallBackText={"--"} />)
        </span>
      </div>
    ),
  },
  {
    dataField: "created_at",
    text: "Created At",
    formatter: (cell) => renderDate(cell)
  },
  {
    text: "Action",
    formatter: (_, row, data_list) => (
      <EvaluationTypeAction reloadData={reload} data={row} DataList={data_list} />
    ),
    width: "80px",
  },
];

export const RatingScaleSetupColumn = (reload) => [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
    formatter: (cell) => <FormatID value={cell} prefix={"EVT-"} />,
  },
  {
    dataField: "name",
    dataSort: true,
    text: "Name",
  },
  {
    dataField: "scale_type",
    text: "Scale Type",
    dataSort: true,
    formatter: (cell) => <div className="text-capitalize">{cell}</div>,
  },
  {
    dataField: "created_by",
    text: "Created By",
    formatter: (cell) => (
      <div className="flex flex-col gap-1">
        <span>
          <EmployeeName value={cell} />
        </span>
        <span className="text-neutral-800 text-xs">
          (<EmployeeUsername value={cell} fallBackText={"--"} />)
        </span>
      </div>
    ),
  },
  {
    text: "Action",
    formatter: (_, row, data_list) => (
      <RatingScaleSetupAction reloadData={reload} data={row} DataList={data_list} />
    ),
    width: "80px",
  },
];

export const ClearanceChecklistColumn = (
  reloadData,
  departments = [],
  clearanceTypes = []
) => [
    {
      dataField: "id",
      text: "Id",
      sort: true,
      formatter: (cell, row) => <FormatID value={cell} prefix={"CC-"} />,
    },
    {
      dataField: "name",
      text: "Checklist Name",
      sort: true,
      formatter: (cell) => <span className="font-medium">{cell}</span>,
    },
    {
      dataField: "department",
      text: "Departments",
      sort: false,
      formatter: (cell) => {
        if (!cell || cell.length === 0) {
          return "--";
        }
        const departmentNames = cell
          .map((deptId) => {
            const dept = departments.find(
              (d) => d.value === deptId || d.id === deptId
            );
            return dept.label || dept.name;
          })
          .filter(Boolean); // Remove any null/undefined values
        return (
          <MultiStatusLabel
            statusList={departmentNames}
            variant="info"
            fallBackText="All Departments"
            displayCount={2} // Show first 2 departments, then +X more
          />
        );
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
        const clearanceTypeNames = cell
          ?.map((typeId) => {
            const type = clearanceTypes.find(
              (t) => t?.value === typeId || t?.id === typeId
            );
            return type?.label || type?.name;
          })
          ?.filter(Boolean);
        return (
          <MultiStatusLabel
            statusList={clearanceTypeNames}
            variant="info"
            fallBackText="All Clearance Types"
            displayCount={2} // Show first 2 types, then +X more
          />
        );
      },
    },
    {
      dataField: "assignment_scope",
      text: "Assignment Scope",
      sort: true,
      formatter: (cell) => {
        return <div>{cell}</div>;
      },
    },
    {
      dataField: "created_by_name",
      text: "Created By",
      formatter: (cell) => {
        return <div>{cell}</div>;
      },
      sort: true,
    },
    {
      dataField: "created_date",
      text: "Created Date",
      sort: true,
      formatter: (cell) => {
        if (!cell) return "--";
        return new Date(cell).toLocaleDateString();
      },
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: (cell) => (
        <StatusLabel variant={cell === "ACTIVE" ? "success" : "destructive"}>
          {cell === "ACTIVE" ? "Active" : "Inactive"}
        </StatusLabel>
      ),
    },
    {
      dataField: "actions",
      text: "Actions",
      sort: false,
      formatter: (cell, row) => (
        <ClearanceChecklistAction data={row} reloadData={reloadData} />
      ),
    },
  ];