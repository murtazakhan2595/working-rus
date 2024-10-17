import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PageLoader, Header } from "components";
import { MyLeavesColumns } from "app/utils/Types/TableColumns";

import { FaPlus } from "react-icons/fa";
import { LeaveStatus } from "data/Data";
import {
  getLeaveApplications,
  getEmployeeLeaveTypes,
  deleteLeaveRequest,
} from "app/hooks/leaveManagment";
import { FilterInput } from "components/form-control";
import { getEmployeeLeavesTypesList } from "utils/Lists";
import LeaveTrackerStats from "./LeaveTrackerStats";
import CustomTable  from '../../../components/CustomTable';
import { Button } from "components/ui/button";
import { Card, CardHeader, CardContent } from "components/ui/card";


/**
 * LeaveTracker component
 * 
 * Renders a leave tracker table with filtering and pagination capabilities
 * 
 * @param {object} userProfile - User profile object containing employee ID
 * @param {array} leaveTypes - Array of leave types
 * 
 * @returns {JSX.Element} Leave tracker table component
 */
const LeaveTracker = ({ userProfile, leaveTypes }) => {
  /**
   * State variables
   */
  const [Leave, setLeave] = useState([]); // Leave applications data
  const [isLoading, setIsLoading] = useState(true); // Loading indicator
  const [leaveTypesOfEmployee, setLeaveTypesOfEmployee] = useState([]); // Leave types available to employee
  const [filterData, setFilterData] = useState({}); // Filter data for leave applications
  const [options, setOptions] = useState({
    page: 1, // Current page number
    sizePerPage: 10, // Number of items per page
  });

  /**
   * onPageChange handler
   * 
   * Updates page options when pagination changes
   * 
   * @param {string} name - Page option name (e.g. "page")
   * @param {any} value - New value for page option
   */
  const onPageChange = (name, value) => {
    const pageOptions = options;
    if (pageOptions[name] !== value) {
      pageOptions[name] = value;
      setOptions((prevOptions) => ({ ...prevOptions, ...pageOptions }));
    }
  };

  /**
   * useEffect hook to fetch leave applications data
   * 
   * Fetches leave applications data when options or filterData changes
   */
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

  /**
   * useEffect hook to fetch leave types data
   * 
   * Fetches leave types data when leaveTypes or userProfile changes
   */
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const leaveTypesResponse = await getEmployeeLeaveTypes({
          employee_id: userProfile.id,
        });
        if (leaveTypesResponse) {
          const leaveTypes_list = getEmployeeLeavesTypesList(
            leaveTypes,
            leaveTypesResponse.results
          );
          setLeaveTypesOfEmployee(leaveTypes_list);
        }
      } catch (error) {
        console.error("Error fetching leave types:", error);
      }
    };
    fetchLists();
  }, [leaveTypes, userProfile]);

  /**
   * handleFilterChange handler
   * 
   * Updates filter data when filter changes
   * 
   * @param {string} filterName - Filter name (e.g. "status_hr")
   * @param {any} filterValue - New filter value
   */
  const handleFilterChange = (filterName, filterValue) => {
    if (filterName === "status_hr" && filterValue) {
      filterValue =
        filterValue === "Approved"
          ? "Approved by HR"
          : filterValue === "Denied"
          ? "Declined by HR"
          : "pending";
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

  /**
   * Table options
   */
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  return (
    <div className="screen bg-[#F0F1F2]">
      {/* <Header
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
      <LeaveTrackerStats
        leaveTypes={leaveTypesOfEmployee}
        userProfile={userProfile}
      />
      <div>
        <div lg={12} className="mx-auto">
          <Card className="p-0">
            <CardHeader>
              <div>
                <div lg={12}>
                  <div className="flex justify-between px-3 py-3">
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
                    <Button variant="default" >
                      <Link to="/request-leave">Leave request</Link>
                    </Button>
                    </div></div>
                  </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>
                  <div lg={12}>
                    <PageLoader />
                  </div>
                </div>
              ) : (
                
                      <CustomTable
                        data={Leave?.results || []}
                        columns={MyLeavesColumns}
                        pagination={true}
                        dataTotalSize={Leave?.count || 0}
                        tableOptions={tableOptions}
                      />
               
              )}
            </CardContent>
          </Card>
        </div>
      </div> */}
    </div>
   );
  };
  
  /**
   * mapStateToProps function
   *
   * Maps the state to props for the LeaveTracker component
   *
   * @param {object} state - The application state
   *
   * @returns {object} An object with the mapped props
   */
  const mapStateToProps = (state) => {
    return {
      userProfile: state.user.userProfile,
      leaveTypes: state.common.leaveTypes,
    };
  };
  
  export default connect(mapStateToProps)(LeaveTracker);