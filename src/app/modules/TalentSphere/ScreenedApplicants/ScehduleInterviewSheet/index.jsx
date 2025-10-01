"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"

import { SheetUI } from "components"
import {
  DateInput,
  RadioGroupInput,
  SelectInputComponent,
  SelectMultiInputComponent,
} from "components/FormControl"

import {
  saveUpdateInterview,
  getInterviewById,
} from "app/hooks/talentSphere"


const INTERVIEW_FORM_STRUCTURE = {
  applicant: null,
  interview_type: null,
  scheduled_datetime: "",
  panel: [],
  email_template: "",
  generate_meeting_link: true,
  require_demographics: false,
  status: "scheduled",
}

const STATUS_OPTIONS = [
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Rescheduled", value: "rescheduled" },
]

const BOOLEAN_OPTIONS = [
  { label: "Yes", value: true },
  { label: "No", value: false },
]

const ScheduleInterviewSheet = ({
  isOpen,
  setIsOpen,
  id,
  reloadData,
  mode,
}) => {
  const dispatch = useDispatch()

  const [formValues, setFormValues] = useState(null)
  const [formData, setFormData] = useState(INTERVIEW_FORM_STRUCTURE)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)

  const isEditMode = Boolean(id)
  const userId = useSelector((state) => state.user.userProfile.id)

  const {
    applicants,
    interviewTypes,
    panelMembers,
    emailTemplates,
    isLoading,
    isLoaded,
  } = useSelector((state) => state.interview)


  const FormSheetData = {
    triggerText: "",
    title: `Schedule Interview`,
    description: "Manage interview scheduling and details.",
    footer: null,
  }



  // Fetch interview data for edit mode
  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      if (!id) return
      try {
        const response = await getInterviewById(id)
        if (isMounted) {
          const formattedData = {
            ...response,
            scheduled_datetime: response.scheduled_datetime
              ? new Date(response.scheduled_datetime).toISOString().slice(0, 16)
              : "",
            panel: response.panel || [],
            status: response.status || "scheduled"
          }
          setFormData(formattedData)
          setFormValues(formattedData)
        }
      } catch (error) {
        toast.error("Failed to load interview data")
        console.error("Error fetching interview:", error)
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleClose = () => {
    setIsOpen(false)
  }

  const validateForm = (values) => {

    if (!values.scheduled_datetime) {
      toast.error("Please select a scheduled date and time")
      return false
    }
    if (new Date(values.scheduled_datetime) <= new Date()) {
      toast.error("Scheduled date and time must be in the future")
      return false
    }
    if (!values.panel || values.panel.length === 0) {
      toast.error("Please select at least one panel member")
      return false
    }
    return true
  }

  const handleSubmit = async (values) => {
    setIsSubmittingForm(true)
    try {
      if (!validateForm(values)) return
      const payload = {
        applicant: id,
        interview_type: values.interview_type || null,
        scheduled_datetime: new Date(values.scheduled_datetime).toISOString(),
        panel: values.panel,
        email_template: values.email_template || null,
        generate_meeting_link: Boolean(values.generate_meeting_link),
        require_demographics: Boolean(values.require_demographics),
        status: values.status || "scheduled",
      }
      const savedInterview = await saveUpdateInterview(payload)
      if (!savedInterview) throw new Error("Failed to save interview")
      toast.success(`Interview Schedule successfully`)
      reloadData(true)
    } catch (error) {
      console.error("Interview save error:", error)
      toast.error(error.message || "Failed to save interview")
    } finally {
      setIsSubmittingForm(false)
    }
  }

  const buildInterviewDetailsFields = () => ({
    sheetCardExtension: true,
    sheetCardTitle: "Interview Details",
    InputFields: [

      {
        InputField: SelectInputComponent,
        name: "interview_type",
        label: "Interview Type",
        options: interviewTypes,
        placeholder: "Select interview type (optional)",
        colsSpan: 2,
        disabled: mode === "view",
      },
      {
        InputField: DateInput,
        name: "scheduled_datetime",
        label: "Scheduled Date & Time",
        required: true,
        colsSpan: 2,
        disabled: mode === "view",
      },
      {
        InputField: RadioGroupInput,
        name: "status",
        label: "Status",
        options: STATUS_OPTIONS,
        required: true,
        colsSpan: 2,
        disabled: mode === "view",
      },
    ],
  })

  const buildPanelAndSettingsFields = () => ({
    sheetCardExtension: true,
    sheetCardTitle: "Panel & Settings",
    InputFields: [
      {
        InputField: SelectMultiInputComponent,
        name: "panel",
        label: "Panel Members",
        options: panelMembers,
        required: true,
        placeholder: "Select panel members",
        colsSpan: 2,
        disabled: mode === "view",
      },
      {
        InputField: SelectInputComponent,
        name: "email_template",
        label: "Email Template",
        options: emailTemplates,
        required: true,
        placeholder: "Select email template (optional)",
        colsSpan: 2,
      },
      {
        InputField: RadioGroupInput,
        name: "generate_meeting_link",
        label: "Generate Meeting Link",
        options: BOOLEAN_OPTIONS,
        colsSpan: 1,
        disabled: mode === "view",
      },
      {
        InputField: RadioGroupInput,
        name: "require_demographics",
        label: "Require Demographics",
        options: BOOLEAN_OPTIONS,
        colsSpan: 1,
        disabled: mode === "view",
      },
    ],
  })

  const formFields = [buildInterviewDetailsFields(), buildPanelAndSettingsFields()]

  const formConfig = {
    initialValues: { ...formData, status: formData.status || "scheduled" },
    enableReinitialize: true,
    handleSubmit,
    submitButtonText: "Schedule Interview",
    cancelButtonText: "Cancel",
    columns: 2,
    renderUpdatedFormValues: setFormValues,
    formFields,
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

export default ScheduleInterviewSheet
