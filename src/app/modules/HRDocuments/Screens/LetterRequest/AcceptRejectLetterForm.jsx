import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "components/ui/button";
import { SheetUI } from "components";
import {
  CoverFileUpload,
  SwitchInput,
  SelectInputComponent,
  RadioGroupInput,
} from "components/FormControl";
import {
  getLetterRequestData,
  addUpdateLetterRequest,
  getDocumentList,
} from "app/hooks/hrDocuments";

const urlToFile = async (url, filename) => {
  try {
    // Use cors.lol proxy (currently working and free)
    const proxyUrl = `https://api.cors.lol/?url=${url}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();

    let finalFilename = filename;
    if (!filename || !filename.includes(".")) {
      const urlPath = url.split("/").pop();
      const extension = urlPath?.split(".").pop();
      finalFilename = filename
        ? `${filename}.${extension}`
        : urlPath || "document";
    }

    const file = new File([blob], finalFilename, {
      type: blob.type || "application/octet-stream",
      lastModified: new Date().getTime(),
    });

    return file;
  } catch (error) {
    console.error("Error converting URL to File:", error);
    throw new Error(`Failed to convert URL to file: ${error.message}`);
  }
};
export const AcceptRejectLetterForm = ({
  requestId = null,
  isOpen = true,
  setIsOpen = () => {},
}) => {
  const [currentRequest, setCurrentRequest] = useState({});
  const [hrDocuments, setHrDocuments] = useState([]);
  const [actionType, setActionType] = useState(null); // null, "accept", "reject"

  const initialValues = {
    attachment_type: "upload",
    attachments: null,
    selected_document_id: null,
    is_acknowledgment: false,
  };

  const attachmentOptions = [
    { value: "upload", label: "Upload New Document" },
    { value: "existing", label: "Select Existing HR Document" },
  ];

  // Fetch current request and HR documents
  const fetchData = async (isMounted) => {
    try {
      const [requestResponse, documentsResponse] = await Promise.all([
        getLetterRequestData(requestId),
        getDocumentList({
          options: { page: 1, sizePerPage: 100 },
          filterData: { exclude_expired: true },
          ordering: "-id",
        }),
      ]);

      if (isMounted) {
        if (requestResponse) setCurrentRequest(requestResponse);
        if (documentsResponse) {
          const formattedDocs = documentsResponse.results.map((doc) => ({
            value: doc.id,
            label: doc.name,
            file: doc.file,
          }));
          setHrDocuments(formattedDocs);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (requestId) {
      fetchData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [requestId]);

  const handleSubmit = async (data, action) => {
    try {
      let payload = {};

      if (action === "reject") {
        payload = { status: "REJECTED" };
      } else if (action === "accept") {
        payload = {
          status: data.is_acknowledgment ? "PENDING" : "ACCEPTED",
          is_acknowledgment: data.is_acknowledgment,
          is_emp_ack: false,
        };

        // Handle attachment
        if (data.attachment_type === "upload" && data.attachments) {
          payload.attachments = data.attachments;
        } else if (
          data.attachment_type === "existing" &&
          data.selected_document_id
        ) {
          const selectedDoc = hrDocuments.find(
            (doc) => doc.value === data.selected_document_id
          );
          if (selectedDoc?.file) {
            // Convert URL to File object
            try {
              const fileFromUrl = await urlToFile(
                selectedDoc.file,
                selectedDoc.label
              );
              payload.attachments = fileFromUrl;
              console.log(
                "Successfully converted existing document to File object"
              );
            } catch (error) {
              console.error("Error converting URL to file:", error);
              throw new Error("Failed to process selected document");
            }
          }
        }
      }

      const response = await addUpdateLetterRequest(payload, requestId);
      if (response) {
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Request ${
            action === "accept" ? "Accepted" : "Rejected"
          } Successfully!`,
          description: `Letter request has been ${
            action === "accept" ? "accepted" : "rejected"
          } successfully.`,
        };
      }
    } catch (error) {
      console.error("Error updating letter request:", error);
      return {
        status: false,
        messageType: "ERROR",
        title: "Error",
        description: error.message || "Failed to update letter request",
      };
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Custom footer buttons
  const renderCustomButtons = (formProps) => {
    return (
      <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
        <Button variant="outline" size="lg" onClick={handleClose} type="button">
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="lg"
          type="button"
          onClick={async () => {
            const result = await handleSubmit(formProps.values, "reject");
            if (result?.status) {
              toast.success(result.title);
              setIsOpen(false);
            } else {
              toast.error(result?.description || "Failed to reject request");
            }
          }}
        >
          Reject Request
        </Button>
        <Button
          variant="default"
          size="lg"
          type="button"
          onClick={async () => {
            try {
              const result = await handleSubmit(formProps.values, "accept");
              if (result?.status) {
                toast.success(result.title);
                setIsOpen(false);
              } else {
                toast.error(result?.description || "Failed to accept request");
              }
            } catch (error) {
              toast.error(error.message || "Failed to process request");
            }
          }}
        >
          {formProps.values.is_acknowledgment
            ? "Update Request"
            : "Accept Request"}
        </Button>
      </div>
    );
  };

  // Sheet configuration
  const FormSheetData = {
    title: "Manage Letter Request",
    description: "Choose an action for this letter request",
    width: "600px",
  };

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: initialValues,
        enableReinitialize: true,
        handleSubmit: () => {}, // No default submit since we use custom buttons
        validateFormSchema: () => ({}), // No validation since we handle it in custom buttons
        // Hide default buttons since we use custom ones
        submitButtonText: null,
        cancelButtonText: null,
        customFooter: renderCustomButtons, // Custom footer function
        columns: 1,
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: "Attachment Details",
            InputFields: [
              {
                InputField: SelectInputComponent,
                name: "attachment_type",
                required: true,
                label: "Attachment Method",
                options: attachmentOptions,
              },
              {
                InputField: CoverFileUpload,
                name: "attachments",
                required: true,
                label: "Upload Document",
                variant: "AttachmentFileUpload",
                allowUpdate: true,
                multiple: false,
                shouldRender: (values) => values?.attachment_type === "upload",
              },
              {
                InputField: SelectInputComponent,
                name: "selected_document_id",
                required: true,
                label: "Select HR Document",
                options: hrDocuments,
                placeholder: "Choose from existing documents",
                shouldRender: (values) =>
                  values?.attachment_type === "existing",
              },
              {
                InputField: SwitchInput,
                name: "is_acknowledgment",
                label: "Requires Employee Acknowledgment",
                description: "Employee needs to acknowledge receipt",
              },
            ],
          },
        ],
      }}
    />
  );
};
