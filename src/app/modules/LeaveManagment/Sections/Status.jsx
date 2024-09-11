
import { BsCircleFill } from "react-icons/bs";


import { useSelector } from "react-redux";
import {
  allotLeavesToEmployee,
  getEmployeeLeaveTypesById,
  updateLeaveStatus,
} from "app/hooks/leaveManagment";
import { toast } from "react-toastify";
import { CircleCheck, CircleDot, X } from "lucide-react";
export const Status = (status) => {
  if (!status) return "";
  if (status.includes("Approved")) return "Approved";
  else if (status.includes("Declined")) return "Rejected";
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
      <CircleCheck 
        className={`${className} bg-[#00C483] text-white`}
        style={style}
      />
    );
  else if (status === "Rejected")
    return (
      <X
        className={`${className} bg-[#EA4335] text-white`}
        style={style}
      />
    );
  else if (status === "Pending")
    return (
      <CircleDot 
        className={`${className} bg-[#E8E8E8]`}
        style={{
          ...{ style },
          ...{ color: "#D9D9D9", border: "3px solid #E8E8E8" },
        }}
      />
    );
  else return <></>;
};

export const UpdateStatus = (status, application, loggedInUser) => {
  const handleApprove = async (status) => {
    try {
      const payload = application;
      const previousStatus = Status(application.status_hr);
      if (loggedInUser.role === 1 || loggedInUser.role === 3) {
        payload["status_hr"] = `${status} by HR`;
      } else if (loggedInUser.role === 2) {
        payload["status_manager"] = `${status} by Manager`;
      }
      const response = await updateLeaveStatus(payload, loggedInUser);
      // If declined, update the employee leaves
      if (response) {
        if (
          (loggedInUser.role === 1 || loggedInUser.role === 3)
        ) {
          const alloted_leaves_info = await getEmployeeLeaveTypesById(
            payload.leave_type
          );
          const leavesInfo = alloted_leaves_info;
          if(status === "Declined"){
            leavesInfo.used_leave = alloted_leaves_info.used_leave - payload.total_leave;
            leavesInfo.left_leave = alloted_leaves_info.left_leave + payload.total_leave;
          }else if(status === "Approved" && previousStatus === "Rejected"){
            leavesInfo.used_leave = alloted_leaves_info.used_leave + payload.total_leave;
            leavesInfo.left_leave = alloted_leaves_info.left_leave - payload.total_leave;
          }
          const result = await allotLeavesToEmployee(payload.employee_id, [
            leavesInfo,
          ]);
          if (!result) {
            toast.error("Error updating employee leaves");
          }
        }
        toast.success(`Application ${status} Successfully!`);
        return true;
      } else {
        toast.error(`Application Could not be ${status}"`);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(`Application Could not be ${status}"`);
      return false;
    }
  };
  return handleApprove(status);
};
