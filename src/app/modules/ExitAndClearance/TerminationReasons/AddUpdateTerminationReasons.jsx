import { Card, CardContent } from "components/ui/card";
import { SheetUI } from "components";
import { useState, useEffect } from "react";
import { TextInput } from "components/FormControl";
import { useSelector } from "react-redux";
import { saveTerminationReason } from "app/hooks/employeeExitAndClearance";
import { toast } from "react-toastify";

export default function AddUpdateTerminationReasons({
  isOpen = true,
  setIsOpen,
  reload,
  data = null, // Accept data directly (from action dropdown)
  edit = null, // Accept nested data (from NavigationSheetComponent)
  id = null, // Accept ID separately (from NavigationSheetComponent)
}) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Determine the actual data to use - handle both formats
  const actualData = (() => {
    // If data is passed directly (from action dropdown)
    if (data) return data;

    // If data is nested in edit object (from NavigationSheetComponent)
    if (edit && edit.data) return edit.data;

    return null;
  })();

  // Determine if this is an edit operation
  const isEditMode = Boolean(actualData?.id || id);

  // Get the ID for edit operations
  const editId = actualData?.id || id;

  const FormSheetData = {
    triggerText: "",
    title: isEditMode
      ? "Edit Termination Reason"
      : "Add New Termination Reason",
    description: null,
    footer: null,
  };

  // Set form data from passed data or initialize empty
  useEffect(() => {
    if (actualData) {
      // Pre-populate form with existing data
      setFormData({
        name: actualData.name || "",
      });
    } else {
      // Initialize empty form for new record
      setFormData({
        name: "",
      });
    }
  }, [actualData]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setIsLoading(true);
      console.log("Submitting values:", values);
      console.log("Edit ID:", editId, "Actual Data ID:", actualData?.id, "Provided ID:", id);
      const response = await saveTerminationReason({
        ...values,
        id: editId || actualData?.id || id, // Use the resolved ID
      });
      if (response) {
        toast.success(
          `Termination Reason ${
            isEditMode ? "Updated" : "Added"
          } Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.name?.[0] ||
        error?.response?.data?.message ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "add"} termination reason.`;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (reload) reload();
    setIsOpen(false);
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Card>
        <CardContent>
          <SheetUI
            isOpen={isOpen}
            setIsOpen={handleClose}
            variant="sheet"
            sheetConfig={FormSheetData}
            formConfig={{
              initialValues: formData,
              enableReinitialize: true,
              handleSubmit: handleSubmit,
              validateFormSchema: (values) => {
                const errors = {};
                if (!values.name) {
                  errors.name = "Termination Reason Name is required";
                }
                return errors;
              },
              submitButtonText: isEditMode ? "Update" : "Submit",
              cancelButtonText: "Cancel",
              columns: 2,
              disableSubmit: isLoading,
              loadingMessage: isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Submitting Form..."
                : "",
              formFields: [
                {
                  sheetCardExtension: true,
                  sheetCardTitle: `Termination Reason Details`,
                  InputFields: [
                    {
                      InputField: TextInput,
                      name: "name",
                      required: true,
                      label: "Termination Reason Name",
                    },
                  ],
                },
              ],
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
