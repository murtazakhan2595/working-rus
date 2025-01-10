import React from "react";
import { Progress } from "src/@/components/ui/progress"; // Assuming Shadcn provides this



const DepartmentOverview = ({ departmentPercentage }) => {
  return (
    <div className="p-4 bg-white border rounded-md shadow-md min-w-[33%]">
      <h2 className="text-xl font-semibold text-plum-900 mb-4">
        Department Overview
      </h2>
      <ul className="space-y-4">
        {departmentPercentage.map((dept, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">
                {dept.department_name}
              </p>
              <p className="text-xs text-gray-500">
                {dept.total_employees} members • {dept.attendance_percentage}%
                attendance
              </p>
              <Progress
                value={dept.attendance_percentage}
                className="mt-1 h-2 bg-gray-200"
                color="purple"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentOverview;
