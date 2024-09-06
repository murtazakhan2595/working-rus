import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { RxCrossCircled } from "react-icons/rx";

function StatCard({ totalExit, approvedResignation, rejectedResignation }) {
  // const statsData = [
  //   {
  //     icon: <ImExit className="text-[#25A8E0] text-3xl" />,
  //     title: "Total Exits",
  //     value: totalExit,
  //   },
  //   {
  //     icon: <FaRegCheckCircle className="text-[#25A8E0] text-3xl" />,
  //     title: "Accepted",
  //     value: approvedResignation,
  //   },
  //   {
  //     icon: <RxCrossCircled className="text-[#25A8E0] text-3xl" />,
  //     title: "Rejected",
  //     value: rejectedResignation,
  //   },
  // ];
  const statsData = [
    { label: "Total Exits", value: totalExit, icon: ImExit },
    { label: "Accepted", value: approvedResignation, icon: FaRegCheckCircle },
    {
      label: "Rejected",
      value: rejectedResignation,
      icon: RxCrossCircled,
    },
  ];
  const Blocks = (blocks) => (
    <div className="flex flex-col items-start gap-2 xl:flex-row xl:items-center lg:flex-row lg:items-center md:flex-row md:items-center">
      {blocks.map((block) => (
        <div
          key={block.label}
          className="flex flex-row items-center justify-start gap-2 "
        >
          <div className="flex items-center justify-center p-4 rounded-full bg-mauve-200">
            <block.icon className="h-7 w-7 text-plum-1100" aria-hidden="true" />
          </div>
          <div className="flex flex-col items-start">
            <div className="text-2xl font-bold leading-none tabular-nums">
              {block.value}
            </div>
            <div className="font-xl medium text-muted-foreground">
              {block.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return <>{Blocks(statsData)}</>;
}

export default StatCard;
