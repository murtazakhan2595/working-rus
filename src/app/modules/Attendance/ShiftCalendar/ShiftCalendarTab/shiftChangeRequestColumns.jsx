import { StatusLabel } from "components";
import { EmployeeOverview } from "components";
import { getChangeRequestComparison } from "../Section/getEmployeeActiveShift";
import moment from "moment";
import ShiftChangeRequestActions from "./ShiftChangeRequestActions";


 export const EmployeeColumns = (reload) => [
   {
     dataField: "employee",
     text: "Employee",
     formatter: (cell, row) => {
       return (
         <>
           <EmployeeOverview id={cell.id || cell} showBranchName={true} />
         </>
       );
     },
     dataSort: true,
   },
   {
     dataField: "comparison_data",
     text: "Assigned Shift Date",
     formatter: (cell, row) => {
       if (!cell || cell.length === 0) return "-";

       return (
         <div className="space-y-1">
           {cell.map((day, index) => (
             <div key={index} className="text-sm">
               {moment(day.date).format("MMM DD")}
             </div>
           ))}
         </div>
       );
     },
   },
   {
     dataField: "comparison_data",
     text: "Current Shift",
     formatter: (cell) => {
       if (!cell || cell.length === 0) return "-";

       return (
         <div className="space-y-1">
           {cell.map((day, index) => (
             <div
               key={index}
               className={`text-sm ${
                 day.current_shift === "OFF" ? "text-blue-600 font-medium" : ""
               }`}
             >
               {day.current_shift}
             </div>
           ))}
         </div>
       );
     },
   },
   {
     dataField: "comparison_data",
     text: "Requested Change",
     formatter: (cell) => {
       if (!cell || cell.length === 0) return "-";

       return (
         <div className="space-y-1">
           {cell.map((day, index) => (
             <div
               key={index}
               className={`text-sm ${
                 day.requested_shift === "OFF"
                   ? "text-blue-600 font-medium"
                   : ""
               }`}
             >
               {day.requested_shift}
             </div>
           ))}
         </div>
       );
     },
   },
   {
     dataField: "assigned_by",
     text: "Requested By",
     formatter: (cell) => <EmployeeOverview id={cell} />,
     dataSort: true,
   },
   {
     dataField: "status",
     text: "Status",
     formatter: (cell) => {
       return (
         <span
           className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
             cell === "Approved"
               ? "bg-emerald-50 text-teal-700"
               : cell === "Rejected"
               ? "bg-red-50 text-red-700"
               : "bg-[#f0f0f3] text-[#7f838d]"
           }`}
         >
           {cell || "N/A"}
         </span>
       );
     },
     dataSort: true,
   },
   {
     dataField: "actions",
     text: "Actions",
     formatter: (cell, row) => (
       <ShiftChangeRequestActions data={row} reload={reload} />
     ),
   },
 ];
