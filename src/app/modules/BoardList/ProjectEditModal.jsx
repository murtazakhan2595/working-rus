import { useEffect, useState } from "react";
import Joi from "joi";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { connect } from "react-redux";
import { RxCross2, RxPlus } from "react-icons/rx";
import ReactQuill from "react-quill";
import Datepicker from "../../modules/Dashboard/Datepicker";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const ProjectEditModal = ({ baseUrl, token, onClose ,data}) => {

  const navigate = useNavigate()
  const [projectName, setProjectName] = useState(data.name);
  const [errors, setErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [description, setDescription] = useState(data.description);
  const [startDate, setStartDate] = useState(data.start_date);
  const [dueDate, setDueDate] = useState(data.end_date);
  const [membersOpen, setMembersOpen] = useState(false);
  const [users, setUsers] = useState({});
  const [filterUsers, setFilterUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState(data.project_members);
  const [searchQuery, setSearchQuery] = useState("")

  const boardSchema = Joi.object({
    projectName: Joi.string().min(1).max(100).required(),
    description: Joi.string().min(1).max(5000).required(),
    startDate: Joi.date().iso().required(), 
    dueDate: Joi.date().iso().required(),
    priority: Joi.number().valid(1, 2, 3).required(),
    selectedMembers: Joi.array().items(Joi.number()).min(1).required()
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const formData = {
      name: projectName,
      description,
      start_date: startDate,
      end_date: dueDate,
      project_members: selectedMembers,
    };

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.patch(`${baseUrl}/project/${data.id}`, formData, { headers });
      if (response.status === 200) {
        toast.success("Project Updated!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        onClose()
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response.data.detail, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }

    const dataToValidate = {
      projectName,
      description,
      startDate,
      dueDate,
      selectedMembers,
    };

    const { error } = boardSchema.validate(dataToValidate, { abortEarly: false });

    if (error) {
      const newErrors = {};
      error.details.forEach((detail) => {
        newErrors[detail.path[0]] = detail.message;
      });
      setValidationErrors(newErrors);
      return;

    }

  };

  const getMembers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/emp/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setFilterUsers(response.data.results);
        setUsers(response.data.results);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  const handleMemberSelection = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      selectedMembers: null,
    }));
  };

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  }

  const filteredUsers = filterUsers.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <>
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto scroll h-screen flex justify-center items-center backdrop-blur-sm  ">
        <div className="flex items-center justify-center z-50">
          <div className="md:mx-auto pb-10 pt-28  lg:max-w-3xl max-w-lg relative ">
            <div className="space-y-3 bg-[#F8F8F8] lg:pt-8 lg:pb-4 py-6 rounded-3xl lg:p-8 p-4 m-6 w-5/5 lg:w-full max-w-lg lg:max-w-6xl border border-gray-100 shadow-md relative">
              <div
                className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
                onClick={onClose}
              >
                <RxCross2 />
              </div>
              <form onSubmit={handleSubmit}>
                <input
                      type="text"
                      name="name"
                      id="name"
                      value={projectName}
                      onChange={(e) => {
                        setValidationErrors((prevErrors) => ({
                          ...prevErrors,
                          projectName: null,
                        }));
                        setProjectName(e.target.value);
                      }}
                      className="text-2xl w-full bg-transparent focus:outline-none font-sfpro leading-3 font-bold mb-8"
                      placeholder="Enter a Project Name"
                    />
                    {validationErrors.projectName && (
                      <span className="text-red-500 text-sm">
                        {validationErrors.projectName}
                      </span>
                    )}
                <div>

                  {/* ************************ Description ***************************** */}
                  <div className="flex flex-col">
                    <label
                      htmlFor="description"
                      className="font-sfpro text-lg font-semibold mt-1"
                    >
                      Description
                    </label>
                    {/* Text area */}
                    <div className="lg:h-48 h-36 max-h-48 mt-1 roundScrollsm w-full resize-none overflow-y-auto outline-none rounded-xl border-none bg-white mb-1">
                      <ReactQuill
                        name="description"
                        id="description"
                        className="text-center"
                        value={description}
                        onChange={(html) => {
                          setValidationErrors((prevErrors) => ({
                            ...prevErrors,
                            description: null,
                          }));
                          setDescription(html);
                        }}
                        modules={{
                          toolbar: {
                            container: [
                              ["bold", "italic", "underline", "strike"],
                              [{ list: "ordered" }, { list: "bullet" }],
                              [{ align: [] }],
                              ["link", "image"],
                              [{ header: "1" }, { header: "2" }],
                              [{ size: ["small", false, "large", "huge"] }],
                            ],
                          },
                        }}
                      />
                    </div>

                    {validationErrors.description && (
                      <span className="text-red-500 text-sm">
                        {validationErrors.description}
                      </span>
                    )}
                  </div>

                  {/* ************************ Dates ***************************** */}
                  <div className="flex gap-x-10 items-center mb-4">
                    <div className="flex flex-col">
                      <label
                        htmlFor="startDate"
                        className="py-1 font-sfpro text-lg font-semibold"
                      >
                        Start Date
                      </label>
                      <Datepicker
                        className="z-50"
                        day={startDate.substr(8, 9)}
                      month={startDate.substr(5, 2)}
                      year={startDate.substr(0, 4)}
                        onChange={(date) => {
                          let d = moment(date)
                            .format("YYYY-MM-DD")
                            .toLowerCase();
                          setStartDate(d);
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label
                        htmlFor="dueDate"
                        className="py-1 font-sfpro text-lg font-semibold"
                      >
                        Due Date
                      </label>
                      <Datepicker
                      day={dueDate.substr(8, 9)}
                      month={dueDate.substr(5, 2)}
                      year={dueDate.substr(0, 4)}
                        onChange={(date) => {
                          let d = moment(date)
                            .format("YYYY-MM-DD")
                            .toLowerCase();
                          setDueDate(d);
                        }}
                      />
                    </div>
                  </div>

                  {/* ************************ Members Label ***************************** */}
                  <label
                    htmlFor="assign"
                    className="py-1 font-sfpro text-lg font-semibold"
                  >
                    Members
                  </label>

                  <div className="flex gap-4">
                    {/* ************************** MEMBERS ************************** */}
                    <div className="flex flex-col">
                      <div className="flex justify-start bg-white rounded-md mt-1">
                      </div>
                      <div className="flex gap-2">
                        <div
                          onClick={() => {
                            setMembersOpen(!membersOpen);
                          }}
                          className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer bg-[#eceaea] border-2"
                        >
                          <span className="text-white text-2xl flex justify-center items-center plus-icon w-9 h-9">
                            <RxPlus />
                          </span>
                        </div>
                        {selectedMembers.map((selectedUserId) => (
                          <div
                            key={selectedUserId}
                            className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer bg-pink-500 border-2"
                          >
                            <span className="text-white text-sm flex justify-center items-center plus-icon w-9 h-9">
                              {filteredUsers
                                .find((user) => user.id === selectedUserId)
                                ?.username?.toUpperCase()
                                .slice(0, 2)}
                            </span>
                          </div>
                        ))}
                        <div className="relative">
                          {membersOpen && (
                            <div className="absolute w-40  bg-white rounded-md border border-gray-300 shadow-md z-50">
                              <div className="flex justify-end pt-[5px] px-[5px]">
                                <RxCross2
                                  onClick={() => {
                                    setMembersOpen(!membersOpen);
                                  }}
                                />
                              </div>
                              <input
                                type="search"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="mt-1 border-b border-t bg-[#D7D7D7] w-[158px] focus:outline-none pl-2 text-gray-600"
                              />
                              <div className="overflow-y-auto max-h-24 roundScrollsm">
                                <ul className="text-black">
                                  {filteredUsers.map((user) => (
                                    <div
                                      onClick={() => {
                                        setValidationErrors((prevErrors) => ({
                                          ...prevErrors,
                                          members: null,
                                        }));
                                        handleMemberSelection(user.id);
                                      }}
                                      className={`flex gap-3 px-2 py-1 relative items-center group cursor-pointer ${selectedMembers.includes(user.id)
                                        ? "bg-gray-400 text-white"
                                        : ""
                                        }`}
                                      key={user.id}
                                    >
                                      <div className="rounded-full text-sm bg-cyan-600 text-white flex p-1 w-7 h-7 opacity-60 border justify-center items-center ">
                                        {user.username?.toUpperCase().slice(0, 2)}
                                      </div>
                                      <p className="gap-3 text-sm">{user.username}</p>
                                    </div>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        {validationErrors.selectedMembers && (
                          <p className="text-red-500 text-sm">
                            {validationErrors.selectedMembers}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="block m-auto py-1 px-16 mt-6 rounded-lg bg-[#283B91] text-white"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    baseUrl: state.user.baseUrl,
  };
};
export default connect(mapStateToProps)(ProjectEditModal);


