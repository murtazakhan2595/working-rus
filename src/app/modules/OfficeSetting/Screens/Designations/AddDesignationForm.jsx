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
  const [formData, setFormData] = useState(edit?.data || DesignationInfo);
  const [organization, setOrganization] = useState([]);
  const formikRef = useRef(null);
  
  // Get user details from Redux store to access organization ID
  const userDetails = useSelector((state) => state.emp?.user_details);
  const userOrganizationId = userDetails?.organization_id || userDetails?.organization;

  // Update formData when edit data changes
  useEffect(() => {
    if (edit?.data) {
      setFormData(edit.data);
      // If Formik is initialized, update its values
      if (formikRef.current) {
        formikRef.current.setValues(edit.data);
      }
    }
  }, [edit?.data]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await getOrganizationList();
        setOrganization(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLists();
  }, []);

  const handleClose = () => {
    setCloseSheet(true);
  };

  // Form validation without Yup
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
    try {
      // Add organization ID to the payload
      const payload = {
        ...values,
        organization: userOrganizationId || userOrganization
      };
      
      console.log("Submitting payload:", payload);
      
      const response = await saveDesignation(values?.id, payload);
      if (response) {
        toast.success(
          `Designation ${edit?.data ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        if (typeof reload === 'function') {
          // Ensure reload is called
          reload();
        }
        setIsOpen(false);
      } else {
        // Handle API error response
        toast.error("Failed to save designation. Please try again.", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log("ERROR", error);
      // Set form errors if they come from the API
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data) {
        // Handle Django REST framework error format
        setErrors(error.response.data);
      }
      toast.error("An error occurred while saving designation", {
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
        innerRef={formikRef}
      >
        {(props) => (
          <form onSubmit={props?.handleSubmit}>
            <SheetCardExtension title="Designation Details">
              {/* <SelectInputComponent
                name={"organization"}
                options={organization}
                error={props.errors.organization}
                touch={props.touched.organization}
                value={props.values.organization}
                label={"Organization"}
                required
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
              /> */}
              <TextInput
                name="name"
                label="Designation"
                required
                error={props.errors.name}
                touch={props.touched.name}
                value={props.values.name}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
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
                  props.handleChange(field)(value);
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
                >
                  {edit?.data ? "Update" : "Add"}
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
