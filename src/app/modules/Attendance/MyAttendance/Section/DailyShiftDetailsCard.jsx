import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardContent, CardTitle } from "components/ui/card";
import { getEmployeeActiveShift } from "app/modules/Attendance/ShiftCalendar/Section/getEmployeeActiveShift";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const dayStyles = {
  yesterday: {
    border: "border-gray-200",
    bg: "bg-gray-50/50",
    text: "text-gray-800",
    title: "text-gray-900",
    icon: "text-gray-500",
  },
  today: {
    border: "border-emerald-200",
    bg: "bg-emerald-50/50",
    text: "text-emerald-600",
    title: "text-emerald-700",
    icon: "text-emerald-400",
  },
  tomorrow: {
    border: "border-blue-200",
    bg: "bg-blue-50/50",
    text: "text-blue-600",
    title: "text-blue-700",
    icon: "text-blue-400",
  },
  'Offset Count': {
    border: "border-plum-300",
    bg: "bg-plum-200",
    text: "text-plum-1100",
    title: "text-plum-900",
    icon: "text-plum-600",
  },
};

const DailyShiftDetailsCard = ({ userId, isDashboard = false }) => {
  const emp_attendance_detail = useSelector(
    (state) => state.attendance.attendance_details
  );
//   console.log(emp_attendance_detail, "emp_attendance_detail");

  const [shiftDetails, setShiftDetails] = useState({
    yesterday: null,
    today: null,
    tomorrow: null,
  });
  const [offsetCount, setOffsetCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShiftDetails();
  }, [userId]);

  const fetchShiftDetails = async () => {
    try {
      setLoading(true);
      const dates = {
        yesterday: new Date(Date.now() - 86400000),
        today: new Date(),
        tomorrow: new Date(Date.now() + 86400000),
      };

      const details = {};
      let totalOvertimeHours = 0;

      for (const [key, date] of Object.entries(dates)) {
        const response = await getEmployeeActiveShift(userId, date);
        if (response) {
          details[key] = processShiftData(response);
          if (response.overtime_hours) {
            totalOvertimeHours += parseFloat(response.overtime_hours);
          }
        } else {
          details[key] = { status: "No shift assigned" };
        }
      }

      const calculatedOffsetCount = Math.floor(totalOvertimeHours / 9);
      setOffsetCount(calculatedOffsetCount);
      setShiftDetails(details);
    } catch (error) {
      console.error("Error fetching shift details:", error);
      toast.error("Failed to fetch shift details");
    } finally {
      setLoading(false);
    }
  };

  const processShiftData = (shiftData) => {
    if (!shiftData || shiftData.status === "no_shift") {
      return { status: "No shift assigned" };
    }

    if (shiftData.status === "off") {
      if (shiftData.is_on_leave) {
        return { status: "Off (Leave)" };
      }
      if (shiftData.is_weekly_off) {
        return { status: "Off (Weekly)" };
      }
      return { status: "Off" };
    }

    if (shiftData.status === "active") {
      if (shiftData.is_split_shift && shiftData.split_shifts) {
        return {
          status: "active",
          shifts: shiftData.split_shifts.map((shift) => ({
            start: format(new Date(shift.start_time), "hh:mm a"),
            end: format(new Date(shift.end_time), "hh:mm a"),
          })),
        };
      }

      return {
        status: "active",
        shifts: [
          {
            start: format(new Date(shiftData.start_time), "hh:mm a"),
            end: format(new Date(shiftData.end_time), "hh:mm a"),
          },
        ],
      };
    }

    return { status: "No shift assigned" };
  };

  if (loading) {
    return (
      <Card className={`w-full ${isDashboard ? "h-full" : ""} shadow-sm`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Shift Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plum-900 mb-2"></div>
              <p className="text-sm text-gray-500">Loading shift details...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${isDashboard ? "h-full" : ""} shadow-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-plum-900">Shift Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(shiftDetails).map(([day, detail]) => (
            <>
              <ShiftCard day={day} detail={detail} Icon={Clock} />
              {/* <div
                key={day}
                className={`flex gap-2 justify-between px-2 py-1 rounded-md border transition-all duration-200 hover:shadow-md ${dayStyles[day].border} ${dayStyles[day].bg}`}
              >
                <div
                  className={`flex items-center gap-1 font-medium capitalize text-lg ${dayStyles[day].title}`}
                >
                  <Clock className={`h-4 w-4 ${dayStyles[day].icon}`} />
                  {day}
                </div>
                {detail.status === "active" ? (
                  <div className="space-y-2">
                    {detail.shifts.map((shift, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 justify-between py-2 text-sm ${dayStyles[day].text}`}
                      >
                        <span className="font-medium">{shift.start}</span>
                        <ArrowRight
                          className={`h-4 w-4 ${dayStyles[day].icon}`}
                        />
                        <span className="font-medium">{shift.end}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className={`text-center py-2 px-3 text-sm font-medium ${dayStyles[day].text}`}
                  >
                    {detail.status}
                  </div>
                )}
              </div> */}
            </>
          ))}
          <ShiftCard
            day={"Offset Count"}
            detail={{ status: `${offsetCount} Days` }}
            Icon={Clock}
          />
{/* 
          <div className="mt-6 p-4 bg-plum-50/50 rounded-lg border border-plum-200">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 font-medium text-plum-900">
                <Clock className="h-4 w-4 text-plum-400" />
                Offset Count
              </span>
              <span className="px-3 py-1 bg-white rounded-md font-medium text-plum-1100 shadow-sm">
                {offsetCount} Days
              </span>
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};

const ShiftCard = ({ day, detail, Icon }) => {
  return (
    <div
      key={day}
      className={`flex gap-2 justify-between px-2 py-1 rounded-md transition-all duration-200 hover:shadow-md ${dayStyles[day].bg}`}
    >
      <div
        className={`flex items-center gap-1 font-medium capitalize text-sm ${dayStyles[day].title}`}
      >
        <Icon className={`h-4 w-4 ${dayStyles[day].icon}`} />
        {day}
      </div>
      {detail.status === "active" ? (
        <div className="space-y-2">
          {detail.shifts.map((shift, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 justify-between py-1 px-2 text-sm ${dayStyles[day].text}`}
            >
              <span className="font-medium">{shift.start}</span>
              <ArrowRight className={`h-3 w-3 ${dayStyles[day].icon}`} />
              <span className="font-medium">{shift.end}</span>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`text-center py-1 px-2 text-sm font-medium ${dayStyles[day].text}`}
        >
          {detail.status}
        </div>
      )}
    </div>
  );
};

export default DailyShiftDetailsCard;
