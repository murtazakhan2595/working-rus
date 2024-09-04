// static data
import React from 'react';
import { Link } from "react-router-dom";
import { getAllLabels } from "app/hooks/taskManagment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Label, Pie, PieChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "../../../../src/@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../components/ui/card";
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

  const frameworks = [
    {
      value: "project1",
      label: "project1",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "project12",
      label: "project12",
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
      label: "Compeletd",
    },
    project1: {
      label: "Project1",
      color: "hsl(var(--chart-1))",
    },
    project2: {
      label: "Project2",
      color: "hsl(var(--mauve-5))",
    },
    project3: {
      label: "Project3",
      color: "hsl(var(--plum-7))",
    },
   
  }
  const chartData = [
    { browser: "project1", visitors: 275, fill: "var(--color-project1)" },
    { browser: "project2", visitors: 200, fill: "var(--color-project2)" },
    { browser: "project3", visitors: 287, fill: "var(--color-project3)" },
    
  ]
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])
  // const chartData = [{ browser: "project2", visitors: 200, fill: "var(--color-project2)" }]
  return (
    <Card className="flex flex-col min-h-[442px]">
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="font-semibold text-plum-1100">{userProfile.role === 4 ? "My Progress" : "Project Progress"} </div>
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
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
                        Completed
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
