import {
  saveUpdateUserRole,
  getPermissionsSchema,
  checkRoleNameUniqueness,
} from "app/hooks/rolesPermisions";
import { RoleInformation, PermissionTypes } from "./RoleTypes";
import { TextAreaInput, TextInput, FilterInput } from "components/FormControl";
import {
  handleCloseWithConfirmation,
  SheetCardExtension,
} from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import AlertDialogue from "components/ui/AlertDialogue";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PermissionsTree from "./PermissionsTree";
import { useSelector } from "react-redux";

const AddRoleForm = ({ isOpen, setIsOpen, edit, reload }) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  const [permissionsSchema, setPermissionsSchema] = useState([]);
  const [filteredSchema, setFilteredSchema] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formValues, setFormValues] = useState(null);
  const isEditMode = Boolean(edit?.data);
  const ModulesList = useSelector((state) => state.roles_permissions.module);

  // Initialize form data with role values if in edit mode
  const [formData, setFormData] = useState({
    ...RoleInformation,
    ...(edit?.data || {}),
  });

  // Load permissions schema on mount
  useEffect(() => {
    const fetchPermissionsSchema = async () => {
      try {
        const schema = await getPermissionsSchema();
        setPermissionsSchema(schema);
        setFilteredSchema(schema);
      } catch (error) {
        toast.error("Failed to load permissions schema");
        console.error("Error loading permissions schema:", error);
      }
    };

    fetchPermissionsSchema();
  }, []);

  // Update form data when edit data changes
  useEffect(() => {
    setFormData({
      ...RoleInformation,
      ...(edit?.data || {}),
    });
  }, [edit?.data]);

  // Filter schema based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSchema(permissionsSchema);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();

    // Deep copy and filter the schema
    const filtered = permissionsSchema
      .map((module) => {
        // Check if module name matches
        const moduleMatches = module.name
          .toLowerCase()
          .includes(searchTermLower);

        // Filter and map submodules
        const filteredSubmodules =
          module.subModules
            ?.map((subModule) => {
              // Check if submodule name matches
              const subModuleMatches = subModule.name
                .toLowerCase()
                .includes(searchTermLower);

              // Filter features
              const filteredFeatures = subModule.features?.filter((feature) =>
                feature.name.toLowerCase().includes(searchTermLower)
              );

              // Return submodule if it or any of its features match
              return subModuleMatches || filteredFeatures.length > 0
                ? { ...subModule, features: filteredFeatures }
                : null;
            })
            .filter(Boolean) || [];

        // Filter direct module features
        const filteredFeatures =
          module.features?.filter((feature) =>
            feature.name.toLowerCase().includes(searchTermLower)
          ) || [];

        // Return module if it, any of its submodules, or features match
        return moduleMatches ||
          filteredSubmodules.length > 0 ||
          filteredFeatures.length > 0
          ? {
              ...module,
              subModules: filteredSubmodules,
              features: filteredFeatures,
            }
          : null;
      })
      .filter(Boolean);

    setFilteredSchema(filtered);
  }, [searchTerm, permissionsSchema]);

  const handleClose = () => {
    setCloseSheet(true);
  };

  const validateForm = async (values) => {
    const errors = {};

    if (!values.name || values.name.trim() === "") {
      errors.name = "Role Name is required";
    } else if (!isEditMode) {
      // Check uniqueness when adding new role
      try {
        const isUnique = await checkRoleNameUniqueness(values.name);
        if (!isUnique) {
          errors.name =
            "Role Name already exists. Please choose a different name";
        }
      } catch (error) {
        console.error("Failed to check role name uniqueness:", error);
      }
    }

    if (!values.description || values.description.trim() === "") {
      errors.description = "Description is required";
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setFormValues(values);
    setConfirmSave(true);
    setSubmitting(false);
  };

  const confirmSubmit = async () => {
    if (!formValues) return;

    try {
      // Structure the payload
      const payload = {
        name: formValues.name,
        description: formValues.description,
        permissions: formValues.permissions,
      };

      // Save role
      const response = await saveUpdateUserRole(edit?.data?.id, payload);

      if (response) {
        toast.success(
          `Role ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        setIsOpen(false);

        // Ensure table is reloaded
        if (typeof reload === "function") {
          reload();
        }
      }
    } catch (error) {
      // Handle API validation errors
      if (error?.response?.data) {
        const apiErrors = error.response.data;

        const formikErrors = {};
        Object.keys(apiErrors).forEach((key) => {
          formikErrors[key] = Array.isArray(apiErrors[key])
            ? apiErrors[key][0]
            : apiErrors[key];
        });

        // Set errors on form when reopened
        setConfirmSave(false);
      }

      // Show error message
      const errorMessage =
        error?.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "add"} role.`;
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}

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

      <Formik
        initialValues={formData}
        onSubmit={handleSubmit}
        validate={validateForm}
        enableReinitialize
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <SheetCardExtension title={`${isEditMode ? "Edit" : "Add"} Role`}>
              {/* Role Name */}
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

              {/* Description */}
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
                <PermissionsTree
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
      </Formik>
    </>
  );
};

export default AddRoleForm;
