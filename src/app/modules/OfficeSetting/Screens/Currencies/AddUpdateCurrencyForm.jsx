import { saveUpdateCurrency, getCurrencyList, getCurrencyData } from "app/hooks/officeSetting";
import { Currency } from "app/utils/Types/OfficeSetting";
import { SheetUI } from "components";
import { SelectInputComponent } from "components/FormControl";
import { TextInput, TextAreaInput, RadioGroupInput } from "components/FormControl";
import React, { useEffect, useState, useCallback } from "react";
import { countriesList ,CurrencyList} from "data/Data";

const AddUpdateCurrencyForm = ({
  id = false,
  reloadData = () => { },
  isOpen = false,
  setIsOpen = () => { },
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [FormData, setFormData] = useState(Currency);
  const [CurrencyListData, setCurrencyListData] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Currency`,
    title: `${isEditMode ? "Edit" : "Add"} Currency`,
    description: null,
    footer: null,
  };



  useEffect(() => {
    const fetchCurrencyData = async (isMounted) => {
      try {
        setIsLoading(true);
        // Add organizationId to filter if available

        const response = await getCurrencyList();

        if (isMounted) {
          setCurrencyListData(response.results);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchCurrencyData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    const fetchData = async (isMounted, id) => {
      try {
        setIsLoading(true);
        const response = await getCurrencyData(id);
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
      const response = await saveUpdateCurrency(values, id);
      if (response) {
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Currency ${isEditMode ? "Updated" : "Added"} Successfully!`,
          description: `Currency is ${isEditMode ? "updated" : "added"} successfully.`,
        };
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
        DataList: CurrencyListData,
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: `Currency Details`,
            InputFields: [
              {
                InputField: SelectInputComponent,
                name: "name",
                label: "Country",
                options: countriesList,
                required: true,
                validateDuplicate: true,
                onFieldUpdate: async (_, value, __, handleChange) => {
                  debugger;
                  const currency = CurrencyList.find(obj => obj.country === value);
                  handleChange('code',currency?.currency)
                },
              },
              {
                InputField: TextInput,
                name: "code",
                required: true,
                label: "Code",
                disabled: true,
              },
            ],
          },
        ],
      }}
    />
  );
};

export default AddUpdateCurrencyForm;
