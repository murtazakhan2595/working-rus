

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, Plus } from "lucide-react";
import {
  CardHeader,
  CardTitle,
  CardContent,
} from "components/ui/card";
import { Button } from "components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
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
} from "date-fns";
import { getEmployeeListWithDetail } from "app/hooks/general";
import Avatar from "components/ui/Avatar";
import SheetComponent from "components/ui/SheetComponent";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import AlertDialogue from "components/ui/AlertDialogue";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
  getEventList,
  saveEvent,
  deleteEvent,
} from "app/hooks/eventManagement";

// Import modular components
import { EVENT_TYPES, EVENT_COLORS, validateEventForm } from "./EventTypes";
import {
  getEvents,
  getEventColor,
  getTooltipContent,
  getEventInitialValues,
} from "./EventCalendarUtils";
import {
  processEmployeeBirthdays,
  processWorkAnniversaries,
  processEvents,
} from "./EventProcessors";
import {
  ViewEventComponent,
  EditEventFormComponent,
} from "./EventFormComponents";

export function EventCalendarWidget() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [eventDays, setEventDays] = useState([]);
  const [eventInfo, setEventInfo] = useState({});
  const [employees, setEmployees] = useState([]);

  // Sheet management for adding/editing events
  const [isEventSheetOpen, setIsEventSheetOpen] = useState(false);
  const [closeSheet, setCloseSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Adding view mode for events
  const [viewMode, setViewMode] = useState(true); // true = view mode, false = edit mode

  // Get user profile from Redux
  const userProfile = useSelector((state) => state.user.userProfile);
  const isHR = userProfile?.role === 3 || userProfile?.role === 1;

  // Fetch employees and process events when month changes
  useEffect(() => {
    fetchEmployeesAndProcessEvents();
  }, [currentMonth]);

  const fetchEmployeesAndProcessEvents = async () => {
    try {
      setLoading(true);

      // Fetch employee data for birthdays
      const empData = await getEmployeeListWithDetail();
      setEmployees(empData);

      // Process birthdays
      const birthdayEvents = processEmployeeBirthdays(empData, currentMonth);

      // Process work anniversaries
      const workAnniversaryEvents = processWorkAnniversaries(
        empData,
        currentMonth,
        isHR
      );

      // Fetch custom events for the current month
      const customEvents = await getEvents(
        currentMonth.getMonth(),
        currentMonth.getFullYear(),
        getEventList
      );

      // Combine all events
      const allEvents = [
        ...birthdayEvents,
        ...workAnniversaryEvents,
        ...customEvents,
      ];

      processEvents(
        allEvents,
        currentMonth,
        setEvents,
        setEventDays,
        setEventInfo
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Month navigation
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Handle day click to show events or open add event sheet
  const handleDayClick = (day) => {
    // Set selected date for the form
    setSelectedDate(day);

    // Clear any previously selected event
    setSelectedEvent(null);
    setViewMode(false); // Start in edit mode

    // Open the sheet for creating a new event
    setIsEventSheetOpen(true);
  };

  // Open event sheet with "Add Event" button
  const handleAddEventClick = () => {
    // Set today's date as default
    setSelectedDate(new Date());
    setSelectedEvent(null);
    setViewMode(false); // Start in edit mode for new events
    setIsEventSheetOpen(true);
  };

  // Handle clicking on an existing event
  const handleEventClick = (event) => {
    if (event.system) return; // Don't edit system events like birthdays

    setSelectedDate(new Date(event.date));
    setSelectedEvent(event);
    setViewMode(true); // Start in view mode
    setIsEventSheetOpen(true);
  };

  // Handle event form submission
  const handleEventSubmit = async (values, { setSubmitting }) => {
    try {
      // Add selected date to the form values
      const eventData = {
        ...values,
        date: selectedDate
          ? format(selectedDate, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
      };

      const response = await saveEvent(eventData);
      if (response) {
        fetchEmployeesAndProcessEvents(); // Refresh events after saving
        toast.success(
          selectedEvent
            ? "Event updated successfully"
            : "Event created successfully"
        );
      }
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
    } finally {
      setSubmitting(false);
      setIsEventSheetOpen(false);
      setCloseSheet(false);
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async () => {
    if (!selectedEvent || !selectedEvent.id) return;

    try {
      await deleteEvent(selectedEvent.id);

      // Update local state
      setEvents(events.filter((e) => e.id !== selectedEvent.id));

      // Close dialogs and show success message
      setIsDeleteDialogOpen(false);
      setIsEventSheetOpen(false);
      toast.success("Event deleted successfully");

      // Refresh the calendar
      fetchEmployeesAndProcessEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
    }
  };

  // Handle sheet close
  const handleClose = () => {
    setCloseSheet(true);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfMonth = getDay(monthStart);

  // Generate empty cells for days before the first day of the month
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => (
    <div key={`empty-${i}`} className="h-10 w-10" />
  ));

  // Check if day has events
  const hasEvents = (day) => {
    const dayOfMonth = day.getDate();
    return eventDays.includes(dayOfMonth);
  };

  return (
    <>
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Event Calendar
          </div>
          <div className="flex items-center gap-2">
            {isHR && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleAddEventClick}
              >
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            )}
            <Button
              variant="ghost"
              className=""
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Hide Details" : "View Details"}
            </Button>
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
            <p>Loading calendar data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {emptyDays}
            {daysInMonth.map((day) => {
              const hasEventOnDay = hasEvents(day);
              const isCurrentDay = isToday(day);
              const eventColor = getEventColor(
                day,
                eventDays,
                eventInfo,
                EVENT_TYPES,
                EVENT_COLORS
              );
              const isPastDay = day < new Date(new Date().setHours(0, 0, 0, 0));
              const dayOfMonth = day.getDate();
              const dayEvents = eventInfo[dayOfMonth]?.events || [];

              return (
                <TooltipProvider key={day.toString()}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          h-10 w-10 rounded-full flex items-center justify-center text-sm relative
                          ${hasEventOnDay ? eventColor : ""}
                          ${isCurrentDay ? "ring-2 ring-primary" : ""}
                          ${
                            isPastDay
                              ? "opacity-50 cursor-default"
                              : "cursor-pointer hover:bg-gray-100"
                          }
                        `}
                        onClick={() =>
                          hasEventOnDay &&
                          dayEvents.length === 1 &&
                          !dayEvents[0].system
                            ? handleEventClick(dayEvents[0])
                            : null
                        }
                      >
                        {day.getDate()}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="whitespace-pre-line">
                        {getTooltipContent(day, eventDays, eventInfo)}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}

        {showAll && events.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div>
              <h3 className="text-sm font-medium mb-2">Events This Month</h3>
              <div className="flex flex-col gap-2">
                {events
                  .filter((event) => !event.isContinuation) // Filter out continuation markers
                  .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
                  .map((event) => (
                    <div
                      key={`event-${event.id}`}
                      className={`${
                        EVENT_COLORS[event.type]
                      } px-3 py-2 text-xs rounded-md flex justify-between items-center`}
                      onClick={() =>
                        isHR && event.type === EVENT_TYPES.EVENT
                          ? handleEventClick(event)
                          : null
                      }
                      style={{
                        cursor:
                          isHR && event.type === EVENT_TYPES.EVENT
                            ? "pointer"
                            : "default",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {event.type === EVENT_TYPES.BIRTHDAY ||
                        event.type === EVENT_TYPES.WORK_ANNIVERSARY ? (
                          <Avatar
                            src={event.employee?.profile_picture}
                            alt={`${event.employee?.name}'s profile picture`}
                            fallbackText={
                              event.employee?.name_initials ||
                              event.employee?.first_name?.charAt(0)
                            }
                            className="h-8 w-8 text-[10px]"
                            text={event.employee?.name}
                          />
                        ) : (
                          <div className="h-8 w-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-800">
                            {event.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span>{event.name}</span>
                          {event.type === EVENT_TYPES.EVENT && (
                            <>
                              {event.start_date &&
                                event.end_date &&
                                !isSameDay(
                                  parseISO(event.start_date),
                                  parseISO(event.end_date)
                                ) && (
                                  <span className="text-xs flex items-center gap-1 mt-1">
                                    <Clock size={10} />
                                    {format(
                                      parseISO(event.start_date),
                                      "MMM d"
                                    )}{" "}
                                    -{" "}
                                    {format(parseISO(event.end_date), "MMM d")}
                                  </span>
                                )}
                              {event.event_location && (
                                <span className="text-xs flex items-center gap-1 mt-1">
                                  <MapPin size={10} /> {event.event_location}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <span>
                        {format(
                          typeof event.date === "string"
                            ? new Date(event.date)
                            : event.date,
                          "MMM d"
                        )}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {events.length === 0 && !loading && (
          <div className="text-center py-4 text-gray-500">
            No events this month
          </div>
        )}

        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-100 mr-2"></div>
            <span className="text-xs text-muted-foreground">Birthday</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-100 mr-2"></div>
            <span className="text-xs text-muted-foreground">Event</span>
          </div>
          {isHR && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-100 mr-2"></div>
              <span className="text-xs text-muted-foreground">
                Work Anniversary
              </span>
            </div>
          )}
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full border border-primary mr-2"></div>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
        </div>
      </CardContent>

      {/* Event Add/Edit Sheet */}
      {handleCloseWithConfirmation({
        isOpen: closeSheet,
        setCloseSheet,
        setIsOpen: setIsEventSheetOpen,
      })}

      <SheetComponent
        triggerText={null}
        title={
          viewMode
            ? "Event Details"
            : selectedEvent
            ? "Edit Event"
            : "Add Event"
        }
        description={null}
        footer={null}
        isOpen={isEventSheetOpen}
        setIsOpen={setIsEventSheetOpen}
        contentClassName="custom-sheet-width"
        width="568px"
      >
        {viewMode ? (
          <ViewEventComponent
            selectedEvent={selectedEvent}
            selectedDate={selectedDate}
            isHR={isHR}
            setViewMode={setViewMode}
            setIsEventSheetOpen={setIsEventSheetOpen}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
        ) : (
          <EditEventFormComponent
            selectedEvent={selectedEvent}
            selectedDate={selectedDate}
            handleEventSubmit={handleEventSubmit}
            handleClose={handleClose}
            validateEventForm={validateEventForm}
            getEventInitialValues={() =>
              getEventInitialValues(selectedEvent, selectedDate)
            }
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
        )}
      </SheetComponent>

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <AlertDialogue
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
          handleContinue={handleDeleteEvent}
          continueText="Delete"
          title="Are you sure you want to delete this event?"
          description="This action cannot be undone. Once deleted, the event will be permanently removed."
        />
      )}
    </>
  );
}

export default EventCalendarWidget;
