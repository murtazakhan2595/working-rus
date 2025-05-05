import { getDepartmentList } from "app/hooks/general";
import { saveDesignation } from "app/hooks/general";
import { getOrganizationList } from "app/hooks/general";
import { DesignationInfo } from "app/utils/Types/Designation";
import { SelectInputComponent } from "components/FormControl";
import { TextAreaInput } from "components/FormControl";
import { TextInput } from "components/FormControl";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const AddDesignationForm = ({ isOpen, setIsOpen, edit, setEdit, reload, userOrganization }) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const isEditMode = Boolean(edit?.data);
  
  // Get user details from Redux store to access organization ID
  const userDetails = useSelector((state) => state.emp?.user_details);
  const userOrganizationId = userDetails?.organization_id || userDetails?.organization;

  // Initialize form data with designation values if in edit mode
  const [formData, setFormData] = useState({
    ...DesignationInfo,
    ...(edit?.data || {}),
  });

  // Log when component mounts and when edit data changes
  useEffect(() => {
    console.log("AddDesignationForm mounted, isEditMode:", isEditMode);
    console.log("Initial edit data:", edit?.data);
    
    if (edit?.data) {
      console.log("Setting form data with edit data:", edit.data);
      setFormData({
        ...DesignationInfo,
        ...(edit.data || {}),
      });
    }
  }, [edit?.data, isEditMode]);

  const handleClose = () => {
    setCloseSheet(true);
  };

  // Form validation
  const validateForm = (values) => {
    const errors = {};
    
    if (!values.name) {
      errors.name = "Designation name is required";
    } else if (values.name.length < 2) {
      errors.name = "Designation name must be at least 2 characters";
    } else if (values.name.length > 50) {
      errors.name = "Designation name must be less than 50 characters";
    }
    
    if (!values.description) {
      errors.description = "Description is required";
    } else if (values.description.length < 5) {
      errors.description = "Description must be at least 5 characters";
    } else if (values.description.length > 500) {
      errors.description = "Description must be less than 500 characters";
    }
    
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log("Submit button clicked");
    console.log("Is edit mode:", isEditMode);
    console.log("Form values:", values);
    console.log("Edit data:", edit?.data);
    
    try {
      // Add organization ID to the payload
      const payload = {
        name: values.name,
        description: values.description,
        organization: userOrganizationId || userOrganization
      };
      
      // For update operations, get the ID from edit.data
      const designationId = isEditMode ? edit.data.id : null;
      
      console.log("Submitting payload:", payload);
      console.log("Designation ID for API call:", designationId);
      console.log("API URL will be:", designationId ? 
        `PATCH /designation/${designationId}` : 
        "POST /designation/");
      
      const response = await saveDesignation(designationId, payload);
      console.log("API Response:", response);
      
      if (response) {
        toast.success(
          `Designation ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        // Ensure table is reloaded by calling reload function
        if (typeof reload === 'function') {
          console.log("Calling reload function");
          reload();
        } else {
          console.warn("Reload is not a function:", reload);
        }
        setIsOpen(false);
      } else {
        // Handle API error response
        console.error("API returned falsy response:", response);
        toast.error("Failed to save designation. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log("API call error:", error);
      console.log("Error response data:", error.response?.data);
      
      // Set form errors if they come from the API
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data) {
        // Handle Django REST framework error format
        setErrors(error.response.data);
      }
      const errorMessage = error?.response?.data?.message || `Failed to ${isEditMode ? "update" : "add"} designation.`;
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
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
        validate={validateForm}
        validateOnChange={true}
        validateOnBlur={true}
        enableReinitialize={true}
      >
        {(props) => (
          <form onSubmit={props?.handleSubmit}>
            <SheetCardExtension title={`${isEditMode ? 'Edit' : 'Add'} Designation`}>
              <TextInput
                name="name"
                label="Designation"
                required
                error={props.errors.name}
                touch={props.touched.name}
                value={props.values.name}
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
                onBlur={props.handleBlur}
              />
              <TextAreaInput
                name="description"
                label="Description"
                required
                error={props.errors.description}
                touch={props.touched.description}
                value={props.values.description}
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
                onBlur={props.handleBlur}
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
                  disabled={props.isSubmitting || !props.isValid}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Submit button clicked manually");
                    console.log("Current values:", props.values);
                    console.log("isEditMode:", isEditMode);
                    console.log("edit.data:", edit?.data);
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

export default AddDesignationForm;
