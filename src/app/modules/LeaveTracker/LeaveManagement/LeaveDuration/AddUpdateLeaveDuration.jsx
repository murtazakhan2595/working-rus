import { Card, CardContent } from "components/ui/card";
import { Header, SheetUI } from "components";
import { useState, useEffect } from "react";
import {
  TextAreaInput,
  TextInput,
  FilterInput,
  CheckBoxInputTree,
  SelectInputComponent,
  NumberInput,
  SelectMultiInputComponent,
} from "components/FormControl";
import { countriesList } from "data/Data";
import { useSelector } from "react-redux";
import { validateLeaveDurationFormSchema } from "app/utils/FormSchema/leaveTrackerFormSchema";
import {
  saveLeaveDuration,
  getLeaveDurationById,
} from "app/hooks/leaveTracker";
import { toast } from "react-toastify";

export default function AddUpdateLeaveDuration({
  isOpen = true,
  setIsOpen,
  reload,
  data = null, // Accept data directly
}) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = Boolean(data);

  const Branches = useSelector((state) => state.common.branches);
  const Departments = useSelector((state) => state.common.departments);

  const FormSheetData = {
    triggerText: "",
    title: isEditMode ? "Edit Duration" : "Add New Duration",
    description: null,
    footer: null,
  };

  // Set form data from passed data or initialize empty
  useEffect(() => {
    if (data) {
      // Pre-populate form with existing data
      setFormData({
        duration_name: data.duration_name || "",
        duration_hours: data.duration_hours || "",
        nationalities: data.nationalities || [],
        branches_ids: data.branches?.map((b) => b.id) || [],
        departments_ids: data.departments?.map((d) => d.id) || [],
      });
    } else {
      // Initialize empty form for new record
      setFormData({
        duration_name: "",
        duration_hours: "",
        nationalities: [],
        branches_ids: [],
        departments_ids: [],
      });
    }
  }, [data]);

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      setIsLoading(true);
      const response = await saveLeaveDuration({
        ...values,
        id: data?.id,
      });
      if (response) {
        toast.success(
          `Leave duration ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.duration_name?.[0] ||
        error?.response?.data?.message ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "add"} leave duration.`;
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
              validateFormSchema: validateLeaveDurationFormSchema,
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
                  sheetCardTitle: `Leave Duration Details`,
                  InputFields: [
                    {
                      InputField: TextInput,
                      name: "duration_name",
                      required: true,
                      label: "Duration Name",
                    },
                    {
                      InputField: NumberInput,
                      name: "duration_hours",
                      required: true,
                      label: "Duration Hours",
                    },
                    {
                      InputField: SelectMultiInputComponent,
                      name: "nationalities",
                      label: "Nationality",
                      options: countriesList,
                      SelectAllOption: true,
                    },
                    {
                      InputField: SelectMultiInputComponent,
                      name: "branches_ids",
                      label: "Branches",
                      options: Branches,
                      SelectAllOption: true,
                    },
                    {
                      InputField: SelectMultiInputComponent,
                      name: "departments_ids",
                      label: "Departments",
                      options: Departments,
                      SelectAllOption: true,
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
