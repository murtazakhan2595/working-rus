import React, { useState } from "react";
import { saveEmployeeExitDetail } from "app/hooks/employeeExitAndClearance";
import { CoverFileUpload } from "components/FormControl";
import { SheetUI } from "components";

const UploadClearanceReport = ({ isOpen, setIsOpen, exit_id }) => {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const FormData = { clearance_report: null };

  const FormSheetData = {
    triggerText: null,
    title: "Upload Clearance Report",
    description: null,
    footer: null,
    className: "w-[55vw] min-w-[400px] max-w-[700px]",
  };

  const handleSubmit = async (values) => {
    setIsSubmittingForm(true);
    try {
      // Save the final settlement
      const response = await saveEmployeeExitDetail(
        {
          clearance_status: "COMPLETED",
          clearance_report: values.clearance_report,
        },
        exit_id
      );
      if (response) {
        return {
          status: true,
          title: "Clearance Completed Succesfully",
          description:
            "The clearance of employee have completed successfully. Clearnce report is submitted.",
          messageType: "Success",
        };
      }
    } catch (error) {
      console.error("Error in final settlement submission:", error);
    } finally {
      setIsSubmittingForm(false);
    }
  };
  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      variant="modal"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: FormData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: (values) => {
          const errors = {};
          if (!values.clearance_report)
            errors.clearance_report = "Attachment is required";
          return errors;
        },
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            InputFields: [
              {
                InputField: CoverFileUpload,
                name: "clearance_report",
                label: "Clearance Report",
                required: true,
                description:
                  "Upload the clearance report to completed the clearance process.",
              },
            ].filter(Boolean),
          },
        ],
      }}
    ></SheetUI>
  );
};

export default UploadClearanceReport;
