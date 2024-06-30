import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { dropdownOptions } from "data/Data";
import { PageLoader, Header, EmployeeNameInfo } from "components";
import { Status, getDecision, StatusIcon, RenderStatus } from "./Sections";
import {
  Card,
  CardHeader,
  CardBody,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from "reactstrap";
import { EmployeeID } from "utils/getValuesFromTables";
import { cut, file, list } from "assets/images";
import { FaPlus } from "react-icons/fa";
import { LeaveStatus } from "data/Data";
import { Blocks } from "./Sections";
import {
  getLeaveApplications,
  getEmployeeLeaveTypes,
} from "app/hooks/leaveManagment";
import { getEmployeeCustomList } from "app/hooks/general";
import { FilterInput } from "components/form-control";
import moment from "moment";
import { StatusLabel } from "components";
import { LeaveTypeOfEmployee } from "utils/getValuesFromTables";
import { getEmployeeLeavesTypesList } from "utils/Lists";

const LeaveHistory = ({
  userProfile,
  leaveTypes,
  designations,
  departments,
}) => {
  const [Leave, setLeave] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leaveTypesOfEmployee, setLeaveTypesOfEmployee] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [totalApproved, setTotalApproved] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [deniedRequests, setDeniedRequests] = useState(0);
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
    sortName: "",
    sortOrder: "",
  });
  const onSizePerPageList = (sizePerPage) => {
    if (options.sizePerPage !== sizePerPage) {
      setOptions((prevOptions) => ({ ...prevOptions, sizePerPage }));
    }
  };
  const onPageChange = (page, sizePerPage) => {
    if (options.page !== page) {
      setOptions((prevOptions) => ({ ...prevOptions, page }));
    }
  };

  const sortColumn = (sortName, sortOrder) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      sortName,
      sortOrder,
    }));
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const employeeData = await getEmployeeCustomList({
          options,
          filterData,
        });
        if (isMounted) {
          setEmployeeData(employeeData);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [options, filterData]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const URL = `/leave?ordering=date&page=${options.page}&page_size=${
          options.sizePerPage
        }&search=${encodeURIComponent(JSON.stringify(filterData))}`;
        const applicationsData = await getLeaveApplications(URL);
        if (applicationsData) {
          setLeave(applicationsData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchLists();
  }, [options, filterData]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const leaveTypesResponse = await getEmployeeLeaveTypes({
          employee_id: userProfile.id,
        });
        setLeaveTypesOfEmployee(
          getEmployeeLeavesTypesList(leaveTypes, leaveTypesResponse.results)
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchLists();
  }, [leaveTypes, userProfile]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange(1);
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

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onSizePerPageList,
    onPageChange,
    onSortChange: sortColumn,
    paginationPosition: "bottom",
  };

  return (
    <div className="screen bg-[#F0F1F2]">
      <Header title="Leave History" />
      <Row>
        <Col lg={12} className="mx-auto">
          <Card className="p-0">
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="flex justify-between">
                    <div className="py-3 px-3">
                      <FilterInput
                        filters={[
                          {
                            type: "text",
                            placeholder: "Search by Name",
                            name: "first_name",
                          },
                          {
                            type: "select",
                            option: departments,
                            name: "department_name",
                            placeholder: "Department",
                          },
                          {
                            type: "select",
                            option: designations,
                            name: "department_position",
                            placeholder: "Designation",
                          },
                        ]}
                        onChange={handleFilterChange}
                      />
                    </div>

                    <div className="py-3 px-3">
                      <FilterInput
                        filters={[
                          {
                            type: "date",
                            placeholder: "From",
                            name: "from",
                          },
                          {
                            type: "date",
                            name: "to",
                            placeholder: "To",
                          },
                        ]}
                        onChange={handleFilterChange}
                      />
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
                      <BootstrapTable
                        data={employeeData?.results || []}
                        version="4"
                        remote
                        options={tableOptions}
                        fetchInfo={{ dataTotalSize: employeeData?.count || 0 }}
                        className={"bootstrap-main-table"}
                      >
                        <TableHeaderColumn
                          className="table-header-bg"
                          dataField="employee_id"
                          dataAlign="center"
                          width="20%"
                          dataFormat={(cell, row) => (
                            <EmployeeNameInfo
                              name={`${row.first_name} ${row.last_name}`}
                              department={row.department_name}
                              position={row.department_position}
                            />
                          )}
                        >
                          Employees
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          tdStyle={{ whiteSpace: "normal" }}
                          isKey
                          dataField="id"
                          dataFormat={(cell) => {
                            return <EmployeeID value={cell} />;
                          }}
                          className="table-header-bg"
                        >
                          ID
                        </TableHeaderColumn>
                      </BootstrapTable>
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
    designations: state.common.designations,
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(LeaveHistory);
