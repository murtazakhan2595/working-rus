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

import { getEmployeeLeavesTypesList } from "utils/Lists";
import LeaveTrackerStats from "./LeaveTrackerStats";

const LeaveTracker = ({ userProfile, leaveTypes }) => {
  const [Leave, setLeave] = useState([]);
  // 
  const [isLoading, setIsLoading] = useState(true);
  const [leaveTypesOfEmployee, setLeaveTypesOfEmployee] = useState([]);
  const [filterData, setFilterData] = useState({});

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
  
  useEffect(() => {
    setFilterData({ employee_id: userProfile.id });
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
          const leaveTypesResponse = await getEmployeeLeaveTypes({
            employee_id: userProfile.id,
          });

          if (leaveTypesResponse) {
            setLeaveTypesOfEmployee(
              getEmployeeLeavesTypesList(leaveTypes, leaveTypesResponse.results)
            );
          }
        } catch (error) {
          console.error("Error fetching leave types:", error);
        }
      };
      fetchLists();
    }, [leaveTypes, userProfile]);



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
      <LeaveTrackerStats leaveTypes={leaveTypesOfEmployee} userProfile={userProfile} setLeaveTypesOfEmployee/>
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
                        to="/request-leave"
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
