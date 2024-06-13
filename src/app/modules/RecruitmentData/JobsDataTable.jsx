import { connect } from "react-redux";
import RecruitmentDataHeader from "./RecruitmentDataHeader";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCalendarOutline, IoEyeOutline, IoFilter } from "react-icons/io5";
import { MdContentCopy, MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../components/Loader";
import { CiEdit } from "react-icons/ci";
import { jobsStatusOptions } from "../../../data/Data";
import moment from "moment";
import Datepicker from "../Dashboard/Datepicker";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaEdit, FaPlus } from "react-icons/fa";
import jobIcon from "../../../assets/images/jobIcon.png";
import dots from "../../../assets/images/dots.svg";
import { LuExternalLink } from "react-icons/lu";
import ViewJobDetails from "./ViewJobDetails";

const JobsDataTable = ({ baseUrl, token }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [status, setStatus] = useState("");
  const [editedDeadline, setEditedDeadline] = useState(null);
  const [editedPostId, setEditedPostId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  const url = window.location.origin;

  const navigate = useNavigate();

  // Functions for calling the API
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetching users
  const fetchPosts = async () => {
    let searchStatus = status;
    if (activeTab === "live") {
      searchStatus = "live";
    } else if (activeTab === "expired") {
      searchStatus = "expired";
    } else {
      searchStatus = "";
    }

    try {
      const response = await axios.get(
        `${baseUrl}/recruitment/?search=${encodeURIComponent(
          JSON.stringify({ status: searchStatus })
        )}`,
        {
          headers,
        }
      );

      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [status, activeTab]);

  // Filter handling
  const handleStatusFilter = async (option) => {
    setStatus(option);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  // Copy to clip board
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
  };

  // show Filters
  const handleShowFilter = () => {
    setShowFilter(!showFilter);
  };

  // edit deadline
  const handleEditDeadline = async (postId) => {
    if (!editedDeadline) {
      toast.error("Please select a new deadline.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
      return;
    }

    const formattedDeadline = moment(editedDeadline).format("YYYY-MM-DD");
    try {
      const response = await axios.patch(
        `${baseUrl}/recruitment/${postId}`,
        {
          min_salary: posts.min_salary,
          max_salary: posts.max_salary,
          Deadline: formattedDeadline,
        },
        { headers }
      );

      if (response.status === 200) {
        toast.success("Deadline Updated Successfully!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        fetchPosts();
        setEditedDeadline(null);
        setIsEditing((prev) => ({ ...prev, [postId]: false })); // Reset editing mode for the specific post ID
      }
    } catch (error) {
      toast.error("Error updating deadline. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // handleEdit
  const handleEdit = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  // handle Delete
  const handleDelete = async (postId) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${baseUrl}/recruitment/${postId}`, {
        headers,
      });
      if (response.status === 204) {
        toast.success("Job deleted Successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        fetchPosts();
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting the job:", error);
      toast.error("Error deleting the job. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDotsClick = (post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  return (
    <div className="flex w-full flex-col bg-[#F0F1F2] h-[100vh] p-2">
      {/* <RecruitmentDataHeader post="Live Jobs" /> */}

      {/* Tabs */}
      <div className="flex justify-between items-center px-8 py-2 bg-white rounded-t-xl mb-2">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 ${
              activeTab === "all"
                ? "border-b-2 border-blue-500 text-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "live"
                ? "border-b-2 border-blue-500 text-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("live")}
          >
            Open
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "expired"
                ? "border-b-2 border-blue-500 text-black"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("expired")}
          >
            Closed
          </button>
        </div>
        <div className="flex items-center gap-x-3">
          <div className="font-lato text-[20px] text-[#47484C] font-bold">
            Add New Job
          </div>
          <button className="p-2 rounded-md bg-black">
            <FaPlus className="text-white" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="h-[100%] overflow-x-auto overflow-y-auto">
        <div className="min-w-full">
          <table className="min-w-full">
            {loading ? (
              <Loader />
            ) : (
              <tbody className="bg-white text-gray-500">
                {/* {posts?.map((post) => (
                  <tr
                    className={`whitespace-nowrap border-b-2 hover:bg-gray-100`}
                    key={post.id}
                  >
                    <td className="px-4 py-3 text-left">JOB-{post.id}</td>
                    <td className="px-6 py-3 text-left">{post.Job_Title}</td>
                    <td className="px-6 py-3 text-left">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-3 text-left flex gap-x-2 items-start">
                      {isEditing[post.id] ? (
                        <div className="flex gap-x-2 items-center">
                          <IoMdCheckmarkCircleOutline
                            title="Save Deadline"
                            onClick={() => handleEditDeadline(post.id)}
                            className="cursor-pointer text-baseBlue"
                          />
                          <Datepicker
                            className="z-50"
                            name={`editedDeadline-${post.id}`}
                            selected={editedDeadline}
                            onChange={(date) => setEditedDeadline(date)}
                          />
                        </div>
                      ) : (
                        <>
                          <span className="text-baseBlue">
                            {formatDate(post.Deadline)}
                          </span>
                          <CiEdit
                            title="Edit Deadline"
                            onClick={() =>
                              setIsEditing((prev) => ({
                                ...prev,
                                [post.id]: true,
                              }))
                            }
                            className="cursor-pointer text-baseBlue"
                          />
                        </>
                      )}
                    </td>

                    <td className="px-6 py-3 text-left">
                      <div className="flex items-center gap-x-2">
                        <Link
                          target="_blank"
                          to={`/job-description/${post.id}?status=${post.status}`}
                          className="underline flex items-center gap-x-2 text-blue-600"
                        >
                          <span>www.joblink.com/{post.id}</span>
                        </Link>
                        <MdContentCopy
                          className="cursor-pointer text-baseBlue"
                          onClick={() =>
                            copyToClipboard(`${url}/job-description/${post.id}?status=${post.status}`)
                          }
                        />
                      </div>
                    </td>
                    <td
                      className={`px-6 py-3 text-left font-bold ${post.status === "live"
                          ? "text-green-700"
                          : "text-red-700"
                        }`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full mr-2 ${
                            post.status === "live" ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></span>
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </div>
                    </td>

                    <Link to={`/applicants/${post.id}`}>
                      <td className="px-6 py-3 text-center flex gap-x-2 items-center">
                        {post.total_applications}
                        <IoEyeOutline className="text-baseBlue cursor-pointer" />
                      </td>
                    </Link>

                    <td className={`px-4 py-3 text-center font-bold`}>
                      <button title="Edit Job Post" onClick={() => handleEdit(post.id)}>
                        <FaEdit className="text-green-700" />
                      </button>{" "}
                      <button onClick={() => handleDelete(post.id)}>
                        <MdDeleteForever title="Delete Job Post" className="text-red-700" />
                      </button>
                    </td>
                  </tr>
                ))} */}
                {posts?.map((post) => (
                  <tr
                    className={`whitespace-nowrap border-b-2 hover:bg-gray-100`}
                    key={post.id}
                  >
                    <td className="px-4 py-3">
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
                            <LuExternalLink />
                            <img src={dots} alt="" onClick={() => handleDotsClick(post)} className="cursor-pointer" />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="font-lato text-base text-baseGray flex items-center gap-x-2">
                            <IoCalendarOutline className="text-lg" />
                            {`${post.updated_at?.slice(0, 10)} to ${
                              post.Deadline
                            } `}
                          </div>
                          <div className="flex justify-between items-center gap-x-2">
                            <div
                              className={`flex items-center text-baseGray font-lato text-base font-normal rounded-2xl px-2 ${
                                post.status === "Live"
                                  ? "bg-green-100"
                                  : "bg-red-100"
                              }`}
                            >
                              <span
                                className={`w-3 h-3 rounded-full mr-2 ${
                                  post.status === "Live"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></span>
                              {post.status}
                            </div>
                            <div
                              className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl
                    px-2"
                            >
                              {post.Employee_Type}
                            </div>
                            <div
                              className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl
                      px-2"
                            >
                              {post.Work_type}
                            </div>
                            <div
                              className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl
                      px-2"
                            >
                              {post.location}
                            </div>
                            <div
                              className="text-baseGray font-lato text-base font-normal bg-[#E6E9F0] rounded-2xl
                      px-2"
                            >
                              {post.Job_Type}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
      {selectedPost && (
        <ViewJobDetails post={selectedPost} onClose={closeModal} />
      )}
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
