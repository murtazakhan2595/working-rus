import { saveUpdateEmailTemplate, getEmailTemplateList, getEmailTemplateData } from "app/hooks/talentSphere";
import { EmailTemplate } from "app/utils/Types/TalentSphere";
import { SheetUI } from "components";
import { SelectInputComponent } from "components/FormControl";
import { TextInput, TextEditorInputField, RadioGroupInput } from "components/FormControl";
import React, { useEffect, useState, useCallback } from "react";
import { RecruitmentEmailTemplateType } from "data/Data";

const AddUpdateEmailTemplateForm = ({
  id = false,
  reloadData = () => { },
  isOpen = false,
  setIsOpen = () => { },
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [FormData, setFormData] = useState(EmailTemplate);
  const [EmailTemplateList, setEmailTemplateList] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Email Template`,
    title: `${isEditMode ? "Edit" : "Add"} Email Template`,
    description: null,
    footer: null,
  };



  useEffect(() => {
    const fetchEmailTemplateData = async (isMounted) => {
      try {
        setIsLoading(true);
        // Add organizationId to filter if available

        const response = await getEmailTemplateList();

        if (isMounted) {
          setEmailTemplateList(response.results);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchEmailTemplateData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    const fetchData = async (isMounted, id) => {
      try {
        setIsLoading(true);
        const response = await getEmailTemplateData(id);
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
      const response = await saveUpdateEmailTemplate(values, id);
      if (response) {
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Email Template ${isEditMode ? "Updated" : "Added"} Successfully!`,
          description: `Email Template is ${isEditMode ? "updated" : "added"} successfully.`,
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
        DataList: EmailTemplateList,
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: `Template Details`,
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
                InputField: SelectInputComponent,
                name: "template_type",
                options:RecruitmentEmailTemplateType,
                label: "Template Type",
                description: 'Select the type for specific recruitment events',
                validateDuplicate: true,
              },
              {
                InputField: TextInput,
                name: "subject",
                required: true,
                label: "Email Subject Line",
              },
              {
                InputField: TextEditorInputField,
                name: "body",
                required: true,
                label: "Email Body",
                description: <div>
                  Use the following placeholders to insert dynamic data:
                  <ul className="[list-style:disc] ml-4">
                    <li>Applicant Name → <code>{'{{ applicant_name }}'}</code></li>
                    <li>Designation / Job Position → <code>{'{{ job_title }}'}</code></li>
                    <li>Salary → <code>{'{{ interview_date_time }}'}</code></li>
                    <li>Recruiter Name → <code>{'{{ recruiter_name }}'}</code></li>
                    <li>Comapny Name → <code>{'{{ company_name }}'}</code></li>
                    <li>Applicant Status/Stage → <code>{'{{ status }}'}</code></li>
                    <li>Application Link → <code>{'{{ application_link }}'}</code></li>
                    <li>Date → <code>{'{{ date }}'}</code></li>
                    <li>Time → <code>{'{{ time }}'}</code></li>
                  </ul>
                </div>
              },
               {
                InputField: TextInput,
                name: "signature",
                label: "Email Signature",
              },
            ],
          },
        ],
      }}
    />
  );
};

export default AddUpdateEmailTemplateForm;
