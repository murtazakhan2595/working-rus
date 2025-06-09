import {
  saveUpdateUserRole,
  getUserRoleList,
  saveUpdateUserRolePermission,
  getUserRoleData,
} from "app/hooks/rolesPermisions";
import { PublicHoliday } from "app/utils/Types/LeaveManagment";
import {
  SelectInputComponent,
  TextInput,
  FilterInput,
  DateInput,
} from "components/FormControl";
import { validateUserRoleFormSchema } from "app/utils/FormSchema/RolePermissionsFormSchema";
import AlertDialogue from "components/ui/AlertDialogue";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Header, SheetUI } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { GetDispatchStateList } from "utils/Lists";

const AddUpdateHolidays = ({ isOpen = true, id }) => {
  const Branches = GetDispatchStateList("branches", "common") || [];
  const navigate = useNavigate();
  const [confirmSave, setConfirmSave] = useState(false);
  const [formValues, setFormValues] = useState(PublicHoliday);
  const [UserRoles, setUserRoles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [RoleNameExist, setRoleNameExist] = useState(false);
  const isEditMode = Boolean(id);
  const ModuleTree = useSelector((state) => state.roles_permissions.modules);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const FormSheetData = {
    triggerText: "",
    title: isEditMode ? "Edit Holidays" : "Add New Holidays",
    description: null,
    footer: null,
  };
  // Initialize form data with role values if in edit mode
  const [formData, setFormData] = useState(PublicHoliday);

  const fetchUserRolesData = async (isMounted) => {
    try {
      setIsLoading(true);
      // Add organizationId to filter if available
      const response = await getUserRoleList();

      if (isMounted) {
        setUserRoles(
          response.results?.map((item) => {
            return { name: item.name, id: item.id };
          })
        );
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchUserRolesData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchData = async (isMounted, id) => {
    try {
      setIsLoading(true);
      const response = await getUserRoleData(id);
      if (isMounted) {
        setFormData(response);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) fetchData(isMounted, id);
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleClose = () => {};

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    if (!values?.feature_ids)
      return toast.error("Please select at least one permission", {
        position: toast.POSITION.TOP_RIGHT,
      });
    setFormValues(values);
    setConfirmSave(true);
  };

  const confirmSubmit = async () => {
    if (!formValues) return;
    setIsSubmittingForm(true);
    try {
      // Save role
      const response = await saveUpdateUserRole(formValues, id);
      if (response) {
        if (response.id) {
          await saveUpdateUserRolePermission(
            { ...formValues, role: response.id },
            formData.role_permission_id
          );
        }
        // Ensure table is reloaded
        toast.success(
          `User Role ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        handleClose();
      }
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "add"} role.`;
      toast.error(errorMessage);
    } finally {
      setConfirmSave(false);
      setIsSubmittingForm(false);
    }
  };

  const validateUserRoleName = useCallback(
    (role_name) => {
      if (!role_name) return false;

      const user_role_name = UserRoles.filter(
        (role) =>
          role.name.toLowerCase() === role_name.trim().toLowerCase() &&
          parseInt(role.id) !== parseInt(id)
      );

      setRoleNameExist(user_role_name.length > 0);
    },
    [UserRoles, id] // dependencies
  );

  return (
    <>
      <SheetUI
        isOpen={isOpen}
        setIsOpen={handleClose}
        variant="sheet"
        sheetConfig={FormSheetData}
        formConfig={{
          initialValues: formData,
          enableReinitialize: true,
          handleSubmit: handleSubmit,
          onSubmitClick: (values) => {
            validateUserRoleName(values.name);
          },
          validateFormSchema: (values) => {
            const errors = validateUserRoleFormSchema(values);
            if (values.name && RoleNameExist)
              errors.name =
                "Role Name already exists. Please choose a different name";
            return errors;
          },
          submitButtonText: "Submit",
          cancelButtonText: "Cancel",
          columns: 2,
          disableSubmit: isLoading || isSubmittingForm,
          loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
          formFiels: [
            {
              sheetCardExtension: true,
              sheetCardTitle: `Holiday Details`,
              InputFields: [
                {
                  InputField: TextInput,
                  name: "name",
                  required: true,
                  label: "Holiday Name",
                  onFieldUpdate: (_, value) => {
                    validateUserRoleName(value);
                  },
                },
                {
                  InputField: DateInput,
                  name: "date",
                  required: true,
                  label: "Start Date",
                },
                {
                  InputField: DateInput,
                  name: "end_date",
                  required: true,
                  label: "End Date",
                },
                {
                  InputField: SelectInputComponent,
                  name: "branches",
                  required: true,
                  label: "Branches",
                  options: Branches,
                },
                {
                  InputField: SelectInputComponent,
                  name: "country",
                  required: true,
                  label: "Country",
                  options: [],
                },
                {
                  InputField: TextInput,
                  name: "religion",
                  required: true,
                  label: "Religion",
                },
              ],
            },
          ],
        }}
      />
      {confirmSave && (
        <AlertDialogue
          title={`Confirm ${isEditMode ? "Update" : "Create"} Role`}
          description={`Are you sure you want to ${
            isEditMode ? "update" : "create"
          } this role with the selected permissions?`}
          isOpen={confirmSave}
          setIsOpen={setConfirmSave}
          handleContinue={() => {
            confirmSubmit();
            setConfirmSave(false);
          }}
          buttonType="default"
          className="text-neutral-1200"
        />
      )}
    </>
  );
};

export default AddUpdateHolidays;
