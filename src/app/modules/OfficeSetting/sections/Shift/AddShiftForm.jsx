import { Label } from "src/@/components/ui/label";
import { ShiftInformation } from "app/utils/Types/Shift";
import { TextInput, TimePicker } from "components/FormControl";
import { SheetCardExtension } from "components/SheetCardExtension";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import React, { useState } from "react";
import { SelectInputComponent } from "components/FormControl";
import { shiftType } from "data/Data";
import { toast } from "react-toastify";
import moment from "moment";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import { ShiftInformation } from "app/utils/Types/ShiftManagement";
import { validateShiftFormSchema } from 'app/utils/FormSchema/ShiftManagementFormSchema';
import { saveShift } from "app/hooks/shiftManagement";

const AddShiftForm = ({
  isOpen,
  setIsOpen,
  shiftData,
  setEdit,
  reload = () => {},
  setEmployeeShift = () => {},
}) => {
  const formData = shiftData ?? ShiftInformation;
  // setFormData] = useState(() => {
  //   if (edit?.data) {
  //     const localStartTime = moment(edit.data.starttime)
  //     const localEndTime = moment(edit.data.endtime)
  //     return {
  //       ...edit.data,
  //       starttime: localStartTime,
  //       endtime: localEndTime,
  //     };
  //   }
  //   return ShiftInformation;
  // });
  const [closeSheet, setCloseSheet] = useState(false);

  const handleSubmit = async (values) => {
    try {
      // Use default times if no value is selected
      const startTime = moment(values.starttime);
      const endTime = moment(values.endtime)

      const startTimeUTC = moment(startTime).utc().toISOString();
      const endTimeUTC =moment(endTime).utc().toISOString();

      const updatedValues = {
        ...values,
        starttime: startTimeUTC,
        endtime: endTimeUTC,
      };

      console.log(updatedValues, "UPDATE VALUES");

      const response = await saveShift(updatedValues?.id, updatedValues);
      if (response) {
        toast.success(`Shift ${shiftData ? "Updated" : "Added"} Successfully!`, {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log("response", response);
        reload(true);
        setIsOpen(false);
        setEmployeeShift(response.id);
        setEdit({
          open: false,
          data: null,
        });
      }
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const handleClose = () => {
    setCloseSheet(true);
  };

  const handleTimeChange = (field, time, props) => {
    props.setFieldValue(field, time);
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
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
        validate={validateShiftFormSchema}
      >
        {(props) => (
          <form onSubmit={props?.handleSubmit}>
            <SheetCardExtension title="Shift Details">
              <div className="mb-6 space-y-2">
              <TextInput
                name="name"
                label="Shift Name"
                required
                error={props.errors.name}
                touch={props.touched.name}
                value={props.values.name}
                onChange={(field, value) => {
                  console.log(field, value, "FIELD VALUE");
                  props.handleChange(field)(value);
                }}
              />
              </div>
             
              <div className="mb-6 space-y-2">
              <SelectInputComponent
                name={"type"}
                options={shiftType}
                error={props.errors.type}
                touch={props.touched.type}
                value={props.values.type}
                label={"Type"}
                required
                onChange={(field, value) => {
                  props.setFieldValue(field, value);
                }}
              />
              </div>
              <div className="mb-6 space-y-2">
              <Label>Start Time</Label>
              <TimePicker
                value={props.values.starttime} // Bind Formik value for starttime
                onChange={(field, time) => props.setFieldValue(field, time)} // Update Formik value on time change
                date={props.values.starttime}
                name={'starttime'}
              />
              </div>
              <div className="mb-6 space-y-2">
              <Label>End Time</Label>
              <TimePicker
                value={props.values.endtime} // Bind Formik value for endtime
                onChange={(field, time) => props.setFieldValue(field, time)}
                date={props.values.endtime}
                name='endtime'

              />
              </div>
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
                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  onClick={(e) => {
                    e.preventDefault();
                    props.handleSubmit();
                  }}
                >
                  {shiftData ? "Update" : "Add"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AddShiftForm;
