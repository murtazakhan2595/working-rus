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

const EmployeeShiftCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [employeeInfo, setEmployeeInfo] = useState(null);
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
  const employeeId = userProfile?.employee_id || userProfile?.id;

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
        },
      });

      if (response) {
        setScheduleShifts(response);
        generateCalendarEvents(response.results);
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
        },
      });

      if (response) {
        setChangeRequests(response);
      }
    } catch (error) {
      console.error("Error fetching change requests:", error);
    }
  };

  const generateCalendarEvents = (approvedSchedules) => {
    const events = [];

    approvedSchedules.forEach((schedule) => {
      if (schedule.is_org_based && schedule.shift_details) {
        // Organization-based scheduled shift
        events.push(...generateOrgScheduleEvents(schedule));
      } else if (schedule.custom_schedule) {
        // Custom scheduled shift
        events.push(...generateCustomScheduleEvents(schedule));
      }
    });

    setEvents(events);
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
        const startTime = moment(shiftDetails.starttime).format("HH:mm");
        const endTime = moment(shiftDetails.endtime).format("HH:mm");

        events.push({
          title: `${shiftDetails.name} (${startTime} - ${endTime})`,
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
    toast.success("Shift change request submitted successfully!");
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
      text: "Assigned Date",
      formatter: (cell, row) => {
        return `${moment(row.start_date).format("DD MMM")} - ${moment(
          row.end_date
        ).format("DD MMM YYYY")}`;
      },
      dataSort: true,
    },
    {
      dataField: "schedule_name",
      text: "Assigned Shift",
      formatter: (cell, row) => {
        // Show original shift info
        if (row.is_org_based && row.shift_details) {
          return row.shift_details.name;
        }
        return "Custom Shift";
      },
    },
    {
      dataField: "custom_schedule",
      text: "Requested Timing/Status",
      formatter: (cell) => {
        if (!cell) return "N/A";

        // Show summary of requested changes
        const dates = Object.keys(cell);
        if (dates.length === 1) {
          const daySchedule = cell[dates[0]];
          if (daySchedule.is_off) return "OFF";
          if (daySchedule.is_split) return "Split Shift";
          return `${daySchedule.start_time} - ${daySchedule.end_time}`;
        }
        return `Changes for ${dates.length} days`;
      },
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
              statusColors[cell] || "bg-gray-50 text-gray-700"
            }`}
          >
            {cell || "N/A"}
          </span>
        );
      },
      dataSort: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Shift Calendar</h2>
        <Button onClick={() => setIsRequestModalOpen(true)} size="lg">
          Request Shift Change
        </Button>
      </div>

      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>Your Approved Shift Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <div className="text-gray-500 mt-2">Loading calendar...</div>
              </div>
            </div>
          ) : (
            <div className="h-[600px]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek",
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
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Request Records */}
      <Card>
        <CardHeader>
          <CardTitle>Change Request Records</CardTitle>
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
        />
      )}
    </div>
  );
};

export default EmployeeShiftCalendar;
