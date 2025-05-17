
import React, { useEffect, useState } from "react";
import { TextInput } from "components/FormControl";
import moment from "moment";
import { CalendarDays } from "lucide-react";
import { DateRangeInput } from "components/FormControl";

 const ProbationDateRange = ({ formikProps }) => {
  // Calculate probation period whenever date range changes
  useEffect(() => {
    if (
      formikProps.values?.probation_start_date &&
      formikProps.values?.probation_end_date
    ) {
      const start = moment(formikProps.values.probation_start_date);
      const end = moment(formikProps.values.probation_end_date);

      if (end.isBefore(start)) {
        formikProps.setFieldValue("probation_period", "Invalid date range");
        return;
      }

      // Calculate the difference in a human-readable format
      const duration = moment.duration(end.diff(start));
      const years = duration.years();
      const months = duration.months();
      const days = duration.days();

      // Format the duration
      let periodText = "";
      if (years > 0) {
        periodText += `${years} ${years === 1 ? "Year" : "Years"}`;
      }

      if (months > 0) {
        periodText += periodText ? " and " : "";
        periodText += `${months} ${months === 1 ? "Month" : "Months"}`;
      }

      if (days > 0) {
        periodText += periodText ? " and " : "";
        periodText += `${days} ${days === 1 ? "Day" : "Days"}`;
      }

      if (!periodText) {
        periodText = "Same day (0 days)";
      }

      formikProps.setFieldValue("probation_period", periodText);
    } else {
      formikProps.setFieldValue("probation_period", "");
    }
  }, [
    formikProps.values?.probation_start_date,
    formikProps.values?.probation_end_date,
  ]);

  // Handle date range selection
  const handleDateRangeChange = (name, value) => {
    if (!value) {
      // Reset all values if date range is cleared
      formikProps.setFieldValue("probation_start_date", null);
      formikProps.setFieldValue("probation_end_date", null);
      formikProps.setFieldValue("confirmation_date", null);
      return;
    }

    const [startDate, endDate] = value.split(",");

    // Set start date
    if (startDate) {
      formikProps.setFieldValue("probation_start_date", startDate);
    }

    // Set end date and auto-calculate confirmation date
    if (endDate) {
      formikProps.setFieldValue("probation_end_date", endDate);
      formikProps.setFieldValue(
        "confirmation_date",
        moment(endDate).add(1, "days").format("YYYY-MM-DD")
      );
    }
  };

  // Get current date range value for component
  const getDateRangeValue = () => {
    if (!formikProps.values?.probation_start_date) return null;

    let value = formikProps.values.probation_start_date;

    if (formikProps.values?.probation_end_date) {
      value += `,${formikProps.values.probation_end_date}`;
    }

    return value;
  };

  const handlePeriodChange = (field, value) => {
    formikProps.setFieldValue("probation_period", value);
  };

  // Get display error message for date range
  const getDateRangeError = () => {
    if (formikProps.errors?.probation_start_date) {
      return formikProps.errors.probation_start_date;
    } else if (formikProps.errors?.probation_end_date) {
      return formikProps.errors.probation_end_date;
    }
    return null;
  };

  // Get touched state for date range
  const getDateRangeTouched = () => {
    return (
      formikProps.touched?.probation_start_date ||
      formikProps.touched?.probation_end_date
    );
  };

  return (
    <>
      <div className="space-y-2">
        <DateRangeInput
          name="probation_date_range"
          label="Probation Period Range"
          value={getDateRangeValue()}
          onChange={handleDateRangeChange}
          error={getDateRangeError()}
          touch={getDateRangeTouched()}
          required={true}
          icon={<CalendarDays className="h-4 w-4" />}
          placeholder="Select Probation Date Range"
          minDate={formikProps.values?.joining_date} // Enforce that probation can't start before joining date
        />
      </div>
      <div className="space-y-2">
        <TextInput
          name="probation_period"
          error={formikProps.errors?.probation_period}
          touch={formikProps.touched?.probation_period}
          value={formikProps.values?.probation_period}
          label="Probation Period"
          onChange={handlePeriodChange}
          required={true}
          disabled={true}
        />
      </div>
    </>
  );
};
export default ProbationDateRange
