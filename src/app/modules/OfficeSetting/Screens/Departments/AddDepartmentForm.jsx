import { saveDepartment } from "app/hooks/general";
import { DepartmentsInformation } from "app/utils/Types/Departments";
import { SelectInputComponent, TextAreaInput, TextInput, FilterInput } from "components/FormControl";
import { handleCloseWithConfirmation, SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Checkbox } from "src/@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "src/@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

const AddDepartmentForm = ({ isOpen, setIsOpen, edit, reload, userOrganization, onUpdateSuccess = null }) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [permissions, setPermissions] = useState(edit?.data?.permissions || {});
  const isEditMode = Boolean(edit?.data);

  // Initialize form data with department values if in edit mode
  const [formData, setFormData] = useState({
    ...DepartmentsInformation,
    ...(edit?.data || {}),
  });

  // Mock permission modules
  const permissionModules = [
    {
      name: "Employees",
      permissions: ["View", "Add", "Edit", "Delete"]
    },
    {
      name: "Attendance",
      permissions: ["View", "Add", "Edit", "Approve"]
    },
    {
      name: "Leaves",
      permissions: ["View", "Add", "Edit", "Approve"]
    },
    {
      name: "Tasks",
      permissions: ["View", "Add", "Edit", "Delete"]
    },
    {
      name: "Roles",
      permissions: ["View", "Add", "Edit", "Delete"]
    },
    {
      name: "Departments",
      permissions: ["View", "Add", "Edit", "Delete"]
    },
    {
      name: "Profiles",
      permissions: ["View", "Edit"]
    }
  ];

  // Update form data when edit data changes
  useEffect(() => {
    setFormData({
      ...DepartmentsInformation,
      ...(edit?.data || {}),
    });
  }, [edit?.data]);

  // Update permissions when edit data changes
  useEffect(() => {
    if (edit?.data?.permissions) {
      setPermissions(edit.data.permissions);
    }
  }, [edit?.data]);

  const handleClose = () => {
    setCloseSheet(true);
  };

  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    // Simple validation - check if name is empty
    const errors = {};
    if (!values.name || values.name.trim() === '') {
      errors.name = 'Department name is required';
      setErrors(errors);
      setSubmitting(false);
      return;
    }
    
    try {
      // Explicitly construct the payload with required fields
      const payload = {
        name: values.name,
        description: values.description,
        permissions: permissions
      };

      // Only add organization for new departments
      if (!isEditMode && userOrganization?.id) {
        payload.organization = userOrganization.id;
      }

      // Pass the department ID (if editing) and the structured payload
      const response = await saveDepartment(edit?.data?.id, payload);

      if (response) {
        toast.success(
          `Department ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );

        // Ensure table is reloaded by calling reload function
        if (typeof reload === 'function') {
          reload(true);
        }

        // Call the update success callback if provided
        if (onUpdateSuccess && typeof onUpdateSuccess === "function") {
          await onUpdateSuccess(payload);
        }

        resetForm();
        setIsOpen(false); // Close form without triggering API refresh since data already updated
      }
    } catch (error) {
      // Handle specific API validation errors - if backend returns field-specific errors
      if (error?.response?.data) {
        const apiErrors = error.response.data;
        
        // Convert API errors to a format Formik can display
        const formikErrors = {};
        Object.keys(apiErrors).forEach(key => {
          formikErrors[key] = Array.isArray(apiErrors[key]) 
            ? apiErrors[key][0] 
            : apiErrors[key];
        });
        
        setErrors(formikErrors);
      }
      
      // Show general error message
      const errorMessage = error?.response?.data?.message || `Failed to ${isEditMode ? "update" : "add"} department.`;
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle permission change
  const handlePermissionChange = (module, permission, checked) => {
    setPermissions(prev => {
      const newPermissions = { ...prev };
      
      if (!newPermissions[module]) {
        newPermissions[module] = [];
      }
      
      if (checked) {
        if (!newPermissions[module].includes(permission)) {
          newPermissions[module] = [...newPermissions[module], permission];
        }
      } else {
        newPermissions[module] = newPermissions[module].filter(p => p !== permission);
        if (newPermissions[module].length === 0) {
          delete newPermissions[module];
        }
      }
      
      return newPermissions;
    });
  };

  // Filter modules based on search term
  const filteredModules = searchTerm.trim() === "" 
    ? permissionModules 
    : permissionModules.filter(module => 
        module.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}
      <Formik
        initialValues={formData}
        onSubmit={handleSubmit}
        enableReinitialize // Important for edit mode to update form when edit data changes
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <SheetCardExtension title={`${isEditMode ? 'Edit' : 'Add'} Department`}>
              {/* Department Name */}
              <TextInput
                name="name"
                label="Department Name"
                required
                error={props.errors.name}
                touch={props.touched.name}
                value={props.values.name}
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
              />

              <TextAreaInput
                name="description"
                label="Description"
                error={props.errors.description}
                touch={props.touched.description}
                value={props.values.description}
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
              />
            </SheetCardExtension>

            <SheetCardExtension title="Permissions">
              <div className="mb-4">
                <FilterInput
                  filters={[
                    {
                      type: "search",
                      placeholder: "Search modules...",
                      name: "search",
                    },
                  ]}
                  onChange={(filterName, filterValue) => {
                    if (filterName === "search") {
                      setSearchTerm(filterValue);
                    }
                  }}
                />
              </div>

              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {filteredModules.length > 0 ? (
                  filteredModules.map((module, index) => (
                    <Collapsible key={index} className="overflow-hidden border rounded-md">
                      <div className="flex items-center justify-between p-4 cursor-pointer bg-gray-50">
                        <div className="font-medium">{module.name}</div>
                        <CollapsibleTrigger className="p-1 rounded-full hover:bg-gray-200">
                          {open => (
                            open ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
                          )}
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent>
                        <div className="grid grid-cols-2 gap-3 p-4 border-t">
                          {module.permissions.map((permission, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`${module.name}-${permission}`}
                                checked={permissions[module.name]?.includes(permission) || false}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(module.name, permission, checked)
                                }
                              />
                              <label 
                                htmlFor={`${module.name}-${permission}`}
                                className="text-sm cursor-pointer"
                              >
                                {permission}
                              </label>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No modules match your search
                  </div>
                )}
              </div>
            </SheetCardExtension>

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
                  onClick={(e) => {
                    e.preventDefault();
                    props.handleSubmit();
                  }}
                >
                  {props.isSubmitting ? 'Saving...' : (isEditMode ? "Update" : "Add")}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddDepartmentForm;
