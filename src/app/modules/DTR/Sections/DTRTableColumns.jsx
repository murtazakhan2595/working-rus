import { Clock, Download } from "lucide-react";
import { PriorityList, ProjectStatusList } from "data/Data";
import { renderDate } from "utils/renderValues";
import { TaskStatusLabel } from "app/modules/TaskManagment/Sections";
export const MyDtrTasksColumns = [
  {
    dataField: "",
    text: "Task",
    formatter: (cell, row) => (
      <div>
        <div>{row?.name}</div>
        <div>{row?.id}</div>
      </div>
    ),
  },
  {
    dataField: "end_date",
    text: "Due Date",
    formatter: (cell) => renderDate(cell, ""),
  },
  {
    dataField: "priority",
    text: "Priority",
    formatter: (cell) => (
      <span>{PriorityList.find((option) => option.value === cell)?.label}</span>
    ),
  },
  {
    dataField: "estimated_time",
    text: "Time Est",
    formatter: (cell) => (
      <div className="flex items-center gap-2">
        <Clock size={16} /> {cell}h
      </div>
    ),
  },
  {
    dataField: "consumed_time",
    text: "Time Spent",
    formatter: (cell) => (
      <div className="flex items-center gap-2">
        <Clock size={16} /> {cell}h
      </div>
    ),
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell) => (
      <div className="flex justify-start">
        <TaskStatusLabel status={cell} />
      </div>
    ),
  },
];
