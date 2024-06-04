import { connect } from "react-redux";
import RecruitmentDataHeader from "./RecruitmentDataHeader";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { MdContentCopy, MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../common/Loader";
import { CiEdit } from "react-icons/ci";
import { jobsStatusOptions } from "../../../data/Data";
import moment from "moment";
import Datepicker from "../Dashboard/Datepicker";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoFilter } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";

const JobsDataTable = ({ baseUrl, token }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [status, setStatus] = useState("");
  const [editedDeadline, setEditedDeadline] = useState(null);
  const [editedPostId, setEditedPostId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const url = window.location.origin;

  const navigate = useNavigate();

  // Functions for calling the API
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetching users
  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/recruitment/?search=${encodeURIComponent(
          JSON.stringify({ status: status })
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
  }, [status]);

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

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9] h-[100vh]">
      <RecruitmentDataHeader post="Live Jobs" />

      {/* Table */}
      <div className="px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-5 h-[100%] overflow-x-auto overflow-y-auto">
        <div className="min-w-full">
          <table className="min-w-full">
            <thead>
              <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
                <th className="px-4 py-3 text-left  rounded-tl-lg">Job ID</th>
                <th className="flex gap-x-2 items-center px-6 py-3 text-left  rounded-tl-lg">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left">Posted Date</th>
                <th className="px-6 py-3 text-left">End Date</th>
                <th className="px-6 py-3 text-left">Job Link</th>
                <th
                  className="px-5 py-3 text-left flex items-center gap-x-3 relative"
                  onClick={handleShowFilter}
                >
                  Job Status
                  <span className="text-baseBlue text-xl">
                    <IoFilter />
                  </span>
                  {showFilter && (
                    <div className="absolute right-3 top-[34px] bg-white border border-gray-300 z-10 pt-2 pb-2 rounded-xl shadow-md">
                      {jobsStatusOptions.map((option) => (
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
                <th className="py-3 text-center rounded-tr-lg">
                  Total Applications
                </th>
                <th className="py-3 text-center rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            {loading ? (
              <Loader />
            ) : (
              <tbody className="bg-white text-gray-500">
                {posts?.map((post) => (
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
                      {post.status.charAt(0).toUpperCase() +
                        post.status.slice(1)}
                    </td>

                    <Link to={`/applicants/${post.id}`}>
                      <td className="px-6 py-3 text-center flex gap-x-2 items-center">
                        {post.total_applications}
                        <IoEyeOutline className="text-baseBlue cursor-pointer" />
                      </td>
                    </Link>

                    <td className={`px-6 py-3 text-center font-bold`}>
                      <button onClick={() => handleEdit(post.id)}>
                        <FaEdit className="text-green-700" />
                      </button>{" "}
                      <button onClick={() => handleDelete(post.id)}>
                        <MdDeleteForever className="text-red-700" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
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
