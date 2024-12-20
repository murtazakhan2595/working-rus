import moment from "moment";

export function CalculateHoursWorked(records) {
  const currentDate = moment().format("YYYY-MM-DD"); // Get today's date in the same format as the records
  let totalHours = 0;
  let totalWorkedHours = 0;

  records.forEach((record) => {
    // Add up total hours from the "total_hours" field
    totalHours += parseFloat(record.total_hours);

    // Calculate worked hours if checkin exists
    if (record.checkin) {
      let checkinTime = moment(record.checkin);

      // If checkout is available, use it; otherwise, calculate till current time for today's date
      let checkoutTime = record.checkout
        ? moment(record.checkout)
        : record.date === currentDate
        ? moment()
        : null;

      if (checkoutTime) {
        const workedHours = moment
          .duration(checkoutTime.diff(checkinTime))
          .asHours();
        totalWorkedHours += workedHours;
      }
    }
  });

  return {
    totalHours,
    totalWorkedHours: totalWorkedHours.toFixed(2), // Rounded to 2 decimal places
  };
}

