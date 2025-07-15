import { Card, CardContent } from "components/ui/card";
import { Header, SheetUI } from "components";
import { useState, useEffect, useMemo } from "react";
import {
  TextAreaInput,
  TextInput,
  FilterInput,
  CheckBoxInputTree,
  SelectInputComponent,
  NumberInput,
  SelectMultiInputComponent,
} from "components/FormControl";
import { countriesList } from "data/Data";
import { useSelector } from "react-redux";
import { validateLeaveBalanceFormSchema } from "app/utils/FormSchema/leaveTrackerFormSchema";
import {
  saveLeaveOpeningBalance,
  getLeaveTypes,
} from "app/hooks/leaveTracker";
import { toast } from "react-toastify";

export default function AddUpdateLeaveBalance({
  isOpen = true,
  setIsOpen,
  reload,
  data: directData = null,
  edit = {}, // new pattern from NavigationSheetComponent
}) {
  const data = edit?.data || directData;
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [LeaveTypeOptions, setLeaveTypeOptions] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);

  const isEditMode = Boolean(data);
  console.log("isedit mode", isEditMode, data);

  const employees = useSelector((state) => state.emp.employees) || [];
  const Branches = useSelector((state) => state.common.branches);
  const Departments = useSelector((state) => state.common.departments);
  const Designations = useSelector((state) => state.common.designations);

  const FormSheetData = {
    triggerText: "",
    title: isEditMode ? "Edit Leave Balance" : "Add Leave Opening Balance",
    description: null,
    footer: null,
  };

  // Initialize form data
  useEffect(() => {
    if (data) {
      // Pre-populate form with existing data
      const consumed = data.consumed || 0;
      const alloted = data.total_allotted || 0;

      setFormData({
        employee: data.employee || "",
        leave_type: data.leave_type || "",
        total_alloted: alloted,
        leaves_consumed: consumed,
        remaining_leaves: alloted - consumed,
        remarks: data.remarks || "",
      });

      // Set employee data if editing
      if (data.employee) {
        const employee = employees.find((emp) => emp.id === data.employee);
        if (employee) {
          setEmployeeData(employee);
        }
      }
    } else {
      // Initialize empty form for new record
      setFormData({
        employee: "",
        leave_type: "",
        total_alloted: "",
        leaves_consumed: "",
        remaining_leaves: "",
        remarks: "",
      });
      setSelectedLeaveType(null);
      setEmployeeData(null);
    }
  }, [data]);

  // Fetch leave types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await getLeaveTypes({});
        console.log("Leave Types Response:", response);
        if (response?.results) {
          setLeaveTypeOptions(
            response.results.map((type) => ({
              value: type.id,
              label: type.name,
              leave_count: type.leave_count,
              ...type,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching leave types:", error);
        toast.error("Failed to load leave types");
      }
    };
    fetchLeaveTypes();
  }, []);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setIsLoading(true);

      // Prepare payload
      const payload = {
        id: isEditMode ? data.id : undefined,
        employee: values.employee,
        leave_type: values.leave_type,
        total_allotted: Number(values.total_alloted),
        consumed: Number(values.leaves_consumed),
        remarks: values.remarks || "",
      };

      if (isEditMode) {
        payload.id = data.id;
      }

      console.log("Saving Leave Balance with payload:", payload);
      const response = await saveLeaveOpeningBalance(payload);

      if (response) {
        toast.success(
          `Leave balance ${isEditMode ? "updated" : "added"} successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        handleClose();
      }
    } catch (error) {
      console.error("Error saving leave balance:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "add"} leave balance.`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (reload) reload();
    setIsOpen(false);
  };

  // Get employee display values with fallbacks
  const getEmployeeDisplayValues = () => {
    if (!employeeData) return {};

    return {
      employee_name: employeeData.label || "N/A",
      id: employeeData.id || "",
      department_name: employeeData.department_name || "N/A",
      department_position: employeeData.department_position || "N/A",
    };
  };

  // Employee fields with proper structure
  const employeeFields = useMemo(() => {
    const fields = [];

    if (isEditMode) {
      // In edit mode, show employee info as read-only
      const displayValues = getEmployeeDisplayValues();
      fields.push({
        InputField: TextInput,
        name: "employee_display",
        label: "Employee",
        disabled: true,
        colsSpan: 2,
        value: `${displayValues.employee_name}`,
      });
    } else {
      // In create mode, show searchable dropdown
      fields.push({
        InputField: SelectInputComponent,
        name: "employee",
        required: true,
        label: "Employee Name",
        options: employees,
        placeholder: "Search and select an employee",
        colsSpan: 2,
        searchable: true,
        onFieldUpdate: (field, value, formValues, setFieldValue) => {
          const selectedEmp = employees.find((emp) => emp.value === value);
          if (selectedEmp) {
            setEmployeeData(selectedEmp);
            // Auto-fill department and designation
            setFieldValue(
              "employee_department",
              selectedEmp.department_name || selectedEmp.department || ""
            );
            setFieldValue(
              "employee_designation",
              selectedEmp.designation || selectedEmp.position || ""
            );
          }
        },
      });
    }

    // Department (auto-filled, read-only)
    fields.push({
      InputField: SelectInputComponent,
      name: "employee_department",
      label: "Department",
      options: Departments,
      disabled: true,
      colsSpan: 1,
      value: employeeData?.department_name,
      placeholder: employeeData ? "" : "Select employee first",
    });

    // Designation (auto-filled, read-only)
    fields.push({
      InputField: SelectInputComponent,
      name: "employee_designation",
      label: "Designation",
      disabled: true,
      options: Designations,
      colsSpan: 1,
      value: employeeData?.department_position,
      placeholder: employeeData ? "" : "Select employee first",
    });

    return fields;
  }, [isEditMode, employeeData, employees]);

  // Calculate remaining leaves
  const calculateRemainingLeaves = (totalAlloted, consumed) => {
    const total = Number(totalAlloted) || 0;
    const consumedNum = Number(consumed) || 0;
    return Math.max(0, total - consumedNum);
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
              validateFormSchema: validateLeaveBalanceFormSchema,
              submitButtonText: isEditMode ? "Update" : "Submit",
              cancelButtonText: "Cancel",
              columns: 2,
              disableSubmit: isLoading,
              loadingMessage: isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Submitting..."
                : "",
              formFields: [
                {
                  sheetCardExtension: true,
                  sheetCardTitle: "Employee Selection",
                  InputFields: employeeFields,
                },
                {
                  sheetCardExtension: true,
                  sheetCardTitle: "Leave Balance Details",
                  InputFields: [
                    {
                      InputField: SelectInputComponent,
                      name: "leave_type",
                      required: true,
                      label: "Leave Type",
                      options: LeaveTypeOptions,
                      placeholder: "Select leave type",
                      onFieldUpdate: (
                        field,
                        value,
                        formValues,
                        setFieldValue
                      ) => {
                        const selectedType = LeaveTypeOptions.find(
                          (type) => type.value === value
                        );
                        if (selectedType) {
                          setSelectedLeaveType(selectedType);
                          const alloted = selectedType.leave_count || 0;
                          setFieldValue("total_alloted", alloted);
                          // Recalculate remaining leaves with current consumed value
                          const consumed = formValues.leaves_consumed || 0;
                          const remaining = calculateRemainingLeaves(
                            alloted,
                            consumed
                          );
                          setFieldValue("remaining_leaves", remaining);
                        }
                      },
                    },
                    {
                      InputField: NumberInput,
                      name: "total_alloted",
                      required: true,
                      label: "Total Allotted",
                      disabled: true,
                      placeholder: "Select leave type first",
                    },
                    {
                      InputField: NumberInput,
                      name: "leaves_consumed",
                      required: true,
                      label: "Leaves Consumed",
                      min: 0,
                      placeholder: "Enter consumed leaves",
                      onFieldUpdate: (
                        field,
                        value,
                        formValues,
                        setFieldValue
                      ) => {
                        const consumed = Number(value) || 0;
                        const totalAlloted =
                          Number(formValues.total_alloted) || 0;

                        // Validate max value
                        if (consumed > totalAlloted) {
                          toast.error(
                            `Leaves consumed cannot exceed total allotted (${totalAlloted})`
                          );
                          return;
                        }

                        // Calculate and set remaining leaves
                        const remaining = calculateRemainingLeaves(
                          totalAlloted,
                          consumed
                        );
                        setFieldValue("remaining_leaves", remaining);
                      },
                    },
                    {
                      InputField: NumberInput,
                      name: "remaining_leaves",
                      label: "Remaining Leaves",
                      disabled: true,
                      placeholder: "Auto-calculated",
                    },
                    {
                      InputField: TextAreaInput,
                      name: "remarks",
                      label: "Remarks",
                      placeholder: "Enter any additional remarks (optional)",
                      required: false,
                      colsSpan: 2,
                      rows: 3,
                    },
                  ],
                },
              ],
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
