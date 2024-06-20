import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewJobDetails from "./ViewJobDetails";
import { fetchJobPosts } from "../../../hooks/recruitment";
import { cut, file, dots, jobIcon } from '../../../../assets/images';
import { BsBoxArrowUpRight } from "react-icons/bs";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { Tabs, Blocks, Header, StatusLabel, Labels } from "../Sections";
import { workTypeOptions, employeeTypeOptions, jobTypeOptions, locationTypeOptions } from "../../../../data/Data";
import PageLoader from "../../../../components/PageLoader";
import moment from "moment";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { FilterInput, CustomDarkButton } from '../../../../components/form-control';
import { LuExternalLink } from "react-icons/lu";
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

const JobsDataTable = ({ baseUrl, token }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedJob, setSelectedPost] = useState(null);
  const [show, setShow] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchJobPosts(baseUrl, token, activeTab);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [activeTab, baseUrl, token]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
  };

  const handleDotsClick = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const renderTable = () => (
    <div className="h-[100%] mt-2">
      <div className="min-w-full">
        <table className="min-w-full w-full">
          {loading ? (
            <PageLoader />
          ) : (
            <tbody className="bg-white text-gray-500">
              <div className="px-7 w-full">
              {posts.map((post) => (
                <tr
                  className={`whitespace-nowrap border-b-2 hover:bg-gray-100`}
                  key={post.id}
                >
                  <td className="px-4 py-3 w-[60%]">
                    <div className="flex flex-col justify-between gap-y-10">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-x-2">
                          <img src={jobIcon} alt="" />
                          <div>
                            <p className="font-lato text-baseGray text-base">
                              {post.id}
                            </p>
                            <h3 className="font-lato text-[20px] text-baseGray font-bold">
                              {post.Job_Title}
                            </h3>
                          </div>
                        </div>
                        <div className="font-lato text-base text-baseGray flex items-center gap-x-4">
                          <Link
                            to={`/applicants/${post.id}`}
                            className="border px-3 py-2 rounded-md border-gray-400"
                          >
                            View applications
                          </Link>
                          <Link
                            to={`/job-description/${post.id}`}
                            className="px-3 py-2"
                          >
                            <LuExternalLink />
                          </Link>
                          <img
                            src={dots}
                            alt=""
                            onClick={() => handleDotsClick(post)}
                            className="cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="font-lato text-base text-baseGray flex items-center gap-x-2">
                          <IoCalendarOutline className="text-lg" />
                          {`${formatDate(post.updated_at)} to ${formatDate(
                            post.Deadline
                          )}`}
                        </div>
                        <div className="flex justify-between items-center gap-x-2">
                          <div
                            className={`flex items-center text-baseGray font-lato text-base font-normal rounded-2xl px-2 ${post.status === 'live' ? 'bg-green-100' : 'bg-red-100'
                              }`}
                          >
                            <span
                              className={`w-3 h-3 rounded-full mr-2 ${post.status === 'live' ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            ></span>
                            {post.status}
                          </div>
                          <div className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl px-2">
                            {post.Employee_Type}
                          </div>
                          <div className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl px-2">
                            {post.Work_type}
                          </div>
                          <div className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl px-2">
                            {post.location}
                          </div>
                          <div className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl px-2">
                            {post.Job_Type}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              </div>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );

  return (
    <div className="screen bg-[#F0F1F2]">
      <Header
        title="Jobs"
        content={
          <FilterInput
            filters={[
              { type: 'search', placeholder: 'Search', name: 'id_and_first_name' },
            ]}
            onChange={() => { }}
          />
        }
      />
      <Row className="bg-[#F0F1F2] relative">
      {selectedJob && (
          <Col md={6}><ViewJobDetails job={selectedJob} onClose={closeModal} /></Col>
        )}
        <Col lg={12}>
          <div className="rounded-top bg-white p-2 m-2">
            <Tabs tabs={["All", "Open", "Closed"]}
              onTabChange={setActiveTab}
            />
          </div>
        </Col>
        <Col lg={12}>
          {loading ? <PageLoader /> : <RenderJobs jobsList={posts} handleDotsClick={handleDotsClick} />}
        </Col>

        <br />
        
      </Row>
    </div>
  );
};

const RenderJobs = ({ jobsList ,handleDotsClick}) => {
  return (
    <div className="m-2 bg-white">
      {jobsList.map((job) => (
        <div className={`whitespace-nowrap`} key={job.id}>
          <div className="px-4 pt-5">
            <RenderJob job={job} handleDotsClick={handleDotsClick}/>
          </div>
        </div>
      ))}
    </div>
  )
}

const RenderJob = ({ job ,handleDotsClick}) => {
  const employeeType = employeeTypeOptions.find(obj => obj.value === job.Employee_Type);
  const workType = workTypeOptions.find(obj => obj.value === job.Work_type);
  const workLocation = locationTypeOptions.find(obj => obj.value === job.location);
  const jobType = jobTypeOptions.find(obj => obj.value === job.Job_Type);
  return (
    <div className="flex flex-col justify-between gap-y-10 border-b px-2 pb-4">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2">
          <img src={jobIcon} alt="" />
          <div>
            <p className="font-lato text-baseGray text-base">{job.id}</p>
            <h3 className="font-lato text-[20px] text-baseGray font-bold" onClick={()=>{handleDotsClick(job)}}>{job.Job_Title}</h3>
          </div>
        </div>
        <div className="font-lato text-base text-baseGray flex items-center gap-x-4">
          <Link to={`/applicants/${job.id}`} className="border px-3 py-2 rounded-md border-gray-400">
            View applications
          </Link>
          <BsBoxArrowUpRight className="text-xl cursor-pointer opacity-80" />
          <PiDotsThreeOutlineFill className="text-xl cursor-pointer opacity-80" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="font-lato text-base text-baseGray flex items-center gap-x-2">
          <IoCalendarOutline className="text-lg" />
          {`${moment(job.updated_at).format('DD-MM-YYYY')} to ${moment(job.Deadline).format('DD-MM-YYYY')}`}
          <LiaBriefcaseSolid className="text-lg" />
          {job.total_applications} applications
        </div>
        <div className="flex justify-between items-center gap-x-2">
          <Labels label={job.status ==='live' ? 'Open' : 'Close'} iconDot={true} iconColor={`${job.status === 'live' ? 'bg-green-500' : 'bg-red-500'}`} backgroungColor={`${job.status === 'live' ? 'bg-green-100' : 'bg-red-100'}`} />
          <Labels label={employeeType?.label} />
          <Labels label={workType?.label} />
          <Labels label={workLocation?.label} />
          <Labels label={jobType?.label} />
        </div>
      </div>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};

export default connect(mapStateToProps)(JobsDataTable);
