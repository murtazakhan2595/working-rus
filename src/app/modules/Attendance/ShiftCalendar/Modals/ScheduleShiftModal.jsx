// src/app/modules/Attendance/ShiftManagement/Modals/ScheduleShiftModal.jsx
import React, { useState, useEffect } from "react";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import SheetComponent from "components/ui/CustomSheet";
import { Formik, Form, FieldArray } from "formik";
import { Button } from "components/ui/button";
import {
  SelectInputComponent,
  CheckBoxInput,
  SelectMultiInputComponent,
  DateRangeInput,
  TimePicker,
} from "components/FormControl";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Separator } from "src/@/components/ui/separator";
import * as Yup from "yup";

const ScheduleShiftModal = ({
  isOpen,
  setIsOpen,
  selectedDates = null,
  employees = [],
  onSave = () => {},
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [useCustomShift, setUseCustomShift] = useState(false);
  const [usePredefinedShift, setUsePredefinedShift] = useState(true);
  const [isSplitShift, setIsSplitShift] = useState(false);

  // Mock shifts data (replace with API call later)
  useEffect(() => {
    setShifts([
      { value: 1, label: "Morning Shift (9:00 AM - 6:00 PM)" },
      { value: 2, label: "Evening Shift (2:00 PM - 10:00 PM)" },
      { value: 3, label: "Night Shift (10:00 PM - 6:00 AM)" },
    ]);
  }, []);

  const handleClose = () => {
    setCloseSheet(true);
  };

  // Get date range from the selected dates or default to current week
  const getInitialDateRange = () => {
    if (selectedDates && selectedDates.start && selectedDates.end) {
      return `${moment(selectedDates.start).format("YYYY-MM-DD")},${moment(
        selectedDates.end
      )
        .subtract(1, "day")
        .format("YYYY-MM-DD")}`;
    }

    const startOfWeek = moment().startOf("week").format("YYYY-MM-DD");
    const endOfWeek = moment().endOf("week").format("YYYY-MM-DD");
    return `${startOfWeek},${endOfWeek}`;
  };

  // Generate daily schedule for the selected date range
  const generateDailySchedule = (dateRange) => {
    if (!dateRange) return [];

    const [startDate, endDate] = dateRange.split(",");
    const start = moment(startDate);
    const end = moment(endDate);
    const days = [];

    let current = start.clone();
    while (current.isSameOrBefore(end)) {
      days.push({
        date: current.format("YYYY-MM-DD"),
        day: current.format("ddd"),
        isOff: false,
        isSplit: false,
        startTime: null,
        endTime: null,
        splitStartTime1: null,
        splitEndTime1: null,
        splitStartTime2: null,
        splitEndTime2: null,
      });
      current.add(1, "day");
    }

    return days;
  };

  // Initial values for the form
  const initialValues = {
    dateRange: getInitialDateRange(),
    employees: [],
    shiftType: usePredefinedShift ? "predefined" : "custom",
    shiftId: "",
    dailySchedule: [],
    totalHours: {
      daily: {},
      weekly: 0,
    },
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    dateRange: Yup.string().required("Date range is required"),
    employees: Yup.array().min(1, "At least one employee must be selected"),
  });

  // Update daily schedule when date range changes
  const handleDateRangeChange = (values, setFieldValue) => {
    const dailySchedule = generateDailySchedule(values.dateRange);
    setFieldValue("dailySchedule", dailySchedule);
  };

  // Calculate working hours
  const calculateHours = (values, setFieldValue) => {
    const dailyHours = {};
    let weeklyTotal = 0;

    values.dailySchedule.forEach((day) => {
      let dayTotal = 0;

      if (!day.isOff) {
        if (day.isSplit) {
          // Calculate hours for split shift
          if (day.splitStartTime1 && day.splitEndTime1) {
            const start1 = moment(day.splitStartTime1);
            const end1 = moment(day.splitEndTime1);
            const hours1 = end1.diff(start1, "hours", true);
            dayTotal += hours1;
          }

          if (day.splitStartTime2 && day.splitEndTime2) {
            const start2 = moment(day.splitStartTime2);
            const end2 = moment(day.splitEndTime2);
            const hours2 = end2.diff(start2, "hours", true);
            dayTotal += hours2;
          }
        } else {
          // Calculate hours for regular shift
          if (day.startTime && day.endTime) {
            const start = moment(day.startTime);
            const end = moment(day.endTime);
            dayTotal = end.diff(start, "hours", true);
          }
        }
      }

      // Validate max 9 hours per day
      if (dayTotal > 9) {
        toast.error(`Working hours for ${day.day} exceeds 9 hours limit!`);
        dayTotal = 9; // Cap at 9 hours
      }

      dailyHours[day.date] = dayTotal;
      weeklyTotal += dayTotal;
    });

    setFieldValue("totalHours", {
      daily: dailyHours,
      weekly: weeklyTotal,
    });
  };

  // Handle form submission
  const handleSubmit = (values) => {
    // Prepare data to save
    const scheduleData = {
      employees: values.employees,
      dates: values.dailySchedule.map((day) => day.date),
      shiftId: values.shiftId,
      shiftName: shifts.find((s) => s.value === values.shiftId)?.label || "",
      customShift: values.shiftType === "custom",
      isOff: values.dailySchedule.some((day) => day.isOff),
      startTime: values.dailySchedule[0]?.startTime || null,
      endTime: values.dailySchedule[0]?.endTime || null,
      splitShift: values.dailySchedule.some((day) => day.isSplit),
      dailySchedule: values.dailySchedule,
    };

    onSave(scheduleData);
  };

  const formSheetData = {
    title: "Schedule Shift",
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
          {({ values, errors, touched, setFieldValue, handleChange }) => (
            <Form className="space-y-6">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Date Range & Employee Selection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <DateRangeInput
                      name="dateRange"
                      label="Date Range"
                      value={values.dateRange}
                      error={errors.dateRange}
                      touch={touched.dateRange}
                      onChange={(name, value) => {
                        setFieldValue(name, value);
                        handleDateRangeChange(
                          { ...values, dateRange: value },
                          setFieldValue
                        );
                      }}
                      required={true}
                    />

                    <SelectMultiInputComponent
                      name="employees"
                      label="Select Employees"
                      options={employees.map((emp) => ({
                        value: emp.id,
                        label: `${emp.first_name} ${emp.last_name}`,
                      }))}
                      value={values.employees}
                      error={errors.employees}
                      touch={touched.employees}
                      onChange={setFieldValue}
                      required={true}
                      showSelectedValuesBelow={true}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Shift Type</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col gap-4">
                      <CheckBoxInput
                        label="Choose Shift (from pre-defined organization shifts)"
                        name="usePredefinedShift"
                        value={usePredefinedShift}
                        onChange={(name, value) => {
                          setUsePredefinedShift(value);
                          setUseCustomShift(!value);
                          setFieldValue(
                            "shiftType",
                            value ? "predefined" : "custom"
                          );
                        }}
                      />

                      {usePredefinedShift && (
                        <SelectInputComponent
                          name="shiftId"
                          label="Select Shift"
                          options={shifts}
                          value={values.shiftId}
                          error={errors.shiftId}
                          touch={touched.shiftId}
                          onChange={setFieldValue}
                          required={true}
                        />
                      )}

                      <CheckBoxInput
                        label="Custom Shift"
                        name="useCustomShift"
                        value={useCustomShift}
                        onChange={(name, value) => {
                          setUseCustomShift(value);
                          setUsePredefinedShift(!value);
                          setFieldValue(
                            "shiftType",
                            value ? "custom" : "predefined"
                          );
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {useCustomShift &&
                  values.dateRange &&
                  values.dailySchedule.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Custom Shift Schedule</CardTitle>
                        <div className="flex items-center space-x-4 mt-2">
                          <CheckBoxInput
                            label="Split Shift (4.5 hr + 4.5 hr format)"
                            name="isSplitShift"
                            value={isSplitShift}
                            onChange={(name, value) => {
                              setIsSplitShift(value);
                              // Update all days with the split shift setting
                              const updatedSchedule = values.dailySchedule.map(
                                (day) => ({
                                  ...day,
                                  isSplit: value,
                                })
                              );
                              setFieldValue("dailySchedule", updatedSchedule);
                            }}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <FieldArray
                          name="dailySchedule"
                          render={() => (
                            <div className="space-y-4">
                              {values.dailySchedule.map((day, index) => (
                                <div
                                  key={index}
                                  className="border p-4 rounded-md"
                                >
                                  <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">
                                      {day.day} -{" "}
                                      {moment(day.date).format("DD MMM YYYY")}
                                    </h3>
                                    <CheckBoxInput
                                      label="Mark as OFF"
                                      name={`dailySchedule[${index}].isOff`}
                                      value={day.isOff}
                                      onChange={(name, value) => {
                                        setFieldValue(name, value);
                                        // Recalculate hours after toggling OFF
                                        setTimeout(
                                          () =>
                                            calculateHours(
                                              values,
                                              setFieldValue
                                            ),
                                          0
                                        );
                                      }}
                                    />
                                  </div>

                                  {!day.isOff && (
                                    <>
                                      {!day.isSplit ? (
                                        <div className="grid grid-cols-2 gap-4">
                                          <TimePicker
                                            name={`dailySchedule[${index}].startTime`}
                                            label="Start Time"
                                            value={day.startTime}
                                            date={day.date}
                                            onChange={(name, value) => {
                                              setFieldValue(name, value);
                                              // Recalculate hours after time change
                                              setTimeout(
                                                () =>
                                                  calculateHours(
                                                    values,
                                                    setFieldValue
                                                  ),
                                                0
                                              );
                                            }}
                                            required={true}
                                          />
                                          <TimePicker
                                            name={`dailySchedule[${index}].endTime`}
                                            label="End Time"
                                            value={day.endTime}
                                            date={day.date}
                                            onChange={(name, value) => {
                                              setFieldValue(name, value);
                                              // Recalculate hours after time change
                                              setTimeout(
                                                () =>
                                                  calculateHours(
                                                    values,
                                                    setFieldValue
                                                  ),
                                                0
                                              );
                                            }}
                                            required={true}
                                          />
                                        </div>
                                      ) : (
                                        <>
                                          <div className="mb-2 font-medium">
                                            Split Shift 1
                                          </div>
                                          <div className="grid grid-cols-2 gap-4 mb-4">
                                            <TimePicker
                                              name={`dailySchedule[${index}].splitStartTime1`}
                                              label="Start Time"
                                              value={day.splitStartTime1}
                                              date={day.date}
                                              onChange={(name, value) => {
                                                setFieldValue(name, value);
                                                setTimeout(
                                                  () =>
                                                    calculateHours(
                                                      values,
                                                      setFieldValue
                                                    ),
                                                  0
                                                );
                                              }}
                                              required={true}
                                            />
                                            <TimePicker
                                              name={`dailySchedule[${index}].splitEndTime1`}
                                              label="End Time"
                                              value={day.splitEndTime1}
                                              date={day.date}
                                              onChange={(name, value) => {
                                                setFieldValue(name, value);
                                                setTimeout(
                                                  () =>
                                                    calculateHours(
                                                      values,
                                                      setFieldValue
                                                    ),
                                                  0
                                                );
                                              }}
                                              required={true}
                                            />
                                          </div>
                                          <div className="mb-2 font-medium">
                                            Split Shift 2
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <TimePicker
                                              name={`dailySchedule[${index}].splitStartTime2`}
                                              label="Start Time"
                                              value={day.splitStartTime2}
                                              date={day.date}
                                              onChange={(name, value) => {
                                                setFieldValue(name, value);
                                                setTimeout(
                                                  () =>
                                                    calculateHours(
                                                      values,
                                                      setFieldValue
                                                    ),
                                                  0
                                                );
                                              }}
                                              required={true}
                                            />
                                            <TimePicker
                                              name={`dailySchedule[${index}].splitEndTime2`}
                                              label="End Time"
                                              value={day.splitEndTime2}
                                              date={day.date}
                                              onChange={(name, value) => {
                                                setFieldValue(name, value);
                                                setTimeout(
                                                  () =>
                                                    calculateHours(
                                                      values,
                                                      setFieldValue
                                                    ),
                                                  0
                                                );
                                              }}
                                              required={true}
                                            />
                                          </div>
                                        </>
                                      )}

                                      <div className="mt-4">
                                        <CheckBoxInput
                                          label={`Split Day (only for this day)`}
                                          name={`dailySchedule[${index}].isSplit`}
                                          value={day.isSplit}
                                          onChange={(name, value) => {
                                            setFieldValue(name, value);
                                            setTimeout(
                                              () =>
                                                calculateHours(
                                                  values,
                                                  setFieldValue
                                                ),
                                              0
                                            );
                                          }}
                                          disabled={isSplitShift} // Disable if global split shift is enabled
                                        />
                                      </div>
                                    </>
                                  )}

                                  {/* Display daily hours */}
                                  <div className="mt-4 text-sm">
                                    <strong>Working Hours: </strong>
                                    {values.totalHours.daily[day.date]
                                      ? `${values.totalHours.daily[
                                          day.date
                                        ].toFixed(1)} hours`
                                      : day.isOff
                                      ? "OFF"
                                      : "0 hours"}
                                  </div>
                                </div>
                              ))}

                              {/* Summary Section */}
                              <div className="mt-6 p-4 bg-gray-100 rounded-md">
                                <h3 className="font-medium mb-2">
                                  Break Summary
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <div>
                                      Weekly Working Hours:{" "}
                                      {values.totalHours.weekly.toFixed(1)}{" "}
                                      hours
                                    </div>
                                    <div>
                                      Weekly Break Hours:{" "}
                                      {(40 - values.totalHours.weekly).toFixed(
                                        1
                                      )}{" "}
                                      hours
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        />
                      </CardContent>
                    </Card>
                  )}
              </div>

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
                  <Button type="submit" size="lg" variant="default">
                    Save
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

export default ScheduleShiftModal;
