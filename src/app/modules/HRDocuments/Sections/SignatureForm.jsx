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
  const Departments = useSelector((state) => state.common.departments);
  const Employees = useSelector((state) => state.emp.employees);
  const Document_Category = useSelector((state) => state.doc_category.category);
  const [formData, setFormData] = useState({
    signature: null,
    signature_data: moment().format("YYYY-MM-DD"),
  });
  const [formValues, setFormValues] = useState({
    signature: null,
    signature_data: moment().format("YYYY-MM-DD"),
  });
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

  console.log(formValues, "formVslued");
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
        validateFormSchema: validationHRDocumentFormSchema,
        submitButtonText: "Submit Signature",
        cancelButtonText: "Cancel",
        columns: 1,
        renderUpdatedFormValues: setFormValues,
        formFiels: [
          {
            sheetCardExtension: false,
            // sheetCardTitle: "Employee Details",
            InputFiels: [
              {
                InputField: InputSignature,
                name: "signature",
                required: true,
                disabled: false,
                label: "Signature",
                variant: "Draw",
              },
            ],
          },
        ],
      }}
    >
      <div className="border p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Signature</h2>
      {formValues.signature ? (
        <img src={URL.createObjectURL(formValues.signature)} alt="Signature" className="w-48 h-auto" />
      ) : (
        <p>No signature available</p>
      )}
    </div>
    </SheetUI>
  );
};

export default UploadDocumentForm;
