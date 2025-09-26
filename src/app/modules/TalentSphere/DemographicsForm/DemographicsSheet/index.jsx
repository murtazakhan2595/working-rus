"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

import { SheetUI } from "components"
import { AddNewSection, AddNewSectionField, RemoveSection } from "../Sections"
import {
  TextInput,
  TextAreaInput,
  RadioGroupInput,
  SelectInputComponent
} from "components/FormControl"

import {
  getDemographicFormById,
  saveUpdateDemographicForm,
  saveUpdateDemographicSection,
  saveUpdateDemographicField,
} from "app/hooks/talentSphere"

const DEMOGRAPHIC_FORM_STRUCTURE = {
  name: "",
  description: "",
  is_active: true,
  sections: [],
}

const NAME_REGEX = /^[A-Za-z0-9 _-]+$/

const FIELD_TYPE_OPTIONS = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Email", value: "email" },
  { label: "Date", value: "date" },
  { label: "Radio", value: "radio" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Dropdown", value: "dropdown" },
  { label: "File Upload", value: "file" },
  { label: "Toggle", value: "toggle" },
];


const FILE_TYPE_OPTIONS = [
  { label: "PDF", value: "pdf" },
  { label: "Word Document", value: "docx" },
  { label: "Excel Sheet", value: "xlsx" },
  { label: "Image", value: "image" },
]

const STATUS_OPTIONS = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
]

const REQUIRED_OPTIONS = [
  { label: "Yes", value: true },
  { label: "No", value: false },
]

const isTempId = (id) => typeof id === 'string' && id.startsWith('temp_')

const isValidName = (name) => {
  if (!name) return false
  const trimmed = name.trim()
  return NAME_REGEX.test(trimmed) && trimmed.length >= 3
}

const DemographicsSheet = ({
  isOpen,
  setIsOpen,
  id,
  reloadData,
  mode
}) => {
  const [formValues, setFormValues] = useState(null)
  const [formData, setFormData] = useState(DEMOGRAPHIC_FORM_STRUCTURE)
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

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      if (!id) return

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

    fetchData()

    return () => {
      isMounted = false
    }
  }, [id])

  const handleClose = () => {
    setIsOpen(false)
    reloadData()
  }

  const validateSections = (sections) => {
    if (!sections || sections.length === 0) return true

    if (sections.some(section => !section.heading?.trim())) {
      toast.error("Each section must have a heading")
      return false
    }

    const sectionHeadings = sections.map(s => s.heading?.trim().toLowerCase())
    const duplicateSections = sectionHeadings.filter((h, i) =>
      h && sectionHeadings.indexOf(h) !== i
    )

    if (duplicateSections.length > 0) {
      toast.error("Duplicate section headings are not allowed")
      return false
    }

    return true
  }

  const validateFields = (sections) => {
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex]

      if (!section.fields || section.fields.length === 0) continue

      if (section.fields.some(field => !field.label?.trim())) {
        toast.error(`Field label is required in section ${sectionIndex + 1}`)
        return false
      }

      const fieldLabels = section.fields.map(f => f.label?.trim().toLowerCase())
      const duplicateFields = fieldLabels.filter((l, j) =>
        l && fieldLabels.indexOf(l) !== j
      )

      if (duplicateFields.length > 0) {
        toast.error(`Duplicate field labels are not allowed in section ${sectionIndex + 1}`)
        return false
      }
    }

    return true
  }

  const saveForm = async (formPayload) => {
    if (id) {
      return await saveUpdateDemographicForm(formPayload, id)
    } else {
      return await saveUpdateDemographicForm(formPayload)
    }
  }

  const saveSection = async (sectionPayload, sectionId) => {
    if (sectionId && typeof sectionId === "number") {
      return await saveUpdateDemographicSection(sectionPayload, sectionId)
    } else {
      return await saveUpdateDemographicSection(sectionPayload)
    }
  }

  const saveField = async (fieldPayload, fieldId) => {
    if (fieldId && typeof fieldId === "number") {
      return await saveUpdateDemographicField(fieldPayload, fieldId)
    } else {
      return await saveUpdateDemographicField(fieldPayload)
    }
  }

  const processSections = async (sections, formId) => {
    const sectionIdMapping = {}

    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex]

      const sectionPayload = {
        heading: section.heading || "",
        description: section.description || "",
        order: sectionIndex + 1,
        form: formId,
      }

      const savedSection = await saveSection(sectionPayload, section.id)
      if (!savedSection) {
        throw new Error(`Failed to save section ${sectionIndex + 1}`)
      }

      if (isTempId(section.id)) {
        sectionIdMapping[section.id] = savedSection.id
      }

      await processFields(section.fields || [], savedSection.id, sectionIndex)
    }

    return sectionIdMapping
  }

const processFields = async (fields, sectionId, sectionIndex) => {
  for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
    const field = fields[fieldIndex];

    let options = null;

    switch (field.field_type) {
      case "radio":
      case "checkbox":
      case "dropdown":
          if (typeof field.options === "string") {
          options = field.options
            .split(",")
            .map(opt => opt.trim())
            .filter(opt => opt.length > 0);
        } else if (Array.isArray(field.options)) {
          options = field.options;
        } else {
          options = [];
        }
        break;

      case "file":
        options = {
          file_type: field.file_type || "any",
        };
        break;

      case "toggle":
        options = { trueLabel: "Yes", falseLabel: "No" };
        break;

      case "number":
      case "email":
      case "date":
      case "text":
      default:
        options = null;
        break;
    }

    const fieldPayload = {
      label: field.label || "",
      field_type: field.field_type || "text",
      required: Boolean(field.required),
      attachment_required: Boolean(field.attachment_required),
      options: options, 
      order: fieldIndex + 1,
      section: sectionId,
    };

    const savedField = await saveField(fieldPayload, field.id);
    if (!savedField) {
      throw new Error(
        `Failed to save field ${fieldIndex + 1} in section ${sectionIndex + 1}`
      );
    }
  }
};


  const handleSubmit = async (values) => {
    setIsSubmittingForm(true)

    try {
      if (!validateSections(values.sections)) {
        return
      }

      // Validate fields
      if (!validateFields(values.sections || [])) {
        return
      }

      // Prepare form payload
      const formPayload = {
        name: values.name?.trim(),
        description: values.description || "",
        is_active: Boolean(values.is_active),
        created_by: id ? formData.created_by?.id : userId,
        updated_by: userId,
      }

      // Validate form name
      if (!isValidName(formPayload.name)) {
        toast.error("Form name must be at least 3 characters and can include letters, numbers, spaces, hyphens, and underscores.")
        return
      }

      // Save form
      const savedForm = await saveForm(formPayload)
      if (!savedForm) throw new Error("Failed to save form")

      // Process sections and fields
      const formId = savedForm.id || id
      if (values.sections && values.sections.length > 0) {
        await processSections(values.sections, formId)
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

  // Form Field Builders
  const buildFormDetailsFields = () => ({
    sheetCardExtension: true,
    sheetCardTitle: "Form Details",
    InputFields: [
      {
        InputField: TextInput,
        name: "name",
        label: "Form Name",
        maxLength: 255,
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
        options: STATUS_OPTIONS,
      },
    ],
  })

  const buildFieldHeader = (field, fieldIndex, sectionIndex) => ({
    InputField: () => (
      <div className="flex items-center justify-between w-full">
        <div className="font-semibold text-sm text-gray-600">
          Field {fieldIndex + 1}: {field.label || "Untitled Field"}
        </div>
        <RemoveSection
          value={formValues?.sections?.[sectionIndex]?.fields || []}
          section={field}
          index={fieldIndex}
          type="field"
          onChange={(updatedFields) => {
            const newFormValues = { ...formValues }
            newFormValues.sections[sectionIndex].fields = updatedFields
            setFormValues(newFormValues)
          }}
        />

      </div>
    ),
    colsSpan: 2,
  })

  const buildFieldInputs = (field, fieldIndex, sectionIndex) => {
    const inputs = [
      {
        InputField: TextInput,
        name: `sections[${sectionIndex}].fields[${fieldIndex}].label`,
        label: "Field Label",
        value: field.label,
        required: true,
        colsSpan: 2,
      },

      {
        InputField: SelectInputComponent,
        name: `sections[${sectionIndex}].fields[${fieldIndex}].field_type`,
        label: "Field Type",
        value: field.field_type,
        options: FIELD_TYPE_OPTIONS,
        required: true,
        colsSpan: 2,
      },

      {
        InputField: RadioGroupInput,
        name: `sections[${sectionIndex}].fields[${fieldIndex}].required`,
        label: "Required",
        value: field.required,
        options: REQUIRED_OPTIONS,
        colsSpan: 1,
      },
    ]

    if (field.field_type === "file") {
      inputs.push({
        InputField: RadioGroupInput,
        name: `sections[${sectionIndex}].fields[${fieldIndex}].attachment_required`,
        label: "Attachment Required",
        value: field.attachment_required,
        options: REQUIRED_OPTIONS,
        colsSpan: 1,
      })

      if (field.attachment_required) {
        inputs.push({
          InputField: SelectInputComponent,
          name: `sections[${sectionIndex}].fields[${fieldIndex}].file_type`,
          label: "Allowed File Type",
          value: field.options.file_type,
          options: FILE_TYPE_OPTIONS,
          required: true,
          colsSpan: 2,
        })
      }
    }

    if (["radio", "checkbox", "dropdown"].includes(field.field_type)) {
      inputs.push({
        InputField: TextAreaInput,
        name: `sections[${sectionIndex}].fields[${fieldIndex}].options`,
        label: "Options (comma separated)",
        placeholder: "Option1, Option2, Option3",
        value: Array.isArray(field.options)
          ? field.options.join(", ")
          : field.options || "",
        colsSpan: 2,
      })
    }

    return inputs
  }


  const buildSectionFields = (section, sectionIndex) => {
    const fields = [
      {
        InputField: RemoveSection,
        name: "sections",
        colsSpan: 2,
        value: formValues?.sections || [],
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
    ]

    // Add field configurations
    if (section.fields) {
      section.fields.forEach((field, fieldIndex) => {
        fields.push(buildFieldHeader(field, fieldIndex, sectionIndex, section))
        fields.push(...buildFieldInputs(field, fieldIndex, sectionIndex))
      })
    }

    // Add "Add New Field" button
    fields.push({
      InputField: AddNewSectionField,
      name: `sections[${sectionIndex}].fields`,
      colsSpan: 2,
      value: section.fields,
      sectionId: section.id,
    })

    return fields
  }

  const buildSectionConfigs = () => {
    if (!formValues?.sections) return []

    return formValues.sections.map((section, sectionIndex) => ({
      sheetCardExtension: true,
      sheetCardTitle: `Section ${sectionIndex + 1}: ${section.heading || "Untitled"}`,
      InputFields: buildSectionFields(section, sectionIndex),
    }))
  }

  const buildAddSectionField = () => ({
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
  })

  // Build complete form fields configuration
  const formFields = [
    buildFormDetailsFields(),
    ...buildSectionConfigs(),
    buildAddSectionField(),
  ]

  // Form Configuration
  const formConfig = {
    initialValues: formData,
    enableReinitialize: true,
    handleSubmit: handleSubmit,
    submitButtonText: mode === "view" ? null : "Submit",
    cancelButtonText: "Cancel",
    columns: 2,
    renderUpdatedFormValues: setFormValues,
    disableSubmit: isLoading || isSubmittingForm,
    loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
    formFields: formFields,
  }

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={formConfig}
    />
  )
}

export default DemographicsSheet