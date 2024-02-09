import React, { useState, useEffect } from "react";
import LeaveHeader from "./LeaveHeader";
import Datepicker from "../Dashboard/Datepicker";
import Select from "react-select";
import { IoIosSearch } from "react-icons/io";
import moment from "moment";

const userRoles = [
  { value: 1, label: "Super Admin" },
  { value: 2, label: "Manager" },
  { value: 3, label: "HR" },
  { value: 4, label: "Employee" },
];

export const LeaveCalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);

  const updateCalendar = (newDate) => {
    setCurrentDate(newDate);
    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    setDaysInMonth(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  };

  const goToPreviousMonth = () => {
    const previousMonth = new Date(currentDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    updateCalendar(previousMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    updateCalendar(nextMonth);
  };

  const getDayName = (date) => {
    const options = { weekday: "short" };
    const dayName = date.toLocaleDateString("en-US", options);
    return dayName.charAt(0);
  };

  useEffect(() => {
    updateCalendar(currentDate);
  }, [currentDate]);

  return (
    <div className="w-full bg-[#f9f9f9]">
      <LeaveHeader post="Leave Calender" />
      {/* search bar, dropdowns and dates */}
      <div className="md:my-3 lg:mx-8 lg:my-4 my-2">
        <div className="flex flex-wrap justify-between md:justify-center lg:justify-between md:gap-x-14 lg:gap-x-0 items-center bg-[#F2F2F2] rounded-md">
          <div className="p-2 lg:p-3 block">
            <div className="relative">
              <IoIosSearch className="absolute top-2 left-3 text-black" />
              <input
                type="search"
                placeholder="Search by Name"
                className="focus:outline-none focus:border-non py-1 pl-8 pr-4 border-none md:w-60 lg:w-64 xs:w-[19rem] rounded-md"
              />
            </div>
          </div>
          <Select
            name="userrole"
            className="w-36 mx-2 lg:mx-0 md:w-44"
            value=""
            options={userRoles}
            required
            //   onChange={(selectedOption) =>
            //     handleChange("userrole", selectedOption)
            //   }
          />
          <Select
            name="userrole"
            className="w-36 mx-2 lg:mx-0 md:w-44"
            value=""
            options={userRoles}
            required
            //   onChange={(selectedOption) =>
            //     handleChange("userrole", selectedOption)
            //   }
          />
          <div className="flex items-center gap-x-1 lg:gap-x-4 border-[2px] border-[#29BAFF] px-2 mt-2 lg:mt-0 py-3 rounded-lg">
            <Datepicker
              className="z-50"
              required
              onChange={(date) => {
                let formattedDate = moment(date).format("YYYY-MM-DD");
                //   handleChange("Deadline", formattedDate);
              }}
            />
            -
            <Datepicker
              className="z-50"
              required
              onChange={(date) => {
                let formattedDate = moment(date).format("YYYY-MM-DD");
                //   handleChange("Deadline", formattedDate);
              }}
            />
          </div>
        </div>
      </div>

      {/* leave indicators */}

      <div className="bg-[#F2F2F2] rounded-xl md:my-3 lg:mx-8 lg:mt-3 lg:py-1 lg:px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <div className="bg-[#FFCD07] w-4 h-4"></div>
            <div className="text-[#555657]">Annual</div>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="bg-[#6EFF00] w-4 h-4"></div>
            <div className="text-[#555657]">Causal</div>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="bg-[#00FFDC] w-4 h-4"></div>
            <div className="text-[#555657]">Emergency</div>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="bg-[#2900FF] w-4 h-4"></div>
            <div className="text-[#555657]">Maternity</div>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="bg-[#FF00E6] w-4 h-4"></div>
            <div className="text-[#555657]">Unpaid</div>
          </div>
          <div className="flex items-center gap-x-2">
            <div className="bg-[#F26A01] w-4 h-4"></div>
            <div className="text-[#555657]">Sick</div>
          </div>
        </div>
      </div>

      <div className="md:my-3 lg:mx-8">
        <div className="w-full">
          <div className="flex items-center gap-x-3 justify-end mb-2">
            <button
              className="px-2 py-1 bg-[#283B91] text-sm text-white rounded"
              onClick={goToPreviousMonth}
            >
              Previous
            </button>
            <h2 className="text-base font-semibold">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              className="px-2 py-1 bg-[#283B91] text-sm text-white rounded"
              onClick={goToNextMonth}
            >
              Next
            </button>
          </div>
          <div className="flex flex-wrap overflow-x-auto">
            {daysInMonth.map((day, index) => (
              <React.Fragment key={day}>
                {index === 0 && (
                  <div className="w-12 h-12 text-center leading-12 border border-white bg-[#F2F2F2] rounded-sm">
                    <div className="text-sm font-semibold text-[#838D91]">
                      Person
                    </div>
                  </div>
                )}
                <div className="w-8 h-12 text-center leading-12 border border-white bg-[#F2F2F2] rounded-sm">
                  <div className="text-sm font-semibold text-[#838D91]">
                    {getDayName(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      )
                    )}
                  </div>
                  <div className="font-bold text-[#249CD5] text-sm">{day}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalender;
