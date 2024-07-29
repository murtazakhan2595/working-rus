import { FilterInput } from "components/form-control";
import { useEffect, useState } from "react";
import { yearsDropdownList } from "utils/Lists";
import LeaveCount from "./Sections/LeaveCount";
import Block from "./Sections/Blocks";
import checked from "../../../assets/images/checked.svg";
import employee from "../../../assets/images/employee.svg";
import time from "../../../assets/images/time.svg";
import cross from "../../../assets/images/cross.svg";
import { getLeaveTrackerStats } from "app/hooks/leaveManagment";
import { LeaveType } from "utils/getValuesFromTables";

export default function LeaveTrackerStats({ leaveTypes, userProfile }) {
  const defaultYear = new Date().getFullYear();
  const [allotedLeaves, setAllotedLeaves] = useState(0);
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  const [filterStats, setFilterStats] = useState({
    employee_id: userProfile.id,
    year: defaultYear,
  });
  const [totalApproved, setTotalApproved] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [deniedRequests, setDeniedRequests] = useState(0);
  const [usedLeaves, setUsedLeaves] = useState(0);
  const [defaultLeaveType, setDefaultLeaveType] = useState(null);
  const handlestatsChange = (filterName, filterValue) => {
    setFilterStats((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === undefined) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
        if (filterName === "leave_type" && leaveTypes) {
          updatedFilters["leave_type_id"] = leaveTypes.find(
            (type) => type.value === filterValue
          )?.leave_type_id;
        }
      }
      return updatedFilters;
    });
  };
  useEffect(() => {
    if (leaveTypes && leaveTypes.length > 0) {
      const leave_type = leaveTypes[0];
      handlestatsChange("leave_type", leave_type?.value);
      setDefaultLeaveType(leave_type?.value || "");
    }
  }, [leaveTypes]);
  console.log(defaultLeaveType);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getLeaveTrackerStats(filterStats);
        if (response) {
          setAllotedLeaves(response.allotedLeaves);
          setRemainingLeaves(response.remainingLeaves);
          setUsedLeaves(response.usedLeaves);
          setTotalApproved(response.approved);
          setPendingRequests(response.pending);
          setTotalRequests(response.requested);
          setDeniedRequests(response.denied);
        }
      } catch (error) {
        console.error("Error fetching leave types:", error);
      }
    };
    fetchStats();
  }, [filterStats]);
  if (!leaveTypes) return <></>;

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
      <div className="bg-white md:w-[60%] flex items-center rounded-lg  flex-wrap">
        {/* Left section */}
        <div className="md:w-[45%] px-4 py-2 rounded-lg">
          <h2 className="text-base font-lato text-baseGray font-semibold mb-2">
            My{" "}
            {filterStats.leave_type_id ? (
              <LeaveType value={filterStats.leave_type_id} />
            ) : (
              ""
            )}
            Leave Allowance
          </h2>
          <div className="text-3xl font-bold text-[#00A8F0] mb-6">
            {allotedLeaves} days
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 mb-2">Leave Year</label>
            <FilterInput
              filters={[
                {
                  type: "select",
                  option: yearsDropdownList(2000, defaultYear),
                  placeholder: "Leave Year",
                  name: "year",
                  defaultValue: { label: defaultYear, value: defaultYear },
                  isClearable: true,
                },
              ]}
              onChange={handlestatsChange}
            />
          </div>
          {defaultLeaveType && (
            <div className="mb-2">
              <label className="block text-gray-700 mb-2">Leave Type</label>
              <FilterInput
                filters={[
                  {
                    type: "select",
                    option: leaveTypes,
                    name: "leave_type",
                    placeholder: "Leave Type",
                    defaultValue: defaultLeaveType,
                    isClearable: false,
                  },
                ]}
                onChange={handlestatsChange}
              />
            </div>
          )}
        </div>

        {/* Center section */}

        <div className="md:w-[55%] flex flex-col md:flex-row items-center justify-around flex-wrap  px-4 py-2">
          <LeaveCount
            title="Leaves Remaining"
            leaveCount={remainingLeaves}
            borderColor="#00A8F0"
            clipPath="inset(0 0 0 20%)"
          />
          <LeaveCount
            title="Leaves Used"
            leaveCount={usedLeaves}
            borderColor="#556CBF"
            clipPath="inset(0 70% 0 0)"
          />
        </div>
      </div>

      {/* right */}

      <div className="md:w-[45%] flex justify-center items-center">
        <div className="grid grid-cols-2 gap-2 h-full w-full max-w-5xl">
          <Block icon={checked} count={totalApproved} label={"Approved"} />
          <Block icon={time} count={pendingRequests} label={"Pending"} />
          <Block icon={employee} count={totalRequests} label={"Request"} />
          <Block icon={cross} count={deniedRequests} label={"Denied"} />
        </div>
      </div>
    </div>
  );
}
