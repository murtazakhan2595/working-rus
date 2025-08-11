// src/app/modules/Attendance/ShiftCalendar/Modals/ShiftChangeRequestModal.jsx
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
import { useSelector } from "react-redux";
import moment from "moment";
import { SheetCardExtension } from "components/SheetCardExtension";
import { EmployeeOverview } from "components";
import { getShiftSchedule, saveShiftSchedule } from "app/hooks/shiftManagement";
import { getShiftById, employeeData } from "app/hooks/attendance";
import { generateShiftScheduleLog, parseShiftTime } from "../Section/getEmployeeActiveShift";
import { HasAccess } from "utils/PermissionUtils";



const ShiftChangeRequestModal = ({
  isOpen,
  setIsOpen,
  employee,
  reload,
  shift_requested, // Manager, Employee
}) => {
  const isEditEmployeeShiftPermitted = HasAccess("EDIT_EMPLOYEE_SHIFT");
  const [closeSheet, setCloseSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingShifts, setFetchingShifts] = useState(false);
  const [fetchProgress, setFetchProgress] = useState({ current: 0, total: 0 });
  const userProfile = useSelector((state) => state.user.userProfile);

  const [formData, setFormData] = useState({
    dateRange: "",
    dailySchedule: [],
    totalHours: { daily: {}, weekly: 0 },
  });

  const handleClose = () => {
    setCloseSheet(true);
  };

  // Generate daily schedule with assigned shift info
  const generateDailyScheduleWithShifts = async (dateRange, employeeId) => {
    if (!dateRange || dateRange.split(",").length !== 2) return [];
    const [startDate, endDate] = dateRange.split(",");
    setFetchingShifts(true);
    try {
      // Fetch approved shift schedules for the date range
      const response = await getShiftSchedule({
        filterData: {
          employee: employeeId,
          end_date_gte: startDate,
          start_date_lte: endDate,
          status: "APPROVED",
          is_change_request: "true,false",
        },
        ordering: "-id",
      });

      const shiftSchedules = response?.results || [];

      // If no shift schedules found, fetch direct org shift
      let directOrgShift = null;
      if (response?.count === 0) {
        // Need to get employee data to get shift_management field
        const empData = await employeeData(employeeId);

        if (empData?.shift_assignment) {
          directOrgShift = await getShiftById(empData.shift_assignment);

          if (!directOrgShift) {
            toast.error("No shift assigned to this employee");
            throw new Error("No shift assigned to employee");
          }
        } else {
          toast.error("Employee has no shift assignment");
          throw new Error("Employee has no shift assignment");
        }
      }

      // Generate daily schedule
      const start = moment(startDate);
      const end = moment(endDate);
      const days = [];

      let current = start.clone();
      while (current.isSameOrBefore(end)) {
        const dateStr = current.format("YYYY-MM-DD");

        // Find if this date is covered by any shift schedule
        const coveringSchedule = shiftSchedules.find((schedule) => {
          const scheduleStart = moment(schedule.start_date);
          const scheduleEnd = moment(schedule.end_date);
          return current.isBetween(scheduleStart, scheduleEnd, "day", "[]");
        });

        const dayData = {
          date: dateStr,
          day: current.format("ddd"),

          // Assigned shift info
          assignedShift: {
            source: "none",
            scheduleId: null,
            shiftId: null,
          },
          assignedIsOff: false,
          assignedIsSplit: false,
          assignedStartTime: null,
          assignedEndTime: null,
          assignedSplitStart1: null,
          assignedSplitEnd1: null,
          assignedSplitStart2: null,
          assignedSplitEnd2: null,

          // Initialize requested with same as assigned (will be populated below)
          requestedIsOff: false,
          requestedIsSplit: false,
          requestedStartTime: null,
          requestedEndTime: null,
          requestedSplitStart1: null,
          requestedSplitEnd1: null,
          requestedSplitStart2: null,
          requestedSplitEnd2: null,
        };

        if (coveringSchedule) {
          // Handle scheduled shifts (custom or org-based schedules)
          if (coveringSchedule.is_org_based) {
            dayData.assignedShift = {
              source: "scheduled_org",
              scheduleId: coveringSchedule.id,
              shiftId: coveringSchedule.shift,
            };

            // Extract times from shift_details if available
            if (coveringSchedule.shift_details) {
              // ✅ FIXED: Use coveringSchedule.shift_details, not directOrgShift
              dayData.assignedStartTime = parseShiftTime(
                coveringSchedule.shift_details.starttime
              );
              dayData.assignedEndTime = parseShiftTime(
                coveringSchedule.shift_details.endtime
              );
            } else {
              // If shift_details not available, we might need to fetch the shift
              console.warn(
                "Org-based schedule missing shift_details, times will be empty"
              );
            }
          } else if (
            coveringSchedule.custom_schedule &&
            coveringSchedule.custom_schedule[dateStr]
          ) {
            // Handle custom scheduled shifts
            const customDay = coveringSchedule.custom_schedule[dateStr];

            dayData.assignedShift = {
              source: "scheduled_custom",
              scheduleId: coveringSchedule.id,
              shiftId: null,
            };

            if (customDay.is_off) {
              dayData.assignedIsOff = true;
            } else if (customDay.is_split) {
              dayData.assignedIsSplit = true;
              dayData.assignedSplitStart1 = customDay.start_time_1;
              dayData.assignedSplitEnd1 = customDay.end_time_1;
              dayData.assignedSplitStart2 = customDay.start_time_2;
              dayData.assignedSplitEnd2 = customDay.end_time_2;
            } else {
              dayData.assignedStartTime = customDay.start_time;
              dayData.assignedEndTime = customDay.end_time;
            }
          }
        } else if (directOrgShift) {
          // No scheduled shift found, use direct org shift assignment
          // Apply the same shift timing to all days
          dayData.assignedShift = {
            source: "direct_assignment",
            scheduleId: null,
            shiftId: directOrgShift.id,
          };

          dayData.assignedStartTime = parseShiftTime(directOrgShift.starttime);
          dayData.assignedEndTime = parseShiftTime(directOrgShift.endtime);
        }

        // Initialize requested with assigned values
        dayData.requestedIsOff = dayData.assignedIsOff;
        dayData.requestedIsSplit = dayData.assignedIsSplit;

        // Convert time strings to moment objects with date
        if (dayData.assignedStartTime) {
          dayData.requestedStartTime = moment(
            `${dateStr} ${dayData.assignedStartTime}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString();
        }
        if (dayData.assignedEndTime) {
          dayData.requestedEndTime = moment(
            `${dateStr} ${dayData.assignedEndTime}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString();
        }

        // Handle split shifts
        if (dayData.assignedSplitStart1) {
          dayData.requestedSplitStart1 = moment(
            `${dateStr} ${dayData.assignedSplitStart1}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString();
        }
        if (dayData.assignedSplitEnd1) {
          dayData.requestedSplitEnd1 = moment(
            `${dateStr} ${dayData.assignedSplitEnd1}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString();
        }
        if (dayData.assignedSplitStart2) {
          dayData.requestedSplitStart2 = moment(
            `${dateStr} ${dayData.assignedSplitStart2}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString();
        }
        if (dayData.assignedSplitEnd2) {
          dayData.requestedSplitEnd2 = moment(
            `${dateStr} ${dayData.assignedSplitEnd2}`,
            "YYYY-MM-DD HH:mm"
          ).toISOString();
        }

        days.push(dayData);
        current.add(1, "day");
      }

      return days;
    } catch (error) {
      console.error("Error generating daily schedule:", error);
      return [];
    } finally {
      setFetchingShifts(false);
    }
  };

  // Helper function for calculating hours from time strings (for display only)
  const calculateHoursFromTimeStrings = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = moment(startTime, "HH:mm");
    const end = moment(endTime, "HH:mm");

    if (end.isBefore(start)) {
      end.add(1, "day");
    }

    return end.diff(start, "hours", true);
  };

  // Add this new function with safety check
  const calculateHours = (values, setFieldValue) => {
    const dailyHours = {};
    let weeklyTotal = 0;

    // MINIMAL FIX: Add safety check
    if (!values.dailySchedule || !Array.isArray(values.dailySchedule)) {
      return;
    }

    values.dailySchedule.forEach((day) => {
      let dayTotal = 0;

      if (!day.requestedIsOff) {
        if (day.requestedIsSplit) {
          // Calculate hours for split shift
          if (day.requestedSplitStart1 && day.requestedSplitEnd1) {
            const start1 = moment(day.requestedSplitStart1);
            const end1 = moment(day.requestedSplitEnd1);
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

          if (day.requestedSplitStart2 && day.requestedSplitEnd2) {
            const start2 = moment(day.requestedSplitStart2);
            const end2 = moment(day.requestedSplitEnd2);
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
          if (day.requestedStartTime && day.requestedEndTime) {
            const start = moment(day.requestedStartTime);
            const end = moment(day.requestedEndTime);
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

      // Validate max 9 hours per day - only throw error if EXCEEDING 9 hours
      if (dayTotal > 9) {
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

  // Replace the existing handleFormSubmit function
  const handleFormSubmit = async (values) => {
    setLoading(true);

    try {
      const [requestedStartDate, requestedEndDate] =
        values.dateRange.split(",");

      // Step 1: Find all overlapping approved schedules
      const overlappingSchedules = await getShiftSchedule({
        filterData: {
          employee: employee.id,
          end_date_gte: requestedStartDate,
          start_date_lte: requestedEndDate,
          status: "Approved",
          is_change_request: "true,false",
        },
        ordering: "start_date",
      });

      // Step 2: Determine the actual date range to include
      let actualStartDate = moment(requestedStartDate);
      let actualEndDate = moment(requestedEndDate);

      // Expand date range to include all days from overlapping schedules
      if (
        overlappingSchedules?.results &&
        overlappingSchedules.results.length > 0
      ) {
        overlappingSchedules.results.forEach((schedule) => {
          const scheduleStart = moment(schedule.start_date);
          const scheduleEnd = moment(schedule.end_date);

          // Expand to include the full range of any overlapping schedule
          if (scheduleStart.isBefore(actualStartDate)) {
            actualStartDate = scheduleStart.clone();
          }
          if (scheduleEnd.isAfter(actualEndDate)) {
            actualEndDate = scheduleEnd.clone();
          }
        });
      }

      // Step 3: Generate complete daily schedule for the expanded range
      const completeDailySchedule = await generateDailyScheduleWithShifts(
        `${actualStartDate.format("YYYY-MM-DD")},${actualEndDate.format(
          "YYYY-MM-DD"
        )}`,
        employee.id
      );

      // Step 4: Build custom_schedule object including ALL days
      const customSchedule = {};
      let hasChanges = false;
      const changedDays = [];

      completeDailySchedule.forEach((day) => {
        // Find if this day was in the original request
        const requestedDay = values.dailySchedule.find(
          (d) => d.date === day.date
        );

        if (requestedDay) {
          // This day was in the requested range - use requested values
          const requestedStartTime = requestedDay.requestedStartTime
            ? moment(requestedDay.requestedStartTime).format("HH:mm")
            : null;
          const requestedEndTime = requestedDay.requestedEndTime
            ? moment(requestedDay.requestedEndTime).format("HH:mm")
            : null;
          const requestedSplitStart1 = requestedDay.requestedSplitStart1
            ? moment(requestedDay.requestedSplitStart1).format("HH:mm")
            : null;
          const requestedSplitEnd1 = requestedDay.requestedSplitEnd1
            ? moment(requestedDay.requestedSplitEnd1).format("HH:mm")
            : null;
          const requestedSplitStart2 = requestedDay.requestedSplitStart2
            ? moment(requestedDay.requestedSplitStart2).format("HH:mm")
            : null;
          const requestedSplitEnd2 = requestedDay.requestedSplitEnd2
            ? moment(requestedDay.requestedSplitEnd2).format("HH:mm")
            : null;

          // Check if there are changes
          const hasChange =
            requestedDay.requestedIsOff !== day.assignedIsOff ||
            requestedDay.requestedIsSplit !== day.assignedIsSplit ||
            requestedStartTime !== day.assignedStartTime ||
            requestedEndTime !== day.assignedEndTime ||
            requestedSplitStart1 !== day.assignedSplitStart1 ||
            requestedSplitEnd1 !== day.assignedSplitEnd1 ||
            requestedSplitStart2 !== day.assignedSplitStart2 ||
            requestedSplitEnd2 !== day.assignedSplitEnd2;

          if (hasChange) {
            hasChanges = true;
            changedDays.push(day.date);
          }

          // Add to custom schedule
          if (requestedDay.requestedIsOff) {
            customSchedule[day.date] = {
              is_off: true,
            };
          } else if (requestedDay.requestedIsSplit) {
            customSchedule[day.date] = {
              is_off: false,
              is_split: true,
              start_time_1: requestedSplitStart1,
              end_time_1: requestedSplitEnd1,
              start_time_2: requestedSplitStart2,
              end_time_2: requestedSplitEnd2,
            };
          } else {
            customSchedule[day.date] = {
              is_off: false,
              is_split: false,
              start_time: requestedStartTime || day.assignedStartTime,
              end_time: requestedEndTime || day.assignedEndTime,
            };
          }
        } else {
          // This day was not in requested range - keep original values
          if (day.assignedIsOff) {
            customSchedule[day.date] = {
              is_off: true,
            };
          } else if (day.assignedIsSplit) {
            customSchedule[day.date] = {
              is_off: false,
              is_split: true,
              start_time_1: day.assignedSplitStart1,
              end_time_1: day.assignedSplitEnd1,
              start_time_2: day.assignedSplitStart2,
              end_time_2: day.assignedSplitEnd2,
            };
          } else if (day.assignedStartTime && day.assignedEndTime) {
            customSchedule[day.date] = {
              is_off: false,
              is_split: false,
              start_time: day.assignedStartTime,
              end_time: day.assignedEndTime,
            };
          } else {
            // No shift assigned for this day
            customSchedule[day.date] = {
              is_off: true,
            };
          }
        }
      });

      if (!hasChanges) {
        toast.warning("No changes were made to the shift schedule");
        setLoading(false);
        return;
      }

      // Calculate total weekly hours for the complete schedule
      const calculateTotalWeeklyHours = () => {
        let totalHours = 0;

        Object.entries(customSchedule).forEach(([date, daySchedule]) => {
          if (!daySchedule.is_off) {
            if (daySchedule.is_split) {
              // Calculate split shift hours
              if (daySchedule.start_time_1 && daySchedule.end_time_1) {
                const start1 = moment(
                  `${date} ${daySchedule.start_time_1}`,
                  "YYYY-MM-DD HH:mm"
                );
                const end1 = moment(
                  `${date} ${daySchedule.end_time_1}`,
                  "YYYY-MM-DD HH:mm"
                );
                if (end1.isBefore(start1)) {
                  end1.add(1, "day");
                }
                const hours1 = end1.diff(start1, "hours", true);
                totalHours += hours1;
              }

              if (daySchedule.start_time_2 && daySchedule.end_time_2) {
                const start2 = moment(
                  `${date} ${daySchedule.start_time_2}`,
                  "YYYY-MM-DD HH:mm"
                );
                const end2 = moment(
                  `${date} ${daySchedule.end_time_2}`,
                  "YYYY-MM-DD HH:mm"
                );
                if (end2.isBefore(start2)) {
                  end2.add(1, "day");
                }
                const hours2 = end2.diff(start2, "hours", true);
                totalHours += hours2;
              }
            } else {
              // Calculate regular shift hours
              if (daySchedule.start_time && daySchedule.end_time) {
                const start = moment(
                  `${date} ${daySchedule.start_time}`,
                  "YYYY-MM-DD HH:mm"
                );
                const end = moment(
                  `${date} ${daySchedule.end_time}`,
                  "YYYY-MM-DD HH:mm"
                );
                if (end.isBefore(start)) {
                  end.add(1, "day");
                }
                const hours = end.diff(start, "hours", true);
                totalHours += hours;
              }
            }
          }
        });

        return totalHours.toFixed(1);
      };

      // Create shift change request payload
      const payload = {
        employee: employee.id,
        shift: null, // Always null for change requests
        schedule_name: `Shift Change Request - ${actualStartDate.format(
          "MMM DD"
        )}-${actualEndDate.format("DD, YYYY")}`,
        start_date: actualStartDate.format("YYYY-MM-DD"),
        end_date: actualEndDate.format("YYYY-MM-DD"),
        is_org_based: false,
        custom_schedule: customSchedule, // Now includes ALL days from original schedules
        total_weekly_hours: calculateTotalWeeklyHours(),
        assigned_by: userProfile?.id,
        status: isEditEmployeeShiftPermitted ? "Approved" : "Pending",
        approved_by: isEditEmployeeShiftPermitted ? userProfile?.id : null,
        is_off_day: Object.values(customSchedule).some((day) => day.is_off),
        // Additional fields to identify this as a change request
        is_change_request: "true",
        shift_requested: shift_requested,
        // Metadata about the request
        changed_days: changedDays,
        requested_date_range: `${requestedStartDate},${requestedEndDate}`,
      };

      if (isEditEmployeeShiftPermitted) {
        await generateShiftScheduleLog({
          scheduleData: payload,
          logType: "Manual Assignment",
          userProfile: userProfile,
          status: "Approved",
        });
      }

      const response = await saveShiftSchedule(payload);

      if (response) {
        toast.success("Shift change request submitted successfully!");
        reload();
        setIsOpen(false);
        setCloseSheet(false);
        // Reset form data
        setFormData({
          dateRange: "",
          dailySchedule: [],
        });
      } else {
        toast.error("Failed to submit shift change request");
      }
    } catch (error) {
      console.error("Error submitting shift change request:", error);
      toast.error("An error occurred while submitting the request");
    } finally {
      setLoading(false);
    }
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
        contentClassName="custom-sheet-width"
        width="968px"
      >
        <Formik
          initialValues={formData}
          enableReinitialize={true}
          onSubmit={handleFormSubmit}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
              {/* Employee Information */}
              <SheetCardExtension title="Employee Information">
                <EmployeeOverview
                  id={employee?.id}
                  showEmail={true}
                  showDepartment={true}
                  showPosition={true}
                  showBranchName={true}
                />
              </SheetCardExtension>

              {/* Date Range Selection */}
              <SheetCardExtension title="Select Dates for Shift Change">
                <div className="flex-1 space-y-2 mb-6">
                  <DateRangeInput
                    name="dateRange"
                    label="Date Range"
                    value={props.values.dateRange}
                    error={props.errors.dateRange}
                    touch={props.touched.dateRange}
                    onChange={async (name, value) => {
                      props.setFieldValue(name, value);
                      // Fetch shift data for selected dates
                      const dailySchedule =
                        await generateDailyScheduleWithShifts(
                          value,
                          employee.id
                        );
                      props.setFieldValue("dailySchedule", dailySchedule);

                      // Calculate initial hours
                      setTimeout(() => {
                        const updatedValues = {
                          ...props.values,
                          dailySchedule,
                        };
                        calculateHours(updatedValues, props.setFieldValue);
                      }, 100);
                    }}
                    required={true}
                    minDate={moment().format("YYYY-MM-DD")} // Future dates only
                    maxDate={moment().add(3, "months").format("YYYY-MM-DD")} // Limit to 3 months in future
                  />
                </div>
              </SheetCardExtension>

              {/* Shift Change Details */}
              {props.values.dateRange &&
                props.values.dailySchedule.length > 0 && (
                  <SheetCardExtension title="Shift Change Details">
                    {fetchingShifts ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-sm text-muted-1100">
                          Fetching current shift details...
                        </p>
                      </div>
                    ) : (
                      <FieldArray
                        name="dailySchedule"
                        render={() => (
                          <div className="space-y-6">
                            {props.values.dailySchedule.map((day, index) => (
                              <div
                                key={index}
                                className="border rounded-lg p-4"
                              >
                                <div className="mb-4">
                                  <h4 className="font-semibold text-lg">
                                    {day.day} -{" "}
                                    {moment(day.date).format("DD MMM YYYY")}
                                  </h4>
                                </div>

                                {/* Section 1: Assigned Shift Details */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-md">
                                  <div className="font-medium mb-3">
                                    Current Assigned Shift
                                  </div>
                                  <div className="text-sm space-y-1">
                                    <p>
                                      <span className="font-medium">
                                        Source:
                                      </span>{" "}
                                      {day.assignedShift.source ===
                                        "scheduled_org" &&
                                        `Organization Schedule `}
                                      {day.assignedShift.source ===
                                        "scheduled_custom" &&
                                        `Custom Schedule `}
                                      {day.assignedShift.source ===
                                        "direct_assignment" &&
                                        `Direct Assignment )`}
                                      {day.assignedShift.source === "none" &&
                                        "No Shift Assigned"}
                                    </p>
                                    {day.assignedIsOff ? (
                                      <p className="text-blue-600 font-medium">
                                        OFF Day
                                      </p>
                                    ) : day.assignedShift.source !== "none" ? (
                                      <>
                                        {day.assignedIsSplit ? (
                                          <>
                                            <p>
                                              <span className="font-medium">
                                                Split Shift 1:
                                              </span>{" "}
                                              {day.assignedSplitStart1} -{" "}
                                              {day.assignedSplitEnd1}
                                            </p>
                                            <p>
                                              <span className="font-medium">
                                                Split Shift 2:
                                              </span>{" "}
                                              {day.assignedSplitStart2} -{" "}
                                              {day.assignedSplitEnd2}
                                            </p>
                                          </>
                                        ) : (
                                          <p>
                                            <span className="font-medium">
                                              Time:
                                            </span>{" "}
                                            {day.assignedStartTime || "N/A"} -{" "}
                                            {day.assignedEndTime || "N/A"}
                                            {day.assignedStartTime &&
                                              day.assignedEndTime && (
                                                <span className="ml-2 text-muted-1100">
                                                  (
                                                  {calculateHoursFromTimeStrings(
                                                    day.assignedStartTime,
                                                    day.assignedEndTime
                                                  ).toFixed(1)}{" "}
                                                  hours)
                                                </span>
                                              )}
                                          </p>
                                        )}
                                      </>
                                    ) : (
                                      <p className="text-muted-900">
                                        No shift assigned for this date
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Section 2: Requested Shift Details */}
                                <div className="space-y-4">
                                  <div className="font-medium">
                                    Requested Shift Change
                                  </div>

                                  {/* Mark as OFF - Only if original day was OFF */}
                                  <div>
                                    <CheckBoxInput
                                      label="Mark as OFF"
                                      name={`dailySchedule[${index}].requestedIsOff`}
                                      value={day.requestedIsOff}
                                      onChange={(name, value) => {
                                        props.setFieldValue(name, value);
                                        if (value) {
                                          // Clear time fields if marking as OFF
                                          props.setFieldValue(
                                            `dailySchedule[${index}].requestedIsSplit`,
                                            false
                                          );
                                        }
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
                                      disabled={!day.assignedIsOff}
                                    />
                                    {!day.assignedIsOff && (
                                      <p className="text-xs text-muted-900 ml-6 mt-1">
                                        Can only request OFF if the assigned
                                        shift is already OFF
                                      </p>
                                    )}
                                  </div>

                                  {!day.requestedIsOff && (
                                    <>
                                      {/* Split Shift Toggle */}
                                      <CheckBoxInput
                                        label="Split Shift"
                                        name={`dailySchedule[${index}].requestedIsSplit`}
                                        value={day.requestedIsSplit}
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

                                      {!day.requestedIsSplit ? (
                                        // Regular shift time inputs
                                        <div className="grid grid-cols-2 gap-4">
                                          <TimePicker
                                            name={`dailySchedule[${index}].requestedStartTime`}
                                            label="Start Time"
                                            value={day.requestedStartTime}
                                            date={day.date}
                                            onChange={(name, value) => {
                                              props.setFieldValue(name, value);

                                              // Create updated values object manually
                                              const updatedValues = {
                                                ...props.values,
                                                dailySchedule:
                                                  props.values.dailySchedule.map(
                                                    (day, i) =>
                                                      i === index
                                                        ? {
                                                          ...day,
                                                          [name
                                                            .split(".")
                                                            .pop()]: value,
                                                        }
                                                        : day
                                                  ),
                                              };

                                              setTimeout(
                                                () =>
                                                  calculateHours(
                                                    updatedValues,
                                                    props.setFieldValue
                                                  ),
                                                0
                                              );
                                            }}
                                            required={true}
                                          />
                                          <TimePicker
                                            name={`dailySchedule[${index}].requestedEndTime`}
                                            label="End Time"
                                            value={day.requestedEndTime}
                                            date={day.date}
                                            onChange={(name, value) => {
                                              props.setFieldValue(name, value);

                                              // Create updated values object manually
                                              const updatedValues = {
                                                ...props.values,
                                                dailySchedule:
                                                  props.values.dailySchedule.map(
                                                    (day, i) =>
                                                      i === index
                                                        ? {
                                                          ...day,
                                                          [name
                                                            .split(".")
                                                            .pop()]: value,
                                                        }
                                                        : day
                                                  ),
                                              };

                                              setTimeout(
                                                () =>
                                                  calculateHours(
                                                    updatedValues,
                                                    props.setFieldValue
                                                  ),
                                                0
                                              );
                                            }}
                                            required={true}
                                          />
                                        </div>
                                      ) : (
                                        // Split shift time inputs
                                        <>
                                          <div className="mb-2 font-medium">
                                            Split Shift 1
                                          </div>
                                          <div className="grid grid-cols-2 gap-4 mb-4">
                                            <TimePicker
                                              name={`dailySchedule[${index}].requestedSplitStart1`}
                                              label="Start Time"
                                              value={day.requestedSplitStart1}
                                              date={day.date}
                                              onChange={(name, value) => {
                                                props.setFieldValue(
                                                  name,
                                                  value
                                                );

                                                // Create updated values object manually
                                                const updatedValues = {
                                                  ...props.values,
                                                  dailySchedule:
                                                    props.values.dailySchedule.map(
                                                      (day, i) =>
                                                        i === index
                                                          ? {
                                                            ...day,
                                                            [name
                                                              .split(".")
                                                              .pop()]: value,
                                                          }
                                                          : day
                                                    ),
                                                };

                                                setTimeout(
                                                  () =>
                                                    calculateHours(
                                                      updatedValues,
                                                      props.setFieldValue
                                                    ),
                                                  0
                                                );
                                              }}
                                              required={true}
                                            />
                                            <TimePicker
                                              name={`dailySchedule[${index}].requestedSplitEnd1`}
                                              label="End Time"
                                              value={day.requestedSplitEnd1}
                                              date={day.date}
                                              onChange={(name, value) => {
                                                props.setFieldValue(
                                                  name,
                                                  value
                                                );

                                                // Create updated values object manually
                                                const updatedValues = {
                                                  ...props.values,
                                                  dailySchedule:
                                                    props.values.dailySchedule.map(
                                                      (day, i) =>
                                                        i === index
                                                          ? {
                                                            ...day,
                                                            [name
                                                              .split(".")
                                                              .pop()]: value,
                                                          }
                                                          : day
                                                    ),
                                                };

                                                setTimeout(
                                                  () =>
                                                    calculateHours(
                                                      updatedValues,
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
                                              name={`dailySchedule[${index}].requestedSplitStart2`}
                                              label="Start Time"
                                              value={day.requestedSplitStart2}
                                              date={day.date}
                                              onChange={(name, value) => {
                                                props.setFieldValue(
                                                  name,
                                                  value
                                                );

                                                // Create updated values object manually
                                                const updatedValues = {
                                                  ...props.values,
                                                  dailySchedule:
                                                    props.values.dailySchedule.map(
                                                      (day, i) =>
                                                        i === index
                                                          ? {
                                                            ...day,
                                                            [name
                                                              .split(".")
                                                              .pop()]: value,
                                                          }
                                                          : day
                                                    ),
                                                };

                                                setTimeout(
                                                  () =>
                                                    calculateHours(
                                                      updatedValues,
                                                      props.setFieldValue
                                                    ),
                                                  0
                                                );
                                              }}
                                              required={true}
                                            />
                                            <TimePicker
                                              name={`dailySchedule[${index}].requestedSplitEnd2`}
                                              label="End Time"
                                              value={day.requestedSplitEnd2}
                                              date={day.date}
                                              onChange={(name, value) => {
                                                props.setFieldValue(
                                                  name,
                                                  value
                                                );

                                                // Create updated values object manually
                                                const updatedValues = {
                                                  ...props.values,
                                                  dailySchedule:
                                                    props.values.dailySchedule.map(
                                                      (day, i) =>
                                                        i === index
                                                          ? {
                                                            ...day,
                                                            [name
                                                              .split(".")
                                                              .pop()]: value,
                                                          }
                                                          : day
                                                    ),
                                                };

                                                setTimeout(
                                                  () =>
                                                    calculateHours(
                                                      updatedValues,
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

                                      {/* MINIMAL FIX: Add working hours display */}
                                      <div className="mt-4 text-sm">
                                        <strong>Working Hours: </strong>
                                        {props.values.totalHours?.daily?.[
                                          day.date
                                        ]
                                          ? `${props.values.totalHours.daily[
                                            day.date
                                          ].toFixed(1)} hours`
                                          : day.requestedIsOff
                                            ? "OFF"
                                            : "0 hours"}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      />
                    )}
                  </SheetCardExtension>
                )}

              <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row">
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
                  disabled={
                    loading ||
                    fetchingShifts ||
                    !props.values.dailySchedule.length
                  }
                >
                  {loading
                    ? isEditEmployeeShiftPermitted
                      ? "Updating Shift..."
                      : "Submitting..."
                    : isEditEmployeeShiftPermitted
                      ? "Update Shift"
                      : "Submit Request"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </SheetComponent>
    </>
  );
};

export default ShiftChangeRequestModal;
