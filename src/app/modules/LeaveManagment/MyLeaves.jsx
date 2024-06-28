import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { dropdownOptions } from "data/Data";
import { PageLoader, Header } from "components";
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
import { cut, file, list } from "assets/images";
import { FaPlus } from "react-icons/fa";
import { LeaveStatus } from "data/Data";
import { Blocks } from "./Sections";
import { getLeaveApplications, getLeaveTypes } from "app/hooks/leaveManagment";
import { FilterInput } from "components/form-control";
import moment from "moment";
import { StatusLabel } from "components";
import { LeaveType } from "utils/getValuesFromTables";

const MyLeaves = ({ userProfile }) => {
  const [Leave, setLeave] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [leaveTypes, setLeaveTypes] = useState([]);
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
    setFilterData({ employee_id: userProfile.id });
  }, [userProfile]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const leaveTypesResponse = await getLeaveTypes();
        setLeaveTypes(leaveTypesResponse);

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
  }, [id, options, filterData]);

  const renderView = (row) => (
    <Link
      className="btn btn-outline-dark bg-white text-dark shadow-none"
      style={{ padding: ".35em .65em", fontSize: ".75em", minWidth: "100px" }}
      role={"button"}
    >
      View
    </Link>
  );
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };


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
      <Row className="mb-5">
        <Col lg={6}>
          {/* <Tabs
                        onTabChange={setActiveTab}
                        activeTab={activeTab}
                        activeJobId={jobIdForFilter}
                        changeJobFilter={(jobId) => { handleFilterChange('job_id', jobId) }}
                    /> */}
        </Col>
        <Col lg={6}>
          <Blocks
            blocks={[
              {
                label: "Approved",
                value: totalApproved,
                image: file,
              },
              {
                label: "Pending",
                value: pendingRequests,
                image: list,
              },
              {
                label: "Requests",
                value: totalRequests,
                image: file,
              },
              {
                label: "Denied",
                value: deniedRequests,
                image: cut,
              },
            ]}
          />
        </Col>
      </Row>
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
                          option: leaveTypes,
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
                      <BootstrapTable
                        data={Leave || []}
                        version="4"
                        remote
                        options={tableOptions}
                        fetchInfo={{ dataTotalSize: Leave?.length || 0 }}
                        className={"bootstrap-main-table"}
                      >
                        <TableHeaderColumn
                          isKey
                          className="table-header-bg"
                          dataField="start_date"
                          dataAlign="center"
                          dataFormat={(cell) => (
                            <>{moment(cell).format("DD-MM-YYYY")}</>
                          )}
                        >
                          Start Date
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          className="table-header-bg"
                          dataField="end_date"
                          dataAlign="center"
                          dataFormat={(cell) => (
                            <>{moment(cell).format("DD-MM-YYYY")}</>
                          )}
                        >
                          End Date
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="leave_type"
                          className="table-header-bg"
                          dataAlign="center"
                          dataFormat={(cell) => {
                            return <LeaveType value={cell} />;
                          }}
                        >
                          Leave Type
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="total_leave"
                          className="table-header-bg text-center"
                          headerAlign="center"
                          dataAlign="center"
                        >
                          Total Days
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          className="table-header-bg text-center overflow-visible"
                          headerAlign="center"
                          dataAlign="center"
                          dataFormat={(cell, row) => {
                            return <RenderStatus row={row} />;
                          }}
                        >
                          Status
                        </TableHeaderColumn>

                        <TableHeaderColumn
                          className="table-header-bg text-center"
                          dataAlign="center"
                          headerAlign="center"
                          dataFormat={(cell, row) => renderView(row)}
                        ></TableHeaderColumn>
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
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(MyLeaves);
