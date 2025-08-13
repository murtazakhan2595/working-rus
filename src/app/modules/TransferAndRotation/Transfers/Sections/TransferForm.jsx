import React, { useEffect, useState } from "react";
import { EmployeeTransfer } from "app/utils/Types/TransferAndRotation";
import { validationEmpTranferFormSchema } from "app/utils/FormSchema/employeeTransferFromSchema";
import {
  RadioGroupInput,
  TextAreaInput,
  SelectInputComponent,
  DateInput,
  TextInput,
} from "components/FormControl";
import { SheetUI, EmployeeDetailUI } from "components";
import {  getEmployeeTransferData,  addUpdateEmpTransferDetails,} from "app/hooks/transferAndRotation";
import { useSelector } from "react-redux";

const FormSheetData = {
  triggerText: "Submit",
  title: "Employee Transfer Request Form",
  description: null,
  footer: null,
};

const TransferForm = ({
  transfer_type = "INTERNAL",
  isEmployee = false,
  id = null,
  isOpen = true,
  setIsOpen = () => { },
  onlyRejectionForm = false,
  initiator = null,
}) => {
  const Employees = useSelector((state) => state.emp.employees);
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);
  const UserDetails = useSelector((state) => state.emp.user_details);
  const Mangers = useSelector((state) => state.emp.reportingManagers);

  const [closeSheet, setCloseSheet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({ ...EmployeeTransfer, transfer_type: transfer_type, });

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchData = async (isMounted) => {
      try {
        const response = await getEmployeeTransferData(id);
        if (isMounted && response) {
          setFormData(response);
          setSelectedEmployee(
            Employees.find((obj) => obj.value === response.employee_id)
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    let isMounted = true;
    if (id) {
      fetchData(isMounted);
    }
    return () => {
      isMounted = false;
    };
  }, [id, Employees]);


  useEffect(() => {
    if (isEmployee) {
      setSelectedEmployee(UserDetails);
      setFormData((prev) => {
        return { ...prev, employee_id: UserDetails.id };
      });
    }
  }, [isEmployee]);

  const handleSubmit = async (data) => {
    try {
      const payload = { ...data, initiated_by: initiator };
      const response = await addUpdateEmpTransferDetails(payload, id);
      // return
      if (response) {
        return {
          status: true,
          title: `Employee Transfer Request ${id ? 'Updated' : 'Submitted'} Successfully!`,
          description:
            "Your request for transfer has been submitted successfully. It will be reviewed shortly.",
          messageType: "Success",
        };
      }
    } catch (error) {
      // Handle errors and rollback form data
      setFormData(data);
      console.error(error);
    }
  };

  return <SheetUI
    isOpen={isOpen}
    setIsOpen={handleClose}
    variant="sheet"
    sheetConfig={FormSheetData}
    formConfig={{
      initialValues: formData,
      enableReinitialize: true,
      handleSubmit: handleSubmit,
      validateFormSchema: (values) => {
        const error = validationEmpTranferFormSchema(values);
        return error;
      },
      submitButtonText: id ? "Update" : "Add",
      cancelButtonText: "Cancel",
      columns: 2,
      // renderUpdatedFormValues: setFormValues,
      disableSubmit: isLoading,
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
                  : {};

                setSelectedEmployee(employee);
              },
              options: Employees,
            },
            ...(selectedEmployee?.id ? [{
              InputField: EmployeeDetailUI,
              id: selectedEmployee?.id,
              InformationKeys: ["department", "branch", "position", "manager",],
              variant: "FormView",
              colsSpan: 2,
              className: "grid grid-cols-2 gap-4",
            },] : []),
          ],
        },
        {
          sheetCardExtension: true,
          sheetCardTitle: "Tranfer Details",
          InputFields: [
            {
              InputField: RadioGroupInput,
              name: "transfer_type",
              required: true,
              label: "Transfer Type",
              options: [
                { value: "INTERNAL", label: "Internal" },
                { value: "EXTERNAL", label: "External" },
              ],
              colsSpan: 2,
            },
            {
              InputField: SelectInputComponent,
              name: "new_branch",
              required: true,
              label: "New Branch",
              options: Branches,
            },
            {
              InputField: SelectInputComponent,
              name: "new_department",
              required: true,
              label: "New Department",
              options: Departments,
            },
            {
              InputField: SelectInputComponent,
              name: "new_reporting_manager",
              required: true,
              options: Mangers,
              label: "New Reporting Manager",
            },

            {
              InputField: DateInput,
              name: "effective_transfer_date",
              required: true,
              label: "Effective Transfer Date",
            },
            {
              InputField: TextInput,
              name: "reason_of_transfer",
              required: true,
              label: "Reason for Transfer",
            },
            {
              InputField: TextAreaInput,
              name: "notes",
              required: false,
              label: "Note",
              maxRows: 5,
              colsSpan: 2,
            },
          ].filter(Boolean),
        },
      ],
    }}
  ></SheetUI>
};

export default TransferForm;
