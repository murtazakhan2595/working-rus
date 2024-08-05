import moment from "moment";
import React from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import PdfIcon from "assets/images/pdfPreview.png"


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
function ResignationLetter({name, file}) {
  function getFileSizeInKB(base64String) {
    const base64Data = base64String.split(",")[1];
    const binaryString = atob(base64Data);
    const byteLength = binaryString.length;
    const kbSize = byteLength / 1024;
    return kbSize.toFixed(0);
  }
  function handleDownload() {
    const link = document.createElement("a");
    link.href = file.file; 
    link.download = file.name || "downloaded-file"; 
    link.click();
  }

  return (
    <div className="flex flex-col items-start pr-20 mt-5 w-full max-md:pr-5 max-md:max-w-full">
      <h3 className="text-base font-bold leading-none text-zinc-800">
        Resignation letter
      </h3>
      <div className="flex flex-wrap gap-5 justify-between items-center px-3 pt-2.5 pb-0.5 mt-4 max-w-full bg-gray-100 rounded-lg w-[562px]">
        <div className="flex gap-4">
          <img
            loading="lazy"
            src={PdfIcon}
            alt=""
            className="object-contain shrink-0 aspect-[0.69] w-[25px]"
          />
          <div className="flex flex-col">
            <div className="text-sm leading-none text-zinc-800">{name}</div>
            <div className="self-start mt-1 text-xs leading-none text-zinc-600">
              {getFileSizeInKB(file.file)} KB
            </div>
          </div>
        </div>
        <button
          className="flex gap-2 my-auto items-center text-sm leading-none whitespace-nowrap text-zinc-800"
          onClick={handleDownload}
        >
          <div className="grow">Download</div>
          <MdOutlineFileDownload className="text-lg" />
        </button>
      </div>
    </div>
  );
}

export default ExitDetails;
