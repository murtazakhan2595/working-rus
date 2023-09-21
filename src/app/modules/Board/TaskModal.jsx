import React, { useState, useEffect } from "react";
import Datepicker from "../Dashboard/Datepicker";
import { RxCross2, RxPlus } from "react-icons/rx";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import Joi from "joi";
import moment from "moment";
import ReactQuill from "react-quill";

const TaskModal = ({ id, onClose, currentStatus, token, baseUrl }) => {
  let newDate = new Date();
  let defaultDate = `${newDate.getFullYear()}-${newDate.getMonth()}-${newDate.getDate()}`;

  const [assignToOpen, setAssignToOpen] = useState(false);
  const [assignByOpen, setAssignByOpen] = useState(false);
  const [dueDate, setDueDate] = useState(defaultDate);
  const [startDate, setStartDate] = useState(defaultDate);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState(currentStatus);
  const [priority, setPriority] = useState(1);
  const [assignToUser, setAssignToUser] = useState({});
  const [assignByUser, setAssignByUser] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [users, setUsers] = useState({});
  const [filterUsers, setFilterUsers] = useState({});


  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validateData = {
      name: name,
      description: description,
      assigned_to: assignToUser.id,
      assigned_by: assignByUser.id,
    };
    const errors = validateForm(validateData);
    console.log(errors);
    if (Object.keys(errors).length === 0) {
      try {
        const postData = {
          name: name,
          description: description,
          assigned_to: assignToUser.id,
          assigned_by: assignByUser.id,
          board_id: id,
          priority: priority,
          start_date: startDate,
          end_date: dueDate,
          status: status,
        };
        const response = await axios.post(`${baseUrl}/task/`, postData, {
          headers,
        });

        // Show a success toast
        toast.success("Card added successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => {
          onClose();
        }, 2000); // Close the modal after 2 seconds
      } catch (error) {
        console.error("Error:", error);

        // Show an error toast
        toast.error("Something went wrong", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      // Display validation errors
      setValidationErrors(errors);
    }
  };

  const getUsers = async (url = `${baseUrl}/emp/`) => {
    try {
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setFilterUsers(response.data.results);
            setUsers(response.data.results);
          }
        });
    } catch (error) {}
  };

  useEffect(() => {
    getUsers();
  }, []);

  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    assigned_to: Joi.number().integer().min(1).required().label("Assigned To"),
    assigned_by: Joi.number().integer().min(1).required().label("Assigned By"),
  });

  const validateForm = (data) => {
    data.assigned_to = assignToUser.id;
    data.assigned_by = assignByUser.id;
    const result = schema.validate(data, { abortEarly: false });
    const errors = {};
    if (result.error) {
      for (let item of result.error.details) {
        errors[item.path[0]] = item.message;
      }
    }

    if (!assignToUser.id) {
      errors.assigned_to = "select a assignee";
    }
    if (!assignByUser.id) {
      errors.assigned_by = "select a reporter";
    }

    return errors;
  };

  return (
    <>
      <div className="inset-0 overflow-y-auto z-50 flex items-center justify-center backdrop-blur-sm"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="md:mx-auto w-full max-w-3xl relative">
          <div className="space-y-3 my-2 bg-[#F8F8F8] lg:pt-8 lg:pb-4 py-6 rounded-3xl p-8 m-6 max-w-800 border border-gray-100 shadow-md relative">
            <div
              className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
              onClick={onClose}
            >
              <RxCross2 />
            </div>
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-sfpro leading-3 font-bold mb-8">
                Create New Task
              </h2>

              <div>
                {/* // className="overflow-y-auto  hideScroll p-4" */}
                {/* ************************ Name ***************************** */}

                <div className="flex flex-col">
                  <label
                    htmlFor="name"
                    className="font-sfpro text-lg font-semibold"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setValidationErrors((prevErrors) => ({
                        ...prevErrors,
                        name: null,
                      }));
                      setName(e.target.value);
                    }}
                    className="rounded-md bg-white text-black h-9 w-full py-2 pl-2 my-1 focus:outline-none font-sfpro tracking-wider mb-4"
                    placeholder="TecBrix Dashboard Design"
                  />
                  {validationErrors.name && (
                    <span className="text-red-500 text-sm">
                      {validationErrors.name}
                    </span>
                  )}
                </div>

                {/* ************************ Description ***************************** */}

                <div className="flex flex-col">
                  <label
                    htmlFor="description"
                    className="font-sfpro text-lg font-semibold"
                  >
                    Description
                  </label>
                  {/* Text area */}
                  <div className="h-40 mt-4 w-full resize-none overflow-y-auto outline-none roundScrollsm rounded-2xl border-none bg-white">
                    <ReactQuill
                      name="description"
                      id="description"
                      className="text-center h-[80%]"
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
                            // [
                            //     { header: "1" },
                            //     { header: "2" },
                            // ],
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

                {/* ************************ Dates , Status , Piriorty ***************************** */}

                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <label
                      htmlFor="dueDate"
                      className="py-1 font-sfpro text-lg font-semibold"
                    >
                      Start Date
                    </label>
                    <Datepicker
                      onChange={(date) => {
                        let d = moment(date).format("YYYY-MM-DD").toLowerCase();
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
                      onChange={(date) => {
                        let d = moment(date).format("YYYY-MM-DD").toLowerCase();
                        setDueDate(d);
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="status"
                      className="py-1 font-sfpro text-lg font-semibold"
                    >
                      Status
                    </label>
                    <select
                      name="status"
                      value={status}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 border-none focus:outline-none focus:ring-0"
                      onChange={(e) => {
                        setStatus(e.target.value);
                      }}
                    >
                      <option value="To Do">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="priority"
                      className="py-1 font-sfpro text-lg font-semibold"
                    >
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={priority}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 border-none focus:outline-none focus:ring-0"
                      onChange={(e) => {
                        setPriority(e.target.value);
                      }}
                    >
                      <option value={1}>🟢 Low</option>
                      <option value={2}>🟡 Medium</option>
                      <option value={3}>🔴 High</option>
                    </select>
                  </div>
                </div>

                {/* ************************ Assignee Lable ***************************** */}

                <label
                  htmlFor="assign"
                  className="py-1 font-sfpro text-lg font-semibold"
                >
                  Assigned
                </label>

                {/* ************************ Assign To , Assign By ***************************** */}

                <div className="flex gap-4">
                  {/* ************************** ASSIGN TO ************************** */}

                  <div className="flex w-1/2 flex-col">
                    <div className="flex  justify-start bg-white rounded-md mt-2">
                      <h3 className=" pl-4">Assigned to</h3>
                    </div>
                    <div className="flex mt-2 gap-2">
                      <div
                        onClick={() => {
                          setAssignToOpen(!assignToOpen);
                        }}
                        className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer bg-[#eceaea] border-2"
                      >
                        <span className="text-white text-2xl flex justify-center items-center plus-icon w-9 h-9">
                          <RxPlus />
                        </span>
                      </div>
                      {assignToUser.username && (
                        <div className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer bg-pink-500 border-2">
                          <span className="text-white text-sm flex justify-center items-center plus-icon w-9 h-9">
                            {assignToUser?.username?.toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <div className="relative">
                        {assignToOpen && (
                          <div className="absolute w-40  bg-white rounded-md border border-gray-300 shadow-md z-50">
                            <div className="flex justify-end pt-[5px] px-[5px]">
                              <RxCross2
                                onClick={() => {
                                  setAssignToOpen(!assignToOpen);
                                }}
                              />
                            </div>
                            <input
                              type="search"
                              placeholder="Search"
                              className="mt-1 border-b border-t bg-[#D7D7D7] w-[158px] focus:outline-none pl-2 text-gray-600"
                            />
                            <div className="overflow-y-auto max-h-24 roundScrollsm">
                              <ul className="text-black">
                                {filterUsers.map((user) => (
                                  <div
                                    onClick={() => {
                                      setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        assigned_to: null,
                                      }));
                                      setAssignToUser({
                                        id: user.id,
                                        username: user.username,
                                      });

                                      setFilterUsers(users);
                                      setFilterUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
                                      setAssignToOpen(false);
  
                                    }}
                                    className="flex gap-3 px-2 py-1 relative items-center group cursor-pointer"
                                    key={user.id}
                                  >
                                    <div className="rounded-full text-sm bg-cyan-600 text-white flex p-1 w-7 h-7 opacity-60 border justify-center items-center ">
                                      {user.username.toUpperCase().slice(0, 2)}
                                    </div>
                                    <p className="gap-3 text-sm">
                                      {user.username}
                                    </p>
                                  </div>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      {validationErrors.assigned_to && (
                        <p className="text-red-500 mt-2">
                          {validationErrors.assigned_to}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ************************** ASSIGN BY ************************** */}

                  <div className="flex w-1/2 flex-col">
                    <div className="flex  justify-start bg-white rounded-md mt-2">
                      <h3 className=" pl-4">Assigned By</h3>
                    </div>
                    <div className="flex mt-2 gap-2">
                      <div
                        onClick={() => {
                          setAssignByOpen(!assignByOpen);
                        }}
                        className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer bg-[#eceaea] border-2"
                      >
                        <span className="text-white text-2xl flex justify-center items-center plus-icon w-9 h-9">
                          <RxPlus />
                        </span>
                      </div>
                      {assignByUser.username && (
                        <div className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer bg-blue-500 border-2">
                          <span className="text-white text-sm flex justify-center items-center plus-icon w-9 h-9">
                            {assignByUser?.username?.toUpperCase().slice(0, 2)}
                          </span>
                        </div>
                      )}

                      <div className="relative">
                        {assignByOpen && (
                          <div className="absolute w-40  bg-white rounded-md border border-gray-300 shadow-md z-50">
                            <div className="flex justify-end pt-[5px] px-[5px]">
                              <RxCross2
                                onClick={() => {
                                  setAssignByOpen(!assignByOpen);
                                }}
                              />
                            </div>
                            <input
                              type="search"
                              placeholder="Search"
                              className="mt-1 border-b border-t bg-[#D7D7D7] w-[158px] focus:outline-none pl-2 text-gray-600"
                            />
                            <div className="overflow-y-auto max-h-24 roundScrollsm">
                              <ul className="text-black">
                                {filterUsers.map((user) => (
                                  <div
                                    onClick={() => {
                                      setValidationErrors((prevErrors) => ({
                                        ...prevErrors,
                                        assigned_by: null,
                                      }));
                                      setAssignByUser({
                                        id: user.id,
                                        username: user.username,
                                      });
                                      setFilterUsers(users);
                                      setFilterUsers((prevUsers) =>
                                        prevUsers.filter(
                                          (u) => u.id !== user.id
                                        )
                                      );
                                      setAssignByOpen(false);
                                    }}
                                    className="flex gap-3 px-2 py-1 relative items-center group cursor-pointer"
                                    key={user.id}
                                  >
                                    <div className="rounded-full text-sm bg-pink-600 text-white flex p-1 w-7 h-7 opacity-60 border justify-center items-center">
                                      {user.username.toUpperCase().slice(0, 2)}
                                    </div>
                                    <p className="gap-3 text-sm">
                                      {user.username}
                                    </p>
                                  </div>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      {validationErrors.assigned_by && (
                        <p className="text-red-500 mt-2">
                          {validationErrors.assigned_by}
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
                Done
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    baseUrl: state.user.baseUrl,
    token: state.user.token,
    isLogin: state.user.isLogin,
  };
};

export default connect(mapStateToProps)(TaskModal);
