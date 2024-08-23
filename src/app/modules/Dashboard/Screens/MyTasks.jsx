import { getAllTasks, getAllProjects } from "app/hooks/taskManagment";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MembersList } from "app/modules/TaskManagment/Sections";
import {
  getStatusClass,
  getStatusIconColor,
} from "app/modules/TaskManagment/Boards/Sections";
import moment from "moment";
import { PriorityListIcons } from "data/Data";
import { TimeIcon } from "@mui/x-date-pickers";
import CustomDropdown from "./CustomDropdown";
import CreateCardModal from "./CreateCardModal";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardSubtitle } from "../../../../src/@/components/ui/card";
import { Button } from '../../../../components/ui/button';
import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"
import { cn } from "../../../../src/@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../../../src/@/components/ui/command"
import { Popover, PopoverTrigger, PopoverContent } from "../../../../src/@/components/ui/popover";

import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "../../../../src/@/components/ui/table";
export default function MyTasks() {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [AllProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("All Projects");
  const [options, setOptions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [openCreateCard, setOpenCreateCard] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [open, setOpen] = React.useState(false)
  const [openStatus, setOpenStatus] = React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState(false)
  const [value, setValue] = React.useState("")
  

  function mergeTasksWithProjects(tasks, projects) {
    return tasks.map((task) => {
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
        setAllProjects(projectsData.results);
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
    console.log(AllProjects);
    const dynamicOptions = AllProjects.map((project) => ({
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

  console.log(options)


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
      },
    },
    {
      label: "On going",
      onClick: () => {
        setStatusFilter("on going");
         setIsStatusDropdownOpen(false);
      },
    },
  ];
    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
    const toggleStatusDropdown = () => {
      setIsStatusDropdownOpen(!isStatusDropdownOpen);
    };

  return (
    <>
    <Card className="col-span-2">
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="font-semibold text-plum-1100">My Tasks</div>
       <Button variant="secondary">
            <Link to="#" onClick={() => {
                setOpenCreateCard(true);
              }}>
              Add New Task</Link>
          </Button>
        </CardTitle>
        <div  className="flex flex-row justify-end w-full gap-4"> 
        

<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="w-[200px] justify-between"
    >
      {selectedProject ? selectedProject : "Select Project..."}
      <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-[200px] p-0">
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
                  selectedProject === option.label ? "opacity-100" : "opacity-0"
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

    
    <Popover open={openStatus} onOpenChange={setOpenStatus}>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={openStatus}
      className="w-[200px] justify-between"
    >
      {value ? value : "Select Status..."}
      <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-[200px] p-0">
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
                  value === option.label ? "opacity-100" : "opacity-0"
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
      </CardHeader>
      <CardContent>
      <div className="">
  {tasks.length > 0 ? (
    tasks.slice(0, 5).map((task) => <RenderTask key={task.id} task={task} />)
  ) : (
    <div className="text-[#5c5e64] text-sm font-normal text-center">
      No tasks found
    </div>
  )}
</div>

      </CardContent>
     
    </Card>
    {/* <div className="px-[14px] py-6 bg-white rounded-md min-h-[470px]">
Task */}
      
      {openCreateCard && (
        <CreateCardModal
          onClose={() => {
            setOpenCreateCard(false);
            fetchTasks(true, AllProjects);
          }}
          projects={AllProjects}
        />
      )}
    
    </>
  );
}
const getStatusLabel = (status) => {
  switch (status) {
    case 'complete':
      return 'Complete';
    case 'in_progress':
      return 'In Progress';
    case 'delay':
      return 'Delay';
    case 'pending':
      return 'Pending';
    default:
      return 'In Progress';
  }
};

const RenderTask = ({ task }) => {
  return (
    <>
      <Table className="overflow-hidden">
        <TableBody>
          <TableRow>
            <TableCell className="">
              <div className="flex flex-col w-full gap-2">
              <div className="flex flex-row w-full gap-4">
                <div className=" font-base">{task.project_name}</div>
                <div className="bg-mauve-600 text-nowrap text-mauve-1000 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full border border-mauve-500">{getStatusLabel(task.status)}</div>
              </div>
              <div className="text-mauve-900">
                Due on {moment(task?.end_date).format("MMMM DD")}  - Created by  Name of employee
              </div>
              </div>
              
            </TableCell>
            
            
            <TableCell className="w-[200px]">
             <Button variant="outline">
             <Link to="#">
             View Project</Link>
             </Button>
            </TableCell>
            <TableCell className="w-[200px] text-center">
              {PriorityListIcons.find((option) => option.value === task?.priority)?.label}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

