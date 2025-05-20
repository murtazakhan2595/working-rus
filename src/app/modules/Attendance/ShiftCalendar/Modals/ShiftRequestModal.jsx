// src/app/modules/Attendance/ShiftManagement/Modals/ShiftRequestModal.jsx
import React, { useState, useEffect } from "react";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import SheetComponent from "components/ui/CustomSheet";
import { Formik, Form } from "formik";
import { Button } from "components/ui/button";
import { 
  DateInput,
  TimePicker,
  CheckBoxInput
} from "components/FormControl";
import { toast } from "react-toastify";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import * as Yup from 'yup';

const ShiftRequestModal = ({
  isOpen,
  setIsOpen,
  employee,
  employeeShifts = [],
  onSubmit = () => {},
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentShift, setCurrentShift] = useState(null);
  const [isSplitShift, setIsSplitShift] = useState(false);

  const handleClose = () => {
    setCloseSheet(true);
  };

  // Find the shift for the selected date
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      const shift = employeeShifts.find((s) => s.date === formattedDate);
      setCurrentShift(shift || null);
    } else {
      setCurrentShift(null);
    }
  }, [selectedDate, employeeShifts]);

  // Initial values for the form
  const initialValues = {
    date: "",
    is_off_current: false,
    current_start_time: "",
    current_end_time: "",
    is_off_requested: false,
    requested_start_time: "",
    requested_end_time: "",
    is_split_current: false,
    is_split_requested: false,
    current_split_start_time1: "",
    current_split_end_time1: "",
    current_split_start_time2: "",
    current_split_end_time2: "",
    requested_split_start_time1: "",
    requested_split_end_time1: "",
    requested_split_start_time2: "",
    requested_split_end_time2: "",
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    date: Yup.string().required("Date is required"),
    is_off_requested: Yup.boolean(),
    requested_start_time: Yup.string().when("is_off_requested", {
      is: false,
      then: Yup.string().required("Start time is required"),
    }),
    requested_end_time: Yup.string().when("is_off_requested", {
      is: false,
      then: Yup.string().required("End time is required"),
    }),
  });

  // Handle form submission
  const handleSubmit = (values) => {
    onSubmit(values);
  };

  const formSheetData = {
    title: "Request Shift Change",
    description: null,
    footer: null,
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
        width="768px"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="font-medium">Employee Name</div>
                      <div>
                        {employee?.first_name} {employee?.last_name}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Employee ID</div>
                      <div>{employee?.id}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <DateInput
                    // src/app/modules/Attendance/ShiftManagement/Modals/ShiftRequestModal.jsx (continued)
                    name="date"
                    label="Select Date"
                    value={values.date}
                    error={errors.date}
                    touch={touched.date}
                    onChange={(name, value) => {
                      setFieldValue(name, value);
                      setSelectedDate(value);

                      // If we have current shift data, set it in the form
                      const formattedDate = moment(value).format("YYYY-MM-DD");
                      const shift = employeeShifts.find(
                        (s) => s.date === formattedDate
                      );

                      if (shift) {
                        setFieldValue("is_off_current", shift.is_off);
                        if (!shift.is_off) {
                          setFieldValue("current_start_time", shift.start_time);
                          setFieldValue("current_end_time", shift.end_time);
                        }
                      }
                    }}
                    required={true}
                    minDate={moment().format("YYYY-MM-DD")} // Only future dates
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Current Shift Details */}
                    <div className="space-y-4 border-r pr-4">
                      <h3 className="font-medium text-lg">Current Shift</h3>

                      {currentShift ? (
                        <>
                          <div className="flex items-center">
                            <CheckBoxInput
                              label="OFF Day"
                              name="is_off_current"
                              value={values.is_off_current}
                              disabled={true} // Cannot change current shift status
                            />
                          </div>

                          {!values.is_off_current && (
                            <>
                              <TimePicker
                                name="current_start_time"
                                label="Start Time"
                                value={values.current_start_time}
                                onChange={setFieldValue}
                                disabled={true} // Cannot change current shift time
                              />

                              <TimePicker
                                name="current_end_time"
                                label="End Time"
                                value={values.current_end_time}
                                onChange={setFieldValue}
                                disabled={true} // Cannot change current shift time
                              />
                            </>
                          )}
                        </>
                      ) : (
                        <div className="text-gray-500 py-4">
                          Select a date to view current shift
                        </div>
                      )}
                    </div>

                    {/* Requested Shift Details */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg">Requested Shift</h3>

                      {currentShift ? (
                        <>
                          <div className="flex items-center">
                            <CheckBoxInput
                              label="Mark as OFF"
                              name="is_off_requested"
                              value={values.is_off_requested}
                              onChange={(name, value) => {
                                setFieldValue(name, value);
                                // Clear time values if marked as OFF
                                if (value) {
                                  setFieldValue("requested_start_time", "");
                                  setFieldValue("requested_end_time", "");
                                }
                              }}
                            />
                          </div>

                          {!values.is_off_requested && (
                            <>
                              <div className="flex items-center mb-4">
                                <CheckBoxInput
                                  label="Split Shift"
                                  name="is_split_requested"
                                  value={values.is_split_requested}
                                  onChange={(name, value) => {
                                    setFieldValue(name, value);
                                    setIsSplitShift(value);
                                  }}
                                />
                              </div>

                              {!values.is_split_requested ? (
                                <>
                                  <TimePicker
                                    name="requested_start_time"
                                    label="Start Time"
                                    value={values.requested_start_time}
                                    onChange={setFieldValue}
                                    date={values.date}
                                    error={errors.requested_start_time}
                                    touch={touched.requested_start_time}
                                    required={!values.is_off_requested}
                                  />

                                  <TimePicker
                                    name="requested_end_time"
                                    label="End Time"
                                    value={values.requested_end_time}
                                    onChange={setFieldValue}
                                    date={values.date}
                                    error={errors.requested_end_time}
                                    touch={touched.requested_end_time}
                                    required={!values.is_off_requested}
                                  />
                                </>
                              ) : (
                                <>
                                  <div className="mb-2 font-medium">
                                    Split Shift 1
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <TimePicker
                                      name="requested_split_start_time1"
                                      label="Start Time"
                                      value={values.requested_split_start_time1}
                                      onChange={setFieldValue}
                                      date={values.date}
                                      required={values.is_split_requested}
                                    />

                                    <TimePicker
                                      name="requested_split_end_time1"
                                      label="End Time"
                                      value={values.requested_split_end_time1}
                                      onChange={setFieldValue}
                                      date={values.date}
                                      required={values.is_split_requested}
                                    />
                                  </div>

                                  <div className="mb-2 font-medium">
                                    Split Shift 2
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <TimePicker
                                      name="requested_split_start_time2"
                                      label="Start Time"
                                      value={values.requested_split_start_time2}
                                      onChange={setFieldValue}
                                      date={values.date}
                                      required={values.is_split_requested}
                                    />

                                    <TimePicker
                                      name="requested_split_end_time2"
                                      label="End Time"
                                      value={values.requested_split_end_time2}
                                      onChange={setFieldValue}
                                      date={values.date}
                                      required={values.is_split_requested}
                                    />
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <div className="text-gray-500 py-4">
                          Select a date to request shift change
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleClose}
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    variant="default"
                    disabled={!currentShift}
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </SheetComponent>
    </>
  );
};

export default ShiftRequestModal;