import { Label } from "src/@/components/ui/label";
import { TextInput } from "components/FormControl";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import { SelectInputComponent } from "components/FormControl";
import { toast } from "react-toastify";
import { Switch } from "src/@/components/ui/switch";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { OnboardingDocumentTemplate } from "app/utils/Types/General";
import { saveOnboardingDocument } from "app/hooks/officeSetting";
import SheetComponent from "components/ui/SheetComponent";

const validateOnboardingFormSchema = (values) => {
  const errors = {};
  if (!values.name) errors.name = "Document name is required";
  return errors;
};

const AddOnboardingForm = ({ 
  isOpen, 
  setIsOpen, 
  reload, 
  edit = null, 
  onUpdateSuccess = null 
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  
  // Extract onboarding item from edit prop to match other forms
  const onboardingItem = edit?.data || edit;
  
  const [initialValues, setInitialValues] = useState(
    onboardingItem || OnboardingDocumentTemplate
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSheetData = {
    triggerText: null,
    title: onboardingItem ? "Update Document Details" : "Add New Document",
    description: null,
    footer: null,
  };

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      const response = await saveOnboardingDocument(values?.id, values);
      if (response) {
        toast.success(
          `Document ${onboardingItem ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );

        // Call the update success callback if provided
        if (onUpdateSuccess && typeof onUpdateSuccess === "function") {
          await onUpdateSuccess(values);
        }

        setIsOpen(true); // Pass true to indicate successful update
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Error saving document");
    } finally {
      setIsSubmitting(false);
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
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        width="568px"
        setIsOpen={setIsOpen}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validate={validateOnboardingFormSchema}
          enableReinitialize={true}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
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
              </SheetCardExtension>
              <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
                <Button
                  variant="outline"
                  size="lg"
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="default"
                  disabled={isSubmitting}
                  onClick={()=>{props.handleSubmit()}}
                >
                  {isSubmitting
                    ? "Saving..."
                    : onboardingItem 
                    ? "Update"
                    : "Add"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </SheetComponent>
    </div>
  );
};

export default AddOnboardingForm;
