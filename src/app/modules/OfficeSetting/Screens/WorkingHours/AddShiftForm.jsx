import { saveShift } from "app/hooks/shiftManagement";
import { ShiftInformation } from "app/utils/Types/ShiftManagement";
import { validateShiftFormSchema } from "app/utils/FormSchema/ShiftManagementFormSchema";
import { getShiftById, getWorkingHours } from "app/hooks/general";
import { TextInput, TimePicker } from "components/FormControl";
import { SelectInputComponent } from "components/FormControl";
import { shiftType } from "data/Data";
import { SheetUI } from "components";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";

const AddShiftForm = ({
  id = false,
  reloadData = () => {},
  isOpen = false,
  setIsOpen = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(ShiftInformation);
  const [Shifts, setShifts] = useState([]);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Shift`,
    title: `${isEditMode ? "Edit" : "Add"} Shift`,
    description: null,
    footer: null,
  };

  const fetchShiftsData = async (isMounted) => {
    try {
      setIsLoading(true);
      // Add organizationId to filter if available

      const response = await getWorkingHours();
      if (isMounted) {
        setShifts(response.results || []);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchShiftsData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch shift data when editing

  const fetchData = async (isMounted, id) => {
    try {
      setIsLoading(true);
      const response = await getShiftById(id);
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

  const handleSubmit = async (values) => {
    try {
      setIsSubmittingForm(true);

      // Use default times if no value is selected
      const startTime = moment(values.starttime);
      const endTime = moment(values.endtime);

      const startTimeUTC = moment(startTime).utc().toISOString();
      const endTimeUTC = moment(endTime).utc().toISOString();

      const updatedValues = {
        ...values,
        starttime: startTimeUTC,
        endtime: endTimeUTC,
      };

      const response = await saveShift(updatedValues);
      if (response) {
        toast.success(
          `Shift ${isEditMode ? "Updated" : "Added"} Successfully!`,
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        handleClose();
      }
    } catch (error) {
      console.error("Error during submission:", error);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Create validation function that includes existing shifts
  const validateWithDuplicateCheck = (values) => {
    return validateShiftFormSchema(values, Shifts, id);
  };

  return (
    <SheetUI
      isOpen={isOpen}
      setIsOpen={handleClose}
      variant="sheet"
      sheetConfig={FormSheetData}
      formConfig={{
        initialValues: formData,
        enableReinitialize: true,
        handleSubmit: handleSubmit,
        validateFormSchema: validateWithDuplicateCheck, // UPDATED: Use new validation function
        submitButtonText: "Submit",
        cancelButtonText: "Cancel",
        columns: 1,
        disableSubmit: isLoading || isSubmittingForm,
        loadingMessage: isSubmittingForm ? "Submitting Form..." : "",
        formFields: [
          {
            sheetCardExtension: true,
            sheetCardTitle: "Shift Details",
            InputFields: [
              {
                InputField: TextInput,
                name: "name",
                required: true,
                label: "Shift Name",
              },
              {
                InputField: SelectInputComponent,
                name: "type",
                required: true,
                label: "Type",
                options: shiftType,
              },
              {
                InputField: TimePicker,
                name: "starttime",
                required: true,
                label: "Start Time",
                date: formData.starttime,
              },
              {
                InputField: TimePicker,
                name: "endtime",
                required: true,
                label: "End Time",
                date: formData.endtime,
              },
            ],
          },
        ],
      }}
    />
  );
};

export default AddShiftForm;
