import React, { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
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
  getWeekDay,
  isSameMonth,
} from "date-fns";
import { getShiftById } from "app/hooks/attendance";
import { useSelector } from "react-redux";
import { getEmployeeWorkInformationData } from "app/hooks/employee";
import { getEmployeeData } from "app/hooks/employee";

export default function EventCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAll, setShowAll] = useState(false);
  const userProfile = useSelector((state) => state.user.userProfile);
  const [shiftData, setShiftData] = useState(null);
  const [workingDays, setWorkingDays] = useState([]);
  const [absentDays, setAbsentDays] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Calculate working days whenever the month or shift data changes
  useEffect(() => {
    if (shiftData) {
      calculateWorkingDays(shiftData, currentMonth);
    }
  }, [currentMonth, shiftData]);

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

  // Determine day type (working, absent, or regular)
  const getDayType = (day) => {
    const dayOfMonth = day.getDate();
    if (workingDays.includes(dayOfMonth)) return "working";
    if (absentDays.includes(dayOfMonth)) return "absent";
    return "regular";
  };

  // Get tooltip content based on day type
  const getTooltipContent = (day, type) => {
    const dayOfMonth = day.getDate();
    const formattedDate = format(day, "MMMM dd, yyyy");

    switch (type) {
      case "working":
        let shiftTimes = "";
        if (shiftData) {
          const startTime = new Date(shiftData.starttime);
          const endTime = new Date(shiftData.endtime);
          shiftTimes = ` (${format(startTime, "h:mm a")} - ${format(
            endTime,
            "h:mm a"
          )})`;
        }
        return `Working Day - ${formattedDate}${shiftTimes}`;
      case "absent":
        return `Non-working Day - ${formattedDate}`;
      default:
        return `${formattedDate}`;
    }
  };

  return (
    <>
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Attendance Calendar
            {/* {shiftData && (
              <span className="ml-2 text-sm font-normal">
                ({shiftData.name} Shift)
              </span>
            )} */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-100 mr-2"></div>
            <span className="text-xs text-muted-foreground">Working Day</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#fee2e2] mr-2"></div>
            <span className="text-xs text-muted-foreground">Absent</span>
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
