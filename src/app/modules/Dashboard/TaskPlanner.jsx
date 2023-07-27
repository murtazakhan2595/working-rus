import React from 'react'
import { TbTargetArrow ,TbAlertCircleFilled } from "react-icons/tb";

const TaskPlanner = () => {
  return (
    <div className="px-10">
    <div className="flex gap-2 mb-1 items-center">
      <TbTargetArrow className="text-xl" />
      <div className="text-2xl">Task Planner</div>
    </div>
    <div className="flex gap-6 my-2">
      <div className="text-blue-600">Ongoing</div>
      <div className="opacity-30">Overdue</div>
      <div className="opacity-30">Compeleted</div>
    </div>
    <div className="flex justify-around py-3 rounded-md shadow-md bg-white">
      <div className="text-[#283b91] w-40 text-center">Task Name</div>
      <div className="text-[#283b91] w-28 text-center">Assign By</div>
      <div className="text-[#283b91] w-28 text-center">Due Date</div>
      <div className="text-[#283b91] w-28 text-center">Status</div>
      <div className="text-[#283b91] w-40 text-center">Progress</div>
      <div className="text-[#283b91] w-28 text-center">Priorty</div>
    </div>
    <div className="h-[30vh] roundScroll overflow-auto mt-6">
      <div className="flex justify-around py-3 my-5 rounded-md shadow-md bg-[#eeeff7]">
        <div className="text-[#283b91] w-40 text-center text-sm">Office Landing Page</div>
        <div className="text-[#283b91] w-28 text-center text-sm">Sarrah Jones</div>
        <div className="text-[#283b91] w-28 text-center text-sm">30/5/2023</div>
        <div className="text-[#283b91] w-28 text-center text-sm">Inrogress</div>
        <div className="text-[#283b91] text-center text-sm top-1 relative w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div class="absolute top-0 left-0 h-full bg-[#2a42be] w-[55%]"></div>
        </div>
        <div className="text-[#283b91] w-28 text-center text-sm"><TbAlertCircleFilled className="text-red-600 text-center text-2xl mx-auto"/></div>
      </div>

      <div className="flex justify-around py-3 my-5 rounded-md shadow-md bg-[#283b91]">
        <div className="text-white w-40 text-center text-sm">Office Landing Page</div>
        <div className="text-white w-28 text-center text-sm">Sarrah Jones</div>
        <div className="text-white w-28 text-center text-sm">30/5/2023</div>
        <div className="text-white w-28 text-center text-sm">Testing</div>
        <div className="text-white text-center text-sm top-1 relative w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div class="absolute top-0 left-0 h-full bg-[#00ffff] w-[75%]"></div>
        </div>
        <div className="text-white w-28 text-center text-sm"><TbAlertCircleFilled className="text-[#00ff0c] text-center text-2xl mx-auto"/></div>
      </div>

      <div className="flex justify-around py-3 my-5 rounded-md shadow-md bg-[#eeeff7]">
        <div className="text-[#283b91] w-40 text-center text-sm">Office Landing Page</div>
        <div className="text-[#283b91] w-28 text-center text-sm">Sarrah Jones</div>
        <div className="text-[#283b91] w-28 text-center text-sm">30/5/2023</div>
        <div className="text-[#283b91] w-28 text-center text-sm">Updates</div>
        <div className="text-[#283b91] text-center text-sm top-1 relative w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div class="absolute top-0 left-0 h-full bg-[#2a42be] w-[35%]"></div>
        </div>
        <div className="text-[#283b91] w-28 text-center text-sm"><TbAlertCircleFilled className="text-[#fcdb00] text-center text-2xl mx-auto"/></div>
      </div>

      <div className="flex justify-around py-3 my-5 rounded-md shadow-md bg-[#eeeff7]">
        <div className="text-[#283b91] w-40 text-center text-sm">Office Landing Page</div>
        <div className="text-[#283b91] w-28 text-center text-sm">Sarrah Jones</div>
        <div className="text-[#283b91] w-28 text-center text-sm">30/5/2023</div>
        <div className="text-[#283b91] w-28 text-center text-sm">Inrogress</div>
        <div className="text-[#283b91] text-center text-sm top-1 relative w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div class="absolute top-0 left-0 h-full bg-[#2a42be] w-[95%]"></div>
        </div>
        <div className="text-[#283b91] w-28 text-center text-sm"><TbAlertCircleFilled className="text-red-600 text-center text-2xl mx-auto"/></div>
      </div>

      <div className="flex justify-around py-3 my-5 rounded-md shadow-md bg-[#eeeff7]">
        <div className="text-[#283b91] w-40 text-center text-sm">Office Landing Page</div>
        <div className="text-[#283b91] w-28 text-center text-sm">Sarrah Jones</div>
        <div className="text-[#283b91] w-28 text-center text-sm">30/5/2023</div>
        <div className="text-[#283b91] w-28 text-center text-sm">Inrogress</div>
        <div className="text-[#283b91] text-center text-sm top-1 relative w-40 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div class="absolute top-0 left-0 h-full bg-[#2a42be] w-[25%]"></div>
        </div>
        <div className="text-[#283b91] w-28 text-center text-sm"><TbAlertCircleFilled className="text-red-600 text-center text-2xl mx-auto"/></div>
      </div>

    </div>
  </div>
  )
}

export default TaskPlanner