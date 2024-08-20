import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import Chart from "react-apexcharts";
import { Col, Row } from "reactstrap";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllTasks } from "app/hooks/taskManagment";
import CustomDropdown from "./CustomDropdown";
import { getAllProjects } from "app/hooks/taskManagment";

export default function TaskProgress() {
  const [taskLabels, setTaskLabels] = useState({
    delayed: { count: 0, labelInfo: {} },
    ongoing: { count: 0, labelInfo: {} },
    completed: { count: 0, labelInfo: {} },
    total: 0,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [options, setOptions] = useState([]);
      const [AllProjects, setAllProjects] = useState([]);
const [filterOption, setFilterOption] = useState("All");

  const userProfile = useSelector((state) => state.user.userProfile);

const categorizeTasks = (tasks) => {
  // Initialize an empty object to store categorized tasks
  const categories = {
    delayed: { count: 0, labelInfo: {} },
    ongoing: { count: 0, labelInfo: {} },
    completed: { count: 0, labelInfo: {} },
    total: tasks.length,
  };

  tasks.forEach((task) => {
    const labelName = task.label.name.toLowerCase();
    const labelInfo = { name: task.label.name, color: task.label.color };

    if (categories[labelName]) {
      categories[labelName].count += 1;
      categories[labelName].labelInfo = labelInfo; // Update label info dynamically
    }
  });

  return categories;
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filter =
          filterOption === "All"
            ? {}
            : { filterData: { project_id: [filterOption.id] } };
        const response = await getAllTasks(filter);
        const projectsData = await getAllProjects({}, userProfile);
        if (response && projectsData.results) {
          const categorizedTasks = categorizeTasks(response);
          setAllProjects(projectsData.results);
          console.log("Categorized Task Data:", categorizedTasks);
          setTaskLabels(categorizedTasks);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filterOption]);
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
        label: "All",
        onClick: () => {
          setIsDropdownOpen(false);
          setFilterOption("All");
        },
      });

      setOptions(dynamicOptions);
    }, [AllProjects]);
  const chartOptions = {
    chart: {
      type: "donut",
    },
    colors: [
      taskLabels?.completed?.labelInfo.color || "#1A932E",
      taskLabels.delayed.labelInfo.color || "#E5AE21",
      taskLabels.ongoing.labelInfo.color || "#E65F2B",
      "[#fff]",
    ],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        donut: {
          size: "88%",
        },
      },
    },
    fill: {
      colors: [
        taskLabels?.completed?.labelInfo.color || "#1A932E",
        taskLabels.delayed.labelInfo.color || "#E5AE21",
        taskLabels.ongoing.labelInfo.color || "#E65F2B",
        "[#fff]",
      ],
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false, // Disable tooltips
    },
  };

const calculateSegmentValues = (taskLabels) => {
  const totalTasks = taskLabels.total;
  const completedCount = taskLabels.completed.count;
  const delayedCount = taskLabels.delayed.count;
  const ongoingCount = taskLabels.ongoing.count;

  // Calculate the remaining tasks
  const remainingCount =
    totalTasks - (completedCount + delayedCount + ongoingCount);

  // Calculate percentages for each segment
  const completedPercentage = (completedCount / totalTasks) * 100;
  const delayedPercentage = (delayedCount / totalTasks) * 100;
  const ongoingPercentage = (ongoingCount / totalTasks) * 100;
  const remainingPercentage =
    remainingCount > 0 ? (remainingCount / totalTasks) * 100 : 0;

  return [
    completedPercentage,
    delayedPercentage,
    ongoingPercentage,
    remainingPercentage,
  ];
};
const toggleDropdown = () => {
  setIsDropdownOpen(!isDropdownOpen);
};
  return (
    <div className="p-[18px] bg-white rounded-[5px]  h-full">
      <header className="justify-between items-center inline-flex w-full">
        <div className="text-[#323233] text-lg font-normal leading-tight">
          {userProfile.role === 4 ? "My Progress" : "Task Progress"}
        </div>
        <div className="justify-start items-center gap-1 flex">
          <button onClick={toggleDropdown}>
            <div className="flex gap-1.5 justify-center px-2.5 py-2 my-auto text-xs leading-5 text-black rounded items-center ">
              <div className="grow my-auto">
                {filterOption.name || filterOption}
              </div>
              <FaChevronDown size={11} />
            </div>
            <CustomDropdown
              isOpen={isDropdownOpen}
              toggleDropdown={toggleDropdown}
              options={options}
              iconVisible={false}
              right={false}
              className={"-top-1 right-0"}
            />
          </button>
        </div>
      </header>
      <div className="relative mt-6">
        <div className="h-[100px] overflow-hidden">
          <Chart
            options={chartOptions}
            series={calculateSegmentValues(taskLabels)}
            type="donut"
            width="100%"
            height="200px"
          />
          <div className="flex items-center flex-col absolute top-[34px] left-1/2 -translate-x-1/2 ">
            <div className="text-[#060606] text-[28px] font-normal tracking-tight">
              {taskLabels.completed.count === 0
                ? "0%"
                : Math.round(
                    (taskLabels.completed.count / taskLabels.total) * 100
                  ) + "%"}
            </div>
            <div className="w-[72px] text-center text-[#9a9a9a] text-sm font-normal tracking-tight">
              Completed
            </div>
          </div>
        </div>
        <Row>
          <TotalCount
            count={taskLabels.total}
            label="Total tasks"
            textColor={"text-[#060606]"}
          />
          <TotalCount
            count={taskLabels.completed.count}
            label="Completed"
            textColor={`text-[${taskLabels?.completed?.labelInfo.color}]`}
          />
          <TotalCount
            count={taskLabels.delayed.count}
            label="Delayed"
            textColor={`text-[${taskLabels?.delayed?.labelInfo.color}]`}
          />
          <TotalCount
            count={taskLabels.ongoing.count}
            label="On going"
            textColor={`text-[${taskLabels?.ongoing?.labelInfo.color}]`}
          />
        </Row>
      </div>
    </div>
  );
}

const TotalCount = ({ count, label, textColor }) => {
  return (
    <Col className="overflow-hidden">
      <div className={`${textColor} text-[20px] font-normal tracking-tight`}>
        {count}
      </div>
      <div className="text-[#797979] text-sm font-normal font-['Lato']">
        {label}
      </div>
    </Col>
  );
};
