import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewJobDetails from "./ViewJobDetails";
import { fetchJobPosts } from "app/hooks/recruitment";
import { jobIcon } from "assets/images";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { Labels } from "../Sections";
import { Tabs, Header, PageLoader } from "components";
import {
  getEmployeeType,
  getWorkType,
  getJobType,
  getWorkLocation,
} from "utils/getValuesFromTables";
import { JobSortingFilters } from "data/Data";
import moment from "moment";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { FilterInput } from "components/form-control";
import { Row, Col } from "reactstrap";

const JobsDataTable = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedPost] = useState(null);
  const [filterData, setFilterData] = useState({});

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchJobPosts(filterData);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [filterData]);

  const handleDotsClick = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const handleFilterChange = (filterName, filterValue, filterCheckStatus) => {
    setFilterData((prevFilters) => {
      //  debugger
      const updatedFilters = { ...prevFilters };
      // if (filterName !== 'status' && filterName !== 'id_and_Job_Title' && filterName !== 'updated_at') {
      //   if (!updatedFilters[filterName]) {
      //     updatedFilters[filterName] = filterValue;
      //   } else {
      //     updatedFilters[filterName] = `${updatedFilters[filterName]},${filterValue}`;
      //   }
      // }
      // else {
      if (!filterValue) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterCheckStatus ? filterValue : "";
      }
      return updatedFilters;
    });
  };
  console.log(filterData);
  return (
    <div className="screen bg-[#F0F1F2]">
      <Header
        title="Jobs"
        content={
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search by ID & Job Title",
                name: "id_and_Job_Title",
              },
              {
                type: "sorting",
                option: JobSortingFilters,
                name: "sorting",
                placeholder: "Sort By",
                values: filterData,
              },
            ]}
            onChange={handleFilterChange}
          />
        }
      />
      <Row className="bg-[#F0F1F2] relative">
        {selectedJob && (
          <Col md={6}>
            <ViewJobDetails job={selectedJob} onClose={closeModal} />
          </Col>
        )}
        <Col lg={12}>
          <div className="rounded-top bg-white p-2 m-2">
            <Tabs
              tabs={["All", "Open", "Closed"]}
              onTabChange={(value) => {
                handleFilterChange(
                  "status",
                  value === "Open"
                    ? "live"
                    : value === "Closed"
                    ? "expired"
                    : ""
                );
              }}
              buttonLabel={"Add New Job"}
            />
          </div>
        </Col>
        <Col lg={12}>
          {loading ? (
            <PageLoader />
          ) : (
            <RenderJobs jobsList={posts} handleDotsClick={handleDotsClick} />
          )}
        </Col>
        <br />
      </Row>
    </div>
  );
};

const RenderJobs = ({ jobsList, handleDotsClick }) => {
  return (
    <div className="m-2 bg-white">
      {jobsList?.results.map((job) => (
        <div className={`whitespace-nowrap`} key={job.id}>
          <div className="px-4 pt-5">
            <RenderJob job={job} handleDotsClick={handleDotsClick} />
          </div>
        </div>
      ))}
    </div>
  );
};

const RenderJob = ({ job, handleDotsClick }) => {
  console.log(" i am job", job);
  const employeeType = getEmployeeType(job.Employee_Type);
  const workType = getWorkType(job.Work_type);
  const workLocation = getWorkLocation(job.location);
  const jobType = getJobType(job.Job_Type);
  return (
    <div className="flex flex-col justify-between gap-y-10 border-b px-2 pb-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2">
          <img src={jobIcon} alt="" />
          <div>
            <p className="text-baseGray text-base">{job.id}</p>
            <h3
              className="text-[20px] text-baseGray font-bold"
              onClick={() => {
                handleDotsClick(job);
              }}
            >
              {job.Job_Title}
            </h3>
          </div>
        </div>
        <div className="text-base text-baseGray flex items-center gap-x-4">
          <Link
            to="/applicants"
            state={{ jobId: job.id }}
            className="border px-3 py-2 rounded-md border-gray-400"
          >
            View applications
          </Link>
          <Link to={`/job-description/${job.id}`}>
            <BsBoxArrowUpRight className="text-xl cursor-pointer opacity-80" />
          </Link>
          <PiDotsThreeOutlineFill className="text-xl cursor-pointer opacity-80" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-base text-baseGray flex items-center gap-x-2">
          <IoCalendarOutline className="text-lg" />
          {`${moment(job.updated_at).format("DD-MM-YYYY")} to ${moment(
            job.Deadline
          ).format("DD-MM-YYYY")}`}
          <LiaBriefcaseSolid className="text-lg" />
          {job.total_applications} applications
        </div>
        <div className="flex justify-between items-center gap-x-2">
          <Labels
            label={job.status === "live" ? "Open" : "Close"}
            iconDot={true}
            iconColor={`${
              job.status === "live" ? "bg-green-500" : "bg-red-500"
            }`}
            backgroungColor={`${
              job.status === "live" ? "bg-green-100" : "bg-red-100"
            }`}
          />
          <Labels label={employeeType?.label} />
          <Labels label={workType?.label} />
          <Labels label={workLocation?.label} />
          <Labels label={jobType?.label} />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(JobsDataTable);
