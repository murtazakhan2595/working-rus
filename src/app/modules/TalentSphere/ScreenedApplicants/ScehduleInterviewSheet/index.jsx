
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { GetDispatchStateList } from "utils/Lists";
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
import { getEmailTemplateList } from "app/hooks/talentSphere";
import { getInterviewTypeList } from "app/hooks/talentSphere";
import { Interview } from "app/utils/Types/TalentSphere";
import { TimePicker } from "components/FormControl";
import moment from "moment";
import { getFeedBackFormList } from "app/hooks/talentSphere";
import { renderDate } from "utils/renderValues";

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
  applicant,
}) => {
  const Employees = GetDispatchStateList("employees", "emp");
  const [formValues, setFormValues] = useState(Interview)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(Interview)
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [emailTemplates, setEmailTemplateOptions] = useState([]);
  const [feedbackFormOptions, setFeedbackFormOptions] = useState([]);
  const [InterviewTypeOptions, setInterviewTypeOptions] = useState([]);

  const FormSheetData = {
    triggerText: "",
    title: `Schedule Interview`,
    description: "Manage interview scheduling and details.",
    footer: null,
  }


  useEffect(() => {
    const fetchOptionData = async (isMounted) => {
      try {
        setIsLoading(true);
        const filterData = { is_active: true };
        const template = await getEmailTemplateList({ filterData });
        const types = await getInterviewTypeList({ filterData });
        const forms = await getFeedBackFormList({ filterData: { status: 'Active' } });
        if (isMounted) {
          setInterviewTypeOptions(types.results);
          setEmailTemplateOptions(template.results);
          setFeedbackFormOptions(forms.results);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchOptionData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);
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
    reloadData();
  }

  const validateForm = (values) => {
    const errors = {};
    if (values.scheduled_datetime) {
      if (moment(values.scheduled_datetime).isSameOrBefore(moment()))
        errors.scheduled_datetime = 'Interview cannot be schedule is past time.';
    }
    if (!values.panel || values.panel.length === 0) {
      errors.panel = 'At least one panelist is required.'
    }
    return errors;
  }

  const handleSubmit = async (values) => {
    setIsSubmittingForm(true)
    try {
      const savedInterview = await saveUpdateInterview({ ...values, applicant: applicant })
      if (savedInterview) {
        if (id) await saveUpdateInterview({ status: 'rescheduled' }, id)
        reloadData(true)
        setIsOpen(false)
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Interview Scheduled Successfully`,
          description: `Interview has beeon succesfully schedules with ${savedInterview.candidate_name} at ${renderDate(savedInterview.scheduled_datetime, '--', 'time')} on ${renderDate(savedInterview.scheduled_datetime, '--',)}`,
        }
      }
    } catch (error) {
      console.error("Interview save error:", error)
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
        options: InterviewTypeOptions,
        placeholder: "Select interview type (optional)",
        colsSpan: 2,
        disabled: mode === "view",
      },
      {
        InputField: DateInput,
        name: "scheduled_datetime",
        label: "Scheduled Date",
        required: true,
        disabled: mode === "view",
        minDate: new Date(),
      },
      {
        InputField: TimePicker,
        name: "scheduled_datetime",
        label: "Scheduled Time",
        required: true,
        disabled: !formValues?.scheduled_datetime || mode === "view",
        date: formValues?.scheduled_datetime,
      },
      // {
      //   InputField: RadioGroupInput,
      //   name: "status",
      //   label: "Status",
      //   options: STATUS_OPTIONS,
      //   required: true,
      //   colsSpan: 2,
      //   disabled: mode === "view",
      // },
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
        options: Employees,
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
      },
      {
        InputField: SelectInputComponent,
        name: "interview_form",
        label: "Feedback Form",
        options: feedbackFormOptions,
        required: true,
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
    validateFormSchema: validateForm,
    formFields,
    disableSubmit: isLoading || isSubmittingForm,
    loadingMessage: isSubmittingForm ? "Submitting Form..." : isLoading ? "Loading Options..." : "",
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
