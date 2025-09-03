import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SheetUI } from "components";
import {
  CoverFileUpload,
  SwitchInput,
  SelectInputComponent,
  RadioGroupInput,
} from "components/FormControl";
import {
  addUpdateLetterRequest,
  getDocumentList,
} from "app/hooks/hrDocuments";
import { useSelector } from "react-redux";
import { getLetterRequestData } from "app/hooks/hrDocuments";

const FormSheetData = {
  title: "Accept/Reject Letter Request",
  description: null,
  footer: null,
  width: "600px",
};

export const AcceptRejectLetterForm = ({
  requestId = null,
  isOpen = true,
  setIsOpen = () => {},
}) => {
  const [currentRequest, setCurrentRequest] = useState({});
  const [hrDocuments, setHrDocuments] = useState([]);
  const [formData, setFormData] = useState({
    action: "accept", // accept or reject
    attachment_type: "upload", // upload or existing
    attachments: null,
    selected_document_id: null,
    is_acknowledgment: false,
  });
  const [formValues, setFormValues] = useState(formData);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current request data
  const fetchRequestData = async (isMounted) => {
    try {
      const response = await getLetterRequestData(requestId);
      if (isMounted && response) {
        setCurrentRequest(response);
      }
    } catch (error) {
      console.error("Error fetching request:", error);
    }
  };

  // Fetch HR documents for selection
  const fetchHrDocuments = async (isMounted) => {
    try {
      const response = await getDocumentList({
        options: { page: 1, sizePerPage: 100 },
        filterData: { exclude_expired: true },
        ordering: "-id",
      });
      if (isMounted && response) {
        const formattedDocs = response.results.map((doc) => ({
          value: doc.id,
          label: doc.name,
          file: doc.file,
        }));
        setHrDocuments(formattedDocs);
      }
    } catch (error) {
      console.error("Error fetching HR documents:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (requestId) {
      fetchRequestData(isMounted);
      fetchHrDocuments(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [requestId]);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      let payload = {};

      if (data.action === "reject") {
        // Simple rejection
        payload = {
          status: "REJECTED",
        };
      } else {
        // Accept with attachment
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
          // For existing document, we need to copy the file
          // Simple approach: get the selected document's file
          const selectedDoc = hrDocuments.find(
            (doc) => doc.value === data.selected_document_id
          );
          if (selectedDoc && selectedDoc.file) {
            // In a real implementation, you might want to copy the file
            // For now, we'll just reference it
            payload.attachments = selectedDoc.file;
          }
        }
      }

      const response = await addUpdateLetterRequest(payload, requestId);
      if (response) {
        toast.success(
          `Letter request ${
            data.action === "accept" ? "accepted" : "rejected"
          } successfully!`,
          { position: toast.POSITION.TOP_RIGHT }
        );
        setIsOpen(false);
      } else {
        throw new Error("Failed to update request");
      }
    } catch (error) {
      console.error("Error updating letter request:", error);
      toast.error("Failed to update letter request", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: formData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: (values) => {
          const errors = {};
          if (values.action === "accept") {
            if (values.attachment_type === "upload" && !values.attachments) {
              errors.attachments = "Please upload a document";
            }
            if (
              values.attachment_type === "existing" &&
              !values.selected_document_id
            ) {
              errors.selected_document_id = "Please select a document";
            }
          }
          return errors;
        },
        submitButtonText:
          formValues.action === "accept" ? "Accept Request" : "Reject Request",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading,
        renderUpdatedFormValues: setFormValues,
        formFields: [
          {
            sheetCardExtension: false,
            InputFields: [
              {
                InputField: RadioGroupInput,
                name: "action",
                required: true,
                label: "Action",
                options: [
                  { value: "accept", label: "Accept Request" },
                  { value: "reject", label: "Reject Request" },
                ],
                variant: "stacked",
              },
              // Only show attachment options if accepting
              ...(formValues.action === "accept"
                ? [
                    {
                      InputField: RadioGroupInput,
                      name: "attachment_type",
                      required: true,
                      label: "Attachment Method",
                      options: [
                        { value: "upload", label: "Upload New Document" },
                        {
                          value: "existing",
                          label: "Select Existing HR Document",
                        },
                      ],
                      variant: "stacked",
                    },
                    ...(formValues.attachment_type === "upload"
                      ? [
                          {
                            InputField: CoverFileUpload,
                            name: "attachments",
                            required: true,
                            label: "Upload Document",
                            variant: "AttachmentFileUpload",
                            multiple: false,
                          },
                        ]
                      : []),
                    ...(formValues.attachment_type === "existing"
                      ? [
                          {
                            InputField: SelectInputComponent,
                            name: "selected_document_id",
                            required: true,
                            label: "Select HR Document",
                            options: hrDocuments,
                            placeholder: "Choose from existing documents",
                          },
                        ]
                      : []),
                    {
                      InputField: SwitchInput,
                      name: "is_acknowledgment",
                      label: "Requires Employee Acknowledgment",
                      description: "Employee needs to acknowledge receipt",
                    },
                  ]
                : []),
            ],
          },
        ],
      }}
    />
  );
};
