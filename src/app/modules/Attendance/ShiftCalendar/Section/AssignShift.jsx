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
import { getShiftAssignment } from "app/hooks/attendance";

import { Switch } from "../../../../../src/@/components/ui/switch";

import { CardContent } from "components/ui/card";
import { Card } from "components/ui/card";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";

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
  const [loading, setLoading] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);
  const [showShiftsList, setShowShiftsList] = useState(false);
  const [employeeShiftsList, setEmployeeShiftsList] = useState([]);
  const [isModify, setIsModify] = useState(false)
  const [formData, setFormData] = useState({
    employee: null,
    shift: null,
  });
  const usersList = users?.map((user) => ({
    value: `${user.id}`,
    label: `${user.first_name} ${user.last_name}`,
  }));
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [shiftsList, setShiftsList] = useState(shifts?.map((shift) => ({
    value: `${shift.id}`,
    label: `${shift.name} (${moment(shift.start_time).format('h:mm a')} - ${moment(shift.end_time).format('h:mm a')})`,
  })));
const [weekdays, setWeekdays] = useState([
    { monday: true },
    { tuesday: true },
    { wednesday: true },
    { thursday: true },
    { friday: true },
  ]);
  
  useEffect(() => {
    const fetchShifts = async () => {
      const shiftData = await getShiftAssignment({
        filterData: { employee: selectedEmployee },
      });
      if(shiftData){
        setEmployeeShiftsList(shiftData.results);
        let filteredShifts = shiftsList?.filter(shift => !shiftData.results.some(shiftData => shiftData.shift === shift.value));
        console.log("Filtered Shifts", filteredShifts);
        setShiftsList(filteredShifts);
      }
    }
    fetchShifts();
  }, [selectedEmployee]);

    const handleSwitchChange = (dayIndex, value) => {
    setWeekdays((prevWeekdays) =>
      prevWeekdays.map((day, index) =>
        index === dayIndex ? { [Object.keys(day)[0]]: value } : day
      )
    );
  };

  const handleClose = () => {
    // setIsOpen(false)
    setCloseSheet(true);
     setShowShiftsList(false);
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
            <div className="space-y-2 pb-2">
              <SelectComponent
                name="employee"
                options={usersList}
                error={props.errors.employee}
                touch={props.touched.employee}
                value={props.values.employee}
                label="User"
                required
                onChange={(field, value) => {
                  setSelectedEmployee(value);
                  props.handleChange(field)(value);
                }}
              />
     {!isModify ? (
  selectedEmployee &&
  employeeShiftsList.length > 0 &&
  employeeShiftsList.map((shift, index) => (
    <Card className="p-0" key={index}>
      <CardHeader className="p-1">
        <CardTitle className="text-[20px]">
          {`Shift ${index + 1}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 flex items-center justify-between">
        <div className="text-[16px]">
          <p>{`Shift Type: ${shift.type || "General"}`}</p>
          <p>{`Shift Time: ${shift.startTime || "9:00AM"} to ${shift.endTime || "5:00PM"}`}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setIsModify(shift);
          }}
        >
          Modify days
        </Button>
      </CardContent>
    </Card>
  ))
) :  (
  weekdays.map((day, index) => {
    // Extract the key and value from each object
    const [dayName, isTrue] = Object.entries(day)[0];
    return (
      <div key={index} className="flex justify-between items-center p-2 border-b">
        <span className="text-[18px] capitalize">
          {dayName}
        </span>
        <Switch 
          id="status"
          checked={isTrue}
          onCheckedChange={(value) =>
              handleSwitchChange(index, value)
          }
        />
      </div>
    );
  })
  )}


              {showShiftsList && ( // Only show this when the sheet is open
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
              )}

              <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
                <Button
                  onClick={() => setShowShiftsList(true)}
                  size="lg"
                  variant="default"
                  type="button"
                >
                  Add Shift
                </Button>
              </div>
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
