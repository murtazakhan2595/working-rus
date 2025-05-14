import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { Button } from "components/ui/button";
import AlertDialogue from "components/ui/AlertDialogue";
import { SheetCardExtension } from "components/SheetCardExtension";
import { TextInput, FilterInput } from "components/FormControl";
import { saveAssignedRole, getUserRoleList } from "app/hooks/rolesPermisions";
import { useSelector } from "react-redux";
import { AssignedRole } from "app/utils/Types/RolesPermission";

const AssignRoleForm = ({ isOpen, setIsOpen, edit, reload }) => {
  const [confirmSave, setConfirmSave] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [employeeData, setEmployeeData] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState(new Set());
  const isEditMode = Boolean(edit?.data);

  // Get employees from Redux state
  const employees = useSelector((state) => state.emp.employees);

  // Initialize form data with assigned role values if in edit mode
  const [formData, setFormData] = useState({
    ...AssignedRole,
    ...(edit?.data || {}),
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
      setFormData({
        ...AssignedRole,
        ...edit.data,
      });

      // If editing, set the employee data and selected roles
      if (edit.data.employee) {
        setEmployeeData(edit.data.employee);
      }

      if (edit.data.roles) {
        const roleIds = edit.data.roles.map((role) => role.id);
        setSelectedRoles(new Set(roleIds));
      }
    }
  }, [edit?.data]);

  const validateForm = async (values) => {
    const errors = {};

    if (!employeeData) {
      errors.employee = "Employee is required";
    }

    if (selectedRoles.size === 0) {
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

  const handleRoleToggle = (roleId) => {
    const newSelectedRoles = new Set(selectedRoles);
    if (newSelectedRoles.has(roleId)) {
      newSelectedRoles.delete(roleId);
    } else {
      newSelectedRoles.add(roleId);
    }
    setSelectedRoles(newSelectedRoles);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = {
      employeeId: employeeData?.id,
      roles: Array.from(selectedRoles),
    };

    setFormValues({ ...values, ...payload });
    setConfirmSave(true);
    setSubmitting(false);
  };

  const confirmSubmit = async () => {
    if (!formValues || !employeeData) return;

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
              {/* Employee Search Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Employee *
                </label>

                {!employeeData && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by Employee ID or Name"
                      value={searchTerm}
                      onChange={(e) => handleEmployeeSearch(e.target.value)}
                      disabled={isEditMode}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-2">
                        <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                )}

                {/* Search Results */}
                {searchResults.length > 0 && !employeeData && (
                  <div className="mt-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg">
                    {searchResults.map((employee) => (
                      <div
                        key={employee.id}
                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleEmployeeSelect(employee)}
                      >
                        <div className="font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {employee.employeeId} | {employee.department} -{" "}
                          {employee.branch}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {props.errors.employee && (
                  <div className="text-red-500 text-sm mt-1">
                    {props.errors.employee}
                  </div>
                )}
              </div>

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
                            {employeeData.employeeId}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Department
                          </label>
                          <div className="text-gray-900">
                            {employeeData.department || "N/A"}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Branch
                          </label>
                          <div className="text-gray-900">
                            {employeeData.branch || "N/A"}
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
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Roles Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Roles *
                </label>

                {availableRoles.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    {availableRoles.map((role) => (
                      <div key={role.id} className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id={`role-${role.id}`}
                          checked={selectedRoles.has(role.id)}
                          onChange={() => handleRoleToggle(role.id)}
                          className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label
                          htmlFor={`role-${role.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium text-gray-900">
                            {role.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {role.description}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No roles available
                  </div>
                )}

                {selectedRoles.size > 0 && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700">
                      {selectedRoles.size} role
                      {selectedRoles.size !== 1 ? "s" : ""} selected
                    </div>
                  </div>
                )}

                {props.errors.roles && (
                  <div className="text-red-500 text-sm mt-1">
                    {props.errors.roles}
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
                  disabled={
                    props.isSubmitting ||
                    !employeeData ||
                    selectedRoles.size === 0
                  }
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
