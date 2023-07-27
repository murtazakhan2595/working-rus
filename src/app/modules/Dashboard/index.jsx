import WorkTime from "./WorkTime";
import TodoList from "./Todolist";
import { IoIosSearch } from "react-icons/io";
import { MdMail } from "react-icons/md";
import { BsBell } from "react-icons/bs";
import TaskPlanner from "./TaskPlanner";
import NotificationBox from "./NotificationBox";
import Calendar from "./Calender";
import UpcomingProjects from "./UpcomingProjects";
const Dashboard = ({isSidebarOpen}) => {
  return (
    <>
      {/* ##########################   First Column   ########################## */}

      <div className={`bg-[#f9f9f9] h-screen overflow-y-auto `} style={{width:isSidebarOpen? '64%' :"calc(64% + 16rem)"}}>
        {/***********************   Dashboard Header   **********************************/}
        <div className="py-8 px-10 flex gap-3 w-[100%] items-center">
          <h1 className="text-4xl font-semibold opacity-80">Dashboard</h1>
          <div className="relative">
            <IoIosSearch className="absolute top-2 left-3 text-white" />
            <input
              type="search"
              placeholder="Search"
              className="focus:outline-none focus:border-non bg-gray-200 py-1 pl-8 pr-4 text-white placeholder-white border-none w-64 rounded-md"
            />
          </div>
        </div>
        {/* **********************   Todos List & Working Time   ********************************* */}
        <div className="flex flex-row gap-4 mx-auto  items-end">
          {/***********************   Todos List   **********************************/}

          <TodoList />
          {/***********************   Working Time   **********************************/}
          <div className={`flex flex-col justify-center gap-2 items-center ${isSidebarOpen ? "" : "ml-[8.8rem]"}`}>
            <h1 className="font-semibold">Work Time</h1>
            <WorkTime />
          </div>
        </div>
        {/***********************   Task Planner   **********************************/}
        <TaskPlanner />
      </div>

      {/* ##########################   Second Column   ########################## */}
      <div className="scroll flex flex-col h-screen overflow-y-auto w-[22%] bg-[#f2f2f2]">
        {/***********************   ProFile Header   **********************************/}
        <div className="flex pt-3 pb-1 justify-end px-5 items-center gap-3">
          <div className="text-3xl w-10 h-10 rounded-full border bg-white"></div>{" "}
          <div className="text-blue-700">Jhone Simth</div>
        </div>
        <div className="flex pt-1 pb-2 justify-end px-5 items-center">
          <div className="p-2 rounded-bl-md rounded-tl-md flex  text-white bg-[#ebebeb]">
            <MdMail className="text-xs" />
          </div>
          <div className="p-2 rounded-br-md rounded-tr-md flex  text-white bg-[#283b91]">
            <BsBell className="text-xs" />
          </div>
        </div>
        {/***********************   Notification Box   **********************************/}
        <NotificationBox />
        {/***********************   Calender   **********************************/}
        <Calendar />
        {/***********************   Upcoming Projects   **********************************/}

        <UpcomingProjects />
      </div>
    </>
  );
};

export default Dashboard;
