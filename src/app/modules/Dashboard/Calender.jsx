import React, { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Import the English locale for dayjs
dayjs.locale("en"); // Set dayjs locale to English

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const daysInMonth = currentDate.daysInMonth();
  const firstDayOfMonth = currentDate.startOf("month").day();
  const today = dayjs();

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, "month"));
  };

  const isWeekend = (dayIndex) => {
    return dayIndex === 5 || dayIndex === 6;
  };

  return (
    <div className="p-4 w-full rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className=" font-medium">{currentDate.format("MMMM, YYYY")}</h2>
        <div className="gap-3 flex">
          <button onClick={handlePrevMonth}>
            <IoChevronBack className="text-2xl opacity-40" />
          </button>
          <button onClick={handleNextMonth}>
            <IoChevronForward className="text-2xl opacity-40" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
          <div
            key={day}
            className={`text-center font-bold ${
              isWeekend(index) ? "text-red-700" : ""
            }`}
          >
            <span className="font-normal opacity-60">{day}</span>
          </div>
        ))}
        {Array.from({
          length: firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1,
        }).map((_, index) => (
          <div key={`blank-${index}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, index) => (
          <div
            key={`day-${index}`}
            className={`text-center py-2 rounded-md ${
              today.isSame(currentDate.date(index + 1), "day")
                ? "border-[#283b91]  border-2 rounded-full "
                : isWeekend(currentDate.date(index).day())
                ? "bg-red-200 text-red-900"
                : ""
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
