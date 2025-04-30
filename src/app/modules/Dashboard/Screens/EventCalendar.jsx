import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Clock, Plus } from "lucide-react";
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
  getMonth,
  getYear,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { getEmployeeListWithDetail } from "app/hooks/general";
import Avatar from "components/ui/Avatar";
import SheetComponent from "components/ui/SheetComponent";
import { Formik } from "formik";
import { TextInput, TextAreaInput } from "components/FormControl";
import DateInput from "components/FormControl/DateInput";
import { SheetCardExtension, DetailBox, DetailCard } from "components/SheetCardExtension";
import { handleCloseWithConfirmation } from "components/SheetCardExtension";
import AlertDialogue from "components/ui/AlertDialogue";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getEventList } from "app/hooks/eventManagement";
import { saveEvent, deleteEvent } from "app/hooks/eventManagement";

// Event type definitions and colors
const EVENT_TYPES = {
  BIRTHDAY: "birthday",
  EVENT: "event", // Custom events
};

const EVENT_COLORS = {
  [EVENT_TYPES.BIRTHDAY]: "bg-indigo-100 text-indigo-800",
  [EVENT_TYPES.EVENT]: "bg-blue-100 text-blue-800",
};

// Validation function for event form
const validateEventForm = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = "Event name is required";
  }

  // Optional validations for start/end time
  if (values.start_date && values.end_date) {
    // Parse time values in format "HH:mm"
    const [startHours, startMinutes] = values.start_date.split(":").map(Number);
    const [endHours, endMinutes] = values.end_date.split(":").map(Number);

    if (
      !isNaN(startHours) &&
      !isNaN(startMinutes) &&
      !isNaN(endHours) &&
      !isNaN(endMinutes)
    ) {
      // Compare hours and minutes
      if (
        endHours < startHours ||
        (endHours === startHours && endMinutes <= startMinutes)
      ) {
        errors.end_date = "End time must be after start time";
      }
    }
  }

  return errors;
};


const getEvents = async (month, year) => {
  const events = await getEventList();
  console.log("Fetching events for month:", month, "year:", year, events);
  if(events?.results?.length === 0) return [];
  
  // Map API events to our internal format
  return events.results.map(event => ({
    id: event.id,
    name: event.name,
    date: parseISO(event.start_date),  // Use start_date as the primary date
    start_date: event.start_date,
    end_date: event.end_date,
    event_location: event.event_location,
    type: EVENT_TYPES.EVENT,
    // Add any additional fields necessary
  }));
};

export default function EventCalendarWidget() {
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
  const isHR =
    userProfile?.role === 3 ||
    userProfile?.role === 1 ||
    userProfile?.role === 4;

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
      const birthdayEvents = processEmployeeBirthdays(empData);

      // Fetch custom events for the current month
      const customEvents = await getEvents(
        currentMonth.getMonth(),
        currentMonth.getFullYear()
      );

      // Combine all events
      const allEvents = [...birthdayEvents, ...customEvents];

      processEvents(allEvents);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Process employee birthdays for the calendar
  const processEmployeeBirthdays = (employees) => {
    if (!employees || !Array.isArray(employees)) {
      return [];
    }

    const currentMonthNum = currentMonth.getMonth();
    const currentYear = currentMonth.getFullYear();

    // Filter employees with birthdays in the current month
    const birthdayEvents = employees
      .filter((emp) => {
        if (!emp.date_of_birth) return false;

        try {
          const birthDate = parseISO(emp.date_of_birth);
          return getMonth(birthDate) === currentMonthNum;
        } catch (error) {
          console.error(
            `Invalid date format for employee ${emp.name}:`,
            emp.date_of_birth
          );
          return false;
        }
      })
      .map((emp) => {
        const birthDate = parseISO(emp.date_of_birth);
        const birthDay = getDate(birthDate);

        // Create event for this year's birthday
        return {
          id: `birthday-${emp.id}`,
          name: `${emp.first_name}'s Birthday`,
          date: new Date(currentYear, currentMonthNum, birthDay),
          type: EVENT_TYPES.BIRTHDAY,
          employee: emp,
          system: true, // System events cannot be edited or deleted
        };
      });

    return birthdayEvents;
  };

  // Process all events to organize by day and handle multi-day events
  const processEvents = (allEvents) => {
    const eventsByDay = {};
    const daysWithEvents = [];
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);

    allEvents.forEach((event) => {
      // Handle the primary date (either the start date or single-day event date)
      const eventDate = new Date(event.date);
      const day = getDate(eventDate);

      if (!daysWithEvents.includes(day)) {
        daysWithEvents.push(day);
      }

      if (!eventsByDay[day]) {
        eventsByDay[day] = {
          date: eventDate,
          events: [event],
        };
      } else {
        eventsByDay[day].events.push(event);
      }

      // For custom events with start and end dates, mark all days in the range
      if (
        event.type === EVENT_TYPES.EVENT &&
        event.start_date &&
        event.end_date
      ) {
        const startDate = parseISO(event.start_date);
        const endDate = parseISO(event.end_date);

        // Only process if it's a multi-day event
        if (!isSameDay(startDate, endDate)) {
          // Get all days in the interval
          const daysInRange = eachDayOfInterval({
            start: startDate,
            end: endDate,
          });

          // For each day in the range (except the first which we already processed)
          daysInRange.slice(1).forEach((rangeDay) => {
            // Only include days within current month view
            if (rangeDay >= monthStart && rangeDay <= monthEnd) {
              const rangeDay_date = getDate(rangeDay);

              // Add to days with events if not already there
              if (!daysWithEvents.includes(rangeDay_date)) {
                daysWithEvents.push(rangeDay_date);
              }

              // Create or update events for this day
              if (!eventsByDay[rangeDay_date]) {
                eventsByDay[rangeDay_date] = {
                  date: rangeDay,
                  events: [{ ...event, isContinuation: true }], // Mark as continuation
                };
              } else {
                eventsByDay[rangeDay_date].events.push({
                  ...event,
                  isContinuation: true,
                });
              }
            }
          });
        }
      }
    });

    setEvents(allEvents);
    setEventDays(daysWithEvents);
    setEventInfo(eventsByDay);
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

  // Get event color based on type
  const getEventColor = (day) => {
    const dayOfMonth = day.getDate();
    if (!eventDays.includes(dayOfMonth)) return "";

    const dayEvents = eventInfo[dayOfMonth]?.events || [];
    if (dayEvents.length === 0) return "";

    // If there are multiple event types on the same day, prioritize custom events
    const hasCustomEvent = dayEvents.some(
      (event) => event.type === EVENT_TYPES.EVENT
    );
    if (hasCustomEvent) {
      return EVENT_COLORS[EVENT_TYPES.EVENT];
    }

    // Otherwise use the first event's type
    return EVENT_COLORS[dayEvents[0].type] || "";
  };

  // Get tooltip content based on day
  const getTooltipContent = (day) => {
    const dayOfMonth = day.getDate();
    const formattedDate = format(day, "MMMM dd, yyyy");

    if (!eventDays.includes(dayOfMonth)) {
      return formattedDate;
    }

    const dayEvents = eventInfo[dayOfMonth]?.events || [];

    if (dayEvents.length === 0) {
      return formattedDate;
    }

    if (dayEvents.length === 1) {
      const event = dayEvents[0];
      let content = `${event.name} - ${formattedDate}`;

      // Add event details for custom events
      if (event.type === EVENT_TYPES.EVENT) {
        if (event.start_date) {
          content += `\nStart: ${format(
            parseISO(event.start_date),
            "MMM d, yyyy"
          )}`;
        }
        if (event.end_date) {
          content += `\nEnd: ${format(
            parseISO(event.end_date),
            "MMM d, yyyy"
          )}`;
        }
        if (event.event_location) {
          content += `\nLocation: ${event.event_location}`;
        }
        if (event.isContinuation) {
          content += "\n(Multi-day event)";
        }
      }

      return content;
    } else {
      // Multiple events
      return `${dayEvents.length} events on ${formattedDate}`;
    }
  };

  // Prepare initial values for event form
  const getEventInitialValues = () => {
    if (selectedEvent) {
      return {
        id: selectedEvent.id,
        name: selectedEvent.name || "",
        start_date: selectedEvent.start_date || "",
        end_date: selectedEvent.end_date || "",
        event_location: selectedEvent.event_location || "",
        description: selectedEvent.description || "",
      };
    }

    return {
      name: "",
      start_date: selectedDate
        ? format(selectedDate, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
      end_date: "",
      event_location: "",
      description: "",
    };
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
              const eventColor = getEventColor(day);
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
                        {/* Removed visual indicator for multi-day events */}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="whitespace-pre-line">
                        {getTooltipContent(day)}
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
                        {event.type === EVENT_TYPES.BIRTHDAY ? (
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
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full border border-primary mr-2"></div>
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
          {/* Removed multi-day indicator as requested */}
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
          // View mode (similar to your leave detail sheet)
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-medium">{selectedEvent?.name}</div>
              {isHR && (
                <Button variant="outline" onClick={() => setViewMode(false)}>
                  Edit Event
                </Button>
              )}
            </div>

            <DetailCard
              detailCardTitle="Event Details"
              date={selectedEvent?.created_at}
            >
              <div className="flex flex-col flex-1 shrink justify-center w-full basis-0 min-w-[240px]">
                <DetailBox
                  label="Event Date"
                  value={selectedDate && format(selectedDate, "MMMM dd, yyyy")}
                />

                {selectedEvent?.start_date && (
                  <DetailBox
                    label="Start Date"
                    value={format(
                      parseISO(selectedEvent.start_date),
                      "MMMM dd, yyyy"
                    )}
                  />
                )}

                {selectedEvent?.end_date && (
                  <DetailBox
                    label="End Date"
                    value={format(
                      parseISO(selectedEvent.end_date),
                      "MMMM dd, yyyy"
                    )}
                  />
                )}

                {selectedEvent?.event_location && (
                  <DetailBox
                    label="Location"
                    value={selectedEvent.event_location}
                  />
                )}

                {selectedEvent?.description && (
                  <DetailBox
                    label="Description"
                    value={selectedEvent.description}
                  />
                )}
              </div>
            </DetailCard>

            <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
              <Button
                variant="outline"
                type="button"
                size="lg"
                onClick={() => setIsEventSheetOpen(false)}
              >
                Close
              </Button>
              {isHR && selectedEvent && !selectedEvent.system && (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              )}
            </div>
          </>
        ) : (
          // Edit mode
          <Formik
            initialValues={getEventInitialValues()}
            validate={validateEventForm}
            enableReinitialize={true}
            onSubmit={handleEventSubmit}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit} className="mt-6 space-y-6">
                <SheetCardExtension title="Event Details">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Date:{" "}
                      {selectedDate && format(selectedDate, "MMMM dd, yyyy")}
                    </p>
                  </div>

                  <TextInput
                    name="name"
                    error={props.errors?.name}
                    touch={props.touched?.name}
                    value={props.values?.name}
                    label="Event Name"
                    required={true}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                    placeholder="Enter event name"
                  />

                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <DateInput
                        name="start_date"
                        error={props.errors?.start_date}
                        touch={props.touched?.start_date}
                        value={props.values?.start_date}
                        label="Start Date"
                        required={true}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                        showMonthYearPicker={false}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <DateInput
                        name="end_date"
                        error={props.errors?.end_date}
                        touch={props.touched?.end_date}
                        value={props.values?.end_date}
                        label="End Date"
                        required={false}
                        onChange={(field, value) => {
                          props.setFieldValue(field, value);
                        }}
                        showMonthYearPicker={false}
                      />
                    </div>
                  </div>

                  <TextInput
                    name="event_location"
                    error={props.errors?.event_location}
                    touch={props.touched?.event_location}
                    value={props.values?.event_location}
                    label="Event Location"
                    required={false}
                    onChange={(field, value) => {
                      props.handleChange(field)(value);
                    }}
                  />
                </SheetCardExtension>

                <div className="flex flex-col justify-end gap-4 pt-6 md:flex-row lg:flex-row xl:flex-row">
                  {selectedEvent && !selectedEvent.system && (
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      Delete
                    </Button>
                  )}
                  <div className="flex-1"></div>
                  <Button
                    variant="outline"
                    type="button"
                    size="lg"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    variant="default"
                    disabled={props.isSubmitting}
                  >
                    {props.isSubmitting ? "Saving..." : "Save Event"}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
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