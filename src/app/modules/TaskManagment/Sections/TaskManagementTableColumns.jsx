import { PriorityList, ProjectStatusList } from "data/Data";
import { TextUI, TooltipText } from "components";
import { Clock } from "lucide-react";
import {
  MembersList,
  TaskEndDate,
  TaskStatusLabel,
  RenderTaskTitle,
} from "app/modules/TaskManagment/Sections";
import { Button } from "components/ui/button";
import { ListChecks, Trash2, RotateCcw, ExternalLink } from "lucide-react";

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
    text: "Tasks",
    dataField: "name",
    dataSort: true,
    minWidth: "200px",
    rowExpandOnClick: true,
    formatter: (cell, row) => (
      <div className="inline-block items-end gap-x-2 transition-all duration-200 group">
        {/* Task Title */}
        <span className="">{cell}</span>
        {/* Subtask Tooltip */}
          <TooltipText
            tooltipTriggerText={
              <div className="hidden group-hover:inline-flex items-center gap-0.5 ml-3 whitespace-nowrap text-plum-1100">
                <ListChecks size={14} />
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
    width: "18%",
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
    width: "18%",
    dataSort: true,
  },
  {
    text: "Members",
    dataField: "assigned_to",
    width: "18%",
    minWidth: "135px",
    formatter: (cell) => <MembersList members={cell} />,
  },
  {
    text: "Due Date",
    dataField: "end_date",
    formatter: (cell, row) => {
      return <TaskEndDate dueDate={cell} taskStatus={row.status} />;
    },
    minWidth: "160px",
    width: "160px",
  },
];
