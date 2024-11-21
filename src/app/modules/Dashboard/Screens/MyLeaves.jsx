// import { getLeaveApplications } from "app/hooks/leaveManagment";
// import { Status } from "app/modules/LeaveManagment/Sections";
import { StatusLabel } from "components";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardSubtitle,
} from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "../../../../src/@/components/ui/table";
import { getLeaveTransaction } from "app/hooks/leaveTracker";
import { connect } from "react-redux";
import { PageLoader } from "components";
import { FilterInput } from "components/form-control";
import { LeaveTrackerOptions } from "data/Data";
import { getLeaveComponents } from "app/hooks/leaveTracker";
import ApplyLeaveSheet from "app/modules/LeaveTracker/Sections/ApplyLeaveSheet";
const MyLeaves = ({ userProfile }) => {
  const [isLeaveTransactionLoading, setIsLeaveTransactionLoading] =
    useState(true);
  const [leaveTransaction, setLeaveTransaction] = useState([]);
  const [filterData, setFilterData] = useState({
    employee_id: userProfile.id,
  });
  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState("");

  const fetchLeaveTransaction = async () => {
    setIsLeaveTransactionLoading(true);
    const leaveTransaction = await getLeaveTransaction({
      filterData,
      options: { page: 1, sizePerPage: 7 },
    });
    if (leaveTransaction) {
      console.log("leaveTransaction", leaveTransaction);
      setLeaveTransaction(leaveTransaction);
    }
    setIsLeaveTransactionLoading(false);
  };

  const fetchData = async () => {
    const leaveTypesData = await getLeaveComponents({
      filterData: { employee_id_and_org: `${userProfile.id},${true}` },
    });
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
    setPage(1);
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
      <Card className="w-full col-span-2">
        <CardHeader className="items-start pb-0">
          <CardTitle className="flex flex-row justify-between w-full">
            <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
              My Leaves
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
                    width: "max-w-[145px]",
                    option: leaveTypesData.map((leave) => ({
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
              <ApplyLeaveSheet reload={fetchLeaveTransaction} />
            </div>
          </CardTitle>
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
            {isLeaveTransactionLoading ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex items-center justify-center w-full">
                      <PageLoader />
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {leaveTransaction?.results?.map((leave, index) => (
                  <TableRow key={index} className="cursor-pointer">
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
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(MyLeaves);
