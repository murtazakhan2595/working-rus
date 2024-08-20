import { getAllTasks, getAllProjects,getAllLabels } from "app/hooks/taskManagment";
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
      if (isMounted && tasksData) {
          let filterTasks = tasksData;
          if (userProfile.role === 2 || userProfile.role === 4) {
            filterTasks = tasksData.filter(
              (task) =>
                task.assigned_to.includes(Number(userProfile.id)) ||
                task.assigned_by === Number(userProfile.id)
            );
          }
          console.log("mergedResult ---", filterTasks);
        const mergedResult = mergeTasksWithProjects(filterTasks, projects);
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
    <div className="px-[14px] py-6 bg-white rounded-md min-h-[470px]">
      {openCreateCard && (
        <CreateCardModal
          onClose={() => {
            setOpenCreateCard(false);
            fetchTasks(true, AllProjects);
          }}
          projects={AllProjects}
        />
      )}
      <div className="flex flex-col gap-2">
        <header className="justify-between items-center inline-flex">
          <div className="text-[#323233] text-lg font-normal leading-tight">
            My Tasks
          </div>
          <div className="justify-start items-center gap-1 flex">
            <div className="text-[#323233] text-xs font-bold">Create New</div>
            <button
              className="p-2 rounded-md bg-black"
              style={{ fontSize: "12px" }}
              onClick={() => {
                setOpenCreateCard(true);
              }}
            >
              <FaPlus className="text-white" />
            </button>
          </div>
        </header>
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <div className="h-[34px] px-3.5 py-0.5 bg-[#f0f1f2] rounded-[5px] justify-start items-center gap-2.5 inline-flex">
              <div className="text-[#060606] text-xs font-normal">
                {filterOption.name || filterOption}
              </div>
              <CustomDropdown
                isOpen={isDropdownOpen}
                toggleDropdown={toggleDropdown}
                options={options}
              />
            </div>
            <div className="h-[34px] px-3.5 py-0.5 bg-[#f0f1f2] rounded-[5px] justify-start items-center gap-2.5 inline-flex">
              <div className="text-[#060606] text-xs font-normal">{`${statusFilter?statusFilter:"Status"}`}</div>
              <CustomDropdown
                isOpen={isStatusDropdownOpen}
                toggleDropdown={toggleStatusDropdown}
                options={statusDropdownOptions}
              />
            </div>
          </div>
        </div>
        <div className="max-h-[270px] overflow-y-auto">
          {tasks.length > 0 ?
            (tasks.map((task) => <RenderTask key={task.id} task={task} />)):
            <div className="text-[#5c5e64] text-sm font-normal text-center">
              No tasks found
            </div>
          }
        </div>
      </div>
    </div>
  );
}

const RenderTask = ({ task }) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex-col justify-start items-start gap-[5px] inline-flex">
          <div className="justify-center items-center gap-[5px] inline-flex">
            <div className="w-2 h-2 bg-[#5640df] rounded-full" />
            <div className="text-[#5c5e64]/80 text-xs font-normal">
              {task.project_name}
            </div>
          </div>
          <div className="text-[#060606] text-sm font-bold max-w-[165px] overflow-hidden text-ellipsis">
            {task.name}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 items-center">
            <div className="flex -space-x-2.5">
              <MembersList members={task?.assigned_to} />
            </div>
          </div>
          {task?.end_date && (
            <div
              className={`flex gap-1 justify-center items-center text-sm px-1.5 py-1 rounded ${getStatusClass(
                task?.end_date
              )}`}
            >
              <TimeIcon color={getStatusIconColor(task?.end_date)} />
              <div className="my-auto">
                {moment(task?.end_date).format("MMMM DD")}
              </div>
            </div>
          )}
          {
            PriorityListIcons.find((option) => option.value === task?.priority)
              ?.label
          }
        </div>
      </div>
      <div className="h-[0px] border border-[#dadada] my-2.5"></div>
    </div>
  );
};
