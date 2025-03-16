import { useState, useEffect } from "react";
import SheetComponent from "components/ui/SheetComponent";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import {
  TextAreaInput,
  SelectInputComponent,
  DateInput,
} from "components/FormControl";
import { connect } from "react-redux";
import { getAssetList, requestAsset, getLocations } from "app/hooks/assets";
import { toast } from "react-toastify";
import { SheetCardExtension } from "components/SheetCardExtension";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { validateAssetRequestForm } from "app/utils/FormSchema/AssetsFormSchema";

const AssetRequestSheet = ({
  userProfile,
  employees,
  reload,
  isOpen,
  setIsOpen,
  mode = "request", // "request" or "assign"
  departments = [],
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [locationOptions, setLocationOptions] = useState([]);

  // Initial form values
  const initialValues = {
    asset_name: "",
    reason: "",
    additional_notes: "",
    // Assignment-specific fields
    employee: "",
    assign_date: new Date().toISOString().split("T")[0], // Today's date
    return_date: null,
    location: "",
  };

  const formSheetData = {
    triggerText: mode === "request" ? "Request Asset" : "Assign Asset",
    title: mode === "request" ? "Asset Request" : "Assign Asset to Employee",
    description: null,
    footer: null,
  };


  // Fetch available assets and locations when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setAssetsLoading(true);
      try {
        // Fetch available assets
        const assetsResponse = await getAssetList({
          options: { page: 1, sizePerPage: 100 },
        });

        if (assetsResponse && assetsResponse.results) {
          const formattedAssets = assetsResponse.results.map((asset) => ({
            value: asset.id,
            label: asset.asset_name,
            type: asset.asset_type,
            location: asset.asset_location,
          }));
          setAvailableAssets(formattedAssets);
        }

        // Fetch locations if in assign mode
        if (mode === "assign") {
          const locationsData = await getLocations();
          if (locationsData && locationsData.length > 0) {
            setLocationOptions(locationsData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load required data");
      } finally {
        setAssetsLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen, mode]);

  const handleFormSubmit = async (values) => {
    setLoading(true);

    try {
      // Prepare the payload based on the mode
      const payload = {
        asset_name:
          typeof values.asset_name === "object"
            ? values.asset_name.label
            : values.asset_name,
        reason: values.reason,
        additional_notes: values.additional_notes,
        ...(mode === "request"
          ? {
              // Request-specific fields
              asset_status: "Pending",
              asset_employee_id: userProfile.id,
            }
          : {
              // Assignment-specific fields
              asset_status: "Accepted",
              asset_employee_id:
                typeof values.employee === "object"
                  ? values.employee.value
                  : values.employee,
              asset_assigned_date: values.assign_date,
              asset_returned: false,
              asset_returned_date: null,
              asset_assigned_by: userProfile.id,
              ...(values.return_date && {
                asset_return_date: values.return_date,
              }),
              ...(values.location && {
                asset_location: values.location.value || values.location,
              }),
            }),
      };

      // Call the API function
      const response = await requestAsset(payload);

      if (response) {
        toast.success(
          mode === "request"
            ? "Asset request submitted successfully"
            : "Asset assigned successfully"
        );
        setIsOpen(false);
        reload();
      } else {
        toast.error(
          mode === "request"
            ? "Failed to submit asset request"
            : "Failed to assign asset"
        );
      }
    } catch (error) {
      console.error("Error:", error);
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
          validate={(values) => validateAssetRequestForm(values, mode)}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              {/* Employee Selection (only for assign mode) */}
              {mode === "assign" && (
                <SheetCardExtension title="Employee Information">
                  <SelectInputComponent
                    name="employee"
                    error={props.errors?.employee}
                    touch={props.touched?.employee}
                    value={props.values.employee}
                    label="Select Employee"
                    required={true}
                    options={employees}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                    }}
                    placeholder="Select an employee"
                  />
                </SheetCardExtension>
              )}

              {/* Common Asset Request/Assignment Fields */}
              <SheetCardExtension
                title={
                  mode === "request" ? "Asset Request Details" : "Asset Details"
                }
              >
                <SelectInputComponent
                  name="asset_name"
                  error={props.errors?.asset_name}
                  touch={props.touched?.asset_name}
                  value={props.values?.asset_name}
                  label="Asset Name"
                  required={true}
                  options={availableAssets}
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                    // If asset has a location, default to that location (for assign mode)
                    if (mode === "assign" && value && value.location) {
                      props.setFieldValue("location", value.location);
                    }
                  }}
                  placeholder={
                    assetsLoading ? "Loading assets..." : "Select an asset"
                  }
                  isLoading={assetsLoading}
                />

                {/* Additional fields for assign mode */}
                {mode === "assign" && (
                  <>
                    <SelectInputComponent
                      name="location"
                      error={props.errors?.location}
                      touch={props.touched?.location}
                      value={props.values.location}
                      label="Location"
                      required={true}
                      options={locationOptions}
                      onChange={(field, value) => {
                        props.setFieldValue(field, value);
                      }}
                      placeholder="Select location"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <DateInput
                        name="assign_date"
                        error={props.errors?.assign_date}
                        touch={props.touched?.assign_date}
                        value={props.values.assign_date}
                        label="Assign Date"
                        required={true}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                        placeholder="Select assign date"
                      />
                      <DateInput
                        name="return_date"
                        error={props.errors?.return_date}
                        touch={props.touched?.return_date}
                        value={props.values.return_date}
                        label="Return Date (if applicable)"
                        required={false}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                        placeholder="Select return date"
                      />
                    </div>
                  </>
                )}

                <TextAreaInput
                  name="reason"
                  error={props.errors?.reason}
                  touch={props.touched?.reason}
                  value={props.values?.reason}
                  label={
                    mode === "request"
                      ? "Reason for Request"
                      : "Reason for Assignment"
                  }
                  required={true}
                  onChange={(field, value) => {
                    props.handleChange(field)(value);
                  }}
                  maxRows={3}
                  placeholder={
                    mode === "request"
                      ? "Explain why you need this asset"
                      : "Explain why this asset is being assigned"
                  }
                />

                <TextAreaInput
                  name="additional_notes"
                  error={props.errors?.additional_notes}
                  touch={props.touched?.additional_notes}
                  value={props.values?.additional_notes}
                  label="Additional Notes"
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
                  {loading
                    ? mode === "request"
                      ? "Submitting..."
                      : "Assigning..."
                    : mode === "request"
                    ? "Submit Request"
                    : "Assign Asset"}
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
    employees: state.emp.employees || [],
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(AssetRequestSheet);
