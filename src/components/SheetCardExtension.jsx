import React from 'react'

const SheetCardExtension = ({title, children}) => {
  return (
    <div className="font-[inter] flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
    <div className="flex h-[7px] flex-shrink-0 items-end px-px">
      <div className="text-zinc-950">{title}</div>
    </div>
    {children}
  </div>
  )
}

export default SheetCardExtension
