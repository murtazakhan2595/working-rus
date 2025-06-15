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

    // Convert weekdays string to array if it's a string
    const weekdaysArray = typeof shift.weekdays === 'string' 
      ? shift.weekdays.split(',').map(day => day.trim()) 
      : shift.weekdays || [];

    daysInMonth.forEach((day) => {
      const dayName = format(day, "EEEE");
      if (weekdaysArray.includes(dayName)) {
        workDays.push(getDate(day));
      } else {
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

  const formatWeekdays = (weekdays) => {
    if (!weekdays) return "No working days set";
    
    // If weekdays is a string, split it and clean up
    if (typeof weekdays === 'string') {
      return weekdays.split(',')
        .map(day => day.trim())
        .join(', ');
    }
    
    // If weekdays is an array
    if (Array.isArray(weekdays)) {
      return weekdays.join(', ');
    }

    return "No working days set";
  };

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
          Shift Schedule
        </CardTitle>
        <Button onClick={() => setShowAll(!showAll)} variant="ghost" size="sm" className="text-slate-900">
          {showAll ? "Hide Details" : "View Details"}
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading...</p>
          </div>
        ) : !shiftData ? (
          <div className="flex flex-col justify-center items-center h-40 text-center">
            <Clock className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-neutral-1200">No shift assigned</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50/80 rounded-lg p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-x-4">
                  <div>
                    <span className="text-gray-500 text-sm">Shift Name:</span>
                    <div className="font-medium text-gray-900">{shiftData.name || 'PAK'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Type:</span>
                    <div className="text-gray-900">{shiftData.type || 'Weekdays'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-900">
                    {shiftData.starttime ? format(new Date(shiftData.starttime), 'hh:mm a') : '10:00 AM'} - {shiftData.endtime ? format(new Date(shiftData.endtime), 'hh:mm a') : '07:00 PM'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-500 text-sm">Working Days:</span>
                  <div className="text-gray-900 mt-1">
                    {formatWeekdays(shiftData.weekdays) || 'Monday, Tuesday, Wednesday, Thursday, Friday'}
                  </div>
                </div>
              </div>
            </div>

            {showAll && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Working Days This Month</h3>
                  <div className="flex flex-wrap gap-2">
                    {workingDays.map((day) => (
                      <span
                        key={`working-${day}`}
                        className="px-2.5 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
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

                {nonWorkingDays.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Non-Working Days</h3>
                    <div className="flex flex-wrap gap-2">
                      {nonWorkingDays.map((day) => (
                        <span
                          key={`nonwork-${day}`}
                          className="px-2.5 py-1 text-sm bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
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
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </>
  );
}
