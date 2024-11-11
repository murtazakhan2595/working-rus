import React from 'react'

export const SheetCardExtension = ({title, children}) => {
  return (
    <div className="font-[inter] flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
    <div className="flex h-[7px] flex-shrink-0 items-end px-px">
      <div className="text-zinc-950">{title}</div>
    </div>
    {children}
  </div>
  )
}

export const DetailBox = ({ label, value }) => {
  return (
    <div>
      <div className="flex gap-4 items-center mt-4 max-w-full">
        <div className="flex flex-col leading-none min-w-[88px] text-neutral-900 w-[132px]">
          <div>{label}</div>
        </div>
        <div className="flex-1 shrink leading-5 basis-0">
          {value ?? "N/A"}
        </div>
      </div>
    </div>
  );
};

