import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "../../../../src/@/components/ui/chart";
import { getEmployeeCustomList } from "app/hooks/general";
import { Button } from "components/ui/button";
import { Link } from "react-router-dom";
import { FilterInput } from "components/FormControl";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../src/@/components/ui/tabs";
import { PageLoader } from "components";

const HeadcountSummaryWidget = ({ departments, designations }) => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [employeeData, setEmployeeData] = useState({
    total: 0,
    active: 0,
    offboarding: 0,
  });
  const [filterData, setFilterData] = useState({});
  const [departmentCounts, setDepartmentCounts] = useState([]);
  const [viewMode, setViewMode] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getEmployeeCustomList({filterData});

      setEmployeeData({
        total: response?.count || 0,
        active:
          response?.results?.filter((emp) => emp.employee_status === "Active")
            .length || 0,
        offboarding:
          response?.results?.filter((emp) => emp.employee_status !== "Active")
            .length || 0,
      });
     if (response?.results) {
        // If API doesn't provide departmentCounts directly, calculate from results
        const deptCounts = {};
        response.results.forEach((emp) => {
          const deptId = emp.department_name;
          if (!deptCounts[deptId]) {
            deptCounts[deptId] = 0;
          }
          deptCounts[deptId]++;
        });

        const formattedCounts = Object.keys(deptCounts).map((deptId) => {
          const dept = departments.find((d) => d.id === parseInt(deptId));
          return {
            id: deptId,
            name: dept?.name || "Unknown",
            count: deptCounts[deptId],
          };
        });

        setDepartmentCounts(formattedCounts);
      }
    } catch (err) {
      console.error("Error fetching employee data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterData, userProfile]);
  const handleFilterChange = (filterName, filterValue) => {
    if (filterName === "department_name") setSelectedDepartment(filterValue);
    if (filterName === "department_position")
      setSelectedDesignation(filterValue);

    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }

      return updatedFilters;
    });
  };

  const chartConfig = {
    total: {
      label: "Total",
      color: "hsl(var(--neutral-5))",
      value: employeeData.total,
    },
    active: {
      label: "Active",
      color: "hsl(var(--primary))",
      value: employeeData.active,
    },
    offboarding: {
      label: "Offboarding",
      color: "hsl(var(--plum-7))",
      value: employeeData.offboarding,
    },
  };

  const chartData = [
    {
      active: employeeData.active || 0,
      offboarding: employeeData.offboarding || 0,
    },
  ];

  // Function for Department headcount bar (similar to LeaveBar in MyLeaves)
  function DepartmentBar({
    count,
    maxCount,
    barColor = "hsl(var(--plum-7))",
    bgColor = "#F0F0F3",
  }) {
    const widthPercentage = Math.min((count / maxCount) * 100, 100);

    return (
      <div className="relative w-full h-2 overflow-hidden rounded-full">
        {/* Background bar */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{ backgroundColor: bgColor }}
        />
        {/* Count bar */}
        <div
          className="absolute top-0 left-0 h-full"
          style={{ width: `${widthPercentage}%`, backgroundColor: barColor }}
        />
      </div>
    );
  }

  return (
    <>
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Headcount Summary
          </div>
        </CardTitle>
        <CardDescription className="text-slate-900 mt-2">
          <div className="flex items-center gap-1">
            <FilterInput
              filters={[
                {
                  type: "select-one",
                  width: "max-w-[145px]",
                  option:
                    departments &&
                    departments.map((dept) => ({
                      value: dept.id,
                      label: dept.name,
                    })),
                  name: "department_name",
                  placeholder: "Department",
                  values: selectedDepartment,
                  value: selectedDepartment,
                },
                {
                  type: "select-two",
                  width: "max-w-[145px]",
                  option:
                    designations &&
                    designations.map((desig) => ({
                      value: desig.id,
                      label: desig.name,
                    })),
                  name: "department_position",
                  placeholder: "Designation",
                  values: selectedDesignation,
                  value: selectedDesignation,
                },
              ]}
              onChange={handleFilterChange}
            />
            {(userProfile.role === 1 || userProfile.role === 3) && (
              <Button variant="outline">
                <Link to="/profile-management">View Details</Link>
              </Button>
            )}
          </div>
          <Tabs
            defaultValue="overview"
            value={viewMode}
            onValueChange={setViewMode}
            className="w-full"
          >
            <TabsList className="flex items-center justify-center">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="department"
                className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                Department-wise
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <PageLoader />
          </div>
        ) : (
          <>
            {viewMode === "overview" ? (
              <div className="flex items-center flex-1 pb-0">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square w-full max-w-[200px]"
                >
                  <RadialBarChart
                    data={chartData}
                    endAngle={180}
                    innerRadius={80}
                    outerRadius={130}
                  >
                    <ChartTooltip
                      cursor={false}
                      content={({ payload }) => {
                        if (payload && payload.length > 0) {
                          return (
                            <div className="p-2 bg-white border rounded shadow">
                              {payload.map((entry, index) => {
                                const dataKey = entry.dataKey;
                                const value = entry.value;
                                const label =
                                  chartConfig[dataKey]?.label || dataKey;
                                return (
                                  <p
                                    key={index}
                                    className="flex items-center text-neutral-1100"
                                  >
                                    <span
                                      className="inline-block w-2 h-2 mr-2 rounded-full"
                                      style={{ backgroundColor: entry.fill }}
                                    />
                                    {label}: {value}
                                  </p>
                                );
                              })}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <PolarRadiusAxis
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) - 16}
                                  className="text-2xl font-bold fill-foreground"
                                >
                                  {employeeData?.total}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 4}
                                  className="fill-muted-foreground"
                                >
                                  Total
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </PolarRadiusAxis>
                    <RadialBar
                      dataKey="active"
                      stackId="a"
                      cornerRadius={5}
                      fill="var(--color-active)"
                      className="stroke-2 stroke-transparent"
                    />
                    <RadialBar
                      dataKey="offboarding"
                      fill="var(--color-offboarding)"
                      stackId="a"
                      cornerRadius={5}
                      className="stroke-2 stroke-transparent"
                    />
                    <ChartLegend
                      content={<ChartLegendContent />}
                      className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                    />
                  </RadialBarChart>
                </ChartContainer>
              </div>
            ) : (
              <div className="p-4 my-4 bg-white border rounded-lg border-zinc-200">
                <h4 className="mb-3 text-sm font-semibold text-neutral-800">
                  Department-wise Headcount
                </h4>
                {departmentCounts.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {departmentCounts.map((dept, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-32 text-sm text-neutral-900 truncate">
                          {dept.name}
                        </div>
                        <div className="flex-1">
                          <DepartmentBar
                            count={dept.count}
                            maxCount={Math.max(
                              ...departmentCounts.map((d) => d.count)
                            )}
                            barColor="hsl(var(--plum-7))"
                          />
                        </div>
                        <div className="text-sm font-medium text-neutral-900 w-12 text-right">
                          {dept.count}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    No department data available
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="flex justify-center">
        <div className="flex space-x-4">
          {Object.values(chartConfig).map((item, index) => (
            <div
              key={index}
              className="flex items-center text-sm text-mauve-900"
            >
              <div
                className={`w-3 h-3 mr-2 rounded-sm`}
                style={{ backgroundColor: item.color }}
              ></div>
              <span>
                {item.label} {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardFooter>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    departments: state.common.departments,
    designations: state.common.designations,
  };
};

export default connect(mapStateToProps)(HeadcountSummaryWidget);
