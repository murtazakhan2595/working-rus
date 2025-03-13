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
import { addAsset, getLocations, deleteAsset } from "app/hooks/assets";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { validateAssetFormSchema } from "app/utils/FormSchema/AssetsFormSchema";
import {
  handleCloseWithConfirmation,
  SheetCardExtension,
} from "components/SheetCardExtension";
import { AssetCondition, AssetCategories } from "data/Data";
import { Attachments } from "app/modules/TaskManagment/Sections";
import { Asset } from "app/utils/Types/Asset";
import AssetView from "./AssetView";

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
  const [mode, setMode] = useState(
    viewMode && assetToEdit ? "view" : assetToEdit ? "edit" : "add"
  );

  const formSheetData = {
    triggerText: "Save",
    title:
      mode === "view"
        ? "Asset Details"
        : mode === "edit"
        ? "Update Asset"
        : "Add Asset",
    description: null,
    footer: null,
  };

  // Fetch locations when component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsData = await getLocations();
        if (locationsData && locationsData.length > 0) {
          setLocations(locationsData);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast.error("Failed to load locations");
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (assetToEdit) {
      // Map API data to form fields when editing an asset
      setInitialValues({
        ...Asset,
        id: assetToEdit.id,
        asset_name: assetToEdit.asset_name,
        category: assetToEdit.asset_type,
        specifications:
          assetToEdit.asset_description || assetToEdit.asset_model,
        serial_number: assetToEdit.asset_serial_number,
        purchase_date: assetToEdit.asset_purchase_date,
        purchase_cost: assetToEdit.asset_purchase_price,
        notes: assetToEdit.asset_notes,
        warranty_expiry:
          assetToEdit.asset_warranty === "Yes"
            ? assetToEdit.asset_warranty_expiry
            : null,
        condition: assetToEdit.asset_initial_condition,
        location: assetToEdit.asset_location,
        // Format attachments as expected by the component
        attachment: Array.isArray(assetToEdit.attachment)
          ? assetToEdit.attachment.map((id) => ({
              id,
              name: `Attachment ${id}`,
            }))
          : [],
      });
    } else {
      // Reset to default values when adding a new asset
      setInitialValues(Asset);
    }
  }, [assetToEdit]);

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      // Add the ID to the values if we are updating
      const payload = {
        ...values,
        id: assetToEdit?.id, // Include ID for update operations
      };

      const response = await addAsset(payload);

      if (response) {
        toast.success(`Asset ${values.id ? "updated" : "added"} successfully`);
        setIsOpen(false);
        reload(); // Reload the assets list
      } else {
        toast.error(`Error ${values.id ? "updating" : "adding"} asset`);
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
            validate={validateAssetFormSchema}
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
                        options={AssetCategories}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
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

                  <TextInput
                    name={"specifications"}
                    error={props.errors?.specifications}
                    touch={props.touched?.specifications}
                    value={props.values?.specifications}
                    label={"Model & Specifications"}
                    required={true}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    placeholder="Enter model & specifications"
                  />

                  <TextInput
                    name={"serial_number"}
                    error={props.errors?.serial_number}
                    touch={props.touched?.serial_number}
                    value={props.values?.serial_number}
                    label={"Serial Number/IMEI"}
                    required={true}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    placeholder="Enter serial number or IMEI"
                  />
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
                      // The Attachments component should handle both existing and new files
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
