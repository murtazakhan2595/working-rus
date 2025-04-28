import React, { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../src/@/components/ui/tooltip";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isToday,
  getDate,
  parseISO,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { getShiftById } from "app/hooks/attendance";
import { useSelector } from "react-redux";
import { getEmployeeWorkInformationData } from "app/hooks/employee";
import { getEmployeeData } from "app/hooks/employee";
import { getLeaveTransaction } from "app/hooks/leaveTracker";

export default function EventCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAll, setShowAll] = useState(false);
  const userProfile = useSelector((state) => state.user.userProfile);
  const [shiftData, setShiftData] = useState(null);
  const [workingDays, setWorkingDays] = useState([]);
  const [absentDays, setAbsentDays] = useState([]);
  const [leaveDays, setLeaveDays] = useState([]);
  const [leaveInfo, setLeaveInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [leaveTransaction, setLeaveTransaction] = useState([]);

  console.log("shiftData", shiftData);

  useEffect(() => {
    const getEmpShift = async () => {
      try {
        setLoading(true);
        const workInfo = await getEmployeeData(userProfile.id);
        if (workInfo && workInfo.shift_assignment) {
          const res = await getShiftById(workInfo.shift_assignment);
          setShiftData(res);

          if (res) {
            calculateWorkingDays(res, currentMonth);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shift data:", error);
        setLoading(false);
      }
    };

    getEmpShift();
  }, [userProfile.id]);

  // Fetch leave transaction data
  useEffect(() => {
    const fetchLeaveTransaction = async () => {
      try {
        const filterData = {
          employee_id: userProfile.id,
        };
        const leaves = await getLeaveTransaction({
          filterData,
          options: { page: 1, sizePerPage: 100 }, // Get more leaves to ensure all are visible
        });

        if (leaves) {
          setLeaveTransaction(leaves.results || []);
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    fetchLeaveTransaction();
  }, [userProfile.id]);

  // Calculate working days and leave days whenever the month, shift data, or leave transactions change
  useEffect(() => {
    if (shiftData) {
      calculateWorkingDays(shiftData, currentMonth);
    }

    // Process leave data for the current month
    processLeaveData(currentMonth);
  }, [currentMonth, shiftData, leaveTransaction]);

  const processLeaveData = (month) => {
    const startDate = startOfMonth(month);
    const endDate = endOfMonth(month);
    const leaveMap = {};
    const leaveDaysArray = [];

    // Organize leave data by date
    leaveTransaction.forEach((leave) => {
      // Check if leave is approved
      const isApproved =
        leave?.action_hr === "Approved" && leave?.action_manager === "Approved";

      // Only process approved leaves
      if (isApproved && leave.leave_request) {
        const leaveStartDate = parseISO(leave.leave_request.start_date);
        const leaveEndDate = parseISO(leave.leave_request.end_date);

        // Check if leave falls within the current month
        if (
          isWithinInterval(leaveStartDate, {
            start: startDate,
            end: endDate,
          }) ||
          isWithinInterval(leaveEndDate, { start: startDate, end: endDate }) ||
          (leaveStartDate <= startDate && leaveEndDate >= endDate)
        ) {
          // Get all days in the leave period
          const leavePeriodDays = eachDayOfInterval({
            start: leaveStartDate < startDate ? startDate : leaveStartDate,
            end: leaveEndDate > endDate ? endDate : leaveEndDate,
          });

          // Add each day to leave days
          leavePeriodDays.forEach((day) => {
            const dayOfMonth = getDate(day);
            leaveDaysArray.push(dayOfMonth);

            // Store leave information for tooltip
            leaveMap[dayOfMonth] = {
              type: leave.component_name,
              days: leave.leave_request.no_of_days,
              startDate: format(leaveStartDate, "MMM d"),
              endDate: format(leaveEndDate, "MMM d"),
            };
          });
        }
      }
    });

    setLeaveDays(leaveDaysArray);
    setLeaveInfo(leaveMap);
  };

  const calculateWorkingDays = (shift, month) => {
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month),
    });

    const workDays = [];
    const absents = [];

    daysInMonth.forEach((day) => {
      const dayName = format(day, "EEEE"); // Get day name (Monday, Tuesday, etc.)

      // Check if this day is in the shift's weekdays
      if (shift.weekdays.includes(dayName)) {
        workDays.push(getDate(day));
      } else {
        // If it's a weekday but not in shift's weekdays, consider it absent
        if (
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
            dayName
          )
        ) {
          absents.push(getDate(day));
        }
      }
    });

    setWorkingDays(workDays);
    setAbsentDays(absents);
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of the week for the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = getDay(monthStart);

  // Generate empty cells for days before the first day of the month
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`empty-${i}`} className="h-10 w-10" />
  ));

  // Determine day type (working, absent, leave, or regular)
  const getDayType = (day) => {
    const dayOfMonth = day.getDate();
    if (leaveDays.includes(dayOfMonth)) return "leave";
    if (workingDays.includes(dayOfMonth)) return "working";
    if (absentDays.includes(dayOfMonth)) return "absent";
    return "regular";
  };

  // Get tooltip content based on day type
  const getTooltipContent = (day, type) => {
    const dayOfMonth = day.getDate();
    const formattedDate = format(day, "MMMM dd, yyyy");

    switch (type) {
      case "leave":
        const leave = leaveInfo[dayOfMonth];
        return `Leave: ${leave.type} (${leave.startDate} - ${leave.endDate})`;
      case "working":
        let shiftTimes = "";
        if (shiftData) {
          shiftTimes = ` (${shiftData.shiftStartTime} - ${shiftData.shiftEndTime})`;
        }
        return `Working Day - ${formattedDate}${shiftTimes}`;
      case "absent":
        return `Non-working Day - ${formattedDate}`;
      default:
        return `${formattedDate}`;
    }
  };

  // Format days of the week for display
  const formatWeekdays = (weekdays) => {
    if (!weekdays || weekdays.length === 0) return "N/A";
    return weekdays.join(", ");
  };

  return (
    <>
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Event Calendar
          </div>
          <Button
            variant="ghost"
            className=""
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Hide Details" : "View Details"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Shift Details Section */}
        {showAll &&<>
          {shiftData ? (
            <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <span className="font-medium text-sm mr-2">Shift Name:</span>
                  <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                    {shiftData.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="text-sm">
                    {shiftData.shiftStartTime} - {shiftData.shiftEndTime}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-sm mr-2">Type:</span>
                  <span className="text-sm">{shiftData.type}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="font-medium text-sm mr-2">Working Days:</span>
                <span className="text-sm">
                  {formatWeekdays(shiftData.weekdays)}
                </span>
              </div>
            </div>
          ) : !loading ? (
            <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-500">No shift assigned</p>
            </div>
          ) : null}
        </>}

        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-800"
            onClick={prevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium text-lg">
            {format(currentMonth, "MMMM yyyy")}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-800"
            onClick={nextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading calendar data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {emptyDays}
            {daysInMonth.map((day) => {
              const dayType = getDayType(day);
              const isCurrentDay = isToday(day);

              return (
                <TooltipProvider key={day.toString()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          h-10 w-10 rounded-full flex items-center justify-center text-sm cursor-pointer
                          ${
                            dayType === "working"
                              ? "bg-blue-100 text-blue-800"
                              : ""
                          }
                          ${
                            dayType === "absent"
                              ? "bg-[#fee2e2] text-red-800"
                              : ""
                          }
                          ${
                            dayType === "leave"
                              ? "bg-purple-100 text-purple-800"
                              : ""
                          }
                          ${isCurrentDay ? "ring-2 ring-primary" : ""}
                          hover:bg-gray-100
                        `}
                      >
                        {day.getDate()}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getTooltipContent(day, dayType)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}

        {showAll && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Working Days</h3>
                <div className="flex flex-wrap gap-2">
                  {workingDays.map((day) => (
                    <span
                      key={`working-${day}`}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
                    >
                      {format(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          day
                        ),
                        "MMM d"
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Non-Working Days</h3>
                <div className="flex flex-wrap gap-2">
                  {absentDays.map((day) => (
                    <span
                      key={`absent-${day}`}
                      className="px-2 py-1 text-xs bg-[#fee2e2] text-red-800 rounded-md"
                    >
                      {format(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          day
                        ),
                        "MMM d"
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Leave Days</h3>
                <div className="flex flex-wrap gap-2">
                  {leaveDays.map((day) => (
                    <span
                      key={`leave-${day}`}
                      className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-md"
                    >
                      {format(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth(),
                          day
                        ),
                        "MMM d"
                      )}{" "}
                      - {leaveInfo[day].type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-100 mr-2"></div>
            <span className="text-xs text-muted-foreground">Working Day</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#fee2e2] mr-2"></div>
            <span className="text-xs text-muted-foreground">Non-Working</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-100 mr-2"></div>
            <span className="text-xs text-muted-foreground">On Leave</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full border border-primary mr-2"></div>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
        </div>
      </CardContent>
    </>
  );
}
