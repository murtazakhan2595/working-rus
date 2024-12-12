import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../../src/@/components/ui/dropdown-menu"; // Replace with correct path
import { Button } from "../../../../src/@/components/ui/button"; // Replace with correct path
import { useSelector } from "react-redux";
import { IoMdArrowDropdown } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { TerminationStatus } from "utils/getValuesFromTables";
import { Status, ExitStatusCurrentStep } from "./index";
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { toast } from "react-toastify";
import { StatusCircleLabel } from "components/StatusLabel";
import ClearanceSheet from "../Sections/ClearanceSheet"

const RenderTerminationAction = ({ row, reload, viewMode }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const loggedInUser = useSelector((state) => state.user.userProfile);
  const status = row.status_termination;
  const employeeApproval = Status(status, 0);
  const terminationCurrentStep = ExitStatusCurrentStep(status);
  const [open, setIsOpen] = useState(null);

  const handleOptionSelect = async (status) => {
    try {
      if (row) {
        // Create a new FormData object
        const formData = new FormData();
        
        // Append values to the FormData object
        formData.append("id", row.id);
        formData.append("status_termination", status);
  
        const response = await saveEmployeeExitDetail(formData);
        if (response && reload) {
          reload();
        }
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };
  

  if (loggedInUser.role === 2 || loggedInUser.role === 4) {
    return null;
  }
  const shouldRender =
    loggedInUser.role === 3 ||
    (loggedInUser.role === 1 && terminationCurrentStep !== 3);
  const isApproved = employeeApproval === "Approved";

  return (
    <div>
      {open && (
        <ClearanceSheet
          isOpen={open}
          setIsOpen={setIsOpen}
          handleOptionSelect={handleOptionSelect}
          employeeId={row.employee_id}
        />
      )}
      {employeeApproval !== "Approved" ? (
        !viewMode && (
          <div style={{ padding: "0px 12px" }}>
            <StatusCircleLabel
              label={TerminationStatus(status || "pending")}
              status={status}
            />
          </div>
        )
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {viewMode ? (
              <Button variant="outline" className="">
                <span className="flex justify-center">
                  Action
                  <IoMdArrowDropdown className="text-[20px]" />
                </span>
              </Button>
            ) : (
              <Button
                className="text-zinc-600 text-sm font-normal"
                variant="outline"
              >
                <div className="flex items-center">
                  <StatusCircleLabel
                    label={TerminationStatus(status || "pending")}
                    status={status}
                  />
                  <RiArrowDropDownLine className="text-xl text-zinc-600" />
                </div>
              </Button>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent className="p-6">
            {shouldRender && (
              <>
                {isApproved && terminationCurrentStep !==3 && (
                  <DropdownMenuItem onClick={() => setIsOpen(true)}>
                    <StatusCircleLabel
                      label={"Clearance"}
                      status={"Clearance"}
                    />
                  </DropdownMenuItem>
                )}
                {terminationCurrentStep !== 4 && (
                  <DropdownMenuItem
                    onClick={() => {
                      if (!row.clearance_report) {
                        toast.error(
                          "Please upload the clearance report to proceed",
                          {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                          }
                        );
                      } else handleOptionSelect("exit interview");
                    }}
                  >
                    <StatusCircleLabel
                      label={"Exit Interview"}
                      status={"exit"}
                    />
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default RenderTerminationAction;
