import React from "react";
import team from "../../../../assets/images/team.png";
import service from "../../../../assets/images/service.png";
import talent from "../../../../assets/images/talent.png";
import taskMgt from "../../../../assets/images/taskMgt.png";
import pay from "../../../../assets/images/pay.png";
import people from "../../../../assets/images/people.png";
import personal from "../../../../assets/images/personal.png";
import leave from "../../../../assets/images/leave.png";
import performance from "../../../../assets/images/performance.png";
import reports from "../../../../assets/images/reports.png";
import { IoIosSearch } from "react-icons/io";

const images = [
  { src: team, title: "People Team" },
  { src: service, title: "Self Service" },
  { src: talent, title: "Talent Spere" },
  { src: taskMgt, title: "Task Management" },
  { src: pay, title: "Pay and Attendance" },
  { src: people, title: "People Engagement" },
  { src: personal, title: "Personal Development" },
  { src: leave, title: "Leave Tracker" },
  { src: performance, title: "Performance" },
  { src: reports, title: "Reports" },
];

const Services = () => {
  return (
    <div className="bg-[#f0f1f2]">
      <div className="flex justify-between pl-10 pr-3 py-7">
        <h2 className="font-lato text-xl font-bold text-baseGray">
          All Services
        </h2>
        <div className="relative">
          <IoIosSearch className="absolute top-2 left-2" />
          <input
            type="search"
            placeholder="Search"
            className="focus:outline-none focus:border-none py-1 pl-10 border-none w-60 rounded-md text-right"
            style={{ direction: "ltr" }}
          />
        </div>
      </div>
      <div className="bg-white h-screen rounded-lg ml-6">
        <div className="flex justify-center h-96 flex-wrap w-full gap-3 px-2 py-3">
          {images.map((item, index) => (
            <div
              className="flex flex-col items-center justify-center w-[18.5%] bg-[#FAFBFC] shadow-card rounded-xl p-3"
              key={index}
            >
              <img
                src={item.src}
                alt={item.title}
                className="max-w-full mb-2"
              />
              <h3 className="text-center font-lato text-[20px] font-normal text-[#323333]">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
