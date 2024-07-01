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
import { getLeaveApplications, getLeaveTypes } from "app/hooks/leaveManagment";
import { FilterInput } from "components/form-control";
import moment from "moment";
import { StatusLabel } from "components";
import { LeaveType } from "utils/getValuesFromTables";
import checked from "../../../assets/images/checked.svg";
import employee from "../../../assets/images/employee.svg";
import time from "../../../assets/images/time.svg";
import cross from "../../../assets/images/cross.svg";
import Select from 'react-select';
import Block from "./Sections/Blocks";
import LeaveCount from "./Sections/LeaveCount";


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

        const URL = `/leave?ordering=date&page=${options.page}&page_size=${options.sizePerPage
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
      {/* <Row className="mb-5">
        <Col lg={6}>
          <Tabs
                        onTabChange={setActiveTab}
                        activeTab={activeTab}
                        activeJobId={jobIdForFilter}
                        changeJobFilter={(jobId) => { handleFilterChange('job_id', jobId) }}
                    />
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
      </Row> */}
      <div className="w-full flex flex-col md:flex-row gap-4 mb-4">
        <div className="bg-white md:w-[60%] flex items-center rounded-lg">
          {/* Left section */}
          <div className="md:w-[45%] px-4 py-2 rounded-lg">
            <h2 className="text-base font-lato text-baseGray font-semibold mb-2">
              My Leave Allowance
            </h2>
            <div className="text-3xl font-bold text-[#00A8F0] mb-6">
              25 days
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 mb-2">Leave Year</label>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option>22-04-24 - 22-04-24</option>
              </select>

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
                  }
                ]}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Center section */}

          <div className="md:w-[55%] flex flex-col md:flex-row items-center justify-around">
            <LeaveCount
              title="Leaves Remaining"
              leaveCount="05"
              borderColor="#00A8F0"
              clipPath="inset(0 0 0 20%)"
            />
            <LeaveCount
              title="Leaves Used"
              leaveCount="08"
              borderColor="#556CBF"
              clipPath="inset(0 70% 0 0)"
            />
          </div>
        </div>

        {/* right */}

        <div className="md:w-[45%] flex justify-center items-center">
          <div className="grid grid-cols-2 gap-2 h-full w-full max-w-5xl">
            <Block icon={checked} count={6} label={'Approved'} />
            <Block icon={time} count={1} label={'Pending'} />
            <Block icon={employee} count={8} label={'Request'} />
            <Block icon={cross} count={1} label={'Denied'} />

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
                      {/* <BootstrapTable
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
                      </BootstrapTable> */}
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
