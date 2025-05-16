import {
  saveUpdateUserRole,
  getUserRoleList,
  saveUpdateUserRolePermission,
  getUserRoleData,
} from "app/hooks/rolesPermisions";
import { UserRole } from "app/utils/Types/RolesPermission";
import {
  TextAreaInput,
  TextInput,
  FilterInput,
  CheckBoxInputTree,
} from "components/FormControl";
import { validateUserRoleFormSchema } from "app/utils/FormSchema/RolePermissionsFormSchema";
import { Button } from "components/ui/button";
import AlertDialogue from "components/ui/AlertDialogue";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Header, SheetUI } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const AddUpdateUserRoleForm = ({ isOpen = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { GOTO_URLS, id } = location.state || {};
  const [confirmSave, setConfirmSave] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [UserRoles, setUserRoles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [RoleNameExist, setRoleNameExist] = useState(false);
  const isEditMode = Boolean(id);
  const ModulesList = useSelector((state) => state.roles_permissions.modules);
  const ModuleTree = React.useMemo(() => {
    if (!Array.isArray(ModulesList)) return [];

    return ModulesList.map((module) => ({
      id: module.id,
      name: module.name,
      code_name: module.code_name,
      childrens: (module.submodules || []).map((submodule) => ({
        id: submodule.id,
        name: submodule.name,
        code_name: submodule.code_name,
        childrens: (submodule.features || []).map((feature) => ({
          ...feature,
        })),
      })),
    }));
  }, [ModulesList]);
  const FormSheetData = {
    triggerText: "",
    title: isEditMode ? "Edit Role" : "Add New Role",
    description: null,
    footer: null,
  };
  // Initialize form data with role values if in edit mode
  const [formData, setFormData] = useState(UserRole);

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
      // Add organizationId to filter if available
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

  const handleClose = () => {
    if (GOTO_URLS)
      navigate(GOTO_URLS, {
        state: {
          // activeView: activeView,
          // projectId: taskProjectId,
        },
      });
    else {
      navigate(`/office-settings/role-permission`);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setFormValues(values);
    setConfirmSave(true);
    //   setSubmitting(false);
  };

  const confirmSubmit = async () => {
    if (!formValues) return;
    try {
      // Save role
      const response = await saveUpdateUserRole(formValues, id);
      if (response) {
        toast.success(
          `User Role ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        if (response.id) {
          await saveUpdateUserRolePermission(
            { ...formValues, role: response.id },
            formData.role_permission_id
          );
        }
        // Ensure table is reloaded
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
    }
  };

  const validateUserRoleName = (role_name) => {
    const user_role_name = UserRoles.filter(
      (role) =>
        role.name.toLowerCase() === role_name.toLowerCase() &&
        parseInt(role.id) !== parseInt(id)
    );
    if (user_role_name && user_role_name.length > 0) {
      setRoleNameExist(true);
    } else {
      setRoleNameExist(false);
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        showBackButton={true}
        navigationLink={GOTO_URLS || "/office-settings/role-permission"}
      />
      <Card>
        <CardContent>
          <SheetUI
            isOpen={isOpen}
            setIsOpen={handleClose}
            variant=""
            sheetConfig={FormSheetData}
            formConfig={{
              initialValues: formData,
              enableReinitialize: true,
              handleSubmit: handleSubmit,
              validateFormSchema: (values) => {
                const errors = validateUserRoleFormSchema(values);
                if (values.name && RoleNameExist)
                  errors.name =
                    "Role Name already exists. Please choose a different name";
                return errors;
              },
              submitButtonText: "Submit",
              cancelButtonText: "Cancel",
              columns: 3,
              //renderUpdatedFormValues: setFormValues,
              disableSubmit: isLoading,
              formFiels: [
                {
                  sheetCardExtension: true,
                  sheetCardTitle: `Role Details`,
                  InputFields: [
                    {
                      InputField: TextInput,
                      name: "name",
                      required: true,
                      label: "Role Name",
                      onFieldUpdate: (_, value) => {
                        validateUserRoleName(value);
                      },
                    },
                    {
                      InputField: TextAreaInput,
                      name: "description",
                      colsSpan: 3,
                      rows: 2,
                      label: "Description",
                    },
                  ],
                },
                {
                  sheetCardExtension: true,
                  sheetCardTitle: `Role Permissions`,
                  InputFields: [
                    {
                      InputField: CheckBoxInputTree,
                      name: "feature_ids",
                      colsSpan: 3,
                      options: ModuleTree,
                      searchFeature: true,
                      treeLevels: 3,
                      treeLevelsName: {
                        level_1: "submodules",
                        level_2: "features",
                      },
                      disabled: isLoading,
                    },
                  ],
                },
              ],
            }}
          />
        </CardContent>
      </Card>

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
    </div>
  );
};

export default AddUpdateUserRoleForm;
