import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { LetterRequest } from "app/utils/Types/HRDocuments";
import { validationLetterRequestFormSchema } from "app/utils/FormSchema/hrDocumentFromSchema";
import { TextAreaInput, TextInput } from "components/FormControl";
import { SheetUI } from "components";
import {
  addUpdateLetterRequest
} from "app/hooks/hrDocuments";
import { fetchDocumentCategory } from "state/slices/HRDocumentsSlice";
import { useDispatch } from "react-redux";

const FormSheetData = {
  triggerText: "Submit",
  title: "Add Category",
  description: null,
  footer: null,
  width: "560px",
};

const AddUpdateLetterRequest = ({ id = null, isOpen = true, setIsOpen = () => {} }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(LetterRequest);

  const handleSubmit = async (data) => {
    try {
      const response = await addUpdateLetterRequest(data, id);
      // return
      if (response) {
        if (id) {
          toast.success("Document Category Updated Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } else {
          toast.success("Document Category Submitted Successfully!", {
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
        validateFormSchema: validationLetterRequestFormSchema,
        submitButtonText: id ? "Update" : "Add",
        cancelButtonText: "Cancel",
        columns: 1,
        formFields: [
          {
            sheetCardExtension: false,
            InputFields: [
              {
                InputField: TextInput,
                name: "name",
                required: true,
                label: "Letter Name",
              },

              {
                InputField: TextAreaInput,
                name: "description",
                required: false,
                label: "Description",
                maxRows: 3,
              },
            ],
          },
        ],
      }}
    ></SheetUI>
  );
};

export default AddUpdateLetterRequest;
