import moment from "moment";
import React from "react";

export const SheetCardExtension = ({ title, children }) => {
  return (
    <div className="font-[inter] flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
      <div className="flex h-[7px] flex-shrink-0 items-end px-px">
        <div className="text-zinc-950">{title}</div>
      </div>
      {children}
    </div>
  );
};

export const DetailBox = ({ label, value }) => {
  return (
    <div>
      <div className="flex gap-4 items-center mt-4 max-w-full">
        <div className="flex flex-col leading-none min-w-[88px] text-neutral-900 w-[132px]">
          <div>{label}</div>
        </div>
        <div className="flex-1 shrink leading-5 basis-0">{value ?? "N/A"}</div>
      </div>
    </div>
  );
};

export const DetailCard = ({
  detailCardTitle,
  children,
  date,
}) => {
  return (
    <div className="flex flex-col rounded-lg shadow border  mt-8">
      <section className="flex flex-col justify-center p-6 text-sm  max-w-[479px]">
        <div className="text-[#111827] text-sm font-semibold whitespace-nowrap">
          {detailCardTitle}
        </div>
        {children}
      </section>
      {date && (
        <div className="h-[45px] px-6 pt-[13px] pb-3 bg-zinc-100/50 border-t border-zinc-200 justify-start items-center inline-flex">
          <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
            <div>
              <span className="text-[#8b8d98] text-xs font-medium  leading-tight">
                Sent on:
              </span>
              <span className="text-[#8b8d98] text-xs font-normal  leading-3">
              {` ${moment(date).format(
                    "MMMM DD, YYYY"
                  )}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
