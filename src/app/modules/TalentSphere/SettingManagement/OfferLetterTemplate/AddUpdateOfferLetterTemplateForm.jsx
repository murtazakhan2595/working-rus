import { saveUpdateOfferLetterTemplate, getOfferLetterTemplateList, getOfferLetterTemplateData } from "app/hooks/talentSphere";
import { OfferLetterTemplate } from "app/utils/Types/TalentSphere";
import { SheetUI } from "components";
import { CoverFileUpload } from "components/FormControl";
import { TextInput, TextEditorInputField, RadioGroupInput } from "components/FormControl";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

const AddUpdateOfferLetterTemplateForm = ({
  id = false,
  reloadData = () => { },
  isOpen = false,
  setIsOpen = () => { },
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [FormData, setFormData] = useState(OfferLetterTemplate);
  const [OfferLetterTemplateList, setOfferLetterTemplateList] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Offer Letter Template`,
    title: `${isEditMode ? "Edit" : "Add"} Offer Letter Template`,
    description: null,
    footer: null,
  };



  useEffect(() => {
    const fetchOfferLetterTemplateData = async (isMounted) => {
      try {
        setIsLoading(true);
        // Add organizationId to filter if available

        const response = await getOfferLetterTemplateList();

        if (isMounted) {
          setOfferLetterTemplateList(response.results);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchOfferLetterTemplateData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    const fetchData = async (isMounted, id) => {
      try {
        setIsLoading(true);
        const response = await getOfferLetterTemplateData(id);
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
      const response = await saveUpdateOfferLetterTemplate(values, id);
      if (response) {
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Offer Letter Template ${isEditMode ? "Updated" : "Added"} Successfully!`,
          description: `Offer Letter Template is ${isEditMode ? "updated" : "added"} successfully.`,
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
        DataList: OfferLetterTemplateList,
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
                InputField: TextInput,
                name: "subject",
                label: "Title",
                validateDuplicate: true,
                description: <div>
                  Use the following placeholders to insert dynamic data:
                  <ul className="[list-style:disc] ml-4">
                    <li>Applicant Name → <code>{'{{ applicant_name }}'}</code></li>
                  </ul>
                </div>
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
                    <li>Designation / Job Position → <code>{'{{ designation }}'}</code></li>
                    <li>Salary → <code>{'{{ salary }}'}</code></li>
                    <li>Joining Date → <code>{'{{ joining_date }}'}</code></li>
                    <li>Work Location → <code>{'{{ work_location }}'}</code></li>
                  </ul>
                </div>
              },
              {
                InputField: CoverFileUpload,
                name: "letterhead",
                required: true,
                label: "Letter Header",
                acceptType:".png,.jpeg",
                maxSize:5,
              },
            ],
          },
        ],
      }}
    />
  );
};

export default AddUpdateOfferLetterTemplateForm;
