import { getDepartmentList } from "app/hooks/general";
import { saveDesignation } from "app/hooks/general";
import { getOrganizationList } from "app/hooks/general";
import { getDesignationById } from "app/hooks/general";
import { DesignationInfo } from "app/utils/Types/Designation";
import { SelectInputComponent } from "components/FormControl";
import { TextAreaInput } from "components/FormControl";
import { TextInput } from "components/FormControl";
import SheetUI from "components/SheetUI";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import BulkUploadSection from "components/BulkUploadSection";

const baseUrl = initialState.baseUrl;

const AddDesignationForm = ({
  id = false,
  isOpen = false,
  setIsOpen = () => {},
  edit,
  reloadData = () => {},
  onUpdateSuccess = null,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(DesignationInfo);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Get user details from Redux store to access organization ID
  const userDetails = useSelector((state) => state.emp?.user_details);
  const userOrganizationId =
    userDetails?.organization_id || userDetails?.organization;

  // Determine if we're in edit mode - handle both structures
  const isEditMode = Boolean(edit?.data) || Boolean(edit?.id) || Boolean(id);

  // Extract the actual data based on the structure provided
  const editData = edit?.data || edit;

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Designation`,
    title: `${isEditMode ? "Edit" : "Add"} Designation`,
    description: null,
    footer: null,
  };

  // Update form data when edit data changes
  useEffect(() => {
    if (editData) {
      console.log("Setting form data from edit:", editData);
      setFormData({
        ...DesignationInfo,
        ...editData,
      });
    }
    
    // If we have an ID but no edit data, fetch the designation data
    if (id && !editData) {
      const fetchDesignationData = async () => {
        try {
          setIsLoading(true);
          const data = await getDesignationById(id);
          if (data) {
            console.log("Fetched designation data:", data);
            setFormData({
              ...DesignationInfo,
              ...data,
            });
          }
        } catch (error) {
          console.error("Error fetching designation data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchDesignationData();
    }
  }, [editData, id]);

  const handleClose = () => {
    setIsOpen(false);
    reloadData(true);
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

  const handleSubmit = async (values) => {
    try {
      setIsSubmittingForm(true);
      
      // Get the ID from the appropriate source
      const designationId = id || editData?.id;

      // Make sure organization is included
      const submitData = {
        ...values,
        organization:
          values.organization || editData?.organization || userOrganizationId,
      };

      const response = await saveDesignation(submitData, designationId);

      if (response) {
        toast.success(
          `Designation ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );

        // Call the update success callback if provided
        if (onUpdateSuccess && typeof onUpdateSuccess === "function") {
          await onUpdateSuccess(submitData);
        }

        handleClose();
      }
    } catch (error) {
      console.error("API call error:", error);
      
      const errorMessage =
        error?.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "add"} designation.`;
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Create customComponent for BulkUpload section (only shown in Add mode)
  const BulkUploadComponent = !isEditMode ? (
    <BulkUploadSection
      title="Bulk Upload Designations"
      module="designation"
      templateEndpoint={null}
      uploadEndpoint={`${baseUrl}/designation/upload/`}
      onUploadSuccess={reloadData}
      organizationId={userOrganizationId}
      showDivider={true}
    />
  ) : null;

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: formData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: validateForm,
        submitButtonText: isEditMode ? "Update" : "Add",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          !isEditMode && {
            customComponent: BulkUploadComponent
          },
          {
            sheetCardExtension: true,
            sheetCardTitle: `${isEditMode ? 'Edit' : 'Add'} Designation`,
            InputFields: [
              {
                InputField: TextInput,
                name: "name",
                label: "Designation",
                required: true,
              },
              {
                InputField: TextAreaInput,
                name: "description",
                label: "Description",
                required: true,
              },
              // Hidden field for organization
              {
                InputField: TextInput,
                name: "organization",
                label: "Organization",
                type: "hidden",
                value: userOrganizationId,
                hidden: true,
              },
            ],
          },
        ].filter(Boolean),
      }}
    />
  );
};

export default AddDesignationForm;
