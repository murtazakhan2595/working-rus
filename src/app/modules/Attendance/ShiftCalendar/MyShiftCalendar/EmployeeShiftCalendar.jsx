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
} from "../ShiftCalendarTab/shiftScheduleUtils";

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
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });
  const [ordering, setOrdering] = useState("-id");

  const userProfile = useSelector((state) => state.user.userProfile);
  const employeeId = 10;
  // const employeeId = userProfile?.employee_id || userProfile?.id;

  // Fetch employee data and shifts
  useEffect(() => {
    fetchEmployeeData();
    fetchApprovedShifts();
    fetchChangeRequests();
  }, [employeeId]);

  const fetchEmployeeData = async () => {
    try {
      const empData = await employeeData(employeeId);
      setEmployeeInfo(empData);

      // Also fetch direct shift assignment if exists
      if (empData?.shift_assignment) {
        const shiftData = await getShiftById(empData.shift_assignment);
        if (shiftData) {
          setDirectShift(shiftData);
        }
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const fetchApprovedShifts = async () => {
    try {
      setLoading(true);
      const response = await getShiftSchedule({
        filterData: {
          employee: employeeId,
          status: "Approved",
          is_change_request: false, // Don't include change requests
        },
        ordering: "-created_at", // Get newest first
      });

      if (response && response.results) {
        // Filter out older overlapping schedules
        const filteredSchedules = filterOverlappingSchedules(response.results);

        setScheduleShifts({
          results: filteredSchedules,
          count: filteredSchedules.length,
        });

        generateCalendarEvents(filteredSchedules, directShift);
      }
    } catch (error) {
      console.error("Error fetching approved shifts:", error);
      toast.error("Failed to load shift calendar");
    } finally {
      setLoading(false);
    }
  };

  const fetchChangeRequests = async () => {
    try {
      const response = await getShiftSchedule({
        filterData: {
          employee: employeeId,
          is_change_request: true,
          ordering: "-created_at",
          shift_requested: "Employee", // Only fetch employee-initiated requests
        },
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

    // Generate events from approved schedules
    approvedSchedules.forEach((schedule) => {
      if (schedule.is_org_based && schedule.shift_details) {
        // Organization-based scheduled shift
        events.push(...generateOrgScheduleEvents(schedule));
      } else if (schedule.custom_schedule) {
        // Custom scheduled shift
        events.push(...generateCustomScheduleEvents(schedule));
      }
    });

    // Only add direct shift events if no schedules exist
    if (events.length === 0 && directShiftData) {
      events.push(...generateDirectShiftEvents(directShiftData));
    }

    setEvents(events);
  };

  const generateDirectShiftEvents = (shift) => {
    const events = [];

    // Show for current month only
    const startOfMonth = moment().startOf("month");
    const endOfMonth = moment().endOf("month");

    let currentDate = startOfMonth.clone();
    while (currentDate.isSameOrBefore(endOfMonth)) {
      // Skip weekends for default org shifts (you can modify this logic)
      if (currentDate.day() !== 0 && currentDate.day() !== 6) {
        const startTime = moment(shift.starttime).format("HH:mm");
        const endTime = moment(shift.endtime).format("HH:mm");

        events.push({
          title: `${shift.name} (${startTime} - ${endTime})`,
          start: `${currentDate.format("YYYY-MM-DD")}T${startTime}:00`,
          end: `${currentDate.format("YYYY-MM-DD")}T${endTime}:00`,
          backgroundColor: "#3B82F6", // Blue for direct assignments
          borderColor: "#2563EB",
          textColor: "#FFFFFF",
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
        const startTime = moment(shiftDetails.starttime, "HH:mm:ss").format(
          "HH:mm"
        );
        const endTime = moment(shiftDetails.endtime, "HH:mm:ss").format(
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
        });
      }
    });

    return events;
  };

  const handleRequestSuccess = () => {
    fetchChangeRequests();
    fetchApprovedShifts(); // Also refresh the calendar
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
        <Button onClick={() => setIsRequestModalOpen(true)}>
          Request Shift Change
        </Button>
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
                dayMaxEvents={3}
                moreLinkClick="popover"
                eventTextColor="#ffffff"
                nowIndicator={true}
                weekends={true}
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
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Request Records */}
      <Card>
        <CardHeader>
          <CardTitle>My Shift Change Requests</CardTitle>
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

      {/* Reuse the same Shift Change Request Modal */}
      {isRequestModalOpen && employeeInfo && (
        <ShiftChangeRequestModal
          isOpen={isRequestModalOpen}
          setIsOpen={setIsRequestModalOpen}
          employee={employeeInfo}
          onRequestSuccess={handleRequestSuccess}
          shift_requested="Employee"
        />
      )}
    </div>
  );
};

export default EmployeeShiftCalendar;
