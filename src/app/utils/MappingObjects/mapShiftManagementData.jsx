export async function mapCustomShiftPayload (values ,overlappingSchedules ) {
    try {
      const [requestedStartDate, requestedEndDate] =
        values.dateRange.split(",");
      

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

      console.log("Shift Change Request Payload:", payload);
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