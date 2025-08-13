import {
  saveUpdateOffsetSettings,
  getHolidaysListData,
  getLeaveOffsetSettingData,
  getLeaveTypeListData,
  getLeaveTypeData,
} from "app/hooks/leaveTracker";
import { LeaveOffsetSetting } from "app/utils/Types/LeaveManagment";
import {
  SelectInputComponent,
  TextInput,
  SelectMultiInputComponent,
  SwitchInput,
} from "components/FormControl";
import { validatePublicHolidayFormSchema } from "app/utils/FormSchema/leaveTrackerFormSchema";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { SheetUI } from "components";
import { countriesList, maritalStatus, GenderOptions } from "data/Data";
import { GetDispatchStateList } from "utils/Lists";
import { getDropdownList } from "utils/Lists";
import { NumberInput } from "components/FormControl";

const AddUpdateOffsetLeave = ({
  isOpen = false,
  id,
  setIsOpen = () => {},
  reloadData = () => {},
}) => {
  const Branches = GetDispatchStateList("branches", "common") || [];
  const Departments = GetDispatchStateList("departments", "common") || [];
  const Designations = GetDispatchStateList("designations", "common") || [];
  const [formValues, setFormValues] = useState(LeaveOffsetSetting);
  const [PublicHolidays, setPublicHolidays] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [NameExist, setNameExist] = useState(false);
  const isEditMode = Boolean(id);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  // Initialize form data with role values if in edit mode
  const [formData, setFormData] = useState(LeaveOffsetSetting);
  const FormSheetData = {
    triggerText: "",
    title: isEditMode ? "Edit Offset Settings" : "Add New Settings",
    description: null,
    footer: null,
  };

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
      const response = await getLeaveOffsetSettingData(id);
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
      const response = await saveUpdateOffsetSettings(values, id);
      if (response) {
        // Ensure table is reloaded
        return {
          status: true,
          title: "Form Submitted Succesfully",
          description: `Offset leave setting have been saved successfully.`,
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
          renderUpdatedFormValues: setFormValues,
          handleSubmit: handleSubmit,
          // onSubmitClick: (values) => {
          //   validateHolidayName(values.name);
          // },
          validateFormSchema: (values) => {
            const errors = validatePublicHolidayFormSchema(values);
            if (values.name && NameExist)
              errors.name =
                "Name already exists. Please choose a different name";
            // return errors;
          },
          submitButtonText: "Submit",
          cancelButtonText: "Cancel",
          columns: 2,
          disableSubmit: isLoading || isSubmittingForm,
          loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
          formFields: [
            {
              sheetCardExtension: true,
              sheetCardTitle: `Eligibility Details`,
              InputFields: [
                {
                  InputField: SelectMultiInputComponent,
                  name: "nationalities",
                  label: "Nationalities",
                  options: countriesList,
                  SelectAllOption: true,
                },
                {
                  InputField: SelectMultiInputComponent,
                  name: "branches",
                  label: "Branches",
                  options: Branches,
                  SelectAllOption: true,
                  placeholder: "Select branches",
                },
                {
                  InputField: SelectMultiInputComponent,
                  name: "departments",
                  label: "Departments",
                  options: Departments,
                  SelectAllOption: true,
                },
                {
                  InputField: SelectMultiInputComponent,
                  name: "genders",
                  label: "Genders",
                  options: GenderOptions,
                  SelectAllOption: true,
                },
                {
                  InputField: SelectMultiInputComponent,
                  name: "marital_statuses",
                  label: "Marital Statuses",
                  options: maritalStatus,
                  SelectAllOption: true,
                },
                {
                  InputField: SelectMultiInputComponent,
                  name: "grades",
                  label: "Job Grades / Designations",
                  options: Designations,
                  SelectAllOption: true,
                },
              ],
            },
            {
              sheetCardExtension: true,
              sheetCardTitle: `Conversion Rule`,
              InputFields: [
                {
                  InputField: NumberInput,
                  name: "conversion_ratio_hours",
                  label: "Overtime Hours",
                  required: true,
                  description: "1 Offset Leave = X Overtime Hours",
                },
              ],
            },
            {
              sheetCardExtension: true,
              sheetCardTitle: `Validity Details`,
              InputFields: [
                {
                  InputField: NumberInput,
                  name: "validity_months",
                  label: "Validity Months",
                  required: true,
                  description:
                    "Leave can be applied within the validity period after offset leave is alloted",
                },
                {
                  InputField: SwitchInput,
                  name: "leave_cap_enabled",
                  label: "Leave Cap",
                  description:
                    "Enable or Disable (Maximum offset leaves per month/year)",
                },
                {
                  InputField: NumberInput,
                  name: "max_leaves_per_month",
                  label: "Leave Per Months",
                  required: true,
                  description: "Maximum offset leaves allowed per month",
                  shouldRender: formValues.leave_cap_enabled,
                },
                {
                  InputField: NumberInput,
                  name: "max_leaves_per_year",
                  label: "Leave Per Year",
                  required: true,
                  description: "Maximum offset leaves allowed per year",
                  shouldRender: formValues.leave_cap_enabled,
                },
              ],
            },
          ],
        }}
      />
    </>
  );
};

export default AddUpdateOffsetLeave;
