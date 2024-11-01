import { RxCross2 } from "react-icons/rx"
import { IoCalendarOutline } from "react-icons/io5";
import { PiHeadlightsBold, PiUsersLight } from "react-icons/pi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { TbCircleDashed } from "react-icons/tb";
import { CiViewBoard } from "react-icons/ci";
import { CiCircleMore } from "react-icons/ci";

const ViewTaskDetails = ({ hoveredTask, setShowHoveredTask, statusIcons, getReportingManager, statusStyles }) => {
    return (
        <div className="absolute top-0 right-0 w-[40%] h-full bg-white shadow-lg z-10 p-10">
            <div className="absolute right-6 top-6 cursor-pointer" onClick={() => setShowHoveredTask(false)}>
                <RxCross2 className="text-baseGray" />
            </div>
            <div className="text-sm text-baseGray mb-1">{hoveredTask.date}</div>
            <div className="text-xl lg:mb-4 font-semibold  text-baseGray">{hoveredTask.task}</div>
            <div className="flex items-center justify-between gap-x-5">
                <div className="flex items-center gap-x-4 text-sm  lg:w-[40%]">
                    {/* First Column */}
                    <div className="flex flex-col gap-y-3 w-[58%]">
                        <div className="text-baseGray flex items-center gap-x-2 h-9">
                            <IoCalendarOutline className="text-xl" />
                            <h3 className="font-medium ">Start Date</h3>
                        </div>
                        <div className="text-baseGray flex items-center gap-x-2 h-9">
                            <IoCalendarOutline className="text-xl" />
                            <h3 className="font-medium ">Due Date</h3>
                        </div>
                        <div className="text-baseGray flex items-center gap-x-2 h-9">
                            <PiHeadlightsBold className="text-xl" />
                            <h3 className="font-medium ">Priority</h3>
                        </div>
                    </div>
                    {/* Second Column */}
                    <div className="flex flex-col gap-y-3 w-[50%]">
                        <div className="text-baseGray flex items-center gap-x-2 h-9">
                            <h3 className="font-medium ">{hoveredTask.task_start_date}</h3>
                        </div>
                        <div className="text-baseGray flex items-center gap-x-2 h-9">
                            <h3 className="font-medium ">{hoveredTask.due_date}</h3>
                        </div>
                        <div className="text-baseGray flex items-center gap-x-2 h-9">
                            <h3 className="font-medium  flex items-center gap-x-1">{statusIcons[hoveredTask.priorty]}{hoveredTask.priorty}</h3>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-x-5 text-sm">
                    {/* First Column */}
                    <div className="flex flex-col gap-y-3">
                        <div className="text-baseGray flex items-center gap-x-2 h-9">
                            <PiUsersLight className="text-xl" />
                            <h3 className="font-medium ">Assignee</h3>
                        </div>
                        <div className="text-baseGray flex items-center gap-x-2 h-9">
                            <AiOutlineUnorderedList className="text-xl" />
                            <h3 className="font-medium ">Type</h3>
                        </div>
                        <div className="text-baseGray flex items-center gap-x-2 h-9">
                            <TbCircleDashed className="text-xl" />
                            <h3 className="font-medium ">Status</h3>
                        </div>
                    </div>
                    {/* Second Column */}
                    <div className="flex flex-col gap-y-3 w-[60%]">
                        <div className="text-baseGray flex items-center gap-x-2 h-9">
                            <h3 className="font-medium  bg-purple-600 text-white w-8 h-8 rounded-full flex justify-center items-center">
                                {/* {getReportingManager(hoveredTask.assigne)} */}
                                {getReportingManager(hoveredTask.employee_id)}
                            </h3>
                        </div>
                        <div className="text-baseGray flex items-center gap-x-2 h-9">
                            <h3 className="font-medium  flex items-center gap-x-1">
                                <div className="text-xl font-bold">{hoveredTask.Type === "Project" ? <CiViewBoard className="text-[#FF61C0] bg-[#FFE8F6] rounded-full p-0.5" /> : <CiCircleMore className="text-[#935AF2] bg-[#F1E8FF] rounded-full p-0.5" />}</div>
                                {hoveredTask.Type}
                            </h3>
                        </div>
                        <div className="text-baseGray flex items-center gap-x-2 h-9">
                            <h3 className={`font-medium  px-2 py-1 rounded-lg ${statusStyles[hoveredTask.status]}`}>{hoveredTask.status}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-lg lg:mt-2 lg:mb-2 font-semibold  text-baseGray">Task Details</div>
            <div className="text-baseGray ">{hoveredTask.task_details}</div>

        </div>
    )
}

export default ViewTaskDetails