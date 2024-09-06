import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useSelector } from "react-redux";
import { saveEmployeeWorkInformationData } from "app/hooks/employee";
import { IoMdArrowDropdown } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { ResignationStatus } from "utils/getValuesFromTables";
import { Status, ExitStatusCurrentStep } from "./index";
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { toast } from "react-toastify";
import { StatusCircleLabel } from "components/StatusLabel";

const RenderResignationAction = ({ row, reload, viewMode }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const loggedInUser = useSelector((state) => state.user.userProfile);
  const status = row.status_resignation;
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };
  const HRApproval = Status(row.status_resignation, 2);
  const managerApproval = Status(status, 1);
  const resignationCurrentStep = ExitStatusCurrentStep(status);
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
        <ButtonDropdown
          isOpen={openDropdownRow === row.id}
          toggle={() => toggleDropdown(row.id)}
        >
          <DropdownToggle className="border-0 shadow-none bg-transparent">
            {viewMode ? (
              <button
                className="btn btn-outline-dark bg-white text-dark shadow-none"
                style={{
                  padding: ".35em .65em",
                  fontSize: ".75em",
                  minWidth: "100px",
                  height: "32.25px",
                }}
              >
                <span className="flex justify-center">
                  Action
                  <IoMdArrowDropdown className="text-[20px]" />
                </span>
              </button>
            ) : (
              <button className="text-zinc-600 text-sm font-normal">
                <div className="flex items-center">
                  <StatusCircleLabel
                    label={ResignationStatus(status)}
                    status={status}
                  />
                  <RiArrowDropDownLine className="text-xl text-zinc-600" />
                </div>
              </button>
            )}
          </DropdownToggle>
          <DropdownMenu start className="p-6">
            {loggedInUser.role === 2 && (
              <>
                {managerApproval !== "Approved" && (
                  <DropdownItem
                    onClick={() => handleOptionSelect("accepted by manager")}
                  >
                    <StatusCircleLabel label={"Accept"} status={"approved"} />
                  </DropdownItem>
                )}
                {managerApproval !== "Rejected" && (
                  <DropdownItem
                    onClick={() => handleOptionSelect("rejected by manager")}
                  >
                    <StatusCircleLabel label={"Reject"} status={"rejected"} />
                  </DropdownItem>
                )}
              </>
            )}
            {loggedInUser.role === 3 ||
              (loggedInUser.role === 1 && (
                <>
                  {HRApproval !== "Approved" && (
                    <DropdownItem
                      onClick={() => handleOptionSelect("accepted by hr")}
                    >
                      <StatusCircleLabel label={"Accept"} status={"approved"} />
                    </DropdownItem>
                  )}
                  {HRApproval !== "Rejected" && (
                    <DropdownItem
                      onClick={() => handleOptionSelect("rejected by hr")}
                    >
                      <StatusCircleLabel label={"Reject"} status={"rejected"} />
                    </DropdownItem>
                  )}
                  {resignationCurrentStep < 3 && (
                    <DropdownItem
                      onClick={() => handleOptionSelect("initiated clearance")}
                    >
                      <StatusCircleLabel
                        label={"Clearance"}
                        status={"Clearance"}
                      />
                    </DropdownItem>
                  )}
                  {resignationCurrentStep !== 4 && (
                    <DropdownItem
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
                      />
                    </DropdownItem>
                  )}
                </>
              ))}
          </DropdownMenu>
        </ButtonDropdown>
      )}
    </div>
  );
};

export default RenderResignationAction;
