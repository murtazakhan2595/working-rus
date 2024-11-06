// static data
import React from 'react';
import { Link } from "react-router-dom";
import { getAllLabels } from "app/hooks/taskManagment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Label, Pie, PieChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "../../../../src/@/components/ui/chart"
import { Card, CardContent,  CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";


import { getAllProjects } from 'app/hooks/taskManagment';



// import { Label } from "@/components/ui/label"

export default function Component() {
  const [data, setData] = useState([])
  const userProfile = useSelector((state) => state.user.userProfile);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProjects({ }, userProfile);
        setData(response?.results)
        console.log(response?.results, "ALL PROJECTS")
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const statusColors = {
    completed: "var(--color-completed)",
    on_hold: "var(--color-on_hold)",
    on_going: "var(--color-on_going)"
};

const statusCounts = data?.reduce((acc, project) => {
  const statusKey = project.status.toLowerCase();
  if (!acc[statusKey]) {
      acc[statusKey] = 1;
  } else {
      acc[statusKey]++;
  }
  return acc;
}, {});

const chartData = Object.keys(statusCounts).map(status => ({
  status, 
  count: statusCounts[status], 
  fill: statusColors[status] 
}));


  const chartConfig = {
    visitors: {
      label: "Compeletd",
    },
    project1: {
      label: "On Hold",
      color: "hsl(var(--chart-1))",
    },
    project2: {
      label: "On Going",
      color: "hsl(var(--mauve-5))",
    },
    // project3: {
    //   label: "Closed",
    //   color: "hsl(var(--plum-7))",
    // },
   
  }


  return (
    <Card className="flex flex-col min-h-[442px]">
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg ">{userProfile.role === 4 ? "My Progress" : "Project Progress"} </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
        <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="text-3xl font-bold fill-foreground">
                          {data?.length}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                        Total
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            
          </PieChart>
          </ChartContainer>
      </CardContent>
      <CardFooter className="gap-2 text-sm flex-wra ">
      <div className="space-x-4 xl:flex">
          {Object.values(chartConfig).map((item, index) => (
            <div key={index} className="flex items-center text-sm text-mauve-900">
              <div className={`w-3 h-3 mr-2 rounded-sm`} style={{ backgroundColor: item.color }}></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>   
      </CardFooter>
    </Card>
  )
}
