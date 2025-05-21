import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import {
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDate,
} from "date-fns";
import { getShiftById } from "app/hooks/attendance";
import { useSelector } from "react-redux";
import { getEmployeeData } from "app/hooks/employee";

export default function ShiftDetailsWidget() {
  const [showAll, setShowAll] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const userProfile = useSelector((state) => state.user.userProfile);
  const [shiftData, setShiftData] = useState(null);
  const [workingDays, setWorkingDays] = useState([]);
  const [nonWorkingDays, setNonWorkingDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEmpShift = async () => {
      try {
        setLoading(true);
        const workInfo = await getEmployeeData(userProfile.id);
        if (workInfo && workInfo.shift_assignment) {
          const res = await getShiftById(workInfo.shift_assignment);
          setShiftData(res);

          if (res) {
            calculateWorkingDays(res, currentMonth);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shift data:", error);
        setLoading(false);
      }
    };

    getEmpShift();
  }, [userProfile.id, currentMonth]);

  const calculateWorkingDays = (shift, month) => {
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(month),
      end: endOfMonth(month),
    });

    const workDays = [];
    const absents = [];

    daysInMonth.forEach((day) => {
      const dayName = format(day, "EEEE"); // Get day name (Monday, Tuesday, etc.)

      // Check if this day is in the shift's weekdays
      if (shift.weekdays.includes(dayName)) {
        workDays.push(getDate(day));
      } else {
        // If it's a weekday but not in shift's weekdays, consider it absent
        if (
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
            dayName
          )
        ) {
          absents.push(getDate(day));
        }
      }
    });

    setWorkingDays(workDays);
    setNonWorkingDays(absents);
  };

  // Format days of the week for display
  const formatWeekdays = (weekdays) => {
    // console.log("weekdays", weekdays);
    // if (!weekdays || weekdays.length === 0) return "N/A";
    // return weekdays?.join(", ");
    return "N/A"
  };

  return (
    <>
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Shift Schedule
          </div>
          <Button
            variant="ghost"
            className=""
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Hide Details" : "View Details"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <p>Loading shift data...</p>
          </div>
        ) : shiftData ? (
          <div>
            <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <span className="font-medium text-sm mr-2">Shift Name:</span>
                  <span className="text-sm bg-blue-100 px-2 py-1 rounded">
                    {shiftData.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="text-sm">
                    {shiftData.shiftStartTime} - {shiftData.shiftEndTime}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-sm mr-2">Type:</span>
                  <span className="text-sm">{shiftData.type}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="font-medium text-sm mr-2">Working Days:</span>
                <span className="text-sm">
                  {formatWeekdays(shiftData?.weekdays)}
                </span>
              </div>
            </div>

            {showAll && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Working Days This Month
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {workingDays.map((day) => (
                        <span
                          key={`working-${day}`}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
                        >
                          {format(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth(),
                              day
                            ),
                            "MMM d"
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      Non-Working Days
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {nonWorkingDays.map((day) => (
                        <span
                          key={`nonwork-${day}`}
                          className="px-2 py-1 text-xs bg-[#fee2e2] text-red-800 rounded-md"
                        >
                          {format(
                            new Date(
                              currentMonth.getFullYear(),
                              currentMonth.getMonth(),
                              day
                            ),
                            "MMM d"
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-sm text-gray-500">No shift assigned</p>
          </div>
        )}
      </CardContent>
    </>
  );
}
