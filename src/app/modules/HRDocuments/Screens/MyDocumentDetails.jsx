import moment from "moment";
import React, { useState, useEffect } from "react";
import { SignatureForm } from "app/modules/HRDocuments/Sections";
import { DocCategoryName } from "utils/getValuesFromTables";
import { Button } from "components/ui/button";
import {
  addUpdateDocumentAssignment,
  getDocumentAssignmentData,
} from "app/hooks/hrDocuments";
import { saveEmployeePersonalInfoData } from "app/hooks/employee";
import { useSelector } from "react-redux";
import { mapEmployeeTransferInfo } from "app/utils/MappingObjects/mapEmployeeTransferData";
import AttachmentUI from "components/ui/AttachmentUI";
import { DetailBox ,SheetCardExtension} from "components/SheetCardExtension";
import { ViewDetailSheetCardExtension, StatusLabel } from "components";
import { renderDate } from "utils/renderValues";

const MyDocumentDetails = ({
  documentID = null,
  DocumentList = [],
  reloadData = () => {},
  isOpen = true,
  setIsOpen = () => {},
  readOnlyMode = false,
}) => {
  const [currentDocument, setCurrentDocument] = useState({});
  const [currentDocumentId, setCurrentDocumentId] = useState(documentID);
  const [OpenSignationForm, setOpenSignationForm] = useState(false);

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
        ...(status === "VIEWED"
          ? { viewed_date: moment().format("YYYY-MM-DD") }
          : {}),
        ...(status === "ACKNOWLEDGED"
          ? { acknowledged_date: moment().format("YYYY-MM-DD") }
          : {}),
      };
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
      label: "Category",
      value: <DocCategoryName value={currentDocument?.document_category} />,
    },
    ...(currentDocument?.due_date
      ? [
          {
            label: "Due Date",
            value: renderDate(currentDocument?.due_date),
          },
        ]
      : []),
    ...(currentDocument?.viewed_date
      ? [
          {
            label: "Viewed Date",
            value: renderDate(currentDocument?.viewed_date),
          },
        ]
      : []),
    ...(currentDocument?.signature_data
      ? [
          {
            label: "Signature Date",
            value: renderDate(currentDocument?.signature_data),
          },
        ]
      : []),
  ].filter(Boolean);

  return (
    <>
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Document Details"
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
                      variant="outline"
                      onClick={(e) => {
                        handleSubmit(e, "VIEWED");
                      }}
                      type="button"
                      size="sm"
                    >
                      Mark as Viewed
                    </Button>
                  )}
                  {currentDocument?.status === "VIEWED" && (
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        handleSubmit(e, "ACKNOWLEDGED");
                      }}
                      size="sm"
                      type="button"
                    >
                      Acknowledge
                    </Button>
                  )}
                  {currentDocument?.status === "ACKNOWLEDGED" &&
                    !currentDocument.signature_file && (
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          setOpenSignationForm(e, "ACKNOWLEDGED");
                        }}
                        size="sm"
                        type="button"
                      >
                        Sign Document
                      </Button>
                    )}
                  {currentDocument.signature_file && (
                    <img
                      src={currentDocument.signature_file}
                      className="w-16 h-16"
                    />
                  )}
                </div>
              )}
            </div>
          </section>
          <section>
            <div className="mt-6">
              <SheetCardExtension title="Document Details">
                <div class="grid grid-cols-3 gap-4">
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
                </div>
              </SheetCardExtension>
            </div>
          </section>
          <section className="min-h-[75vh]">
            <AttachmentUI
              attachment={currentDocument.document_file}
              name={`${currentDocument?.document_name} - Document`}
              viewOnly={true}
            />
          </section>
          <section>
            <div className="flex flex-row justify-end gap-4 flex-wrap"></div>
          </section>
        </div>
      </ViewDetailSheetCardExtension>
      {OpenSignationForm && (
        <SignatureForm
          id={currentDocumentId}
          isOpen={OpenSignationForm}
          setIsOpen={() => {
            setOpenSignationForm(false);
            fetchData(true, currentDocumentId);
          }}
        />
      )}
    </>
  );
};

export default MyDocumentDetails;
