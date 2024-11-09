import {
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Legend,
} from "recharts";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../../../../src/@/components/ui/chart";
import { getEmployeeCustomList } from "app/hooks/general";
import { Button } from "components/ui/button";
import { Link } from "react-router-dom";

export default function Component() {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [employeeData, setEmployeeData] = useState({
    total: 0,
    active: 0,
    offboarding: 0,
  });

  const fetchData = async () => {
    try {
      const response = await getEmployeeCustomList();
      setEmployeeData({
        total: response?.count || 0,
        active: response?.ActiveEmployee || 0,
        offboarding: (response?.count || 0) - (response?.ActiveEmployee || 0),
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userProfile]);

  const chartConfig = {
    total: {
      label: "Total",
      color: "hsl(var(--success-4))",
      value: employeeData.total,
    },
    active: {
      label: "Active",
      color: "hsl(var(--primary))",
      value: employeeData.active,
    },
    offboarding: {
      label: "Offboarding",
      color: "hsl(var(--red-4))",
      value: employeeData.offboarding,
    },
  };

  const chartData = [
    {
      active: employeeData.active || 97,
      offboarding: employeeData.offboarding || 10,
    },
  ];

  const totalEmployees = chartData[0].active + chartData[0].offboarding;

  return (
    <Card className="flex flex-col min-h-[442px]">
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Total Employees
          </div>
          <Button variant="outline" className="">
            <Link to="/profile-management">View Details</Link>
          </Button>
        </CardTitle>
        <CardDescription className="text-slate-900">
          {/* January - June 2024 */}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]  "
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip cursor={false} content={<ChartTooltipContent className="text-neutral-1100" />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="text-2xl font-bold fill-foreground"
                        >
                          {totalEmployees.toLocaleString()}
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
              <span>{item.label} {item.value}</span>
            </div>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
