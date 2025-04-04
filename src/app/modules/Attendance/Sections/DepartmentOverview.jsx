import React, { useEffect, useState } from "react";
import { Progress } from "src/@/components/ui/progress"; // Assuming Shadcn provides this
import { getDepartmentPercentage } from "app/hooks/attendance";
import { ScrollArea } from "src/@/components/ui/scroll-area";
const DepartmentOverview = () => {
  const [departmentAttendanceData, setDepartmentAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const response = await getDepartmentPercentage();
      if (isMounted) {
        setDepartmentAttendanceData(response);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <div className="p-4 bg-white border rounded-md shadow-md min-w-[33%]">
      <h2 className="text-xl font-semibold text-plum-900 mb-4">
        Department Overview
      </h2>
      <ScrollArea className="[&>div>div[style]]:!block">
        <ul className="space-y-4 h-[320px]">
          {departmentAttendanceData.map((dept, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-1000">
                  {dept.department_name}
                </p>
                <p className="text-xs text-gray-800">
                  {dept.total_employees} members • {dept.present_count}
                  present • {dept.late_count} late
                </p>
                <div className="flex flex-row gap-3">
                  <Progress
                    value={dept.attendance_percentage}
                    className="mt-1 h-2 bg-gray-500"
                    color="purple"
                  />
                  <p className="text-xs text-gray-800 min-w-[105px]">
                    {dept.attendance_percentage}% attendance
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default DepartmentOverview;
