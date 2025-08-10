import React, { useState, useEffect } from "react";

import { saveEmployeeExitDetail, getEmployeeExitData, getTerminationReason } from "app/hooks/employeeExitAndClearance";
import { DateInput, CoverFileUpload, SelectInputComponent } from "components/FormControl";
import { NoticePeriod } from "data/Data";
import { SheetUI, EmployeeDetailUI } from "components";
import { getDropdownList } from "utils/Lists";


const RequestTerminationCard = ({
  Employees,
  isOpen,
  setIsOpen = () => { },
  reloadData = () => { },
  id = null,
}) => {
  const [FormData, setFormData] = useState({
    final_working_day: "",
    termination_letter: "",
    notice_period: "",
    employee_id: "",
    reason_of_termination: "",
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [TerminationReasons, setTerminationReasons] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    const fetchData = async (isMounted) => {
      setIsLoading(true);
      try {
        const response = await getEmployeeExitData(id);
        if (isMounted && response) {
          setFormData(response);
          setSelectedEmployee(Employees.find((obj) => obj.value === response.employee_id));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    if (id) {
      fetchData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    const fetchData = async (isMounted) => {
      setIsLoading(true);
      try {
        const response = await getTerminationReason();
        if (isMounted && response) {
          const TerminationReasons = getDropdownList(response.results, 'name', 'id');
          setTerminationReasons(TerminationReasons)
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        exit_category: "TERMINATION",
        employee_id: values.employee_id,
      };
      const response = await saveEmployeeExitDetail(payload);
      // Send the FormData object via the employeeExit function
      if (response) {
        return {
          status: true,
          messageType: "SUCCESS",
          title: `Request Submitted Successfully!`,
          description: `Your termination request has been submitted successfully for ${selectedEmployee.name || 'employee'}.`,
        };
      }
    } catch (e) {
      console.error(e);
    }
  };

  const FormSheetData = {
    triggerText: "Request Termination",
    title: "Request Termination",
    description: null,
    footer: null,
  };
  const handleClose = () => {
    setIsOpen(false);
    reloadData(true)
  };

  return (
    // <div>jnfkjdnk</div>
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: FormData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: (values) => { },
        // renderUpdatedFormValues: SetLeaveFormValues,
        submitButtonText: "Submit Request",
        cancelButtonText: "Cancel",
        disableSubmit: isLoading,
        columns: 2,
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: "Employee Details",
            InputFields: [
              {
                InputField: SelectInputComponent,
                name: "employee_id",
                required: true,
                label: "Employee",
                onFieldUpdate: async (_, value) => {
                  const employee = value
                    ? Employees.find((obj) => obj.value === value)
                    : null;

                  setSelectedEmployee(employee);
                },
                options: Employees,
              },
              ...(selectedEmployee?.id ? [{
                InputField: EmployeeDetailUI,
                id: selectedEmployee?.id,
                InformationKeys: ["department", "branch", "position", "work_location", "manager", "joining_date", "employment_type", "contact_no",],
                variant: "FormView",
                colsSpan: 2,
                className: "grid grid-cols-2 gap-4",
              },] : [])
            ],
          },
          {
            sheetCardExtension: true,
            sheetCardTitle: "Leave Details",
            sheetCardName: "leave_details",
            InputFields: [
              {
                InputField: DateInput,
                name: "final_working_day",
                label: "Last Working Day",
                required: true,
              },

              {
                InputField: SelectInputComponent,
                name: "notice_period",
                label: "Notice Period",
                required: true,
                options: NoticePeriod || [],
              },
              {
                InputField: SelectInputComponent,
                name: "reason_for_terminating",
                label: "Reason for Terminating",
                required: true,
                options: TerminationReasons,
              },
              {
                InputField: CoverFileUpload,
                name: "termination_letter",
                label: "Termination Letter",
                required: true,
                colsSpan: 2,
              },
            ].filter(Boolean),
          },
        ],
      }}
    ></SheetUI>
  );
};

export default RequestTerminationCard;
