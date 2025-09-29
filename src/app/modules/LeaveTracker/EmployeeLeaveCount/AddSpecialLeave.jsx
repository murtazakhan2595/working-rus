import React, { useState, useEffect } from "react";
import { saveSpecialLeave, getLeaveTypeListData } from "app/hooks/leaveTracker";
import { SheetUI, EmployeeDetailUI } from "components";
import { TextInput } from "components/FormControl";
import { SelectInputComponent } from "components/FormControl";
import { useSelector } from "react-redux";
import { DateInput } from "components/FormControl";
import { SpecialLeaves } from 'app/utils/Types/LeaveManagment';
import { NumberInput } from "components/FormControl";
import { SwitchInput } from "components/FormControl";

const AddSpecialLeave = ({ isOpen, setIsOpen, exit_id }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const Employees = useSelector((state) => state.emp.employees)
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [specialLeaveTypeId, setSpecialLeaveTypeId] = useState(null);

    const FormSheetData = {
        triggerText: null,
        title: "Add Special Leaves",
        description: null,
        footer: null,
    };


    useEffect(() => {
        let isMounted = true;
        const fetchLeaveTypeData = async (isMounted) => {
            try {
                setIsLoading(true);
                const response = await getLeaveTypeListData({ filterData: { name: 'Special Leave' } });
                if (response && isMounted) {
                    const LeavesTypes = response.results || [];
                    const specialLeave = LeavesTypes.find(obj => obj.name === 'Special Leave')
                    setSpecialLeaveTypeId(specialLeave?.id);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeaveTypeData(isMounted);
        return () => {
            isMounted = false;
        };
    }, []);

    const handleSubmit = async (values) => {
        setIsSubmittingForm(true);
        try {
            const payload = { ...values, leave_type: specialLeaveTypeId };
            // Save the final settlement
            const response = await saveSpecialLeave(payload);
            if (response) {
                return {
                    status: true,
                    title: "Exit Interview Completed Succesfully",
                    description:
                        "Exit interview details are submitted successfully.",
                    messageType: "Success",
                };
            }
        } catch (error) {
            console.error("Error in final settlement submission:", error);
        } finally {
            setIsSubmittingForm(false);
        }
    };
    return (
      <SheetUI
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        variant="sheet"
        sheetConfig={FormSheetData}
        formConfig={{
          initialValues: SpecialLeaves,
          enableReinitialize: true,
          handleSubmit: handleSubmit,
          validateFormSchema: () => {},
          submitButtonText: "Submit",
          cancelButtonText: "Cancel",
          columns: 2,
          disableSubmit: isSubmittingForm || isLoading,
          loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
          formFields: [
            {
              sheetCardExtension: true,
              sheetCardTitle: "Employee Details",
              InputFields: [
                {
                  InputField: SelectInputComponent,
                  name: "employee",
                  label: "Employee",
                  required: true,
                  options: Employees,
                  onFieldUpdate: async (_, value) => {
                    const employee = value
                      ? Employees.find((obj) => obj.value === value)
                      : null;

                    setSelectedEmployee(employee);
                  },
                },
                ...(selectedEmployee
                  ? [
                      {
                        InputField: EmployeeDetailUI,
                        id: parseInt(selectedEmployee?.id),
                        InformationKeys: ["name", "department", "branch"],
                        variant: "FormView",
                        colsSpan: 2,
                        className: "grid grid-cols-2 gap-4",
                      },
                    ]
                  : []),
              ],
            },
            {
              sheetCardExtension: true,
              sheetCardTitle: "Leave Details",
              InputFields: [
                {
                  InputField: TextInput,
                  name: "name",
                  label: "Leave Name",
                  required: true,
                },
                {
                  InputField: DateInput,
                  name: "start_date",
                  label: "Start Date",
                  required: true,
                },
                {
                  InputField: DateInput,
                  name: "end_date",
                  label: "End Date",
                  required: true,
                },
                {
                  InputField: NumberInput,
                  name: "total_allotted_leave",
                  label: "No. of Leave Alloted",
                  required: true,
                },
                {
                  InputField: SwitchInput,
                  name: "clearance_required",
                  label: "Clearance Required",
                  required: true,
                },
              ].filter(Boolean),
            },
          ],
        }}
      ></SheetUI>
    );
};

export default AddSpecialLeave;
