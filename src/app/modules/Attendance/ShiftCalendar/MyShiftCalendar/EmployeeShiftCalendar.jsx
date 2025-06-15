// src/app/modules/EmployeeSelfService/ShiftCalendar/EmployeeShiftCalendar.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { getShiftSchedule } from "app/hooks/shiftManagement";
import { employeeData, getShiftById } from "app/hooks/attendance";
import moment from "moment";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import CustomTable from "components/CustomTable";
import { toast } from "react-toastify";
import ShiftChangeRequestModal from "../ShiftCalendarTab/ShiftChangeRequestModal";
import {
  filterOverlappingSchedules,
  getChangeRequestComparison,
  fetchEmployeeShiftData,
} from "../ShiftCalendarTab/shiftScheduleUtils";
import { getEmployeeActiveShift } from "../Section/getEmployeeActiveShift";
import { HasAccess } from "utils/PermissionUtils";
import { FilterInput } from "components/FormControl";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "src/@/components/ui/tooltip";

// Event Content Component with Tooltip
const EventWithTooltip = ({ eventInfo }) => {
  const fullTitle = eventInfo.event.title;
  const shortTitle =
    fullTitle.length > 18 ? fullTitle.substring(0, 15) + "..." : fullTitle;

  // Extract additional details from extendedProps
  const { type, shiftName, scheduleId } = eventInfo.event.extendedProps || {};

  // Create detailed tooltip content
  const getTooltipContent = () => {
    const start = moment(eventInfo.event.start).format("HH:mm");
    const end = moment(eventInfo.event.end).format("HH:mm");

    // Format type for display
    const formatType = (type) => {
      switch (type) {
        case "direct_assignment":
          return "Direct Assignment";
        case "org_schedule":
          return "Organization Schedule";
        case "custom_regular":
          return "Custom Schedule";
        case "custom_split":
          return "Split Shift";
        case "custom_off":
          return "Day Off";
        default:
          return "Scheduled Shift";
      }
    };

    return (
      <div className="space-y-1 text-blue-950">
        <p className="font-medium">{shiftName || eventInfo.event.title}</p>
        <p className="text-xs">
          Time: {start} - {end}
        </p>
        <p className="text-xs">Type: {formatType(type)}</p>
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="p-0.5 sm:p-1 overflow-hidden w-full cursor-pointer">
            <div className="font-medium text-[8px] sm:text-[10px] lg:text-xs leading-tight truncate w-full">
              {shortTitle}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {getTooltipContent()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const EmployeeShiftCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [directShift, setDirectShift] = useState(null);
  const [scheduleShifts, setScheduleShifts] = useState({
    results: [],
    count: 0,
  });
  const [changeRequests, setChangeRequests] = useState({
    results: [],
    count: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterData, setFilterData] = useState({})
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });
  const [ordering, setOrdering] = useState("-id");
  const isRequestChangeShiftPermitted = HasAccess("REQUEST_MY_SHIFT_CHANGE");
  const isViewMyShiftChangeRequestsPermitted = HasAccess("VIEW_MY_SHIFT_CHANGE_REQUESTS")

  const userProfile = useSelector((state) => state.user.userProfile);
  const employeeId = userProfile?.id;

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeShifts(); 
      fetchChangeRequests();
    }
  }, [employeeId]);
  useEffect(() => {
    if (employeeId) {
      fetchChangeRequests();
    }
  }, [filterData, options, ordering]);

  const fetchEmployeeShifts = async () => {
    try {
      setLoading(true);

      // Use the same utility function as emplist
      const { employeeShift: shift, scheduleShifts: schedules } =
        await fetchEmployeeShiftData(employeeId);

      setDirectShift(shift);
      setScheduleShifts(schedules);

      // Also fetch basic employee info for the modal
      const empData = await employeeData(employeeId);
      setEmployeeInfo(empData);

      // Generate calendar events with both direct shift and schedules
      generateCalendarEvents(schedules.results, shift);
    } catch (error) {
      console.error("Error fetching employee shift data:", error);
      toast.error("Failed to load shift calendar");
      setDirectShift(null);
      setScheduleShifts({
        results: [],
        count: 0,
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };


  const fetchChangeRequests = async () => {
    try {
      const response = await getShiftSchedule({
        filterData: {
          employee: employeeId,
          is_change_request: "true",
          ordering: "-created_at",
          shift_requested: "Employee", 
          status: selectedStatus,
        },
        options,
        ordering
      });

      if (response && response.results) {
        // Add comparison data to each change request
        const requestsWithComparison = await Promise.all(
          response.results.map(async (request) => {
            const comparisonData = await getChangeRequestComparison(
              request,
            );
            return {
              ...request,
              comparison_data: comparisonData,
            };
          })
        );

        setChangeRequests({
          ...response,
          results: requestsWithComparison,
        });
      }
    } catch (error) {
      console.error("Error fetching change requests:", error);
    }
  };

  const generateCalendarEvents = (approvedSchedules, directShiftData) => {
    const events = [];
    const coveredDates = new Set(); // Track dates covered by schedules

    // 1. PRIORITY: Add approved schedule shifts first and track covered dates
    approvedSchedules.forEach((schedule) => {
      if (schedule.is_org_based && schedule.shift_details) {
        // Organization-based scheduled shift
        const scheduleEvents = generateOrgScheduleEvents(schedule);
        events.push(...scheduleEvents);
        
        // Track dates covered by this schedule
        scheduleEvents.forEach(event => {
          const eventDate = moment(event.start).format('YYYY-MM-DD');
          coveredDates.add(eventDate);
        });
      } else if (schedule.custom_schedule) {
        // Custom scheduled shift
        const scheduleEvents = generateCustomScheduleEvents(schedule);
        events.push(...scheduleEvents);
        
        // Track dates covered by this schedule
        Object.keys(schedule.custom_schedule).forEach(date => {
          coveredDates.add(date);
        });
      }
    });

    // 2. FALLBACK: Add direct shift assignment for dates NOT covered by schedules
    if (directShiftData) {
      const directShiftEvents = generateDirectShiftEvents(directShiftData, coveredDates);
      events.push(...directShiftEvents);
    }

    setEvents(events);
  };

  const generateDirectShiftEvents = (shift, coveredDates = new Set()) => {
    const events = [];

    // Parse start time (ISO format)
    const shiftStart = moment(shift.starttime);

    // Parse end time (handle multiple formats)
    let shiftEnd;

    if (shift.endtime.includes("T")) {
      // ISO format like "2025-06-09T12:00:00Z"
      shiftEnd = moment(shift.endtime);
    } else if (shift.endtime.includes("M")) {
      // 12-hour format like "05:00 PM" or "5:00 AM"
      shiftEnd = moment(shift.endtime, ["hh:mm A", "h:mm A"]);
    } else if (shift.endtime.includes(":")) {
      // 24-hour format like "17:00"
      shiftEnd = moment(shift.endtime, "HH:mm");
    } else {
      // Fallback - try to parse as-is
      shiftEnd = moment(shift.endtime);
    }

    // Only proceed if both times are valid
    if (!shiftStart.isValid() || !shiftEnd.isValid()) {
      console.error("Invalid time formats:", {
        starttime: shift.starttime,
        endtime: shift.endtime,
      });
      return events;
    }

    // Show for current month only
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");

    let currentDate = startOfMonth.clone();
    while (currentDate.isSameOrBefore(endOfMonth)) {
      const dateKey = currentDate.format("YYYY-MM-DD");
      
      // Skip weekends for default org shifts AND skip dates covered by schedules
      if (currentDate.day() !== 0 && currentDate.day() !== 6 && !coveredDates.has(dateKey)) {
        const startTime = shiftStart.format("HH:mm");
        const endTime = shiftEnd.format("HH:mm");

        events.push({
          id: `direct-${shift.id}-${dateKey}`,
          title: `${shift.name} (${startTime} - ${endTime})`,
          start: `${dateKey}T${startTime}:00`,
          end: `${dateKey}T${endTime}:00`,
          backgroundColor: "#3B82F6", // Blue for direct assignments
          borderColor: "#2563EB",
          textColor: "#FFFFFF",
          extendedProps: {
            type: "direct_assignment",
            shiftId: shift.id,
            shiftName: shift.name,
            fullTitle: `${shift.name} (${startTime} - ${endTime})`,
          },
        });
      }
      currentDate.add(1, "day");
    }

    return events;
  };

  const generateOrgScheduleEvents = (schedule) => {
    const events = [];
    const shiftDetails = schedule.shift_details;
    if (!shiftDetails) return events;

    // Parse weekdays
    let weekdays = [];
    try {
      weekdays = JSON.parse(shiftDetails.weekdays);
    } catch (e) {
      weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    }

    const shortWeekdays = weekdays.map((day) =>
      day.toLowerCase().substring(0, 3)
    );

    const startDate = moment(schedule.start_date);
    const endDate = moment(schedule.end_date);

    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
      const dayName = currentDate.format("ddd").toLowerCase();

      if (shortWeekdays.includes(dayName)) {
        const startTime = moment(
          shiftDetails.starttime.replace("Z", "")
        ).format("HH:mm");
        const endTime = moment(shiftDetails.endtime.replace("Z", "")).format(
          "HH:mm"
        );

        const eventTitle = `${shiftDetails.name} (${startTime} - ${endTime})`;

        events.push({
          title: eventTitle,
          start: `${currentDate.format("YYYY-MM-DD")}T${startTime}:00`,
          end: `${currentDate.format("YYYY-MM-DD")}T${endTime}:00`,
          backgroundColor: "#10B981",
          borderColor: "#059669",
          textColor: "#FFFFFF",
          extendedProps: {
            type: "org_schedule",
            shiftName: shiftDetails.name,
            scheduleId: schedule.id,
            fullTitle: eventTitle,
          },
        });
      }

      currentDate.add(1, "day");
    }

    return events;
  };

  const generateCustomScheduleEvents = (schedule) => {
    const events = [];
    const customSchedule = schedule.custom_schedule;

    Object.entries(customSchedule).forEach(([date, daySchedule]) => {
      if (daySchedule.is_off) {
        events.push({
          title: "OFF",
          start: date,
          allDay: true,
          backgroundColor: "#6B7280",
          borderColor: "#4B5563",
          textColor: "#FFFFFF",
          extendedProps: {
            type: "custom_off",
            scheduleId: schedule.id,
            shiftName: "Day Off",
            fullTitle: "Day Off",
          },
        });
      } else if (daySchedule.is_split) {
        // Split shift events
        if (daySchedule.start_time_1 && daySchedule.end_time_1) {
          events.push({
            title: `Split 1 (${daySchedule.start_time_1} - ${daySchedule.end_time_1})`,
            start: `${date}T${daySchedule.start_time_1}:00`,
            end: `${date}T${daySchedule.end_time_1}:00`,
            backgroundColor: "#F59E0B",
            borderColor: "#D97706",
            textColor: "#FFFFFF",
            extendedProps: {
              type: "custom_split",
              part: 1,
              scheduleId: schedule.id,
              shiftName: `Split Shift Part 1`,
              fullTitle: `Split 1 (${daySchedule.start_time_1} - ${daySchedule.end_time_1})`,
            },
          });
        }

        if (daySchedule.start_time_2 && daySchedule.end_time_2) {
          let endDate = date;
          if (daySchedule.end_time_2 < daySchedule.start_time_2) {
            endDate = moment(date).add(1, "day").format("YYYY-MM-DD");
          }

          events.push({
            title: `Split 2 (${daySchedule.start_time_2} - ${daySchedule.end_time_2})`,
            start: `${date}T${daySchedule.start_time_2}:00`,
            end: `${endDate}T${daySchedule.end_time_2}:00`,
            backgroundColor: "#F59E0B",
            borderColor: "#D97706",
            textColor: "#FFFFFF",
            extendedProps: {
              type: "custom_split",
              part: 2,
              scheduleId: schedule.id,
              shiftName: `Split Shift Part 2`,
              fullTitle: `Split 2 (${daySchedule.start_time_2} - ${daySchedule.end_time_2})`,
            },
          });
        }
      } else {
        // Regular shift
        let endDate = date;
        if (daySchedule.end_time < daySchedule.start_time) {
          endDate = moment(date).add(1, "day").format("YYYY-MM-DD");
        }

        events.push({
          title: `Shift (${daySchedule.start_time} - ${daySchedule.end_time})`,
          start: `${date}T${daySchedule.start_time}:00`,
          end: `${endDate}T${daySchedule.end_time}:00`,
          backgroundColor: "#8B5CF6",
          borderColor: "#7C3AED",
          textColor: "#FFFFFF",
          extendedProps: {
            type: "custom_regular",
            scheduleId: schedule.id,
            shiftName: "Custom Shift",
            fullTitle: `Shift (${daySchedule.start_time} - ${daySchedule.end_time})`,
          },
        });
      }
    });

    return events;
  };

  const reload = () => {
    fetchChangeRequests();
    fetchEmployeeShifts(); 
  };

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  // Change Request Table Columns
  const changeRequestColumns = [
    {
      dataField: "start_date",
      text: "Request Period",
      formatter: (cell, row) => {
        return `${moment(row.start_date).format("DD MMM")} - ${moment(
          row.end_date
        ).format("DD MMM YYYY")}`;
      },
      dataSort: true,
    },
    {
      dataField: "comparison_data",
      text: "Changes Summary",
      formatter: (cell) => {
        if (!cell || cell.length === 0) return "No changes";

        const newCount = cell.filter((d) => d.is_new_shift).length;
        const modifiedCount = cell.length - newCount;

        return (
          <div className="text-sm">
            {modifiedCount > 0 && <div>{modifiedCount} modified days</div>}
            {newCount > 0 && <div>{newCount} new days</div>}
          </div>
        );
      },
    },
    {
      dataField: "created_at",
      text: "Requested On",
      formatter: (cell) => moment(cell).format("DD MMM YYYY"),
      dataSort: true,
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell) => {
        const statusColors = {
          Pending: "bg-yellow-50 text-yellow-700",
          Approved: "bg-green-50 text-green-700",
          Rejected: "bg-red-50 text-red-700",
        };

        return (
          <span
            className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
              statusColors[cell] || ""
            }`}
          >
            {cell || "N/A"}
          </span>
        );
      },
      dataSort: true,
    },
    {
      dataField: "rejection_reason",
      text: "Remarks",
      formatter: (cell, row) => {
        if (row.status === "Rejected" && cell) {
          return <span className="text-red-600 text-sm">{cell}</span>;
        }
        return "-";
      },
    },
  ];

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if (filterName === "status") {
      setSelectedStatus(filterValue);
    }
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Shift Calendar</h2>
          {scheduleShifts.count > 1 && (
            <p className="text-sm text-orange-600 mt-1">
              Showing effective schedule (latest schedules for overlapping
              dates)
            </p>
          )}
        </div>
        {isRequestChangeShiftPermitted && (directShift || scheduleShifts?.count > 0) && (
          <Button onClick={() => setIsRequestModalOpen(true)}>
            Request Shift Change
          </Button>
        )}
      </div>

      {/* Calendar View */}
      <Card className="pt-6">
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <div className=" mt-2">Loading calendar...</div>
              </div>
            </div>
          ) : (
            <div className="h-[600px]">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth",
                }}
                initialView="dayGridMonth"
                events={events}
                height="100%"
                eventDisplay="block"
                dayMaxEvents={
                  typeof window !== "undefined" && window.innerWidth < 768 ? 2 : 3
                }
                moreLinkClick="popover"
                // eventTextColor="#ffffff"
                nowIndicator={true}
                weekends={true}
                aspectRatio={
                  typeof window !== "undefined" && window.innerWidth < 768 ? 0.8 : 1.35
                }
                slotLabelFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }}
                eventTimeFormat={{
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }}
                eventContent={(eventInfo) => <EventWithTooltip eventInfo={eventInfo} />}
      
                dayCellContent={(dayInfo) => {
                  return {
                    html: `<div class="text-sm sm:text-base">${dayInfo.dayNumberText}</div>`,
                  };
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm font-medium mb-2">Legend:</div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Organization Shift</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>Custom Shift</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Split Shift</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <span>OFF Day</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Direct Assignment (No Schedule)</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Change Request Records */}
     {isViewMyShiftChangeRequestsPermitted && <Card>
        <CardHeader>
          <CardTitle>My Shift Change Requests</CardTitle>
          <div className="flex justify-end">
            <FilterInput
              filters={[
                {
                  type: "select-one",
                  option: [
                    { label: "Pending", value: "Pending" },
                    { label: "Approved", value: "Approved" },
                    { label: "Rejected", value: "Rejected" },
                  ],
                  name: "status",
                  placeholder: "Status",
                  values: selectedStatus,
                },
              ]}
              onChange={handleFilterChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          <CustomTable
            columns={changeRequestColumns}
            data={changeRequests?.results || []}
            pagination={true}
            dataTotalSize={changeRequests?.count || 0}
            tableOptions={tableOptions}
          />
        </CardContent>
      </Card>}


      {/* Reuse the same Shift Change Request Modal */}
      {isRequestModalOpen && employeeInfo && (
        <ShiftChangeRequestModal
          isOpen={isRequestModalOpen}
          setIsOpen={setIsRequestModalOpen}
          employee={employeeInfo}
          reload={reload}
          shift_requested="Employee"
        />
      )}
    </div>
  );
};

export default EmployeeShiftCalendar;
