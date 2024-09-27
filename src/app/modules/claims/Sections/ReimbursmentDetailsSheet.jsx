import { useState } from "react";
import SheetComponent from "../../../../components/ui/SheetComponent";
import EmployeeDataInfo from "app/modules/payroll/Sections/EmployeeDataInfo";
import moment from "moment";
import { Button } from "components/ui/button";


const ReimbursmentDetailsSheet = ({ claimRequest, isOpen, setIsOpen }) => {
      const detailItems = [
        { label: "Expense type", value: claimRequest.expense_type },
        { label: "Amount", value: claimRequest.amount },
        { label: "Date of Expense", value: claimRequest.date_of_expense },
        { label: "Description", value: claimRequest.description },
        {
          label: "Attachments",
          value: claimRequest?.attachments || "No attachments provided",
        },
      ];
      const approvalSteps = [
        {
          icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/c85cb64c-2e0e-42fc-a08c-3a4e0a5554f9?placeholderIfAbsent=true&apiKey=8843d3a010584163b752e26820feff04",
          text: "Manager Approval",
          time: "2d ago",
        },
        {
          icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/1b686abe-67d0-4cbe-9e76-ca6031d5db4e?placeholderIfAbsent=true&apiKey=8843d3a010584163b752e26820feff04",
          text: "HR Approval",
          time: "1d ago",
        },
        {
          icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/2584d53ed62dd9532f6ca89e85bff7b29908da4e89590e986dc2f0dcb3b79782?placeholderIfAbsent=true&apiKey=8843d3a010584163b752e26820feff04",
          text: "Final Approval",
          time: null,
        },
      ];
  const formSheetData = {
    triggerText: null,
    title: "Reimbursment requests",

    description: null,
    footer: null,
  };
  return (
    <div>
      <SheetComponent
        {...formSheetData}
        contentClassName="custom-sheet-width"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        width="500px"
      >
        <EmployeeDataInfo
          name={`Dennis Callis`}
          email={"lorri73@gmail.com"}
          id={1234}
        />
        <div className="font-inter mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200  text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
          <section className="flex flex-col justify-center p-6 text-sm bg-white max-w-[479px]">
            <div className="text-[#111827] text-sm font-semibold whitespace-nowrap">
              Details
            </div>
            <div className="flex mt-3 w-full">
              <div className="flex flex-col flex-1 shrink justify-center pr-11 w-full basis-0 min-w-[240px]">
                {detailItems.map((item, index) => (
                  <div className="flex gap-4 items-center mt-4 max-w-full">
                    <div className="flex flex-col leading-none min-w-[88px] text-neutral-400 w-[132px]">
                      <div>{item.label}</div>
                    </div>
                    <div className="flex-1 shrink leading-5 basis-0 text-neutral-800">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <div className="h-[45px] px-6 pt-[13px] pb-3 bg-zinc-100/50 border-t border-zinc-200 justify-start items-center inline-flex">
            <div className="grow shrink basis-0 flex-col justify-start items-start inline-flex">
              <div>
                <span className="text-[#8b8d98] text-xs font-medium  leading-tight">
                  Created on:
                </span>
                <span className="text-[#8b8d98] text-xs font-normal  leading-3">
                  {` ${moment(claimRequest?.date_of_expense).format(
                    "MMMM DD, YYYY"
                  )}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="font-inter mt-5 flex flex-grow flex-col gap-y-[16px] rounded-lg border border-solid border-zinc-200  text-sm font-medium leading-[1.2] tracking-[0px] text-zinc-900">
          <section className="flex flex-col justify-center p-6 text-sm bg-white max-w-[479px]">
            <div className="text-[#111827] text-sm font-semibold whitespace-nowrap">
              Approval Status
            </div>
            <section className="flex relative flex-col max-w-[382px] mt-3">
              <div className="flex absolute -bottom-0.5 z-0 justify-center items-start w-6 h-[150px] left-[5px] min-h-[150px]" />
              {approvalSteps.map((step, index) => (
                <div className="flex z-0 gap-10 justify-between items-center w-full">
                  <div className="flex gap-4 self-stretch my-auto w-[194px]">
                    <div className="flex justify-center items-center px-1 bg-white h-[33px] w-[33px]">
                      <img
                        loading="lazy"
                        src={step.icon}
                        alt=""
                        className="object-contain self-stretch my-auto aspect-square w-[25px]"
                      />
                    </div>
                    <div className="py-0.5 my-auto text-xs leading-loose text-[#6B7280] min-h-[24px]">
                      {step.text}
                    </div>
                  </div>
                  {step.time && (
                    <div className="self-stretch py-0.5 my-auto text-xs leading-loose text-[#6B7280]">
                      {step.time}
                    </div>
                  )}
                </div>
              ))}
            </section>
          </section>
        </div>
          <div className="flex flex-col justify-end gap-4 md:flex-row lg:flex-row xl:flex-row pt-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Reject
            </Button>
            <Button
              type="submit"
              size="lg"
              variant="default"
              className=" bg-[#1c2024] text-white"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Accept
            </Button>
        </div>
      </SheetComponent>
    </div>
  );
};


export default ReimbursmentDetailsSheet;