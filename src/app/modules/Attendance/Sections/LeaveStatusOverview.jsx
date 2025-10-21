"use client";

import React, { useEffect, useState } from "react";
import { Pie, PieChart, Cell, Legend } from "recharts";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { getLeaveStatusDaily } from "app/hooks/leaveTracker";
import { FilterInput } from "components/FormControl";
import { HasAccess } from "utils/PermissionUtils";

// Define color mapping for different leave types
const colorMap = {
  "Sick Leaves": "#DDA0DD",
  "Annual Leaves": "#A020F0",
  "Personal Leaves": "#E6E6FA",
  "Total Employees": "#F0F0F3",
};

export function LeaveStatusOverview() {
  // Transform API data into chart format
  const isViewStatus = HasAccess("VIEW_LEAVE_STATUS");
  const isViewDptStatus = HasAccess("VIEW_DEPARTMENT_LEAVE_STATUS");
  const isViewBrnStatus = HasAccess("VIEW_BRANCH_LEAVE_STATUS");
  const isViewRLStatus = HasAccess("VIEW_REPORTING_LINE_LEAVE_STATUS");
  const Employees = useSelector((state) => state.emp.employees);
  const { branch_id: user_branch, department_name: user_department } =
    useSelector((state) => state.emp.user_details);
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);
  const [leaveStatusData, setLeaveStatusData] = useState({});
  const [selectedDepartment, setSelectDepartment] = useState("");
  const [selectedBranch, setSelectBranch] = useState("");
  const [filterData, setFilterData] = useState({});
  const fetchData = async (isMounted) => {
    try {
      const response = await getLeaveStatusDaily({ filterData });
      if (isMounted) {
        setLeaveStatusData(response);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);

  useEffect(() => {
    let isMounted = true;
    setFilterData(() => {
      if (isViewStatus) return {};
      else {
        if (isViewBrnStatus) {
          return { branch_ids: [user_branch] };
        } else if (isViewDptStatus) {
          return { departments: user_department };
        } else if (isViewRLStatus) {
          return {};
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [isViewBrnStatus, isViewDptStatus, isViewRLStatus, isViewStatus]);

  const chartData =
    leaveStatusData?.leave_details?.map((item) => ({
      name: item.leave_name,
      value: item.count,
      color: colorMap[item.leave_name] || "#E6E6FA", // Fallback color if type not in mapping
    })) || [];

  const totalLeaves = leaveStatusData?.total_employees_on_leave || 0;
  const dataToRender =
    chartData.length && chartData.length > 0
      ? chartData
      : [
          {
            name: "Total Employees",
            value: Employees.length || 0,
            color: colorMap["Total Employees"], // Fallback color if type not in mapping
          },
        ];
  const handleFilterChange = (filterName, filterValue) => {
    if (filterName === "departments") setSelectDepartment(filterValue);
    if (filterName === "branch_ids") setSelectBranch(filterValue);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        if (filterName === "branch_ids")
          updatedFilters[filterName] = [filterValue];
        else updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };
  if (!isViewBrnStatus && !isViewDptStatus && !isViewRLStatus && !isViewStatus)
    return null;
  return (
    <Card className="flex flex-col shadow-lg border rounded-xl bg-white min-w-[33%] gap-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-row flex-wrap gap-2 justify-between">
          <div className="text-xl font-bold text-plum-900">
            Leave Status Overview
          </div>
          <FilterInput
            filters={[
              ...(isViewStatus || isViewBrnStatus
                ? [
                    {
                      type: "select",
                      options: Departments,
                      name: "departments",
                      placeholder: "Department",
                      values: selectedDepartment,
                    },
                  ]
                : []),
              ...(isViewStatus || isViewDptStatus
                ? [
                    {
                      type: "select-two",
                      option: Branches,
                      name: "branch_ids",
                      placeholder: "Branch",
                      values: selectedBranch,
                    },
                  ]
                : []),
            ]}
            onChange={handleFilterChange}
            className="w-full justify-end"
          />
        </CardTitle>
      </CardHeader>
      <CardDescription className="flex justify-end items-center"></CardDescription>
      <CardContent className="flex justify-center items-center">
        <PieChart width={200} height={200}>
          <Pie
            data={dataToRender}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={85}
            outerRadius={100}
            paddingAngle={0}
            stroke="none"
          >
            {dataToRender.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-plum-900"
            style={{ fontSize: "24px", fontWeight: "bold" }}
          >
            {totalLeaves}
          </text>
          <text
            x="50%"
            y="65%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-gray-500"
            style={{ fontSize: "14px" }}
          >
            Total on Leaves
          </text>
        </PieChart>
      </CardContent>
      <CardDescription className="mt-4 text-left text-sm px-6 pb-6">
        <ul className="space-y-2">
          {chartData.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span className="flex items-center gap-2 text-neutral-1100">
                <span
                  className="block w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                {item.name}
              </span>
              <span className="font-bold text-gray-1200">{item.value}</span>
            </li>
          ))}
        </ul>
      </CardDescription>
    </Card>
  );
}
