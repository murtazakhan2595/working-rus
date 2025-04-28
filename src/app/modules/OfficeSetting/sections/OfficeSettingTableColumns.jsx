import dayjs from "dayjs";
import BranchAction from "../Screens/Branches/BranchAction";
import ShiftActions from "./Shift/ShiftActions";
import DepartmentAction from "../Screens/Departments/DepartmentAction";
import { getDepartmentNames } from "app/hooks/employee";
import DesignationAction from "../Screens/Designations/DesignationAction";
import { getDesignations } from "app/hooks/employee";


export const BranchColumn = (reload) => [
  {
    dataField: "id",
    text: "ID",
    dataSort: true,
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

export const DepartmentColumn = (reload) => [
  {
    dataField: "id",
    text: "ID",
  },
  {
    dataField: "name",
    text: "Name",
  },
  {
    dataField: "description",
    text: "Description",
  },
  {
    dataField: "Parent Department",
    text: "Parent Department",
  },
  {
    dataField: "organization",
    text: "Organization",
  },
  {
    text: "Action",
    formatter: (cell, row) => (
      <DepartmentAction
        // setEdit={setEdit}
        // setEditData={setEditData}
        reload={getDepartmentNames}
        
        data={row}
      />
    ),
  },
];
export const DesignationColumn = (reload) => [
  {
    dataField: "id",
    text: "ID",
  },
  {
    dataField: "name",
    text: "Name",
  },
  {
    dataField: "description",
    text: "Description",
  },
  {
    dataField: "organization",
    text: "Organization",
  },
  {
    text: "Action",
    formatter: (cell, row) => (
      <DesignationAction reload={getDesignations} data={row} />
    ),
  },
];


