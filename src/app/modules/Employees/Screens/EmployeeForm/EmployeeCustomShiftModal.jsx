import React, { useState, useEffect } from "react";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import SheetComponent from "components/ui/CustomSheet";
import { Formik, FieldArray } from "formik";
import { Button } from "components/ui/button";
import {
  CheckBoxInput,
  DateRangeInput,
  TimePicker,
} from "components/FormControl";
import { toast } from "react-toastify";
import moment from "moment";
import { SheetCardExtension } from "components/SheetCardExtension";

const EmployeeCustomShiftModal = ({
  isOpen,
  setIsOpen,
  onShiftDataSave = () => {},
  existingShiftData = null,
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [isSplitShift, setIsSplitShift] = useState(false);
  const [formData, setFormData] = useState({
    dateRange: "",
    dailySchedule: [],
    totalHours: { daily: {}, weekly: 0 },
  });

  // Get initial date range (current week)
  const getInitialDateRange = () => {
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

  // Initialize form data
  useEffect(() => {
    if (isOpen) {
      if (existingShiftData) {
        // Load existing shift data
        setFormData(existingShiftData);
        setIsSplitShift(
          existingShiftData.dailySchedule.some((day) => day.isSplit)
        );
      } else {
        // Initialize with default values
        const initialDateRange = getInitialDateRange();
        setFormData({
          dateRange: initialDateRange,
          dailySchedule: generateDailySchedule(initialDateRange),
          totalHours: { daily: {}, weekly: 0 },
        });
      }
    }
  }, [isOpen, existingShiftData]);

  const handleClose = () => {
    setCloseSheet(true);
  };

  // Calculate hours with PM time correction
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
            const startTimeStr = start1.format("hh:mm A");
            const endTimeStr = end1.format("hh:mm A");

            const baseDate = moment(day.date).startOf("day");
            const correctedStart = moment(
              `${baseDate.format("YYYY-MM-DD")} ${startTimeStr}`,
              "YYYY-MM-DD hh:mm A"
            );
            const correctedEnd = moment(
              `${baseDate.format("YYYY-MM-DD")} ${endTimeStr}`,
              "YYYY-MM-DD hh:mm A"
            );

            if (correctedEnd.isBefore(correctedStart)) {
              correctedEnd.add(1, "day");
            }

            const hours1 = correctedEnd.diff(correctedStart, "hours", true);
            dayTotal += hours1;
          }

          if (day.splitStartTime2 && day.splitEndTime2) {
            const start2 = moment(day.splitStartTime2);
            const end2 = moment(day.splitEndTime2);
            const startTimeStr = start2.format("hh:mm A");
            const endTimeStr = end2.format("hh:mm A");

            const baseDate = moment(day.date).startOf("day");
            const correctedStart = moment(
              `${baseDate.format("YYYY-MM-DD")} ${startTimeStr}`,
              "YYYY-MM-DD hh:mm A"
            );
            const correctedEnd = moment(
              `${baseDate.format("YYYY-MM-DD")} ${endTimeStr}`,
              "YYYY-MM-DD hh:mm A"
            );

            if (correctedEnd.isBefore(correctedStart)) {
              correctedEnd.add(1, "day");
            }

            const hours2 = correctedEnd.diff(correctedStart, "hours", true);
            dayTotal += hours2;
          }
        } else {
          // Calculate hours for regular shift
          if (day.startTime && day.endTime) {
            const start = moment(day.startTime);
            const end = moment(day.endTime);
            const startTimeStr = start.format("hh:mm A");
            const endTimeStr = end.format("hh:mm A");

            const baseDate = moment(day.date).startOf("day");
            const correctedStart = moment(
              `${baseDate.format("YYYY-MM-DD")} ${startTimeStr}`,
              "YYYY-MM-DD hh:mm A"
            );
            const correctedEnd = moment(
              `${baseDate.format("YYYY-MM-DD")} ${endTimeStr}`,
              "YYYY-MM-DD hh:mm A"
            );

            if (correctedEnd.isBefore(correctedStart)) {
              correctedEnd.add(1, "day");
            }

            dayTotal = correctedEnd.diff(correctedStart, "hours", true);
          }
        }
      }

      // Validate max 9 hours per day
      if (dayTotal > 9) {
        const roundedTotal = Math.round(dayTotal * 100) / 100;
        if (roundedTotal > 9) {
          toast.error(`Working hours for ${day.day} exceeds 9 hours limit!`);
          dayTotal = 9;
        }
      }

      dailyHours[day.date] = dayTotal;
      weeklyTotal += dayTotal;
    });

    setFieldValue("totalHours", {
      daily: dailyHours,
      weekly: weeklyTotal,
    });
  };

  const validateForm = (values) => {
    const errors = {};

    if (!values.dateRange) {
      errors.dateRange = "Date range is required";
    }

    if (!values.dailySchedule || values.dailySchedule.length === 0) {
      errors.dailySchedule = "Daily schedule is required";
    } else {
      const dailyErrors = [];
      values.dailySchedule.forEach((day, index) => {
        const dayErrors = {};
        
        if (!day.isOff) {
          if (day.isSplit) {
            if (!day.splitStartTime1) dayErrors.splitStartTime1 = "Start time is required";
            if (!day.splitEndTime1) dayErrors.splitEndTime1 = "End time is required";
            if (!day.splitStartTime2) dayErrors.splitStartTime2 = "Start time is required";
            if (!day.splitEndTime2) dayErrors.splitEndTime2 = "End time is required";
          } else {
            if (!day.startTime) dayErrors.startTime = "Start time is required";
            if (!day.endTime) dayErrors.endTime = "End time is required";
          }
        }
        
        if (Object.keys(dayErrors).length > 0) {
          dailyErrors[index] = dayErrors;
        }
      });
      
      if (dailyErrors.length > 0) {
        errors.dailySchedule = dailyErrors;
      }
    }

    return errors;
  };

  const handleFormSubmit = async (values) => {
    try {
      // Format the shift data for the parent component
      const shiftData = {
        ...values,
        scheduleName: `Custom Schedule - ${moment(values.dateRange.split(",")[0]).format(
          "MMM DD"
        )}-${moment(values.dateRange.split(",")[1]).format("DD, YYYY")}`,
      };

      // Pass the shift data back to the parent component
      onShiftDataSave(shiftData);
      setIsOpen(false);
    } catch (error) {
      console.error("Error saving shift data:", error);
      toast.error("An error occurred while saving the shift data");
    }
  };

  const formSheetData = {
    title: "Configure Custom Shift Schedule",
    description: "Set up a detailed weekly schedule for the employee",
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
        contentClassName="custom-sheet-width"
        width="768px"
      >
        <Formik
          initialValues={formData}
          validate={validateForm}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              <SheetCardExtension title="Date Range">
                <div className="flex-1 space-y-2 mb-6">
                  <DateRangeInput
                    name="dateRange"
                    label="Schedule Date Range"
                    value={props.values.dateRange}
                    error={props.errors.dateRange}
                    touch={props.touched.dateRange}
                    onChange={(name, value) => {
                      props.setFieldValue(name, value);
                      const dailySchedule = generateDailySchedule(value);
                      props.setFieldValue("dailySchedule", dailySchedule);
                    }}
                    required={true}
                  />
                </div>
              </SheetCardExtension>

              {props.values.dateRange && props.values.dailySchedule.length > 0 && (
                <SheetCardExtension title="Daily Schedule Configuration">
                  <div className="flex items-center space-x-4 mb-4">
                    <CheckBoxInput
                      label="Split Shift (4.5 hr + 4.5 hr format)"
                      name="isSplitShift"
                      value={isSplitShift}
                      onChange={(name, value) => {
                        setIsSplitShift(value);
                        const updatedSchedule = props.values.dailySchedule.map(
                          (day) => ({
                            ...day,
                            isSplit: value,
                          })
                        );
                        props.setFieldValue("dailySchedule", updatedSchedule);
                      }}
                    />
                  </div>

                  <FieldArray
                    name="dailySchedule"
                    render={() => (
                      <div className="space-y-4">
                        {props.values.dailySchedule.map((day, index) => (
                          <div key={index} className="border p-4 rounded-md">
                            <div className="flex justify-between items-center mb-4">
                              <div className="font-medium">
                                {day.day} -{" "}
                                {moment(day.date).format("DD MMM YYYY")}
                              </div>
                              <CheckBoxInput
                                label="Mark as OFF"
                                name={`dailySchedule[${index}].isOff`}
                                value={day.isOff}
                                onChange={(name, value) => {
                                  props.setFieldValue(name, value);
                                  setTimeout(
                                    () =>
                                      calculateHours(
                                        props.values,
                                        props.setFieldValue
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
                                      error={props.errors.dailySchedule?.[index]?.startTime}
                                      touch={props.touched.dailySchedule?.[index]?.startTime}
                                      onChange={(name, value) => {
                                        props.setFieldValue(name, value);
                                        const updatedValues = {
                                          ...props.values,
                                          dailySchedule: props.values.dailySchedule.map((day, i) => 
                                            i === index ? { ...day, [name.split('.').pop()]: value } : day
                                          )
                                        };
                                        setTimeout(() => calculateHours(updatedValues, props.setFieldValue), 0);
                                      }}
                                      required={true}
                                    />
                                    <TimePicker
                                      name={`dailySchedule[${index}].endTime`}
                                      label="End Time"
                                      value={day.endTime}
                                      date={day.date}
                                      error={props.errors.dailySchedule?.[index]?.endTime}
                                      touch={props.touched.dailySchedule?.[index]?.endTime}
                                      onChange={(name, value) => {
                                        props.setFieldValue(name, value);
                                        const updatedValues = {
                                          ...props.values,
                                          dailySchedule: props.values.dailySchedule.map((day, i) => 
                                            i === index ? { ...day, [name.split('.').pop()]: value } : day
                                          )
                                        };
                                        setTimeout(() => calculateHours(updatedValues, props.setFieldValue), 0);
                                      }}
                                      required={true}
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <div className="mb-2 font-medium">Split Shift 1</div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                      <TimePicker
                                        name={`dailySchedule[${index}].splitStartTime1`}
                                        label="Start Time"
                                        value={day.splitStartTime1}
                                        date={day.date}
                                        error={props.errors.dailySchedule?.[index]?.splitStartTime1}
                                        touch={props.touched.dailySchedule?.[index]?.splitStartTime1}
                                        onChange={(name, value) => {
                                          props.setFieldValue(name, value);
                                          const updatedValues = {
                                            ...props.values,
                                            dailySchedule: props.values.dailySchedule.map((day, i) => 
                                              i === index ? { ...day, [name.split('.').pop()]: value } : day
                                            )
                                          };
                                          setTimeout(() => calculateHours(updatedValues, props.setFieldValue), 0);
                                        }}
                                        required={true}
                                      />
                                      <TimePicker
                                        name={`dailySchedule[${index}].splitEndTime1`}
                                        label="End Time"
                                        value={day.splitEndTime1}
                                        date={day.date}
                                        error={props.errors.dailySchedule?.[index]?.splitEndTime1}
                                        touch={props.touched.dailySchedule?.[index]?.splitEndTime1}
                                        onChange={(name, value) => {
                                          props.setFieldValue(name, value);
                                          const updatedValues = {
                                            ...props.values,
                                            dailySchedule: props.values.dailySchedule.map((day, i) => 
                                              i === index ? { ...day, [name.split('.').pop()]: value } : day
                                            )
                                          };
                                          setTimeout(() => calculateHours(updatedValues, props.setFieldValue), 0);
                                        }}
                                        required={true}
                                      />
                                    </div>
                                    <div className="mb-2 font-medium">Split Shift 2</div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <TimePicker
                                        name={`dailySchedule[${index}].splitStartTime2`}
                                        label="Start Time"
                                        value={day.splitStartTime2}
                                        date={day.date}
                                        error={props.errors.dailySchedule?.[index]?.splitStartTime2}
                                        touch={props.touched.dailySchedule?.[index]?.splitStartTime2}
                                        onChange={(name, value) => {
                                          props.setFieldValue(name, value);
                                          const updatedValues = {
                                            ...props.values,
                                            dailySchedule: props.values.dailySchedule.map((day, i) => 
                                              i === index ? { ...day, [name.split('.').pop()]: value } : day
                                            )
                                          };
                                          setTimeout(() => calculateHours(updatedValues, props.setFieldValue), 0);
                                        }}
                                        required={true}
                                      />
                                      <TimePicker
                                        name={`dailySchedule[${index}].splitEndTime2`}
                                        label="End Time"
                                        value={day.splitEndTime2}
                                        date={day.date}
                                        error={props.errors.dailySchedule?.[index]?.splitEndTime2}
                                        touch={props.touched.dailySchedule?.[index]?.splitEndTime2}
                                        onChange={(name, value) => {
                                          props.setFieldValue(name, value);
                                          const updatedValues = {
                                            ...props.values,
                                            dailySchedule: props.values.dailySchedule.map((day, i) => 
                                              i === index ? { ...day, [name.split('.').pop()]: value } : day
                                            )
                                          };
                                          setTimeout(() => calculateHours(updatedValues, props.setFieldValue), 0);
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
                                      props.setFieldValue(name, value);
                                      setTimeout(
                                        () =>
                                          calculateHours(
                                            props.values,
                                            props.setFieldValue
                                          ),
                                        0
                                      );
                                    }}
                                    disabled={isSplitShift}
                                  />
                                </div>
                              </>
                            )}

                            <div className="mt-4 text-sm">
                              <strong>Working Hours: </strong>
                              {props.values.totalHours.daily[day.date]
                                ? `${props.values.totalHours.daily[day.date].toFixed(1)} hours`
                                : day.isOff
                                ? "OFF"
                                : "0 hours"}
                            </div>
                          </div>
                        ))}

                        <div className="mt-6 p-4 bg-gray-100 rounded-md">
                          <div className="font-medium mb-2">Schedule Summary</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div>
                                Weekly Working Hours:{" "}
                                {props.values.totalHours.weekly.toFixed(1)} hours
                              </div>
                              <div>
                                Weekly Break Hours:{" "}
                                {(40 - props.values.totalHours.weekly).toFixed(1)} hours
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </SheetCardExtension>
              )}

              <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
                <Button
                  variant="outline"
                  type="button"
                  size="lg"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button type="submit" size="lg" variant="default">
                  Configure Schedule
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </SheetComponent>
    </>
  );
};

export default EmployeeCustomShiftModal; 