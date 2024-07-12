import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { dropdownOptions } from "data/Data";
import { PageLoader, Table } from "components";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import { cut, file, list } from "assets/images";
import { Blocks, Header } from "../Sections";
import { Tabs } from "./Sections";
import { ViewApplicantDetails } from ".";
import {
  getJobApplications,
  updateApplicationStatus,
} from "../../../hooks/recruitment";
import { FilterInput } from "components/form-control";
import { AllJobApplicationColumns } from "app/utils/Types/TableColumns";

const Applications = () => {
  const location = useLocation();
  const jobIdForFilter = location?.state?.jobId ?? "";
  const [Applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewApplicationDetails, setViewApplicationDetails] = useState("");
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(jobIdForFilter ? 1 : 0);
  const [filterData, setFilterData] = useState(
    jobIdForFilter ? { job_id: jobIdForFilter } : {}
  );
  const [totalApplications, setTotalApplications] = useState(0);
  const [shortlistedApplications, setShortlistedApplications] = useState(0);
  const [selectedApplications, setSelectedApplications] = useState(0);
  const [rejectedApplications, setRejectedApplications] = useState(0);
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
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const URL = `/candidateall/?ordering=updated_at&page=${
          options.page
        }&page_size=${options.sizePerPage}&search=${encodeURIComponent(
          JSON.stringify(filterData)
        )}`;
        const applicationsData = await getJobApplications(URL);
        if (applicationsData) {
          setApplications({
            count: applicationsData.count,
            data: applicationsData.results.candidate,
          });
          setTotalApplications(applicationsData.results.total_count);
          setShortlistedApplications(
            applicationsData.results.shortlisted_application
          );
          setSelectedApplications(
            applicationsData.results.selected_application
          );
          setRejectedApplications(
            applicationsData.results.rejected_application
          );
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchLists();
  }, [id, options, filterData]);

  const handleOptionSelect = async (applicant, option) => {
    try {
      if (applicant) {
        const response = await updateApplicationStatus(applicant, option);

        if (response.status === 200) {
          setFilterData({});
        } else {
          console.error("Failed to update application status");
        }
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };
  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
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
    onPageChange: onPageChange,
  };

  return (
    <div className="screen bg-[#F0F1F2]">
      {viewApplicationDetails && (
        <ViewApplicantDetails
          applicant={viewApplicationDetails}
          closeModel={() => {
            setViewApplicationDetails(null);
          }}
          handleOptionSelect={handleOptionSelect}
        />
      )}
      <Header
        title="Applications"
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
          <Tabs
            onTabChange={setActiveTab}
            activeTab={activeTab}
            activeJobId={jobIdForFilter}
            changeJobFilter={(jobId) => {
              handleFilterChange("job_id", jobId);
            }}
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
                        {
                          type: "search",
                          placeholder: "Search by Keyword",
                          name: "id_and_first_name",
                        },
                        {
                          type: "date",
                          name: "updated_at",
                          placeholder: "Applied On",
                        },
                        {
                          type: "select",
                          option: dropdownOptions,
                          name: "application_status",
                          placeholder: "Status",
                        },
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
                      <Table
                        data={Applications?.data || []}
                        columns={AllJobApplicationColumns(
                          handleOptionSelect,
                          setViewApplicationDetails
                        )}
                        pagination={true}
                        dataTotalSize={Applications?.count || 0}
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
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(Applications);
