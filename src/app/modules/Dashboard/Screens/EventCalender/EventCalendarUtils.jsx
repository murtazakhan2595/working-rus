

import { format, parseISO, getDate, isSameDay } from "date-fns";
import { EVENT_TYPES } from "./EventTypes";

// Get API events for the current month
export const getEvents = async (month, year, getEventList) => {
  // Create start and end dates for the current month view
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // Last day of current month

  // Format dates for API request
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  const formattedEndDate = format(endDate, "yyyy-MM-dd");

  // Create filter object for API
  const filterData = {
    start_range: formattedStartDate,
    end_range: formattedEndDate,
  };

  // Call the API with filter params
  const events = await getEventList({
    filterData: filterData,
  });

  if (events?.results?.length === 0) return [];

  // Map API events to our internal format
  return events.results.map((event) => ({
    id: event.id,
    name: event.name,
    date: parseISO(event.start_date), // Use start_date as the primary date
    start_date: event.start_date,
    end_date: event.end_date,
    event_location: event.event_location,
    description: event.description,
    type: EVENT_TYPES.EVENT,
  }));
};

// Get event color based on type
export const getEventColor = (
  day,
  eventDays,
  eventInfo,
  EVENT_TYPES,
  EVENT_COLORS
) => {
  const dayOfMonth = day.getDate();
  if (!eventDays.includes(dayOfMonth)) return "";

  const dayEvents = eventInfo[dayOfMonth]?.events || [];
  if (dayEvents.length === 0) return "";

  // If there are multiple event types on the same day, prioritize in this order:
  // 1. Custom events
  // 2. Work anniversaries
  // 3. Birthdays
  const hasCustomEvent = dayEvents.some(
    (event) => event.type === EVENT_TYPES.EVENT
  );
  if (hasCustomEvent) {
    return EVENT_COLORS[EVENT_TYPES.EVENT];
  }

  const hasWorkAnniversary = dayEvents.some(
    (event) => event.type === EVENT_TYPES.WORK_ANNIVERSARY
  );
  if (hasWorkAnniversary) {
    return EVENT_COLORS[EVENT_TYPES.WORK_ANNIVERSARY];
  }

  // Otherwise use the first event's type
  return EVENT_COLORS[dayEvents[0].type] || "";
};

// Get tooltip content based on day
export const getTooltipContent = (day, eventDays, eventInfo) => {
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
        content += `\nEnd: ${format(parseISO(event.end_date), "MMM d, yyyy")}`;
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
export const getEventInitialValues = (selectedEvent, selectedDate) => {
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
