import { Button } from "components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

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
import { FilterInput } from "components/FormControl";
import { getLeavestats } from "app/hooks/leaveTracker";
import { getLeaveTransaction } from "app/hooks/leaveTracker";
import { getLeaveComponents } from "app/hooks/leaveTracker";
import { getLeaveComponentsWithUsed } from "app/hooks/leaveTracker";
import { PageLoader } from "components";
import { LeaveTrackerOptions } from "data/Data";

const MyLeaveTracker = ({ userProfile }) => {
  const [leaveData, setLeaveData] = useState({});
  const [selectedLeaveApplication, setSelectedLeaveApplication] =
    useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [filterData, setFilterData] = useState({ employee_id: userProfile.id });
  const [isLoading, setIsLoading] = useState(true);
  const [isLeaveTransactionLoading, setIsLeaveTransactionLoading] =
    useState(true);
  const [componentsWithUsed, setComponentsWithUsed] = useState([]);
  const [LeaveTrackerStats, setLeaveTrackerStats] = useState([
    { title: "Total Applications", value: 0 },
    { title: "Pending Requests", value: 0 },
    {
      title: "Accepted Requests",
      value: 0,
    },
  ]);
  const [leaveTransaction, setLeaveTransaction] = useState([]);

  const fetchLeaveTransaction = async () => {
    setIsLeaveTransactionLoading(true);
    const leaveTransaction = await getLeaveTransaction({
      filterData,
    });
    if (leaveTransaction) {
      console.log("leaveTransaction", leaveTransaction);
      setLeaveTransaction(leaveTransaction?.results);
    }
    setIsLeaveTransactionLoading(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    const leaves = await getLeaves({
      filterData: { employee: userProfile.id },
    });
    if (leaves) {
      setLeaveData(leaves);
    }
    const statsData = await getLeavestats({
      filterData: { employee_id: userProfile.id },
    });
    if (statsData) {
      const { leave_stats } = statsData;
      setLeaveTrackerStats([
        {
          title: "Total Applications",
          value: leave_stats?.total_applications,
        },
        {
          title: "Pending Requests",
          value: leave_stats?.pending_applications,
        },
        {
          title: "Accepted Requests",
          value: leave_stats?.accepted_applications,
        },
      ]);
    }

    const componentsWithUsed = await getLeaveComponentsWithUsed(userProfile.id);
    if (componentsWithUsed) {
      setComponentsWithUsed(componentsWithUsed);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchLeaveTransaction();
  }, [filterData]);

  const handleFilterChange = (filterName, filterValue) => {
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
      {isLoading ? (
        <PageLoader />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-10 justify-between items-center h-9">
            <div className="flex-col justify-start items-start inline-flex">
              <div className="text-black text-3xl font-semibold">
                My Leave Tracker
              </div>
            </div>
            <ApplyLeaveSheet
              reload={async () => {
                await Promise.all([fetchData(), fetchLeaveTransaction()]);
              }}
            />
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
          <div className="flex items-start justify-center gap-4">
            <AppliedLeaves
              leaveTransaction={leaveTransaction}
              setSelectedLeaveApplication={setSelectedLeaveApplication}
              setIsOpen={setIsOpen}
              handleFilterChange={handleFilterChange}
              componentsWithUsed={componentsWithUsed}
              isLeaveTransactionLoading={isLeaveTransactionLoading}
            />{" "}
            <ConsumedLeaves componentsWithUsed={componentsWithUsed} />
          </div>
          {selectedLeaveApplication && (
            <ViewLeaveSheet
              leaveApplication={selectedLeaveApplication}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isMyLeave={true}
              onClose={() => {
                setSelectedLeaveApplication(null);
                setIsOpen(false);
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
  };
};

export default connect(mapStateToProps)(MyLeaveTracker);

function AppliedLeaves({
  leaveTransaction,
  setSelectedLeaveApplication,
  setIsOpen,
  handleFilterChange,
  componentsWithUsed,
  isLeaveTransactionLoading,
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl text-fuchsia-700">
          Applied Leaves
        </CardTitle>
        <FilterInput
          filters={[
            {
              type: "select-one",
              option: LeaveTrackerOptions,
              name: "status",
              width: "max-w-[130px]",
              placeholder: "Status",
            },
            {
              type: "select-two",
              width: "max-w-[130px]",
              option: componentsWithUsed.map((leave) => ({
                value: leave.leaveComponentId,
                label: leave.name,
              })),
              name: "leave_component_id",
              placeholder: "Leave Type",
            },
          ]}
          onChange={handleFilterChange}
        />
      </CardHeader>
      <CardContent className="scrollable table-container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Leave Type</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          {isLeaveTransactionLoading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={4}>
                  <div className="w-full flex items-center justify-center">
                    <PageLoader />
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {leaveTransaction?.results?.map((leave, index) => (
                <TableRow
                  key={index}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedLeaveApplication(leave);
                    setIsOpen(true);
                  }}
                >
                  <TableCell>{leave?.component_name}</TableCell>
                  <TableCell>{leave?.leave_request?.no_of_days}</TableCell>
                  <TableCell>
                    {`${moment(leave?.leave_request?.start_date).format(
                      "MMM D"
                    )} - ${moment(leave?.leave_request?.end_date).format(
                      "MMM D"
                    )}`}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                        leave?.action_hr === "Approved" &&
                        leave?.action_manager === "Approved"
                          ? "bg-emerald-50 text-teal-700"
                          : leave?.action_hr === "Declined" ||
                            leave?.action_manager === "Declined"
                          ? "bg-red-50 text-red-700"
                          : "bg-[#f0f0f3] text-[#7f838d]"
                      }`}
                    >
                      {leave?.action_hr === "Approved" &&
                      leave?.action_manager === "Approved"
                        ? "Approved"
                        : leave?.action_hr === "Declined" ||
                          leave?.action_manager === "Declined"
                        ? "Declined"
                        : "Pending"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}

function ConsumedLeaves({ componentsWithUsed }) {
  function LeaveBar({
    used,
    total,
    usedColor = "#AB4ABA",
    totalColor = "#F0F0F3",
  }) {
    const usedWidth = Math.min((used / total) * 100, 100);

    return (
      <div className="relative w-full h-2 rounded-xl overflow-hidden">
        {/* Total bar */}
        <div
          className="absolute top-0 left-0 h-full w-full"
          style={{ backgroundColor: totalColor }}
        />
        {/* Used bar */}
        <div
          className="absolute top-0 left-0 h-full"
          style={{ width: `${usedWidth}%`, backgroundColor: usedColor }}
        />
      </div>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-medium text-fuchsia-700 font-[inter]">
          <div className=" font-[inter]">Consumed Leaves</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-neutral-800 mb-4">
            CTC Components
          </h3>
          <div className="flex relative gap-4 items-start">
            <div className="flex flex-col justify-center text-sm leading-tight whitespace-nowrap text-neutral-900">
              {componentsWithUsed.map((leave) => (
                <div key={leave.name} className="mt-4 first:mt-0">
                  {leave.name}
                </div>
              ))}
            </div>
            <div className="flex flex-col flex-1 justify-between self-stretch min-w-[240px]">
              {componentsWithUsed.map((leave) => (
                <LeaveBar
                  key={leave.name}
                  used={leave.used}
                  total={leave.total}
                />
              ))}
            </div>
            <div className="flex flex-col justify-center text-sm font-medium leading-tight text-neutral-400">
              {componentsWithUsed.map((leave) => (
                <div key={leave.name} className="mt-4 first:mt-0">
                  <span className="text-neutral-800">{leave.used}</span>/
                  {leave.total}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
