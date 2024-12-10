import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import SheetComponent from "components/ui/SheetComponent";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Button } from "components/ui/button";
import { SelectComponent } from "components/form-control";
import { saveShiftAssignment } from "app/hooks/attendance";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { getEmployeeList } from "app/hooks/attendance";
import { useSelector } from "react-redux";
import moment from "moment";

const AssignShift = ({ users,shifts }) => {


  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (formData, resetForm) => {
    console.log("Form submitted:", formData);
    const response = await saveShiftAssignment(formData);
    if (response) {
      resetForm();
      setIsOpen(false);
      toast.success("Employee Shift saved successfully");
    } else {
      resetForm();
      toast.error("Error saving Employee Shift");
    }
  };

  const formSheetData = {
    triggerText: "Assign Shift",
    title: "Assign Shift",
    description: null,
    footer: null,
  };

  return (
    <SheetComponent
      {...formSheetData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      width="568px"
    >
      <AssignShiftForm
        handleSubmit={handleSubmit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        users={users}
        shifts={shifts}
      />
    </SheetComponent>
  );
};

const AssignShiftForm = ({
  handleSubmit,
  isOpen,
  setIsOpen,
  users,
  shifts,
}) => {
  console.log("INFO", users);

  const [closeSheet, setCloseSheet] = useState(false);
  const [formData, setFormData] = useState({
    employee: null,
    shift: null,
  });
  const usersList = users?.map((user) => ({
    value: `${user.id}`,
    label: `${user.first_name} ${user.last_name}`,
  }));

  const shiftsList = shifts?.map((shift) => ({
    value: `${shift.id}`,
    label: `${shift.name} (${moment(shift.start_time).format('h:mm a')} - ${moment(shift.end_time).format('h:mm a')})`,
  }));

  console.log("USERS", users);
  const handleClose = () => {
    // setIsOpen(false)
    setCloseSheet(true);
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
        // innerRef={formRef}
        onSubmit={(values, { resetForm }) => {
          console.log(values, "VALUES ARE HERE");
          handleSubmit(values, resetForm); // Call the parent function here
        }}
        validate={(values) => {
          let errors = {};
          if (!values.employee) {
            errors.employee = "User is required";
          }
          if (!values.shift) {
            errors.shift = "Shift is required";
          }
          return errors;
        }}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <div className="space-y-2">
              <SelectComponent
                name="employee"
                options={usersList}
                error={props.errors.employee}
                touch={props.touched.employee}
                value={props.values.employee}
                label="User"
                required
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
              <SelectComponent
                name="shift"
                options={shiftsList}
                error={props.errors.shift}
                touch={props.touched.shift}
                value={props.values.shift}
                label="Shift"
                required
                onChange={(field, value) => {
                  props.handleChange(field)(value);
                }}
              />
            </div>
            {/* Form Actions */}
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
                  Save
                </Button>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};
export default AssignShift;
