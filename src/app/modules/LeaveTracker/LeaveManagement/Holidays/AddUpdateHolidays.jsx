import {
  saveUpdateHoliday,
  getHolidaysListData,
  getHolidayData,
} from "app/hooks/leaveTracker";
import { PublicHoliday } from "app/utils/Types/LeaveManagment";
import {
  SelectInputComponent,
  TextInput,
  SelectMultiInputComponent,
  DateInput,
} from "components/FormControl";
import { validatePublicHolidayFormSchema } from "app/utils/FormSchema/leaveTrackerFormSchema";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { SheetUI } from "components";
import { countriesList } from "data/Data";
import { GetDispatchStateList } from "utils/Lists";
import { getDropdownList } from "utils/Lists";

const AddUpdateHolidays = ({
  isOpen = false,
  id,
  setIsOpen = () => {},
  reloadData = () => {},
}) => {
  const Branches = GetDispatchStateList("branches", "common") || [];
  const [formValues, setFormValues] = useState(PublicHoliday);
  const [PublicHolidays, setPublicHolidays] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [NameExist, setNameExist] = useState(false);
  const isEditMode = Boolean(id);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const FormSheetData = {
    triggerText: "",
    title: isEditMode ? "Edit Holidays" : "Add New Holidays",
    description: null,
    footer: null,
  };
  // Initialize form data with role values if in edit mode
  const [formData, setFormData] = useState(PublicHoliday);

  const fetchPublicHolidaysData = async (isMounted) => {
    try {
      setIsLoading(true);
      // Add organizationId to filter if available
      const response = await getHolidaysListData();

      if (isMounted) {
        const responseData = response.results;
        const dropDownOptions = await getDropdownList(
          responseData,
          "name",
          "id"
        );
        setPublicHolidays(dropDownOptions);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchPublicHolidaysData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchData = async (isMounted, id) => {
    try {
      setIsLoading(true);
      const response = await getHolidayData(id);
      if (isMounted) {
        setFormData(response);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (id) fetchData(isMounted, id);
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleClose = () => {
    setIsOpen(false);
    reloadData(true);
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setIsSubmittingForm(true);
    try {
      // Save role
      const response = await saveUpdateHoliday(values, id);
      if (response) {
        // Ensure table is reloaded
        return {
          status: true,
          title: "Form Submitted Succesfully",
          description: `${values.name} as a public holiday has been ${
            isEditMode ? "updated" : "added"
          } successfully.`,
          messageType: "Success",
        };
      }
    } catch (error) {
      // Show error message
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        `Failed to ${isEditMode ? "update" : "add"} role.`;
      toast.error(errorMessage);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const validateHolidayName = useCallback(
    (name) => {
      if (!name) return false;

      const holiday_name = PublicHolidays.filter(
        (holiday) =>
          holiday.label.toLowerCase() === name.trim().toLowerCase() &&
          parseInt(holiday.id) !== parseInt(id)
      );

      setNameExist(holiday_name.length > 0);
    },
    [PublicHolidays, id] // dependencies
  );

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
          renderUpdatedFormValues:setFormValues,
          handleSubmit: handleSubmit,
          onSubmitClick: (values) => {
            validateHolidayName(values.name);
          },
          validateFormSchema: (values) => {
            const errors = validatePublicHolidayFormSchema(values);
            if (values.name && NameExist)
              errors.name =
                "Name already exists. Please choose a different name";
            return errors;
          },
          submitButtonText: "Submit",
          cancelButtonText: "Cancel",
          columns: 2,
          disableSubmit: isLoading || isSubmittingForm,
          loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
          formFiels: [
            {
              sheetCardExtension: true,
              sheetCardTitle: `Holiday Details`,
              InputFields: [
                {
                  InputField: TextInput,
                  name: "name",
                  required: true,
                  label: "Holiday Name",
                  onFieldUpdate: (_, value) => {
                    validateHolidayName(value);
                  },
                },
                {
                  InputField: DateInput,
                  name: "date",
                  required: true,
                  label: "Start Date",
                },
                {
                  InputField: DateInput,
                  name: "end_date",
                  label: "End Date",
                  minDate: formValues.data,
                },
                {
                  InputField: SelectMultiInputComponent,
                  name: "branches",
                  label: "Branches",
                  options: Branches,
                  SelectAllOption: true,
                },
                {
                  InputField: SelectMultiInputComponent,
                  name: "country",
                  label: "Country",
                  options: countriesList,
                  SelectAllOption: true,
                },
                {
                  InputField: TextInput,
                  name: "religion",
                  label: "Religion",
                },
              ],
            },
          ],
        }}
      />
    </>
  );
};

export default AddUpdateHolidays;
