import { getLeaveApplications } from "app/hooks/leaveManagment";
import { Status } from "app/modules/LeaveManagment/Sections";
import { StatusLabel } from "components";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function MyLeaves() {
  const [leave, setLeave] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const userProfile = useSelector((state) => state.user.userProfile);

  console.log(leave);
  useEffect(() => {
    const fetchdata = async () => {
      try {
        setIsLoading(true);
        const applicationsData = await getLeaveApplications({
          filterData: { employee_id: userProfile.id },
        });
        if (applicationsData) {
          setLeave(applicationsData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchdata();
  }, [userProfile]);
  return (
    <div className="w-full px-3.5 py-6 bg-white rounded-md h-full">
      <div className="flex flex-col gap-6">
        <header className="justify-between items-center inline-flex">
          <div className="text-[#323233] text-lg font-normal leading-tight">
            My Leaves
          </div>
          <div className="justify-start items-center gap-1 flex">
            <div className="text-[#323233] text-xs font-bold">Add Request</div>
            <Link to="/request-leave">
              <div
                className="p-2 rounded-md bg-black"
                style={{ fontSize: "12px" }}
              >
                <FaPlus className="text-white" />
              </div>
            </Link>
          </div>
        </header>
        <div className="max-h-[236px] overflow-y-auto no-scrollbar">
          {leave.count > 0 ? (
            leave.results.map((leave) => (
              <RenderMyLeaves leave={leave} key={leave.id} />
            ))
          ) : (
            <p className="text-[#5c5e64] font-normal text-center">
              You haven't taken any leave yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const RenderMyLeaves = ({ leave }) => {
  return (
    <div className="max-w-full py-2 rounded-md justify-between items-center gap-3 flex">
      <div className="flex flex-wrap gap-2">
        <div className="w-[63.28px] h-[54px] bg-white rounded-md border border-[#dee1e6] flex flex-col justify-center items-center">
          <div className="w-10 text-center text-[#323842] text-xs font-normal leading-tight">
            Days
          </div>
          <div className="w-10 text-center text-[#323842] text-sm font-medium overflow-hidden leading-snug">
            {leave.total_leave}
          </div>
        </div>
        <div className="flex flex-col gap-1 items-start justify-start">
          <div className="text-[#323842] text-sm font-normal leading-snug">
            {`${moment(leave.start_date).format("MMM DD")} - ${moment(
              leave.end_date
            ).format("MMM DD")}`}
          </div>
          <div className="text-[#424955] text-[11px] font-light  leading-[18px]">
            {leave.leave_component_name}
          </div>
        </div>
      </div>
      <StatusLabel status={Status(leave.status_hr)} />
    </div>
  );
};
