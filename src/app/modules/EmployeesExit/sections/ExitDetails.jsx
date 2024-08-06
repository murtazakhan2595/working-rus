import moment from "moment";
import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import PdfIcon from "assets/images/pdfPreview.png"
import ResignationLetter from "./ResignationLetter";


function ExitDetails({ exitData }) {
  const exitDetails = [
    { label: "Leaving Reason", value: exitData.exit_type },
    {
      label: "Exit date",
      value: moment(exitData.exit_date).format("DD-MM-YYYY") || "Invalid Date",
    },
    { label: "Notice period", value: exitData.notice_period },
  ];
  return (
    <>
      <div className="bg-white shadow border w-full rounded-lg p-6 mb-6">
        <div className="flex justify-between">
          <h2 className="text-xl">Exit Details</h2>
        </div>
        <hr />
        <div className="flex flex-col justify-center self-start mt-5 text-base">
          {exitDetails.map((detail, index) => (
            <ExitInfoItem
              key={index}
              label={detail.label}
              value={detail.value}
            />
          ))}
        </div>
        {exitData.resignation_letter &&<ResignationLetter
          name={exitData.name}
          file={exitData.resignation_letter}
        />}
      </div>
    </>
  );
}

function ExitInfoItem({ label, value }) {
  return (
    <div className="flex gap-5 items-center min-h-[40px]">
      <div className="flex gap-5 self-stretch my-auto min-h-[40px] min-w-[240px]">
        <div className="flex-1 leading-5 text-zinc-600 w-[155px]">{label}</div>
        <div className="leading-none text-zinc-800 w-[175px]">{value}</div>
      </div>
    </div>
  );
}


export default ExitDetails;
