import { FilterInput } from "components/form-control";
import { useEffect, useState } from "react";
import { yearsDropdownList } from "utils/Lists";
import LeaveCount from "./Sections/LeaveCount";
import { getLeaveTrackerStats } from "app/hooks/leaveManagment";
import { LeaveType } from "utils/getValuesFromTables";
import Stats from "../../../components/ui/Stats";
import { LayoutList, ListCheck, OctagonAlert, SquareX } from "lucide-react";

/**
 * LeaveTrackerStats component
 * 
 * Displays leave tracker statistics for an employee
 * 
 * @param {object} leaveTypes - An array of leave types
 * @param {object} userProfile - The user's profile information
 * 
 * @returns {JSX.Element} The leave tracker statistics component
 */
export default function LeaveTrackerStats({ leaveTypes, userProfile }) {
  /**
   * State variables
   */
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

  /**
   * Handle filter changes
   * 
   * @param {string} filterName - The name of the filter
   * @param {any} filterValue - The value of the filter
   */
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

  /**
   * Fetch leave tracker stats on mount
   */
  useEffect(() => {
    if (leaveTypes && leaveTypes.length > 0) {
      const leave_type = leaveTypes[0];
      handlestatsChange("leave_type", leave_type?.value);
      setDefaultLeaveType(leave_type?.value || "");
    }
  }, [leaveTypes]);

  /**
   * Fetch leave tracker stats on filter change
   */
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

  /**
   * Stats data
   */
  const statsData = [
    { icon: ListCheck , label: "All Leaves", value: allotedLeaves + "days" },
    { icon: ListCheck , label: "Approved", value: totalApproved },
    { icon: LayoutList , label: "Pending", value: pendingRequests },
    { icon: OctagonAlert , label: "Request", value: totalRequests },
    { icon: SquareX , label: "Denied", value: deniedRequests },
    { icon: SquareX , label: "Leaves Remaining", value: remainingLeaves },
    { icon: SquareX , label: "Leaves Used", value: usedLeaves },
  ];

  return (
    <>
    <Stats stats= {statsData}  />
    <div className="flex flex-col w-full gap-4 mb-4 md:flex-row">
      {/* Left section */}
      <div className="bg-white md:w-[60%] flex items-center rounded-lg  flex-wrap">
        <div className="md:w-[45%] px-4 py-2 rounded-lg">
       
          <h2 className="mb-2 text-base font-semibold font-lato text-baseGray">
            My{" "}
            {filterStats.leave_type_id ? (
              <LeaveType value={filterStats.leave_type_id} />
            ) : (
              ""
            )}{" "}
            Leave Allowance
          </h2>
          
          <div className="mb-2">
            <label className="block mb-2 text-gray-700">Leave Year</label>
            <FilterInput
              filters={[
                {
                  type: "select",
                  option: yearsDropdownList(2000, defaultYear),
                  placeholder: "Leave Year",
                  name: "year",
                  defaultValue: { label: defaultYear, value: defaultYear },
                },
              ]}
              onChange={handlestatsChange}
            />
          </div>
          {defaultLeaveType && (
            <div className="mb-2">
              <label className="block mb-2 text-gray-700">Leave Type</label>
              <FilterInput
                filters={[
                  {
                    type: "select",
                    option: leaveTypes,
                    name: "leave_type",
                    placeholder: "Leave Type",
                    defaultValue: defaultLeaveType,
                  },
                ]}
                onChange={handlestatsChange}
                isClearable={false}
              />
            </div>
          )}
        </div>

        {/* Center section */}

        
      </div>

      {/* right */}

     
    </div>
    </>
  );
}
