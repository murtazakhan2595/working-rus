import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { Button } from "components/ui/button";
import AlertDialogue from "components/ui/AlertDialogue";
import { SheetCardExtension } from "components/SheetCardExtension";
import {
  TextInput,
  FilterInput,
  SelectInputComponent,
  SelectMultiInputComponent, // Added this import
} from "components/FormControl";
import { saveAssignedRole, getUserRoleList } from "app/hooks/rolesPermisions";
import { useSelector } from "react-redux";
import { AssignedRole } from "app/utils/Types/RolesPermission";
import { DepartmentName } from "utils/getValuesFromTables";
import { BranchName } from "utils/getValuesFromTables";
import { CheckBoxInput } from "components/FormControl";
import { Label } from "src/@/components/ui/label";

const AssignRoleForm = ({ isOpen, setIsOpen, edit, reload }) => {
  const [confirmSave, setConfirmSave] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const isEditMode = Boolean(edit?.data);

  // Get employees from Redux state
  const employees = useSelector((state) => state.emp.employees);

  // Initialize form data with assigned role values if in edit mode
  const [formData, setFormData] = useState({
    ...AssignedRole,
    ...(edit?.data || {}),
    employee: "",
    roles: [], // This will now hold an array of role IDs for multi-select
  });

  // Load available roles on mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getUserRoleList({
          options: { page: 1, sizePerPage: 100 },
        });
        setAvailableRoles(response.results);
      } catch (error) {
        toast.error("Failed to load roles");
        console.error("Error loading roles:", error);
      }
    };

    fetchRoles();
  }, []);

  // Update form data when edit data changes
  useEffect(() => {
    if (edit?.data) {
      // Extract role IDs for multi-select
      const roleIds = edit.data.roles
        ? edit.data.roles.map((role) => role.id)
        : [];

      setFormData({
        ...AssignedRole,
        ...edit.data,
        employee: edit.data.employee?.id || "",
        roles: roleIds, // Set as array of IDs for multi-select
      });

      // If editing, set the employee data
      if (edit.data.employee) {
        setEmployeeData(edit.data.employee);
        setSearchTerm(
          `${edit.data.employee.name} (${edit.data.employee.employeeId})`
        );
      }
    }
  }, [edit?.data]);

  const validateForm = async (values) => {
    const errors = {};

    if (!employeeData && !values.employee) {
      errors.employee = "Employee is required";
    }

    if (!values.roles || values.roles.length === 0) {
      errors.roles = "At least one role must be selected";
    }

    return errors;
  };

  const handleEmployeeSearch = async (searchValue) => {
    setSearchTerm(searchValue);

    if (!searchValue || searchValue.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Use existing employees from Redux state
    try {
      const searchTermLower = searchValue.toLowerCase();
      const results = employees.filter((employee) => {
        const name = employee.label?.toLowerCase() || "";
        const id = employee.empId?.toLowerCase() || "";
        return name.includes(searchTermLower) || id.includes(searchTermLower);
      });

      // Transform to the format expected by the component
      const transformedResults = results.slice(0, 10).map((emp) => ({
        id: emp.value,
        name: emp.label,
        employeeId: emp.empId || emp.value,
        department: emp.department || "N/A",
        branch: emp.branch || "N/A",
        email: emp.email || "",
      }));

      setSearchResults(transformedResults);
    } catch (error) {
      console.error("Error searching employees:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEmployeeSelect = (employee) => {
    setEmployeeData(employee);
    setSearchResults([]);
    setSearchTerm(`${employee.name} (${employee.employeeId})`);
  };

  const clearEmployeeSelection = () => {
    setEmployeeData(null);
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      employeeId: employeeData?.id || values.employee,
      roles: values.roles, // This is now already an array of role IDs
    };

    setFormValues({ ...values, ...payload });
    setConfirmSave(true);
    setSubmitting(false);
  };

  const confirmSubmit = async () => {
    if (!formValues || (!employeeData && !formValues.employeeId)) return;

    try {
      const payload = {
        employeeId: formValues.employeeId,
        roles: formValues.roles,
      };

      const response = await saveAssignedRole(edit?.data?.id, payload);

      if (response) {
        toast.success(
          `Roles ${isEditMode ? "Updated" : "Assigned"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        setIsOpen(false);

        if (typeof reload === "function") {
          reload();
        }
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "assign"} roles.`;
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Transform employees for SelectInputComponent
  const employeeOptions = employees.map((emp) => ({
    value: emp.value,
    label: `${emp.label} (${emp.serial_number})`,
    employeeId: emp.empId || emp.value,
    department: emp.department || "N/A",
    branch: emp.branch || "N/A",
    email: emp.email || "",
  }));

  // Transform available roles for SelectMultiInputComponent
  const roleOptions = availableRoles.map((role) => ({
    value: role.id,
    label: role.name,
    description: role.description,
  }));

  return (
    <>
      <Formik
        initialValues={formData}
        onSubmit={handleSubmit}
        validate={validateForm}
        enableReinitialize
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <SheetCardExtension
              title={`${isEditMode ? "Edit" : "Assign"} Roles`}
            >
              {/* Employee Selection Section */}
              <div className="mb-6">
                {!isEditMode ? (
                  <>
                    <SelectInputComponent
                      name="employee"
                      error={props.errors?.employee}
                      touch={props.touched?.employee}
                      value={props.values.employee}
                      label="Select Employee"
                      required={true}
                      options={employeeOptions}
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                        // Find the full employee data
                        const selectedEmp = employees.find(
                          (emp) => emp.value === value
                        );
                        if (selectedEmp) {
                          setEmployeeData(selectedEmp);
                        }
                      }}
                      placeholder="Select an employee"
                      disabled={isEditMode}
                    />
                  </>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Employee
                    </label>
                    <TextInput
                      value={
                        employeeData
                          ? `${employeeData.name} (${employeeData.employeeId})`
                          : ""
                      }
                      disabled={true}
                      label=""
                    />
                  </div>
                )}
              </div>
              {console.log("employeeData", employeeData)}
              {/* Employee Details */}
              {employeeData && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg mb-2 text-blue-900">
                        Selected Employee
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <div className="text-gray-900">
                            {employeeData.name}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Employee ID
                          </label>
                          <div className="text-gray-900">
                            {employeeData.serial_number}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Department
                          </label>
                          <div className="text-gray-900">
                            <DepartmentName
                              value={employeeData.department_name}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Branch
                          </label>
                          <div className="text-gray-900">
                            <BranchName value={employeeData.branch} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {!isEditMode && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={clearEmployeeSelection}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Roles Selection - Now using SelectMultiInputComponent */}
              <div className="mb-6">
                <SelectMultiInputComponent
                  name="roles"
                  options={roleOptions}
                  error={props.errors?.roles}
                  touch={props.touched?.roles}
                  value={props.values.roles}
                  label="Select Roles"
                  required={true}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                  placeholder="Select roles"
                />

                {/* Show selected roles count */}
                {props.values.roles && props.values.roles.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700">
                      {props.values.roles.length} role
                      {props.values.roles.length !== 1 ? "s" : ""} selected
                    </div>
                  </div>
                )}
              </div>
            </SheetCardExtension>

            {/* Form Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
                <Button
                  variant="outline"
                  size="lg"
                  type="button"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  disabled={props.isSubmitting}
                >
                  {props.isSubmitting
                    ? "Assigning..."
                    : isEditMode
                    ? "Update"
                    : "Assign"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>

      {confirmSave && (
        <AlertDialogue
          title="Confirm Role Assignment"
          description={`Are you sure you want to ${
            isEditMode ? "update" : "assign"
          } these roles to ${employeeData?.name}?`}
          isOpen={confirmSave}
          setIsOpen={setConfirmSave}
          handleContinue={() => {
            confirmSubmit();
            setConfirmSave(false);
          }}
        />
      )}
    </>
  );
};

export default AssignRoleForm;
