import { addUpdateBranch } from "app/hooks/general";
import { Branch } from "app/utils/Types/OfficeSetting";
import { RadioGroupInput } from "components/FormControl";
import { TextAreaInput } from "components/FormControl";
import { TextInput ,SelectLocationOnMap} from "components/FormControl";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchBranches } from "state/slices/CommonSlice";

const AddBranchForm = ({
  setIsOpen,
  editMode = false,
  branchData = {},
  reload = () => {},
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
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
          `Branch ${editMode?.data ? "Updated" : "Added"} Successfully!`,
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

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
      })}
      <Formik
        initialValues={formData}
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
              {/* <SelectLocationOnMap /> */}
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
