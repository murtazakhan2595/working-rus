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
import {
  getAssetList,
  requestAsset,
  getLocations,
  getAssetCategories,
} from "app/hooks/assets";
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
  const [categories, setCategories] = useState([]); // NEW: Categories state
  const [selectedCategory, setSelectedCategory] = useState(null); // NEW: Selected category
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [locationOptions, setLocationOptions] = useState([]);

  // Initial form values
  const initialValues = {
    category_id: "", // NEW: Category ID instead of asset_name for requests
    asset_id: "", // NEW: Asset ID for assignments
    reason: "",
    additional_notes: "",
    preferred_specifications: {}, // NEW: Preferred specifications
    // Assignment-specific fields
    employee: "",
    assign_date: new Date().toISOString().split("T")[0],
    return_date: null,
    location: "",
  };

  const formSheetData = {
    title: mode === "request" ? "Asset Request" : "Assign Asset to Employee",
    description: null,
    footer: null,
  };

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setAssetsLoading(true);
      try {
        if (mode === "request") {
          // NEW: Fetch categories for request mode
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
        } else {
          // For assign mode, fetch available assets
          const assetsResponse = await getAssetList({
            options: { page: 1, sizePerPage: 100 },
            filterData: { asset_status: "Available" }, // Only available assets
          });

          if (assetsResponse && assetsResponse.results) {
            const formattedAssets = assetsResponse.results.map((asset) => ({
              value: asset.id,
              label: asset.asset_name,
              category_id: asset.category_id,
              location: asset.asset_location,
            }));
            setAvailableAssets(formattedAssets);
          }

          // Fetch locations for assign mode
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

  // NEW: Handle category selection and show preference fields
  const handleCategoryChange = (categoryId, setFieldValue) => {
    const category = categories.find((cat) => cat.value === categoryId);
    setSelectedCategory(category);
    setFieldValue("preferred_specifications", {});
  };

  // NEW: Render preference fields for selected category
  const renderPreferenceFields = (props) => {
    if (mode !== "request" || !selectedCategory?.dynamic_fields) return null;

    return (
      <div className="mt-4 p-4 border rounded-lg bg-gray-50">
        <h4 className="text-sm font-semibold mb-3">Preferences (Optional)</h4>
        {selectedCategory.dynamic_fields
          .filter(
            (field) =>
              field.field_type === "select" || field.field_type === "text"
          )
          .map((field, index) => {
            const fieldName = `pref_${field.field_name}`;

            if (field.field_type === "select") {
              return (
                <SelectInputComponent
                  key={index}
                  name={fieldName}
                  error={props.errors?.[fieldName]}
                  touch={props.touched?.[fieldName]}
                  value={props.values?.[fieldName]}
                  label={`Preferred ${field.field_name}`}
                  required={false}
                  options={
                    field.field_options?.map((opt) => ({
                      value: opt,
                      label: opt,
                    })) || []
                  }
                  onChange={(field, value) => {
                    props.setFieldValue(field, value);
                    // Update preferred_specifications
                    const currentPrefs =
                      props.values.preferred_specifications || {};
                    currentPrefs[field.field_name] = value;
                    props.setFieldValue(
                      "preferred_specifications",
                      currentPrefs
                    );
                  }}
                  placeholder={`Select preferred ${field.field_name}`}
                />
              );
            }

            return null;
          })}
      </div>
    );
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);

    try {
      // NEW: Prepare payload based on mode
      const payload = {
        reason: values.reason,
        additional_notes: values.additional_notes,
        ...(mode === "request"
          ? {
              // Request-specific fields
              category_id: values.category_id, // NEW: Send category_id instead of asset_name
              preferred_specifications: values.preferred_specifications || {}, // NEW: Send preferences
              asset_status: "Pending",
              asset_employee_id: userProfile.id,
              asset_request_status: "Requested",
            }
          : {
              // Assignment-specific fields
              assigned_asset_id: values.asset_id, // NEW: Send asset_id for assignment
              asset_status: "Accepted",
              asset_employee_id:
                typeof values.employee === "object"
                  ? values.employee.value
                  : values.employee,
              asset_assigned_date: values.assign_date,
              asset_assigned_by: userProfile.id,
              ...(values.return_date && {
                asset_return_date: values.return_date,
              }),
              ...(values.location && {
                asset_location: values.location.value || values.location,
              }),
              asset_request_status: "Assigned",
            }),
      };

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

              {/* Asset Selection - Different for request vs assign */}
              <SheetCardExtension
                title={
                  mode === "request" ? "Asset Request Details" : "Asset Details"
                }
              >
                {mode === "request" ? (
                  // NEW: Category selection for requests
                  <SelectInputComponent
                    name="category_id"
                    error={props.errors?.category_id}
                    touch={props.touched?.category_id}
                    value={props.values?.category_id}
                    label="Asset Category"
                    required={true}
                    options={categories}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                      handleCategoryChange(value, props.setFieldValue);
                    }}
                    placeholder={
                      assetsLoading
                        ? "Loading categories..."
                        : "Select a category"
                    }
                    isLoading={assetsLoading}
                  />
                ) : (
                  // Asset selection for assignments
                  <SelectInputComponent
                    name="asset_id"
                    error={props.errors?.asset_id}
                    touch={props.touched?.asset_id}
                    value={props.values?.asset_id}
                    label="Asset Name"
                    required={true}
                    options={availableAssets}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                      // If asset has a location, default to that location
                      const selectedAsset = availableAssets.find(
                        (asset) => asset.value === value
                      );
                      if (selectedAsset && selectedAsset.location) {
                        props.setFieldValue("location", selectedAsset.location);
                      }
                    }}
                    placeholder={
                      assetsLoading ? "Loading assets..." : "Select an asset"
                    }
                    isLoading={assetsLoading}
                  />
                )}

                {/* NEW: Show preference fields for requests */}
                {renderPreferenceFields(props)}

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
