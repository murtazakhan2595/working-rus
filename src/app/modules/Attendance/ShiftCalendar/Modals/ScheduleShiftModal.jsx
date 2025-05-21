// src/app/modules/Attendance/ShiftCalendar/Modals/ScheduleShiftModal.jsx
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
import { saveShift } from "app/hooks/shiftManagement";

const ScheduleShiftModal = ({
  isOpen,
  setIsOpen,
  selectedDates = null,
  employees = [],
}) => {
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
        setShifts([
          { value: 1, label: "Morning Shift (9:00 AM - 6:00 PM)" },
          { value: 2, label: "Evening Shift (2:00 PM - 10:00 PM)" },
          { value: 3, label: "Night Shift (10:00 PM - 6:00 AM)" },
        ]);
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
    setFormData({
      ...ScheduleFormValues,
      dateRange: getInitialDateRange(),
      shiftType: usePredefinedShift ? "predefined" : "custom",
      employees: [],
      shiftId: "",
      dailySchedule: generateDailySchedule(getInitialDateRange()),
      totalHours: { daily: {}, weekly: 0 },
    });
  }, [isOpen]);

  // Helper to format just the time part (HH:MM) from an ISO string or moment
  function formatTimeOnly(timeStr) {
    if (!timeStr) return "null";

    // Convert to 24-hour format (HH:mm) regardless of the source format
    const time = moment(timeStr);
    return time.format("HH:mm");
  }

  // Helper to normalize moment times by stripping date info but preserving time
  function normalizeMomentTime(timeStr) {
    if (!timeStr) return null;

    const time = moment(timeStr);
    // Extract just hours and minutes from the time
    const hours = time.hours();
    const minutes = time.minutes();

    // Create a new moment with today's date but the same time
    return moment().startOf("day").hours(hours).minutes(minutes).toISOString();
  }

  // Helper function to group days by pattern
  function groupDaysByPattern(dailySchedule) {
    const offDays = [];
    const regularPatterns = {};
    const splitPatterns = {};

    dailySchedule.forEach((day) => {
      if (day.isOff) {
        offDays.push(day);
      } else if (day.isSplit) {
        // For split shifts, create a simplified pattern key that will group identical patterns
        // Remove timezone/date info to ensure proper grouping
        const timeKey = `${formatTimeOnly(
          day.splitStartTime1
        )}-${formatTimeOnly(day.splitEndTime1)}-${formatTimeOnly(
          day.splitStartTime2
        )}-${formatTimeOnly(day.splitEndTime2)}`;

        if (!splitPatterns[timeKey]) {
          splitPatterns[timeKey] = [];
        }
        splitPatterns[timeKey].push(day);
      } else {
        // For regular shifts, simplify the pattern key to just hours/minutes
        // This ensures shifts with same times but different dates group together
        const timeKey = `${formatTimeOnly(day.startTime)}-${formatTimeOnly(
          day.endTime
        )}`;

        if (!regularPatterns[timeKey]) {
          regularPatterns[timeKey] = [];
        }
        regularPatterns[timeKey].push(day);
      }
    });

    return {
      off: offDays,
      regular: regularPatterns,
      split: splitPatterns,
    };
  }

  // Helper function to get consecutive date ranges
  function getConsecutiveDateRanges(dates) {
    if (!dates || dates.length === 0) return [];

    // Sort dates
    const sortedDates = [...dates].sort();

    const ranges = [];
    let rangeStart = sortedDates[0];
    let rangeEnd = sortedDates[0];

    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = moment(sortedDates[i]);
      const previousDate = moment(rangeEnd);

      // Check if current date is consecutive with previous date
      if (currentDate.diff(previousDate, "days") === 1) {
        // It's consecutive, extend the current range
        rangeEnd = sortedDates[i];
      } else {
        // Not consecutive, save the current range and start a new one
        ranges.push({ start: rangeStart, end: rangeEnd });
        rangeStart = sortedDates[i];
        rangeEnd = sortedDates[i];
      }
    }

    // Add the last range
    ranges.push({ start: rangeStart, end: rangeEnd });

    return ranges;
  }

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

  const handleFormSubmit = async (values) => {
    setLoading(true);

    try {
      // Prepare schedule data
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

      console.log("Schedule Data:", scheduleData);

      // Track results
      const results = {
        success: [],
        failed: [],
      };

      // Handle predefined shifts
      if (!scheduleData.customShift) {
        // Set progress for predefined shifts
        setSavingProgress({
          total: scheduleData.employees.length,
          completed: 0,
        });

        // One schedule per employee for predefined shifts
        for (const employeeId of scheduleData.employees) {
          try {
            const payload = {
              employee: employeeId,
              shift: scheduleData.shiftId,
              start_date: scheduleData.dates[0],
              end_date: scheduleData.dates[scheduleData.dates.length - 1],
              is_split_shift: scheduleData.splitShift,
              is_off_day: false,
              status: "Pending",
              assigned_by: userProfile.id,
            };

            console.log("Creating predefined shift schedule:", payload);
            const response = await saveShiftSchedule(payload);

            if (response) {
              results.success.push(`Employee ${employeeId}`);
            } else {
              results.failed.push(`Employee ${employeeId}`);
            }
          } catch (error) {
            console.error(`Error scheduling employee ${employeeId}:`, error);
            results.failed.push(`Employee ${employeeId}`);
          }

          setSavingProgress((prev) => ({
            ...prev,
            completed: prev.completed + 1,
          }));
        }
      } else {
        // Handle custom shifts

        // Normalize the times to ensure consistent comparison
        const normalizedSchedule = scheduleData.dailySchedule.map((day) => {
          // Only process days that have times (not off days)
          if (!day.isOff) {
            if (day.isSplit) {
              return {
                ...day,
                splitStartTime1: day.splitStartTime1
                  ? normalizeMomentTime(day.splitStartTime1)
                  : null,
                splitEndTime1: day.splitEndTime1
                  ? normalizeMomentTime(day.splitEndTime1)
                  : null,
                splitStartTime2: day.splitStartTime2
                  ? normalizeMomentTime(day.splitStartTime2)
                  : null,
                splitEndTime2: day.splitEndTime2
                  ? normalizeMomentTime(day.splitEndTime2)
                  : null,
              };
            } else {
              return {
                ...day,
                startTime: day.startTime
                  ? normalizeMomentTime(day.startTime)
                  : null,
                endTime: day.endTime ? normalizeMomentTime(day.endTime) : null,
              };
            }
          }
          return day;
        });

        // Group days by pattern
        const { off, regular, split } = groupDaysByPattern(normalizedSchedule);

        console.log("PATTERN GROUPS:");
        console.log("Off days:", off);
        console.log("Regular patterns:", regular);
        console.log("Split patterns:", split);

        // Calculate total API calls
        const numRegularPatterns = Object.keys(regular).length;
        const numSplitPatterns = Object.keys(split).length;
        const hasOffDays = off.length > 0;

        console.log(`Number of regular patterns: ${numRegularPatterns}`);
        console.log(`Number of split patterns: ${numSplitPatterns}`);
        console.log(`Has off days: ${hasOffDays}`);

        const totalShifts = numRegularPatterns + numSplitPatterns;
        const totalSchedules =
          scheduleData.employees.length *
          (numRegularPatterns + numSplitPatterns + (hasOffDays ? 1 : 0));

        setSavingProgress({
          total: totalShifts + totalSchedules,
          completed: 0,
        });

        let progressCount = 0;

        // Process regular shifts
        for (const [patternKey, days] of Object.entries(regular)) {
          try {
            console.log(
              `Processing regular pattern: ${patternKey} with ${days.length} days`
            );
            console.log("Days in pattern:", days);

            // Create a shift for this pattern
            const shiftPayload = {
              name: `Regular Shift ${days[0].date.substring(5)} (${days
                .map((d) => d.day.toLowerCase())
                .join(",")})`,
              type: "Regular",
              weekdays: days.map((d) => d.day.toLowerCase()).join(","),
              starttime: days[0].startTime,
              endtime: days[0].endTime,
              Is_org_based: false,
              organization: userProfile.organization_id,
            };

            console.log("Creating shift:", shiftPayload);
            const shiftResponse = await saveShift(shiftPayload);
            progressCount++;
            setSavingProgress((prev) => ({
              ...prev,
              completed: progressCount,
            }));

            if (shiftResponse && shiftResponse.id) {
              const shiftId = shiftResponse.id;

              // Get date ranges
              const dateRanges = getConsecutiveDateRanges(
                days.map((d) => d.date)
              );
              console.log("Date ranges for pattern:", dateRanges);

              // Create schedules for each employee
              for (const employeeId of scheduleData.employees) {
                // For simplicity - when consecutive days have the same pattern,
                // create just one schedule spanning both days
                if (dateRanges.length === 1) {
                  const schedulePayload = {
                    employee: employeeId,
                    shift: shiftId,
                    start_date: dateRanges[0].start,
                    end_date: dateRanges[0].end,
                    is_split_shift: false,
                    is_off_day: false,
                    status: "Pending",
                    assigned_by: userProfile.id,
                  };

                  console.log("Creating schedule:", schedulePayload);
                  await saveShiftSchedule(schedulePayload);
                  results.success.push(
                    `Regular shift for Employee ${employeeId}`
                  );
                } else {
                  // Multiple non-consecutive ranges
                  for (const range of dateRanges) {
                    const schedulePayload = {
                      employee: employeeId,
                      shift: shiftId,
                      start_date: range.start,
                      end_date: range.end,
                      is_split_shift: false,
                      is_off_day: false,
                      status: "Pending",
                      assigned_by: userProfile.id,
                    };

                    console.log(
                      "Creating schedule for range:",
                      schedulePayload
                    );
                    await saveShiftSchedule(schedulePayload);
                    results.success.push(
                      `Regular shift for Employee ${employeeId} (${range.start} to ${range.end})`
                    );
                  }
                }

                progressCount++;
                setSavingProgress((prev) => ({
                  ...prev,
                  completed: progressCount,
                }));
              }
            }
          } catch (error) {
            console.error(`Error processing regular pattern:`, error);
            results.failed.push(`Regular shift pattern`);
            progressCount++;
            setSavingProgress((prev) => ({
              ...prev,
              completed: progressCount,
            }));
          }
        }

        // Process split shifts
        for (const [patternKey, days] of Object.entries(split)) {
          try {
            console.log(
              `Processing split pattern: ${patternKey} with ${days.length} days`
            );

            // Create a shift for this split pattern
            const firstDay = days[0];
            const shiftPayload = {
              name: `Split Shift ${firstDay.date.substring(5)} (${days
                .map((d) => d.day.toLowerCase())
                .join(",")})`,
              type: "Split",
              weekdays: days.map((d) => d.day.toLowerCase()).join(","),
              starttime: firstDay.splitStartTime1,
              endtime: firstDay.splitEndTime1, // First part of the split shift
              Is_org_based: false,
              organization: userProfile.organization_id,
            };

            console.log("Creating split shift:", shiftPayload);
            const shiftResponse = await saveShift(shiftPayload);
            progressCount++;
            setSavingProgress((prev) => ({
              ...prev,
              completed: progressCount,
            }));

            if (shiftResponse && shiftResponse.id) {
              const shiftId = shiftResponse.id;

              // Get date ranges
              const dateRanges = getConsecutiveDateRanges(
                days.map((d) => d.date)
              );

              // Create schedules for each employee
              for (const employeeId of scheduleData.employees) {
                for (const range of dateRanges) {
                  const schedulePayload = {
                    employee: employeeId,
                    shift: shiftId,
                    start_date: range.start,
                    end_date: range.end,
                    is_split_shift: true,
                    split_start_time: firstDay.splitStartTime2, // Second part start
                    split_end_time: firstDay.splitEndTime2, // Second part end
                    is_off_day: false,
                    status: "Pending",
                    assigned_by: userProfile.id,
                  };

                  console.log("Creating split schedule:", schedulePayload);
                  await saveShiftSchedule(schedulePayload);
                  results.success.push(
                    `Split shift for Employee ${employeeId} (${range.start} to ${range.end})`
                  );
                }

                progressCount++;
                setSavingProgress((prev) => ({
                  ...prev,
                  completed: progressCount,
                }));
              }
            }
          } catch (error) {
            console.error(`Error processing split pattern:`, error);
            results.failed.push(`Split shift pattern`);
            progressCount++;
            setSavingProgress((prev) => ({
              ...prev,
              completed: progressCount,
            }));
          }
        }

        // Process off days
        if (off.length > 0) {
          try {
            console.log(`Processing ${off.length} off days`);

            // Group off days into consecutive ranges
            const offDateRanges = getConsecutiveDateRanges(
              off.map((d) => d.date)
            );
            console.log("Off day ranges:", offDateRanges);

            // Create an off schedule for each employee for each date range
            for (const employeeId of scheduleData.employees) {
              for (const range of offDateRanges) {
                const offPayload = {
                  employee: employeeId,
                  shift: null, // No shift needed for off days
                  start_date: range.start,
                  end_date: range.end,
                  is_split_shift: false,
                  is_off_day: true,
                  status: "Pending",
                  assigned_by: userProfile.id,
                };

                console.log("Creating off day schedule:", offPayload);
                await saveShiftSchedule(offPayload);
                results.success.push(
                  `Off days for Employee ${employeeId} (${range.start} to ${range.end})`
                );
              }

              progressCount++;
              setSavingProgress((prev) => ({
                ...prev,
                completed: progressCount,
              }));
            }
          } catch (error) {
            console.error(`Error processing off days:`, error);
            results.failed.push(`Off days`);
            progressCount++;
            setSavingProgress((prev) => ({
              ...prev,
              completed: progressCount,
            }));
          }
        }
      }

      // Show results
      console.log("Save Results:", results);

      if (results.failed.length === 0) {
        toast.success("All shift schedules saved successfully");
      } else if (results.success.length === 0) {
        toast.error("Failed to save any shift schedules");
      } else {
        toast.warning(
          `Saved ${results.success.length} schedules, failed to save ${results.failed.length}`
        );
      }

      if (results.success.length > 0) {
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error saving shift schedule:", error);
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
      setSavingProgress({ total: 0, completed: 0 });
    }
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
                      : "Saving..."
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
