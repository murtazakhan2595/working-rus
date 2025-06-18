import {
  FormatID,
  EmployeeUsername,
  ApprovalHierarchyRequestTypeName,
} from "utils/getValuesFromTables";
import {
  ApprovalHierarchyActions,
  ApprovalHierarchyLogsActions,
  ApprovalHierarchyLevelActions,
  LevelDelegateActions,
  ApprovalHeirarchyStatusTogle,
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
    dataField: "no_of_levels",
    text: "No. of Levels",
    dataSort: true,
  },
  {
    dataField: "has_delegation",
    text: "Delegated",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel status={cell ? "Yes" : "NO"}>
        {cell ? "Yes" : "No"}
      </StatusLabel>
    ),
  },
  {
    dataField: "has_auto_forward",
    text: "Auto Forward",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel status={cell ? "Yes" : "NO"}>
        {cell ? "Enabled" : "Disabled"}
      </StatusLabel>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => {
      return (
        <ApprovalHeirarchyStatusTogle
          data={row}
          status={cell}
          reloadData={reload}
        />
      );
    },
  },
  {
    text: "",
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

export const HierarchyLevelsColumn = (reload = () => {}, viewMode) =>
  [
    {
      dataField: "level_number",
      text: "Level Number",
    },

    {
      dataField: "designation",
      text: "Designation",
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
      dataField: "auto_forward_enabled",
      text: "Auto Forward",
      dataSort: true,
      formatter: (cell) => (
        <StatusLabel status={cell ? "Yes" : "NO"}>
          {cell ? "Enabled" : "Disabled"}
        </StatusLabel>
      ),
    },
    ...(!viewMode
      ? [
          {
            text: "",
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
        ]
      : []),
  ].filter(Boolean);

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
    dataField: "no_of_levels",
    text: "No. of Levels",
    dataSort: true,
  },
  {
    dataField: "has_delegation",
    text: "Delegated",
    dataSort: true,
    formatter: (cell) => (cell ? "Yes" : "NO"),
  },
  {
    dataField: "has_auto_forward",
    text: "Auto Forward",
    dataSort: true,
    formatter: (cell) => (
      <StatusLabel status={cell ? "Yes" : "NO"}>
        {cell ? "Enabled" : "Disabled"}
      </StatusLabel>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => {
      return (
        <StatusLabel variant={cell ? "success" : "error"}>
          {cell ? "Active" : "Inactive"}
        </StatusLabel>
      );
    },
  },
  {
    text: "",
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
    formatter: (cell, row) =>
      `${cell ?? ""}${cell && row.to_value ? " -> " : ""}${row.to_value ?? ""}`,
    maxWidth: "200px",
  },
  {
    dataField: "changed_by",
    text: "Changes By",
    dataSort: true,
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
    text: "Timestamp",
    dataField: "timestamp",
    formatter: (cell) => renderDate(cell, "--", "datetime"),
  },
];

export const DelegateLevelsColumn = (reload = () => {}, viewMode) => [
  {
    dataField: "initiative_designation",
    text: "Request Initiator",
    dataSort: true,
    formatter: (cell) => {
      if (!cell || cell.length === 0) return null;

      const designations = cell.split(", ");
      if (
        !designations ||
        !Array.isArray(designations) ||
        designations.length === 0
      )
        return null;
      return (
        <div className="flex flex-wrap gap-1">
          {designations.map((initiator, index) => {
            return (
              <StatusLabel variant="info" key={`initiator-${index}`}>
                {initiator}
              </StatusLabel>
            );
          })}
        </div>
      );
    },
  },
  {
    dataField: "level_number",
    text: "Level Number",
    dataSort: true,
  },
  {
    dataField: "branch",
    text: "Branch",
    dataSort: true,
    formatter: (cell) => <BranchName value={cell} />,
  },
  {
    dataField: "department",
    text: "Department",
    dataSort: true,
    formatter: (cell) => <DepartmentName value={cell} />,
  },
  {
    dataField: "delegate",
    text: "Delegate User",
    dataSort: true,
    formatter: (cell) => <EmployeeName value={cell} />,
  },
  {
    dataField: "start_date",
    text: "Start Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  {
    dataField: "end_date",
    text: "End Date",
    dataSort: true,
    formatter: (cell) => renderDate(cell),
  },
  ...(!viewMode
    ? [
        {
          text: "",
          formatter: (cell, row, data_list) => (
            <LevelDelegateActions
              data={row}
              reloadData={reload}
              LevelDelegateList={data_list}
            />
          ),
          classes: "text-center",
          headerClasses: "text-center",
        },
      ]
    : []),
];
