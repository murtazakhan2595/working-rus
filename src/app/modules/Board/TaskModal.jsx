import React, { useState, useRef, useEffect } from "react";
import Datepicker from "../Dashboard/Datepicker";
import Select from "react-select";
import { RxCross2, RxPlus, RxPerson } from "react-icons/rx";
import { priority } from "../../../data/Data";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import Joi from "joi";

const status = [
  { value: "inprogress", label: "In-Progress" },
  { value: "completed", label: "Completed" },
  { value: "testing", label: "Testing" },
];

const TaskModal = ({ onClose, token, baseUrl }) => {
  const initialData = {
    title: "",
    desc: "",
    dueDate: null,
    status: null,
    priority: null,
    assignTo: null,
    assignBy: null,
  };

  const [formData, setFormData] = useState(initialData);
  const [assignToOpen, setAssignToOpen] = useState(false);
  const [assignByOpen, setAssignByOpen] = useState(false);
  const [assignToUser, setAssignToUser] = useState({});
  const [assignByUser, setAssignByUser] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [users, setUsers] = useState({});

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Function to handle date changes
  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      dueDate: date,
    }));
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);

    if (Object.keys(errors).length === 0) {
      try {
        const postData = {
          name: formData.title,
          description: formData.desc,
          assigned_to: assignToUser.id,
          assigned_by: assignByUser.id,
          board_id: 1,
          status: formData.status,
        };
        const response = await axios.post(`${baseUrl}/task/`, postData, {
          headers,
        });

        console.log("Response:", response.data);

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
            console.log(response);
            setUsers(response.data.results);
          }
        });
    } catch (error) {}
  };

  useEffect(() => {
    getUsers();
  }, []);

  const schema = Joi.object({
    title: Joi.string().required().label("Title"),
    desc: Joi.string().required().label("Description"),
    dueDate: Joi.date().iso().label("Due Date"),
    status: Joi.string().required().label("Status"),
    priority: Joi.string().required().label("Priority"),
    assignTo: Joi.number().integer().min(1).required().label("Assigned To"),
    assignBy: Joi.number().integer().min(1).required().label("Assigned By"),
  });

  const validateForm = (data) => {
    data.assignTo = assignToUser.id
    data.assignBy = assignByUser.id
    const result = schema.validate(data, { abortEarly: false });
    const errors = {};

    if (result.error) {
      for (let item of result.error.details) {
        errors[item.path[0]] = item.message;
      }
    }

    if (!assignToUser.id) {
      errors.assignTo = "select a assignee";
    }
    if (!assignByUser.id) {
      errors.assignBy = "select a reporter";
    }

    return errors;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="md:mx-auto w-full max-w-lg relative">
          <div className="space-y-3 my-2 bg-[#F8F8F8] lg:pt-8 lg:pb-4 py-6 rounded-3xl p-8 m-6 max-w-800 border border-gray-100 shadow-md relative">
            <div
              className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
              onClick={onClose}
            >
              <RxCross2 />
            </div>
            <form className="" onSubmit={handleSubmit}>
              <h2 className="text-2xl font-sfpro leading-3 font-bold mb-8">
                Create New Task
              </h2>
              <div className="flex flex-col">
                <label
                  htmlFor="title"
                  className="font-sfpro text-lg font-semibold"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="rounded-md bg-white text-black h-9 w-full py-2 pl-2 my-1 focus:outline-none font-sfpro tracking-wider mb-4"
                  placeholder="TecBrix Dashboard Design"
                />
                {validationErrors.title && (
                  <span className="text-red-500 text-sm">
                    {validationErrors.title}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="desc"
                  className="font-sfpro text-lg font-semibold"
                >
                  Description
                </label>
                <textarea
                  name="desc"
                  id="desc"
                  cols="50"
                  rows="2"
                  value={formData.desc}
                  onChange={handleInputChange}
                  className="rounded-md bg-white text-black w-full py-2 pl-2 my-1 focus:outline-none font-sfpro tracking-wider mb-4"
                ></textarea>
                {validationErrors.desc && (
                  <span className="text-red-500 text-sm">
                    {validationErrors.desc}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="dueDate"
                    className="py-1 font-sfpro text-lg font-semibold"
                  >
                    Due Date
                  </label>
                  <Datepicker onChange={handleDateChange} />
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
                  value={formData.status}
                    class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 border-none focus:outline-none focus:ring-0"
                    onChange={handleInputChange}
                  >
                    <option disabled selected>Select Status</option>
                    <option value="To Do">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {validationErrors.status && (
                    <span className="text-red-500 text-sm">
                      {validationErrors.status}
                    </span>
                  )}
                </div>
                <div className="flex flex-col max-w-[80px]">
                  <label
                    htmlFor="priority"
                    className="py-1 font-sfpro text-lg font-semibold"
                  >
                    Priority
                  </label>
                  <Select
                    options={priority}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        borderRadius: "0.375rem",
                        borderWidth: 0,
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "transparent",
                        },
                      }),
                      menu: (provided) => ({
                        ...provided,
                        borderWidth: 0,
                        boxShadow: "none",
                        marginTop: 0,
                        borderRadius: "0.375rem",
                      }),
                    }}
                    value={formData.priority}
                  />
                </div>
              </div>
              <label
                htmlFor="assign"
                className="py-1 font-sfpro text-lg font-semibold"
              >
                Assigned
              </label>

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
                        <div className="absolute top-5  w-40  bg-white rounded-md border border-gray-300 shadow-md z-50">
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
                          <div className="overflow-y-auto max-h-28 roundScrollsm">
                            <ul className="text-black">
                              {users.map((user) => (
                                <div
                                  onClick={() => {
                                    setAssignToUser({
                                      id: user.id,
                                      username: user.username,
                                    });
                                    setAssignToOpen(false);
                                  }}
                                  className="flex gap-3 px-2 py-1 relative items-center group cursor-pointer"
                                  key={user.id}
                                >
                                  <div className="rounded-full bg-cyan-600 text-white flex p-1 w-7 h-7 opacity-60 border justify-center items-center border-gray-500">
                                    {user.username.slice(0, 2)}
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
                    {validationErrors.assignTo && (
                      <p className="text-red-500 mt-2">
                        {validationErrors.assignTo}
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
                        <div className="absolute top-5  w-40  bg-white rounded-md border border-gray-300 shadow-md z-50">
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
                          <div className="overflow-y-auto max-h-28 roundScrollsm">
                            <ul className="text-black">
                              {users.map((user) => (
                                <div
                                  onClick={() => {
                                    setAssignByUser({
                                      id: user.id,
                                      username: user.username,
                                    });
                                    setAssignByOpen(false);
                                  }}
                                  className="flex gap-3 px-2 py-1 relative items-center group cursor-pointer"
                                  key={user.id}
                                >
                                  <div className="rounded-full text-sm bg-white flex p-1 w-7 h-7 opacity-60 border justify-center items-center border-gray-500">
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
                    {validationErrors.assignBy && (
                      <p className="text-red-500 mt-2">
                        {validationErrors.assignBy}
                      </p>
                    )}
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
