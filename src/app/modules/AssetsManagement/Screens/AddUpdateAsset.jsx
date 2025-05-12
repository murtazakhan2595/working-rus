import { useEffect, useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import {
  NumberInput,
  SelectInputComponent,
  TextAreaInput,
  DateInput,
  TextInput,
} from "components/FormControl";
import {
  addAsset,
  getLocations,
  deleteAsset,
  getAssetCategories,
} from "app/hooks/assets";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { validateAssetFormSchema } from "app/utils/FormSchema/AssetsFormSchema";
import {
  handleCloseWithConfirmation,
  SheetCardExtension,
} from "components/SheetCardExtension";
import { AssetCondition } from "data/Data";
import { Attachments } from "app/modules/TaskManagment/Sections";
import { Asset } from "app/utils/Types/Asset";
import AssetView from "./AssetView";
import { uploadAttachment } from "app/hooks/assets";

const AddUpdateAsset = ({
  userProfile,
  reload,
  isOpen,
  setIsOpen,
  assetToEdit = null,
  viewMode = false,
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [initialValues, setInitialValues] = useState(assetToEdit || Asset);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]); // NEW: Categories state
  const [selectedCategory, setSelectedCategory] = useState(null); // NEW: Selected category
  const [mode, setMode] = useState(
    viewMode && assetToEdit ? "view" : assetToEdit ? "edit" : "add"
  );

  const formSheetData = {
    title:
      mode === "view"
        ? "Asset Details"
        : mode === "edit"
        ? "Update Asset"
        : "Add Asset",
    description: null,
    footer: null,
  };

  // Fetch locations and categories when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch locations
        const locationsData = await getLocations();
        if (locationsData && locationsData.length > 0) {
          setLocations(locationsData);
        }

        // NEW: Fetch categories
        const categoriesResponse = await getAssetCategories({
          options: { page: 1, sizePerPage: 100 },
          filterData: { is_active: true },
        });

        if (categoriesResponse?.results) {
          const formattedCategories = categoriesResponse.results.map(
            (category) => ({
              value: category.id,
              label: category.name,
              dynamic_fields: category.dynamic_fields,
            })
          );
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load required data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (assetToEdit) {
      console.log("assetToEdit", assetToEdit);

      let processedAttachments = [];

      // Process attachments array if it exists
      if (assetToEdit.attachments && Array.isArray(assetToEdit.attachments)) {
        processedAttachments = assetToEdit.attachments
          .filter((att) => att.attachment)
          .map((att) => ({
            id: att.id,
            name: att.attachment
              ? att.attachment.split("/").pop()
              : `Attachment ${att.id}`,
            attachment: att.attachment,
          }));
      }

      // Extract dynamic field values
      const dynamicFieldValues = assetToEdit.dynamic_field_values || {};

      // NEW: Map API data to form fields with dynamic values
      const newInitialValues = {
        ...Asset,
        id: assetToEdit.id,
        asset_name: assetToEdit.asset_name,
        category: assetToEdit.category_id, // Changed from asset_type
        purchase_date: assetToEdit.asset_purchase_date,
        purchase_cost: assetToEdit.asset_purchase_price,
        notes: assetToEdit.asset_notes,
        warranty_expiry:
          assetToEdit.asset_warranty === "Yes"
            ? assetToEdit.asset_warranty_expiry
            : null,
        condition: assetToEdit.asset_initial_condition,
        location: assetToEdit.asset_location,
        attachment: processedAttachments,
      };

      // NEW: Add dynamic field values to initial values
      Object.entries(dynamicFieldValues).forEach(([key, value]) => {
        newInitialValues[`dynamic_${key}`] = value;
      });

      setInitialValues(newInitialValues);

      // NEW: Set selected category for editing
      if (assetToEdit.category_id) {
        const category = categories.find(
          (cat) => cat.value === assetToEdit.category_id
        );
        setSelectedCategory(category);
      }
    } else {
      // Reset to default values when adding a new asset
      setInitialValues(Asset);
      setSelectedCategory(null);
    }
  }, [assetToEdit, categories]);

  // NEW: Handle category change
  const handleCategoryChange = (categoryId, setFieldValue) => {
    const category = categories.find((cat) => cat.value === categoryId);
    setSelectedCategory(category);

    // Clear dynamic field values when category changes
    if (category?.dynamic_fields) {
      category.dynamic_fields.forEach((field) => {
        setFieldValue(`dynamic_${field.field_name}`, "");
      });
    }
  };

  // NEW: Render dynamic fields based on selected category
  const renderDynamicFields = (props) => {
    if (!selectedCategory?.dynamic_fields) return null;

    return selectedCategory.dynamic_fields.map((field, index) => {
      const fieldName = `dynamic_${field.field_name}`;

      switch (field.field_type) {
        case "text":
          return (
            <TextInput
              key={index}
              name={fieldName}
              error={props.errors?.[fieldName]}
              touch={props.touched?.[fieldName]}
              value={props.values?.[fieldName] || ""}
              label={field.field_name}
              required={field.is_required}
              placeholder={field.placeholder || `Enter ${field.field_name}`}
              onChange={(field, value) => {
                props.handleChange(field)(value);
              }}
            />
          );
        case "textarea":
          return (
            <TextAreaInput
              key={index}
              name={fieldName}
              error={props.errors?.[fieldName]}
              touch={props.touched?.[fieldName]}
              value={props.values?.[fieldName] || ""}
              label={field.field_name}
              required={field.is_required}
              placeholder={field.placeholder || `Enter ${field.field_name}`}
              onChange={(field, value) => {
                props.handleChange(field)(value);
              }}
              maxRows={3}
            />
          );
        case "select":
          return (
            <SelectInputComponent
              key={index}
              name={fieldName}
              error={props.errors?.[fieldName]}
              touch={props.touched?.[fieldName]}
              value={props.values?.[fieldName]}
              label={field.field_name}
              required={field.is_required}
              options={
                field.field_options?.map((opt) => ({
                  value: opt,
                  label: opt,
                })) || []
              }
              onChange={(field, value) => {
                props.setFieldValue(field, value);
              }}
              placeholder={`Select ${field.field_name}`}
            />
          );
        case "number":
          return (
            <NumberInput
              key={index}
              name={fieldName}
              error={props.errors?.[fieldName]}
              touch={props.touched?.[fieldName]}
              value={props.values?.[fieldName] || ""}
              label={field.field_name}
              required={field.is_required}
              placeholder={field.placeholder || `Enter ${field.field_name}`}
              onChange={(field, value) => {
                props.handleChange(field)(value);
              }}
              min={field.validation_rules?.min}
              max={field.validation_rules?.max}
            />
          );
        case "date":
          return (
            <DateInput
              key={index}
              name={fieldName}
              error={props.errors?.[fieldName]}
              touch={props.touched?.[fieldName]}
              value={props.values?.[fieldName]}
              label={field.field_name}
              required={field.is_required}
              placeholder={`Select ${field.field_name}`}
              onChange={(field, value) => {
                props.setFieldValue(field, value);
              }}
            />
          );
        default:
          return null;
      }
    });
  };

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      // NEW: Collect dynamic field values
      const dynamicFieldValues = {};

      if (selectedCategory?.dynamic_fields) {
        selectedCategory.dynamic_fields.forEach((field) => {
          const fieldName = `dynamic_${field.field_name}`;
          if (values[fieldName] !== undefined) {
            dynamicFieldValues[field.field_name] = values[fieldName];
          }
        });
      }

      // Handle attachments (existing logic remains the same)
      let attachmentIds = [];
      if (values.attachment && Array.isArray(values.attachment)) {
        attachmentIds = values.attachment
          .filter((att) => att && att.id)
          .map((att) => att.id);
      }

      // Handle new files
      const newFiles = [];
      if (Array.isArray(values.attachment)) {
        values.attachment.forEach((item) => {
          if (item instanceof File) {
            newFiles.push(item);
          } else if (item && item.attachment instanceof File) {
            newFiles.push(item.attachment);
          }
        });
      }

      // Upload any new files
      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map((file) => uploadAttachment(file));
        const newIds = await Promise.all(uploadPromises);
        attachmentIds = [...attachmentIds, ...newIds];
      }

      // NEW: Prepare payload with new structure
      const payload = {
        asset_name: values.asset_name,
        category_id: values.category, // Changed from asset_type
        asset_purchase_date: values.purchase_date,
        asset_purchase_price: values.purchase_cost,
        asset_notes: values.notes,
        asset_warranty: values.warranty_expiry ? "Yes" : "No",
        asset_warranty_expiry: values.warranty_expiry || null,
        asset_initial_condition: values.condition,
        asset_location: values.location?.value || values.location,
        attachment: attachmentIds,
        dynamic_field_values: dynamicFieldValues, // NEW: Add dynamic field values
      };

      if (assetToEdit?.id) {
        payload.id = assetToEdit.id;
      }

      const response = await addAsset(payload);

      if (response) {
        toast.success(
          `Asset ${assetToEdit?.id ? "updated" : "added"} successfully`
        );
        setIsOpen(false);
        reload();
      } else {
        toast.error(`Error ${assetToEdit?.id ? "updating" : "adding"} asset`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!assetToEdit?.id) {
        toast.error("Cannot delete: Asset ID is missing");
        return;
      }

      const success = await deleteAsset(assetToEdit.id);

      if (success) {
        toast.success("Asset deleted successfully");
        setIsOpen(false);
        reload();
      } else {
        toast.error("Error deleting asset");
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
        width="568px"
        setIsOpen={setIsOpen}
      >
        {mode === "view" ? (
          <AssetView
            assetData={assetToEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onClose={() => setIsOpen(false)}
          />
        ) : (
          <Formik
            initialValues={initialValues}
            validate={(values) =>
              validateAssetFormSchema(values, selectedCategory)
            }
            enableReinitialize={true}
            onSubmit={handleFormSubmit}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                <SheetCardExtension title="Asset Details">
                  <TextInput
                    name={"asset_name"}
                    error={props.errors?.asset_name}
                    touch={props.touched?.asset_name}
                    value={props.values?.asset_name}
                    label={"Asset Name"}
                    required={true}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    placeholder="Enter asset name"
                  />

                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <SelectInputComponent
                        name={"category"}
                        error={props.errors?.category}
                        touch={props.touched?.category}
                        value={props.values?.category}
                        label={"Asset Category"}
                        required={true}
                        options={categories} // Changed from AssetCategories
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                          handleCategoryChange(value, props.setFieldValue); // NEW: Handle category change
                        }}
                        placeholder="Select category"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <SelectInputComponent
                        name={"location"}
                        error={props.errors?.location}
                        touch={props.touched?.location}
                        value={props.values?.location}
                        label={"Location"}
                        required={true}
                        options={locations}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                        placeholder="Select location"
                      />
                    </div>
                  </div>

                  {/* NEW: Render dynamic fields based on selected category */}
                  {renderDynamicFields(props)}
                </SheetCardExtension>

                <SheetCardExtension title="Purchase Information">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <DateInput
                        name={"purchase_date"}
                        error={props.errors?.purchase_date}
                        touch={props.touched?.purchase_date}
                        value={props.values?.purchase_date}
                        label={"Purchase Date"}
                        required={true}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                        placeholder="Select purchase date"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <DateInput
                        name={"warranty_expiry"}
                        error={props.errors?.warranty_expiry}
                        touch={props.touched?.warranty_expiry}
                        value={props.values?.warranty_expiry}
                        label={"Warranty Expiry"}
                        required={false}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                        placeholder="Select warranty expiry date"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <NumberInput
                        name={"purchase_cost"}
                        error={props.errors?.purchase_cost}
                        touch={props.touched?.purchase_cost}
                        value={props.values?.purchase_cost}
                        onChange={(field, value) => {
                          props.handleChange(field)(value);
                        }}
                        placeholder="Enter purchase cost"
                        label="Purchase Cost"
                        required={true}
                        min={1}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <SelectInputComponent
                        name={"condition"}
                        error={props.errors?.condition}
                        touch={props.touched?.condition}
                        value={props.values?.condition}
                        label={"Initial Condition"}
                        required={true}
                        options={AssetCondition}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                        placeholder="Select condition"
                      />
                    </div>
                  </div>

                  <TextAreaInput
                    name={"notes"}
                    error={props.errors?.notes}
                    touch={props.touched?.notes}
                    value={props.values?.notes}
                    label={"Remarks/Notes"}
                    required={false}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    maxRows={3}
                    placeholder="Add any additional notes about the asset"
                  />

                  <Attachments
                    attachmentSelected={props.values.attachment || []}
                    onChange={async (attachment) => {
                      console.log("changing attachment", attachment);
                      props.setFieldValue("attachment", attachment);
                    }}
                    acceptedFileTypes=".pdf,.png,.jpg,.jpeg"
                    error={props.errors.attachment}
                    touch={props.touched.attachment}
                  />
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
                      : "Save"}
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

export default connect(mapStateToProps)(AddUpdateAsset);
