import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Button } from "components/ui/button";
import {
  getLeaveListData,
  getLeaveTypeListData,
  getLeaveStatsData,
} from "app/hooks/leaveTracker";
import { PageLoader } from "components";
import { connect } from "react-redux";
import { LeaveAplicationDashboardColumns } from "app/modules/LeaveTracker/Sections";
import CustomTable from "components/CustomTable";
import { FilterInput } from "components/FormControl";
import { GlobalStatusOptions } from "data/Data";
import { getLeaveComponents } from "app/hooks/leaveTracker";
import moment from "moment";

const LeaveTrackerOverview = ({ userProfile }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [Leaves, setLeaves] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [leaveSummary, setLeaveSummary] = useState({
    Pending: 0,
    Approved: 0,
    Rejected: 0,
  });

  const fetchData = async (isMounted) => {
    try {
      setIsLoading(true);
      const Leaves = await getLeaveListData({
        filterData,
        options: { page: 1, sizePerPage: 5 }, // ordering,
      });
      if (Leaves && isMounted) {
        setLeaves(Leaves);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaveTypeData = async (isMounted) => {
    try {
      setIsLoading(true);
      const LeavesTypes = await getLeaveTypeListData();
      const LeaveState = await getLeaveStatsData();
      if (LeavesTypes && isMounted) {
        setLeaveTypesData(LeavesTypes.results || []);
        setLeaveSummary(LeaveState);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let isMounted = true;
    fetchLeaveTypeData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);

  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      // Handle other filters normally
      if (filterValue === "" || filterValue === null) {
        delete updatedFilters[filterName];
      } else {
        if (filterName === "status")
          updatedFilters[filterName] = filterValue.toLowerCase();
        else updatedFilters[filterName] = filterValue;
      }

      return updatedFilters;
    });
  };

  return (
    <>
      <CardHeader className="items-start p-6">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg ">
            Leave Tracker
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Link to="/leave-tracker">View Detail</Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      {/* Leave Summary Stats */}
      <div className="px-6 mb-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Pending Leaves */}
          <div className="bg-[#f0f0f3] rounded-lg p-4 flex flex-col">
            <span className="text-[#7f838d] text-sm font-medium">Pending</span>
            <span className="text-2xl font-semibold text-[#7f838d] mt-1">
              {isLoading ? "-" : leaveSummary.Pending}
            </span>
          </div>

          {/* Approved Leaves */}
          <div className="bg-emerald-50 rounded-lg p-4 flex flex-col">
            <span className="text-teal-700 text-sm font-medium">Approved</span>
            <span className="text-2xl font-semibold text-teal-700 mt-1">
              {isLoading ? "-" : leaveSummary.Approved}
            </span>
          </div>

          {/* Rejected Leaves */}
          <div className="bg-red-50 rounded-lg p-4 flex flex-col">
            <span className="text-red-700 text-sm font-medium">Rejected</span>
            <span className="text-2xl font-semibold text-red-700 mt-1">
              {isLoading ? "-" : leaveSummary.Rejected}
            </span>
          </div>
        </div>
      </div>

      <CardContent>
        <FilterInput
          filters={[
            {
              type: "select",
              options: [
                ...GlobalStatusOptions(false),
                {
                  label: "Cancelled",
                  value: "cancelled_by_employee",
                },
              ],
              name: "status",
              placeholder: "Status",
            },
            {
              type: "select",
              options: leaveTypesData || [],
              name: "leave_type",
              placeholder: "Leave Type",
            },
          ]}
          onChange={handleFilterChange}
          className="justify-end mb-3"
        />
        {isLoading ? (
          <PageLoader />
        ) : (
          <CustomTable
            data={Leaves?.results || []}
            columns={LeaveAplicationDashboardColumns}
            pagination={false}
          />
        )}
      </CardContent>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(LeaveTrackerOverview);
