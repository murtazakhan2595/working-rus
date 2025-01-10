import { PriorityList } from "data/Data";
import moment from "moment";
import { Clock, } from "lucide-react";
import { MembersList, Labels } from "app/modules/TaskManagment/Sections";

export const ProjectBoardColumn = [
  {
    text: "Tasks",
    dataField: "name",
    width:'25%',
    formatter: (cell, row) => {
      return (
        <div className="flex flex-col pb-4 mt-3">
          <h3 className="text-base font-bold text-capitalize">{cell}</h3>
          {row?.description && (
            <p
              className="text-sm leading-5 truncate-text text-neutral-1000"
              style={{ maxHeight: "100px" }}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: `${row?.description.slice(0, 30)}${
                    row?.description.length > 30 ? "..." : ""
                  }`,
                }}
              />
            </p>
          )}
        </div>
      );
    },
  },
  {
    text: "List",
    dataField: "",
  },
  {
    text: "Priority",
    dataField: "priority",
    formatter: (cell) => {
      return PriorityList.find((option) => option.value === cell)
        ?.label;
    },
  },
  {
    text: "Labels",
    dataField: "label",
    width:'25%',
    formatter: (cell) => (
      <Labels labelsSelected={cell || []} editMode={false} />
    ),
  },
  {
    text: "Members",
    dataField: "assigned_to",
    formatter: (cell) => <MembersList members={cell} />,
  },
  {
    text: "Due Date",
    dataField: "end_date",
    formatter: (cell, row) => {
      // Check if the cell has a value

      // Try parsing the date using both formats
      let formattedDate;
      if (moment(cell, "MM-DD-YYYY", true).isValid()) {
        formattedDate = moment(cell, "MM-DD-YYYY").format("MMM D");
      } else if (moment(cell, "YYYY-MM-DD", true).isValid()) {
        formattedDate = moment(cell, "YYYY-MM-DD").format("MMM D");
      } else {
        // Handle invalid date format
        formattedDate = "Invalid Date";
      }

      return (
        <div className="flex items-center gap-2">
          <Clock size={18} /> {formattedDate}
        </div>
      );
    },
  },
];

