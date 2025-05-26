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

const ShiftChangeRequestModal = ({
  isOpen,
  setIsOpen,
  employee,
  onRequestSuccess = () => {},
}) => {
  const [closeSheet, setCloseSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingShifts, setFetchingShifts] = useState(false);
  const [fetchProgress, setFetchProgress] = useState({ current: 0, total: 0 });
  const userProfile = useSelector((state) => state.user.userProfile);

  const [formData, setFormData] = useState({
    dateRange: "",
    dailySchedule: [],
  });

  const handleClose = () => {
    setCloseSheet(true);
  };

  // Generate daily schedule with assigned shift info
  const generateDailyScheduleWithShifts = async (dateRange, employeeId) => {
    console.log("Generating daily schedule for:", dateRange, employeeId);

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
          status: "Approved",
        },
      });

      const shiftSchedules = response?.results || [];
      console.log("Shift Schedules:", shiftSchedules);

      // If no shift schedules found, fetch direct org shift
      let directOrgShift = null;
      if (response?.count === 0) {
        // Need to get employee data to get shift_management field
        const empData = await employeeData(employeeId);

        if (empData?.shift_management) {
          directOrgShift = await getShiftById(empData.shift_management);

          if (!directOrgShift) {
            toast.error("No shift assigned to this employee");
            throw new Error("No shift assigned to employee");
          }

          console.log("Direct org shift:", directOrgShift);
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

            // For org-based scheduled shifts, we need to fetch the shift details separately
            // For now, we'll leave times null - you might want to fetch this
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

          // Use the shift's start and end time for all days
          dayData.assignedStartTime = moment(directOrgShift.starttime).format(
            "HH:mm"
          );
          dayData.assignedEndTime = moment(directOrgShift.endtime).format(
            "HH:mm"
          );
        }

        // Initialize requested with assigned values
        // IMPORTANT: Convert time strings to full datetime for TimePicker
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
  // Helper function to calculate total weekly hours
  const calculateTotalWeeklyHours = (dailySchedule, useRequested = false) => {
    let totalHours = 0;

    dailySchedule.forEach((day) => {
      const isOff = useRequested ? day.requestedIsOff : day.assignedIsOff;
      const isSplit = useRequested ? day.requestedIsSplit : day.assignedIsSplit;

      if (!isOff) {
        if (isSplit) {
          const start1 = useRequested
            ? day.requestedSplitStart1
            : day.assignedSplitStart1;
          const end1 = useRequested
            ? day.requestedSplitEnd1
            : day.assignedSplitEnd1;
          const start2 = useRequested
            ? day.requestedSplitStart2
            : day.assignedSplitStart2;
          const end2 = useRequested
            ? day.requestedSplitEnd2
            : day.assignedSplitEnd2;

          if (start1 && end1) {
            const hours1 = moment(`${day.date} ${end1}`).diff(
              moment(`${day.date} ${start1}`),
              "hours",
              true
            );
            totalHours += hours1 > 0 ? hours1 : hours1 + 24;
          }

          if (start2 && end2) {
            const hours2 = moment(`${day.date} ${end2}`).diff(
              moment(`${day.date} ${start2}`),
              "hours",
              true
            );
            totalHours += hours2 > 0 ? hours2 : hours2 + 24;
          }
        } else {
          const startTime = useRequested
            ? day.requestedStartTime
            : day.assignedStartTime;
          const endTime = useRequested
            ? day.requestedEndTime
            : day.assignedEndTime;

          if (startTime && endTime) {
            const hours = moment(`${day.date} ${endTime}`).diff(
              moment(`${day.date} ${startTime}`),
              "hours",
              true
            );
            totalHours += hours > 0 ? hours : hours + 24;
          }
        }
      }
    });

    return totalHours.toFixed(1);
  };

  const handleFormSubmit = async (values) => {
    setLoading(true);

    try {
      const [startDate, endDate] = values.dateRange.split(",");

      // Build custom_schedule object from requested changes
      const customSchedule = {};
      let hasChanges = false;

      values.dailySchedule.forEach((day) => {
        // Convert requested times back to HH:mm format for comparison and payload
        const requestedStartTime = day.requestedStartTime
          ? moment(day.requestedStartTime).format("HH:mm")
          : null;
        const requestedEndTime = day.requestedEndTime
          ? moment(day.requestedEndTime).format("HH:mm")
          : null;
        const requestedSplitStart1 = day.requestedSplitStart1
          ? moment(day.requestedSplitStart1).format("HH:mm")
          : null;
        const requestedSplitEnd1 = day.requestedSplitEnd1
          ? moment(day.requestedSplitEnd1).format("HH:mm")
          : null;
        const requestedSplitStart2 = day.requestedSplitStart2
          ? moment(day.requestedSplitStart2).format("HH:mm")
          : null;
        const requestedSplitEnd2 = day.requestedSplitEnd2
          ? moment(day.requestedSplitEnd2).format("HH:mm")
          : null;

        // Check if there are any changes for this day
        const hasChange =
          day.requestedIsOff !== day.assignedIsOff ||
          day.requestedIsSplit !== day.assignedIsSplit ||
          requestedStartTime !== day.assignedStartTime ||
          requestedEndTime !== day.assignedEndTime ||
          requestedSplitStart1 !== day.assignedSplitStart1 ||
          requestedSplitEnd1 !== day.assignedSplitEnd1 ||
          requestedSplitStart2 !== day.assignedSplitStart2 ||
          requestedSplitEnd2 !== day.assignedSplitEnd2;

        if (hasChange) {
          hasChanges = true;

          if (day.requestedIsOff) {
            customSchedule[day.date] = {
              is_off: true,
            };
          } else if (day.requestedIsSplit) {
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
              start_time: requestedStartTime,
              end_time: requestedEndTime,
            };
          }
        }
      });

      if (!hasChanges) {
        toast.warning("No changes were made to the shift schedule");
        setLoading(false);
        return;
      }

      // Calculate total weekly hours based on requested times
      const calculateTotalWeeklyHours = () => {
        let totalHours = 0;

        values.dailySchedule.forEach((day) => {
          if (!day.requestedIsOff) {
            if (day.requestedIsSplit) {
              // Calculate split shift hours
              if (day.requestedSplitStart1 && day.requestedSplitEnd1) {
                const start1 = moment(day.requestedSplitStart1);
                const end1 = moment(day.requestedSplitEnd1);
                const hours1 = end1.diff(start1, "hours", true);
                totalHours += hours1 > 0 ? hours1 : hours1 + 24;
              }

              if (day.requestedSplitStart2 && day.requestedSplitEnd2) {
                const start2 = moment(day.requestedSplitStart2);
                const end2 = moment(day.requestedSplitEnd2);
                const hours2 = end2.diff(start2, "hours", true);
                totalHours += hours2 > 0 ? hours2 : hours2 + 24;
              }
            } else {
              // Calculate regular shift hours
              if (day.requestedStartTime && day.requestedEndTime) {
                const start = moment(day.requestedStartTime);
                const end = moment(day.requestedEndTime);
                const hours = end.diff(start, "hours", true);
                totalHours += hours > 0 ? hours : hours + 24;
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
        schedule_name: `Shift Change Request - ${moment(startDate).format(
          "MMM DD"
        )}-${moment(endDate).format("DD, YYYY")}`,
        start_date: startDate,
        end_date: endDate,
        is_org_based: false,
        custom_schedule: customSchedule,
        total_weekly_hours: calculateTotalWeeklyHours(),
        assigned_by: userProfile?.id,
        status: "Pending",
        is_off_day: values.dailySchedule.some((day) => day.requestedIsOff),
        // Additional fields to identify this as a change request
        is_change_request: true,
      };

      console.log("Shift Change Request Payload:", payload);

      const response = await saveShiftSchedule(payload);

      if (response) {
        toast.success("Shift change request submitted successfully!");
        onRequestSuccess();
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

  // Calculate hours for display
  const calculateHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = moment(startTime, "HH:mm");
    const end = moment(endTime, "HH:mm");

    if (end.isBefore(start)) {
      end.add(1, "day");
    }

    return end.diff(start, "hours", true);
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
              {console.log("props", props)}
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
                                        `Organization Schedule (ID: ${
                                          day.assignedShift.scheduleId || "N/A"
                                        })`}
                                      {day.assignedShift.source ===
                                        "scheduled_custom" &&
                                        `Custom Schedule (ID: ${
                                          day.assignedShift.scheduleId || "N/A"
                                        })`}
                                      {day.assignedShift.source ===
                                        "direct_assignment" &&
                                        `Direct Assignment (Shift ID: ${
                                          day.assignedShift.shiftId || "N/A"
                                        })`}
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
                                            {day.assignedStartTime} -{" "}
                                            {day.assignedEndTime}
                                            {day.assignedStartTime &&
                                              day.assignedEndTime && (
                                                <span className="ml-2 text-muted-1100">
                                                  (
                                                  {calculateHours(
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
                                              }}
                                              required={true}
                                            />
                                          </div>
                                        </>
                                      )}

                                      {/* Display requested hours */}
                                      {day.requestedStartTime &&
                                        day.requestedEndTime &&
                                        !day.requestedIsSplit && (
                                          <div className="mt-2 text-sm text-muted-1100">
                                            Requested Hours:{" "}
                                            {calculateHours(
                                              day.requestedStartTime,
                                              day.requestedEndTime
                                            ).toFixed(1)}{" "}
                                            hours
                                          </div>
                                        )}
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
                  {loading ? "Submitting..." : "Submit Request"}
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
