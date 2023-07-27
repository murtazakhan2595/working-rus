import React from 'react'
import { RiAttachment2 } from "react-icons/ri";

const NotificationBox = () => {
  return (
    <div className="flex flex-col w-[95%] shadow-lg py-2 h-[17rem] bg-white rounded-lg mx-auto justify-center">
    {/* Message */}
    <div className="flex w-[95%] justify-between border-l-2 mx-auto py-3 px-2">
      <div className="flex justify-between w-[100%]">
        <div className="text-3xl self-start w-10 h-10 mr-1 rounded-full border bg-black"></div>
        <div className="flex flex-col w-[10rem]">
          <div className="text-blue-400 text-[0.60rem]">
            Download Eagle
          </div>
          <div className="font-semibold text-[0.70rem] text-[#283b91]">
            Introduction our new tool
          </div>
          <div className="text-blue-400 text-[0.60rem]">
            A small clever name Duden flower by supplies necesay readlies.{" "}
          </div>
        </div>
        <div>
          <div className="flex flex-col items-end">
            <div className="text-blue-400 text-[0.60rem]">
              20 Mar 2023
            </div>
            <RiAttachment2 className="text-blue-400 text-xs" />
          </div>
        </div>
      </div>
    </div>
    {/* Message */}
    <div className="flex w-[95%] justify-between border-l-2 mx-auto py-3 px-2">
      <div className="flex justify-between w-[100%]">
        <div className="text-3xl self-start w-10 h-10 mr-1 rounded-full border bg-black"></div>
        <div className="flex flex-col w-[10rem]">
          <div className="text-blue-400 text-[0.60rem]">
            Download Eagle
          </div>
          <div className="font-semibold text-[0.70rem] text-[#283b91]">
            Introduction our new tool
          </div>
          <div className="text-blue-400 text-[0.60rem]">
            A small clever name Duden flower by supplies necesay readlies.{" "}
          </div>
        </div>
        <div>
          <div className="flex flex-col items-end">
            <div className="text-blue-400 text-[0.60rem]">
              20 Mar 2023
            </div>
            <RiAttachment2 className="text-blue-400 text-xs" />
          </div>
        </div>
      </div>
    </div>
    {/* Message */}
    <div className="flex w-[95%] justify-between border-l-2 mx-auto py-3 px-2">
      <div className="flex justify-between w-[100%]">
        <div className="text-3xl self-start w-10 h-10 mr-1 rounded-full border bg-black"></div>
        <div className="flex flex-col w-[10rem]">
          <div className="text-blue-400 text-[0.60rem]">
            Download Eagle
          </div>
          <div className="font-semibold text-[0.70rem] text-[#283b91]">
            Introduction our new tool
          </div>
          <div className="text-blue-400 text-[0.60rem]">
            A small clever name Duden flower by supplies necesay readlies.{" "}
          </div>
        </div>
        <div>
          <div className="flex flex-col items-end">
            <div className="text-blue-400 text-[0.60rem]">
              20 Mar 2023
            </div>
            <RiAttachment2 className="text-blue-400 text-xs" />
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default NotificationBox