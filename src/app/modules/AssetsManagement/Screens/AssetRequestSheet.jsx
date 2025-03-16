import { useState, useEffect } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import { TextAreaInput, SelectInputComponent } from "components/FormControl";
import { connect } from "react-redux";
import { getAssetList, requestAsset } from "app/hooks/assets"; // Using existing API hooks
import { toast } from "react-toastify";
import { SheetCardExtension } from "components/SheetCardExtension";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { validateAssetRequestForm } from "app/utils/FormSchema/AssetsFormSchema";

const AssetRequestSheet = ({ userProfile, reload, isOpen, setIsOpen }) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(true);

  // Initial form values
  const initialValues = {
    asset_name: "",
    reason: "",
    additional_notes: "", // Changed from notes to match API schema
  };

  const formSheetData = {
    triggerText: "Request Asset",
    title: "Asset Request",
    description: null,
    footer: null,
  };

  // Fetch available assets when component mounts
  useEffect(() => {
    const fetchAvailableAssets = async () => {
      setAssetsLoading(true);
      try {
        // Use the existing asset list API with a filter for available assets
        const response = await getAssetList({
          options: { page: 1, sizePerPage: 100 }, // Fetch a reasonable number of assets
          filterData: { status: "available" }, // Assuming there's a status field to filter by
        });

        if (response && response.results) {
          // Format assets for the select dropdown
          const formattedAssets = response.results.map((asset) => ({
            value: asset.id, // Use the asset ID as the value
            label: asset.asset_name, // Use the asset name as the label
          }));
          setAvailableAssets(formattedAssets);
        }
      } catch (error) {
        console.error("Error fetching available assets:", error);
        toast.error("Failed to load available assets");
      } finally {
        setAssetsLoading(false);
      }
    };

    if (isOpen) {
      fetchAvailableAssets();
    }
  }, [isOpen]);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    console.log("Form values:", values);

    // Add additional fields needed for the API
    const payload = {
      asset_name:
        typeof values.asset_name === "object"
          ? values.asset_name.label
          : values.asset_name,
      reason: values.reason,
      additional_notes: values.additional_notes,
      asset_status: "Pending", // Match the enum in the API (Pending, Accepted, Rejected)
      asset_employee_id: userProfile.id,
    };

    try {
      const response = await requestAsset(payload);

      if (response) {
        toast.success("Asset request submitted successfully");
        setIsOpen(false);
        reload(); // Refresh the assets list
      } else {
        toast.error("Failed to submit asset request");
      }
    } catch (error) {
      console.error("Error submitting asset request:", error);
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
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
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        contentClassName="custom-sheet-width"
        width="568px"
      >
        <Formik
          initialValues={initialValues}
          validate={validateAssetRequestForm}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              <SheetCardExtension title="Asset Request Details">
                <SelectInputComponent
                  name={"asset_name"}
                  error={props.errors?.asset_name}
                  touch={props.touched?.asset_name}
                  value={props.values?.asset_name}
                  label={"Asset Name"}
                  required={true}
                  options={availableAssets}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                  }}
                  placeholder={
                    assetsLoading ? "Loading assets..." : "Select an asset"
                  }
                  isLoading={assetsLoading}
                />

                <TextAreaInput
                  name={"reason"}
                  error={props.errors?.reason}
                  touch={props.touched?.reason}
                  value={props.values?.reason}
                  label={"Reason for Request"}
                  required={true}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                  maxRows={3}
                  placeholder="Explain why you need this asset"
                />

                <TextAreaInput
                  name={"additional_notes"}
                  error={props.errors?.additional_notes}
                  touch={props.touched?.additional_notes}
                  value={props.values?.additional_notes}
                  label={"Additional Notes"}
                  required={false}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                  maxRows={3}
                  placeholder="Any additional information (optional)"
                />
              </SheetCardExtension>

              <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
                <Button
                  variant="outline"
                  type="button"
                  size="lg"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  disabled={loading || assetsLoading}
                >
                  {loading ? "Submitting..." : "Submit Request"}
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

export default connect(mapStateToProps)(AssetRequestSheet);
