import { addUpdateBranch } from "app/hooks/general";
import { Branch } from "app/utils/Types/OfficeSetting";
import { TextAreaInput, TextInput, SelectLocationOnMap } from "components/FormControl";
import SheetUI from "components/SheetUI";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchBranches } from "state/slices/CommonSlice";
import { initialState } from "state/slices/UserSlice";

// Get the base URL from Redux store
const baseUrl = initialState.baseUrl;

// Custom Status component for SheetUI
const StatusComponent = ({ value, onChange }) => {
  const isActive = value === "Active";
  
  const handleChange = (checked) => {
    onChange(checked ? "Active" : "Inactive");
  };

  return (
    <div className="flex items-center space-x-3">
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={isActive}
          onChange={e => handleChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
      <span className={`text-sm font-medium ${isActive ? "text-green-600" : "text-red-600"}`}>
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  );
};

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
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Branch`,
    title: `${isEditMode ? "Edit" : "Add"} Branch`,
    description: null,
    footer: null,
  };

  // Fetch branch data when editing
  React.useEffect(() => {
    const fetchBranchData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          // Replace with your API call to get branch by ID
          const response = await fetch(`${baseUrl}/branch/${id}/`, {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (data) {
            setFormData(data);
          }
        } catch (error) {
          console.error("Error fetching branch data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchBranchData();
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
      const errorMessage = error?.response?.data?.message || `Failed to ${isEditMode ? "update" : "add"} branch.`;
      toast.error(errorMessage, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleMapOpen = () => {
    setShowMap(true);
  };

  const handleMapClose = () => {
    setShowMap(false);
  };

  const handleLocationSave = (locationData) => {
    setFormData(prev => ({
      ...prev,
      branch_coordinates: {
        lat: locationData.coordinates.lat,
        lng: locationData.coordinates.lng,
      },
      branch_location: locationData.formattedAddress,
      branch_address: locationData.formattedAddress,
    }));
    setShowMap(false);
  };

  const validateForm = (values) => {
    const errors = {};
    
    if (!values.branch_name) {
      errors.branch_name = "Branch name is required";
    }
    
    if (!values.branch_number) {
      errors.branch_number = "Branch number is required";
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
          formFields: [
            {
              sheetCardExtension: true,
              sheetCardTitle: "Branch Details",
              InputFields: [
                {
                  label: "Branch Status",
                  name: "branch_status",
                  required: true,
                  customComponent: ({ field, form }) => (
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium">Branch Status</label>
                      <StatusComponent 
                        value={form.values.branch_status} 
                        onChange={(value) => form.setFieldValue('branch_status', value)} 
                      />
                    </div>
                  ),
                },
                {
                  InputField: TextInput,
                  name: "branch_name",
                  label: "Branch Name",
                  required: true,
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
                      <label className="block mb-2 text-sm font-medium">Branch Location</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Select location on map"
                          value={form.values.branch_location || ""}
                          disabled
                        />
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                          onClick={handleMapOpen}
                        >
                          Open Map
                        </button>
                      </div>
                      
                      {form.values.branch_coordinates && form.values.branch_coordinates.lat !== 0 && (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <span className="text-xs text-neutral-1000">Latitude:</span>
                            <span className="ml-1 text-sm">
                              {form.values.branch_coordinates.lat.toFixed(6)}
                            </span>
                          </div>
                          <div>
                            <span className="text-xs text-neutral-1000">
                              Longitude:
                            </span>
                            <span className="ml-1 text-sm">
                              {form.values.branch_coordinates.lng.toFixed(6)}
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
          onSave={handleLocationSave}
          initialLocation={formData.branch_location}
          initialCoordinates={formData.branch_coordinates}
        />
      )}
    </>
  );
};

export default AddBranchForm;
