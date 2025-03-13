import { useState } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import { TextInput, TextAreaInput } from "components/FormControl";
import { connect } from "react-redux";
import { requestAsset } from "app/hooks/assets"; // You'll need to implement this API hook
import { toast } from "react-toastify";
import { SheetCardExtension } from "components/SheetCardExtension";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { validateAssetRequestForm } from "app/utils/FormSchema/AssetsFormSchema";

const AssetRequestSheet = ({ userProfile, reload, isOpen, setIsOpen }) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initial form values
  const initialValues = {
    asset_name: "",
    reason: "",
    notes: "",
  };

  const formSheetData = {
    triggerText: "Request Asset",
    title: "Asset Request",
    description: null,
    footer: null,
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);

    // Add additional fields needed for the API
    const payload = {
      ...values,
      status: "pending", // Default status for new requests
      employee_id: userProfile.id,
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
                  name={"notes"}
                  error={props.errors?.notes}
                  touch={props.touched?.notes}
                  value={props.values?.notes}
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
                  disabled={loading}
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
