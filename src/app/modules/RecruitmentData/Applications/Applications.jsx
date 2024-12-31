import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { dropdownOptions } from "data/Data";
import { PageLoader } from "components";
import { Tabs } from "./Sections";
import { ViewApplicantDetails } from ".";
import {
  getJobApplications,
  updateApplicationStatus,
} from "../../../hooks/recruitment";
import { FilterInput } from "components/form-control";
import { AllJobApplicationColumns } from "app/utils/Types/TableColumns";
import TableCustom from "components/CustomTable";
import { Card, CardContent } from "components/ui/card";
import { Header } from "components";
import Stats from "components/ui/Stats";
import { File, List, Scissors } from "lucide-react";
import { DateInput } from "components/form-control";
import SheetComponent from "components/ui/SheetComponent";
import { JobDetails } from "./Sections/Tabs";
import { jobIcon } from "assets/images";
import DialogBox from "components/DialogBox";
import { Button } from "components/ui/button";
import { Formik } from "formik";
import { TextAreaInput } from "components/form-control";

const Applications = () => {
  const location = useLocation();
  const jobIdForFilter = location?.state?.jobId ?? "";
  const [Applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(null);
  const [viewApplicationDetails, setViewApplicationDetails] = useState(null);
  const [isViewApplicationDetailOpen, setIsViewApplicationDetailOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState(jobIdForFilter ? 1 : 0);
  const [filterData, setFilterData] = useState({});
  const [totalApplications, setTotalApplications] = useState(0);
  const [shortlistedApplications, setShortlistedApplications] = useState(0);
  const [selectedApplications, setSelectedApplications] = useState(0);
  const [rejectedApplications, setRejectedApplications] = useState(0);
  const [feedback, setFeedBack] = useState(null);
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const [jobs, setJobs] = useState(null);
  const [currentJob, setCurrentJob] = useState("");
  const [selectedApplicationStatus, setSelectedApplicationStatus] =
    useState(null);

  const onPageChange = (name, value) => {
    const pageOptions = options;
    if (pageOptions[name] !== value) {
      pageOptions[name] = value;
      setOptions((prevOptions) => ({ ...prevOptions, ...pageOptions }));
    }
  };

  useEffect(() => {
    if (jobIdForFilter) {
      setFilterData({ job_id: jobIdForFilter });
    }
  }, [jobIdForFilter]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const applicationsData = await getJobApplications({
          options,
          filterData,
        });
        setApplications(applicationsData);
        setTotalApplications(applicationsData.total_count);
        setShortlistedApplications(applicationsData.shortlisted_application);
        setSelectedApplications(applicationsData.selected_application);
        setRejectedApplications(applicationsData.rejected_application);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchLists();
  }, [options, filterData]);

  const statsData = [
    { label: "Total applications", value: totalApplications, icon: File },
    {
      label: "Shortlisted applications",
      value: shortlistedApplications,
      icon: List,
    },
    { label: "Selected applications", value: selectedApplications, icon: File },
    {
      label: "Rejected applications",
      value: rejectedApplications,
      icon: Scissors,
    },
  ];

  const handleOptionSelect = async (applicant, option) => {
    if (option === "rejected") {
      setFeedBack({
        open: true,
        data: applicant,
        option: option,
      });
    } else {
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
    }
  };

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if (filterName === "application_status")
      setSelectedApplicationStatus(filterValue);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (!filterValue) {
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

  const formSheetData = {
    triggerText: null,
    title: "Application Details",
    description: null,
    footer: null,
  };

  const handleJobChange = (isPrevious) => {
    if (jobs && currentJob === jobs.length - 1) {
      setCurrentJob(0);
      handleFilterChange("job_id", jobs[0].id);
    } else {
      const newJobIndex = isPrevious ? currentJob - 1 : currentJob + 1;
      setCurrentJob(newJobIndex);
      handleFilterChange("job_id", jobs[newJobIndex]?.id);
    }
  };

  return (
    <>
      {viewApplicationDetails && (
        <SheetComponent
          {...formSheetData}
          isOpen={isViewApplicationDetailOpen}
          setIsOpen={setIsViewApplicationDetailOpen}
          width="600px"
        >
          <ViewApplicantDetails
            applicantIndex={viewApplicationDetails?.index}
            closeModel={() => {
              setViewApplicationDetails(null);
            }}
            handleOptionSelect={handleOptionSelect}
            applicationsList={viewApplicationDetails?.list}
          />
        </SheetComponent>
      )}

      <Header />
      <Stats stats={statsData} />
      <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
        <Tabs
          className="flex justify-center mb-4"
          onTabChange={setActiveTab}
          activeTab={activeTab}
          activeJobId={jobIdForFilter}
          setActiveTab={setActiveTab}
          setJobs={setJobs}
          jobs={jobs}
          currentJob={currentJob}
          setCurrentJob={setCurrentJob}
          changeJobFilter={(jobId) => {
            handleFilterChange("job_id", jobId);
          }}
        />
        <div className="flex items-center gap-x-2">
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search by Keyword",
                name: "first_name",
              },
              {
                type: "select-one",
                option: dropdownOptions,
                name: "application_status",
                placeholder: "Status",
                values: selectedApplicationStatus,
              },
            ]}
            onChange={handleFilterChange}
          />
          <DateInput
            placeholder="Applied On"
            value={filterDate}
            className="flex items-center align-middle"
            name="updated_at"
            onChange={(field, value) => {
              setFilterDate(value);
              handleFilterChange(field, value);
            }}
          />
        </div>
      </div>

      {activeTab === 1 && (
        <Card className="p-4 mb-4">
          <JobDetails
            job={jobs[currentJob]}
            jobIcon={jobIcon}
            handleJobChange={handleJobChange}
            jobs={jobs}
          />
        </Card>
      )}

      {isLoading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardContent>
            <TableCustom
              data={Applications?.results || []}
              columns={AllJobApplicationColumns(
                handleOptionSelect,
                setViewApplicationDetails,
                setIsViewApplicationDetailOpen
              )}
              pagination={true}
              dataTotalSize={Applications?.count || 0}
              tableOptions={tableOptions}
            />
          </CardContent>
        </Card>
      )}

      {feedback?.open && (
        <DialogBox
          title="Rejection Reason"
          isOpen={feedback?.open}
          setIsOpen={(isOpen) =>
            setFeedBack((prev) => ({ ...prev, open: isOpen }))
          }
        >
          <Formik
            initialValues={{ reason: "" }}
            onSubmit={async (values) => {
              try {
                // Pass rejection reason and status
                const response = await updateApplicationStatus(
                  {
                    ...feedback?.data,
                    reason: values.reason,
                    application_status: "rejected",
                  },
                  feedback?.option
                );

                if (response.status === 200) {
                  setFilterData({});
                  setFeedBack((prev) => ({ ...prev, open: false }));
                } else {
                  console.error("Failed to update application status.");
                }
              } catch (error) {
                console.error("Error submitting form:", error);
              }
            }}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                {/* Reason Input */}
                <TextAreaInput
                  name="reason"
                  error={props.errors?.reason}
                  touch={props.touched?.reason}
                  value={props.values?.reason}
                  label="Reason"
                  required
                  onChange={(field, value) => {
                    props.handleChange(field)(value); // Update form state
                  }}
                />

                <div className="mt-4 flex justify-end">
                  {/* Submit Button */}
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            )}
          </Formik>
        </DialogBox>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(Applications);
