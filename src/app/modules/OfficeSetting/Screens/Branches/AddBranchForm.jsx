import { addUpdateBranch } from "app/hooks/general";
import { Branch } from "app/utils/Types/OfficeSetting";
import { RadioGroupInput } from "components/FormControl";
import { TextAreaInput } from "components/FormControl";
import { TextInput } from "components/FormControl";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchBranches } from "state/slices/CommonSlice";
import { SelectLocationOnMap } from "components/FormControl";

const AddBranchForm = ({
  setIsOpen,
  editMode = false,
  branchData = {},
  reload = () => {},
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const formData = editMode ? branchData : Branch;
  const dispatch = useDispatch();

  const handleClose = () => {
    setCloseSheet(true);
  };

  const handleSubmit = async (values) => {
    try {
      const response = await addUpdateBranch(values, branchData.id);
      if (response) {
        toast.success(
          `Branch ${editMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        setIsOpen(false);
        reload(true);
        dispatch(fetchBranches());
      }
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  const handleMapClose = () => {
    setShowMap(false);
  };

const handleLocationSave = (formik, locationData) => {
  formik.setFieldValue("branch_coordinates", {
    lat: locationData.coordinates.lat,
    lng: locationData.coordinates.lng,
  });
  formik.setFieldValue("branch_location", locationData.formattedAddress);

  // Also set the branch_address field with the same formatted address
  formik.setFieldValue("branch_address", locationData.formattedAddress);

  setShowMap(false);
};

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}
      <Formik
        initialValues={{
          ...formData,
          branch_coordinates: formData.branch_coordinates || { lat: 0, lng: 0 },
          branch_location: formData.branch_location || "",
        }}
        enableReinitialize
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
      >
        {(props) => (
          <form onSubmit={props?.handleSubmit}>
            <SheetCardExtension title="Branch Details">
              <RadioGroupInput
                name={"branch_status"}
                label={"Transfer Type"}
                error={props.errors?.branch_status}
                touch={props.touched?.branch_status}
                value={props.values?.branch_status}
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
              <TextInput
                name="branch_name"
                label="Branch Name"
                required
                error={props.errors.branch_name}
                touch={props.touched.branch_name}
                value={props.values.branch_name}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
              <TextInput
                name="branch_number"
                label="Branch Number"
                required
                error={props.errors.branch_number}
                touch={props.touched.branch_number}
                value={props.values.branch_number}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />

              <TextAreaInput
                name="branch_address"
                label="Branch Address"
                required
                error={props.errors.branch_address}
                touch={props.touched.branch_address}
                value={props.values.branch_address}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />

              <div className="mb-4">
                <label className="block text-sm font-medium  mb-1">
                  Branch Location
                </label>
                <div className="flex items-center gap-2">
                  <TextInput
                    name="branch_location"
                    label=""
                    placeholder="Select location on map"
                    value={props.values.branch_location}
                    disabled={true}
                    // className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowMap(true)}
                  >
                    Open Map
                  </Button>
                </div>

                {props.values.branch_coordinates &&
                  props.values.branch_coordinates.lat !== 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <span className="text-xs text-neutral-1000">Latitude:</span>
                        <span className="text-sm ml-1">
                          {props.values.branch_coordinates.lat.toFixed(6)}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-neutral-1000">
                          Longitude:
                        </span>
                        <span className="text-sm ml-1">
                          {props.values.branch_coordinates.lng.toFixed(6)}
                        </span>
                      </div>
                    </div>
                  )}
              </div>

              {showMap && (
                <SelectLocationOnMap
                  isOpen={showMap}
                  onClose={handleMapClose}
                  onSave={(locationData) =>
                    handleLocationSave(props, locationData)
                  }
                  initialLocation={props.values.branch_location}
                  initialCoordinates={props.values.branch_coordinates}
                />
              )}
            </SheetCardExtension>
            <div className="p-6 border-t border-gray-200 bg-gray-50 mt-5">
              <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
                <Button
                  variant="outline"
                  size="lg"
                  type="button"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  onClick={(e) => {
                    e.preventDefault();
                    props.handleSubmit();
                  }}
                >
                  {editMode ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddBranchForm;
