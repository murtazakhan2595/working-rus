import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { useSelector } from "react-redux";
import { getAttendanceStats } from "app/hooks/attendance";

export function StatsCards() {
  const userProfile = useSelector((state) => state.user.userProfile);
  const userRole = useSelector((state) => state.user.userProfile.role);
  const employees = useSelector((state) => state.emp.employees);
  const [loading, setLoading] = useState(false);
  const TotalEmployees = React.useMemo(() => {
    return (employees?.filter((employee) =>
      userRole === 2
        ? parseInt(employee.direct_report) === parseInt(userProfile.id)
        : true
    )).length;
  }, [employees, userProfile]);
  const [cardStats, setCardStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
  });

  const attendanceStats = async (isMounted) => {
    setLoading(true);
    try {
      const response = await getAttendanceStats({
        filterData: userProfile.role === 2 ? { report_to: userProfile.id } : {},
      });
      if (response && isMounted) {
        setCardStats({
          present: parseInt(response?.daily_stats?.Present),
          absent: response?.daily_stats?.Absent,
          late: response?.daily_stats?.Late,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { title: "Total Employees", value: TotalEmployees || 0 },
    { title: "Present", value: cardStats?.present || 0 },
    { title: "Late", value: cardStats?.late || 0 },
    { title: "Absent", value: cardStats?.absent || 0 },
    {
      title: "Not Arrived",
      value:
        (parseInt(TotalEmployees) || 0) - (parseInt(cardStats?.present) || 0),
    },
  ];
  useEffect(() => {
    let isMounted = true;
    attendanceStats(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="flex flex-col justify-center shadow-md border rounded-lg"
        >
          {loading ? (
            <div className="animate-pulse">
              <CardHeader className="pb-2">
                <CardTitle className="h-4 bg-gray-300 rounded w-2/3"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </div>
          ) : (
            <>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-neutral-900">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-medium text-plum-900">
                  {stat.value}
                </p>
              </CardContent>
            </>
          )}
        </Card>
      ))}
    </div>
  );
}
