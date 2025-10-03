import { saveUpdateSkill, getSkillList, getSkillData } from "app/hooks/talentSphere";
import { Skill } from "app/utils/Types/TalentSphere";
import { SheetUI } from "components";
import { TextInput, TextAreaInput, RadioGroupInput } from "components/FormControl";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

const AddUpdateSkillForm = ({
  id = false,
  reloadData = () => { },
  isOpen = false,
  setIsOpen = () => { },
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [FormData, setFormData] = useState(Skill);
  const [SkillList, setSkillList] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Skill`,
    title: `${isEditMode ? "Edit" : "Add"} Skill`,
    description: null,
    footer: null,
  };



  useEffect(() => {
    const fetchSkillData = async (isMounted) => {
      try {
        setIsLoading(true);
        // Add organizationId to filter if available

        const response = await getSkillList();

        if (isMounted) {
          setSkillList(response.results);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchSkillData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    const fetchData = async (isMounted, id) => {
      try {
        setIsLoading(true);
        const response = await getSkillData(id);
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
      const response = await saveUpdateSkill(values, id);
      if (response) {
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Skill ${isEditMode ? "Updated" : "Added"} Successfully!`,
          description: `Skill is ${isEditMode ? "updated" : "added"} successfully.`,
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
        DataList: SkillList,
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: `Skill Details`,
            InputFields: [
              {
                InputField: RadioGroupInput,
                name: "status",
                label: "Status",
                options: [
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: "Inactive" },
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

export default AddUpdateSkillForm;
