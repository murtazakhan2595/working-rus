"use client"
import { useEffect, useState } from "react"
import { SheetUI } from "components"
import { toast } from "react-toastify"
import {
  getDemographicFormById,
  saveUpdateDemographicForm,
  saveUpdateDemographicSection,
  saveUpdateDemographicField,
} from "app/hooks/talentSphere"
import { AddNewSection, AddNewSectionField, RemoveSection } from "../Sections"
import { TextInput, TextAreaInput, RadioGroupInput, SelectInputComponent } from "components/FormControl";
import { useSelector } from "react-redux"

const DemographicFormStructure = {
  name: "",
  description: "",
  is_active: true,
  sections: [],
}


const isTempId = (id) => typeof id === 'string' && id.startsWith('temp_')

const DemographicsSheet = ({ isOpen, setIsOpen, id, reloadData, mode }) => {
  const [formValues, setFormValues] = useState(null)
  const [formData, setFormData] = useState(DemographicFormStructure)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const isEditMode = Boolean(id)
  const userId = useSelector((state) => state.user.userProfile.id)

  const FormSheetData = {
    triggerText: "",
    title: `${mode === "view"
        ? "Preview"
        : mode === "edit" && isEditMode
          ? "Edit"
          : "Add"
      } Demographics Form`,

    description: "Manage form name, sections, and fields.",
    footer: null,
  }

  const fieldTypeOptions = [
    { label: "Text", value: "text" },
    { label: "Number", value: "number" },
    { label: "Date", value: "date" },
    { label: "Dropdown", value: "select" },
    { label: "Radio", value: "radio" },
    { label: "Checkbox", value: "checkbox" },
    { label: "File", value: "file" },
  ]

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      if (id) {
        try {
          setIsLoading(true)
          const response = await getDemographicFormById(id)
          if (isMounted) {
            setFormData(response)
            setFormValues(response)
          }
        } catch (error) {
          toast.error("Failed to load form")
          console.error("Error fetching form:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleClose = () => {
    setIsOpen(false)
    reloadData()
  }

  const handleSubmit = async (values) => {
    setIsSubmittingForm(true)
    try {
      const formPayload = {
        name: values.name?.trim(),
        description: values.description || "",
        is_active: Boolean(values.is_active),
        created_by: id ? formData.created_by?.id : userId,
        updated_by: userId,
      }

      // Save/update the main form
      let savedForm
      if (id) {
        savedForm = await saveUpdateDemographicForm(formPayload, id)
      } else {
        savedForm = await saveUpdateDemographicForm(formPayload)
      }

      if (!savedForm) {
        throw new Error("Failed to save form")
      }

      const formId = savedForm.id || id

      // Track mapping of temp IDs to real IDs
      const sectionIdMapping = {}

      // Process sections
      if (values.sections && values.sections.length > 0) {
        for (let sectionIndex = 0; sectionIndex < values.sections.length; sectionIndex++) {
          const section = values.sections[sectionIndex]

          const sectionPayload = {
            heading: section.heading || "",
            description: section.description || "",
            order: sectionIndex + 1,
            form: formId,
          }

          let savedSection

          // Check if it's an existing section (has numeric ID)
          if (section.id && typeof section.id === "number") {
            savedSection = await saveUpdateDemographicSection(sectionPayload, section.id)
          }
          // Check if it's a new section (has temp ID or no ID)
          else {
            savedSection = await saveUpdateDemographicSection(sectionPayload)
          }

          if (!savedSection) {
            throw new Error(`Failed to save section ${sectionIndex + 1}`)
          }

          // Store the mapping for temp IDs
          if (isTempId(section.id)) {
            sectionIdMapping[section.id] = savedSection.id
          }

          const sectionId = savedSection.id

          // Process fields for this section
          if (section.fields && section.fields.length > 0) {
            for (let fieldIndex = 0; fieldIndex < section.fields.length; fieldIndex++) {
              const field = section.fields[fieldIndex]

              const fieldPayload = {
                label: field.label || "",
                field_type: field.field_type || "text",
                required: Boolean(field.required),
                attachment_required: Boolean(field.attachment_required),
                options: field.options,
                order: fieldIndex + 1,
                section: sectionId,
              }

              let savedField

              // Check if it's an existing field (has numeric ID)
              if (field.id && typeof field.id === "number") {
                savedField = await saveUpdateDemographicField(fieldPayload, field.id)
              }
              // Check if it's a new field (has temp ID or no ID)
              else {
                savedField = await saveUpdateDemographicField(fieldPayload)
              }

              if (!savedField) {
                throw new Error(`Failed to save field ${fieldIndex + 1} in section ${sectionIndex + 1}`)
              }
            }
          }
        }
      }

      toast.success(`Demographics Form ${isEditMode ? "Updated" : "Created"} successfully`)
      handleClose()
    } catch (error) {
      console.error("Form save error:", error)
      const errorMessage =
        error?.response?.data?.form?.[0] ||
        error?.response?.data?.heading?.[0] ||
        error?.message ||
        `Failed to ${isEditMode ? "update" : "create"} form.`
      toast.error(errorMessage)
    } finally {
      setIsSubmittingForm(false)
    }
  }

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: formData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        submitButtonText: mode === "view" ? null : "Submit",
        cancelButtonText: "Cancel",
        columns: 2,
        renderUpdatedFormValues: setFormValues,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: "Form Details",
            InputFields: [
              {
                InputField: TextInput,
                name: "name",
                label: "Form Name",
                required: true,
                colsSpan: 2,
              },
              {
                InputField: TextAreaInput,
                name: "description",
                label: "Description",
                placeholder: "Enter description",
                colsSpan: 2,
              },
              {
                InputField: RadioGroupInput,
                name: "is_active",
                label: "Status",
                required: true,
                options: [
                  { label: "Active", value: true },
                  { label: "Inactive", value: false },
                ],
              },
            ],
          },
          ...(formValues?.sections
            ? formValues.sections.map((section, sectionIndex) => ({
              sheetCardExtension: true,
              sheetCardTitle: `Section ${sectionIndex + 1}: ${section.heading || "Untitled"}`,
              InputFields: [
                {
                  InputField: RemoveSection,
                  name: "sections",
                  colsSpan: 2,
                  section: section,
                  index: sectionIndex,
                },
                {
                  InputField: TextInput,
                  name: `sections[${sectionIndex}].heading`,
                  label: "Section Heading",
                  required: true,
                  value: section.heading,
                  colsSpan: 2,
                },
                {
                  InputField: TextAreaInput,
                  name: `sections[${sectionIndex}].description`,
                  label: "Section Description",
                  value: section.description,
                  colsSpan: 2,
                },
                ...(section.fields
                  ? section.fields.flatMap((field, fieldIndex) => [
                    {
                      InputField: () => (
                        <div className="flex items-center justify-between w-full">
                          <div className="font-semibold text-sm text-gray-600">
                            Field {fieldIndex + 1}: {field.label || "Untitled Field"}
                          </div>
                          <RemoveSection
                            name={`sections[${sectionIndex}].fields`}
                            section={field}
                            index={fieldIndex}
                            type="field"
                          />
                        </div>
                      ),
                      colsSpan: 2,
                    },
                    {
                      InputField: TextInput,
                      name: `sections[${sectionIndex}].fields[${fieldIndex}].label`,
                      label: "Field Label",
                      value: field.label,
                      required: true,
                    },
                    {
                      InputField: SelectInputComponent,
                      name: `sections[${sectionIndex}].fields[${fieldIndex}].field_type`,
                      label: "Field Type",
                      value: field.field_type,
                      options: fieldTypeOptions,
                      required: true,
                    },
                    {
                      InputField: RadioGroupInput,
                      name: `sections[${sectionIndex}].fields[${fieldIndex}].required`,
                      label: "Required",
                      value: field.required,
                      options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                      ],
                    },
                    {
                      InputField: RadioGroupInput,
                      name: `sections[${sectionIndex}].fields[${fieldIndex}].attachment_required`,
                      label: "Attachment Required",
                      value: field.attachment_required,
                      options: [
                        { label: "Yes", value: true },
                        { label: "No", value: false },
                      ],
                    },
                  ])
                  : []),
                {
                  InputField: AddNewSectionField,
                  name: `sections[${sectionIndex}].fields`,
                  colsSpan: 2,
                  value: section.fields,
                  sectionId: section.id,
                },
              ],
            }))
            : []),
          {
            sheetCardExtension: false,
            sheetCardTitle: "Form Sections",
            InputFields: [
              {
                InputField: AddNewSection,
                name: "sections",
                colsSpan: 2,
                value: formValues?.sections || [],
                formId: id || formData.id,
              },
            ],
          },
        ],
      }}
    />
  )
}

export default DemographicsSheet