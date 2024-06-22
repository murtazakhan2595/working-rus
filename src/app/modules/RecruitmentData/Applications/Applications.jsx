import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { dropdownOptions } from "../../../../data/Data";
import PageLoader from "../../../../components/PageLoader";
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
} from 'reactstrap';
import { cut, file, list } from '../../../../assets/images';
import { AiOutlineDownload } from "react-icons/ai";
import { Blocks, Header } from "../Sections";
import { Tabs, StatusLabel } from "./Sections";
import {
  getJobApplications,
  updateApplicationStatus,
  downloadCV,
} from "../../../hooks/recruitment";
import { FilterInput } from '../../../../components/form-control';
import { BsThreeDots } from "react-icons/bs";
import moment from "moment";

const Applications = () => {
  const location = useLocation();
  const [jobIdForFilter, setJobIdForFilter] = useState(location?.state?.jobId ?? '');
  const [selectedRow, setSelectedRow] = useState(null);
  const [Applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("");
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(jobIdForFilter ? 1 : 0);
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const [filterData, setFilterData] = useState(jobIdForFilter ? { job_id: jobIdForFilter } : {});
  const [totalApplications, setTotalApplications] = useState(0);
  const [shortlistedApplications, setShortlistedApplications] = useState(0);
  const [selectedApplications, setSelectedApplications] = useState(0);
  const [rejectedApplications, setRejectedApplications] = useState(0);
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
    sortName: '',
    sortOrder: '',
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
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        // const URL = `/candidateall/?search=${encodeURIComponent(`{"application_status": "${applicationStatus}", "job_id": ${id}}`)}`
        const URL = `/candidateall/?page=${options.page}&page_size=${options.sizePerPage}&search=${encodeURIComponent(JSON.stringify(filterData))}`
        const applicationsData = await getJobApplications(URL);
        if (applicationsData) {
          setApplications({ count: applicationsData.count, data: applicationsData.results.candidate });
          setTotalApplications(applicationsData.results.total_count);
          setShortlistedApplications(applicationsData.results.shortlisted_application);
          setSelectedApplications(applicationsData.results.selected_application);
          setRejectedApplications(applicationsData.results.rejected_application);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchLists();
  }, [id, applicationStatus, options, filterData]);

  const handleOptionSelect = async (applicant, option) => {
    try {
      if (applicant) {
        const response = await updateApplicationStatus(
          applicant,
          option,
        );

        if (response.status === 200) {
          setFilterData({});
        } else {
          console.error("Failed to update application status");
        }
      }
      setSelectedRow(null);
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const renderAction = (row) => (
    <div>
      <ButtonDropdown
        isOpen={openDropdownRow === row.id}
        toggle={() => toggleDropdown(row.id)}
        className="float-end"
      >
        <DropdownToggle size="sm" className="btn-brand">
          <BsThreeDots onClick={() => toggleDropdown(row.id)} />
        </DropdownToggle>
        <DropdownMenu right>
          {dropdownOptions.map(option => {
            return (
              <>
                <DropdownItem onClick={() => handleOptionSelect(row, option.value)}>{option.label}</DropdownItem>
              </>
            )
          })}
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );

  const renderResume = (row) => (
    <div className="flex gap-x-2 items-center justify-center">
      <span
        title={row?.cv}
        className="font-lato text-base text-baseGray"
      >
        File
      </span>
      <button
        onClick={() =>
          downloadCV(row?.cv, row?.first_name)
        }
      >
        <AiOutlineDownload />
      </button>
    </div>
  );

  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  const renderCandidate = (cell, row) => (
    <>
      <div className="font-lato text-base text-[#323333]">
        {cell}
      </div>
      <div className="font-lato text-base text-baseGray">
        {`Exp. ${row?.Year_of_Experience} years`}
      </div>
    </>
  );

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
    paginationPosition: 'bottom',
  };


  return (
    <div className="screen bg-[#F0F1F2]">
      <Header
        title="Applications"
        content={
          <FilterInput
            filters={[
              { type: 'search', placeholder: 'Search', name: 'id_and_first_name' },
            ]}
            onChange={() => { }}
          />
        }
      />
      <Row className="mb-5">
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
                label: "Total applications",
                value: totalApplications,
                image: file,
              },
              {
                label: "Shortlisted applications",
                value: shortlistedApplications,
                image: list,
              },
              {
                label: "Selected applications",
                value: selectedApplications,
                image: file,
              },
              {
                label: "Rejected applications",
                value: rejectedApplications,
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
                  <div className="py-3 px-3">
                    <FilterInput
                      filters={[
                        { type: 'search', placeholder: 'Search by Keyword', name: 'id_and_first_name' },
                        { type: 'date', name: 'updated_at', placeholder: "Applied On" },
                        { type: 'select', option: dropdownOptions, name: 'application_status', placeholder: "Status" },
                        // { type: 'select', option: UserRoles, name: 'user_role', placeholder: "Role" }
                      ]}
                      onChange={handleFilterChange}
                    />
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
                        data={Applications?.data || []}
                        version="4"
                        hover
                        remote
                        pagination
                        options={tableOptions}
                        fetchInfo={{ dataTotalSize: Applications?.count || 0 }}
                        className={'bootstrap-main-table'}
                      >
                        <TableHeaderColumn
                          isKey
                          dataField="id"
                          className="table-header-bg text-center"
                          headerAlign="center"
                          dataAlign="center"
                        >
                          Candidate ID
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="first_name"
                          className="table-header-bg"
                          dataFormat={renderCandidate}
                        >
                          Candidate
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="phone_number"
                          className="table-header-bg"
                          width="20%"
                          dataFormat={(cell, row) => (
                            <>
                              <div className="text-base font-lato">{cell || ''}</div>
                              <div className="text-base font-lato">{row.email || ''}</div>
                            </>
                          )}
                        >
                          Phone no/Email
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="current_salary"
                          dataSort
                          className="table-header-bg"
                        >
                          Current Salary
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="expected_salary"
                          dataSort
                          className="table-header-bg"
                        >
                          Expected Salary
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          className="table-header-bg"
                          dataField="updated_at"
                          dataAlign="center"
                          dataFormat={(cell) => (
                            <>
                              {moment(cell).format('DD-MM-YYYY')}
                            </>
                          )}
                        >
                          Applied On
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          className="table-header-bg"
                          dataAlign="center"
                          dataFormat={(cell, row) => renderResume(row)}
                        >
                          Resume
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="application_status"
                          className="table-header-bg"
                          dataFormat={(cell) => {
                            const role = dropdownOptions.find(obj => obj.value === cell);
                            return (<StatusLabel status={role?.label} />);
                          }}
                        >
                          Status
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          className="table-header-bg text-right"
                          width="42px"
                          headerAlign="right"
                          dataFormat={(cell, row) => renderAction(row)}
                        >
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
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(Applications);
