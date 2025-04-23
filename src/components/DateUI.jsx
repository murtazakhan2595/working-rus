import React from "react";
import moment from "moment";

/**
 * Render a formatted date string.
 *
 * @param {string | Date} date - The date to format.
 * @param {string} fallBackText - The fallback value if date is null/undefined.
 * @param {string} variant - "date" for full date, "month" for only month/year.
 *
 * @returns {string} - Formatted date string.
 */
export default function DateUI({ date, fallBackText = "N/A", variant = "date" }) {
  if (!date) return fallBackText;

  const format = variant === "month" ? "MMM YYYY" : "MMM DD, YYYY";

  return moment(date).format(format);
}
