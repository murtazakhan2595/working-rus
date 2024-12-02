import { ChevronLeft, ChevronRight, Paperclip } from "lucide-react";
import moment from "moment";
import React from "react";
import { getFileSizeInKB } from "utils/fileUtils";
import { Button } from "./ui/button";
import AlertDialogue from "./ui/AlertDialogue";

export const SheetCardExtension = ({ title, children, className }) => {
  return (
    <div className={`font-[inter] ${className} flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200 px-[15px] pb-[15px] text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900`}>
      <div className="flex h-[7px] flex-shrink-0 items-end px-px">
        <div className="text-zinc-950">{title}</div>
      </div>
      {children}
    </div>
  );
};

export const DetailBox = ({ label, value, className="mt-3" }) => {
  return (
      <div className={`flex gap-4 items-center max-w-full ${className}`}>
        <div className="flex flex-col leading-none min-w-[88px] text-neutral-900 w-[132px]">
          <div>{label}</div>
        </div>
        <div className="flex-1 shrink leading-5 basis-0">{value ?? "N/A"}</div>
      </div>
  );
};

export const DetailCard = ({
  detailCardTitle,
  children,
  date,
  dateTitle="Sent on:",
  classNames=""
}) => {
  return (
    <div className={`${classNames} flex flex-col rounded-lg shadow border  mt-8`}>
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
                {dateTitle}:
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

export const DisplayFile = ({ firstName, lastName, file, onDownload })=>{
  return(
    <div className="flex-1 shrink leading-5 basis-0 text-neutral-800 py-2 max-w-64 px-4 border border-[#f0f0f3] flex justify-between items-center gap-4">
    <div className="flex gap-x-3 items-center">
      <Paperclip size={16} />
      <div className="flex flex-col">
      <p className="text-sm text-[#323333]">
        {firstName} {lastName}
      </p>
      <p>{getFileSizeInKB(file)}KB</p>
      </div>
    </div>
    <Button variant="link" onClick={() => onDownload(file, `${firstName} ${lastName}`)}>
      Download
    </Button>
  </div>
  )
}

export const DisplayButton = ({handlePrevious, handleNext})=>{
  return(
    <div className="flex justify-end gap-2">
    <Button variant="outline"onClick={handlePrevious}> <ChevronLeft/> Previous</Button>
    <Button variant="outline" onClick={handleNext}>Next <ChevronRight/></Button>
    </div>
  )
}

export const handleCloseWithConfirmation = ({isOpen, setCloseSheet, setIsOpen, setNewAttachment, ...props}) => {
  return (
    isOpen && (
      <AlertDialogue
        isOpen={isOpen}
        setIsOpen={setCloseSheet}
        title="Are you sure you want to close?"
        description="Any unsaved changes will be discarded. Do you want to proceed?"
        continueText="Discard"
        cancelText="Keep"
        handleContinue={() => {
          setCloseSheet(false);
          setIsOpen(false);
          if (setNewAttachment) {
            setNewAttachment(null);
          }
          if(props?.discard && props?.navigate){
            props?.navigate('/profile-management')
          }
        }}
      />
    )
  );
};