// src/app/modules/Attendance/ShiftCalendar/Section/EmployeeCalendarDialog.jsx
import React, { useState } from "react";
import { Button } from "components/ui/button";
import { EmployeeOverview } from "components";
import { DetailBox, DetailCard } from "components/SheetCardExtension";
import moment from "moment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/@/components/ui/dialog";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getShiftById } from "app/hooks/attendance";

const EmployeeCalendarDialog = ({ isOpen, setIsOpen, schedule }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shiftDetails, setShiftDetails] = useState(null);

  // Fetch shift details to get start/end times
  React.useEffect(() => {
    const fetchShiftDetails = async () => {
      if (!schedule || !schedule.shift_id) return;

      try {
        // Replace this with your actual API call
        const shiftData = await getShiftById(schedule.shift_id);
        setShiftDetails(shiftData);

        // Fallback to mock data if API fails (remove this in production)
        if (!shiftData) {
          const mockShiftData = {
            id: 35,
            name: "Regular Shift 05-18 (sun,mon)",
            type: "Regular",
            weekdays: "sun,mon",
            starttime: "2025-05-21T04:00:00Z",
            endtime: "2025-05-21T12:00:00Z",
            Is_org_based: false,
            organization: 1,
          };
          setShiftDetails(mockShiftData);
        }
      } catch (error) {
        console.error("Error fetching shift details:", error);

        // Use mock data as fallback (remove this in production)
        const mockShiftData = {
          id: 35,
          name: "Regular Shift 05-18 (sun,mon)",
          type: "Regular",
          weekdays: "sun,mon",
          starttime: "2025-05-21T04:00:00Z",
          endtime: "2025-05-21T12:00:00Z",
          Is_org_based: false,
          organization: 1,
        };
        setShiftDetails(mockShiftData);
      }
    };

    if (schedule?.shift_id && !schedule.is_off_day) {
      fetchShiftDetails();
    }
  }, [schedule]);

  // Generate calendar events from schedule data
  React.useEffect(() => {
    if (!schedule) return;

    const generateCalendarEvents = () => {
      const events = [];

      // Create events based on the schedule period
      const startDate = moment(schedule.start_date);
      const endDate = moment(schedule.end_date);

      // Generate events for each day in the range
      let currentDate = startDate.clone();
      while (currentDate.isSameOrBefore(endDate)) {
        const dateStr = currentDate.format("YYYY-MM-DD");

        if (schedule.is_off_day) {
          // OFF Day
          events.push({
            title: "OFF",
            start: dateStr,
            allDay: true,
            backgroundColor: "#3b82f6",
            borderColor: "#3b82f6",
            textColor: "#ffffff",
          });
        } else if (schedule.is_split_shift) {
          // Split Shift
          if (schedule.split_start_time && schedule.split_end_time) {
            const splitStart = moment(schedule.split_start_time);
            const splitEnd = moment(schedule.split_end_time);

            events.push({
              title: `Split Shift (${splitStart.format(
                "HH:mm"
              )} - ${splitEnd.format("HH:mm")})`,
              start: `${dateStr}T${splitStart.format("HH:mm:ss")}`,
              end: `${dateStr}T${splitEnd.format("HH:mm:ss")}`,
              backgroundColor: "#8b5cf6",
              borderColor: "#8b5cf6",
              textColor: "#ffffff",
            });
          } else {
            // Fallback for split shift without specific times
            events.push({
              title: "Split Shift",
              start: dateStr,
              allDay: true,
              backgroundColor: "#8b5cf6",
              borderColor: "#8b5cf6",
              textColor: "#ffffff",
            });
          }
        } else {
          // Regular Shift - Use actual shift times if available
          if (shiftDetails && shiftDetails.starttime && shiftDetails.endtime) {
            const shiftStart = moment(shiftDetails.starttime);
            const shiftEnd = moment(shiftDetails.endtime);

            // Create start and end times for this specific date
            const dayStartTime = moment(
              `${dateStr}T${shiftStart.format("HH:mm:ss")}`
            );
            const dayEndTime = moment(
              `${dateStr}T${shiftEnd.format("HH:mm:ss")}`
            );

            events.push({
              title: `${
                shiftDetails.name || "Regular Shift"
              } (${shiftStart.format("HH:mm")} - ${shiftEnd.format("HH:mm")})`,
              start: dayStartTime.toISOString(),
              end: dayEndTime.toISOString(),
              backgroundColor: "#22c55e",
              borderColor: "#22c55e",
              textColor: "#ffffff",
              extendedProps: {
                shiftName: shiftDetails.name,
                shiftType: shiftDetails.type,
                duration:
                  shiftEnd.diff(shiftStart, "hours", true).toFixed(1) +
                  " hours",
              },
            });
          } else {
            // Fallback when shift details are not available
            events.push({
              title: "Regular Shift",
              start: dateStr,
              allDay: true,
              backgroundColor: "#22c55e",
              borderColor: "#22c55e",
              textColor: "#ffffff",
            });
          }
        }

        currentDate.add(1, "day");
      }

      return events;
    };

    const events = generateCalendarEvents();
    setCalendarEvents(events);
    setLoading(false);
  }, [schedule, shiftDetails]);

  const handleEventClick = (info) => {
    const event = info.event;
    const props = event.extendedProps;

    if (props.shiftName) {
      alert(
        `Shift: ${props.shiftName}\nType: ${props.shiftType}\nDuration: ${props.duration}`
      );
    }
  };

  if (!schedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="max-w-7xl w-[95vw] h-[90vh] overflow-y-auto p-6"
        style={{ maxWidth: "1400px" }}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">
            Employee Schedule Calendar - Employee {schedule?.employee_id}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            View employee's scheduled shifts in calendar format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Employee Overview */}
          <div className="bg-white rounded-lg border p-4">
            <EmployeeOverview
              id={schedule.employee_id}
              showEmail={true}
              showDepartment={true}
              showPosition={true}
              showId={true}
              showBranchName={true}
            />
          </div>

          {/* Schedule Information Card */}
          <DetailCard
            detailCardTitle="Schedule Information"
            date={schedule.created_at}
            dateTitle="Submitted On"
          >
            <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
              <DetailBox
                label="Period"
                value={`${moment(schedule.start_date).format(
                  "MMM D"
                )} - ${moment(schedule.end_date).format("MMM D, YYYY")}`}
              />
              <DetailBox
                label="Type"
                value={
                  schedule.is_off_day
                    ? "OFF Day"
                    : schedule.is_split_shift
                    ? "Split Shift"
                    : "Regular Shift"
                }
              />
              <DetailBox
                label="Working Hours"
                value={
                  schedule.is_off_day
                    ? "No working hours"
                    : schedule.is_split_shift
                    ? schedule.split_start_time && schedule.split_end_time
                      ? `${moment(schedule.split_start_time).format(
                          "HH:mm"
                        )} - ${moment(schedule.split_end_time).format("HH:mm")}`
                      : "Split shift times"
                    : shiftDetails &&
                      shiftDetails.starttime &&
                      shiftDetails.endtime
                    ? `${moment(shiftDetails.starttime).format(
                        "HH:mm"
                      )} - ${moment(shiftDetails.endtime).format("HH:mm")}`
                    : "Regular shift"
                }
              />
              <DetailBox
                label="Status"
                value={
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                    {schedule.status}
                  </span>
                }
              />
              <DetailBox label="Submitted By" value={schedule.submitted_by} />
              <DetailBox
                label="Duration"
                value={`${
                  Math.abs(
                    moment(schedule.end_date).diff(
                      moment(schedule.start_date),
                      "days"
                    )
                  ) + 1
                } days`}
              />
            </div>
          </DetailCard>

          {/* Shift Details Card */}
          {shiftDetails && (
            <DetailCard detailCardTitle="Shift Details" classNames="mt-4">
              <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                <DetailBox label="Shift Name" value={shiftDetails.name} />
                <DetailBox label="Shift Type" value={shiftDetails.type} />
                <DetailBox
                  label="Weekdays"
                  value={shiftDetails.weekdays?.replace(/,/g, ", ") || "N/A"}
                />
                <DetailBox
                  label="Duration"
                  value={
                    shiftDetails.starttime && shiftDetails.endtime
                      ? `${moment(shiftDetails.endtime)
                          .diff(moment(shiftDetails.starttime), "hours", true)
                          .toFixed(1)} hours`
                      : "N/A"
                  }
                />
                <DetailBox
                  label="Organization Based"
                  value={shiftDetails.Is_org_based ? "Yes" : "No"}
                />
              </div>
            </DetailCard>
          )}

          {/* Calendar Section */}
          <DetailCard
            detailCardTitle="Schedule Calendar View"
            classNames="mt-4"
          >
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Visual representation of the employee's shift schedule
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-[500px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <div className="text-gray-500 mt-2">Loading calendar...</div>
                </div>
              </div>
            ) : (
              <div className="h-[500px] w-full">
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }}
                  initialView="timeGridWeek"
                  initialDate={schedule.start_date}
                  events={calendarEvents}
                  height="100%"
                  eventDisplay="block"
                  dayMaxEvents={false}
                  eventTextColor="#ffffff"
                  slotMinTime="00:00:00"
                  slotMaxTime="24:00:00"
                  slotDuration="01:00:00"
                  slotLabelInterval="02:00:00"
                  allDaySlot={true}
                  nowIndicator={true}
                  weekends={true}
                  businessHours={
                    shiftDetails &&
                    shiftDetails.starttime &&
                    shiftDetails.endtime
                      ? {
                          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                          startTime: moment(shiftDetails.starttime).format(
                            "HH:mm"
                          ),
                          endTime: moment(shiftDetails.endtime).format("HH:mm"),
                        }
                      : undefined
                  }
                  validRange={{
                    start: schedule.start_date,
                    end: moment(schedule.end_date)
                      .add(1, "day")
                      .format("YYYY-MM-DD"),
                  }}
                  eventClick={handleEventClick}
                  eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
                  dayHeaderClassNames="bg-gray-50 font-medium"
                  eventMinHeight={30}
                  eventShortHeight={25}
                />
              </div>
            )}
          </DetailCard>

          {/* Legend Card */}
          <DetailCard detailCardTitle="Color Legend" classNames="mt-4">
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Regular Shift</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm">Split Shift</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">OFF Day</span>
              </div>
            </div>
          </DetailCard>
        </div>

        {/* Footer with Action Buttons */}
        <DialogFooter className="pt-4 border-t">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              size="lg"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            {/* Future: Add Edit button here when edit functionality is implemented */}
            {/*
            <Button
              variant="default"
              type="button"
              size="lg"
              onClick={() => handleEdit(schedule)}
            >
              Edit Schedule
            </Button>
            */}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeCalendarDialog;
