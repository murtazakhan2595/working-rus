import { Clock, Download } from "lucide-react";
import { PriorityList } from "data/Data";
import moment from "moment";
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
    formatter: (cell) => <span>{moment(cell).format("MMMM DD")}</span>,
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
      <span
        className={`
                        px-2 py-1 rounded-full text-xs
                        ${
                          cell === "Completed"
                            ? "bg-green-100 text-green-800"
                            : cell === "In-Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      `}
      >
        {cell}
      </span>
    ),
  },
];
