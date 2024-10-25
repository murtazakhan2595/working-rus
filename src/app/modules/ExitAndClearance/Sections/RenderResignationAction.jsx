import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../../../../src/@/components/ui/dropdown-menu";
import { Button } from "../../../../src/@/components/ui/button";
import { useSelector } from "react-redux";
import { saveEmployeeWorkInformationData } from "app/hooks/employee";
import { IoMdArrowDropdown } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { ResignationStatus } from "utils/getValuesFromTables";
import { Status, ExitStatusCurrentStep } from "./index";
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { toast } from "react-toastify";
import { StatusCircleLabel } from "components/StatusLabel";
import ClearanceSheet from "./ClearanceSheet";

const RenderResignationAction = ({ row, reload, viewMode }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const [open, setIsOpen] = useState(null);

  const loggedInUser = useSelector((state) => state.user.userProfile);
  const status = row.status_resignation;
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  console.log("application:", row);
  const HRApproval = Status(row.status_resignation, 2);
  const managerApproval = Status(status, 1);
  const resignationCurrentStep = ExitStatusCurrentStep(status);
  console.log("HRApproval", HRApproval);
  console.log("managerApproval", managerApproval);
  console.log("resignationCurrentStep", resignationCurrentStep);

  const handleOptionSelect = async (status) => {
    try {
      if (row) {
        const payload = {
          ...row,
          status_resignation: status,
        };
        const response = await saveEmployeeExitDetail(payload);
        if (response && reload) {
          if (status === "accepted by hr") {
            await saveEmployeeWorkInformationData(payload.employee_id, {
              employee_status: "Notice Period",
              id: payload.employee_id,
            });
          }
          reload();
        }
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };
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
      {loggedInUser.role === 2 && resignationCurrentStep > 1 ? (
        !viewMode && (
          <div style={{ padding: "0px 12px" }}>
            <StatusCircleLabel
              label={ResignationStatus(status)}
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
                    label={ResignationStatus(status)}
                    status={status}
                  />
                  <RiArrowDropDownLine className="text-xl text-zinc-600" />
                </div>
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent start className="p-6">
            {loggedInUser.role === 2 && (
              <>
                {managerApproval !== "Approved" && (
                  <DropdownMenuLabel
                    onClick={() => handleOptionSelect("accepted by manager")}
                    className="cursor-pointer"
                  >
                    <StatusCircleLabel label={"Accept"} status={"approved"} />
                  </DropdownMenuLabel>
                )}
                {managerApproval !== "Rejected" && (
                  <DropdownMenuLabel
                    onClick={() => handleOptionSelect("rejected by manager")}
                    className="cursor-pointer"
                  >
                    <StatusCircleLabel label={"Reject"} status={"rejected"} />
                  </DropdownMenuLabel>
                )}
              </>
            )}
            {(loggedInUser.role === 3 || loggedInUser.role === 1) && (
              <>
                {HRApproval !== "Approved" && resignationCurrentStep < 3 && (
                  <DropdownMenuLabel
                    onClick={() => handleOptionSelect("accepted by hr")}
                    className="cursor-pointer"
                  >
                    <StatusCircleLabel label={"Accept"} status={"approved"} />{" "}
                    1111
                  </DropdownMenuLabel>
                )}
                {HRApproval !== "Rejected" && resignationCurrentStep < 3 && (
                  <DropdownMenuLabel
                    onClick={() => handleOptionSelect("rejected by hr")}
                    className="cursor-pointer"
                  >
                    <StatusCircleLabel label={"Reject"} status={"rejected"} />{" "}
                    2222
                  </DropdownMenuLabel>
                )}
                {resignationCurrentStep < 3 && (
                  <DropdownMenuLabel
                    // onClick={() => handleOptionSelect("initiated clearance")}
                    onClick={() => setIsOpen(true)}
                    className="cursor-pointer"
                  >
                    <StatusCircleLabel
                      label={"Clearance"}
                      status={"Clearance"}
                    />{" "}
                    3333
                  </DropdownMenuLabel>
                )}
                {resignationCurrentStep !== 4 && (
                  <DropdownMenuLabel
                    className="cursor-pointer"
                    onClick={() => {
                      if (!row.clearance_report)
                        toast.error(
                          "Please upload the clearance report to proceed",
                          {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 5000,
                          }
                        );
                      else handleOptionSelect("exit interview");
                    }}
                  >
                    <StatusCircleLabel
                      label={"Exit Interview"}
                      status={"exit"}
                    />{" "}
                    4444
                  </DropdownMenuLabel>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default RenderResignationAction;
