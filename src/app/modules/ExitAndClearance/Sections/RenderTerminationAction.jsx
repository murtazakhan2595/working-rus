import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useSelector } from "react-redux";
import { IoMdArrowDropdown } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import { TerminationStatus } from "utils/getValuesFromTables";
import { Status, ExitStatusCurrentStep } from "./index";
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { toast } from "react-toastify";
import { StatusCircleLabel } from "components/StatusLabel";

const RenderTerminationAction = ({ row, reload, viewMode }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const loggedInUser = useSelector((state) => state.user.userProfile);
  const status = row.status_termination;
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };
  const employeeApproval = Status(status, 0);
  const terminationCurrentStep = ExitStatusCurrentStep(status);
  const handleOptionSelect = async (status) => {
    try {
      if (row) {
        const payload = {
          ...row,
          status_termination: status,
        };
        const response = await saveEmployeeExitDetail(payload);
        if (response && reload) {
          reload();
        }
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };
  console.log(terminationCurrentStep);
  if (loggedInUser.role === 2 || loggedInUser.role === 4) {
    return "";
  }
  return (
    <div>
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
                    label={TerminationStatus(status || "pending")}
                    status={status}
                  />
                  <RiArrowDropDownLine className="text-xl text-zinc-600" />
                </div>
              </button>
            )}
          </DropdownToggle>
          <DropdownMenu start className="p-6">
            {loggedInUser.role === 3 ||
              (loggedInUser.role === 1 && terminationCurrentStep !== 3 && (
                <>
                  {employeeApproval === "Approved" && (
                    <DropdownItem
                      onClick={() => handleOptionSelect("initiated clearance")}
                    >
                      <StatusCircleLabel
                        label={"Clearance"}
                        status={"Clearance"}
                      />
                    </DropdownItem>
                  )}
                  {terminationCurrentStep !== 4 && (
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

export default RenderTerminationAction;
