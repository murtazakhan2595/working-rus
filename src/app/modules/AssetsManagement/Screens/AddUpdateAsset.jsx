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
// import { addAsset, updateAsset } from "app/hooks/assets";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { validateAssetFormSchema } from "app/utils/FormSchema/AssetsFormSchema";
import {
  handleCloseWithConfirmation,
  SheetCardExtension,
} from "components/SheetCardExtension";
import { AssetCondition, AssetCategories, Locations } from "data/Data";
import { getDropdownListWithExtraKeys } from "utils/Lists";
import { Attachments } from "app/modules/TaskManagment/Sections";
import { Asset } from "app/utils/Types/Asset";
import moment from "moment";

const AddUpdateAsset = ({
  userProfile,
  reload,
  isOpen,
  setIsOpen,
  assetToEdit = null,
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [initialValues, setInitialValues] = useState(assetToEdit || Asset);
  const formSheetData = {
    triggerText: "Save",
    title: assetToEdit ? "Update Asset" : "Add Asset",
    description: null,
    footer: null,
  };

  useEffect(() => {
    if (assetToEdit) {
      setInitialValues({
        ...Asset,
        ...assetToEdit,
      });
    }
  }, [assetToEdit]);

  const handleFormSubmit = async (values) => {
    const payload = {
      ...values,
      ...{ attachment: values?.attachment?.attachments },
    };

    try {
      let response;
      if (values.id) {
        // response = await updateAsset(payload, values.id);
      } else {
        // response = await addAsset(payload);
      }

      if (response) {
        toast.success(`Asset ${values.id ? "updated" : "added"} successfully`);
        setIsOpen(false);
        reload(); // Reload the page or data
      } else {
        toast.error(`Error ${values.id ? "updating" : "adding"} asset`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
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
                      options={Locations}
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
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" variant="default">
                  {assetToEdit ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
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
