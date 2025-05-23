import {
  FormatID,
  EmployeeUsername,
  ApprovalHierarchyRequestTypeName,
} from "utils/getValuesFromTables";
import {
  ApprovalHierarchyActions,
  ApprovalHierarchyLogsActions,
  ApprovalHierarchyLevelActions
} from "app/modules/ApprovalHierarchy/Sections";

import { renderDate } from "utils/renderValues";
import { BranchName } from "utils/getValuesFromTables";
import { UserRole } from "utils/getValuesFromTables";
import { SwitchInput } from "components/FormControl";
import { DesignationName } from "utils/getValuesFromTables";
import { EmployeeName } from "utils/getValuesFromTables";
import { StatusLabel } from "components";
import { DepartmentName } from "utils/getValuesFromTables";

export const ApprovalHierarchyColumn = (reload = () => {}) => [
  // {
  //   dataField: "id",
  //   text: "ID",
  //   dataSort: true,
  //   formatter: (cell, row) => <FormatID value={cell} prefix={"APH-"} />,
  // },
  {
    dataField: "name",
    text: "Hierarchy Name",
    dataSort: true,
    maxWidth: "200px",
  },
  {
    dataField: "request_type",
    text: "Request Type",
    dataSort: true,
    formatter: (cell) => (
      <ApprovalHierarchyRequestTypeName value={cell} fallBackText={"--"} />
    ),
  },
  {
    dataField: "auto_forward_enabled",
    text: "Auto Forward",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel variant="info">{cell ? "Enabled" : "Disabled"}</StatusLabel>
    ),
  },
  {
    text: "Action",
    formatter: (cell, row, data_list) => (
      <ApprovalHierarchyActions
        data={row}
        reloadData={reload}
        ApprovalHierarchyList={data_list}
      />
    ),
    classes: "text-center",
    headerClasses: "text-center",
  },
];

export const HierarchyLevelsColumn = (reload = () => {}) => [
  // {
  //   dataField: "id",
  //   text: "ID",
  //   dataSort: true,
  //   formatter: (cell, row) => <FormatID value={cell} prefix={"APH-"} />,
  // },
  {
    dataField: "level_number",
    text: "Level Number",
    dataSort: true,
  },
  {
    dataField: "user",
    text: "Delegated",
    dataSort: true,
    formatter: (cell) => (cell ? "Yes" : "No"),
  },
  {
    dataField: "designation",
    text: "Designation",
    dataSort: true,
    formatter: (cell, row) =>
      cell ? (
        <div>
          <DesignationName value={cell} />
        </div>
      ) : (
        <div>
          <EmployeeName value={row.user} fallBackText={"--"} />
          <div>User</div>
        </div>
      ),
  },
  {
    text: "Action",
    formatter: (cell, row, data_list) => (
      <ApprovalHierarchyLevelActions
        data={row}
        reloadData={reload}
        ApprovalHierarchyList={data_list}
      />
    ),
    classes: "text-center",
    headerClasses: "text-center",
  },
];

export const HierarchyHistoryColumn = [
  // {
  //   dataField: "id",
  //   text: "ID",
  //   dataSort: true,
  //   formatter: (cell, row) => <FormatID value={cell} prefix={"APH-"} />,
  // },
  {
    dataField: "name",
    text: "Hierarchy Name",
    dataSort: true,
    maxWidth: "200px",
  },
  {
    dataField: "request_type",
    text: "Request Type",
    dataSort: true,
    formatter: (cell) => (
      <ApprovalHierarchyRequestTypeName value={cell} fallBackText={"--"} />
    ),
  },
  {
    dataField: "created_by",
    text: "Created By",
    dataSort: true,
    formatter: (cell) => <EmployeeUsername value={cell} fallBackText={"--"} />,
  },
  {
    dataField: "has_delegation",
    text: "Delegated",
    dataSort: true,
    formatter: (cell) => (cell ? "Yes" : "NO"),
  },
  {
    dataField: "auto_forward_enabled",
    text: "Auto Forward",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel variant="info">{cell ? "Enabled" : "Disabled"}</StatusLabel>
    ),
  },
  {
    text: "Action",
    formatter: (_, row) => <ApprovalHierarchyLogsActions data={row} />,
    classes: "text-center",
    headerClasses: "text-center",
  },
];

export const HierarchyHistoryDetailsColumn = [
  {
    dataField: "action_type",
    text: "Action Type",
    dataSort: true,
    // formatter: (cell, row) => <FormatID value={cell} prefix={"APH-"} />,
  },
  {
    dataField: "request_type",
    text: "Request Type",
    dataSort: true,
    formatter: (cell) => (
      <ApprovalHierarchyRequestTypeName value={cell} fallBackText={"--"} />
    ),
  },
  {
    dataField: "level_number",
    text: "Level",
    dataSort: true,
  },

  {
    dataField: "from_value",
    text: "From -> To",
    formatter: (cell, row) => `${cell} -> ${row.to_value}`,
  },
  {
    dataField: "changed_by",
    text: "Changes By",
    dataSort: true,
    formatter: (cell) => <EmployeeUsername value={cell} fallBackText="--" />,
  },
  {
    dataField: "branch",
    text: "Branch",
    dataSort: true,
    formatter: (cell) => <BranchName value={cell} fallBackText=" " />,
  },
  {
    dataField: "department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => <DepartmentName value={cell} fallBackText=" " />,
  },
  {
    text: "timestamp",
    dataField: "timestamp",
    formatter: (cell) => renderDate(cell, "--", "datetime"),
  },
];
