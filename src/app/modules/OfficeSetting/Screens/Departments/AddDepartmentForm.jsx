import { saveDepartment } from "app/hooks/general";
import { DepartmentsInformation } from "app/utils/Types/Departments";
import { SelectInputComponent, TextAreaInput, TextInput } from "components/FormControl";
import { handleCloseWithConfirmation, SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddDepartmentForm = ({ isOpen, setIsOpen, edit, reload, userOrganization }) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const isEditMode = Boolean(edit?.data);

  // Initialize form data with department values if in edit mode
  const [formData, setFormData] = useState({
    ...DepartmentsInformation,
    ...(edit?.data || {}),
  });

  // Update form data when edit data changes
  useEffect(() => {
    setFormData({
      ...DepartmentsInformation,
      ...(edit?.data || {}),
    });
  }, [edit?.data]);

  const handleClose = () => {
    setCloseSheet(true);
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    // Simple validation - check if name is empty
    const errors = {};
    if (!values.name || values.name.trim() === '') {
      errors.name = 'Department name is required';
      setErrors(errors);
      setSubmitting(false);
      return;
    }
    
    // Ensure userOrganization and its id are available
    if (!userOrganization?.id) {
      toast.error("Organization information is missing. Please try again.");
      setSubmitting(false);
      return; // Stop submission if organization ID is missing
    }

    try {
      // Explicitly construct the payload with required fields
      const payload = {
        name: values.name,
        description: values.description, // Keep description, even if null
        organization: userOrganization.id, // Assign the organization ID
      };

      // Pass the department ID (if editing) and the structured payload
      const response = await saveDepartment(edit?.data?.id, payload);

      if (response) {
        toast.success(
          `Department ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        setIsOpen(false);
        
        // Ensure table is reloaded by calling reload function
        if (typeof reload === 'function') {
          reload();
        }
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
