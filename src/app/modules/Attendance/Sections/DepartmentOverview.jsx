import React, { useEffect, useState } from "react";
import { Progress } from "src/@/components/ui/progress"; // Assuming Shadcn provides this
import { getDepartmentPercentage } from "app/hooks/attendance";
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
  if (!departmentAttendanceData || departmentAttendanceData.length === 0) {
  }
  return (
    <div className="p-4 bg-white border rounded-md shadow-md min-w-[33%]">
      <h2 className="text-xl font-semibold text-plum-900 mb-4">
        Department Overview
      </h2>
      <ul className="space-y-4">
        {departmentAttendanceData && departmentAttendanceData.length > 0 ? (
          departmentAttendanceData.map((dept, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-1000">
                  {dept.department_name}
                </p>
                <p className="text-xs text-gray-800">
                  {dept.total_employees} members • {dept.attendance_percentage}%
                  attendance
                </p>
                <Progress
                  value={dept.attendance_percentage}
                  className="mt-1 h-2 bg-gray-500"
                  color="purple"
                />
              </div>
            </li>
          ))
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
};

export default DepartmentOverview;
