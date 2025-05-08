import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../../components/ui/card";
import { Button } from "components/ui/button";
import { getLeaveTransaction } from "app/hooks/leaveTracker";
import { PageLoader } from "components";
import { connect } from "react-redux";
import { LeaveAplicationColumns } from "app/utils/Types/TableColumns";
import CustomTable from "components/CustomTable";
import { FilterInput } from "components/FormControl";
import { LeaveTrackerOptions } from "data/Data";
import { getLeaveComponents } from "app/hooks/leaveTracker";
import moment from "moment";

const LeaveTrackerOverview = ({ userProfile }) => {
  const [isLeaveTransactionLoading, setIsLeaveTransactionLoading] =
    useState(true);
  const [leaveTransaction, setLeaveTransaction] = useState([]);
// const [filterData, setFilterData] = useState({
//   range_date: `${moment().startOf("month").format("YYYY-MM-DD")},${moment()
//     .endOf("month")
//     .format("YYYY-MM-DD")}`,
// });
const [filterData, setFilterData] = useState({});
  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [leaveSummary, setLeaveSummary] = useState({
    pending: 0,
    approved: 0,
    declined: 0,
  });

  const fetchLeaveTransaction = async () => {
    setIsLeaveTransactionLoading(true);
    const response = await getLeaveTransaction({
      filterData,
      options: { page: 1, sizePerPage: 5 },
    });
    const leaveTransaction =  response?.results
    const statusCounts = response?.status_counts || {};
    if (leaveTransaction && statusCounts) {
      setLeaveTransaction(leaveTransaction);

      setLeaveSummary({
        pending: statusCounts.pending_count || 0,
        approved: statusCounts.approved_count || 0,
        declined: statusCounts.declined_count || 0,
      });
    }
    setIsLeaveTransactionLoading(false);
  };

  const fetchData = async () => {
    const leaveTypesData = await getLeaveComponents({});
    if (leaveTypesData) {
      setLeaveTypesData(leaveTypesData?.results);
    }
  };

  useEffect(() => {
    fetchLeaveTransaction();
  }, [filterData]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (filterName, filterValue) => {
    if (filterName === "status") setSelectedStatus(filterValue);
    if (filterName === "leave_component_id") setSelectedLeaveType(filterValue);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (filterName === "status") {
        // Add both action_hr and action_manager
        if (filterValue === "") {
          // If filterValue is empty, remove both keys
          delete updatedFilters["action_hr"];
          delete updatedFilters["action_manager"];
        } else {
          // Set both action_hr and action_manager to the filterValue
          updatedFilters["action_hr"] = filterValue;
          updatedFilters["action_manager"] = filterValue;
        }
      } else {
        // Handle other filters normally
        if (filterValue === "") {
          delete updatedFilters[filterName];
        } else {
          updatedFilters[filterName] = filterValue;
        }
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
            <FilterInput
              filters={[
                {
                  type: "select-one",
                  option: LeaveTrackerOptions,
                  name: "status",
                  width: "max-w-[130px]",
                  placeholder: "Status",
                  values: selectedStatus,
                  value: selectedStatus,
                },
                {
                  type: "select-two",
                  width: "max-w-[130px]",
                  option: leaveTypesData?.map((leave) => ({
                    value: leave.id,
                    label: leave.name,
                  })),
                  name: "leave_component_id",
                  placeholder: "Leave Type",
                  values: selectedLeaveType,
                  value: selectedLeaveType,
                },
              ]}
              onChange={handleFilterChange}
            />
            <Button variant="outline">
              <Link to="/leave-request">View Detail</Link>
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
              {isLeaveTransactionLoading ? "-" : leaveSummary.pending}
            </span>
          </div>

          {/* Approved Leaves */}
          <div className="bg-emerald-50 rounded-lg p-4 flex flex-col">
            <span className="text-teal-700 text-sm font-medium">Approved</span>
            <span className="text-2xl font-semibold text-teal-700 mt-1">
              {isLeaveTransactionLoading ? "-" : leaveSummary.approved}
            </span>
          </div>

          {/* Rejected Leaves */}
          <div className="bg-red-50 rounded-lg p-4 flex flex-col">
            <span className="text-red-700 text-sm font-medium">Declined</span>
            <span className="text-2xl font-semibold text-red-700 mt-1">
              {isLeaveTransactionLoading ? "-" : leaveSummary.declined}
            </span>
          </div>
        </div>
      </div>

      <CardContent>
        {isLeaveTransactionLoading ? (
          <PageLoader />
        ) : (
          <CustomTable
            data={leaveTransaction?.results || []}
            columns={LeaveAplicationColumns}
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
