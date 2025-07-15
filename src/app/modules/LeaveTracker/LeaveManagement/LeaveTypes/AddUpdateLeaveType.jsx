import { Card, CardContent } from "components/ui/card";
import { Header, SheetUI } from "components";
import { useState, useEffect, useMemo } from "react";
import {
  TextInput,
  NumberInput,
  SelectMultiInputComponent,
  SwitchInput,
  RadioGroupInput,
  TextAreaInput,
} from "components/FormControl";
import { GenderOptions, countriesList, maritalStatus } from "data/Data";
import { useSelector } from "react-redux";
import { validateLeaveTypeFormSchema } from "app/utils/FormSchema/leaveTrackerFormSchema";
import {
  saveLeaveType,
  getLeaveTypeData,
  getLeaveTypes,
} from "app/hooks/leaveTracker";
import { toast } from "react-toastify";
import { ReligionList } from "data/Data";
import { LeaveType } from "app/utils/Types/LeaveManagment";

export default function AddUpdateLeaveType({
  isOpen = true,
  setIsOpen,
  reload,
  data = null,
  id = null,
}) {
  const [formData, setFormData] = useState(LeaveType);
  const [isLoading, setIsLoading] = useState(false);
  const [DataList, setDataList] = useState(false);

  const isEditMode = Boolean(id);

  const Branches = useSelector((state) => state.common.branches);
  const Departments = useSelector((state) => state.common.departments);
  const Designations = useSelector((state) => state.common.designations);

  const FormSheetData = {
    triggerText: "",
    title: isEditMode ? "Edit Leave Type" : "Add New Leave Type",
    description: null,
    footer: null,
    width: "900px",
  };

  const fetchUserRolesData = async (isMounted) => {
    try {
      setIsLoading(true);
      // Add organizationId to filter if available

      const response = await getLeaveTypes();

      if (isMounted) {
        setDataList(response.results);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchUserRolesData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  // Set form data from passed data or initialize empty

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (isMounted, id) => {
      try {
        setIsLoading(true);
        const response = await getLeaveTypeData(id);
        if (isMounted) {
          setFormData(response);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData(isMounted, id);
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Memoized form fields that depend on current form values
  const getFormFields = useMemo(() => {
    return [
      {
        sheetCardExtension: true,
        sheetCardTitle: `Leave Type Details`,
        InputFields: [
          {
            InputField: TextInput,
            name: "name",
            required: true,
            label: "Leave Type Name",
            placeholder: "e.g. Sick Leave, Annual Leave",
            validateDuplicate: true,
          },
          {
            InputField: TextInput,
            name: "short_code",
            required: true,
            label: "Short Code",
            placeholder: "e.g. SL, AL",
            validateDuplicate: true,
          },
          {
            InputField: NumberInput,
            name: "leave_count",
            required: true,
            label: "Leave Count (Annual Quota)",
            placeholder: "Total allowed per year",
          },
          {
            InputField: SwitchInput,
            name: "is_carry_forward_allowed",
            label: "Is Carry Forward Allowed?",
            description: "Leftover leaves carry to next year",
          },
          {
            InputField: NumberInput,
            name: "max_carry_forward_limit",
            label: "Max Carry Forward Limit",
            placeholder: "Maximum days to carry forward",
            required: true,
            shouldRender: formData.is_carry_forward_allowed,
          },
          {
            InputField: SwitchInput,
            name: "is_encashable",
            label: "Is Encashable?",
            description: "Encashment allowed at year end",
          },
          {
            InputField: SwitchInput,
            name: "requires_attachment",
            label: "Requires Attachment?",
            description: "Medical certificate required",
          },
          {
            InputField: NumberInput,
            name: "min_days_notice",
            label: "Min Days Notice Required",
            placeholder: "Days in advance to apply",
          },
          {
            InputField: SwitchInput,
            name: "is_all_paid",
            label: "All Paid",
            description: "Toggle OFF for partially paid leave",
          },
          {
            InputField: NumberInput,
            name: "full_paid_days",
            label: "Full Paid Days",
            placeholder: "Enter full paid days",
            required: true,
            shouldRender: !formData.is_all_paid,
          },
          {
            InputField: NumberInput,
            name: "half_paid_days",
            label: "Half Paid Days",
            placeholder: "Enter half paid days",
            required: true,
            shouldRender: !formData.is_all_paid,
          },
          {
            InputField: SelectMultiInputComponent,
            name: "nationalities",
            required: true,
            label: "Nationalities",
            options: countriesList,
            SelectAllOption: true,
            placeholder: "Select nationalities",
          },
          {
            InputField: SelectMultiInputComponent,
            name: "branches_ids",
            required: true,
            label: "Branches",
            options: Branches,
            SelectAllOption: true,
            placeholder: "Select branches",
          },
          {
            InputField: SelectMultiInputComponent,
            name: "departments_ids",
            required: true,
            label: "Departments",
            options: Departments,
            SelectAllOption: true,
            placeholder: "Select departments",
          },
          {
            InputField: SelectMultiInputComponent,
            name: "genders",
            label: "Genders",
            options: GenderOptions,
            SelectAllOption: true,
            placeholder: "Select genders",
          },
          {
            InputField: SelectMultiInputComponent,
            name: "marital_statuses",
            label: "Marital Statuses",
            options: maritalStatus,
            SelectAllOption: true,
            placeholder: "Select marital statuses",
          },
          {
            InputField: SelectMultiInputComponent,
            name: "grades",
            label: "Applicable Grades / Designations",
            options: Designations,
            placeholder: "Select job levels",
            SelectAllOption: true,
          },
          {
            InputField: SelectMultiInputComponent,
            name: "religion",
            label: "Religion",
            options: ReligionList,
            SelectAllOption: true,
          },
          {
            InputField: SwitchInput,
            name: "probation_restriction",
            label: "Probation Period Restriction",
            description: "Restricted during probation",
          },
          {
            InputField: RadioGroupInput,
            name: "day_count_type",
            label: "Work days or calendar days",
            options: [
              { label: "Work Days", value: "work_days" },
              { label: "Calendar Days", value: "calendar_days" },
            ],
            required: true,
            variant: "stacked",
          },
          {
            InputField: NumberInput,
            name: "max_consecutive_days",
            label: "Max Consecutive Days Allowed",
            placeholder: "Max days in one go",
            required: true,
          },
          {
            InputField: SwitchInput,
            name: "status",
            label: "Status",
            description: "Active/Inactive",
          },
          {
            InputField: TextAreaInput,
            name: "tooltip_info",
            label: "Tooltip Information",
            placeholder: "Add helpful information about this leave type...",
            maxRows: 3,
            colsSpan: 2,
          },
        ],
      },
    ];
  }, [
    formData.is_carry_forward_allowed,
    formData.is_all_paid,
    Branches,
    Departments,
    Designations,
  ]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setIsLoading(true);
      const response = await saveLeaveType({
        ...values,
        id: id,
      });
      if (response) {
        toast.success(
          `Leave type ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        handleClose();
      }
    } catch (error) {
      console.log("Error saving leave type:", error);
      // Show error message
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "add"} leave type.`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (reload) reload();
    setIsOpen(false);
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Card>
        <CardContent>
          <SheetUI
            isOpen={isOpen}
            setIsOpen={handleClose}
            variant="sheet"
            sheetConfig={FormSheetData}
            formConfig={{
              initialValues: formData,
              enableReinitialize: true,
              handleSubmit: handleSubmit,
              validateFormSchema: validateLeaveTypeFormSchema,
              submitButtonText: isEditMode ? "Update" : "Submit",
              cancelButtonText: "Cancel",
              columns: 2,
              DataList: DataList,
              disableSubmit: isLoading,
              loadingMessage: isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Submitting Form..."
                : "",
              formFields: getFormFields,
              onFormChange: (values) => {
                // Update formData when form values change to trigger re-render
                setFormData(values);
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
