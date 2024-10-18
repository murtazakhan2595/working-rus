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

const LeaveRequests = ({ userProfile }) => {
  const [leaveData, setLeaveData] = useState({});
  const [selectedLeaveApplication, setSelectedLeaveApplication] =
    useState(null);
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const [LeaveTrackerStats, setLeaveTrackerStats] = useState([
    { title: "Total Applications", value: 5 },
    { title: "Pending Requests", value: 2 },
    { title: "Accepted Requests", value: 3 },
  ]);
  console.log("setSelectedLeaveApplication", selectedLeaveApplication);
  useEffect(() => {
    const fetchData = async () => {
      const leaves = await getLeaves({
        filterData: { employee: userProfile.id },
      });
      if (leaves) {
        setLeaveData(leaves);
      }
    };
    fetchData();
  }, []);

    const handleFilterChange = (filterName, filterValue) => {
      onPageChange("page", 1);
      console.log("filterName", filterName);
      console.log("filterValue", filterValue);
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
            Leave Requests
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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-[47px] flex-col justify-center items-start inline-flex">
              <div className="flex-col justify-start items-start flex">
                <div className="self-stretch text-[#ab4aba] text-2xl font-medium font-['Inter'] leading-normal">
                  {userProfile.role === 2
                    ? "My Team Requests"
                    : "Employee Leaves Requests"}
                </div>
              </div>
              <div className="pt-1.5 flex-col justify-start items-start flex">
                <div className="flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#8b8d98] text-sm font-normal font-['Inter'] leading-[16.80px]">
                    Leaves Requests of all the employees are listed below
                  </div>
                </div>
              </div>
            </div>
            <FilterInput
              filters={[
                {
                  type: "select-one",
                  option: [],
                  name: "expense_type",
                  placeholder: "Expense Type",
                },
                {
                  type: "select-two",
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
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <PageLoader />
          ) : (
            <CustomTable
              data={[]}
              columns={[]}
              pagination={true}
              dataTotalSize={0}
              tableOptions={tableOptions}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(LeaveRequests);
