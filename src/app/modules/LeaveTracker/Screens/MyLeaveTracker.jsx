
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
import { FilterInput } from "components/form-control";

const MyLeaveTracker = ({userProfile}) => {
  const [leaveData, setLeaveData] = useState({});
  const [selectedLeaveApplication, setSelectedLeaveApplication] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [LeaveTrackerStats, setLeaveTrackerStats] = useState([
    {title: "Total Applications", value: 5},
    {title: "Pending Requests", value: 2},
    {title: "Accepted Requests", value: 3},
  ]);
console.log("setSelectedLeaveApplication", selectedLeaveApplication);
  useEffect(() => {
    const fetchData = async () => {
      const leaves = await getLeaves({filterData: {employee: userProfile.id}})
      if(leaves){
        setLeaveData(leaves)
      }
    }
    fetchData()
  },[])


  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-10 justify-between items-center h-9">
        <div className="flex-col justify-start items-start inline-flex">
          <div className="text-black text-3xl font-semibold">
            My Leave Tracker
          </div>
        </div>
        {<ApplyLeaveSheet />}
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
          leaveData={leaveData}
          setSelectedLeaveApplication={setSelectedLeaveApplication}
          setIsOpen={setIsOpen}
          handleFilterChange={handleFilterChange}
        />{" "}
        <ConsumedLeaves />
      </div>
      {selectedLeaveApplication && (
        <ViewLeaveSheet
          leaveApplication={selectedLeaveApplication}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isMyLeave={true}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(MyLeaveTracker);



function AppliedLeaves({
  leaveData,
  setSelectedLeaveApplication,
  setIsOpen,
  handleFilterChange,
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
              option: [],
              name: "expense_type",
              placeholder: "Expense Type",
              width:"max-w-[130px]"
            },
            {
              type: "select-two",
               width:"max-w-[130px]",
              option: [
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
              ],
              name: "status",
              placeholder: "Status",
            },
          ]}
          onChange={handleFilterChange}
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Leave Type</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveData?.results?.map((leave, index) => (
              <TableRow
                key={index}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedLeaveApplication({
                    component_name: "Annual Leave",
                    start_date: leave.start_date,
                    end_date: leave.end_date,
                    no_of_days: leave.no_of_days,
                    reason: leave.reason,
                    action_manager: leave.action_manager,
                    action_hr: leave.action_hr,
                    action_superadmin: "Pending",
                    created_at: leave.created_at,
                  });
                  setIsOpen(true);
                }}
              >
                <TableCell>{"-"}</TableCell>
                <TableCell>{leave.no_of_days}</TableCell>
                <TableCell>
                  {`${moment(leave.start_date).format("MMM D")} - ${moment(
                    leave.end_date
                  ).format("MMM D")}`}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                      leave.status === "Approved"
                        ? "bg-emerald-50 text-teal-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {leave.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


function ConsumedLeaves() {
  const leaveTypes = [
    { name: "Annual", used: 6, total: 10 },
    { name: "Sick", used: 8, total: 10 },
    { name: "Emergency", used: 5, total: 14 },
    { name: "Casual", used: 5, total: 6 },
    { name: "Compensatory", used: 7, total: 12 },
    { name: "Maternity", used: 6, total: 12 },
    { name: "Bereavement", used: 9, total: 12 },
    { name: "Special", used: 2, total: 12 },
  ];

  function LeaveBar({
    used,
    total,
    usedColor = "#AB4ABA",
    totalColor = "#F0F0F3",
  }) {
    const usedWidth = Math.min((used / total) * 100, 100);

    return (
      <div className="relative w-full h-4 rounded-xl overflow-hidden">
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
        <CardTitle className="text-2xl font-medium text-fuchsia-700">
          Consumed Leaves
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-neutral-800 mb-4">
            CTC Components
          </h3>
          <div className="flex relative gap-4 items-start">
            <div className="flex flex-col justify-center text-sm leading-tight whitespace-nowrap text-neutral-400">
              {leaveTypes.map((leave) => (
                <div key={leave.name} className="mt-4 first:mt-0">
                  {leave.name}
                </div>
              ))}
            </div>
            <div className="flex flex-col flex-1 justify-between self-stretch min-w-[240px]">
              {leaveTypes.map((leave) => (
                <LeaveBar
                  key={leave.name}
                  used={leave.used}
                  total={leave.total}
                />
              ))}
            </div>
            <div className="flex flex-col justify-center text-sm font-medium leading-tight text-neutral-400">
              {leaveTypes.map((leave) => (
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
