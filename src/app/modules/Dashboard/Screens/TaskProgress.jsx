// static data
import React from 'react';
import { Link } from "react-router-dom";
import { getAllLabels } from "app/hooks/taskManagment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Label, Pie, PieChart, Cell } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "../../../../src/@/components/ui/chart"
import { Card, CardContent,  CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";


import { getAllProjects } from 'app/hooks/taskManagment';
import { Button } from 'components/ui/button';



// import { Label } from "@/components/ui/label"

const formatStatus = (status) => {
  return status
    .replace(/_/g, ' ')  // Replace underscores with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function Component() {
  const [data, setData] = useState([])
  const userProfile = useSelector((state) => state.user.userProfile);
  const [activeStatus, setActiveStatus] = useState(null);

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

  // Add useEffect to handle auto-reset
  useEffect(() => {
    let timeoutId;
    if (activeStatus) {
      timeoutId = setTimeout(() => {
        setActiveStatus(null);
      }, 2000); // 2 seconds
    }
    
    // Cleanup timeout on component unmount or when activeStatus changes
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [activeStatus]);

  const statusColors = {
    completed: "hsl(var(--primary))",
    on_hold: "hsl(var(--neutral-5))",
    on_going: "hsl(var(--plum-7))"
};

const statusCounts = data?.reduce((acc, project) => {
  const statusKey = project.status ? project.status.toLowerCase() : 'on_going'; 
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

console.log('Chart Data with fills:', chartData);
console.log('Status Colors:', statusColors);

const chartConfig = {
    visitors: {
      label: "Completed",
      color: "hsl(var(--primary))",
    },
    project1: {
      label: "On Hold",
      color: "hsl(var(--neutral-5))",
    },
    project2: {
      label: "On Going",
      color: "hsl(var(--plum-7))",
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
          <Button variant="outline" className="">
            <Link to="/projects">View Details</Link>
          </Button>
       </CardTitle>
        
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
        <PieChart>
            <ChartTooltip 
              cursor={false} 
              content={({ payload }) => {
                if (payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-2 bg-white border rounded shadow">
                      <p className="flex items-center text-neutral-1100">
                        <span 
                          className="inline-block w-2 h-2 mr-2 rounded-full"
                          style={{ backgroundColor: data.fill }}
                        />
                        {formatStatus(data.status)}: {data.count}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie 
              data={chartData} 
              dataKey="count" 
              nameKey="status" 
              innerRadius={60} 
              strokeWidth={5}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  opacity={activeStatus ? (entry.status === activeStatus ? 1 : 0.5) : 1}
                />
              ))}
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
      <CardFooter className="flex-wrap justify-center gap-2 text-sm ">
      <div className="space-x-4 xl:flex">
          {Object.values(chartConfig).map((item, index) => {
            const statusData = chartData.find(
              data => data.status === item.label.toLowerCase().replace(' ', '_')
            );
            const count = statusData?.count || 0;
            const status = item.label.toLowerCase().replace(' ', '_');
            const isActive = activeStatus === status;

            return (
              <div 
                key={index} 
                className="flex items-center justify-center text-sm cursor-pointer text-neutral-1100 "
                onClick={() => setActiveStatus(isActive ? null : status)}
                style={{ opacity: activeStatus ? (isActive ? 1 : 0.5) : 1 }}
              >
                <div 
                  className={`w-3 h-3 mr-2 rounded-sm`} 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span>{item.label} {count}</span>
              </div>
            );
          })}
        </div>   
      </CardFooter>
    </Card>
  )
}
