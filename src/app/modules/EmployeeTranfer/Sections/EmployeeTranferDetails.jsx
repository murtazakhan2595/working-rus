import moment from "moment";
import React, { useState, useRef } from "react";
import { EmployeeTransferStatusView } from "app/modules/EmployeeTranfer/Sections";
import {
  DepartmentName,
  DesignationName,
  EmployeeID,
  TerminationStatus,
  ResignationReason,
  ResignationStatus,
  ManagerName,
} from "utils/getValuesFromTables";

import { Button } from "components/ui/button";

import { addUpdateEmpTransferDetails } from "app/hooks/employeeTranfer";
import { ExitStatusCurrentStep } from "app/modules/ExitAndClearance/Sections";
import { useSelector } from "react-redux";
import { Labels } from "components/StatusLabel";
import { Sheet, SheetContent, SheetHeader } from "src/@/components/ui/sheet";
import { TransferForm } from "app/modules/EmployeeTranfer/Sections";
import { DetailBox } from "components/SheetCardExtension";
import { ViewDetailSheetCardExtension, EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
const EmployeeTransferDetails = ({
  transferID = null,
  isInternalTransfer = true,
  TransferList = [],
  reloadData = () => {},
  isOpen = true,
  setIsOpen = () => {},
}) => {
  const userRole = useSelector((state) => state.user.userProfile.role);
  const [currentTranfer, setCurrentTranfer] = useState(
    TransferList?.find((item) => item.id === transferID)
  );
  const [currentTranferId, setCurrentTranferId] = useState(transferID);
  const [OpenTransferForm, setOpenTransferForm] = useState(false);

  const handleNext = () => {
    const currentIndex = TransferList.findIndex(
      (item) => item.id === currentTranferId
    );
    if (currentIndex < TransferList.length - 1) {
      const currentTranfer = TransferList[currentIndex + 1];
      setCurrentTranfer(currentTranfer);
      setCurrentTranferId(currentTranfer?.id);
    } else {
      const currentTranfer = TransferList[0];
      setCurrentTranfer(currentTranfer);
      setCurrentTranferId(currentTranfer?.id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = TransferList.findIndex(
      (item) => item.id === currentTranferId
    );
    if (currentIndex > 0) {
      const currentTranfer = TransferList[currentIndex - 1];
      setCurrentTranfer(currentTranfer);
      setCurrentTranferId(currentTranfer?.id);
    } else {
      const currentTranfer = TransferList[TransferList.length - 1];
      setCurrentTranfer(currentTranfer);
      setCurrentTranferId(currentTranfer?.id);
    }
  };
  const handleSubmit = async (event, status) => {
    event.preventDefault();
    try {
      const payload = {};
      if (status === "approved") {
        if (userRole === 2) payload.status = "ACCEPTED BY MANAGER";
        else if (userRole === 3) payload.status = "APPROVED";
      } else if (status === "rejected") {
        if (userRole === 2) payload.status = "REJECTED BY MANAGER";
        else if (userRole === 3) payload.status = "REJECTED";
      }
      const response = await addUpdateEmpTransferDetails(
        payload,
        currentTranfer?.id
      );
      if (response) {
        reloadData(true);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const labelList = [
    {
      label: "Old Department",
      value: <DepartmentName value={currentTranfer?.old_department} />,
    },
    {
      label: "Old Location",
      value: currentTranfer?.old_location,
    },
    {
      label: "Old Reporting Manager",
      value: <ManagerName value={currentTranfer?.reporting_manager} />,
    },
    {
      label: "New Department",
      value: <DepartmentName value={currentTranfer?.new_department} />,
    },
    {
      label: "New Location",
      value: currentTranfer?.new_location,
    },
    {
      label: "New Reporting Manager",
      value: <ManagerName value={currentTranfer?.new_reporting_manager} />,
    },
    {
      label: "Effective Date",
      value: renderDate(currentTranfer?.effective_transfer_date),
    },
    {
      label: "Reason for Tranfer",
      value: currentTranfer?.reason_of_transfer,
    },
    {
      label: "Note",
      value: currentTranfer?.notes,
    },
  ];

  return (
    <ViewDetailSheetCardExtension
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Internal Tranfer"
      handlePrevious={handlePrevious}
      handleNext={handleNext}
    >
      <div className="mt-4">
        <section className="flex flex-col items-start justify-start w-full gap-2 mt-10 max-md:max-w-full">
          <div className="flex flex-wrap items-center justify-between w-full">
            <EmployeeOverview
              id={currentTranfer?.employee_id}
              showId={true}
              avatarSize={16}
            />
            <div className="flex flex-row flex-wrap max-w-[50%] items-center gap-4">
              {(((userRole === 3 || userRole === 1) &&
                currentTranfer?.status === "ACCEPTED BY MANAGER") ||
                (userRole === 2 && currentTranfer?.status === "PENDING")) && (
                <>
                  <Button
                    variant="success"
                    onClick={(e) => handleSubmit(e, "approved")}
                    type="button"
                  >
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    // size="lg"
                    // onClick={handleClose}
                    type="button"
                  >
                    Reject
                  </Button>
                </>
              )}
              {currentTranfer?.status === "PENDING" && (
                <Button
                  variant="continue"
                  // size="sm"
                  // className="py-1 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTransferForm(true);
                  }}
                  type="button"
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-end w-full">
            <EmployeeTransferStatusView
              status={currentTranfer?.status || "PENDING"}
            />
          </div>
        </section>
        <section>
          <div className="mt-3">
            <div class="grid grid-cols-3 gap-8 my-4 border border-gray-400 rounded-lg pr-3 pl-4 py-4">
              {labelList &&
                labelList.map((data, index) => {
                  return (
                    <DetailBox
                      orientation="horizontal"
                      key={index}
                      className=""
                      label={data.label}
                      value={data.value}
                    />
                  );
                })}
            </div>
          </div>
        </section>
        <section>
          <div className="flex flex-row justify-end gap-4 flex-wrap"></div>
        </section>
      </div>
      {OpenTransferForm && (
        <TransferForm
          id={currentTranfer?.id}
          isOpen={OpenTransferForm}
          setIsOpen={() => {
            setOpenTransferForm(false);
            reloadData(true);
          }}
          transfer_type={currentTranfer?.transfer_type}
        />
      )}
    </ViewDetailSheetCardExtension>
  );
};

export default EmployeeTransferDetails;
