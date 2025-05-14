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
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
// import PermissionsTree from "./PermissionsTree";
import { useSelector } from "react-redux";
import { SheetUI } from "components";
import { Header } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";

const AddUpdateUserRoleForm = ({ isOpen, edit, reload }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { GOTO_URLS, id } = location.state || {};
  const [confirmSave, setConfirmSave] = useState(false);
  const [formValues, setFormValues] = useState(null);
  const [UserRoles, setUserRoles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [RoleNameExist, setRoleNameExist] = useState(false);
  const isEditMode = Boolean(edit?.data);
  const ModulesList = useSelector((state) => state.roles_permissions.modules);

  const FormSheetData = {
    triggerText: "Add New Role",
    title: "Add New Role",
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

  const fetchData = async (isMounted) => {
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
    fetchData(isMounted);
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
      navigate(`/office-settings/role-managment`);
    }
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setFormValues(values);
    setConfirmSave(true);
    //   setSubmitting(false);
  };

  const confirmSubmit = async () => {
    debugger;
    if (!formValues) return;
    try {
      // Save role
      const response = await saveUpdateUserRole(formValues, edit?.data?.id);
      if (response) {
        toast.success(
          `User Role ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        if (response.id) {
          saveUpdateUserRolePermission(
            { ...formValues, role: response.id },
            edit?.data?.id
          );
        }
        // Ensure table is reloaded
        handleClose();
      }
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.response?.data?.message ||
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
  // console.log(UserRoles,RoleNameExist, "Selected LEave Ids");

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header />
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
                      required: true,
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
                      options: ModulesList,
                      searchFeature: true,
                      treeLevels: 3,
                      treeLevelsName: {
                        level_1: "submodules",
                        level_2: "features",
                      },
                    },
                  ],
                },
              ],
            }}
          ></SheetUI>
        </CardContent>
      </Card>

      {confirmSave && (
        <AlertDialogue
          title="Confirm Create Role"
          description="Are you sure you want to create this role with the selected permissions?"
          isOpen={confirmSave}
          setIsOpen={setConfirmSave}
          handleContinue={() => {
            confirmSubmit();
            setConfirmSave(false);
          }}
        />
      )}

      {/* <Formik
        initialValues={formData}
        onSubmit={handleSubmit}
        validate={validateForm}
        enableReinitialize
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <SheetCardExtension title={`${isEditMode ? "Edit" : "Add"} Role`}>
              {/* Role Name 
              <TextInput
                name="name"
                label="Role Name"
                required
                error={props.errors.name}
                touch={props.touched.name}
                value={props.values.name}
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
              />

              {/* Description 
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
              />
            </SheetCardExtension>

            <SheetCardExtension title="Permissions">
              <div className="mb-4">
                <FilterInput
                  filters={[
                    {
                      type: "search",
                      placeholder: "Search modules, features...",
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

              <div className="max-h-[auto] overflow-y-auto">
                {/* <PermissionsTree
                  schema={filteredSchema}
                  selectedPermissions={props.values.permissions}
                  onChange={(permissions) => {
                    props.setFieldValue("permissions", permissions);
                  }}
                  permissionTypes={Object.values(PermissionTypes)}
                  searchTerm={searchTerm}
                /> 
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
                  disabled={props.isSubmitting || !props.isValid}
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
      </Formik> */}
    </div>
  );
};

export default AddUpdateUserRoleForm;
