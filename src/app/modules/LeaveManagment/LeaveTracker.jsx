import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PageLoader, Header } from "components";
import { MyLeavesColumns } from "app/utils/Types/TableColumns";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import { FaPlus } from "react-icons/fa";
import { LeaveStatus } from "data/Data";
import {
  getLeaveApplications,
  getEmployeeLeaveTypes,
  deleteLeaveRequest,
} from "app/hooks/leaveManagment";
import { FilterInput } from "components/form-control";
import { Table } from "components";
import checked from "../../../assets/images/checked.svg";
import employee from "../../../assets/images/employee.svg";
import time from "../../../assets/images/time.svg";
import cross from "../../../assets/images/cross.svg";
import Block from "./Sections/Blocks";
import LeaveCount from "./Sections/LeaveCount";
import { getEmployeeLeavesTypesList, yearsDropdownList } from "utils/Lists";

const LeaveTracker = ({ userProfile, leaveTypes }) => {
  const [Leave, setLeave] = useState([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [leaveTypesOfEmployee, setLeaveTypesOfEmployee] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [filterStats, setFilterStats] = useState({});
  const [leaveYear, setLeaveYear] = useState(null);
  const [totalApproved, setTotalApproved] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [deniedRequests, setDeniedRequests] = useState(0);
  const [allotedLeaves, setAllotedLeaves] = useState(0);
  const [remainingLeaves, setRemainingLeaves] = useState(0);
  const [usedLeaves, setUsedLeaves] = useState(0);
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });


  const onPageChange = (name, value) => {
    const pageOptions = options;
    if (pageOptions[name] !== value) {
      pageOptions[name] = value;
      setOptions((prevOptions) => ({ ...prevOptions, ...pageOptions }));
    }
  };
  
  const defaultYear = new Date().getFullYear();

  useEffect(() => {
    setFilterData({ employee_id: userProfile.id });
    setLeaveYear(defaultYear);
  }, [userProfile]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        setIsLoading(true);
        const applicationsData = await getLeaveApplications({
          options,
          filterData,
        });
        if (applicationsData) {
          console.log("applicationsData", applicationsData);
          setLeave(applicationsData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchdata();
  }, [options, filterData]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsStatsLoading(true);
        const leaveTypesResponse = await getEmployeeLeaveTypes({
          employee_id: userProfile.id,
          ...filterStats,
        });

        if (leaveTypesResponse) {
          setLeaveTypesOfEmployee(
            getEmployeeLeavesTypesList(leaveTypes, leaveTypesResponse.results)
          );
          setAllotedLeaves(leaveTypesResponse.allotedLeaves);
          setRemainingLeaves(leaveTypesResponse.remainingLeaves);
          setUsedLeaves(leaveTypesResponse.usedLeaves);
        }

        setIsStatsLoading(false);
      } catch (error) {
        console.error("Error fetching leave types:", error);
      }
    };
    fetchLists();
  }, [leaveTypes, userProfile, filterStats]);

  const handleFilterChange = (filterName, filterValue) => {
    if(filterName === "status_hr" && filterValue){
      filterValue = filterValue==="Approved"? "Approved by HR": filterValue==="Denied"? "Declined by HR": "pending";
    }
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === undefined) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };
  const handlestatsChange = (filterName, filterValue) => {
    setFilterStats((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === undefined) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  }

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  return (
    <div className="screen bg-[#F0F1F2]">
      <Header
        title="My Leave Request"
        content={
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search",
                name: "id_and_first_name",
              },
            ]}
            onChange={handleFilterChange}
          />
        }
      />
      <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
        <div className="bg-white md:w-[60%] flex items-center rounded-lg">
          {/* Left section */}
          <div className="md:w-[45%] px-4 py-2 rounded-lg">
            <h2 className="text-base font-lato text-baseGray font-semibold mb-2">
              My Leave Allowance
            </h2>
            <div className="text-3xl font-bold text-[#00A8F0] mb-6">
              {allotedLeaves} days
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 mb-2">Leave Year</label>
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
            <div className="mb-2">
              <label className="block text-gray-700 mb-2">Leave Type</label>
              <FilterInput
                filters={[
                  {
                    type: "select",
                    option: leaveTypes,
                    name: "leave_type",
                    placeholder: "Leave Type",
                  },
                ]}
                onChange={handlestatsChange}
              />
            </div>
          </div>

          {/* Center section */}

          <div className="md:w-[55%] flex flex-col md:flex-row items-center justify-around">
            <LeaveCount
              title="Leaves Remaining"
              leaveCount={remainingLeaves}
              borderColor="#00A8F0"
              clipPath="inset(0 0 0 20%)"
            />
            <LeaveCount
              title="Leaves Used"
              leaveCount={usedLeaves}
              borderColor="#556CBF"
              clipPath="inset(0 70% 0 0)"
            />
          </div>
        </div>

        {/* right */}

        <div className="md:w-[45%] flex justify-center items-center">
          <div className="grid grid-cols-2 gap-2 h-full w-full max-w-5xl">
            <Block icon={checked} count={totalApproved} label={"Approved"} />
            <Block icon={time} count={pendingRequests} label={"Pending"} />
            <Block icon={employee} count={totalRequests} label={"Request"} />
            <Block icon={cross} count={deniedRequests} label={"Denied"} />
          </div>
        </div>
      </div>
      <Row>
        <Col lg={12} className="mx-auto">
          <Card className="p-0">
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="py-3 px-3 flex justify-between">
                    <FilterInput
                      filters={[
                        {
                          type: "select",
                          option: leaveTypesOfEmployee,
                          name: "leave_type",
                          placeholder: "Leave Type",
                        },
                        {
                          type: "select",
                          option: LeaveStatus,
                          name: "status_hr",
                          placeholder: "Status",
                        },
                      ]}
                      onChange={handleFilterChange}
                    />

                    <div className="flex items-center gap-x-3">
                      <div className="font-lato text-[#47484C] text-[17px]">
                        New Leave Request
                      </div>
                      <Link
                        to="/leave-request"
                        className="p-2 rounded-md bg-black"
                        style={{ fontSize: "12px" }}
                      >
                        <FaPlus className="text-white" />
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Row>
                  <Col lg={12}>
                    <PageLoader />
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col lg={12}>
                    <div>
                      <Table
                        data={Leave?.results || []}
                        columns={MyLeavesColumns}
                        pagination={true}
                        dataTotalSize={Leave?.count || 0}
                        tableOptions={tableOptions}
                      />
                    </div>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    leaveTypes: state.common.leaveTypes,
  };
};

export default connect(mapStateToProps)(LeaveTracker);
