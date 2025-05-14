import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Document, DocumentAssignment } from "app/utils/Types/HRDocuments";
import { validationAssignHRDocumentFormSchema } from "app/utils/FormSchema/hrDocumentFromSchema";
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
  addUpdateDocumentAssignment,
} from "app/hooks/hrDocuments";
import { useSelector } from "react-redux";
import SheetComponent from "components/ui/CustomSheet";
import moment from "moment";
import { SelectMultiInputComponent } from "components/FormControl";

const FormSheetData = {
  //   triggerText: "",
  title: "Assign Document",
  description: null,
  footer: null,
};

const AssignDocumentForm = ({
  document_id = null,
  isOpen = true,
  setIsOpen = () => {},
}) => {
  const Departments = useSelector((state) => state.common.departments);
  const Employees = useSelector((state) => state.emp.employees);
  const Document_Category = useSelector((state) => state.doc_category.category);
  const [formData, setFormData] = useState({
    ...Document,
    ...DocumentAssignment,
  });
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [formValues, setFormValues] = useState({
    ...Document,
    ...DocumentAssignment,
  });
  const fetchData = async (isMounted) => {
    try {
      const response = await getHRDocumentData(document_id);
      if (isMounted && response) {
        setFormData(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (document_id) {
      fetchData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [document_id]);

  const handleSubmit = async (data) => {
    setDisableSubmit(true);
    try {
      const object_id_list = data.object_id;
      const failedAssignments = [];

      for (const objectId of object_id_list) {
        const payload = {
          ...data,
          object_id: objectId, // assign one at a time
          document: document_id,
        };

        try {
          await addUpdateDocumentAssignment(payload);
        } catch (error) {
          failedAssignments.push(objectId);
          console.error(
            `Error assigning document to object ID ${objectId}:`,
            error
          );
        }
      }

      if (failedAssignments.length === 0) {
        toast.success("Document Assigned Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setIsOpen(false);
      } else {
        toast.error(
          `Failed to assign document for: ${failedAssignments.join(", ")}`,
          { position: toast.POSITION.TOP_RIGHT }
        );
      }
    } catch (error) {
      console.error(`Error assigning document`, error);
    } finally {
      setDisableSubmit(false);
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
        validateFormSchema: validationAssignHRDocumentFormSchema,
        submitButtonText: "Assign Document",
        cancelButtonText: "Cancel",
        disableSubmit: disableSubmit,
        columns: 2,
        renderUpdatedFormValues: setFormValues,
        formFiels: [
          {
            sheetCardExtension: false,
            // sheetCardTitle: "Employee Details",
            InputFields: [
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
                disabled: true,
              },
              {
                InputField: TextInput,
                name: "name",
                required: true,
                label: "Document Name",
                disabled: true,
              },
              {
                InputField: SelectInputComponent,
                name: "category",
                required: true,
                label: "Category",
                options: Document_Category,
                onChange: (_, value) => {
                  // if(value){
                  //   fetchFolder(true,value);
                  // }
                },
                disabled: true,
              },
              {
                InputField: DateInput,
                name: "expiration_date",
                label: "Expiration Date",
                minDate: moment(),
                disabled: true,
              },
              ...(formValues.acknowledgment_type === "MANDATORY"
                ? [
                    {
                      InputField: DateInput,
                      name: "due_date",
                      label: "Due Date",
                      minDate: moment(),
                      maxDate: formValues.expiration_date,
                    },
                  ]
                : []),
              {
                InputField: SelectInputComponent,
                name: "target_audience",
                required: true,
                label: "Target Audience",
                options: HRDocumentTargetAudience,
              },
              ...(formValues.target_audience === "Department"
                ? [
                    {
                      InputField: SelectInputComponent,
                      name: "object_id",
                      required: true,
                      label: "Department",
                      options: Departments,
                    },
                  ]
                : []),
              ...(formValues.target_audience === "Specific Employee"
                ? [
                    {
                      InputField: SelectMultiInputComponent,
                      name: "object_id",
                      required: true,
                      label: "Employee",
                      options: Employees,
                    },
                  ]
                : []),
              {
                InputField: CoverFileUpload,
                name: "file",
                required: true,
                label: "Document",
                colsSpan: 2,
                variant: "AttachmentFileUpload",
                allowUpdate: true,
                disabled: true,
                multiple: false,
              },
            ],
          },
        ],
      }}
    ></SheetUI>
  );
};

export default AssignDocumentForm;
