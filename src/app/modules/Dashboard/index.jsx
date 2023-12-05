import { useState } from "react";
import { connect } from "react-redux";
import WorkTime from "./WorkTime";
import TodoList from "./Todolist";
import { IoIosSearch } from "react-icons/io";
import { MdMail } from "react-icons/md";
import { BsBell } from "react-icons/bs";
import TaskPlanner from "./TaskPlanner";
import NotificationBox from "./NotificationBox";
import Calendar from "./Calender";
import "./index.css";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import DailyTaskRpt from "./DailyTaskRpt";

const Dashboard = ({ isSidebarOpen, userProfile }) => {
  const [isBarOpen, seIsBarOpen] = useState(false);
  return (
    <>
      {/* ##########################   First Column   ########################## */}

      <div
        className={`bg-[#f9f9f9] h-screen overflow-y-auto overflow-x-hidden scroll ${isSidebarOpen ? "3xl:w-[67%] xl:w-[64%] w-[100%]" : "3xl:w-[79%] xl:w-[78%] w-[100%]"
          }`}
      >
        {/***********************   Dashboard Header   **********************************/}
        <div className="py-8 px-10 flex gap-3  items-center justify-center md:justify-start">
          <h1 className="text-3xl leading-none font-semibold  opacity-80 tracking-widest">
            <Link to="/login">
              DashBoard
            </Link>
          </h1>
          <div className="relative">
            <IoIosSearch className="absolute top-2 left-3 text-white" />
            <input
              type="search"
              placeholder="Search"
              className="focus:outline-none focus:border-non bg-gray-200 py-1 pl-8 pr-4 text-white placeholder-white border-none  md:flex lg:w-64 xs:w-[12.5rem] hidden rounded-md"
            />
          </div>
        </div>

        {/* **********************   Bar   ********************************* */}
        <div
          className={`bg-[#ebebeb] ml-10 rounded-s-lg mb-6 pr-1 pl-5 gap-3  justify-between py-2  ${isBarOpen ? "flex" : "hidden"
            }`}
        >
          <div className="flex gap-[1.2rem] flex-wrap">
            <div className="flex bg-[#f7f7f8] w-44 md:w-auto px-2 py-1 gap-3 items-center rounded-lg">
              <div>Total Employees</div>
              <div className="text-2xl text-[#283b91]">368</div>
            </div>

            <div className="flex bg-[#f7f7f8] w-44 md:w-auto px-2 py-1 gap-3 items-center rounded-lg">
              <div>Total Leaves</div>
              <div className="text-2xl text-[#283b91]">11</div>
            </div>

            <div className="flex bg-[#f7f7f8] w-44 md:w-auto px-2 py-1 gap-3 items-center rounded-lg">
              <div>Attendance</div>
              <div className="text-2xl text-[#283b91]">75%</div>
            </div>

            <div className="flex bg-[#f7f7f8] w-44 md:w-auto px-2 py-1 gap-3 items-center rounded-lg">
              <div>Total Clients</div>
              <div className="text-2xl text-[#283b91]">15</div>
            </div>
          </div>
          <div className="flex text-[#f7f7f8] px-2 py-1 justify-self-end items-center rounded-lg">
            <IoIosArrowForward
              className="text-3xl"
              onClick={() => {
                seIsBarOpen(!isBarOpen);
              }}
            />
          </div>
        </div>

        {/* **********************   Todos List & Working Time   ********************************* */}
        {/* <div className="flex 2xl:flex-row sm:flex-row flex-col-reverse justify-between sm:mr-14 xl:self-end xl:items-end"> */}
        <div className="flex  md:flex-row xs:flex-col-reverse justify-between md:mr-14 m-1 lg:mr-1 xl:self-end xl:items-start">
          {/***********************   Todos List   **********************************/}
          <TodoList isSidebarOpen={isSidebarOpen} />
          {/***********************   Working Time   **********************************/}
          <div
            className={`flex flex-col w-full md:pr-8 self-start gap-2 items-center md:items-end ${isSidebarOpen ? "" : "3xl:ml-20"
              }`}
          >
            <WorkTime />
          </div>
        </div>
        {/* ******************** Daily Task Report**************/}
        <DailyTaskRpt />
        {/***********************   Task Planner   **********************************/}
        <TaskPlanner />
      </div>

      {/* ##########################   Second Column   ########################## */}

      <div className="scroll relative flex-col xl:flex hidden h-screen overflow-y-auto 3xl:w-[22%] z-10 xl:w-[23%] bg-[#f2f2f2]">
        {/***********************   ProFile Header   **********************************/}
        <div className="flex pt-3 pb-1 justify-end px-5 items-center gap-3">
          <div className="text-3xl w-10 h-10 rounded-full border bg-white"></div>{" "}
          <div className=" text-[#283b91]">{userProfile.username}</div>
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

      </div>
      <button
        className={`absolute bg-[#283b91] z-0 text-white px1 md:pr-1 py-3 right-0 3xl:right-[21.8%] xl:right-[22.3%] rounded-s-lg top-[3rem] mt-4 ml-4  ${isBarOpen ? "hidden" : ""
          }`}
        onClick={() => {
          seIsBarOpen(!isBarOpen);
        }}
      >
        {isBarOpen ? "" : <IoIosArrowBack className="text-3xl" />}
      </button>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(Dashboard);
