import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import { Leave } from "app/utils/Types/LeaveManagment";
import { getLeaveTypeListData } from "app/hooks/leaveTracker";
import { validateLeaveRequestFormSchema } from "app/utils/FormSchema/leaveTrackerFormSchema";
import { LeaveTrackerOptions } from "data/Data";
import { SheetUI, EmployeeDetailUI } from "components";
import { GetEmployeeFilteredList, GetCommonFilteredList } from "utils/Lists";
import { getDropdownList } from "utils/Lists";
import { useSelector } from "react-redux";
import { SelectInputComponent } from "components/FormControl";
import { DateInput } from "components/FormControl";
import { CheckBoxInput } from "components/FormControl";

const LeaveRequest = ({ id }) => {
  const { id: user_id, branch_id: user_branch } = useSelector(
    (state) => state.emp.user_details
  );
  const [isOpen, setIsOpen] = useState(true);
  const [FormData, setFormData] = useState(Leave);
  const [FormValues, setFormValues] = useState(Leave);
  const [LeaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState({});
  const [LeaveValidationInfo, setLeaveValidationInfo] = useState({});
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
      const response = await getLeaveTypeListData({
        filterData: { branches: user_branch, status: true },
      });
      if (isMounted && response) {
        setLeaveTypeOptions(response.results || []);
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

  const getLeaveValidationInfo = (leaveType) => {
    return {
        allowedLeaves:leaveType.leave_count,
        allowedConsecutiveDays:leaveType.max_consecutive_days,
        noticeDays:leaveType.min_days_notice,
        noticeDays:leaveType.min_days_notice,
    }
  };
  const handleSubmit = (values) => {};
  const handleAddLeaveClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    //   const FormValues = mapTimeAdjustmentFromAttendance(attendance, today_shift);
    //   setFormData(FormValues);
    setIsOpen(true);
  };
  console.log(
    selectedLeaveType,
    FormValues,
    LeaveTypeOptions,
    "LEAVEREQUESTAPPLY"
  );
  return (
    <>
      <Button variant="continue" size="sm" onClick={handleAddLeaveClick}>
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
                selectedLeaveType
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
            renderUpdatedFormValues: setFormValues,
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
                    onFieldUpdate: (_, value) => {
                      const leaveType = value
                        ? LeaveTypeOptions.find(
                            (obj) => parseInt(obj.value) === parseInt(value)
                          )
                        : {};
                      setSelectedLeaveType(leaveType);
                      getLeaveValidationInfo(leaveType);
                    },
                  },

                  {
                    InputField: DateInput,
                    name: "start_date",
                    label: "Start Date",
                    required: true,
                    minDate: new Date(),
                  },
                  {
                    InputField: DateInput,
                    name: "end_date",
                    label: "End Date",
                    required: true,
                    minDate: FormValues.start_date || new Date(),
                  },
                  ...(selectedLeaveType && !selectedLeaveType.is_all_paid
                    ? [
                        {
                          InputField: CheckBoxInput,
                          name: "is_full_paid",
                          label: "Full Paid",
                          colsSpan:2,
                          description:
                            "Unselect the check if you wanted to apply for half paid leave",
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
