import { addUpdateBranch } from "app/hooks/general";
import { Branch } from "app/utils/Types/OfficeSetting";
import {
  TextAreaInput,
  TextInput,
  SelectLocationOnMap,
} from "components/FormControl";
import SheetUI from "components/SheetUI";
import { getBranchList ,getBranchById} from "app/hooks/general";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchBranches } from "state/slices/CommonSlice";
import { Button } from "components/ui/button";
import { SwitchInput } from "components/FormControl";

const AddBranchForm = ({
  id = false,
  reloadData = () => {},
  isOpen = false,
  setIsOpen = () => {},
  onUpdateSuccess = null,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(Branch);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [DataList, setDataList] = useState(false);
  const [currentFormInstance, setCurrentFormInstance] = useState(null);
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Branch`,
    title: `${isEditMode ? "Edit" : "Add"} Branch`,
    description: null,
    footer: null,
  };

  const fetchExistingData = async (isMounted) => {
    try {
      setIsLoading(true);
      // Add organizationId to filter if available
      const response = await getBranchList();

      if (isMounted) {
        setDataList(response.results);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchExistingData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async (isMounted,id) => {
      try {
        setIsLoading(true);
        // Add organizationId to filter if available
        const response = await getBranchById(id);

        if (isMounted) {
          setFormData(response);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData(isMounted, id);
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleClose = () => {
    setIsOpen(false);
    reloadData(true);
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmittingForm(true);
      const response = await addUpdateBranch(values, id);
      if (response) {
        toast.success(
          `Branch ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );

        // Call the update success callback if provided
        if (onUpdateSuccess && typeof onUpdateSuccess === "function") {
          await onUpdateSuccess(values);
        }

        handleClose();
        dispatch(fetchBranches());
      }
    } catch (error) {
      console.error("ERROR", error);

      // Show error message
      const errorMessage =
        error?.response?.data?.message ||
        `Failed to ${isEditMode ? "update" : "add"} branch.`;
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleMapOpen = (formInstance = null) => {
    if (formInstance) {
      setCurrentFormInstance(formInstance);
    }
    setShowMap(true);
  };

  const handleMapClose = () => {
    setShowMap(false);
    setCurrentFormInstance(null);
  };

  const handleLocationSave = (locationData, formInstance = null) => {
    if (formInstance) {
      // Use Formik's setFieldValue to update individual fields without triggering reinitialization
      formInstance.setFieldValue('branch_coordinates', {
        lat: locationData.coordinates.lat,
        lng: locationData.coordinates.lng,
      });
      formInstance.setFieldValue('branch_location', locationData.formattedAddress);
      formInstance.setFieldValue('branch_address', locationData.formattedAddress);
    } else {
      // Fallback to state update (preserve existing form data)
      setFormData((prev) => ({
        ...prev,
        branch_coordinates: {
          lat: locationData.coordinates.lat,
          lng: locationData.coordinates.lng,
        },
        branch_location: locationData.formattedAddress,
        branch_address: locationData.formattedAddress,
      }));
    }
    setShowMap(false);
    setCurrentFormInstance(null);
  };

  const validateForm = (values) => {
    const errors = {};

    if (!values.branch_name) {
      errors.branch_name = "Branch name is required";
    }

    if (!values.branch_number) {
      errors.branch_number = "Branch number is required";
    } else if (!/^\d+$/.test(values.branch_number)) {
      errors.branch_number = "Branch number must be numeric";
    }

    if (!values.branch_address) {
      errors.branch_address = "Branch address is required";
    }

    return errors;
  };

  return (
    <>
      <SheetUI
        isOpen={isOpen}
        setIsOpen={handleClose}
        variant="sheet"
        sheetConfig={FormSheetData}
        formConfig={{
          initialValues: formData,
          enableReinitialize: true,
          handleSubmit: handleSubmit,
          validateFormSchema: validateForm,
          submitButtonText: isEditMode ? "Update" : "Add",
          cancelButtonText: "Cancel",
          columns: 1,
          disableSubmit: isLoading || isSubmittingForm,
          loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
          DataList: DataList,
          formFields: [
            {
              sheetCardExtension: true,
              sheetCardTitle: "Branch Details",
              InputFields: [
                {
                  InputField: SwitchInput,
                  name: "branch_status",
                  label: "Branch Status",
                },
                {
                  InputField: TextInput,
                  name: "branch_name",
                  label: "Branch Name",
                  required: true,
                  validateDuplicate: true,
                },
                {
                  InputField: TextInput,
                  name: "branch_number",
                  label: "Branch Number",
                  required: true,
                },
                {
                  InputField: TextAreaInput,
                  name: "branch_address",
                  label: "Branch Address",
                  required: true,
                },
                {
                  label: "Branch Location",
                  name: "branch_location",
                  customComponent: ({ field, form }) => (
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium">
                        Branch Location
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Select location on map"
                          value={form.values?.branch_location || ""}
                          disabled
                        />
                        <Button type="button" onClick={() => handleMapOpen(form)}>
                          Open Map
                        </Button>
                      </div>

                      {form.values?.branch_coordinates &&
                        form.values?.branch_coordinates.lat !== 0 && (
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                              <span className="text-xs text-neutral-1000">
                                Latitude:
                              </span>
                              <span className="ml-1 text-sm">
                                {form.values?.branch_coordinates.lat.toFixed(6)}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-neutral-1000">
                                Longitude:
                              </span>
                              <span className="ml-1 text-sm">
                                {form.values?.branch_coordinates.lng.toFixed(6)}
                              </span>
                            </div>
                          </div>
                        )}
                    </div>
                  ),
                },
              ],
            },
          ],
        }}
      />

      {showMap && (
        <SelectLocationOnMap
          isOpen={showMap}
          onClose={handleMapClose}
          onSave={(locationData) => handleLocationSave(locationData, currentFormInstance)}
          initialLocation={formData.branch_location}
          initialCoordinates={formData.branch_coordinates}
        />
      )}
    </>
  );
};

export default AddBranchForm;
