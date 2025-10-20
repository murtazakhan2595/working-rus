import moment from "moment";
import { renderTime } from "./DateTimeUtils";
import { eachDayOfInterval } from "date-fns";

export const formatNumber = (num) => {
  // const units = ["", "K", "M", "B", "T", "P", "E", "Z", "Y"];
  // let unit = 0;

  // while (num >= 1000 && unit < units.length - 1) {
  //   num /= 1000;
  //   unit++;
  // }

  // Use Intl.NumberFormat to format the number with 2 decimal places
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  return formattedNumber;

  // return formattedNumber + units[unit];
};

export function numberToWords(number) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["", "Thousand", "Million", "Billion"];

  // Convert integer part to words
  function convertHundreds(num) {
    let result = "";
    if (num > 99) {
      result += ones[Math.floor(num / 100)] + " Hundred ";
      num = num % 100;
    }
    if (num > 9 && num < 20) {
      result += teens[num - 10] + " ";
    } else if (num >= 20) {
      result += tens[Math.floor(num / 10)] + " ";
      num = num % 10;
    }
    if (num > 0 && num < 10) {
      result += ones[num] + " ";
    }
    return result.trim();
  }

  // Main function to convert number to words
  function convertToWords(num) {
    if (num === 0) return "Zero";

    let result = "";
    let thousandIndex = 0;

    while (num > 0) {
      let chunk = num % 1000;
      if (chunk > 0) {
        result =
          convertHundreds(chunk) +
          " " +
          thousands[thousandIndex] +
          " " +
          result;
      }
      num = Math.floor(num / 1000);
      thousandIndex++;
    }
    return result.trim();
  }

  // Separate the integer and decimal parts
  const [integerPart, decimalPart] = number.toString().split(".");

  // Convert integer part
  let result = convertToWords(parseInt(integerPart)) + " AED";

  // Optional: Handle decimal part (cents)
  if (decimalPart) {
    const cents = parseInt(decimalPart.slice(0, 2)); // take only two decimal digits
    if (cents > 0) {
      result += " and " + convertToWords(cents) + " Cents";
    }
  }

  return result.trim();
}


export function renderDate(date, fallbackValue = "N/A", variant = "date", joiningText = ' to ') {
  if (!date) return fallbackValue;
  const format =
    variant === "month-day"
      ? "MMM D"
      : variant === "month"
        ? "MMMM YYYY"
        : variant === "date-time"
          ? "MMM DD, YYYY hh:mm A"
          : variant === "time"
            ? "hh:mm A"
            : "MMM DD, YYYY";
  if (moment(date).isValid())
    return moment(date).format(format);
  else if (typeof date === 'string') {  // Handle multiple comma-separated dates
    const dateList = date.split(",").map(d => d.trim()).filter(Boolean);

    if (dateList.length === 0) return fallbackValue;
    const formattedDates = dateList
      .map(d => (moment(d).isValid() ? moment(d).format(format) : fallbackValue))
      .filter(val => val !== fallbackValue || dateList.length === 1); // keep fallback only if it's the only value

    return formattedDates.join(joiningText);
  } else return fallbackValue;
}


export const formatDuration = (duration, calculateSeconds = false) => {
  if (!duration) return "0min";

  const Duration = parseFloat(duration < 0 ? Math.abs(duration) : duration);
  const totalSeconds = Math.floor(Duration * 3600); // Convert hours to seconds
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}min`);
  if (seconds > 0 && calculateSeconds) parts.push(`${seconds}s`);
  return `${duration < 0 ? "-" : ""}${parts.join(" ")}`;
};

export const GetDateRange = (period) => {
  if (period.toUpperCase() === "WEEK") {
    // Current week start and end
    const startOfWeek = moment().startOf("week").format("YYYY-MM-DD");
    const endOfWeek = moment().endOf("week").format("YYYY-MM-DD");
    return `${startOfWeek},${endOfWeek}`;
  } else if (period.toUpperCase() === "MONTH") {
    // Current month start and end
    const startOfMonth = moment().startOf("month").format("YYYY-MM-DD");
    const endOfMonth = moment().endOf("month").format("YYYY-MM-DD");
    return `${startOfMonth},${endOfMonth}`;
  } else if (period.toUpperCase() === "DAY")
    return moment().format("YYYY-MM-DD"); // Default case: single day
  else return period;
};
export const CalculateTotalWorkingHours = (start_time, end_time) => {
  const today = moment().format("YYYY-MM-DD");
  const startTime = renderTime(start_time, today);
  const endTime = renderTime(end_time, today);
  // const startTime = moment.utc(start_time).format("HH:mm:ss");
  // const endTime = moment.utc(end_time).format("HH:mm:ss");

  // Parse both times on the same reference date (e.g., today)
  let start = moment(startTime);
  let end = moment(endTime);

  // Handle shift going past midnight
  if (end.isBefore(start)) {
    end = end.add(1, "day");
  }
  const totalHours = parseFloat(end.diff(start, "hours", true)).toFixed(2);
  return parseFloat(totalHours);
};

export const calculatePercentage = (count = 0, total = 0) => {
  // Ensure both values are numbers
  const parsedCount = parseFloat(count);
  const parsedTotal = parseFloat(total);

  // Handle invalid or NaN values
  if (isNaN(parsedCount) || isNaN(parsedTotal)) return 0;

  // Prevent division by zero and ensure count is non-negative and not more than total
  if (parsedTotal <= 0 || parsedCount < 0) return 0;

  const percentage = (parsedCount / parsedTotal) * 100;
  return parseFloat(percentage.toFixed(2)); // Round to 2 decimal places
};

export const calculateAverage = (
  data = [],
  count_label = "",
  total_label = ""
) => {
  // Check if data is an array
  if (!Array.isArray(data) || data.length === 0) return 0;

  const count = calculateTotal(data, count_label);
  const total = calculateTotal(data, total_label);

  // Check if both count and total are valid numbers
  if (isNaN(count) || isNaN(total)) return 0;

  // Prevent division by zero
  if (total === 0) return 0;

  const average = parseFloat(count / total).toFixed(2);
  return parseFloat(average);
};


export const calculateTotal = (data, label, filterLabel, filterValue) => {
  // Validate array
  if (!Array.isArray(data) || !label) return 0;

  // Filter data if filterLabel is provided
  const finalData = filterLabel
    ? data.filter(obj => {
      if (!obj || typeof obj !== "object") return false;
      // Apply filtering logic
      if (filterValue !== undefined && filterValue !== null) {
        return obj.hasOwnProperty(filterLabel) && obj[filterLabel] === filterValue;
      }
      return obj.hasOwnProperty(filterLabel) && Boolean(obj[filterLabel]);
    })
    : data;

  // Calculate total
  const total = finalData.reduce((acc, item) => {
    if (!item || typeof item !== "object" || !item.hasOwnProperty(label)) return acc;

    const value = parseFloat(item[label]);
    return acc + (isNaN(value) ? 0 : value);
  }, 0);

  return parseFloat(total.toFixed(2));
};


export const calculateTotalCount = (data, label, value) => {
  if (!Array.isArray(data)) return 0;
  return data.reduce((count, item) => {
    return count + (item[label] === value ? 1 : 0);
  }, 0);
};
export const countLabelOccurrences = (data, label) => {
  if (!Array.isArray(data)) return 0;
  return data.reduce((count, item) => {
    return count + (item[label] ? 1 : 0);
  }, 0);
};
export const calculateTaskCount = (data, statusType) => {
  if (!Array.isArray(data)) return 0;
  return data.filter((task) => {
    const taskStatus = task.task_status?.toLowerCase() || "";
    const requestedStatus = statusType?.toLowerCase();
    if (requestedStatus === "completed") {
      return taskStatus === "completed";
    }
    // For pending tasks, count both 'todo' and 'inprogress'
    return taskStatus === "todo" || taskStatus === "inprogress";
  }).length;
};

export const lightenColor = (hex, percent = 85) => {
  if (!hex) return hex;
  // Remove '#' if present
  hex = hex.replace(/^#/, "");

  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Lighten color by blending with white
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  // Convert back to hex
  const newHex =
    "#" +
    r.toString(16).padStart(2, "0") +
    g.toString(16).padStart(2, "0") +
    b.toString(16).padStart(2, "0");

  return newHex;
};

export const getWorkingDays = (startDate, endDate) => {
  let start = moment(startDate);
  const end = moment(endDate);
  let count = 0;

  while (start <= end) {
    const day = start.day(); // 0 = Sunday, 6 = Saturday
    if (day !== 0 && day !== 6) {
      count++;
    }
    start.add(1, "day");
  }

  return count;
};

export function GetDateDifference(
  startDate,
  endDate,
  type = "work_days", //work_days, calendar_days
  CalendarContent = {},
  exclude = []
) {
  // Validate input
  if (!startDate || !endDate) return 0;

  const start = moment(startDate).startOf("day");
  const end = moment(endDate).startOf("day");

  // Validate moment objects
  if (!start.isValid() || !end.isValid()) return 0;

  // Ensure end is not before start
  if (end.isBefore(start)) return 0;
  if (type === "calendar_days")
    return end.diff(start, "days") + 1; // +1 to include start day
  else if (exclude.includes("holidays")) {
    try {
      const datesOfMonth = eachDayOfInterval({
        start: start.toDate(),
        end: end.toDate(),
      });
      const count = datesOfMonth.filter((date) => {
        const baseDate = moment(date).format("YYYY-MM-DD");
        const content = CalendarContent[baseDate] || {};
        const isHoliday = content.isHoliday;

        if (isHoliday) return false;

        const day = moment(date).day();
        return day !== 0 && day !== 6; // exclude Sunday (0) and Saturday (6)
      });
      return count?.length || 0;
    } catch (err) {
      console.warn("Invalid date range:");
      return 0;
    }
  } else if (type === "work_days") {
    return getWorkingDays(start, end);
  }
}

export const ChildAnyNodeExist = (
  parent_node = {},
  selectedLeafs = [],
  label = "id"
) => {
  const children = parent_node.childrens;
  if (!children || children.length === 0) {
    return selectedLeafs.includes(parent_node[label]);
  }
  // If children exist, check recursively
  if (Array.isArray(children)) {
    return children.some((child) =>
      ChildAnyNodeExist(child, selectedLeafs, label)
    );
  }

  return false;
};

export const ChildALLNodesExist = (
  parent_node = {},
  selectedLeafs = [],
  label = "id"
) => {
  const children = parent_node.childrens;
  if (!children || children.length === 0) {
    return selectedLeafs.includes(parent_node[label]);
  }
  return children.every((child_node) =>
    ChildALLNodesExist(child_node, selectedLeafs, label)
  );
};

/**
 * Recursively checks if any node in a tree (at any depth) matches one of the values in selectedValues.
 *
 * @param {Object} node - The current node to check.
 * @param {String} selectedValues - A value to match against the given label key.
 * @param {String} label - The key to compare in each node (default is "id").
 * @returns {Boolean} - True if any matching node is found, false otherwise.
 */
export const getNodeExistInTree = (node = {}, selectedValue, label = "id") => {
  if (node[label] === selectedValue) {
    return node; // Found the node, return it
  }

  const children = node.childrens || [];

  for (const child of children) {
    const result = getNodeExistInTree(child, selectedValue, label);
    if (result) {
      return result; // Found in a child subtree
    }
  }

  return null; // Not found anywhere in this subtree
};





/**
 * Builds a readable range string based on minimum and maximum values.
 *
 * Rules:
 * - If both minimum and maximum are missing → return the fallbackValue.
 * - If only minimum is present → return "From {minimum}{suffix}".
 * - If only maximum is present → return "Up to {maximum}{suffix}".
 * - If both are present → return "{minimum}{suffix} - {maximum}{suffix}".
 *
 * @param {number|string|null} minimum - The starting value of the range.
 * @param {number|string|null} maximum - The ending value of the range.
 * @param {string} fallbackValue - The value to return if both min and max are missing.
 * @param {string} [suffix=""] - Optional suffix to append (e.g., "kg", "years").
 * @returns {string} - A human-readable range string.
 */
export const renderRange = (minimum, maximum, fallbackValue, suffix = "") => {
  if (minimum == null && maximum == null) {
    return fallbackValue;
  }

  if (minimum != null && maximum != null) {
    return `${minimum} ${suffix} - ${maximum} ${suffix}`;
  }

  if (minimum != null) {
    return `From ${minimum} ${suffix}`;
  }

  if (maximum != null) {
    return `Up to ${maximum} ${suffix}`;
  }

  return fallbackValue;
};

