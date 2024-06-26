import { FaCheck } from "react-icons/fa6";
import { BsCircleFill } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";

export const Status = (status) => {
  if (status.includes("Approved")) return "Approved";
  else if (status.includes("Denied")) return "Denied";
  else if (status.includes("Pending")) return "Pending";
  else return "Viewed";
};

export const getDecision = (status) => {
  if (status === "Approved") return "Approved";
  else if (status === "Denied") return "Denied";
  else if (status === "Pending") return "Awaiting Decision";
  else return status;
};

export const StatusIcon = ({ status }) => {
  if (!status) return <></>;
  const className = "text-[20px] d-inline rounded-full mr-5";
  const style = { padding: "3px" };
  status = Status(status);
  if (status === "Approved")
    return (
      <FaCheck
        className={`${className} bg-[#00C483] text-white`}
        style={style}
      />
    );
  else if (status === "Denied")
    return (
      <RxCross2
        className={`${className} bg-[#EA4335] text-white`}
        style={style}
      />
    );
  else if (status === "Pending")
    return (
      <BsCircleFill
        className={`${className} bg-[#E8E8E8]`}
        style={{
          ...{ style },
          ...{ color: "#D9D9D9", border: "3px solid #E8E8E8" },
        }}
      />
    );
  else return <></>;
};
