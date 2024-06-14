import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../components/Loader";
import jobIcon from "../../../assets/images/jobIcon.png";
import dots from "../../../assets/images/dots.svg";
import ViewJobDetails from "./ViewJobDetails";
import Tabs from "./Sections/Tabs";
import { fetchJobPosts } from "../../hooks/recruitment";

const JobsDataTable = ({ baseUrl, token }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedPost, setSelectedPost] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchJobPosts(baseUrl, token, activeTab);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [activeTab, baseUrl, token]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!', {
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
    <div className="h-[100%] overflow-x-auto overflow-y-auto">
      <div className="min-w-full">
        <table className="min-w-full">
          {loading ? (
            <Loader />
          ) : (
            <tbody className="bg-white text-gray-500">
              {posts.map((post) => (
                <tr className={`whitespace-nowrap border-b-2 hover:bg-gray-100`} key={post.id}>
                  <td className="px-4 py-3">
                    <div className="flex flex-col justify-between gap-y-10">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-x-2">
                          <img src={jobIcon} alt="" />
                          <div>
                            <p className="font-lato text-baseGray text-base">{post.id}</p>
                            <h3 className="font-lato text-[20px] text-baseGray font-bold">{post.Job_Title}</h3>
                          </div>
                        </div>
                        <div className="font-lato text-base text-baseGray flex items-center gap-x-4">
                          <Link to={`/applicants/${post.id}`} className="border px-3 py-2 rounded-md border-gray-400">
                            View applications
                          </Link>
                          <img src={dots} alt="" onClick={() => handleDotsClick(post)} className="cursor-pointer" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="font-lato text-base text-baseGray flex items-center gap-x-2">
                          <IoCalendarOutline className="text-lg" />
                          {`${formatDate(post.updated_at)} to ${formatDate(post.Deadline)}`}
                        </div>
                        <div className="flex justify-between items-center gap-x-2">
                          <div
                            className={`flex items-center text-baseGray font-lato text-base font-normal rounded-2xl px-2 ${
                              post.status === 'live' ? 'bg-green-100' : 'bg-red-100'
                            }`}
                          >
                            <span
                              className={`w-3 h-3 rounded-full mr-2 ${
                                post.status === 'live' ? 'bg-green-500' : 'bg-red-500'
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
            </tbody>
          )}
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col bg-[#F0F1F2] h-[100vh] p-2">
      <Tabs tabs={["All", "Open", "Closed"]}
        onTabChange={setActiveTab}
      />
      {renderTable()}
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
