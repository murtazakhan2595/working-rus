import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Document, DocumentAssignment } from "app/utils/Types/HRDocuments";
import { validationHRDocumentFormSchema } from "app/utils/FormSchema/hrDocumentFromSchema";
import { HRDocumentTargetAudience, HRDocumentCategory } from "data/Data";
import { InputSignature } from "components/FormControl";
import { SheetUI } from "components";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import {
  getHRDocumentData,
  addUpdateDocumentAssignment,
} from "app/hooks/hrDocuments";
import { useSelector } from "react-redux";
import SheetComponent from "components/ui/CustomSheet";
import moment from "moment";

const FormSheetData = {
  triggerText: "Submit",
  title: "Sign Document",
  description: null,
  footer: null,
};

const UploadDocumentForm = ({
  id = null,
  isOpen = true,
  setIsOpen = () => {},
}) => {
 const [formData, setFormData] = useState({
    signature_file: null,
    signature_data: moment().format("YYYY-MM-DD"),
  });

  const handleSubmit = async (data) => {
    try {
      const response = await addUpdateDocumentAssignment(data, id);
      // return
      if (response) {
        if (id) {
          toast.success("Document Updated Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.success("Document Submitted Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        setIsOpen(false);
      }
    } catch (error) {
      // Handle errors and rollback form data
      setFormData(data);
      console.error(error);
    }
  };
  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      variant="modal"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: formData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: (values) => {
          const error = {};
          if (!values.signature_file) error.signature_file = "Signature is required";
          return error;
        },
        submitButtonText: "Submit Signature",
        cancelButtonText: "Cancel",
        columns: 1,
      //  renderUpdatedFormValues: setFormValues,
        formFields: [
          {
            sheetCardExtension: false,
            // sheetCardTitle: "Employee Details",
            InputFields: [
              {
                InputField: InputSignature,
                name: "signature_file",
                required: true,
                disabled: false,
                label: "Signature",
                //   variant: "Type",
              },
            ],
          },
        ],
      }}
    ></SheetUI>
  );
};

export default UploadDocumentForm;
