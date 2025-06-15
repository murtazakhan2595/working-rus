import { useEffect, useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import {
  NumberInput,
  SelectInputComponent,
  TextAreaInput,
  TextInput,
} from "components/FormControl";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  handleCloseWithConfirmation,
  SheetCardExtension,
} from "components/SheetCardExtension";
import { addAssetCategory, deleteAssetCategory } from "app/hooks/assets";
import CategoryView from "./CategoryView";
import { CheckBoxInput } from "components/FormControl";

const AddUpdateAssetCategory = ({
  userProfile,
  reload,
  isOpen,
  setIsOpen,
  categoryToEdit = null,
  viewMode = false,
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicFields, setDynamicFields] = useState([]);
  const [mode, setMode] = useState(
    viewMode && categoryToEdit ? "view" : categoryToEdit ? "edit" : "add"
  );

  // Initial form values
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  const formSheetData = {
    title:
      mode === "view"
        ? "Category Details"
        : mode === "edit"
        ? "Update Category"
        : "Add Category",
    description: null,
    footer: null,
  };

  // Field type options
  const fieldTypeOptions = [
    { value: "text", label: "Text" },
    { value: "textarea", label: "Textarea" },
    { value: "select", label: "Select" },
    { value: "number", label: "Number" },
    { value: "date", label: "Date" },
    { value: "checkbox", label: "Checkbox" },
  ];

  useEffect(() => {
    if (categoryToEdit) {
      console.log("categoryToEdit", categoryToEdit);

      setInitialValues({
        name: categoryToEdit.name || "",
        description: categoryToEdit.description || "",
        is_active:
          categoryToEdit.is_active !== undefined
            ? categoryToEdit.is_active
            : true,
      });

      // Set existing dynamic fields
      setDynamicFields(categoryToEdit.dynamic_fields || []);
    } else {
      // Reset for new category
      setInitialValues({
        name: "",
        description: "",
        is_active: true,
      });
      setDynamicFields([]);
    }
  }, [categoryToEdit]);

  // Add new dynamic field
  const addDynamicField = () => {
    const newField = {
      field_name: "",
      field_type: "text",
      is_required: false,
      placeholder: "",
      field_options: [],
      validation_rules: {},
      display_order: dynamicFields.length + 1,
    };
    setDynamicFields([...dynamicFields, newField]);
  };

  // Remove dynamic field
  const removeDynamicField = (index) => {
    const updatedFields = dynamicFields.filter((_, i) => i !== index);
    setDynamicFields(updatedFields);
  };

  // Update dynamic field
  const updateDynamicField = (index, field, value) => {
    const updatedFields = [...dynamicFields];

    if (field === "field_options" && typeof value === "string") {
      // Parse comma-separated options
      updatedFields[index][field] = value
        .split(",")
        .map((option) => option.trim())
        .filter(Boolean);
    } else {
      updatedFields[index][field] = value;
    }

    setDynamicFields(updatedFields);
  };

  // Validate form including dynamic fields
  const validateForm = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Category name is required";
    }

    // Validate dynamic fields
    dynamicFields.forEach((field, index) => {
      if (!field.field_name) {
        errors[`dynamic_field_${index}_name`] = "Field name is required";
      }
    });

    return errors;
  };

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      const payload = {
        name: values.name,
        description: values.description,
        is_active: values.is_active,
        dynamic_fields: dynamicFields,
      };
    
      if (categoryToEdit?.id) {
        payload.id = categoryToEdit.id;
      }
      console.log("payload", payload);
      const response = await addAssetCategory(payload);

      if (response) {
        toast.success(
          `Category ${categoryToEdit?.id ? "updated" : "created"} successfully`
        );
        setIsOpen(false);
        reload();
      } else {
        toast.error(
          `Error ${categoryToEdit?.id ? "updating" : "creating"} category`
        );
      }
    } catch (error) {
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!categoryToEdit?.id) {
        toast.error("Cannot delete: Category ID is missing");
        return;
      }

      const success = await deleteAssetCategory(categoryToEdit.id);

      if (success) {
        toast.success("Category deleted successfully");
        setIsOpen(false);
        reload();
      } else {
        toast.error("Error deleting category");
      }
    } catch (error) {
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    }
  };

  const handleEdit = () => {
    setMode("edit");
  };

  const handleClose = () => {
    setCloseSheet(true);
  };

  return (
    <div>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}
      <SheetComponent
        {...formSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        width="700px"
        setIsOpen={setIsOpen}
      >
        {mode === "view" ? (
          <CategoryView
            categoryData={categoryToEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={() => setIsOpen(false)}
          />
        ) : (
          <Formik
            initialValues={initialValues}
            validate={validateForm}
            enableReinitialize={true}
            onSubmit={handleFormSubmit}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                <SheetCardExtension title="Category Details">
                  <TextInput
                    name="name"
                    error={props.errors?.name}
                    touch={props.touched?.name}
                    value={props.values?.name}
                    label="Category Name"
                    required={true}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    placeholder="Enter category name"
                  />

                  <TextAreaInput
                    name="description"
                    error={props.errors?.description}
                    touch={props.touched?.description}
                    value={props.values?.description}
                    label="Description"
                    required={false}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    maxRows={3}
                    placeholder="Enter category description (optional)"
                  />

                  <CheckBoxInput
                    name="is_active"
                    error={props.errors?.is_active}
                    touch={props.touched?.is_active}
                    value={props.values?.is_active}
                    label="Active"
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    className="mt-4"
                  />
                </SheetCardExtension>

                <SheetCardExtension title="Dynamic Fields">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Define custom fields for this category. Assets in this
                        category will have these fields.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addDynamicField}
                      >
                        Add Field
                      </Button>
                    </div>

                    {dynamicFields.map((field, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium">
                            Field {index + 1}
                          </span>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeDynamicField(index)}
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <TextInput
                            name={`dynamic_field_${index}_name`}
                            value={field.field_name}
                            label="Field Name"
                            required={true}
                            placeholder="e.g., Model & Specifications"
                            onChange={(_, value) =>
                              updateDynamicField(index, "field_name", value)
                            }
                            error={
                              props.errors?.[`dynamic_field_${index}_name`]
                            }
                          />

                          <SelectInputComponent
                            name={`dynamic_field_${index}_type`}
                            value={field.field_type}
                            label="Field Type"
                            required={true}
                            options={fieldTypeOptions}
                            onChange={(_, value) =>
                              updateDynamicField(index, "field_type", value)
                            }
                          />

                          <TextInput
                            name={`dynamic_field_${index}_placeholder`}
                            value={field.placeholder}
                            label="Placeholder"
                            required={false}
                            placeholder="Enter placeholder text"
                            onChange={(_, value) =>
                              updateDynamicField(index, "placeholder", value)
                            }
                          />

                          <CheckBoxInput
                            name={`dynamic_field_${index}_required`}
                            value={field.is_required}
                            label="Required Field"
                            onChange={(_, value) =>
                              updateDynamicField(index, "is_required", value)
                            }
                          />
                        </div>

                        {field.field_type === "select" && (
                          <div className="mt-4">
                            <TextInput
                              name={`dynamic_field_${index}_options`}
                              value={field.field_options?.join(", ") || ""}
                              label="Options (comma-separated)"
                              required={false}
                              placeholder="e.g., Small, Medium, Large"
                              onChange={(_, value) =>
                                updateDynamicField(
                                  index,
                                  "field_options",
                                  value
                                )
                              }
                            />
                          </div>
                        )}

                        {field.field_type === "number" && (
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            <NumberInput
                              name={`dynamic_field_${index}_min`}
                              value={field.validation_rules?.min || ""}
                              label="Minimum Value"
                              required={false}
                              placeholder="Enter minimum value"
                              onChange={(_, value) => {
                                const rules = { ...field.validation_rules };
                                if (value) rules.min = parseInt(value);
                                else delete rules.min;
                                updateDynamicField(
                                  index,
                                  "validation_rules",
                                  rules
                                );
                              }}
                            />

                            <NumberInput
                              name={`dynamic_field_${index}_max`}
                              value={field.validation_rules?.max || ""}
                              label="Maximum Value"
                              required={false}
                              placeholder="Enter maximum value"
                              onChange={(_, value) => {
                                const rules = { ...field.validation_rules };
                                if (value) rules.max = parseInt(value);
                                else delete rules.max;
                                updateDynamicField(
                                  index,
                                  "validation_rules",
                                  rules
                                );
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    {dynamicFields.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No fields defined yet. Click "Add Field" to get started.
                      </div>
                    )}
                  </div>
                </SheetCardExtension>

                <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
                  <Button
                    variant="outline"
                    type="button"
                    size="lg"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    variant="default"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : mode === "edit"
                      ? "Update"
                      : "Create"}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        )}
      </SheetComponent>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(AddUpdateAssetCategory);
