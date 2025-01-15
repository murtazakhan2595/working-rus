// / done
import { getAllTasks, getAllProjects } from "app/hooks/taskManagment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getStatusClass,
  getStatusIconColor,
} from "app/modules/TaskManagment/Boards/Sections";
import moment from "moment";
import { PriorityListIcons } from "data/Data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card.jsx";
import { Button } from "../../../../components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { cn } from "../../../../src/@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../src/@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../../../src/@/components/ui/popover";

import CustomTable from "components/CustomTable";
// import { Status } from "app/modules/LeaveManagment/Sections";

export default function MyTasks() {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [AllProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("All Projects");
  const [options, setOptions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(false);
  const [value, setValue] = React.useState("");

  function mergeTasksWithProjects(tasks, projects) {
    return tasks?.results?.map((task) => {
      const project = projects.find((proj) => proj.id === task.project_id);
      return {
        ...task,
        project_name: project ? project.name : "Unknown Project",
      };
    });
  }

  const fetchProjects = async (isMounted) => {
    setIsLoading(true);
    try {
      const projectsData = await getAllProjects({ filterData }, userProfile);
      if (isMounted && projectsData.results) {
        setAllProjects(projectsData?.results);
        fetchTasks(isMounted, projectsData.results);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const fetchTasks = async (isMounted, projects) => {
    setIsLoading(true);
    try {
      const filter =
        filterOption === "All Projects"
          ? {}
          : { filterData: { project_id: [filterOption.id] } };
      const tasksData = await getAllTasks(filter);
      if (isMounted) {
        const mergedResult = mergeTasksWithProjects(tasksData, projects);
        setTasks(mergedResult);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchProjects(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);


  useEffect(() => {
    const dynamicOptions = AllProjects?.map((project) => ({
      label: project.name,
      onClick: () => {
        setIsDropdownOpen(false);
        setFilterOption(project);
      },
    }));

    dynamicOptions.unshift({
      label: "All Projects",
      onClick: () => {
        setIsDropdownOpen(false);
        setFilterOption("All Projects");
      },
    });

    setOptions(dynamicOptions);
  }, [AllProjects]);


  useEffect(() => {
    if (AllProjects.length > 0) {
      fetchTasks(true, AllProjects);
    }
  }, [filterOption, AllProjects]);

  const statusDropdownOptions = [
    {
      label: "Completed",
      onClick: () => {
        setStatusFilter("completed");
        setIsStatusDropdownOpen(false);
      },
    },
    {
      label: "Delayed",
      onClick: () => {
        setStatusFilter("delayed");
        setIsStatusDropdownOpen(false);
        setIsStatusDropdownOpen(false);
      },
    },
    {
      label: "On going",
      onClick: () => {
        setStatusFilter("on going");
        setIsStatusDropdownOpen(false);
        setIsStatusDropdownOpen(false);
      },
    },
  ];

  return (
    <>
      <Card className="">
        <CardHeader className="items-start pb-0">
          <CardTitle className="flex flex-row justify-between w-full">
            <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
              My Tasks
            </div>
            
            <div className="flex items-center gap-3">
            <Popover open={openStatus} onOpenChange={setOpenStatus}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openStatus}
                  className="w-[110px] justify-between rounded-sm text-neutral-1000 h-fit border-neutral-500 hover:border-primary-200 hover:shadow-none hover:text-primary-1100 hover:bg-primary-200"
                >
                  {value ? value : "Status"} 
                  <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-w-[2000px] p-0">
                <Command>
                  <CommandInput placeholder="Search status..." />
                  <CommandList>
                    <CommandEmpty>No status found.</CommandEmpty>
                    <CommandGroup>
                      {statusDropdownOptions.map((option) => (
                        <CommandItem
                          key={option.label}
                          value={option.label}
                          onSelect={() => {
                            option.onClick();
                            setValue(option.label);
                            setOpenStatus(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value === option.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
              </Popover>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[110px] justify-between rounded-sm text-neutral-1000 h-fit border-neutral-500 hover:border-primary-200 hover:shadow-none hover:text-primary-1100 hover:bg-primary-200"
                >
                  {selectedProject ? selectedProject : "Projects"}
                  <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search project..." />
                  <CommandList>
                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.label}
                          value={option.label}
                          onSelect={() => {
                            option.onClick();
                            setSelectedProject(option.label);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedProject === option.label
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            </div>
            
           
             
           
          </CardTitle>
          
        </CardHeader>
        <CardContent>
          {tasks?.length > 0 ? (
            <RenderTask tasks={tasks} />
          ) : (
            <div>No tasks available.</div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

const getStatusLabel = (status) => {
  switch (status) {
    case "complete":
      return "Complete";
    case "in_progress":
      return "In Progress";
    case "delay":
      return "Delay";
    case "pending":
      return "Pending";
    default:
      return "In Progress";
  }
};
function RenderTask({ tasks }) {
  return (
    <CustomTable
      showHeader={false}
      pagination={false}
      columns={[
        {
          text: "Title",
          dataField: "name",
          formatter: (cell, render) => (
            <div className="flex flex-col w-full gap-2">
              <div className="flex flex-row w-full gap-4">
                <div className="font-semibold text-neutral-1200">
                  {render.name}
                </div>
                <div className="bg-mauve-600 text-nowrap text-mauve-1000 text-xs font-medium me-2 px-2 py-2 h-[22px] rounded-full border border-mauve-500 flex items-center justify-center">
                  {getStatusLabel(render.status)}
                </div>
              </div>
              <div className="text-neutral-1000">
                Due on {moment(render?.due_date).format("MMMM DD")} - Created by
                Name of employee
              </div>
            </div>
          ),
        },
        {
          text: "View Project",
          formatter: (cell, render) => (
            <Button
              variant="outline"
              size="sm"
              className="rounded-sm font-semidbold"
            >
              <Link to={`project-board/${render?.project_id}`}>View Task</Link>
            </Button>
          ),
        },
        // {
        //   text: "Action",
        //   formatter: () => (
        //     <DropdownMenu>
        //       <DropdownMenuTrigger asChild>
        //         <Button aria-haspopup="true" size="icon" variant="ghost">
        //           <MoreHorizontal className="w-4 h-4" />
        //           <span className="sr-only">Toggle menu</span>
        //         </Button>
        //       </DropdownMenuTrigger>
        //       <DropdownMenuContent align="end">
        //         <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //         <DropdownMenuItem>Edit</DropdownMenuItem>
        //         <DropdownMenuItem>Delete</DropdownMenuItem>
        //       </DropdownMenuContent>
        //     </DropdownMenu>
        //   ),
        // },
      ]}
      data={tasks?.slice(0, 5).map((task) => ({
        ...task,
        due_date: moment(task.due_date).format("MMMM D, YYYY"),
        priority_icon: PriorityListIcons[task.priority],
        status_class: getStatusClass(task.status),
        status_icon_color: getStatusIconColor(task.status),
      }))}
      options={{
        filtering: true,
        exportButton: true,
        grouping: true,
        actionsColumnIndex: -1,
      }}
    />
  );
}
