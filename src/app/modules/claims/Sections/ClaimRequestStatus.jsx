

const ClaimRequestStatus = ({status})=>{

  return (
    <>
      {status.toLowerCase() === "approved" && (
        <div className="h-[22px] px-3 py-[3px] bg-[#e5fff8] rounded-[999px] justify-center items-center gap-1.5 inline-flex">
          <div className="text-[#1d735e] text-xs font-semibold  leading-3">
            Approved
          </div>
        </div>
      )}
      {status.toLowerCase() === "rejected" && (
        <div className="h-[22px] px-3 py-[3px] bg-[#ffe5eb] rounded-[999px] justify-center items-center gap-1.5 inline-flex">
          <div className="text-[#ce1644] text-xs font-semibold  leading-3">
            Rejected
          </div>
        </div>
      )}
      {status.toLowerCase() === "pending" && (
        <div className="h-[22px] px-3 py-[3px] bg-[#e8e8ec] rounded-[999px] justify-center items-center gap-1.5 inline-flex">
          <div className="text-[#7f838d] text-xs font-semibold  leading-3">
            Pending
          </div>
        </div>
      )}
    </>
  );
}

export default ClaimRequestStatus;