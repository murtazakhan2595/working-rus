import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  parseISO,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { useSelector } from "react-redux";
import { getLeaveTransaction } from "app/hooks/leaveTracker";

export default function EventCalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAll, setShowAll] = useState(false);
  const userProfile = useSelector((state) => state.user.userProfile);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventDays, setEventDays] = useState([]);
  const [eventInfo, setEventInfo] = useState({});
  const [leaveDays, setLeaveDays] = useState([]);
  const [leaveInfo, setLeaveInfo] = useState({});
  const [leaveTransaction, setLeaveTransaction] = useState([]);

  // Fetch leave transaction data
  useEffect(() => {
    const fetchLeaveTransaction = async () => {
      try {
        const filterData = {
          employee_id: userProfile.id,
        };
        const leaves = await getLeaveTransaction({
          filterData,
          options: { page: 1, sizePerPage: 100 },
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

  // Process leave data and other events when month changes
  useEffect(() => {
    processLeaveData(currentMonth);
    fetchEvents(currentMonth);
    setLoading(false);
  }, [currentMonth, leaveTransaction]);

  // Mock function to fetch events - to be implemented with actual event API
  const fetchEvents = (month) => {
    // This is a placeholder. In reality, you would fetch events from your API
    // Temporary mock data for demonstration
    const mockEvents = [
      {
        id: 1,
        title: "Public Holiday - Labor Day",
        date: new Date(month.getFullYear(), month.getMonth(), 1),
        type: "holiday",
      },
      {
        id: 2,
        title: "Team Building",
        date: new Date(month.getFullYear(), month.getMonth(), 15),
        type: "event",
      },
      {
        id: 3,
        title: "John's Birthday",
        date: new Date(month.getFullYear(), month.getMonth(), 22),
        type: "birthday",
      },
    ];

    // Process events for the current month
    const eventsByDay = {};
    const daysWithEvents = [];

    mockEvents.forEach((event) => {
      const day = getDate(event.date);
      daysWithEvents.push(day);

      if (!eventsByDay[day]) {
        eventsByDay[day] = {
          type: event.type,
          title: event.title,
        };
      }
    });

    setEvents(mockEvents);
    setEventDays(daysWithEvents);
    setEventInfo(eventsByDay);
  };

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

  // Determine day type (event, leave, or regular)
  const getDayType = (day) => {
    const dayOfMonth = day.getDate();
    if (eventDays.includes(dayOfMonth)) return "event";
    if (leaveDays.includes(dayOfMonth)) return "leave";
    return "regular";
  };

  // Get event type specific color
  const getEventColor = (day) => {
    const dayOfMonth = day.getDate();
    if (!eventDays.includes(dayOfMonth)) return "";

    const eventType = eventInfo[dayOfMonth]?.type;
    switch (eventType) {
      case "holiday":
        return "bg-green-100 text-green-800";
      case "event":
        return "bg-amber-100 text-amber-800";
      case "birthday":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100";
    }
  };

  // Get tooltip content based on day type
  const getTooltipContent = (day, type) => {
    const dayOfMonth = day.getDate();
    const formattedDate = format(day, "MMMM dd, yyyy");

    switch (type) {
      case "event":
        return `${eventInfo[dayOfMonth]?.title} - ${formattedDate}`;
      case "leave":
        const leave = leaveInfo[dayOfMonth];
        return `Leave: ${leave.type} (${leave.startDate} - ${leave.endDate})`;
      default:
        return `${formattedDate}`;
    }
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
              const eventColor = getEventColor(day);

              return (
                <TooltipProvider key={day.toString()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          h-10 w-10 rounded-full flex items-center justify-center text-sm cursor-pointer
                          ${dayType === "event" ? eventColor : ""}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Upcoming Events</h3>
                <div className="flex flex-col gap-2">
                  {events.map((event) => (
                    <div
                      key={`event-${event.id}`}
                      className={`
                        px-3 py-2 text-xs rounded-md flex justify-between items-center
                        ${
                          event.type === "holiday"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                        ${
                          event.type === "event"
                            ? "bg-amber-100 text-amber-800"
                            : ""
                        }
                        ${
                          event.type === "birthday"
                            ? "bg-indigo-100 text-indigo-800"
                            : ""
                        }
                      `}
                    >
                      <span>{event.title}</span>
                      <span>{format(event.date, "MMM d")}</span>
                    </div>
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
            <div className="w-3 h-3 rounded-full bg-green-100 mr-2"></div>
            <span className="text-xs text-muted-foreground">Holiday</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-100 mr-2"></div>
            <span className="text-xs text-muted-foreground">Event</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-100 mr-2"></div>
            <span className="text-xs text-muted-foreground">Birthday</span>
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
