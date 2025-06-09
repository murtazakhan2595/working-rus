import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import { Leave } from "app/utils/Types/LeaveManagment";
import {
  getLeaveTypeData,
  getLeaveDurations,
  getLeaveEligibleTypeDurations,
} from "app/hooks/leaveTracker";
import { validateLeaveRequestFormSchema } from "app/utils/FormSchema/leaveTrackerFormSchema";
import moment from "moment";
import { SheetUI, EmployeeDetailUI } from "components";
import { GetEmployeeFilteredList, GetCommonFilteredList } from "utils/Lists";
import { getDropdownList } from "utils/Lists";
import { useSelector } from "react-redux";
import { SelectInputComponent } from "components/FormControl";
import { DateInput } from "components/FormControl";
import { CheckBoxInput } from "components/FormControl";
import { NumberInput } from "components/FormControl";

const LeaveRequest = ({ id }) => {
  const { id: user_id, branch_id: user_branch } = useSelector(
    (state) => state.emp.user_details
  );
  const [isOpen, setIsOpen] = useState(false);
  const [FormData, setFormData] = useState(Leave);
  const [FormValues, setFormValues] = useState(Leave);
  const [LeaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState({});
  const [LeaveValidationInfo, setLeaveValidationInfo] = useState({});
  const [LeaveDurationOptions, setLeaveDurationOptions] = useState([]);
  const FormSheetData = React.useMemo(
    () => ({
      triggerText: null,
      title: "Leave Request",
      description: null,
      footer: null,
      className: "max-w-[678px] w-full",
    }),
    []
  );

  const fetchLeaveTypeOption = async (isMounted) => {
    try {
      const response = await getLeaveEligibleTypeDurations();
      const responseDuration = await getLeaveDurations({
        filterData: {},
      });
      if (isMounted && response) {
        const leaveTypeDropdownOptions = await getDropdownList(
          response,
          "name",
          "id"
        );
        setLeaveTypeOptions(leaveTypeDropdownOptions);
        const durationDropDownList = await getDropdownList(
          responseDuration.results || [],
          "duration_name",
          "id"
        );
        setLeaveDurationOptions(durationDropDownList || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (user_id) {
      fetchLeaveTypeOption(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [user_id]);

  const getLeaveValidationInfo = async (leaveTypeId) => {
    try {
      if (leaveTypeId) {
        const leaveType = await getLeaveTypeData(leaveTypeId);
        if (leaveType) {
          setLeaveValidationInfo({
            allowedLeaves: leaveType.leave_count,
            allowedConsecutiveDays: leaveType.max_consecutive_days,
            noticeDays: leaveType.min_days_notice,
            probationAllowed: leaveType.probation_restriction,
            halfPaidAllowed: !leaveType.is_all_paid,
            allowedHalfPaid: leaveType.half_paid_days,
            allowedFullPaid: leaveType.full_paid_days,
          });
        }
      } else {
        setLeaveValidationInfo({});
      }
    } catch (error) {
      console.error(error);
    }
  };

  const SetLeaveFormValues = (values) => {
    const FormValues = { ...values };

    // Boundary checks
    if (!values?.start_date || !values?.end_date) {
      FormValues.total_days = 0;
    } else {
      const start = moment(values.start_date);
      const end = moment(values.end_date);
      if (!start.isValid() || !end.isValid()) {
        FormValues.total_days = 0;
      } else {
        // Ensure end date is not before start date
        if (end.isBefore(start)) {
          FormValues.total_days = 0;
        } else {
          // Calculate total leave days (inclusive of both start and end date)
          const duration = end.diff(start, "days") + 1;
          FormValues.total_days = duration;
        }
      }
    }
    const total_days = FormValues.total_days || 0;
    if (total_days && LeaveValidationInfo?.halfPaidAllowed) {
      // Ensure defaults
      FormValues.full_paid_days = 0;
      FormValues.half_paid_days = 0;
      const { allowedHalfPaid, allowedFullPaid } = LeaveValidationInfo;

      if (values.is_full_paid) {
        if (total_days > allowedFullPaid) {
          const remainingDays = total_days - allowedFullPaid;
          FormValues.full_paid_days = allowedFullPaid;
          FormValues.half_paid_days = remainingDays;
        } else {
          // All leave within allowed full paid limit
          FormValues.full_paid_days = total_days;
        }
      } else {
        // Part of the leave will be half paid, rest full paid if total exceeds allowedHalfPaid
        if (total_days > allowedHalfPaid) {
          const remainingDays = total_days - allowedHalfPaid;
          FormValues.full_paid_days = remainingDays;
          FormValues.half_paid_days = allowedHalfPaid;
        } else {
          // All leave within allowed half paid limit
          FormValues.half_paid_days = total_days;
        }
      }
    } else {
      FormValues.full_paid_days = 0;
      FormValues.half_paid_days = 0;
    }
    setFormValues(FormValues);
    setFormData(FormValues);
    return FormValues;
  };

  const handleSubmit = (values) => {};
  const handleAddLeaveClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    //   const FormValues = mapTimeAdjustmentFromAttendance(attendance, today_shift);
    //   setFormData(FormValues);
    setIsOpen(true);
  };
  return (
    <>
      <Button size="sm" onClick={handleAddLeaveClick}>
        Apply Leave
      </Button>
      {isOpen && (
        <SheetUI
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          variant="sheet"
          sheetConfig={FormSheetData}
          formConfig={{
            initialValues: FormData,
            enableReinitialize: true,
            handleSubmit: handleSubmit,
            validateFormSchema: (values) => {
              const errors = validateLeaveRequestFormSchema(
                values,
                LeaveValidationInfo
              );
              if (
                !LeaveTypeOptions ||
                !Array.isArray(LeaveTypeOptions) ||
                LeaveTypeOptions.length === 0
              )
                errors.leave_details =
                  "No Leave allocated to you. Please connect with admin to get the leave allocated for you.";
              return errors;
            },
            renderUpdatedFormValues: SetLeaveFormValues,
            submitButtonText: "Submit Request",
            cancelButtonText: "Cancel",
            disableSubmit: false,
            loadingMessage: "Submiting Form",
            columns: 2,
            formFiels: [
              {
                sheetCardExtension: true,
                sheetCardTitle: "Employee Details",
                InputFields: [
                  {
                    InputField: EmployeeDetailUI,
                    id: user_id,
                    InformationKeys: ["name", "department", "branch"],
                    variant: "FormView",
                    colsSpan: 3,
                    className: "grid grid-cols-2 gap-4",
                  },
                ],
              },
              {
                sheetCardExtension: true,
                sheetCardTitle: "Leave Details",
                sheetCardName: "leave_details",
                InputFields: [
                  {
                    InputField: SelectInputComponent,
                    name: "leave_type",
                    label: "Leave Type",
                    options: LeaveTypeOptions || [],
                    required: true,
                    onFieldUpdate: async (_, value) => {
                      await getLeaveValidationInfo(value);
                    },
                  },

                  {
                    InputField: DateInput,
                    name: "start_date",
                    label: "Start Date",
                    required: true,
                    minDate: new Date(),
                    disableHolidays:true,
                  },
                  {
                    InputField: DateInput,
                    name: "end_date",
                    label: "End Date",
                    required: true,
                    minDate: FormValues.start_date || new Date(),
                  },
                  {
                    InputField: NumberInput,
                    name: "total_days",
                    label: "Total Days",
                    disabled: true,
                  },
                  {
                    InputField: SelectInputComponent,
                    name: "leave_duration",
                    label: "Leave Duration",
                    options: LeaveDurationOptions,
                    required: true,
                  },
                  ...(LeaveValidationInfo.halfPaidAllowed
                    ? [
                        {
                          InputField: CheckBoxInput,
                          name: "is_full_paid",
                          label: "Full Paid",
                          colsSpan: 2,
                          description: `Unselect the check if you wanted to apply for half paid leave. You will be granted ${FormValues.full_paid_days} full paid and ${FormValues.half_paid_days} half paid leaves.`,
                          onFieldUpdate: (_, value) => {},
                        },
                      ]
                    : []),
                ].filter(Boolean),
              },
            ],
          }}
        ></SheetUI>
      )}
    </>
  );
};

export default LeaveRequest;
