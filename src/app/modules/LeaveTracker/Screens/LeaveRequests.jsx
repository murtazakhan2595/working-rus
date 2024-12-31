import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
 
} from "../../../../components/ui/card";
import { FilterInput } from "components/form-control.jsx";
import CustomTable from "components/CustomTable";
import { connect } from "react-redux";

import ViewLeaveSheet from "../Sections/ViewLeaveSheet";
import { PageLoader } from "components";
import { getLeavestats } from "app/hooks/leaveTracker";
import {
  getLeaveTransaction,
  getLeaveComponents,
} from "app/hooks/leaveTracker";
import { LeaveAplicationColumns } from "app/utils/Types/TableColumns";
import { LeaveTrackerOptions } from "data/Data";
import { Header } from "components";
import Stats from "../../../../components/ui/Stats";
import { UserRoundCheck, UsersRound } from "lucide-react";

const LeaveRequests = ({ userProfile, departments }) => {
  const [selectedLeaveApplication, setSelectedLeaveApplication] =
    useState(null);
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [leaveTransaction, setLeaveTransaction] = useState();
  const [isLeaveTransactionLoading, setIsLeaveTransactionLoading] =
    useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState("");

  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onRowClick: (row) => {
      setSelectedLeaveApplication(row);
      setIsOpen(true);
    },
  };

  const [LeaveTrackerStats, setLeaveTrackerStats] = useState([
    { label: "Total Applications", value: 0, icon: UsersRound },
    { label: "Pending Requests", value: 0, icon: UserRoundCheck },
    { label: "Accepted Requests", value: 0, icon: UserRoundCheck },
  ]);

  
  const fetchData = async () => {
    setLoading(true);
    const statsData = await getLeavestats({});
    if (statsData) {
      setLeaveTrackerStats([
        {
          label: "Total Applications",
          value: statsData?.total_applications,
          icon: UsersRound
        },
        {
          label: "Pending Requests",
          value: statsData?.pending_applications,
          icon: UserRoundCheck
        },
        {
          label: "Accepted Requests",
          value: statsData?.accepted_applications,
          icon: UserRoundCheck
        },
      ]);
    }
    setLoading(false);
    const leaveTypesData = await getLeaveComponents({});
    if (leaveTypesData) {
      setLeaveTypesData(leaveTypesData);
    }
  };

  const fetchLeaveTransaction = async () => {
    setIsLeaveTransactionLoading(true);
    let filter = {};
    if (userProfile.role === 2) {
      filter = { managers: userProfile.id, ...filterData };
    } else {
      filter = { ...filterData };
    }
    const leaveTransaction = await getLeaveTransaction({
      filterData: filter,
      options,
    });
    if (leaveTransaction) {
      setLeaveTransaction(leaveTransaction);
    }
    setIsLeaveTransactionLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchLeaveTransaction();
  }, [filterData, options]);

  const handleFilterChange = (filterName, filterValue) => {
    
    onPageChange("page", 1);
    if (filterName === "departmentt") setSelectedDepartment(filterValue);
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
      {loading ? (
        <PageLoader />
      ) : (
        <div className="flex flex-col gap-4">
          <Header />
          <div className="p-6">
            <Stats stats={LeaveTrackerStats} />
          </div>
          <div className="self-end">
            <FilterInput
              filters={[
                {
                  type: "select-one",
                  option: departments,
                  name: "departmentt",
                  width: "max-w-[130px]",
                  placeholder: "Department",
                  values: selectedDepartment,
                  value: selectedDepartment
                },
                {
                  type: "select-two",
                  option: LeaveTrackerOptions,
                  name: "status",
                  width: "max-w-[130px]",
                  placeholder: "Status",
                  values: selectedStatus,
                  value: selectedStatus
                },
                {
                  type: "select-three",
                  width: "max-w-[130px]",
                  option: leaveTypesData?.results?.map((leave) => ({
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
          </div>
          <Card>
            <CardContent>
              {isLeaveTransactionLoading ? (
                <PageLoader />
              ) : (
                <CustomTable
                  data={leaveTransaction?.results || []}
                  columns={LeaveAplicationColumns}
                  pagination={true}
                  dataTotalSize={leaveTransaction?.count || 0}
                  tableOptions={tableOptions}
                />
              )}
            </CardContent>
          </Card>
          {selectedLeaveApplication && (
            <ViewLeaveSheet
              leaveApplication={selectedLeaveApplication}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isMyLeave={false}
              reload={fetchData}
              onClose={() => {
                setIsOpen(false);
                setSelectedLeaveApplication(null); // Reset the selected application
              }}
            />
          )}
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(LeaveRequests);
