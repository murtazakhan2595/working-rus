import dayjs from "dayjs";
import BranchAction from "../Screens/Branches/BranchAction";
import ShiftActions from "./Shift/ShiftActions";
import DepartmentAction from "../Screens/Departments/DepartmentAction";
import { getDepartmentNames } from "app/hooks/employee";
import DesignationAction from "../Screens/Designations/DesignationAction";
import { getDesignations } from "app/hooks/employee";
import OnboardingActions from "../Screens/OnboardingChecklist/OnboardingActions";
import { FormatID } from "utils/getValuesFromTables";

// 
export const BranchColumn = (reload) => [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
    formatter: (cell, row) => <FormatID value={cell} prefix={'BR-'} />,
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
    formatter: (cell, row) => <BranchAction reload={reload} data={row} />,
      width: '200px',
  },
];
// 
export const WorkingHoursColumn = (reload) => [
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
    formatter: (cell, row) => <ShiftActions data={row} reload={reload} />,
  },
];
// Department Column
export const DepartmentColumn = (reload) => [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
    formatter: (cell, row) => <FormatID value={cell} prefix={'DPT-'} />,
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
    formatter: (cell, row) => (
      <DepartmentAction
        // setEdit={setEdit}
        // setEditData={setEditData}
        reload={reload}
        data={row}
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
    formatter: (cell, row) => <FormatID value={cell} prefix={'DSG-'} />,
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
    formatter: (cell, row) => (
      <DesignationAction reload={reload} data={row} />
    ),
  },
];
// Onboarding Checklist Column
export const OnboardingChecklistColumn = (reload) => [
  {
    dataField: "name",
    text: "Document Name",
  },
  {
    text: "Action",
    formatter: (cell, row) => (
      <OnboardingActions data={row} reload={reload} />
    ),
  },
];