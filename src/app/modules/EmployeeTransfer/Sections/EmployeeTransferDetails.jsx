import moment from "moment";
import React, { useState, useEffect } from "react";
import { EmployeeTransferStatusView } from "app/modules/EmployeeTransfer/Sections";
import {
  DepartmentName,
  EmployeeName,
  BranchName,
  TerminationStatus,
  ResignationReason,
  ResignationStatus,
  ManagerName,
} from "utils/getValuesFromTables";
import { PencilLine } from "lucide-react";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";

import {
  addUpdateEmpTransferDetails,
  getEmployeeTransferData,
} from "app/hooks/employeeTransfer";
import { saveEmployeePersonalInfoData } from "app/hooks/employee";
import { useSelector } from "react-redux";
import { mapEmployeeTransferInfo } from "app/utils/MappingObjects/mapEmployeeTransferData";
import { Sheet, SheetContent, SheetHeader } from "src/@/components/ui/sheet";
import { TransferForm } from "app/modules/EmployeeTransfer/Sections";
import { DetailBox } from "components/SheetCardExtension";
import {
  ViewDetailSheetCardExtension,
  EmployeeOverview,
  DialogBox,
} from "components";
import { renderDate } from "utils/renderValues";

const renderActionButtons = (status, userRole, new_reporting_manager) => {
  if (!status || userRole === 4) return false;
  if (userRole === 1 || userRole === 3) {
    if (status === "ACCEPTED BY MANAGER") return true;
    else if (status === "PENDING" && !new_reporting_manager) return true;
  } else if (userRole === 2) {
    if (status === "PENDING") return true;
  }
  return false;
};

const EmployeeTransferDetails = ({
  transferID = null,
  isInternalTransfer = true,
  TransferList = [],
  reloadData = () => {},
  isOpen = true,
  setIsOpen = () => {},
  readOnlyMode = false,
}) => {
  const userRole = useSelector((state) => state.user.userProfile.role);
  const userId = useSelector((state) => state.user.userProfile.id);
  const [currentTranfer, setCurrentTranfer] = useState({});
  const [OpenConfirmRejection, setOpenConfirmRejection] = useState(false);
  const [currentTranferId, setCurrentTranferId] = useState(transferID);
  const [OpenTransferForm, setOpenTransferForm] = useState(false);

  const fetchData = async (isMounted, tranferId) => {
    try {
      const response = await getEmployeeTransferData(tranferId);
      if (isMounted && response) {
        setCurrentTranfer(response);
        setCurrentTranferId(tranferId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (currentTranferId) {
      fetchData(isMounted, currentTranferId);
    }
    return () => {
      isMounted = false;
    };
  }, [currentTranferId]);

  const handleNext = () => {
    const currentIndex = TransferList.findIndex(
      (item) => item.id === currentTranferId
    );
    if (currentIndex < TransferList.length - 1) {
      const currentTranfer = TransferList[currentIndex + 1];
      setCurrentTranferId(currentTranfer?.id);
    } else {
      const currentTranfer = TransferList[0];
      setCurrentTranferId(currentTranfer?.id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = TransferList.findIndex(
      (item) => item.id === currentTranferId
    );
    if (currentIndex > 0) {
      const currentTranfer = TransferList[currentIndex - 1];
      setCurrentTranferId(currentTranfer?.id);
    } else {
      const currentTranfer = TransferList[TransferList.length - 1];
      setCurrentTranferId(currentTranfer?.id);
    }
  };
  const handleSubmit = async (event, status) => {
    if (event) event.preventDefault();
    try {
      const payload = {};

      if (userRole === 3 || userRole === 1) {
        if (status === "approved") payload.status = "APPROVED";
        else if (status === "rejected") payload.status = "REJECTED";
        payload.hr_manager = userId;
      } else if (userRole === 2) {
        if (status === "approved") payload.status = "ACCEPTED BY MANAGER";
        else if (status === "rejected") payload.status = "REJECTED BY MANAGER";
      }
      const response = await addUpdateEmpTransferDetails(
        payload,
        currentTranferId
      );
      if (response) {
        if (payload.status === "APPROVED") {
          const empInfo = mapEmployeeTransferInfo(currentTranfer);
          await saveEmployeePersonalInfoData(
            currentTranfer.employee_id,
            empInfo
          );
        }
        fetchData(true, currentTranferId);
        reloadData(true);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const labelList = [
    {
      label: "Current Department",
      value: <DepartmentName value={currentTranfer?.old_department} />,
    },
    {
      label: "Current Reporting Manager",
      value: <ManagerName value={currentTranfer?.reporting_manager} />,
    },
    ...(currentTranfer?.transfer_type === "EXTERNAL"
      ? [
          {
            label: "Current Branch",
            value: <BranchName value={currentTranfer?.old_branch} />,
          },
        ]
      : [{}]),

    {
      label: "New Department",
      value: <DepartmentName value={currentTranfer?.new_department} />,
    },
    {
      label: "New Reporting Manager",
      value: <ManagerName value={currentTranfer?.new_reporting_manager} />,
    },
    ...(currentTranfer?.transfer_type === "EXTERNAL"
      ? [
          {
            label: "New Branch",
            value: <BranchName value={currentTranfer?.new_branch} />,
          },
        ]
      : [{}]),
    {
      label: "Effective Date",
      value: renderDate(currentTranfer?.effective_transfer_date),
    },
    {
      label: "Reason for Tranfer",
      value: currentTranfer?.reason_of_transfer,
    },
    ...(currentTranfer?.hr_manager
      ? [
          {
            label: "HR Manager",
            value: <EmployeeName value={currentTranfer?.hr_manager} />,
          },
        ]
      : []),
  ].filter(Boolean);

  const showActionbutton = renderActionButtons(
    currentTranfer?.status,
    userRole,
    currentTranfer?.new_reporting_manager
  );

  return (
    <>
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Tranfer Detail"
        handlePrevious={handlePrevious}
        handleNext={handleNext}
      >
        <div className="mt-4">
          <section className="flex flex-col items-start justify-start w-full gap-2 mt-10 max-md:max-w-full">
            <div className="flex flex-wrap items-center justify-between w-full">
              <div>
                <EmployeeOverview
                  id={currentTranfer?.employee_id}
                  showId={true}
                  avatarSize={16}
                />
                <div className="ml-[64px] flex flex-row gap-1 flex-wrap overflow-hidden">
                  <Badge variant="neutral">
                    {currentTranfer.transfer_type === "INTERNAL"
                      ? "Internal"
                      : "External"}
                  </Badge>
                  <EmployeeTransferStatusView
                    status={currentTranfer?.status || "PENDING"}
                  />
                </div>
              </div>
              {!readOnlyMode && (
                <div className="flex flex-row flex-wrap max-w-[50%] items-center gap-2">
                  {showActionbutton && (
                    <>
                      <Button
                        variant="successOutline"
                        onClick={(e) => handleSubmit(e, "approved")}
                        type="button"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructiveOutline"
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenConfirmRejection(true);
                        }}
                        type="button"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {currentTranfer?.status === "PENDING" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenTransferForm(true);
                      }}
                      type="button"
                    >
                      <PencilLine strokeWidth={1} />
                    </Button>
                  )}
                </div>
              )}
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
                        fallbackText={""}
                      />
                    );
                  })}
                {currentTranfer?.notes && (
                  <DetailBox
                    orientation="horizontal"
                    key={"notes"}
                    className="col-span-3"
                    label={"Notes"}
                    value={currentTranfer?.notes}
                  />
                )}
                {(currentTranfer?.status === "REJECTED" ||
                  currentTranfer?.status === "REJECTED BY MANAGER") && (
                  <DetailBox
                    orientation="horizontal"
                    key={"reason_of_rejection"}
                    className="col-span-3"
                    label={"Reason of Rejection"}
                    value={currentTranfer?.reason_of_rejection}
                  />
                )}
              </div>
            </div>
          </section>
          <section>
            <div className="flex flex-row justify-end gap-4 flex-wrap"></div>
          </section>
        </div>
      </ViewDetailSheetCardExtension>
      {OpenTransferForm && (
        <TransferForm
          id={currentTranferId}
          isOpen={OpenTransferForm}
          setIsOpen={(value) => {
            if (value === "close") setOpenTransferForm(false);
            else {
              setOpenTransferForm(false);
              fetchData(true, currentTranferId);
            }
          }}
          transfer_type={currentTranfer?.transfer_type}
        />
      )}
      {OpenConfirmRejection && (
        <DialogBox
          isOpen={OpenConfirmRejection}
          setIsOpen={setOpenConfirmRejection}
          title={"Confirm Rejection"}
          description={
            "Provide reason for rejection. Once submitted, the action cannot be reverted"
          }
        >
          <TransferForm
            id={currentTranferId}
            isOpen={OpenTransferForm}
            setIsOpen={() => {
              debugger;
              setOpenConfirmRejection(false);
              handleSubmit(null, "rejected");
            }}
            transfer_type={currentTranfer?.transfer_type}
            onlyRejectionForm={true}
          />
        </DialogBox>
      )}
    </>
  );
};

export default EmployeeTransferDetails;
