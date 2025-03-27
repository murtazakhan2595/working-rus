import moment from "moment";
import React, { useState, useEffect } from "react";
import { EmployeeTransferStatusView } from "app/modules/EmployeeTransfer/Sections";
import {
  DepartmentName,
  EmployeeName,
  BranchName,
  DocCategoryName,
  ResignationReason,
  ResignationStatus,
  ManagerName,
} from "utils/getValuesFromTables";
import { PencilLine } from "lucide-react";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";

import {
  addUpdateDocumentAssignment,
  getDocumentAssignmentData,
} from "app/hooks/hrDocuments";
import { saveEmployeePersonalInfoData } from "app/hooks/employee";
import { useSelector } from "react-redux";
import { mapEmployeeTransferInfo } from "app/utils/MappingObjects/mapEmployeeTransferData";
import { Sheet, SheetContent, SheetHeader } from "src/@/components/ui/sheet";
import { TransferForm } from "app/modules/EmployeeTransfer/Sections";
import { DetailBox } from "components/SheetCardExtension";
import {
  ViewDetailSheetCardExtension,
  StatusLabel,
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

const DocumentDetails = ({
  documentID = null,
  DocumentList = [],
  reloadData = () => {},
  isOpen = true,
  setIsOpen = () => {},
  readOnlyMode = false,
}) => {
  const userRole = useSelector((state) => state.user.userProfile.role);
  const userId = useSelector((state) => state.user.userProfile.id);
  const [currentDocument, setCurrentDocument] = useState({});
  const [OpenConfirmRejection, setOpenConfirmRejection] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState(documentID);
  const [OpenTransferForm, setOpenTransferForm] = useState(false);

  const fetchData = async (isMounted, documentId) => {
    try {
      const response = await getDocumentAssignmentData(documentId);
      if (isMounted && response) {
        setCurrentDocument(response);
        setCurrentDocumentId(documentId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (currentDocumentId) {
      fetchData(isMounted, currentDocumentId);
    }
    return () => {
      isMounted = false;
    };
  }, [currentDocumentId]);

  const handleNext = () => {
    const currentIndex = DocumentList.findIndex(
      (item) => item.id === currentDocumentId
    );
    if (currentIndex < DocumentList.length - 1) {
      const currentDocument = DocumentList[currentIndex + 1];
      setCurrentDocumentId(currentDocument?.id);
    } else {
      const currentDocument = DocumentList[0];
      setCurrentDocumentId(currentDocument?.id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = DocumentList.findIndex(
      (item) => item.id === currentDocumentId
    );
    if (currentIndex > 0) {
      const currentDocument = DocumentList[currentIndex - 1];
      setCurrentDocumentId(currentDocument?.id);
    } else {
      const currentDocument = DocumentList[DocumentList.length - 1];
      setCurrentDocumentId(currentDocument?.id);
    }
  };
  const handleSubmit = async (event, status) => {
    if (event) event.preventDefault();
    try {
      const payload = {
        status: status,
        viewed_date: moment().format("YYYY-MM-DD"),
      };
      if (userRole === 3 || userRole === 1) {
        if (status === "approved") payload.status = "APPROVED";
        else if (status === "rejected") payload.status = "REJECTED";
        payload.hr_manager = userId;
      } else if (userRole === 2) {
        if (status === "approved") payload.status = "ACCEPTED BY MANAGER";
        else if (status === "rejected") payload.status = "REJECTED BY MANAGER";
      }
      const response = await addUpdateDocumentAssignment(
        payload,
        currentDocumentId
      );
      if (response) {
        if (payload.status === "APPROVED") {
          const empInfo = mapEmployeeTransferInfo(currentDocument);
          await saveEmployeePersonalInfoData(
            currentDocument.employee_id,
            empInfo
          );
        }
        fetchData(true, currentDocumentId);
        reloadData(true);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const labelList = [
    {
      label: "document_category",
      value: <DocCategoryName value={currentDocument?.old_department} />,
    },
    {
      label: "Due Date",
      value: renderDate(currentDocument?.due_date),
    },
  ].filter(Boolean);

  const showActionbutton = renderActionButtons(
    currentDocument?.status,
    userRole,
    currentDocument?.new_reporting_manager
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
              <div className="ml-1">
                <div className="text-xl text-neutral-1200 font-bold mb-3">
                  {currentDocument?.document_name}
                </div>
                <div className="flex flex-row gap-1 flex-wrap overflow-hidden">
                  <StatusLabel
                    className="cursor-pointer"
                    status={currentDocument.status}
                  >
                    {currentDocument.status?.charAt(0) +
                      currentDocument.status?.slice(1).toLowerCase()}
                  </StatusLabel>
                </div>
              </div>
              {!readOnlyMode && (
                <div className="flex flex-row flex-wrap max-w-[50%] items-center gap-2">
                  {currentDocument?.status === "PENDING" && (
                    <Button
                      variant="continue"
                      onClick={(e) => {
                        handleSubmit(e, "VIEWED");
                      }}
                      type="button"
                    >
                      Viewed
                    </Button>
                  )}
                  {currentDocument?.status === "VIEWED" && (
                    <Button
                      variant="continue"
                      onClick={(e) => {
                        handleSubmit(e, "VIEWED");
                      }}
                      type="button"
                    >
                      Viewed
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
                {currentDocument?.notes && (
                  <DetailBox
                    orientation="horizontal"
                    key={"notes"}
                    className="col-span-3"
                    label={"Notes"}
                    value={currentDocument?.notes}
                  />
                )}
                {(currentDocument?.status === "REJECTED" ||
                  currentDocument?.status === "REJECTED BY MANAGER") && (
                  <DetailBox
                    orientation="horizontal"
                    key={"reason_of_rejection"}
                    className="col-span-3"
                    label={"Reason of Rejection"}
                    value={currentDocument?.reason_of_rejection}
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
          id={currentDocumentId}
          isOpen={OpenTransferForm}
          setIsOpen={(value) => {
            if (value === "close") setOpenTransferForm(false);
            else {
              setOpenTransferForm(false);
              fetchData(true, currentDocumentId);
            }
          }}
          transfer_type={currentDocument?.transfer_type}
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
            id={currentDocumentId}
            isOpen={OpenTransferForm}
            setIsOpen={() => {
              debugger;
              setOpenConfirmRejection(false);
              handleSubmit(null, "rejected");
            }}
            transfer_type={currentDocument?.transfer_type}
            onlyRejectionForm={true}
          />
        </DialogBox>
      )}
    </>
  );
};

export default DocumentDetails;
