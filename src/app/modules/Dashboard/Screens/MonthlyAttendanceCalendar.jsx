import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
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
  isSameMonth,
  isBefore,
  isAfter,
} from "date-fns";
import { useSelector } from "react-redux";
import { getAttendance } from "app/hooks/attendance";

export default function MonthlyAttendanceCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({});
  const [holidays, setHolidays] = useState([]);
  const userProfile = useSelector((state) => state.user.userProfile);

  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // Get first and last day of the month for filter
      const startDate = format(startOfMonth(currentMonth), "yyyy-MM-dd");
      const endDate = format(endOfMonth(currentMonth), "yyyy-MM-dd");

      // Fetch attendance records for the current month
      const response = await getAttendance({
        filterData: {
          employee_id: userProfile.id,
          start_date: startDate,
          end_date: endDate,
        },
      });

      // Process the data into a map keyed by date
      const attendanceMap = {};
      if (response && response.results) {
        response.results.forEach((record) => {
          const date = record.date;
          attendanceMap[date] = {
            status: record.status,
            checkin: record.checkin,
            checkout: record.checkout,
            total_hours: record.total_hours || 0,
            isLeave: record.is_leave || false,
          };
        });
      }

      setAttendanceData(attendanceMap);

      // these needs to be filled after event management module
      setHolidays([]);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [currentMonth, userProfile.id]);

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

  // Determine day status and color
  const getDayStatus = (day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const today = new Date();

    // Check if it's a holiday
    if (holidays.includes(dateStr)) {
      return { status: "Holiday", color: "bg-gray-200 text-gray-800" };
    }

    // For future dates (from any month)
    if (isAfter(day, today)) {
      return { status: "Upcoming", color: "bg-gray-200 text-gray-800" };
    }

    // Check if there's attendance data for this day
    if (attendanceData[dateStr]) {
      const record = attendanceData[dateStr];

      // If it's a leave day
      if (record.isLeave) {
        return { status: "On Leave", color: "bg-blue-100 text-blue-800" };
      }
      // Based on attendance status
      switch (record.status) {
        case "Present":
          return { status: "Present", color: "bg-green-100 text-green-800" };
        case "Absent":
          return { status: "Absent", color: "bg-[#fee2e2] text-red-800" };
        case "Late":
          return { status: "Late", color: "bg-yellow-100 text-yellow-800" };
        default:
          // For any other status
          return { status: record.status, color: "bg-gray-100 text-gray-800" };
      }
    }

    // For past dates with no record (default to absent)
    // Only mark as absent if the date is from the past
    if (isBefore(day, today)) {
      return { status: "Absent", color: "bg-[#fee2e2] text-red-800" };
    }

    // Default for current dates with no data yet
    return { status: "Pending", color: "bg-white" };
  };

  // Get tooltip content for a specific day
  const getTooltipContent = (day) => {
    const dateStr = format(day, "yyyy-MM-dd");
    const formattedDate = format(day, "MMMM dd, yyyy");
    const today = new Date();

    // For future dates
    if (isAfter(day, today)) {
      return `Upcoming - ${formattedDate}`;
    }

    if (holidays.includes(dateStr)) {
      return `Holiday - ${formattedDate}`;
    }

    if (attendanceData[dateStr]) {
      const record = attendanceData[dateStr];

      // Format times for display
      const checkin = record.checkin
        ? format(new Date(record.checkin), "hh:mm a")
        : "N/A";
      const checkout = record.checkout
        ? format(new Date(record.checkout), "hh:mm a")
        : "N/A";

      return (
        <div className="space-y-1">
          <p>
            <span className="font-medium">Date:</span> {formattedDate}
          </p>
          <p>
            <span className="font-medium">Status:</span> {record.status}
          </p>
          <p>
            <span className="font-medium">Check-in:</span> {checkin}
          </p>
          <p>
            <span className="font-medium">Check-out:</span> {checkout}
          </p>
          {record.total_hours > 0 && (
            <p>
              <span className="font-medium">Hours:</span>{" "}
              {record.total_hours.toFixed(2)}
            </p>
          )}
        </div>
      );
    }

    // For past dates with no data
    if (isBefore(day, today)) {
      return (
        <div className="space-y-1">
          <p>
            <span className="font-medium">Date:</span> {formattedDate}
          </p>
          <p>
            <span className="font-medium">Status:</span> Absent (No data)
          </p>
          <p>
            <span className="font-medium">Check-in:</span> N/A
          </p>
          <p>
            <span className="font-medium">Check-out:</span> N/A
          </p>
        </div>
      );
    }

    return formattedDate;
  };

  return (
    <>
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Monthly Attendance
          </div>
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
            <p>Loading attendance data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {emptyDays}
            {daysInMonth.map((day) => {
              const { status, color } = getDayStatus(day);
              const isCurrentDay = isToday(day);

              return (
                <TooltipProvider key={day.toString()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          h-10 w-10 rounded-full flex items-center justify-center text-sm cursor-pointer
                          ${color}
                          ${isCurrentDay ? "ring-2 ring-primary" : ""}
                          hover:opacity-90
                        `}
                      >
                        {day.getDate()}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{getTooltipContent(day)}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-100 mr-2"></div>
            <span className="text-xs text-muted-foreground">Present</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#fee2e2] mr-2"></div>
            <span className="text-xs text-muted-foreground">Absent</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-100 mr-2"></div>
            <span className="text-xs text-muted-foreground">On Leave</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-100 mr-2"></div>
            <span className="text-xs text-muted-foreground">Late</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
            <span className="text-xs text-muted-foreground">Holiday</span>
          </div>
        </div>
      </CardContent>
    </>
  );
}
