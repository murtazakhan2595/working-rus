import React from "react";
export const TaskSortingFilters = (employees) => {
  return [
    {
      label: "",
      name: "label",
      options: [
        { label: "Finished", value: "" },
        { label: "Unfinished task", value: "asc" },
      ],
    },
    {
      label: "Members",
      name: "assigned_to",
      options: [
        { label: "No Members", value: "noMemberSelected" },
        {
          label: "Selected Members",
          value: "selected_members",
          options: employees,
        },
      ],
    },
    {
      label: "Due Date",
      name: "end_date",
      options: [
        { label: "No dates", value: "noDate" },
        { label: "Overdates", value: "overdue" },
        { label: "Due the next day", value: "nextday" },
      ],
    },
    {
      label: "Priority",
      name: "priority",
      options: [
        { label: "No priority", value: "noPriority" },
        { label: "High", value: "1" },
        { label: "Medium", value: "2" },
        { label: "Low", value: "3" },
      ],
    },
  ];
};
