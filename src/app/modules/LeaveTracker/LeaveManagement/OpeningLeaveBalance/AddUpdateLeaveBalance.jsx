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
import { validateMultiLeaveBalanceFormSchema } from "app/utils/FormSchema/leaveTrackerFormSchema";
import { saveLeaveOpeningBalance, getLeaveTypes } from "app/hooks/leaveTracker";
import { toast } from "react-toastify";
import { Button } from "components/ui/button";
import { Plus, Trash2 } from "lucide-react";

export default function AddUpdateLeaveBalance({
  isOpen = true,
  setIsOpen,
  reloadData = () => {},
  data: directData = null,
  edit = {}, // new pattern from NavigationSheetComponent
}) {
  const data = edit?.data || directData;
  const [isLoading, setIsLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [LeaveTypeOptions, setLeaveTypeOptions] = useState([]);

  // Simple form state - one object with all values
  const [formValues, setFormValues] = useState({
    employee: "",
    employee_department: "",
    employee_designation: "",
  });

  const [leaveEntries, setLeaveEntries] = useState([
    {
      id: 1,
      leave_type: "",
      total_alloted: "",
      leaves_consumed: "",
      remaining_leaves: "",
      remarks: "",
    },
  ]);

  const isEditMode = Boolean(data);

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
      const consumed = data.consumed || 0;
      const alloted = data.total_allotted || 0;

      setFormValues({
        employee: data.employee || "",
        employee_department: "",
        employee_designation: "",
      });

      setLeaveEntries([
        {
          id: 1,
          leave_type: data.leave_type || "",
          total_alloted: alloted,
          leaves_consumed: consumed,
          remaining_leaves: alloted - consumed,
          remarks: data.remarks || "",
        },
      ]);

      if (data.employee) {
        const employee = employees.find((emp) => emp.id === data.employee);
        if (employee) {
          setEmployeeData(employee);
        }
      }
    } else {
      setFormValues({
        employee: "",
        employee_department: "",
        employee_designation: "",
      });

      setLeaveEntries([
        {
          id: 1,
          leave_type: "",
          total_alloted: "",
          leaves_consumed: "",
          remaining_leaves: "",
          remarks: "",
        },
      ]);
      setEmployeeData(null);
    }
  }, [data, employees]);

  // Fetch leave types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await getLeaveTypes({});
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

  // Simple form value updater
  const updateFormValue = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add new leave entry
  const addLeaveEntry = () => {
    const newId = Math.max(...leaveEntries.map((entry) => entry.id)) + 1;
    setLeaveEntries((prev) => [
      ...prev,
      {
        id: newId,
        leave_type: "",
        total_alloted: "",
        leaves_consumed: "",
        remaining_leaves: "",
        remarks: "",
      },
    ]);
  };

  // Remove leave entry
  const removeLeaveEntry = (entryId) => {
    if (leaveEntries.length > 1) {
      setLeaveEntries((prev) => prev.filter((entry) => entry.id !== entryId));
    } else {
      toast.error("At least one leave entry is required");
    }
  };

  // Update leave entry
  const updateLeaveEntry = (entryId, field, value) => {
    setLeaveEntries((prevEntries) =>
      prevEntries.map((entry) => {
        if (entry.id === entryId) {
          const updatedEntry = { ...entry, [field]: value };

          // Auto-calculate remaining leaves
          if (field === "leaves_consumed" || field === "total_alloted") {
            const total =
              Number(
                field === "total_alloted" ? value : updatedEntry.total_alloted
              ) || 0;
            const consumed =
              Number(
                field === "leaves_consumed"
                  ? value
                  : updatedEntry.leaves_consumed
              ) || 0;
            updatedEntry.remaining_leaves = Math.max(0, total - consumed);
          }

          return updatedEntry;
        }
        return entry;
      })
    );
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);

      // Check for duplicate leave types
      const leaveTypes = leaveEntries
        .map((entry) => entry.leave_type)
        .filter(Boolean);
      const uniqueLeaveTypes = [...new Set(leaveTypes)];
      if (leaveTypes.length !== uniqueLeaveTypes.length) {
        toast.error("Duplicate leave types are not allowed");
        return;
      }

      // Use current formValues.employee instead of values.employee
      const payloads = leaveEntries.map((entry) => ({
        id: isEditMode ? data.id : undefined,
        employee: formValues.employee, // Use our state value
        leave_type: entry.leave_type,
        total_allotted: Number(entry.total_alloted),
        consumed: Number(entry.leaves_consumed),
        remarks: entry.remarks || "",
      }));

      console.log("Saving Leave Balances with payloads:", payloads);

      const responses = [];
      for (const payload of payloads) {
        const response = await saveLeaveOpeningBalance(payload);
        responses.push(response);

        if (response === false) {
          throw new Error("Failed to save one or more leave balances");
        }
      }

      const successCount = responses.filter(
        (response) => response !== false
      ).length;

      if (successCount === responses.length) {
        toast.success(
          `${successCount} leave balance${successCount > 1 ? "s" : ""} ${
            isEditMode ? "updated" : "added"
          } successfully!`
        );
        handleClose();
      }
    } catch (error) {
      console.error("Error saving leave balances:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "add"} leave balances.`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    reloadData();
    setIsOpen(false);
  };

  // Employee fields
  const employeeFields = useMemo(() => {
    const fields = [];

    if (isEditMode) {
      const displayValues = {
        employee_name: employeeData?.label || "N/A",
        department_name: employeeData?.department_name || "N/A",
        department_position: employeeData?.department_position || "N/A",
      };

      fields.push({
        InputField: TextInput,
        name: "employee_display",
        label: "Employee",
        disabled: true,
        colsSpan: 2,
        value: displayValues.employee_name,
        // Override the onChange to do nothing
        onFieldUpdate: () => {},
      });
    } else {
      fields.push({
        InputField: SelectInputComponent,
        name: "employee",
        required: true,
        label: "Employee Name",
        options: employees,
        placeholder: "Search and select an employee",
        colsSpan: 2,
        searchable: true,
        value: formValues.employee, // Use our state value
        onFieldUpdate: (field, value) => {
          const selectedEmp = employees.find((emp) => emp.value === value);
          console.log("Selected Employee:", selectedEmp);
          if (selectedEmp) {
            setEmployeeData(selectedEmp);
            updateFormValue("employee", value);
            updateFormValue(
              "employee_department",
              selectedEmp.department_name || selectedEmp.department || ""
            );
            updateFormValue(
              "employee_designation",
              selectedEmp.department_position || selectedEmp.position || ""
            );
          }
        },
      });
    }

    fields.push({
      InputField: SelectInputComponent,
      name: "employee_department",
      label: "Department",
      options: Departments,
      disabled: true,
      colsSpan: 1,
      value: formValues.employee_department,
      onFieldUpdate: () => {}, // Do nothing
    });

    fields.push({
      InputField: SelectInputComponent,
      name: "employee_designation",
      label: "Designation",
      disabled: true,
      options: Designations,
      colsSpan: 1,
      value: formValues.employee_designation,
      onFieldUpdate: () => {}, // Do nothing
    });

    return fields;
  }, [isEditMode, employeeData, employees, formValues]);

  // Generate leave entry fields
  const generateLeaveEntryFields = () => {
    const sections = leaveEntries.map((entry, index) => ({
      sheetCardExtension: true,
      sheetCardTitle: (
        <div className="flex justify-between items-center">
          <span>Leave Type {index + 1}</span>
          {leaveEntries.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeLeaveEntry(entry.id)}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
      InputFields: [
        {
          InputField: SelectInputComponent,
          name: `leave_entry_${entry.id}_leave_type`,
          required: true,
          label: "Leave Type",
          options: LeaveTypeOptions,
          placeholder: "Select leave type",
          value: entry.leave_type,
          onFieldUpdate: (field, value) => {
            const selectedType = LeaveTypeOptions.find(
              (type) => type.value === value
            );
            if (selectedType) {
              const alloted = selectedType.leave_count || 0;
              updateLeaveEntry(entry.id, "leave_type", value);
              updateLeaveEntry(entry.id, "total_alloted", alloted);

              // Recalculate remaining
              const consumed = entry.leaves_consumed || 0;
              const remaining = Math.max(0, alloted - consumed);
              updateLeaveEntry(entry.id, "remaining_leaves", remaining);
            }
          },
        },
        {
          InputField: NumberInput,
          name: `leave_entry_${entry.id}_total_alloted`,
          required: true,
          label: "Total Allotted",
          disabled: true,
          placeholder: "Select leave type first",
          value: entry.total_alloted,
          onFieldUpdate: () => {}, // Do nothing - it's disabled
        },
        {
          InputField: NumberInput,
          name: `leave_entry_${entry.id}_leaves_consumed`,
          required: true,
          label: "Leaves Consumed",
          min: 0,
          placeholder: "Enter consumed leaves",
          value: entry.leaves_consumed,
          onFieldUpdate: (field, value) => {
            const consumed = Number(value) || 0;
            const totalAlloted = Number(entry.total_alloted) || 0;

            if (consumed > totalAlloted) {
              toast.error(
                `Leaves consumed cannot exceed total allotted (${totalAlloted})`
              );
              return;
            }

            updateLeaveEntry(entry.id, "leaves_consumed", consumed);
          },
        },
        {
          InputField: NumberInput,
          name: `leave_entry_${entry.id}_remaining_leaves`,
          label: "Remaining Leaves",
          disabled: true,
          placeholder: "Auto-calculated",
          value: entry.remaining_leaves,
          onFieldUpdate: () => {}, // Do nothing - it's auto-calculated
        },
        {
          InputField: TextAreaInput,
          name: `leave_entry_${entry.id}_remarks`,
          label: "Remarks",
          placeholder: "Enter any additional remarks (optional)",
          required: false,
          colsSpan: 2,
          rows: 3,
          value: entry.remarks,
          onFieldUpdate: (field, value) => {
            updateLeaveEntry(entry.id, "remarks", value);
          },
        },
      ],
    }));

    // Add button
    sections.push({
      sheetCardExtension: false,
      customComponent: () => (
        <div className="flex justify-center py-4">
          <Button
            type="button"
            variant="outline"
            onClick={addLeaveEntry}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Another Leave Type
          </Button>
        </div>
      ),
    });

    return sections;
  };

  // Create fake initial values for Formik (just for validation)
  const getFakeInitialValues = () => {
    const values = { ...formValues };

    leaveEntries.forEach((entry) => {
      values[`leave_entry_${entry.id}_leave_type`] = entry.leave_type;
      values[`leave_entry_${entry.id}_total_alloted`] = entry.total_alloted;
      values[`leave_entry_${entry.id}_leaves_consumed`] = entry.leaves_consumed;
      values[`leave_entry_${entry.id}_remaining_leaves`] =
        entry.remaining_leaves;
      values[`leave_entry_${entry.id}_remarks`] = entry.remarks;
    });

    return values;
  };

  // Custom validation that uses our state
  const customValidation = () => {
    const values = getFakeInitialValues();
    return validateMultiLeaveBalanceFormSchema(values);
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
              initialValues: getFakeInitialValues(),
              enableReinitialize: false, // We don't want Formik to manage state
              handleSubmit: handleSubmit,
              validateFormSchema: customValidation,
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
                ...generateLeaveEntryFields(),
              ],
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
