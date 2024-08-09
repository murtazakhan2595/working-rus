import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { RxCrossCircled } from "react-icons/rx";

function StatCard({totalExit, approvedResignation, rejectedResignation}) {
  const statsData = [
    {
      icon: <ImExit className="text-[#25A8E0] text-3xl" />,
      title: "Total Exits",
      value: totalExit,
    },
    {
      icon: <FaRegCheckCircle className="text-[#25A8E0] text-3xl" />,
      title: "Accepted",
      value: approvedResignation,
    },
    {
      icon: <RxCrossCircled className="text-[#25A8E0] text-3xl" />,
      title: "Rejected",
      value: rejectedResignation,
    },
  ];
   return (
     <section className="flex  gap-4 justify-center pr-10 pl-5 min-h-[113px] max-md:pr-5">
       {statsData.map((stat, index) => (
         <div className="flex overflow-hidden gap-5 items-center p-4 h-full bg-gray-50 rounded-xl min-w-[240px] w-[411px]" key={index}>
           <div className="flex gap-2.5 items-center self-stretch p-4 justify-center rounded-2xl bg-sky-500 bg-opacity-10 ">
             {stat.icon}
           </div>
           <div className="flex flex-col justify-center items-start self-stretch my-auto text-center whitespace-nowrap">
             <div className="text-sm text-zinc-600">{stat.title}</div>
             <div className="mt-2 text-2xl text-zinc-800">{stat.value}</div>
           </div>
         </div>
       ))}
     </section>
   );
}

export default StatCard;
