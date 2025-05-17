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
  const [categories, setCategories] = useState([]); 
  const [assetsLoading, setAssetsLoading] = useState(true);

  // Initial form values
  const initialValues = {
    category_id: "",
    asset_name: "",
    reason: "",
    additional_notes: "",
    employee: "",
    assign_date: new Date().toISOString().split("T")[0],
    return_date: null,
  };

  const formSheetData = {
    title: mode === "request" ? "Asset Request" : "Assign Asset to Employee",
    description: null,
    footer: null,
  };

  useEffect(() => {
    const fetchData = async () => {
      setAssetsLoading(true);
      try {
        if (mode === "request") {
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
          const assetsResponse = await getAssetList({
            options: { page: 1, sizePerPage: 100 },
          });

          if (assetsResponse && assetsResponse.results) {
            const formattedAssets = assetsResponse.results.map((asset) => ({
              value: asset.id,
              label: asset.asset_name,
              category_id: asset.category_id,
            }));
            setAvailableAssets(formattedAssets);
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
      const payload = {
        reason: values.reason,
        additional_notes: values.additional_notes,
        ...(mode === "request"
          ? {
              category_id: values.category_id, // NEW: Send category_id instead of asset_name
              preferred_specifications: values.preferred_specifications || {}, // NEW: Send preferences
              asset_status: "Pending",
              asset_employee_id: userProfile.id,
              asset_request_status: "Requested",
            }
          : {
              asset_name: values.asset_name,
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
                    }}
                    placeholder={
                      assetsLoading
                        ? "Loading categories..."
                        : "Select a category"
                    }
                    isLoading={assetsLoading}
                  />
                ) : (
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
                    }}
                    placeholder={
                      assetsLoading ? "Loading assets..." : "Select an asset"
                    }
                    isLoading={assetsLoading}
                  />
                )}
                {/* Additional fields for assign mode */}
                {mode === "assign" && (
                  <>
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
