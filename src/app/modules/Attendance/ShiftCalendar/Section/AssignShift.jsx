import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import SheetComponent from "components/ui/CustomSheet";
import React, { useEffect, useState } from "react";
import { Formik, useFormikContext } from "formik";
import { Button } from "components/ui/button";
import { SelectInputComponent, CheckBoxInput } from "components/FormControl";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { getEmployeeList } from "app/hooks/attendance";
import { useSelector } from "react-redux";
import moment from "moment";
import { getShiftAssignment, getShift } from "app/hooks/attendance";
import { Switch } from "../../../../../src/@/components/ui/switch";
import { CardContent, Card, CardHeader, CardTitle } from "components/ui/card";
import AddShiftForm from "app/modules/OfficeSetting/sections/Shift/AddShiftForm";
import { saveEmployeeWorkInformationData } from "app/hooks/employee";

// Form values updater component - helps us update form values when employee changes
const FormUpdater = ({ employeeId, employees, setShiftSelect }) => {
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (employeeId && employees && employees.length > 0) {
      // Find the selected employee in the employees array
      const selectedEmployee = employees.find(
        (emp) => emp.id.toString() === employeeId.toString()
      );

      if (selectedEmployee && selectedEmployee.shift_assignment) {
        // If employee has a shift assignment, update form values
        setFieldValue("shift_assignment", selectedEmployee.shift_assignment);
        setShiftSelect(true); // Check the "Choose Shift" checkbox
      } else {
        // If employee doesn't have a shift assignment, reset form values
        setFieldValue("shift_assignment", "");
        setShiftSelect(false);
      }
    }
  }, [employeeId, employees, setFieldValue, setShiftSelect]);

  return null; // This component doesn't render anything
};

const AssignShift = ({ employees }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shiftSelect, setShiftSelect] = useState(false);
  const [shiftList, setShiftList] = useState([]);
  const [addShift, setAddShift] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);
  const [initialValues, setInitialValues] = useState({
    shift_assignment: "",
    employee: "",
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const empOptions = employees?.map((emp) => {
    return {
      value: emp.id,
      label: `${emp.first_name} ${emp.last_name}`,
    };
  });

  const getShiftList = async () => {
    const shiftData = await getShift();
    if (shiftData) {
      const shiftList = shiftData.results.map((shift) => {
        return {
          value: shift.id,
          label: `${shift.name} (${moment(shift.starttime).format(
            "h:mm a"
          )} - ${moment(shift.endtime).format("h:mm a")})`,
        };
      });
      setShiftList(shiftList);
    }
  };

  useEffect(() => {
    getShiftList();
  }, [employees]);

  const handleClose = () => {
    setCloseSheet(true);
  };

  const formSheetData = {
    triggerText: "Assign Shift",
    title: "Assign Shift",
    description: null,
    footer: null,
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Save shift assignment
      const response = await saveEmployeeWorkInformationData(values.employee, {
        shift_assignment: values.shift_assignment,
        employee: values.employee,
      });

      if (response) {
        toast.success("Shift assigned successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        resetForm();
        setIsOpen(false);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.message || "An error occurred", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen,
        discard: false,
      })}

      <SheetComponent
        {...formSheetData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="568px"
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              {/* Add form updater component to update shift data when employee changes */}
              <FormUpdater
                employeeId={props.values.employee}
                employees={employees}
                setShiftSelect={setShiftSelect}
              />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shift Details</h3>

                <div className="space-y-2">
                  <SelectInputComponent
                    name={"employee"}
                    options={empOptions || []}
                    error={props.errors?.employee}
                    touch={props.touched.employee}
                    value={props.values.employee}
                    label={"Employee"}
                    required={true}
                    onChange={(field, value) => {
                      props.setFieldValue(field, value);
                      setSelectedEmployeeId(value);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <CheckBoxInput
                      label="Choose Shift"
                      name="shift-select"
                      value={shiftSelect}
                      onChange={(name, value) => {
                        setShiftSelect(value);
                        if (!value) {
                          props.setFieldValue("shift_assignment", "");
                        }
                      }}
                    />
                  </div>

                  {shiftSelect && (
                    <div className="space-y-2">
                      <SelectInputComponent
                        name={"shift_assignment"}
                        options={shiftList}
                        error={props.errors?.shift_assignment}
                        touch={props.touched.shift_assignment}
                        value={props.values.shift_assignment}
                        label={"Shift"}
                        required={true}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <CheckBoxInput
                      label="Custom Shift"
                      name="custom-shift"
                      value={addShift}
                      onChange={(name, value) => {
                        setAddShift(value);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleClose}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="lg" variant="default">
                    Assign
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </SheetComponent>

      {addShift && (
        <ShiftAction
          isOpen={addShift}
          setIsOpen={setAddShift}
          reload={getShiftList}
        />
      )}
    </>
  );
};

// ShiftAction component
const ShiftAction = ({ isOpen, setIsOpen, reload }) => {
  const formSheetData = {
    triggerText: null,
    title: "Add Shift Details",
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
      <AddShiftForm
        isOpen={isOpen}
        setIsOpen={(value) => {
          reload();
          setIsOpen(value);
        }}
      />
    </SheetComponent>
  );
};

export default AssignShift;
