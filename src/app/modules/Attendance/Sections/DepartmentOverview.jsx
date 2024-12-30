import React from "react";
import { Progress } from "src/@/components/ui/progress"; // Assuming Shadcn provides this

const departmentData = [
  { name: "Development", members: 92, attendance: 96 },
  { name: "Marketing", members: 8, attendance: 93 },
  { name: "Sales", members: 6, attendance: 93 },
  { name: "HR", members: 4, attendance: 93 },
  { name: "Design", members: 5, attendance: 93 },
  { name: "Operations", members: 5, attendance: 93 },
];

const DepartmentOverview = () => {
  return (
    <div className="p-4 bg-white border rounded-md shadow-md min-w-[33%]">
      <h2 className="text-xl font-semibold text-plum-900 mb-4">
        Department Overview
      </h2>
      <ul className="space-y-4">
        {departmentData.map((dept, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{dept.name}</p>
              <p className="text-xs text-gray-500">
                {dept.members} members • {dept.attendance}% attendance
              </p>
              <Progress
                value={dept.attendance}
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
