import { saveUpdateFeedBackForm, getFeedBackFormList, getFeedBackFormData } from "app/hooks/talentSphere";
import { FeedBackForm } from "app/utils/Types/TalentSphere";
import { SheetUI } from "components";
import { TextInput, TextAreaInput, RadioGroupInput, NumberInput, SelectInputComponent } from "components/FormControl";
import React, { useEffect, useState, useCallback } from "react";
import { AddNewSection, AddNewSectionField, RemoveSection } from "app/modules/TalentSphere/Sections";
import { validateFeedbackFormSchema } from "app/utils/FormSchema/TalentSphereFormSchema";
import { Trash2 } from "lucide-react";


const AddUpdateFeedBackForm = ({
  id = false,
  reloadData = () => { },
  isOpen = false,
  setIsOpen = () => { },
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [FormData, setFormData] = useState(FeedBackForm);
  const [FormValues, setFormValues] = useState(FeedBackForm);
  const [FeedBackFormList, setFeedBackFormList] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Feedback Form`,
    title: `${isEditMode ? "Edit" : "Add"} Feedback Form`,
    description: null,
    footer: null,
  };



  useEffect(() => {
    const fetchFeedBackFormData = async (isMounted) => {
      try {
        setIsLoading(true);
        // Add organizationId to filter if available

        const response = await getFeedBackFormList();

        if (isMounted) {
          setFeedBackFormList(response.results);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchFeedBackFormData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);


  useEffect(() => {
    const fetchData = async (isMounted, id) => {
      try {
        setIsLoading(true);
        const response = await getFeedBackFormData(id);
        if (isMounted) {
          setFormData(response);
          setFormValues(response);
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
      const response = await saveUpdateFeedBackForm(values, id);
      if (response) {
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Feedback Form ${isEditMode ? "Updated" : "Added"} Successfully!`,
          description: `Feedback Form is ${isEditMode ? "updated" : "added"} successfully.`,
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
        validateFormSchema: validateFeedbackFormSchema,
        renderUpdatedFormValues: setFormValues,
        DataList: FeedBackFormList,
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 2,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: `Form Details`,
            InputFields: [
              {
                InputField: RadioGroupInput,
                name: "status",
                label: "Status",
                options: [
                  { value: 'ACTIVE', label: 'Active' },
                  { value: 'INACTIVE', label: "Inactive" },
                ],
                colsSpan: 2,
              },
              {
                InputField: TextInput,
                name: "name",
                regEx: 'NAME_REGEX',
                required: true,
                label: "Form Name",
                validateDuplicate: true,
              },


            ],
          },
          // Conditionally render levels from FormValues
          ...(FormValues?.sections
            ? FormValues.sections.map((section, index) => ({
              sheetCardExtension: true,
              sheetCardTitle: `${section.title || ''} Section`,
              InputFields: [
                {
                  InputField: TextInput,
                  name: `sections[${index}].title`,
                  label: "Name",
                  required: true,
                  regEx: 'NAME_REGEX',
                  value: section.title,
                },
                {
                  InputField: RemoveSection,
                  name: "sections",
                  index: index,
                  confirmText: `Confirm delete ${section.title} section?`,

                },
                ...(section.fields
                  ? section.fields.map((field, fieldIndex) => ([
                    {
                      InputField: () => { return <div key={`sections[${index}]`} className='font-bold text-plum-900 text-[15px]'>Section Field {fieldIndex + 1}</div> },
                    },
                    {
                      InputField: RemoveSection,
                      name: `sections[${index}].fields`,
                      index: fieldIndex,
                      Icon: Trash2,
                      confirmText: `Confirm delete ${field.label} in ${section.title} section?`,
                    },
                    {
                      InputField: TextInput,
                      name: `sections[${index}].fields[${fieldIndex}].label`,
                      label: "Label",
                      required: true,
                      value: field.label,
                      colsSpan: 2,
                      regEx: 'NAME_REGEX',
                    },
                    {
                      InputField: SelectInputComponent,
                      name: `sections[${index}].fields[${fieldIndex}].field_type`,
                      label: "Field Type",
                      required: true,
                      value: field.field_type,
                      options: [{ label: 'Radio', value: 'RADIO' }, { label: 'Rating', value: 'RATING' }, { label: 'Text', value: 'TEXT' }]
                    },
                    ...(field.field_type === 'RATING' ? [{
                      InputField: NumberInput,
                      name: `sections[${index}].fields[${fieldIndex}].rating_scale_max`,
                      label: "Max. Rating Scale",
                      required: true,
                      value: field.rating_scale_max,
                    }] : []),
                    ...(field.field_type === 'RADIO' ? [{
                      InputField: TextInput,
                      name: `sections[${index}].fields[${fieldIndex}].radio_options`,
                      label: "Radio Options",
                      required: true,
                      regEx: 'OPTIONS_REGEX',
                      value: field.radio_options,
                      description: 'Add radio input options separated by commas. Allowed characters include letters, numbers, spaces, dots, hyphens, underscores, and commas.',
                    }] : []),
                    {
                      InputField: () => { return <div key={`sections[${index}]`} className='border-b h-1'></div> },
                      colsSpan: 2
                    },

                  ])).flat()
                  : []
                ),
                {
                  InputField: AddNewSectionField,
                  name: `sections[${index}].fields`,
                  colsSpan: 2,
                  value: section.fields,
                  defaultSectionField: FeedBackForm.sections[0].fields[0]
                },
              ],
            }))
            : []),
          {
            sheetCardExtension: false,
            sheetCardTitle: `New Sections`,
            InputFields: [
              {
                InputField: AddNewSection,
                name: "sections",
                colsSpan: 2,
                defaultSection: FeedBackForm.sections[0]
              },
            ],
          },
        ],
      }}
    />
  );
};

export default AddUpdateFeedBackForm;
