import React, { useState, useEffect } from "react";
import {
  ViewDetailSheetCardExtension,
  StatusLabel,
  EmployeeOverview,
} from "components";
import { Button } from "components/ui/button";
import { toast } from "react-toastify";
import { getLetterRequestData, addUpdateLetterRequest } from "app/hooks/hrDocuments";
import { DetailBox, SheetCardExtension } from "components/SheetCardExtension";
import { renderDate } from "utils/renderValues";
import AttachmentUI from "components/ui/AttachmentUI";

export const ViewLetterRequest = ({
  requestId = null,
  isOpen = true,
  setIsOpen = () => { },
  isEmpView = false,
}) => {
  const [currentRequest, setCurrentRequest] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (isMounted, id) => {
    try {
      setIsLoading(true);
      const response = await getLetterRequestData(id);
      if (isMounted && response) {
        setCurrentRequest(response);
      }
    } catch (error) {
      console.error("Error fetching letter request:", error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (requestId) {
      fetchData(isMounted, requestId);
    }
    return () => {
      isMounted = false;
    };
  }, [requestId]);

  const getStatusColor = (status, isAcknowledgment, isEmpAck) => {
    if (status === "PENDING" && isAcknowledgment && !isEmpAck) {
      return "ACKNOWLEDGMENT_NEEDED";
    }
    return status;
  };

  // Handle acknowledgment
  const handleAcknowledgment = async (requestId) => {
    try {
      const response = await addUpdateLetterRequest(
        {
          is_emp_ack: true,
          status: "ACCEPTED",
          id: requestId,
        },
        requestId
      );

      if (response) {
        toast.success("Request acknowledged successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        fetchData(); // Refresh the table
      } else {
        throw new Error("Failed to acknowledge request");
      }
    } catch (error) {
      console.error("Error acknowledging request:", error);
      toast.error("Failed to acknowledge request", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  if (isLoading) {
    return (
      <ViewDetailSheetCardExtension
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Letter Request Details"
      >
        <div className="flex justify-center p-4">Loading...</div>
      </ViewDetailSheetCardExtension>
    );
  }

  const labelList = [
    {
      label: "Request Name",
      value: currentRequest?.name || "N/A",
    },
    {
      label: "Request Date",
      value: renderDate(currentRequest?.created_at, "N/A"),
    },
    {
      label: "Status",
      value: (
        <StatusLabel
          status={getStatusColor(
            currentRequest?.status,
            currentRequest?.is_acknowledgment,
            currentRequest?.is_emp_ack
          )}
        >
          {currentRequest?.status === "PENDING" &&
            currentRequest?.is_acknowledgment &&
            !currentRequest?.is_emp_ack
            ? "Acknowledgment Needed"
            : currentRequest?.status?.toLowerCase() || "N/A"}
        </StatusLabel>
      ),
    },
    ...(currentRequest?.is_acknowledgment !== null
      ? [
        {
          label: "Requires Acknowledgment",
          value: currentRequest?.is_acknowledgment ? "Yes" : "No",
        },
      ]
      : []),
    ...(currentRequest?.is_acknowledgment && currentRequest?.is_emp_ack !== null
      ? [
        {
          label: "Employee Acknowledged",
          value: currentRequest?.is_emp_ack ? "Yes" : "No",
        },
      ]
      : []),
  ].filter(Boolean);

  return (
    <ViewDetailSheetCardExtension
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Letter Request Details"
    >
      <div className="mt-4">
        <section className="flex flex-col items-start justify-start w-full gap-2 mt-10 max-md:max-w-full">
          <div className="flex flex-wrap items-center justify-between w-full gap-4">
            <div className="ml-1">
              <EmployeeOverview
                id={currentRequest?.employee_id}
                showId={true}
                showDepartment={true}
                showPosition={true}
                avatarSize={14}
              />
              <div className="flex flex-row gap-1 flex-wrap overflow-hidden mt-3">
                <StatusLabel
                  status={getStatusColor(
                    currentRequest?.status,
                    currentRequest?.is_acknowledgment,
                    currentRequest?.is_emp_ack
                  )}
                >
                  {currentRequest?.status === "PENDING" &&
                    currentRequest?.is_acknowledgment &&
                    !currentRequest?.is_emp_ack
                    ? "Acknowledgment Needed"
                    : currentRequest?.status?.toLowerCase() || "N/A"}
                </StatusLabel>
              </div>
            </div>
            {currentRequest.status === "PENDING" &&
              currentRequest.is_acknowledgment &&
              !currentRequest.is_emp_ack && isEmpView && (
                <Button
                  size="sm"
                  onClick={() => handleAcknowledgment(currentRequest.id)}
                >
                  Acknowledge
                </Button>
              )}
          </div>
        </section>

        <section>
          <div className="mt-6">
            <SheetCardExtension title="Request Details">
              <div className="grid grid-cols-1 gap-4">
                {labelList.map((data, index) => (
                  <DetailBox
                    key={index}
                    className=""
                    label={data.label}
                    value={data.value}
                    fallbackText=""
                  />
                ))}
              </div>
              <div className="mt-4">
                <DetailBox
                  className=""
                  label="Description"
                  value={currentRequest?.description || "N/A"}
                  fallbackText=""
                />
              </div>
              {currentRequest?.attachments && (
                <div className="mt-4">
                  <DetailBox
                    className=""
                    label="HR Attachment"
                    value={
                      <AttachmentUI
                        attachment={currentRequest?.attachments}
                        name="Letter Request Document"
                        viewOnly={true}
                      />
                    }
                    fallbackText=""
                  />
                </div>
              )}
            </SheetCardExtension>
          </div>
        </section>
      </div>
    </ViewDetailSheetCardExtension>
  );
};
