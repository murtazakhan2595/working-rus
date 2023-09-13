import React, { useState } from "react";
import taskImg from "../../../assets/images/task.png";
import { TbAlertCircleFilled } from "react-icons/tb";
import TaskModal from "./TaskModal";
import { tasks, tasksTitle } from "../../../data/Data";

const TaskPlanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({})

  const updateTaskData = (data) => {
    setTaskData(data)
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="md:px-10 w-full md:mb-1 mb-5 px-5">
      <div className="flex justify-between items-center">
        <div className="flex gap-5 mb-1 items-center">
          <img src={taskImg} alt="" className="h-10 w-10" />
          <div className="text-2xl font-bold text-[#1E2022] tracking-widest">
            Task Planner
          </div>
        </div>
        <button
          onClick={openModal}
          className="rounded-md px-3 py-2 text-sm md:text-base bg-[#283b91] text-white font-montserrat whitespace-nowrap"
        >
          Add Task
        </button>
      </div>
      <div className="flex gap-6 my-2">
        <div className="text-blue-600">Ongoing</div>
        <div className="opacity-30">Overdue</div>
        <div className="opacity-30">Compeleted</div>
      </div>

      <div className="w-full overflow-x-auto  xScroll">
        <div className="w-fit md:w-full">
          <div className="flex justify-around py-3 rounded-md shadow-md bg-white text-[#283b91] text-center">
            {tasksTitle.map((column, index) => (
              <div key={index} className={`px-2 ${column.width}`}>
                {column.label}
              </div>
            ))}
          </div>
          <div className="h-[30vh] roundScroll overflow-auto mt-6">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="flex justify-around py-3 my-5 rounded-md shadow-md bg-[#eeeff7] text-[#283b91] hover:bg-[#283b91] hover:text-white transition-all duration-300 group text-center text-sm"
              >
                <div className="w-40">{task.taskName}</div>
                <div className="w-28">{task.assignBy}</div>
                <div className="w-28">{task.dueDate}</div>
                <div className="w-28">{task.status}</div>
                <div className="top-1 relative w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#2a42be] group-hover:bg-[#00ffff]"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <div className="w-28 text-center text-sm">
                  {task.priority === "high" && (
                    <TbAlertCircleFilled className="text-red-600 text-center text-2xl mx-auto" />
                  )}
                  {task.priority === "medium" && (
                    <TbAlertCircleFilled className="text-[#ffa500] text-center text-2xl mx-auto" />
                  )}
                  {task.priority === "low" && (
                    <TbAlertCircleFilled className="text-green-600 text-center text-2xl mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && <TaskModal onClose={closeModal} updateTaskData={updateTaskData} />}
    </div>
  );
};

export default TaskPlanner;
