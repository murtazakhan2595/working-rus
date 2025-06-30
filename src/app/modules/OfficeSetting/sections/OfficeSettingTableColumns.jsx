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
export const WorkingHoursColumn = (reload, originalData = []) => [
  {
    dataField: "name",
    text: "Shift Name",
  },
  {
    dataField: "type",
    text: "Shift Type",
  },
  {
    dataField: "starttime",
    text: "Start Time",
    formatter: (cell) => renderDate(cell, "--", "time"),
  },
  {
    dataField: "endtime",
    text: "End Time",
    formatter: (cell) => renderDate(cell, "--", "time"),
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
