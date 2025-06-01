import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";
import { getShiftSchedulesLogs } from "app/hooks/shiftManagement";
import { EmployeeOverview } from "components";
import { toast } from "react-toastify";
import CustomTable from "components/CustomTable";

export default function ShiftCalendarHistoryLogs() {
  const location = useLocation();
  const navigate = useNavigate();
  const employeeId = location.state?.employee_id;

  const [viewType, setViewType] = useState("weekly");
  const [logs, setLogs] = useState({ results: [], count: 0 });
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(
    moment().startOf("week")
  );
  const [currentMonthStart, setCurrentMonthStart] = useState(
    moment().startOf("month")
  );
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-action_timestamp");
  const [weekSummaries, setWeekSummaries] = useState([]);

  const weeklyCalendarRef = useRef(null);
  const monthlyCalendarRef = useRef(null);

  // Redirect if no employee_id
  useEffect(() => {
    if (!employeeId) {
      toast.error("No employee selected");
      navigate(-1);
    }
  }, [employeeId, navigate]);

  // Fetch logs when component mounts or pagination changes
  useEffect(() => {
    if (employeeId) {
      fetchLogs();
    }
  }, [employeeId, options, ordering]);

  // Update calendar when view type or date changes
  useEffect(() => {
    if (logs.results.length > 0) {
      if (viewType === "weekly") {
        generateWeeklyEvents();
      } else {
        generateMonthlyEvents();
        generateMonthlySummaries();
      }
    }
  }, [viewType, currentWeekStart, currentMonthStart, logs]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getShiftSchedulesLogs({
        filterData: { employee: employeeId },
        ordering: ordering,
        options: options,
      });
      console.log("Fetched logs:", response);
      if (response && response.results) {
        setLogs(response);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Failed to fetch shift logs");
    } finally {
      setLoading(false);
    }
  };

  // Parse shift string to extract individual day information
  const parseShiftString = (shiftString) => {
    if (!shiftString) return [];

    // Remove the weekly hours part if present
    const cleanString = shiftString.replace(/\s*\([^)]*h\/week\)\s*$/, "");

    // Split by commas to get individual days
    const dayParts = cleanString.split(",").map((part) => part.trim());
    const shifts = [];

    dayParts.forEach((part) => {
      // Extract date and time/status
      const match = part.match(/(\w+\s+\d+):\s*(.+)/);
      if (match) {
        const dateStr = match[1];
        const timeOrStatus = match[2].trim();

        // Parse the date - we know it's 2025 data
        const date = moment(dateStr + " 2025", "MMM DD YYYY");

        if (timeOrStatus === "OFF") {
          shifts.push({
            date: date.format("YYYY-MM-DD"),
            isOff: true,
            startTime: null,
            endTime: null,
            isSplit: false,
          });
        } else if (timeOrStatus.includes("/")) {
          // Split shift format: "8:00-12:00 / 15:00-18:00"
          const splitParts = timeOrStatus.split("/").map((p) => p.trim());
          const times = splitParts.map((p) => {
            const [start, end] = p.split("-").map((t) => t.trim());
            return { start, end };
          });

          shifts.push({
            date: date.format("YYYY-MM-DD"),
            isOff: false,
            isSplit: true,
            splitTimes: times,
          });
        } else {
          // Regular shift format: "09:00-17:00"
          const [startTime, endTime] = timeOrStatus
            .split("-")
            .map((t) => t.trim());
          shifts.push({
            date: date.format("YYYY-MM-DD"),
            isOff: false,
            startTime,
            endTime,
            isSplit: false,
          });
        }
      }
    });

    return shifts;
  };

  // Generate events for weekly calendar view
  const generateWeeklyEvents = () => {
    const events = [];
    const weekStart = currentWeekStart.clone();
    const weekEnd = weekStart.clone().endOf("week");

    logs.results.forEach((log) => {
      const assignedShifts = parseShiftString(log.assigned_shift);
      const requestedShifts = log.requested_shift
        ? parseShiftString(log.requested_shift)
        : [];

      // Process assigned shifts
      assignedShifts.forEach((shift) => {
        const shiftDate = moment(shift.date);

        if (shiftDate.isBetween(weekStart, weekEnd, "day", "[]")) {
          if (shift.isOff) {
            events.push({
              id: `${log.id}-${shift.date}-assigned-off`,
              title: "OFF (Assigned)",
              date: shift.date,
              allDay: true,
              backgroundColor: "#6B7280",
              borderColor: "#4B5563",
              textColor: "#FFFFFF",
            });
          } else if (shift.isSplit) {
            shift.splitTimes.forEach((time, idx) => {
              events.push({
                id: `${log.id}-${shift.date}-assigned-split-${idx}`,
                title: `${time.start} - ${time.end} (A)`,
                start: `${shift.date}T${time.start}:00`,
                end: `${shift.date}T${time.end}:00`,
                backgroundColor: "#10B981",
                borderColor: "#059669",
                textColor: "#FFFFFF",
              });
            });
          } else {
            events.push({
              id: `${log.id}-${shift.date}-assigned`,
              title: `${shift.startTime} - ${shift.endTime} (A)`,
              start: `${shift.date}T${shift.startTime}:00`,
              end: `${shift.date}T${shift.endTime}:00`,
              backgroundColor: "#10B981",
              borderColor: "#059669",
              textColor: "#FFFFFF",
            });
          }
        }
      });

      // Process ALL requested shifts
      requestedShifts.forEach((shift) => {
        const shiftDate = moment(shift.date);

        if (shiftDate.isBetween(weekStart, weekEnd, "day", "[]")) {
          if (shift.isOff) {
            events.push({
              id: `${log.id}-${shift.date}-requested-off`,
              title: "OFF (Requested)",
              date: shift.date,
              allDay: true,
              backgroundColor: "#DC2626",
              borderColor: "#991B1B",
              textColor: "#FFFFFF",
            });
          } else if (shift.isSplit) {
            shift.splitTimes.forEach((time, idx) => {
              events.push({
                id: `${log.id}-${shift.date}-requested-split-${idx}`,
                title: `${time.start} - ${time.end} (R)`,
                start: `${shift.date}T${time.start}:00`,
                end: `${shift.date}T${time.end}:00`,
                backgroundColor: "#DC2626",
                borderColor: "#991B1B",
                textColor: "#FFFFFF",
              });
            });
          } else {
            events.push({
              id: `${log.id}-${shift.date}-requested`,
              title: `${shift.startTime} - ${shift.endTime} (R)`,
              start: `${shift.date}T${shift.startTime}:00`,
              end: `${shift.date}T${shift.endTime}:00`,
              backgroundColor: "#DC2626",
              borderColor: "#991B1B",
              textColor: "#FFFFFF",
            });
          }
        }
      });
    });

    setCalendarEvents(events);
  };

  // Generate events for monthly calendar view
  const generateMonthlyEvents = () => {
    const events = [];
    const monthStart = currentMonthStart.clone().startOf("month");
    const monthEnd = currentMonthStart.clone().endOf("month");

    logs.results.forEach((log) => {
      const assignedShifts = parseShiftString(log.assigned_shift);
      const requestedShifts = log.requested_shift
        ? parseShiftString(log.requested_shift)
        : [];

      // Process assigned shifts
      assignedShifts.forEach((shift) => {
        const shiftDate = moment(shift.date);

        if (shiftDate.isBetween(monthStart, monthEnd, "day", "[]")) {
          if (shift.isOff) {
            events.push({
              id: `${log.id}-${shift.date}-assigned-off`,
              title: "OFF (A)",
              date: shift.date,
              allDay: true,
              backgroundColor: "#6B7280",
              borderColor: "#4B5563",
              textColor: "#FFFFFF",
            });
          } else if (shift.isSplit) {
            const times = shift.splitTimes
              .map((t) => `${t.start}-${t.end}`)
              .join(" / ");
            events.push({
              id: `${log.id}-${shift.date}-assigned-split`,
              title: `${times} (A)`,
              date: shift.date,
              allDay: true,
              backgroundColor: "#F59E0B",
              borderColor: "#D97706",
              textColor: "#FFFFFF",
            });
          } else {
            events.push({
              id: `${log.id}-${shift.date}-assigned`,
              title: `${shift.startTime} - ${shift.endTime} (A)`,
              date: shift.date,
              allDay: true,
              backgroundColor: "#10B981",
              borderColor: "#059669",
              textColor: "#FFFFFF",
            });
          }
        }
      });

      // Process ALL requested shifts
      requestedShifts.forEach((shift) => {
        const shiftDate = moment(shift.date);

        if (shiftDate.isBetween(monthStart, monthEnd, "day", "[]")) {
          if (shift.isOff) {
            events.push({
              id: `${log.id}-${shift.date}-requested-off`,
              title: "OFF (R)",
              date: shift.date,
              allDay: true,
              backgroundColor: "#DC2626",
              borderColor: "#991B1B",
              textColor: "#FFFFFF",
            });
          } else if (shift.isSplit) {
            const times = shift.splitTimes
              .map((t) => `${t.start}-${t.end}`)
              .join(" / ");
            events.push({
              id: `${log.id}-${shift.date}-requested-split`,
              title: `${times} (R)`,
              date: shift.date,
              allDay: true,
              backgroundColor: "#DC2626",
              borderColor: "#991B1B",
              textColor: "#FFFFFF",
            });
          } else {
            events.push({
              id: `${log.id}-${shift.date}-requested`,
              title: `${shift.startTime} - ${shift.endTime} (R)`,
              date: shift.date,
              allDay: true,
              backgroundColor: "#DC2626",
              borderColor: "#991B1B",
              textColor: "#FFFFFF",
            });
          }
        }
      });
    });

    setCalendarEvents(events);
  };

  // Generate monthly summaries
  const generateMonthlySummaries = () => {
    const summaries = [];
    const weeksInMonth = [];

    // Get all weeks in the current month
    let weekStart = currentMonthStart.clone().startOf("week");
    const monthEnd = currentMonthStart.clone().endOf("month");

    while (weekStart.isSameOrBefore(monthEnd)) {
      weeksInMonth.push({
        start: weekStart.clone(),
        end: weekStart.clone().endOf("week"),
      });
      weekStart.add(1, "week");
    }

    // Group logs by week
    weeksInMonth.forEach((week, index) => {
      const weekLogs = logs.results.filter((log) => {
        const assignedShifts = parseShiftString(log.assigned_shift);
        return assignedShifts.some((shift) => {
          const shiftDate = moment(shift.date);
          return shiftDate.isBetween(week.start, week.end, "day", "[]");
        });
      });

      if (weekLogs.length > 0) {
        summaries.push({
          weekNumber: index + 1,
          dateRange: `${week.start.format("DD MMM")} - ${week.end.format(
            "DD MMM"
          )}`,
          logs: weekLogs,
        });
      }
    });

    setWeekSummaries(summaries.slice(0, 4));
  };

  // Get the latest log for weekly view summary
  const getLatestLogForWeek = () => {
    const weekStart = currentWeekStart.clone();
    const weekEnd = weekStart.clone().endOf("week");

    const weekLogs = logs.results.filter((log) => {
      const assignedShifts = parseShiftString(log.assigned_shift);
      return assignedShifts.some((shift) => {
        const shiftDate = moment(shift.date);
        return shiftDate.isBetween(weekStart, weekEnd, "day", "[]");
      });
    });

    return weekLogs.length > 0 ? weekLogs[0] : null;
  };

  // Navigate weeks
  const navigateWeek = (direction) => {
    const newWeekStart = currentWeekStart.clone().add(direction, "week");
    setCurrentWeekStart(newWeekStart);

    // Update FullCalendar to show the new week
    if (weeklyCalendarRef.current) {
      const calendarApi = weeklyCalendarRef.current.getApi();
      calendarApi.gotoDate(newWeekStart.toDate());
    }
  };

  // Navigate months
  const navigateMonth = (direction) => {
    const newMonthStart = currentMonthStart.clone().add(direction, "month");
    setCurrentMonthStart(newMonthStart);

    // Update FullCalendar to show the new month
    if (monthlyCalendarRef.current) {
      const calendarApi = monthlyCalendarRef.current.getApi();
      calendarApi.gotoDate(newMonthStart.toDate());
    }
  };

  const onPageChange = (name, value) => {
    setOptions((prev) => ({ ...prev, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  // Logs table columns
  const logsColumns = [
    {
      dataField: "log_type",
      text: "Log Type",
      formatter: (cell) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            cell === "Manual Assignment"
              ? "bg-blue-50 text-blue-700"
              : "bg-purple-50 text-purple-700"
          }`}
        >
          {cell}
        </span>
      ),
      dataSort: true,
    },
    {
      dataField: "action_by",
      text: "Action By",
      formatter: (cell) => <EmployeeOverview id={cell} />,
    },
    {
      dataField: "assigned_shift",
      text: "Assigned Shift",
      formatter: (cell) => (
        <div className="text-xs" title={cell}>
          {cell.length > 50 ? `${cell.substring(0, 50)}...` : cell}
        </div>
      ),
    },
    {
      dataField: "requested_shift",
      text: "Requested Shift",
      formatter: (cell) => (
        <div className="text-xs" title={cell || "-"}>
          {cell
            ? cell.length > 50
              ? `${cell.substring(0, 50)}...`
              : cell
            : "-"}
        </div>
      ),
    },
    {
      dataField: "approved_by",
      text: "Approved By",
      formatter: (cell) => (cell ? <EmployeeOverview id={cell} /> : "-"),
    },
    {
      dataField: "approved_on",
      text: "Approved On",
      formatter: (cell) =>
        cell ? moment(cell).format("DD-MMM-YYYY hh:mmA") : "-",
      dataSort: true,
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            cell === "Approved"
              ? "bg-green-50 text-green-700"
              : cell === "Rejected"
              ? "bg-red-50 text-red-700"
              : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {cell}
        </span>
      ),
      dataSort: true,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shift Calendar History and Logs</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <div className="space-y-6">
        {/* Employee Info */}
        <Card>
          <CardContent className="pt-6">
            <EmployeeOverview
              id={employeeId}
              showPosition={true}
              showDepartment={true}
              showBranchName={true}
            />
          </CardContent>
        </Card>

        {/* Section 1: Calendar View */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Calendar View</CardTitle>
              <div className="flex items-center gap-4">
                <span className="text-sm">Toggle View:</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={viewType === "weekly" ? "default" : "outline"}
                    onClick={() => setViewType("weekly")}
                  >
                    Weekly
                  </Button>
                  <Button
                    size="sm"
                    variant={viewType === "monthly" ? "default" : "outline"}
                    onClick={() => setViewType("monthly")}
                  >
                    Monthly
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : viewType === "weekly" ? (
              <div>
                {/* Weekly Navigation */}
                <div className="flex justify-between items-center mb-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigateWeek(-1)}
                  >
                    Back
                  </Button>
                  <h3 className="text-lg font-medium">
                    {currentWeekStart.format("DD MMM")} -{" "}
                    {currentWeekStart
                      .clone()
                      .endOf("week")
                      .format("DD MMM YYYY")}
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigateWeek(1)}
                  >
                    Next
                  </Button>
                </div>

                {/* Weekly Calendar */}
                <div className="h-[400px] mb-4">
                  <FullCalendar
                    key="weekly-calendar"
                    ref={weeklyCalendarRef}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={false}
                    initialDate={currentWeekStart.toDate()}
                    events={calendarEvents}
                    height="100%"
                    slotMinTime="06:00:00"
                    slotMaxTime="23:00:00"
                    slotDuration="01:00:00"
                    expandRows={true}
                    nowIndicator={true}
                    dayHeaderFormat={{
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    }}
                    eventDisplay="block"
                  />
                </div>

                {/* Legend */}
                <div className="border-t pt-4 mt-4">
                  <div className="text-sm font-medium mb-2">Legend:</div>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Assigned Shift</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-600 rounded"></div>
                      <span>Requested </span>
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
                </div>
                {(() => {
                  const latestLog = getLatestLogForWeek();
                  return latestLog ? (
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Date Range:</span>
                        <span>
                          {currentWeekStart.format("DD MMM")} -{" "}
                          {currentWeekStart
                            .clone()
                            .endOf("week")
                            .format("DD MMM YYYY")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Assigned by:</span>
                        <EmployeeOverview id={latestLog.action_by} />
                      </div>
                      {latestLog.approved_by && (
                        <div className="flex justify-between">
                          <span className="font-medium">Approved by:</span>
                          <EmployeeOverview id={latestLog.approved_by} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="border-t pt-4 text-center text-muted-foreground">
                      No shift data for this week
                    </div>
                  );
                })()}
              </div>
            ) : (
              // Monthly View
              <div>
                {/* Monthly Navigation */}
                <div className="flex justify-between items-center mb-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigateMonth(-1)}
                  >
                    Back
                  </Button>
                  <h3 className="text-lg font-medium">
                    {currentMonthStart.format("MMMM YYYY")}
                  </h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigateMonth(1)}
                  >
                    Next
                  </Button>
                </div>

                {/* Monthly Calendar */}
                <div className="h-[600px] mb-4">
                  <FullCalendar
                    key="monthly-calendar"
                    ref={monthlyCalendarRef}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={false}
                    initialDate={currentMonthStart.toDate()}
                    events={calendarEvents}
                    height="100%"
                    dayMaxEvents={3}
                    moreLinkClick="popover"
                    eventDisplay="block"
                    eventTextColor="#ffffff"
                  />
                </div>

                {/* Monthly Summary */}
                <div className="border-t pt-4">
                  <div className="font-medium mb-3">Weekly Summaries</div>
                  <div className="space-y-3">
                    {weekSummaries.length > 0 ? (
                      weekSummaries.map((week, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="font-medium text-sm mb-1">
                            Week {week.weekNumber}: {week.dateRange}
                          </div>
                          {week.logs.slice(0, 1).map((log, logIndex) => (
                            <div key={logIndex} className="text-sm space-y-1">
                              <div>
                                <span className="text-muted-foreground">
                                  Assigned by:
                                </span>{" "}
                                <EmployeeOverview id={log.action_by} />
                              </div>
                              {log.approved_by && (
                                <div>
                                  <span className="text-muted-foreground">
                                    Approved by:
                                  </span>{" "}
                                  <EmployeeOverview id={log.approved_by} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No shift data for this month
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomTable
              columns={logsColumns}
              data={logs.results || []}
              pagination={true}
              dataTotalSize={logs.count || 0}
              tableOptions={tableOptions}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
