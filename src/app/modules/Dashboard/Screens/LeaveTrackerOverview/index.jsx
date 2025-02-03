import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import moment from "moment";
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

const LeaveTrackerOverview = ({ userProfile }) => {
  const [isLeaveTransactionLoading, setIsLeaveTransactionLoading] =
    useState(true);
  const [leaveTransaction, setLeaveTransaction] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState("");

  const fetchLeaveTransaction = async () => {
    setIsLeaveTransactionLoading(true);
    const leaveTransaction = await getLeaveTransaction({
      filterData,
      options: { page: 1, sizePerPage: 5 },
    });
    if (leaveTransaction) {
      console.log("leaveTransaction", leaveTransaction);
      setLeaveTransaction(leaveTransaction);
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
      <Card className="xl:col-span-2 lg:col-span-2 md:col-span-2 sm:col-span-1 ">
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
                    value: selectedStatus
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
                    value: selectedLeaveType
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
      </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(LeaveTrackerOverview);
