import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { HiDownload } from "react-icons/hi";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { dropdownOptions, filterDropdownOptions } from "../../../../data/Data";
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
import {
  IoArrowForwardCircle,
  IoCalendarOutline,
  IoFilter,
} from "react-icons/io5";
import { cut, file, list, jobIcon } from '../../../../assets/images';
import { AiOutlineDownload } from "react-icons/ai";
import { FaCaretDown } from "react-icons/fa";
import { Tabs, Blocks, Header } from "../Sections";
import JobDetails from "../JobDetails";
import CandidatesList from "../CandidatesList";
import {
  fetchJobById,
  getJobApplications,
  updateApplicationStatus,
  downloadCV,
} from "../../../hooks/recruitment";
import { FilterInput, CustomDarkButton } from '../../../../components/form-control';
import { BsThreeDots } from "react-icons/bs";
import moment from "moment";
import { GoRows } from "react-icons/go";

const Applications = ({ baseUrl, token }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [Applications, setApplications] = useState([]);
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("");
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("candidates");
  const [job, setJob] = useState(null);
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [filters, setFilters] = useState("");
  const [totalApplications, setTotalApplications] = useState(0);
  const [shortlistedApplications, setShortlistedApplications] = useState(0);
  const [selectedApplications, setSelectedApplications] = useState(0);
  const [rejectedApplications, setRejectedApplications] = useState(0);
  const navigate = useNavigate();
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
    const loadJob = async () => {
      try {
        const jobData = await fetchJobById(baseUrl, id, token);
        setPost(jobData);
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    };
    loadJob();
  }, [id]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        // const URL = `/candidateall/?search=${encodeURIComponent(`{"application_status": "${applicationStatus}", "job_id": ${id}}`)}`
        const URL = `/candidateall/`
        const applicationsData = await getJobApplications(URL);
        setApplications(applicationsData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchLists();
  }, [id, applicationStatus]);

  const handleRowClick = (id) => {
    setSelectedRow(selectedRow === id ? null : id);
  };

  const handleStatusFilter = (option) => {
    setApplicationStatus(option);
  };

  const handleOptionSelect = async (option) => {
    try {
      const selectedApplicant = Applications.find(
        (applicant) => applicant.id === selectedRow
      );

      if (selectedApplicant) {
        const response = await updateApplicationStatus(
          baseUrl,
          selectedApplicant,
          option,
          token
        );

        if (response.status === 200) {
          selectedApplicant.applicationStatus = option;
          setApplications((prevData) =>
            prevData.map((applicant) =>
              applicant.id === selectedRow ? selectedApplicant : applicant
            )
          );
          getJobApplications(id, applicationStatus);
        } else {
          console.error("Failed to update application status");
        }
      }
      setSelectedRow(null);
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  const tabs = ["All Candidates", "Jobs"];

  const tabContents = {
    "All Candidates": <CandidatesList />,
    Jobs: <JobDetails post={post} jobIcon={jobIcon} />,
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
          <DropdownItem onClick={() => navigate(`/profile/${row.id}`)}>Edit Profile</DropdownItem>
          <DropdownItem onClick={() => navigate(`/edit-employee/${row.id}`)}>Edit Employee</DropdownItem>
          <DropdownItem onClick={() => navigate(`/user/${row.id}`)}>View Profile</DropdownItem>
          {/* <DropdownItem onClick={() => handleDelete(row.id)}>Delete Employee</DropdownItem> */}
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
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }

      if (Object.keys(updatedFilters).length > 0) {
        const filters = Object.entries(updatedFilters)
          .map(([key, value]) => `"${key}":"${value}"`)
          .join(",");
        setFilters(`&search={${filters}}`);
      } else {
        setFilters(null);
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
        title="Profile Management"
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
            tabs={tabs}
            onTabChange={setActiveTab}
            tabContents={tabContents}
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
                        { type: 'search', placeholder: 'Search by ID and Name', name: 'id_and_first_name' },
                        { type: 'select', option: departments, name: 'department_name', placeholder: "Department" },
                        { type: 'select', option: designations, name: 'department_position', placeholder: "Designation" },
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
                        data={Applications || []}
                        version="4"
                        hover
                        remote
                        pagination
                        options={tableOptions}
                        fetchInfo={{ dataTotalSize: Applications.length || 0 }}
                        className={'bootstrap-main-table'}
                      >
                        <TableHeaderColumn
                          tdStyle={{ whiteSpace: 'normal' }}
                          isKey
                          dataField="id"
                          dataSort
                          className="table-header-bg"
                        >
                          Candidate ID
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="first_name"
                          dataSort
                          className="table-header-bg"
                          dataFormat={renderCandidate}
                        >
                          Candidate
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="phone_number"
                          dataSort
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
                          className="table-header-bg text-right"
                          headerAlign="center"
                          dataFormat={(cell, row) => renderAction(row)}
                        >
                          Status
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

      {/* <div className="px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-5 h-[100%] overflow-x-auto overflow-y-auto max-h-[60.5vh] md:max-h-[75.5vh] lg:max-h-[70vh] xScroll">
        <table className="min-w-full">
          <thead>
            <tr className=" bg-[#EBECED] whitespace-nowrap font-lato text-base font-normal text-[#323333]">
              <th className="px-6 py-3 text-left rounded-tl-lg">
                Candidate ID
              </th>
              <th className="px-4 py-3 text-left rounded-tl-lg">Candidate</th>
              <th className="px-4 py-3 text-left">Phone no/Email</th>
              <th className="px-4 py-3 text-left">Current Salary</th>
              <th className="px-4 py-3 text-left">Expected Salary</th>
              <th className="px-4 py-3 text-left">Applied On</th>
              <th className="px-4 py-3 text-left">Resume</th>
              <th
                className="px-6 py-3 text-left rounded-tr-lg flex items-center gap-x-2 relative"
                onClick={handleShowFilter}
              >
                Status
                <span className="text-baseBlue text-xl">
                  <IoFilter />
                </span>
                {showFilter && (
                  <div className="absolute right-3 top-[34px] bg-white border border-gray-300 z-10 pt-2 pb-2 rounded-xl shadow-md">
                    {filterDropdownOptions.map((option) => (
                      <div
                        key={option.label}
                        onClick={() => handleStatusFilter(option.value)}
                        className="cursor-pointer border-b-2 pl-2 w-[100px] hover:bg-blue-100"
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
              </th>
            </tr>
          </thead>
          {isLoading ? (
            <PageLoader />
          ) : (
            <tbody className="bg-white text-gray-500">
              {Applications?.map((applicant) => (
                <tr
                  className={`whitespace-nowrap border-b-2 hover:bg-gray-100 ${selectedRow === applicant.id ? "bg-gray-200" : ""
                    }`}
                  key={applicant?.id}
                >
                  <td className="px-4 py-2 text-left text-[#5c5e64] opacity-80">
                    {applicant?.id}
                  </td>
                  <td className="px-4 py-2 text-left flex flex-col gap-y-2">
                    <div className="font-lato text-base text-[#323333]">
                      {applicant?.first_name}
                    </div>
                    <div className="font-lato text-base text-baseGray">
                      {`Exp. ${applicant?.Year_of_Experience} years`}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-left">
                    <div className="font-lato text-base text-[#323333]">
                      {applicant?.email}
                    </div>
                    <div className="font-lato text-base text-baseGray">
                      {applicant?.phone_number}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-left">
                    {applicant?.current_salary}
                  </td>
                  <td className="px-6 py-3 text-left">
                    {applicant?.expected_salary}
                  </td>
                  <td className="px-4 py-2 text-left text-[#5c5e64] opacity-80">
                    {applicant?.updated_at.slice(0, 10)}
                  </td>
                  <td className="px-4 py-3 text-left">
                    <div className="flex gap-x-2 items-center">
                      <span
                        title={applicant?.cv}
                        className="font-lato text-base text-baseGray"
                      >
                        File
                      </span>
                      <button
                        onClick={() =>
                          downloadCV(applicant?.cv, applicant?.first_name)
                        }
                      >
                        <AiOutlineDownload />
                      </button>
                    </div>
                  </td>
                  <td
                    className="px-6 py-3 text-left relative cursor-pointer"
                    onClick={() => handleRowClick(applicant?.id)}
                  >
                    <span className="text-gray-500 flex gap-x-1 items-center justify-center">
                      {applicant?.application_status}
                      <FaCaretDown />
                    </span>

                    {selectedRow === applicant.id && (
                      <div className="absolute right-0 bg-white border border-gray-300 z-10 pt-2 pb-2 rounded-xl shadow-md">
                        {dropdownOptions.map((option) => (
                          <div
                            key={option.label}
                            onClick={() => handleOptionSelect(option.value)}
                            className={`cursor-pointer border-b-2 pl-2 w-[125px] hover:bg-blue-100`}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div> */}
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
