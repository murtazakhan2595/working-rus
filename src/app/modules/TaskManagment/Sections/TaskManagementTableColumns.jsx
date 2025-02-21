import { PriorityList, ProjectStatusList } from "data/Data";
import { TooltipText } from "components";
import {
  MembersList,
  TaskEndDate,
  TaskStatusLabel,
} from "app/modules/TaskManagment/Sections";
import { Button } from "components/ui/button";
import { ListChecks, ChevronDown, ChevronRight } from "lucide-react";

export const ProjectColumn = [
  {
    text: "Project",
    dataField: "name",
    dataSort: true,
  },
  {
    text: "Status",
    dataField: "status",
    formatter: (cell) => (
      <div>{ProjectStatusList.find((obj) => obj.value === cell)?.label}</div>
    ),
    // dataAlign: "center",
  },
  {
    text: "Tasks",
    dataField: "task_count",
  },
  {
    text: "Members",
    dataField: "project_members",
    formatter: (cell) => <MembersList members={cell} />,
    minWidth: "135px",
  },
  {
    text: "Due Date",
    dataField: "end_date",
    formatter: (cell, row) => {
      return (
        <TaskEndDate
          dueDate={cell}
          taskStatus={row.status}
          tooltipMessagePrefix={"This Project"}
        />
      );
    },
    width: "160px",
  },
  {
    text: "",
    dataField: "id",
    formatter: (cell) => {
      return (
        <Button to={`/project-board/${cell}`} variant={"outline"} size={"sm"}>
          View Project
        </Button>
      );
    },
    dataAlign: "right",
  },
];

export const ProjectBoardColumn = [
  {
    text: "",
    dataField: "",
    width: "16px",
    rowExpandOnClick: true,
    dataStyle: { padding: "0px" },
    headerStyle: { padding: "0px" },
    formatter: (cell, row, data, index, isExpanded) =>
      !row.is_subtask &&
      (isExpanded ? (
        <ChevronDown
          size={16}
          className={`${!row.sub_task.length ? "opacity-50" : ""}`}
        />
      ) : (
        <ChevronRight
          size={16}
          className={`${!row.sub_task.length ? "opacity-50" : ""}`}
        />
      )),
  },
  {
    text: "Tasks",
    dataField: "name",
    dataSort: true,
    minWidth:"250px",
    formatter: (cell, row) => (
      <div
        className={`inline-block items-end gap-x-2 transition-all duration-200`}
      >
        {/* Task Title */}
        <span className="">{cell}</span>
        {/* Subtask Tooltip */}
        <TooltipText
          tooltipTriggerText={
            <div className="inline-flex items-center gap-0.5 ml-1 whitespace-nowrap text-plum-1100 bg-plum-300 px-2 rounded">
              <ListChecks size={11} />
              <div>{row?.sub_task?.length || 0}</div>
            </div>
          }
          content={`${row?.sub_task?.length || 0} Subtasks`}
        />
      </div>
    ),
  },
  {
    text: "Status",
    dataField: "status",
    formatter: (cell) => (
      <div className="flex justify-start">
        <TaskStatusLabel status={cell} />
      </div>
    ),
    width: "160px",
    // headerAlign: "center",
    dataSort: true,
    // dataAlign: "center",
  },
  {
    text: "Priority",
    dataField: "priority",
    formatter: (cell) => (
      <div className="flex justify-start">
        {PriorityList.find((option) => option.value === cell)?.label}
      </div>
    ),
    width: "160px",
    dataSort: true,
  },
  {
    text: "Members",
    dataField: "assigned_to",
    width: "160px",
    formatter: (cell) => <MembersList members={cell} />,
  },
  {
    text: "Due Date",
    dataField: "end_date",
    formatter: (cell, row) => {
      return <TaskEndDate dueDate={cell} taskStatus={row.status} />;
    },
    width: "160px",
  },
];

export const ProjectBoardSubtaskColumn = [
  {
    text: "Tasks",
    dataField: "name",
    dataSort: true,
    // rowExpandOnClick: true,
  },
  {
    text: "Status",
    dataField: "status",
    formatter: (cell) => (
      <div className="flex justify-start">
        <TaskStatusLabel status={cell} />
      </div>
    ),
    width: "160px",
    dataSort: true,
  },
  {
    text: "Priority",
    dataField: "priority",
    formatter: (cell) => (
      <div className="flex justify-start">
        {PriorityList.find((option) => option.value === cell)?.label}
      </div>
    ),
    width: "160px",
    dataSort: true,
  },
  {
    text: "Members",
    dataField: "assigned_to",
    width: "160px",
    formatter: (cell) => <MembersList members={cell} />,
  },
  {
    text: "Due Date",
    dataField: "end_date",
    formatter: (cell, row) => {
      return <TaskEndDate dueDate={cell} taskStatus={row.status} />;
    },
    width: "160px",
  },
];

