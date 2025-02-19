import moment from "moment";

export const getRandomColor = (letter) => {
  letter = letter?.toUpperCase();
  const colors = {
    A: "bg-plum-300",
    B: "bg-plum-400",
    C: "bg-plum-500",
    D: "bg-plum-600",
    E: "bg-plum-300",
    F: "bg-plum-400",
    G: "bg-plum-500",
    H: "bg-plum-600",
    I: "bg-plum-300",
    J: "bg-plum-400",
    K: "bg-plum-500",
    L: "bg-plum-600",
    M: "bg-plum-300",
    N: "bg-plum-400",
    O: "bg-splum-500",
    P: "bg-plume-600",
    Q: "bg-plum-300",
    R: "bg-plum-400",
    S: "bg-plum-500",
    T: "bg-plum-600",
    U: "bg-plum-300",
    V: "bg-plum-400",
    W: "bg-plum-500",
    X: "bg-plum-600",
    Y: "bg-plum-300",
    Z: "bg-plum-400",
  };

  if (letter && colors[letter]) {
    return colors[letter];
  } else {
    const colorValues = Object.values(colors);
    return colorValues[Math.floor(Math.random() * colorValues.length)];
  }
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

export function renderDate(date) {
  return date ? moment(date).format("MMM DD, YYYY") : "N/A";
}

export const formatDuration = (duration) => {
  if (!duration || duration <= 0) return "0min";

  const totalMinutes = Math.floor(duration * 60); // Convert hours to minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}min`;
  }
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}min`;
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

export const GetShiftTotalHours = (shiftStartTime, shiftEndTime, period) => {
  const calculateHoursForDays = (start, end) => {
    let totalHours = 0;
    const current = moment(start).startOf("day");
    const endDate = moment(end).endOf("day");

    while (current.isBefore(endDate)) {
      const dayOfWeek = current.isoWeekday(); // ISO weekday (1 = Monday, 7 = Sunday)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        // Monday to Friday
        const shiftStart = moment(
          `${current.format("YYYY-MM-DD")}T${shiftStartTime}`
        );
        const shiftEnd = moment(
          `${current.format("YYYY-MM-DD")}T${shiftEndTime}`
        );
        totalHours += moment.duration(shiftEnd.diff(shiftStart)).asHours();
      }
      current.add(1, "day");
    }
    return totalHours;
  };
  if (period === "day") {
    const today = moment().format("YYYY-MM-DD");
    const shiftStart = moment(`${today}T${shiftStartTime}`);
    const shiftEnd = moment(`${today}T${shiftEndTime}`);
    return moment.duration(shiftEnd.diff(shiftStart)).asHours();
  } else if (period === "week") {
    const weekStart = moment().startOf("isoWeek");
    const weekEnd = moment().endOf("isoWeek");
    return calculateHoursForDays(weekStart, weekEnd);
  } else if (period === "month") {
    const monthStart = moment().startOf("month");
    const monthEnd = moment().endOf("month");
    return calculateHoursForDays(monthStart, monthEnd);
  } else {
    const [startDate, endDate] = period.split(",");
    return calculateHoursForDays(startDate, endDate);
  }
};

export const calculatePercentage1 = (stats) => {
  if (!stats) return 0;
  const total = parseInt(stats.Present) || 0 + parseInt(stats.Absent) || 0;
  return total > 0 ? (parseInt(stats.Present || 0) / total) * 100 : 0;
};

export const calculatePercentage = (count = 0, total = 0) => {
  count = parseFloat(count) || 0;
  total = parseFloat(total) || 0;
  if (count > total || total === 0) return 0;
  return (count / total) * 100;
};

export const calculateTotal = (data, label) => {
  if (!Array.isArray(data)) return 0;
  return data.reduce((total, item) => {
    const value = parseFloat(item[label]);
    return total + (isNaN(value) ? 0 : value);
  }, 0);
};
export const calculateTotalCount = (data, label, value) => {
  if (!Array.isArray(data)) return 0;
  return data.reduce((count, item) => {
    return count + (item[label] === value ? 1 : 0);
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

export const lightenColor = (hex, percent) => {
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
