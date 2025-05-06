
import {
  format,
  parseISO,
  getMonth,
  getDate,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  differenceInYears,
} from "date-fns";
import { EVENT_TYPES } from "./EventTypes";

// Process employee birthdays for the calendar
export const processEmployeeBirthdays = (employees, currentMonth) => {
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

// Process work anniversaries for the calendar
export const processWorkAnniversaries = (employees, currentMonth, isHR) => {
  if (!employees || !Array.isArray(employees) || !isHR) {
    return [];
  }

  const currentMonthNum = currentMonth.getMonth();
  const currentYear = currentMonth.getFullYear();

  // Filter employees with joining dates in the current month
  const anniversaryEvents = employees
    .filter((emp) => {
      if (!emp.joining_date) return false;

      try {
        const joinDate = parseISO(emp.joining_date);
        return getMonth(joinDate) === currentMonthNum;
      } catch (error) {
        console.error(
          `Invalid joining date format for employee ${emp.name}:`,
          emp.joining_date
        );
        return false;
      }
    })
    .map((emp) => {
      const joinDate = parseISO(emp.joining_date);
      const joinDay = getDate(joinDate);
      const yearsOfService = differenceInYears(
        new Date(currentYear, currentMonthNum, joinDay),
        joinDate
      );

      // Only show anniversaries for employees who have been at the company for at least 1 year
      if (yearsOfService < 1) return null;

      // Create event for this year's work anniversary
      return {
        id: `anniversary-${emp.id}`,
        name: `${emp.first_name}'s ${yearsOfService} Year${
          yearsOfService > 1 ? "s" : ""
        } Work Anniversary`,
        date: new Date(currentYear, currentMonthNum, joinDay),
        type: EVENT_TYPES.WORK_ANNIVERSARY,
        employee: emp,
        yearsOfService: yearsOfService,
        system: true, // System events cannot be edited or deleted
      };
    })
    .filter(Boolean); // Remove null values (for employees with less than 1 year)

  return anniversaryEvents;
};

// Process all events to organize by day and handle multi-day events
export const processEvents = (
  allEvents,
  currentMonth,
  setEvents,
  setEventDays,
  setEventInfo
) => {
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
