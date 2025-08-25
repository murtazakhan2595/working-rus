import { saveUpdateEvaluationType } from "app/hooks/officeSetting";
import { EvaluationType } from "app/utils/Types/OfficeSetting";
import { SheetUI } from "components";
import { TextInput } from "components/FormControl";
import { getEvaluationTypeList, getEvaluationTypeData } from "app/hooks/officeSetting";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { TextAreaInput } from "components/FormControl";

const AddEvaluationTypeForm = ({
  id = false,
  reloadData = () => { },
  isOpen = false,
  setIsOpen = () => { },
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [FormData, setFormData] = useState(EvaluationType);
  const [EvaluationTypeList, setEvaluationTypeList] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Evaluation Type`,
    title: `${isEditMode ? "Edit" : "Add"} Evaluation Type`,
    description: null,
    footer: null,
  };



  useEffect(() => {
    const fetchEvaluationTypeData = async (isMounted) => {
      try {
        setIsLoading(true);
        // Add organizationId to filter if available

        const response = await getEvaluationTypeList();

        if (isMounted) {
          setEvaluationTypeList(response.results);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchEvaluationTypeData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    const fetchData = async (isMounted, id) => {
      try {
        setIsLoading(true);
        const response = await getEvaluationTypeData(id);
        if (isMounted) {
          setFormData(response);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    if (id) fetchData(isMounted, id);
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleClose = () => {
    setIsOpen(false);
    reloadData(true);
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmittingForm(true);
      const response = await saveUpdateEvaluationType(values, id);
      if (response) {
        toast.success(
          `Evaluation Type ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        handleClose(); // Pass true to indicate successful update
      }
    } catch (error) {
      console.error("ERROR", error);
    } finally {
      setIsSubmittingForm(false);
    }
  };


  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: FormData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: () => { },
        DataList: EvaluationTypeList,
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: `Evaluation Type Details`,
            InputFields: [
              {
                InputField: TextInput,
                name: "name",
                required: true,
                label: "Name",
                validateDuplicate: true,
              },
              {
                InputField: TextAreaInput,
                name: "description",
                label: "Description",
                maxRows: 3,
              },
            ],
          },
        ],
      }}
    />
  );
};

export default AddEvaluationTypeForm;
