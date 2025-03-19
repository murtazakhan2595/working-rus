import { Label } from "src/@/components/ui/label";
import { TextInput } from "components/FormControl";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import React, { useState } from "react";
import { SelectInputComponent } from "components/FormControl";
import { toast } from "react-toastify";
import { Switch } from "src/@/components/ui/switch";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { OnboardingDocumentTemplate } from "app/utils/Types/General";
// import { saveOnboardingDocument } from "app/hooks/onboardingHooks";

// This would come from your data or API
const requiredOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const validateOnboardingFormSchema = (values) => {
  const errors = {};
  if (!values.name) errors.name = "Document name is required";
  if (values.isRequired === undefined)
    errors.isRequired = "Required status is required";
  return errors;
};

export { validateOnboardingFormSchema };

const AddOnboardingForm = ({ isOpen, setIsOpen, edit, setEdit, reload }) => {
  const [formData, setFormData] = useState(() => {
    if (edit?.data) {
      return {
        ...edit.data,
      };
    }
    return OnboardingDocumentTemplate;
  });

  const [closeSheet, setCloseSheet] = useState(false);

  const handleSubmit = async (values) => {
    try {
      // const response = await saveOnboardingDocument(values?.id, values);
      const response = true; // Replace with your actual API call

      if (response) {
        toast.success(`Document ${edit ? "Updated" : "Added"} Successfully!`, {
          position: toast.POSITION.TOP_RIGHT,
        });

        if (reload) reload();
        setIsOpen(false);
        if (setEdit) {
          setEdit({
            open: false,
            data: null,
          });
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const handleClose = () => {
    setCloseSheet(true);
  };

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen: setIsOpen,
      })}
      <Formik
        initialValues={formData}
        onSubmit={handleSubmit}
        validate={validateOnboardingFormSchema}
      >
        {(props) => (
          <form onSubmit={props?.handleSubmit}>
            <SheetCardExtension title="Document Details">
              <TextInput
                name="name"
                label="Document Name"
                required
                error={props.errors.name}
                touch={props.touched.name}
                value={props.values.name}
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />

              <SelectInputComponent
                name={"isRequired"}
                options={requiredOptions}
                error={props.errors.isRequired}
                touch={props.touched.isRequired}
                value={props.values.isRequired}
                label={"Required"}
                required
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
              />

            </SheetCardExtension>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
                <Button
                  variant="outline"
                  size="lg"
                  type="button"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" variant="default">
                  {edit ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddOnboardingForm;
