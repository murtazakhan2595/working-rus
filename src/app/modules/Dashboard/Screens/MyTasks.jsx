// / done
import { getAllTasks, getAllProjects } from "app/hooks/taskManagment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EmployeeName } from "utils/getValuesFromTables";
import {
  getStatusClass,
  getStatusIconColor,
} from "app/modules/TaskManagment/Boards/Sections";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card.jsx";
import { Button } from "../../../../components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { getDropdownList } from "utils/Lists.js";
import { cn } from "../../../../src/@/lib/utils";
import TaskStatusLabel from "app/modules/TaskManagment/Sections/TaskStatus";

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
import { TaskStatus } from "data/Data";

import CustomTable from "components/CustomTable";
import { SelectInputComponent } from "components/FormControl";

export default function MyTasks() {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [AllProjects, setAllProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState({
    assigned_to: [userProfile.id],
    is_subtask: [false],
    is_archive: [false],
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projectSelected, setProjectSelected] = useState("All Projects");
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
      const projectsData = await getAllProjects(
        {
          filterData:
            userProfile.role === 2 || userProfile.role === 4
              ? { project_members: [userProfile.id] }
              : {},
        },
        userProfile
      );
      if (isMounted && projectsData.results) {
        setAllProjects(
          getDropdownList(projectsData?.results, "name", "id", null, null, {
            label: "All Projects",
            value: "All Projects",
          })
        );
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const fetchTasks = async (isMounted) => {
    setIsLoading(true);
    try {
      const tasksData = await getAllTasks({ filterData });
      if (isMounted) {
        // const mergedResult = mergeTasksWithProjects(tasksData, projects);
        setTasks(tasksData);
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
  }, []);

  useEffect(() => {
    const dynamicOptions = AllProjects?.map((project) => ({
      label: project.name,
      onClick: () => {
        setIsDropdownOpen(false);
        setProjectSelected(project);
      },
    }));

    dynamicOptions.unshift({
      label: "All Projects",
      onClick: () => {
        setIsDropdownOpen(false);
        setProjectSelected("All Projects");
      },
    });

    setOptions(dynamicOptions);
  }, [AllProjects]);

  useEffect(() => {
    let isMounted = true;
    fetchTasks(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);

  const handleFilterChange = (filterName, filterValue) => {
    debugger;
    const updatedFilters = { ...filterData };

    if (filterValue) {
      // Update end_date with the provided value
      updatedFilters[filterName] = [filterValue];
    } else {
      // Remove end_date if the filterValue is null
      delete updatedFilters[filterName];
    }
    // Update the filter data
    setFilterData(updatedFilters);
    return;
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="items-start pb-0">
          <CardTitle className="flex flex-row justify-between w-full">
            <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
              My Tasks
            </div>

            <div className="flex items-center gap-3">
              <SelectInputComponent
                name="status"
                options={TaskStatus}
                value={filterData.status?.[0]}
                showLabel={false}
                placeholder="Select Status"
                onChange={(field, value) => {
                  handleFilterChange(field, value);
                }}
                className="w-fit"
              />
              <SelectInputComponent
                name="project_id"
                options={AllProjects}
                value={filterData.project_id?.[0] || "All Projects"}
                showLabel={false}
                placeholder="Select Project"
                onChange={(field, value) => {
                  if (value === "All Projects") handleFilterChange(field, null);
                  else handleFilterChange(field, value);
                }}
                className="w-fit"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasks?.count > 0 ? (
            <RenderTask tasks={tasks} />
          ) : (
            <div>No tasks available.</div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function RenderTask({ tasks }) {
   const navigate = useNavigate();
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
                <div className=" text-sm font-semibold text-neutral-1200 py-1 text-capitalize">
                  {render.name}
                </div>
                <TaskStatusLabel status={render.status} />
              </div>
              <div className="text-neutral-1000">
                {render?.end_date
                  ? `Due on ${moment(render?.end_date).format("MMMM DD")} - `
                  : ""}
                Created by <EmployeeName value={render?.assigned_by} />
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
              onClick={() =>
                navigate(`/project-board/card/${render.id}`, {
                  state: {
                    GOTO_URLS: `/`,
                  },
                })
              }
            >
              {/* <Link to={`project-board/${render?.project_id}/${render.id}`}> */}
                View Task
              {/* </Link> */}
            </Button>
          ),
        },
      ]}
      data={tasks?.results || []}
      options={{
        filtering: true,
        exportButton: true,
        grouping: true,
        actionsColumnIndex: -1,
      }}
    />
  );
}
