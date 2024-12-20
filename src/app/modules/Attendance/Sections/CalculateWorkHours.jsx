import moment from "moment";

export function CalculateHoursWorked(records, hoursLabel) {
  const currentDate = moment().format("YYYY-MM-DD"); // Get today's date in the same format as the records
  let totalHours = 0;
  let totalWorkedHours = 0;
  if (!records || records.length === 0)
    return {
      totalHours: 0,
      totalWorkedHours: 0,
    };
  records.forEach((record) => {
    // Add up total hours from the "total_hours" field
    totalHours += parseFloat(record.total_hours);

    // Calculate worked hours if checkin exists
    if (record.checkin) {
      let checkinTime = moment(record.checkin);
      if (record.checkout) {
        const workedHours = hoursLabel
          ? records[hoursLabel]
          : record.payable_hours;
        totalWorkedHours += parseFloat(workedHours) || 0;
      }

      // If checkout is available, use it; otherwise, calculate till current time for today's date
      else {
        let checkoutTime = record.date === currentDate ? moment() : null;
        if (checkoutTime) {
          const workedHours = moment
            .duration(checkoutTime.diff(checkinTime))
            .asHours();
          totalWorkedHours += parseFloat(workedHours) || 0;
        }
      }
    }
  });
  return {
    totalHours,
    totalWorkedHours: totalWorkedHours ? parseFloat(totalWorkedHours).toFixed(2) : 0, // Rounded to 2 decimal places
  };
}
