import {
  saveRole,
  getModuleList,
  saveRolePermissions,
} from "app/hooks/rolesPermisions";
import { UserRole } from "app/utils/Types/RolesPermission";
import { TextInput, CheckBoxInputTree } from "components/FormControl";
import { SheetUI } from "components";
import { Button } from "components/ui/button";
import AlertDialogue from "components/ui/AlertDialogue";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Header } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { useNavigate, useParams } from "react-router-dom";

const AddUpdateUserRoleForm = ({ isOpen, setIsOpen, edit, reload }) => {
  const [confirmSave, setConfirmSave] = useState(false);
  const [modulesList, setModulesList] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const [isLoadingModules, setIsLoadingModules] = useState(true);

  const isEditMode = Boolean(edit?.data);
  const navigate = useNavigate();
  const { roleId } = useParams();
  const FormSheetData = {
    triggerText: "Add New Role",
    title: isEditMode ? "Edit Role" : "Add New Role",
    description: null,
    footer: null,
  };

  // Initialize form data with role values if in edit mode
  const [formData, setFormData] = useState({
    ...UserRole,
    permissions: [], // Ensure permissions is always an array
    ...(edit?.data || {}),
  });

  // Load modules list on mount
  useEffect(() => {
    const fetchModules = async () => {
      setIsLoadingModules(true);
      try {
        const response = await getModuleList();
        if (response?.results) {
          setModulesList(response.results);
        }
      } catch (error) {
        toast.error("Failed to load modules");
        console.error("Error loading modules:", error);
      } finally {
        setIsLoadingModules(false);
      }
    };

    fetchModules();
  }, []);

  // Update form data when edit data changes
  useEffect(() => {
    setFormData({
      ...UserRole,
      permissions: [], // Ensure permissions is always an array
      ...(edit?.data || {}),
    });
  }, [edit?.data]);

  const validateForm = async (values) => {
    const errors = {};

    if (!values.name || values.name.trim() === "") {
      errors.name = "Role Name is required";
    }

    if (!values.description || values.description.trim() === "") {
      errors.description = "Description is required";
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log("Form submitted with values:", values);
    setFormValues(values);
    setConfirmSave(true);
  };

  const confirmSubmit = async () => {
    if (!formValues) return;

    try {
      // Step 1: Create or update the role
      const rolePayload = {
        name: formValues.name,
        description: formValues.description,
      };

      const roleResponse = await saveRole(edit?.data?.id, rolePayload);

      if (!roleResponse || !roleResponse.id) {
        throw new Error("Failed to create/update role");
      }

      // Step 2: Save role permissions using the permissions array directly
      if (formValues.permissions && formValues.permissions.length > 0) {
        await saveRolePermissions(roleResponse.id, formValues.permissions);
      }

      toast.success(`Role ${isEditMode ? "Updated" : "Added"} Successfully!`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setIsOpen(false);
      setFormValues(null);
      setConfirmSave(false);
      navigate(-1);
      // Ensure table is reloaded
      if (typeof reload === "function") {
        reload();
      }
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "add"} role.`;
      toast.error(errorMessage);
      console.error("Error in role submission:", error);
    }
  };

  const toggleIsOpen = () => {
    navigate(-1);
  }
  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header />
      <Card>
        <CardContent>
          <SheetUI
            isOpen={isOpen}
            setIsOpen={toggleIsOpen}
            variant=""
            sheetConfig={FormSheetData}
            formConfig={{
              initialValues: formData,
              enableReinitialize: true,
              handleSubmit: handleSubmit,
              validateFormSchema: validateForm,
              submitButtonText: isEditMode ? "Update" : "Submit",
              cancelButtonText: "Cancel",
              columns: 2,
              disableSubmit: isLoadingModules,
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
                    },
                    {
                      InputField: TextInput,
                      name: "description",
                      required: true,
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
                      name: "permissions",
                      colsSpan: 2,
                      options: modulesList,
                      subColumns: 3,
                      searchFeature: true,
                      treeLevels: 3,
                      treeLevelsName: {
                        level_1: "submodules",
                        level_2: "features",
                      },
                      disabled: isLoadingModules,
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
        />
      )}
    </div>
  );
};

export default AddUpdateUserRoleForm;
