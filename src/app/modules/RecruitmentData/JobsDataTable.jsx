import { connect } from "react-redux";
import RecruitmentDataHeader from "./RecruitmentDataHeader";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobsDataTable = ({ baseUrl, token }) => {
  const [posts, setPosts] = useState([]);

  // Functions for calling the API
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  // Fetching users
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/recruitment/`, {
          headers,
        });
        setPosts(response.data.results);
        console.log(response.data.results);
        console.log("response==>", response.data.results);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  // Copy to clip board
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
  }

  return (
    <div className="flex w-full flex-col bg-[#F9F9F9] h-[100vh]">
      <RecruitmentDataHeader title="Live Jobs" />

      {/* Table */}
      <div className="px-1 py-4 md:p-3 md:py-3 lg:px-8 lg:py-5 h-[100%] overflow-x-auto overflow-y-auto max-h-[60.5vh] md:max-h-[75.5vh] lg:max-h-[70vh] xScroll">
        <table className="min-w-full">
          <thead>
            <tr className="text-baseBlue bg-[#F2F2F2] whitespace-nowrap">
              <th className="px-6 py-3 text-left  rounded-tl-lg">Job ID</th>
              <th className="flex gap-x-2 items-center px-6 py-3 text-left  rounded-tl-lg">
                Job Title
                {/* <div className="relative">
                  <IoIosSearch className="absolute top-2 left-3 text-white" />
                  <input
                    type="search"
                    placeholder="Search"
                    className="focus:outline-none focus:border-non bg-[#D7D7D7] py-1 pl-8 pr-4 text-white placeholder-white border-none rounded-md w-28"
                  />
                </div> */}
              </th>
              <th className="px-6 py-3 text-left">Posted Date</th>
              <th className="px-6 py-3 text-left">End Date</th>
              <th className="px-6 py-3 text-left">Job Link</th>
              <th className="px-6 py-3 text-center rounded-tr-lg">
                Total Applications
              </th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-500">
            {posts.map((post) => (
              <tr
                className="whitespace-nowrap border-b-2 hover:bg-gray-100"
                key={post.id}
              >
                <td className="px-6 py-3 text-left">JOB-{post.id}</td>
                <td className="px-6 py-3 text-left">{post.Job_Title}</td>
                <td className="px-6 py-3 text-left">
                  {formatDate(post.created_at)}
                </td>
                <td className="px-6 py-3 text-left">
                  {formatDate(post.Deadline)}
                </td>
                <td className="px-6 py-3 text-left">
                  <div className="flex items-center gap-x-2">
                  <Link
                    to={`/job-description/${post.id}`}
                    className="underline flex items-center gap-x-2 text-blue-600"
                  >
                  <span>linked.com</span>
                  </Link>
                   <MdContentCopy className="cursor-pointer text-baseBlue" onClick={() => copyToClipboard(`http://localhost:3000/job-description/${post.id}`)} />
                  </div>
                </td>
                <Link to={`/applicants/${post.id}`}>
                  <td className="px-6 py-3 text-center flex gap-x-2 items-center justify-center">
                    {post.total_applications}
                    <IoEyeOutline className="text-baseBlue cursor-pointer" />
                  </td>
                </Link>
              </tr>
            ))}
          </tbody>
        </table>
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
