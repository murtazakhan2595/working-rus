import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { FilterInput } from "components/form-control.jsx";
import CustomTable from "components/CustomTable";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../src/@/components/ui/table";
import ApplyLeaveSheet from "../Sections/ApplyLeaveSheet";
import { getLeaves } from "app/hooks/leaveTracker";
import { connect } from "react-redux";
import moment from "moment";
import ViewLeaveSheet from "../Sections/ViewLeaveSheet";
import { PageLoader } from "components";
import { getLeavestats } from "app/hooks/leaveTracker";
import {
  getLeaveTransaction,
  getLeaveComponents,
} from "app/hooks/leaveTracker";
import { LeaveAplicationColumns } from "app/utils/Types/TableColumns";
import { LeaveTrackerOptions } from "data/Data";

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
    { title: "Total Applications", value: 0 },
    { title: "Pending Requests", value: 0 },
    { title: "Accepted Requests", value: 0 },
  ]);
  console.log("leavesTypedata", leaveTypesData);
  const fetchData = async () => {
    setLoading(true);
    const statsData = await getLeavestats({});
    if (statsData) {
      setLeaveTrackerStats([
        {
          title: "Total Applications",
          value: statsData?.total_applications,
        },
        {
          title: "Pending Requests",
          value: statsData?.pending_applications,
        },
        {
          title: "Accepted Requests",
          value: statsData?.accepted_applications,
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
          <div className="flex flex-wrap gap-10 justify-between items-center h-9">
            <div className="flex-col justify-start items-start inline-flex">
              <div className="text-black text-3xl font-semibold">
                Leave Requests
              </div>
            </div>
          </div>
          <div className="p-6">
            <section className="flex flex-wrap gap-4 items-center">
              {LeaveTrackerStats.map((item, index) => (
                <React.Fragment key={item.title}>
                  <div className="flex-1 shrink min-w-[240px]">
                    <div className="pb-2">
                      <h2 className="text-sm font-medium tracking-tight leading-none text-neutral-800">
                        {item.title}
                      </h2>
                    </div>
                    <div>
                      <p className="text-2xl font-bold leading-tight text-fuchsia-700">
                        {item.value}
                      </p>
                    </div>
                  </div>
                  {index < LeaveTrackerStats.length - 1 && (
                    <div className="relative">
                      <div className="w-[70px] h-[1px]  rotate-90 border border-[#deade2] absolute top-0 right-[55px]"></div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </section>
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
                },
                {
                  type: "select-two",
                  option: LeaveTrackerOptions,
                  name: "status",
                  width: "max-w-[130px]",
                  placeholder: "Status",
                },
                {
                  type: "select-three",
                  width: "max-w-[130px]",
                  option: leaveTypesData.map((leave) => ({
                    value: leave.id,
                    label: leave.name,
                  })),
                  name: "leave_component_id",
                  placeholder: "Leave Type",
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
