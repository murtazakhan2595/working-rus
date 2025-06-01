import React, { useState, useEffect } from "react";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import SheetComponent from "components/ui/CustomSheet";
import { Formik, FieldArray } from "formik";
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
import { SheetCardExtension } from "components/SheetCardExtension";
import { validateScheduleShiftFormSchema } from "app/utils/FormSchema/ShiftManagementFormSchema";
import { ScheduleFormValues } from "app/utils/Types/ShiftManagement";
import { getShift } from "app/hooks/attendance";
import { saveShiftSchedule } from "app/hooks/shiftManagement";

const ScheduleShiftModal = ({
  isOpen,
  setIsOpen,
  selectedDates = null,
  employees = [],
  onScheduleSuccess = () => {},
  editSchedule=null,
}) => {

  console.log("Edit Schedule Data:--------------------------------", employees);
  const isEditMode = Boolean(editSchedule);
  const [closeSheet, setCloseSheet] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [useCustomShift, setUseCustomShift] = useState(false);
  const [usePredefinedShift, setUsePredefinedShift] = useState(true);
  const [isSplitShift, setIsSplitShift] = useState(false);
  const [formData, setFormData] = useState(ScheduleFormValues);
  const [loading, setLoading] = useState(false);
  const [savingProgress, setSavingProgress] = useState({
    total: 0,
    completed: 0,
  });
  const userProfile = useSelector((state) => state.user.userProfile);
  // Add these functions inside the component, before the useEffect hooks

  // Transform edit schedule data to form format
  const transformEditDataToFormData = (editSchedule) => {
    const dateRange = `${editSchedule.start_date},${editSchedule.end_date}`;

    // Generate daily schedule from edit data
    const dailySchedule = generateDailyScheduleFromEdit(
      editSchedule,
      dateRange
    );

    return {
      dateRange: dateRange,
      shiftType: editSchedule.is_org_based ? "predefined" : "custom",
      employee: editSchedule.employee, // Single employee for edit mode
      employees: [editSchedule.employee], // Keep employees array for consistency
      shiftId: editSchedule.is_org_based ? editSchedule.shift : "",
      dailySchedule: dailySchedule,
      totalHours: { daily: {}, weekly: 0 },
    };
  };

  // Generate daily schedule from edit data
  const generateDailyScheduleFromEdit = (editSchedule, dateRange) => {
    const [startDate, endDate] = dateRange.split(",");
    const start = moment(startDate);
    const end = moment(endDate);
    const days = [];

    let current = start.clone();
    while (current.isSameOrBefore(end)) {
      const dateStr = current.format("YYYY-MM-DD");
      const dayData = {
        date: dateStr,
        day: current.format("ddd"),
        isOff: false,
        isSplit: false,
        startTime: null,
        endTime: null,
        splitStartTime1: null,
        splitEndTime1: null,
        splitStartTime2: null,
        splitEndTime2: null,
      };

      // If custom schedule exists, populate from it
      if (
        editSchedule.custom_schedule &&
        editSchedule.custom_schedule[dateStr]
      ) {
        const customDay = editSchedule.custom_schedule[dateStr];

        if (customDay.is_off) {
          dayData.isOff = true;
        } else if (customDay.is_split) {
          dayData.isSplit = true;
          dayData.splitStartTime1 = customDay.start_time_1
            ? moment(`${dateStr} ${customDay.start_time_1}`)
            : null;
          dayData.splitEndTime1 = customDay.end_time_1
            ? moment(`${dateStr} ${customDay.end_time_1}`)
            : null;
          dayData.splitStartTime2 = customDay.start_time_2
            ? moment(`${dateStr} ${customDay.start_time_2}`)
            : null;
          dayData.splitEndTime2 = customDay.end_time_2
            ? moment(`${dateStr} ${customDay.end_time_2}`)
            : null;
        } else {
          dayData.startTime = customDay.start_time
            ? moment(`${dateStr} ${customDay.start_time}`)
            : null;
          dayData.endTime = customDay.end_time
            ? moment(`${dateStr} ${customDay.end_time}`)
            : null;
        }
      }

      days.push(dayData);
      current.add(1, "day");
    }

    return days;
  };
  // Fetch shifts
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await getShift();
        if (response && response.results) {
          const formattedShifts = response.results.map((shift) => ({
            value: shift.id,
            label: `${shift.name} (${moment(shift.starttime).format(
              "h:mm a"
            )} - ${moment(shift.endtime).format("h:mm a")})`,
          }));
          setShifts(formattedShifts);
        }
      } catch (error) {
        console.error("Error fetching shifts:", error);
        toast.error("Failed to fetch shifts");
      }
    };

    if (isOpen) {
      fetchShifts();
    }
  }, [isOpen]);

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

  useEffect(() => {
    if (isEditMode && editSchedule) {
      // Edit mode: Transform edit data to form format
      const transformedData = transformEditDataToFormData(editSchedule);
      setFormData(transformedData);

      // Set UI state based on edit data
      setUsePredefinedShift(editSchedule.is_org_based);
      setUseCustomShift(!editSchedule.is_org_based);

      // Check if any day has split shift
      const hasSplitShift =
        editSchedule.custom_schedule &&
        Object.values(editSchedule.custom_schedule).some((day) => day.is_split);
      setIsSplitShift(hasSplitShift);
    } else {
      // Create mode: Use default values
      setFormData({
        ...ScheduleFormValues,
        dateRange: getInitialDateRange(),
        shiftType: usePredefinedShift ? "predefined" : "custom",
        employees: [],
        shiftId: "",
        dailySchedule: generateDailySchedule(getInitialDateRange()),
        totalHours: { daily: {}, weekly: 0 },
      });
    }
  }, [isOpen, isEditMode, editSchedule]);

  // calculateHours with PM time correction
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
            const startTimeStr = start1.format("hh:mm A"); // e.g. "09:00 AM"
            const endTimeStr = end1.format("hh:mm A"); // e.g. "05:00 PM"

            // Parse these time strings to get the correct hour (with AM/PM handling)
            const baseDate = moment(day.date).startOf("day");
            const correctedStart = moment(
              `${baseDate.format("YYYY-MM-DD")} ${startTimeStr}`,
              "YYYY-MM-DD hh:mm A"
            );
            const correctedEnd = moment(
              `${baseDate.format("YYYY-MM-DD")} ${endTimeStr}`,
              "YYYY-MM-DD hh:mm A"
            );

            // If end is before start, assume it spans to next day
            if (correctedEnd.isBefore(correctedStart)) {
              correctedEnd.add(1, "day");
            }

            const hours1 = correctedEnd.diff(correctedStart, "hours", true);
            dayTotal += hours1;
          }

          if (day.splitStartTime2 && day.splitEndTime2) {
            const start2 = moment(day.splitStartTime2);
            const end2 = moment(day.splitEndTime2);

            // Create new moment objects from the time strings displayed in the UI
            const startTimeStr = start2.format("hh:mm A");
            const endTimeStr = end2.format("hh:mm A");

            // Parse these time strings to get the correct hour (with AM/PM handling)
            const baseDate = moment(day.date).startOf("day");
            const correctedStart = moment(
              `${baseDate.format("YYYY-MM-DD")} ${startTimeStr}`,
              "YYYY-MM-DD hh:mm A"
            );
            const correctedEnd = moment(
              `${baseDate.format("YYYY-MM-DD")} ${endTimeStr}`,
              "YYYY-MM-DD hh:mm A"
            );

            // If end is before start, assume it spans to next day
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

            // Get the time in 12-hour format with AM/PM indicator
            const startTimeStr = start.format("hh:mm A"); // e.g. "09:00 AM"
            const endTimeStr = end.format("hh:mm A"); // e.g. "05:00 PM"

            // Parse these strings to get the correct hour (with proper AM/PM handling)
            const baseDate = moment(day.date).startOf("day");
            const correctedStart = moment(
              `${baseDate.format("YYYY-MM-DD")} ${startTimeStr}`,
              "YYYY-MM-DD hh:mm A"
            );
            const correctedEnd = moment(
              `${baseDate.format("YYYY-MM-DD")} ${endTimeStr}`,
              "YYYY-MM-DD hh:mm A"
            );

            // If end is before start, assume it spans to next day
            if (correctedEnd.isBefore(correctedStart)) {
              correctedEnd.add(1, "day");
            }

            // Calculate the correct hour difference
            dayTotal = correctedEnd.diff(correctedStart, "hours", true);
          }
        }
      }

      // Validate max 9 hours per day - only throw error if EXCEEDING 9 hours
      if (dayTotal > 9) {
        // Round to 2 decimal places for the comparison
        const roundedTotal = Math.round(dayTotal * 100) / 100;

        if (roundedTotal > 9) {
          toast.error(`Working hours for ${day.day} exceeds 9 hours limit!`);
          dayTotal = 9; // Cap at 9 hours
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

  const formatDateForBackend = (dateStr) => {
    return moment(dateStr).format("YYYY-MM-DD");
  };
  // Calculate total weekly hours from daily schedule
  const calculateTotalWeeklyHours = (dailySchedule) => {
    let totalHours = 0;
    dailySchedule.forEach((day) => {
      if (!day.isOff) {
        if (day.isSplit) {
          // Calculate split shift hours
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

            totalHours += correctedEnd.diff(correctedStart, "hours", true);
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

            totalHours += correctedEnd.diff(correctedStart, "hours", true);
          }
        } else {
          // Calculate regular shift hours
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

            totalHours += correctedEnd.diff(correctedStart, "hours", true);
          }
        }
      }
    });
    return Math.round(totalHours * 100) / 100; // Round to 2 decimal places
  };
      const formatTimeForBackend = (timeStr) => {
        if (!timeStr) return null;
        return moment(timeStr).format("HH:mm");
      };
  const handleFormSubmit = async (values) => {
    setLoading(true);
    // Helper function to format date for backend
    try {
      if (isEditMode) {
        // EDIT MODE: Update existing schedule
        const [startDate, endDate] = values.dateRange.split(",");

        let payload;

        if (values.shiftType === "predefined" && values.shiftId) {
          // Organization Shift Update
          const selectedShift = shifts.find((s) => s.value === values.shiftId);

          payload = {
            id: editSchedule.id,
            employee: editSchedule.employee, // Keep original employee
            shift: values.shiftId,
            schedule_name: `${
              selectedShift?.label || "Organization Shift"
            } - ${moment(startDate).format("MMM DD")}-${moment(endDate).format(
              "DD, YYYY"
            )}`,
            start_date: formatDateForBackend(startDate),
            end_date: formatDateForBackend(endDate),
            is_org_based: true,
            total_weekly_hours: "40.0",
            assigned_by: userProfile?.employee_id || userProfile?.id,
            status: "Pending", // Reset to pending after edit
            is_off_day: false,
          };
        } else {
          // Custom Shift Update
          const totalWeeklyHours = calculateTotalWeeklyHours(
            values.dailySchedule
          );

          // Build custom_schedule object
          const customSchedule = {};
          values.dailySchedule.forEach((day) => {
            if (day.isOff) {
              customSchedule[day.date] = {
                is_off: true,
              };
            } else if (day.isSplit) {
              customSchedule[day.date] = {
                is_off: false,
                is_split: true,
                start_time_1: formatTimeForBackend(day.splitStartTime1),
                end_time_1: formatTimeForBackend(day.splitEndTime1),
                start_time_2: formatTimeForBackend(day.splitStartTime2),
                end_time_2: formatTimeForBackend(day.splitEndTime2),
              };
            } else {
              customSchedule[day.date] = {
                is_off: false,
                is_split: false,
                start_time: formatTimeForBackend(day.startTime),
                end_time: formatTimeForBackend(day.endTime),
              };
            }
          });

          payload = {
            id: editSchedule.id,
            employee: editSchedule.employee, // Keep original employee
            shift: null,
            schedule_name: `Custom Schedule - ${moment(startDate).format(
              "MMM DD"
            )}-${moment(endDate).format("DD, YYYY")}`,
            start_date: formatDateForBackend(startDate),
            end_date: formatDateForBackend(endDate),
            is_org_based: false,
            custom_schedule: customSchedule,
            total_weekly_hours: totalWeeklyHours.toString(),
            assigned_by: userProfile?.employee_id || userProfile?.id,
            status: "Pending", // Reset to pending after edit
            is_off_day: values.dailySchedule.some((day) => day.isOff),
          };
        }

        console.log("Edit Payload:", payload);
        const response = await saveShiftSchedule(payload);

        if (response) {
          toast.success("Schedule updated successfully!");
          onScheduleSuccess();
        } else {
          toast.error("Failed to update schedule");
        }
      } else {
        // CREATE MODE: Original logic for multiple employees
        const selectedEmployeeIds = values.employees;
        const totalEmployees = selectedEmployeeIds.length;
        let completedRequests = 0;

        setSavingProgress({
          total: totalEmployees,
          completed: 0,
        });

        // Process each employee (existing create logic)
        for (const employeeId of selectedEmployeeIds) {
          let payload;

          if (values.shiftType === "predefined" && values.shiftId) {
            // Organization Shift Payload
            const [startDate, endDate] = values.dateRange.split(",");
            const selectedShift = shifts.find(
              (s) => s.value === values.shiftId
            );

            payload = {
              employee: employeeId,
              shift: values.shiftId,
              schedule_name: `${
                selectedShift?.label || "Organization Shift"
              } - ${moment(startDate).format("MMM DD")}-${moment(
                endDate
              ).format("DD, YYYY")}`,
              start_date: formatDateForBackend(startDate),
              end_date: formatDateForBackend(endDate),
              is_org_based: true,
              total_weekly_hours: "40.0",
              assigned_by: userProfile?.employee_id || userProfile?.id,
              status: "Pending",
              is_off_day: false,
            };
          } else {
            // Custom Shift Payload
            const [startDate, endDate] = values.dateRange.split(",");
            const totalWeeklyHours = calculateTotalWeeklyHours(
              values.dailySchedule
            );

            const customSchedule = {};
            values.dailySchedule.forEach((day) => {
              if (day.isOff) {
                customSchedule[day.date] = {
                  is_off: true,
                };
              } else if (day.isSplit) {
                customSchedule[day.date] = {
                  is_off: false,
                  is_split: true,
                  start_time_1: formatTimeForBackend(day.splitStartTime1),
                  end_time_1: formatTimeForBackend(day.splitEndTime1),
                  start_time_2: formatTimeForBackend(day.splitStartTime2),
                  end_time_2: formatTimeForBackend(day.splitEndTime2),
                };
              } else {
                customSchedule[day.date] = {
                  is_off: false,
                  is_split: false,
                  start_time: formatTimeForBackend(day.startTime),
                  end_time: formatTimeForBackend(day.endTime),
                };
              }
            });

            payload = {
              employee: employeeId,
              shift: null,
              schedule_name: `Custom Schedule - ${moment(startDate).format(
                "MMM DD"
              )}-${moment(endDate).format("DD, YYYY")}`,
              start_date: formatDateForBackend(startDate),
              end_date: formatDateForBackend(endDate),
              is_org_based: false,
              custom_schedule: customSchedule,
              total_weekly_hours: totalWeeklyHours.toString(),
              assigned_by: userProfile?.employee_id || userProfile?.id,
              status: "Pending",
              is_off_day: values.dailySchedule.some((day) => day.isOff),
            };
          }

          console.log(`Payload for Employee ${employeeId}:`, payload);
          const response = await saveShiftSchedule(payload);

          if (response) {
            completedRequests++;
            setSavingProgress({
              total: totalEmployees,
              completed: completedRequests,
            });
            console.log(
              `Successfully saved schedule for employee ${employeeId}`
            );
          } else {
            toast.error(`Failed to save schedule for employee ${employeeId}`);
            console.error(`Failed to save schedule for employee ${employeeId}`);
          }
        }

        // Show success message for create mode
        if (completedRequests === totalEmployees) {
          toast.success(
            `Successfully scheduled shifts for ${completedRequests} employee(s)`
          );
          onScheduleSuccess();
        } else {
          toast.warning(
            `Scheduled shifts for ${completedRequests} out of ${totalEmployees} employees`
          );
        }
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("An error occurred while saving the schedule");
    } finally {
      setLoading(false);
      setIsOpen(false);
      setCloseSheet(false);
      setSavingProgress({
        total: 0,
        completed: 0,
      });
    }
  };

  const formSheetData = {
    title: isEditMode? "Edit Shift Schedule" : "Schedule Shift",
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
        contentClassName="custom-sheet-width"
        width="768px"
      >
        <Formik
          initialValues={formData}
          validate={validateScheduleShiftFormSchema}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              <SheetCardExtension title="Date Range & Employee Selection">
                <div className="flex-1 space-y-2 mb-6">
                  <DateRangeInput
                    name="dateRange"
                    label="Date Range"
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

                {isEditMode ? (
                  <div className="flex-1 space-y-2 ">
                    <SelectInputComponent
                      name="employee"
                      label="Employee (Cannot be changed)"
                      options={employees.map((emp) => ({
                        value: emp.id,
                        label: `${emp.first_name} ${emp.last_name}`,
                      }))}
                      value={editSchedule.employee}
                      disabled={true}
                      required={true}
                    />
                  </div>
                ) : (
                  <div className="flex-1 space-y-2 ">
                    <SelectMultiInputComponent
                      name="employees"
                      label="Select Employees"
                      options={employees.map((emp) => ({
                        value: emp.id,
                        label: `${emp.first_name} ${emp.last_name}`,
                      }))}
                      value={props.values.employees}
                      error={props.errors.employees}
                      touch={props.touched.employees}
                      onChange={props.setFieldValue}
                      required={true}
                      showSelectedValuesBelow={true}
                    />
                  </div>
                )}
              </SheetCardExtension>

              <SheetCardExtension title="Shift Type">
                <div className="flex flex-col gap-4">
                  <CheckBoxInput
                    label="Choose Shift (from pre-defined organization shifts)"
                    name="usePredefinedShift"
                    value={usePredefinedShift}
                    onChange={(name, value) => {
                      setUsePredefinedShift(value);
                      setUseCustomShift(!value);
                      props.setFieldValue(
                        "shiftType",
                        value ? "predefined" : "custom"
                      );
                    }}
                  />

                  {usePredefinedShift && (
                    <div className="flex-1 space-y-2 mb-6">
                      <SelectInputComponent
                        name="shiftId"
                        label="Select Shift"
                        options={shifts}
                        value={props.values.shiftId}
                        error={props.errors.shiftId}
                        touch={props.touched.shiftId}
                        onChange={props.setFieldValue}
                        required={true}
                      />
                    </div>
                  )}

                  <CheckBoxInput
                    label="Custom Shift"
                    name="useCustomShift"
                    value={useCustomShift}
                    onChange={(name, value) => {
                      setUseCustomShift(value);
                      setUsePredefinedShift(!value);
                      props.setFieldValue(
                        "shiftType",
                        value ? "custom" : "predefined"
                      );
                    }}
                  />
                </div>
              </SheetCardExtension>

              {useCustomShift &&
                props.values.dateRange &&
                props.values.dailySchedule.length > 0 && (
                  <SheetCardExtension title="Custom Shift Schedule">
                    <div className="flex items-center space-x-4 mb-4">
                      <CheckBoxInput
                        label="Split Shift (4.5 hr + 4.5 hr format)"
                        name="isSplitShift"
                        value={isSplitShift}
                        onChange={(name, value) => {
                          setIsSplitShift(value);
                          // Update all days with the split shift setting
                          const updatedSchedule =
                            props.values.dailySchedule.map((day) => ({
                              ...day,
                              isSplit: value,
                            }));
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
                                <div className=" font-medium">
                                  {day.day} -{" "}
                                  {moment(day.date).format("DD MMM YYYY")}
                                </div>
                                <CheckBoxInput
                                  label="Mark as OFF"
                                  name={`dailySchedule[${index}].isOff`}
                                  value={day.isOff}
                                  onChange={(name, value) => {
                                    props.setFieldValue(name, value);
                                    // Recalculate hours after toggling OFF
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
                                        onChange={(name, value) => {
                                          props.setFieldValue(name, value);
                                          // Recalculate hours after time change
                                          setTimeout(
                                            () =>
                                              calculateHours(
                                                props.values,
                                                props.setFieldValue
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
                                          props.setFieldValue(name, value);
                                          // Recalculate hours after time change
                                          setTimeout(
                                            () =>
                                              calculateHours(
                                                props.values,
                                                props.setFieldValue
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
                                          required={true}
                                        />
                                        <TimePicker
                                          name={`dailySchedule[${index}].splitEndTime1`}
                                          label="End Time"
                                          value={day.splitEndTime1}
                                          date={day.date}
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
                                          required={true}
                                        />
                                        <TimePicker
                                          name={`dailySchedule[${index}].splitEndTime2`}
                                          label="End Time"
                                          value={day.splitEndTime2}
                                          date={day.date}
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
                                      disabled={isSplitShift} // Disable if global split shift is enabled
                                    />
                                  </div>
                                </>
                              )}

                              {/* Display daily hours */}
                              <div className="mt-4 text-sm">
                                <strong>Working Hours: </strong>
                                {props.values.totalHours.daily[day.date]
                                  ? `${props.values.totalHours.daily[
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
                            <div className="font-medium mb-2">
                              Break Summary
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div>
                                  Weekly Working Hours:{" "}
                                  {props.values.totalHours.weekly.toFixed(1)}{" "}
                                  hours
                                </div>
                                <div>
                                  Weekly Break Hours:{" "}
                                  {(
                                    40 - props.values.totalHours.weekly
                                  ).toFixed(1)}{" "}
                                  hours
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
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  variant="default"
                  disabled={loading}
                >
                  {loading
                    ? savingProgress.total > 0
                      ? `Saving... (${savingProgress.completed}/${savingProgress.total})`
                      : isEditMode
                      ? "Updating..."
                      : "Saving..."
                    : isEditMode
                    ? "Update Schedule"
                    : "Save"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </SheetComponent>
    </>
  );
};

export default ScheduleShiftModal;
