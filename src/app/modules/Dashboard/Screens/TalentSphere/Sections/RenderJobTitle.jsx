import React from "react";


export default function RenderJobTitle({ row }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center gap-2 ">
       
        <div className="inline-flex flex-row items-start justify-start gap-1 ">
          <div className="">
            {row.id}
          </div>
          <div className="">
            {row.Job_Title}
          </div>
        </div>
      </div>
    </div>
  );
}



