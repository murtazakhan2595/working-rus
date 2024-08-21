// import { FaChevronDown } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import Chart from "react-apexcharts";
// import { Col, Row } from "reactstrap";
// import { getAllLabels } from "app/hooks/taskManagment";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";

// export default function TaskProgress() {
// const userProfile = useSelector((state) => state.user.userProfile);
// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await getAllLabels();
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   fetchData();
// }, []);
// const chartOptions = {
//   chart: {
//     type: "donut",
//   },
//   colors: ["#1A932E", "#E5AE21", "#E65F2B", "[#fff]"],
//   dataLabels: {
//     enabled: false,
//   },
//   plotOptions: {
//     pie: {
//       startAngle: -90,
//       endAngle: 90,
//       donut: {
//         size: "88%",
//       },
//     },
//   },
//   fill: {
//     colors: ["#1A932E", "#E5AE21", "#E65F2B", "[#fff]"],
//   },
//   legend: {
//     show: false,
//   },
//   tooltip: {
//     enabled: false, // Disable tooltips
//   },
// };

// Calculate the series values
// const getSegMentValue = (overallCompletion) => {
//   const firstSegment = 33.33;
//   const secondSegment = 33.33;
//   const thirdSegment = 33.33;
//   const remainingSegment = 100 - overallCompletion;
//   if (overallCompletion < firstSegment) {
//     return [overallCompletion, 0, 0, remainingSegment];
//   } else if (overallCompletion < firstSegment + secondSegment) {
//     return [
//       firstSegment,
//       firstSegment + secondSegment - overallCompletion,
//       0,
//       remainingSegment,
//     ];
//   } else if (
//     overallCompletion <
//     firstSegment + secondSegment + thirdSegment
//   ) {
//     return [
//       firstSegment,
//       secondSegment,
//       firstSegment + secondSegment + thirdSegment - overallCompletion,
//       remainingSegment,
//     ];
//   }
//   const chartSeries = [
//     firstSegment,
//     secondSegment,
//     thirdSegment,
//     remainingSegment,
//   ];
//   return chartSeries;
// };

//   return (
//     <div className="p-[18px] bg-white rounded-[5px]">
//       <header className="inline-flex items-center justify-between w-full">
//         <div className="text-[#323233] text-lg font-normal leading-tight">
//           {userProfile.role === 4 ? "My Progress" : "Task Progress"}
//         </div>
//         <div className="flex items-center justify-start gap-1">
//           <Link to="">
//             <div className="flex gap-1.5 justify-center px-2.5 py-2 my-auto text-xs leading-5 text-black rounded items-center ">
//               <div className="my-auto grow">All</div>
//               <FaChevronDown size={11} />
//             </div>
//           </Link>
//         </div>
//       </header>
//       <div className="relative mt-6">
//         <div className="h-[100px] overflow-hidden">
//           <Chart
//             options={chartOptions}
//             series={getSegMentValue(88)}
//             type="donut"
//             width="100%"
//             height="200px"
//           />
//           <div className="flex items-center flex-col absolute top-[34px] left-1/2 -translate-x-1/2 ">
//             <div className="text-[#060606] text-[28px] font-normal tracking-tight">
//               72%
//             </div>
//             <div className="w-[72px] text-center text-[#9a9a9a] text-sm font-normal tracking-tight">
//               Completed
//             </div>
//           </div>
//         </div>
//         <Row>
//           <TotalCount
//             count={10}
//             label="Total projects"
//             textColor={"text-[#060606]"}
//           />
//           <TotalCount
//             count={5}
//             label="Completed"
//             textColor={"text-[#1a922d]"}
//           />
//           <TotalCount count={2} label="Delayed" textColor={"text-[#dfa510]"} />
//           <TotalCount count={3} label="On going" textColor={"text-[#e65f2b]"} />
//         </Row>
//       </div>
//     </div>
//   );
// }
import React from 'react';
import { Link } from "react-router-dom";
import { getAllLabels } from "app/hooks/taskManagment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Label, Pie, PieChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../../../../src/@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../src/@/components/ui/card";
import { Button } from "components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "../../../../src/@/lib/utils";



import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../src/@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../src/@/components/ui/popover"



// import { Label } from "@/components/ui/label"

export default function Component() {

  const userProfile = useSelector((state) => state.user.userProfile);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllLabels();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  // const chartOptions = {
  //   chart: {
  //     type: "donut",
  //   },
  //   colors: ["#1A932E", "#E5AE21", "#E65F2B", "[#fff]"],
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   plotOptions: {
  //     pie: {
  //       startAngle: -90,
  //       endAngle: 90,
  //       donut: {
  //         size: "88%",
  //       },
  //     },
  //   },
  //   fill: {
  //     colors: ["#1A932E", "#E5AE21", "#E65F2B", "[#fff]"],
  //   },
  //   legend: {
  //     show: false,
  //   },
  //   tooltip: {
  //     enabled: false, // Disable tooltips
  //   },
  // };

  // Calculate the series values
  // const getSegMentValue = (overallCompletion) => {
  //   const firstSegment = 33.33;
  //   const secondSegment = 33.33;
  //   const thirdSegment = 33.33;
  //   const remainingSegment = 100 - overallCompletion;
  //   if (overallCompletion < firstSegment) {
  //     return [overallCompletion, 0, 0, remainingSegment];
  //   } else if (overallCompletion < firstSegment + secondSegment) {
  //     return [
  //       firstSegment,
  //       firstSegment + secondSegment - overallCompletion,
  //       0,
  //       remainingSegment,
  //     ];
  //   } else if (
  //     overallCompletion <
  //     firstSegment + secondSegment + thirdSegment
  //   ) {
  //     return [
  //       firstSegment,
  //       secondSegment,
  //       firstSegment + secondSegment + thirdSegment - overallCompletion,
  //       remainingSegment,
  //     ];
  //   }
  //   const chartSeries = [
  //     firstSegment,
  //     secondSegment,
  //     thirdSegment,
  //     remainingSegment,
  //   ];
  //   return chartSeries;
  // };
  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ]
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
   
  }
  const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
    
  ]
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])
  // const chartData = [{ browser: "safari", visitors: 200, fill: "var(--color-safari)" }]
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100">{userProfile.role === 4 ? "My Progress" : "Project Progress"} </div>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between rounded-full h-7"
              >
                {value
                  ? frameworks.find((framework) => framework.value === value)?.label
                  : "Select project..."}
                <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search framework..." />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {frameworks.map((framework) => (
                      <CommandItem
                        key={framework.value}
                        value={framework.value}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue)
                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === framework.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {framework.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardTitle>
        <CardDescription className="text-slate-900">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
        <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="text-3xl font-bold fill-foreground">
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Visitors
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
      <CardFooter className="flex-col gap-2 text-sm">

      </CardFooter>
    </Card>
  )
}

function TrendingUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}