import { saveShift } from "app/hooks/shiftManagement";
import { ShiftInformation } from "app/utils/Types/ShiftManagement";
import { validateShiftFormSchema } from 'app/utils/FormSchema/ShiftManagementFormSchema';
import { getShiftById } from "app/hooks/general";
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
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const isEditMode = Boolean(id);

  const FormSheetData = {
    triggerText: `${isEditMode ? "Edit" : "Add"} Shift`,
    title: `${isEditMode ? "Edit" : "Add"} Shift`,
    description: null,
    footer: null,
  };

  // Fetch shift data when editing
  useEffect(() => {
    const fetchShiftData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const data = await getShiftById(id);
          if (data) {
            setFormData(data);
          }
        } catch (error) {
          console.error("Error fetching shift data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchShiftData();
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

      console.log(updatedValues, "UPDATE VALUES");

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
        validateFormSchema: validateShiftFormSchema,
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
                date: formData.starttime
              },
              {
                InputField: TimePicker,
                name: "endtime",
                required: true,
                label: "End Time",
                date: formData.endtime
              }
            ],
          },
        ],
      }}
    />
  );
};

export default AddShiftForm;
