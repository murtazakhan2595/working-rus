import { saveUpdateRemoteWorkChecklist, getRemoteWorkChecklistList, getRemoteWorkChecklistData } from "app/hooks/talentSphere";
import { RemoteWorkChecklist } from "app/utils/Types/TalentSphere";
import { SheetUI } from "components";
import { TextInput, TextAreaInput, RadioGroupInput } from "components/FormControl";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

const AddUpdateRemoteWorkChecklistForm = ({
  id = false,
  reloadData = () => { },
  isOpen = false,
  setIsOpen = () => { },
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [FormData, setFormData] = useState(RemoteWorkChecklist);
  const [RemoteWorkChecklistList, setRemoteWorkChecklistList] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Remote Work Checklist`,
    title: `${isEditMode ? "Edit" : "Add"} Remote Work Checklist`,
    description: null,
    footer: null,
  };



  useEffect(() => {
    const fetchRemoteWorkChecklistData = async (isMounted) => {
      try {
        setIsLoading(true);
        // Add organizationId to filter if available

        const response = await getRemoteWorkChecklistList();

        if (isMounted) {
          setRemoteWorkChecklistList(response.results);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchRemoteWorkChecklistData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    const fetchData = async (isMounted, id) => {
      try {
        setIsLoading(true);
        const response = await getRemoteWorkChecklistData(id);
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
      const response = await saveUpdateRemoteWorkChecklist(values, id);
      if (response) {
        toast.success(
          `Remote Work Checklist ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Remote Work Checklist ${isEditMode ? "Updated" : "Added"} Successfully!`,
          description: `Remote work checklist is ${isEditMode ? "updated" : "added"} successfully.`,
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
        DataList: RemoteWorkChecklistList,
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: `Checklist Details`,
            InputFields: [
              {
                InputField: RadioGroupInput,
                name: "status",
                label: "Status",
                options: [
                  { value: 'available', label: 'Available' },
                  { value: 'unavailable', label: "Unavailable" },
                ],
              },
              {
                InputField: TextInput,
                name: "item_name",
                required: true,
                label: "Name",
                validateDuplicate: true,
              },
            ],
          },
        ],
      }}
    />
  );
};

export default AddUpdateRemoteWorkChecklistForm;
