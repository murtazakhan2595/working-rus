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
import { Input } from "components/ui/input";
import { Loader2, UploadCloud, Download } from "lucide-react";
import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import BulkUploadSection from "components/BulkUploadSection";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const AddDesignationForm = ({
  isOpen,
  setIsOpen,
  edit,
  setEdit,
  reload,
  onUpdateSuccess = null,
}) => {
  const [closeSheet, setCloseSheet] = useState(false);

  // Get user details from Redux store to access organization ID
  const userDetails = useSelector((state) => state.emp?.user_details);
  const userOrganizationId =
    userDetails?.organization_id || userDetails?.organization;

  // Determine if we're in edit mode - handle both structures
  const isEditMode = Boolean(edit?.data) || Boolean(edit?.id);

  // Extract the actual data based on the structure provided
  const editData = edit?.data || edit;

  // Initialize form data with designation values if in edit mode
  const [formData, setFormData] = useState({
    ...DesignationInfo,
    ...(editData || {}),
  });

  // Update form data when edit data changes
  useEffect(() => {
    if (editData) {
      setFormData({
        ...DesignationInfo,
        ...(editData || {}),
      });
    }
  }, [editData, isEditMode]);

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

  const handleSubmit = async (values, formikHelpers) => {
    console.log("Form submitted with values:", values);
    
    const { setSubmitting, setErrors, resetForm } = formikHelpers;

    // Get the ID from the appropriate source
    const designationId = editData?.id;

    // Make sure organization is included
    const submitData = {
      ...values,
      organization:
        values.organization || editData?.organization || userOrganizationId,
    };

    try {
      const response = await saveDesignation(submitData, designationId);

      if (response) {
        toast.success(
          `Designation ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );

        console.log("🚀 Form update successful, calling callbacks...");

        // Call the update success callback if provided
        if (onUpdateSuccess && typeof onUpdateSuccess === "function") {
          console.log("🚀 Calling onUpdateSuccess...");
          await onUpdateSuccess(submitData);
          console.log("🚀 onUpdateSuccess completed");
        }

        resetForm();
        console.log("🚀 About to call setIsOpen(true) to close edit sheet...");
        setIsOpen(true); // Pass true to indicate successful update
        console.log("🚀 setIsOpen(true) called");
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

      const errorMessage =
        error?.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "add"} designation.`;
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
            {!isEditMode && (
              <BulkUploadSection
                title="Bulk Upload Designations"
                module="designation"
                templateEndpoint={null}
                uploadEndpoint={`${baseUrl}/designation/upload/`}
                onUploadSuccess={reload}
                organizationId={userOrganizationId}
                showDivider={true}
              />
            )}

            <SheetCardExtension
              title={`${isEditMode ? "Edit" : "Add"} Designation`}
            >
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
              {/* Hidden field for organization */}
              <input
                type="hidden"
                name="organization"
                value={
                  props.values.organization ||
                  editData?.organization ||
                  userOrganizationId
                }
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
                    console.log("Update button clicked!");
                    e.preventDefault();
                    props.handleSubmit();
                  }}
                >
                  {props.isSubmitting
                    ? "Saving..."
                    : isEditMode
                    ? "Update"
                    : "Add"}
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
