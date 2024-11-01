import moment from "moment";
import React from "react";
import { saveEmployeeWorkInformationData } from "app/hooks/employee";
import { TerminationReason } from "utils/getValuesFromTables";
import Letter from "./Letter";
import { toast } from "react-toastify";
import { updateExitData } from "app/hooks/employee";
import { Status } from "./index";

function ExitDetails({ exitData, isTermination }) {
  const termination_status = Status(exitData.termination_status, 1);
  const exitDetailsResignation = [
    { label: "Leaving Reason", value: exitData.exit_type },
    {
      label: "Exit date",
      value: moment(exitData.exit_date).format("DD-MM-YYYY") || "Invalid Date",
    },
    { label: "Notice period", value: exitData.notice_period },
  ];
  const exitDetailsTermination = [
    {
      label: "Reason of termination",
      value: <TerminationReason value={exitData.reason_of_termination} />,
    },
    {
      label: "Exit date",
      value: moment(exitData.exit_date).format("DD-MM-YYYY") || "Invalid Date",
    },
    {
      label: "Exit Interview date",
      value:
        moment(exitData.exit_interview_date).format("DD-MM-YYYY") ||
        "Invalid Date",
    },
    { label: "Notice period", value: exitData.notice_period },
  ];
  const handleStatuschange = async (status_termination) => {
    try {
      const response = await updateExitData({
        id: exitData.id,
        status_termination,
      });
      if (response) {
        if (status_termination === "accepted by employee") {
          await saveEmployeeWorkInformationData(exitData.employee_id, {
            employee_status: "Notice Period",
            id: exitData.employee_id,
          });
        }
        toast.success("Status updated successfully");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="w-full p-6 mb-6 bg-white border rounded-lg">
        <div className="flex justify-between">
          <h2 className="text-xl">Exit Details</h2>
        </div>
        <hr />
        <div className="flex flex-col self-start justify-center mt-5 text-base">
          {isTermination
            ? exitDetailsTermination.map((detail, index) => (
                <ExitInfoItem
                  key={index}
                  label={detail.label}
                  value={detail.value}
                />
              ))
            : exitDetailsResignation.map((detail, index) => (
                <ExitInfoItem
                  key={index}
                  label={detail.label}
                  value={detail.value}
                />
              ))}
        </div>
        {exitData.resignation_letter && (
          <Letter name={exitData.emp_name} file={exitData.resignation_letter} />
        )}
        {exitData.termination_letter && (
          <Letter
            name={exitData.emp_name}
            file={exitData.termination_letter}
            isTermination={isTermination}
          />
        )}

        {isTermination &&
          (termination_status === "viwed by manager" ||
            termination_status === "") && (
            <div className="w-[365px] h-10 justify-start items-start gap-5 inline-flex mt-14">
              <button
                className="w-[175px] h-10 px-5 py-1 rounded-lg border-2 border-[#bf6760] justify-center items-center gap-[15px] flex"
                onClick={() => handleStatuschange("rejected by employee")}
              >
                <div className="text-[#5c5e64] text-sm font-medium  leading-normal">
                  Reject
                </div>
              </button>
              <button
                className="w-[175px] h-10 px-5 py-1 rounded-lg  border-2 border-[#a3bfb6] justify-center items-center gap-[15px] flex"
                onClick={() => handleStatuschange("accepted by employee")}
              >
                <div className="text-[#5c5e64] text-sm font-medium  leading-normal">
                  Accept
                </div>
              </button>
            </div>
          )}
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
