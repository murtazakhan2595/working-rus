import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DocumentCategory } from "app/utils/Types/HRDocuments";
import { validationDocumentCategoryFormSchema } from "app/utils/FormSchema/hrDocumentFromSchema";
import { TextAreaInput, TextInput } from "components/FormControl";
import { SheetUI } from "components";
import {
  getDocumentCategoryData,
  addUpdateDocumentcategory,
} from "app/hooks/hrDocuments";
import { fetchDocumentCategory } from "state/slices/HRDocumentsSlice";
import { useDispatch } from "react-redux";

const FormSheetData = {
  triggerText: "Submit",
  title: "Add New Category",
  description: null,
  footer: null,
  width: "560px",
};

const CategoryForm = ({ id = null, isOpen = true, setIsOpen = () => {} }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(DocumentCategory);
  const fetchData = async (isMounted) => {
    try {
      const response = await getDocumentCategoryData(id);
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
      const response = await addUpdateDocumentcategory(data, id);
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
        dispatch(fetchDocumentCategory());
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
        validateFormSchema: validationDocumentCategoryFormSchema,
        submitButtonText: id ? "Update" : "Add",
        cancelButtonText: "Cancel",
        columns: 1,
        formFiels: [
          {
            sheetCardExtension: false,
            InputFiels: [
              {
                InputField: TextInput,
                name: "name",
                required: true,
                label: "Category Name",
              },

              {
                InputField: TextAreaInput,
                name: "description",
                required: false,
                label: "Description",
                maxRows: 5,
              },
            ],
          },
        ],
      }}
    ></SheetUI>
  );
};

export default CategoryForm;
