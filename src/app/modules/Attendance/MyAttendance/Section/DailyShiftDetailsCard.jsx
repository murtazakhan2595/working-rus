import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardContent, CardTitle } from "components/ui/card";
import { getActiveShiftData } from "app/hooks/shiftManagement";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import moment from "moment";

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
  "Offset Count": {
    border: "border-plum-300",
    bg: "bg-plum-200",
    text: "text-plum-1100",
    title: "text-plum-900",
    icon: "text-plum-600",
  },
};

const DailyShiftDetailsCard = ({ isDashboard = false }) => {
  const emp_attendance_detail = useSelector(
    (state) => state.attendance.attendance_details
  );
  const { id: user_id } = useSelector((state) => state.user.userProfile);
  //   console.log(emp_attendance_detail, "emp_attendance_detail");

  const [shiftDetails, setShiftDetails] = useState([]);
  const [offsetCount, setOffsetCount] = useState(0);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async (isMounted) => {
      try {
        setIsLoading(true);
        const yesterday_shift = await getActiveShiftData(
          user_id,
          moment().subtract(1, "day")
        );
        const tomorrow_shift = await getActiveShiftData(
          user_id,
          moment().add(1, "day")
        );
        const today_shift = await getActiveShiftData(
          user_id,
          moment()
        );
        if (isMounted) {
          setShiftDetails([
            {
              day: "yesterday",
              details: yesterday_shift || {},
            },
            { day: "today", details: today_shift || {} },
            {
              day: "tomorrow",
              details: tomorrow_shift || {},
            },
          ]);

          const offSetCount = parseInt(
            emp_attendance_detail.monthly_overtime /
            emp_attendance_detail.monthly_total_hours
          );
          setOffsetCount(offSetCount || 0);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    let isMounted = true;
    if (user_id) fetchData(isMounted, user_id);
    return () => {
      isMounted = false;
    };
  }, [emp_attendance_detail, user_id]);

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
          {shiftDetails.map(({ day, details }) => (
            <ShiftCard
              day={day}
              Icon={Clock}
              shifts={details.shifts}
              status={details.shift_assigned}
              OffLabel={details.OffLabel}
            />
          ))}
          <ShiftCard
            day={"Offset Count"}
            Icon={Clock}
            OffLabel={`${offsetCount} Days`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ShiftCard = ({ day, Icon, shifts, status, OffLabel }) => {
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
      {status ? (
        <div className="">
          {shifts && shifts.length > 0 ? (
            shifts.map((shift, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 justify-between py-1 px-2 text-sm ${dayStyles[day].text}`}
              >
                <span className="font-medium">{shift.start_time}</span>
                <ArrowRight className={`h-3 w-3 ${dayStyles[day].icon}`} />
                <span className="font-medium">{shift.end_time}</span>
              </div>
            ))
          ) : (
            <div
              className={`text-center py-1 px-2 text-sm font-medium ${dayStyles[day].text}`}
            >
              {OffLabel}
            </div>
          )}
        </div>
      ) : (
        <div
          className={`text-center py-1 px-2 text-sm font-medium ${dayStyles[day].text}`}
        >
          {OffLabel}
        </div>
      )}
    </div>
  );
};

export default DailyShiftDetailsCard;
