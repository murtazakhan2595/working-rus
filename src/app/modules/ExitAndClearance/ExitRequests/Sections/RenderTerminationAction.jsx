import React, { useState } from "react";
import DropdownActionMenu from "components/DropdownActionMenu";
import { ExitDetailsCard } from "app/modules/ExitAndClearance/ExitRequests";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "src/@/components/ui/dropdown-menu"; // Replace with correct path
import { Button } from "src/@/components/ui/button"; // Replace with correct path
import { useSelector } from "react-redux";
import { IoMdArrowDropdown } from "react-icons/io";
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { toast } from "react-toastify";
import { StatusCircleLabel } from "components/StatusLabel";
import {
  ClearanceSheet,
  Status,
  ExitStatusCurrentStep,
} from "app/modules/ExitAndClearance/Sections";
import { MoreHorizontal } from "lucide-react";

const RenderTerminationAction = ({
  data,
  reloadData = () => {},
  DataList = [],
}) => {
  const [view, setView] = useState(null);
  const [ViewHistoryDetails, setViewHistoryDetails] = useState(null);
  const handleView = () => {
    setView(true);
  };

  return (
    <>
      <DropdownActionMenu
        onView={handleView}
        viewText={`View Request`}
        menuTooltip={`Termination Actions`}
      />

      {view && (
        <ExitDetailsCard
          isOpen={view}
          setIsOpen={() => {
            setView(false);
            reloadData(true);
          }}
          reloadData={reloadData}
          DataList={DataList}
          currentId={data?.id}
          isResignation={false}
        />
      )}
    </>
  );
};

// const RenderTerminationAction = ({ row, reload, viewMode }) => {
//   const loggedInUser = useSelector((state) => state.user.userProfile);
//   const status = row.status_termination;
//   const employeeApproval = Status(status, 0);
//   const terminationCurrentStep = ExitStatusCurrentStep(status);
//   const [open, setIsOpen] = useState(null);

//   const handleOptionSelect = async (status) => {
//     try {
//       if (row) {
//         // Create a new FormData object
//         const formData = new FormData();

//         // Append values to the FormData object
//         formData.append("id", row.id);
//         formData.append("status_termination", status);

//         const response = await saveEmployeeExitDetail(formData);
//         if (response && reload) {
//           reload();
//         }
//       }
//     } catch (error) {
//       console.error("Error updating application status:", error);
//     }
//   };

//   if (loggedInUser.role === 2 || loggedInUser.role === 4) {
//     return null;
//   }
//   const enableActions =
//     loggedInUser.role === 3 ||
//     (loggedInUser.role === 1 && terminationCurrentStep !== 3);

//   const isApproved = employeeApproval === "Approved";

//   return (
//     <div className="flex justify-end">
//       {open && (
//         <ClearanceSheet
//           isOpen={open}
//           setIsOpen={setIsOpen}
//           handleOptionSelect={handleOptionSelect}
//           employeeId={row.employee_id}
//         />
//       )}

//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           {viewMode ? (
//             <Button variant="outline" className="">
//               <span className="flex justify-center">
//                 Action
//                 <IoMdArrowDropdown className="text-[20px]" />
//               </span>
//             </Button>
//           ) : (
//             <MoreHorizontal className="w-4 h-4" />
//           )}
//         </DropdownMenuTrigger>

//         <DropdownMenuContent className="p-3">
//           {isApproved && terminationCurrentStep !== 3 && (
//             <DropdownMenuItem onClick={() => setIsOpen(true)} disabled={true}>
//               <StatusCircleLabel label={"Clearance"} status={"Clearance"} />
//             </DropdownMenuItem>
//           )}
//           {terminationCurrentStep !== 4 && (
//             <DropdownMenuItem
//               onClick={() => {
//                 if (!row.clearance_report) {
//                   toast.error("Please upload the clearance report to proceed", {
//                     position: toast.POSITION.TOP_RIGHT,
//                     autoClose: 5000,
//                   });
//                 } else handleOptionSelect("exit interview");
//               }}
//               disabled={true}
//             >
//               <StatusCircleLabel label={"Exit Interview"} status={"exit"} />
//             </DropdownMenuItem>
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// };

export default RenderTerminationAction;
