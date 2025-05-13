import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Document, DocumentAssignment } from "app/utils/Types/HRDocuments";
import { validationHRDocumentFormSchema } from "app/utils/FormSchema/hrDocumentFromSchema";
import { HRDocumentTargetAudience, HRDocumentCategory } from "data/Data";
import {
  RadioGroupInput,
  TextAreaInput,
  SelectInputComponent,
  DateInput,
  TextInput,
  CoverFileUpload,
} from "components/FormControl";
import { SheetUI } from "components";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import {
  getHRDocumentData,
  addUpdateHRDocumentDetails,
} from "app/hooks/hrDocuments";
import { useSelector } from "react-redux";
import SheetComponent from "components/ui/CustomSheet";
import moment from "moment";

const FormSheetData = {
  triggerText: "Submit",
  title: "Add Document",
  description: null,
  footer: null,
};

const UploadDocumentForm = ({
  id = null,
  isOpen = true,
  setIsOpen = () => {},
}) => {
  const Departments = useSelector((state) => state.common.departments);
  const Employees = useSelector((state) => state.emp.employees);
  const Document_Category = useSelector((state) => state.doc_category.category);
  const [formData, setFormData] = useState({ ...Document });
  const [formValues, setFormValues] = useState({ ...Document });
  const fetchData = async (isMounted) => {
    try {
      const response = await getHRDocumentData(id);
      if (isMounted && response) {
        setFormData(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) {
      fetchData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      const response = await addUpdateHRDocumentDetails(data, id);
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
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: formData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: validationHRDocumentFormSchema,
        submitButtonText: id ? "Update" : "Add",
        cancelButtonText: "Cancel",
        columns: 2,
        renderUpdatedFormValues: setFormValues,
        formFiels: [
          {
            sheetCardExtension: false,
            // sheetCardTitle: "Employee Details",
            InputFiels: [
              {
                InputField: RadioGroupInput,
                name: "acknowledgment_type",
                required: true,
                disabled: false,
                label: "Acknowledgment Type",
                options: [
                  { value: "MANDATORY", label: "MANDATORY" },
                  { value: "OPTIONAL", label: "OPTIONAL" },
                ],
                colsSpan: 2,
              },
              {
                InputField: TextInput,
                name: "name",
                required: true,
                label: "Document Name",
              },
              {
                InputField: SelectInputComponent,
                name: "category",
                required: true,
                label: "Category",
                options: Document_Category,
              },
              {
                InputField: DateInput,
                name: "expiration_date",
                label: "Expiration Date",
                minDate: moment(),
              },
              {
                InputField: TextAreaInput,
                name: "description",
                required: true,
                label: "Note",
                colsSpan: 2,
                maxRows: 5,
                maxLength: 1000,
              },
              {
                InputField: CoverFileUpload,
                name: "file",
                required: true,
                label: "Document",
                colsSpan: 2,
                variant: "AttachmentFileUpload",
                allowUpdate: true,
                multiple: false,
              },
            ],
          },
        ],
      }}
    ></SheetUI>
  );
};

export default UploadDocumentForm;
