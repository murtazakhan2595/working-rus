import { saveUpdateBlacklistReason, getBlacklistReasonList, getBlacklistReasonData } from "app/hooks/talentSphere";
import { BlacklistReason } from "app/utils/Types/TalentSphere";
import { SheetUI } from "components";
import { TextInput, TextAreaInput, RadioGroupInput } from "components/FormControl";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

const AddUpdateBlacklistReasonForm = ({
  id = false,
  reloadData = () => { },
  isOpen = false,
  setIsOpen = () => { },
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [FormData, setFormData] = useState(BlacklistReason);
  const [BlacklistReasonList, setBlacklistReasonList] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Blacklist Reason`,
    title: `${isEditMode ? "Edit" : "Add"} Blacklist Reason`,
    description: null,
    footer: null,
  };



  useEffect(() => {
    const fetchBlacklistReasonData = async (isMounted) => {
      try {
        setIsLoading(true);
        // Add organizationId to filter if available

        const response = await getBlacklistReasonList();

        if (isMounted) {
          setBlacklistReasonList(response.results);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchBlacklistReasonData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    const fetchData = async (isMounted, id) => {
      try {
        setIsLoading(true);
        const response = await getBlacklistReasonData(id);
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
      const response = await saveUpdateBlacklistReason(values, id);
      if (response) {
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Blacklist Reason ${isEditMode ? "Updated" : "Added"} Successfully!`,
          description: `Blacklist reason is ${isEditMode ? "updated" : "added"} successfully.`,
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
        DataList: BlacklistReasonList,
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: `Reason Details`,
            InputFields: [
              {
                InputField: RadioGroupInput,
                name: "is_active",
                label: "Status",
                options: [
                  { value: true, label: 'Active' },
                  { value: false, label: "Inactive" },
                ],
              },
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

export default AddUpdateBlacklistReasonForm;
