import React from 'react'
import { SiPowerpages } from "react-icons/si";
import { FaListUl } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { IoChatbubbles } from "react-icons/io5";
import project1 from "../../../assets/images/upcomingProject1.png";
import project2 from "../../../assets/images/upcomingProject2.png";
import project3 from "../../../assets/images/upcomingProject3.png";




const UpcomingProjects = () => {
  return (
    <>
     <div className="flex w-[90%] mb-5 mx-auto rounded-lg justify-between bg-[#ebebeb] ">
          <div
            className="py-1 flex items-center justify-center
            px-8 rounded-lg bg-[#25a8e0]"
          >
            <FaListUl className="  text-white" />
          </div>
          <div className="py-1 px-8 rounded-lg">
            <AiFillStar className="text-xl text-white " />
          </div>
          <div className="py-1 px-8 rounded-lg">
            <IoChatbubbles className="text-xl  text-white " />
          </div>
        </div>
    <div className="flex flex-col mb-3 w-[95%] px-3 shadow-lg py-3 bg-white rounded-lg mx-auto justify-center">
    <div className="mb-5 text-sm font-medium">Upcoming Projects</div>
    <div className="flex pb-3 items-center border-b gap-4">
      <img src={project1} alt=""/>
      <div className="flex flex-col gap-1">
        <div className="text-xs font-medium">Landing Page Design</div>
        <div className="text-xs opacity-60">From 16 February to 18 February</div>
      </div>
    </div>
    <div className="flex pb-3 my-3 items-center border-b gap-4">
    <img src={project2} alt=""/>
      <div className="flex flex-col gap-1">
        <div className="text-xs font-medium">Weekly Meeting With Designers</div>
        <div className="text-xs opacity-60">From 21 February to 25 February</div>
      </div>
    </div>
    <div className="flex pb-3 items-center border-b gap-4">
    <img src={project3} alt=""/>
      <div className="flex flex-col gap-1">
        <div className="text-xs font-medium">Finalizing Components</div>
        <div className="text-xs opacity-60">From 28 February to 30 February</div>
      </div>
    </div>
  </div>
  </>
)
}

export default UpcomingProjects