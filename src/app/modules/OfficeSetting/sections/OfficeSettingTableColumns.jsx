import dayjs from "dayjs";
import BranchAction from "../Screens/Branches/BranchAction";
import GraceTimeAction from "../Screens/GraceTime/GraceTimeAction";
import ShiftActions from "./Shift/ShiftActions";
import DepartmentAction from "../Screens/Departments/DepartmentAction";
import { getDepartmentNames } from "app/hooks/employee";
import DesignationAction from "../Screens/Designations/DesignationAction";
import { getDesignations } from "app/hooks/employee";
import OnboardingActions from "../Screens/OnboardingChecklist/OnboardingActions";
import { FormatID } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";

//
export const BranchColumn = (reload, originalData = []) => [
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
    formatter: (cell, row, rowIndex, data_list) => (
      <BranchAction
        reload={reload}
        data={row}
        BranchList={originalData.length > 0 ? originalData : data_list}
      />
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
    formatter: (cell) =>
      dayjs(cell).isValid() ? dayjs(cell).format("hh:mm A") : "--",
  },
  {
    dataField: "endtime",
    text: "End Time",
    formatter: (cell) =>
      dayjs(cell).isValid() ? dayjs(cell).format("hh:mm A") : "--",
  },
  {
    text: "Action",
    formatter: (cell, row, rowIndex, data_list) => (
      <ShiftActions
        data={row}
        reload={reload}
        ShiftList={originalData.length > 0 ? originalData : data_list}
      />
    ),
  },
];
// Department Column
export const DepartmentColumn = (reload, originalData = []) => [
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
  // {
  //   dataField: "Parent Department",
  //   text: "Parent Department",
  //   dataSort: true,
  // },

  {
    text: "Action",
    formatter: (cell, row, rowIndex, data_list) => (
      <DepartmentAction
        // setEdit={setEdit}
        // setEditData={setEditData}
        reload={reload}
        data={row}
        DepartmentList={originalData.length > 0 ? originalData : data_list}
      />
    ),
  },
];
// Designation Column
export const DesignationColumn = (reload, originalData = []) => [
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
  // {
  //   dataField: "organization",
  //   text: "Organization",
  //   dataSort: true,
  // },
  {
    text: "Action",
    formatter: (cell, row, rowIndex, data_list) => (
      <DesignationAction
        reload={reload}
        data={row}
        DesignationList={originalData.length > 0 ? originalData : data_list}
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
