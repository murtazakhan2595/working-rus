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
import { IoAttachOutline } from "react-icons/io5";
import { VscMention } from "react-icons/vsc";

const TaskModal = ({ id, onClose, taskData, token, baseUrl }) => {
  const [assignToOpen, setAssignToOpen] = useState(false);
  const [assignByOpen, setAssignByOpen] = useState(false);
  const [description, setDescription] = useState(taskData.description);
  const [name, setName] = useState(taskData.name);
  const [dueDate, setDueDate] = useState(taskData.dueDate);
  const [startDate, setStartDate] = useState(taskData.startDate);
  const [status, setStatus] = useState(taskData.status);
  const [priority, setPriority] = useState(taskData.priority);
  const [validationErrors, setValidationErrors] = useState({});
  const [users, setUsers] = useState({});
  const [filterUsers, setFilterUsers] = useState({});
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  // fetch currnet user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/`, { headers });
        if (response.status === 200) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, [token]);

  // Comment post api
  const createComment = async (id) => {
    console.log(id)
    try {
      const response = await axios.post(
        `${baseUrl}/comments/`,
        {
          task_id: id,
          user_id: 1,
          comment: comment,
        },
        { headers }
      );

      const newComment = response.data;
      const updatedComments = [...comments, newComment];
      setComments(updatedComments);
      setComment("");
      toast.success("Comment added successsfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      console.error("Error creating comment", error);
    }
  };

  // fetch comments

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${baseUrl}/comments`, { headers });
        const commentsData = response.data;
        setComments(commentsData);
        console.log(commentsData);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };
    fetchComments();
  }, []);

  // editComment 
  const startEdit = (commentId, commentText) => {
    setEditingCommentId(commentId)
    setEditedComment(commentText)
  }

  const cancelEdit = () => {
    setEditingCommentId(null);
    setEditedComment('')
  }

  const saveEdit = async (id) => {
    try {
      await axios.put(`${baseUrl}/comments/${id}/`, { comment: editedComment }, { headers });
      const updatedComments = comments.map(c => {
        if (c.id === id) {
          return { ...c, comment: editedComment }
        }
        return c;
      })
      setComments(updatedComments)
      setEditingCommentId(null)
      setEditedComment('')
      toast.success("Comment edited successsfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      console.error('Error editing comment', error);
    }
  }

  // deleteComment
  const deleteComment = async (id) => {
    try {
      await axios.delete(`${baseUrl}/comments/${id}`, { headers });
      const updatedComments = comments.filter((c) => c.id !== id);
      setComments(updatedComments);
      toast.error("Comment deleted Successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      console.error("Error deleting comment", error);
    }
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
        const response = await axios.put(
          `${baseUrl}/task/${taskData.id}`,
          postData,
          {
            headers,
          }
        );
        if (response.status === 200) {
          toast.success("Card Updated !", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          onClose();
        }
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
            setUsers(response.data.results);
            setFilterUsers(response.data.results);
          }
        });
    } catch (error) { }
  };

  const getAssignee = async () => {
    try {
      await axios
        .get(`${baseUrl}/emp/${taskData.assigned_to}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setAssignToUser(response.data);
          }
        });
    } catch (error) { }
    try {
      await axios
        .get(`${baseUrl}/emp/${taskData.assigned_by}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setAssignByUser(response.data);
          }
        });
    } catch (error) { }
  };

  useEffect(() => {
    getAssignee();
    getUsers();
  }, []);

  const [assignToUser, setAssignToUser] = useState({});
  const [assignByUser, setAssignByUser] = useState({});

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
    <div className="fixed inset-0 w-screen overflow-y-auto scroll h-screen flex justify-center items-center backdrop-blur-sm  ">
      <div className="flex items-center justify-center z-auto">
        <div className="md:mx-auto pb-10 pt-28 w-full max-w-3xl relative">
          <div className="space-y-3 bg-[#F8F8F8] lg:pt-8 lg:pb-4 py-6 rounded-3xl p-8 m-6 w-full max-w-6xl border border-gray-100 shadow-md relative">
            <div
              className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
              onClick={onClose}
            >
              <RxCross2 />
            </div>
            <form onSubmit={handleSubmit}>
              <input
                value={name}
                onChange={(e) => {
                  setValidationErrors((prevErrors) => ({
                    ...prevErrors,
                    name: null,
                  }));
                  setName(e.target.value);
                }}
                name="name"
                id="name"
                className="text-2xl bg-transparent focus:outline-none font-sfpro leading-3 font-bold mb-8"
              />
              {validationErrors.name && (
                <span className="text-red-500 text-sm">
                  {validationErrors.name}
                </span>
              )}
              <div className="flex flex-col">
                <label
                  htmlFor="description"
                  className="font-sfpro text-lg font-semibold"
                >
                  Description
                </label>
                <div className="h-60 mt-4 w-full resize-none overflow-y-auto outline-none roundScrollsm rounded-2xl border-none bg-white">
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
                          [
                            { header: "1" },
                            { header: "2" },
                          ],
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

              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  <label
                    htmlFor="dueDate"
                    className="py-1 font-sfpro text-lg font-semibold"
                  >
                    Start Date
                  </label>
                  <Datepicker
                    date={startDate}
                    onChange={(date) => {
                      let d = moment(date).format("YYYY-MM-DD");
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
                    date={dueDate}
                    onChange={(date) => {
                      let d = moment(date).format("YYYY-MM-DD");
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
                    <option value={3}>Todo</option>
                    <option value={2}>In Progress</option>
                    <option value={1}>Completed</option>
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
                              {filterUsers.map((user) => (
                                <div
                                  onClick={() => {
                                    setAssignToUser({
                                      id: user.id,
                                      username: user.username,
                                    });
                                    setFilterUsers(users);
                                    setFilterUsers((prevUsers) =>
                                      prevUsers.filter((u) => u.id !== user.id)
                                    );
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
                              {filterUsers.map((user) => (
                                <div
                                  onClick={() => {
                                    setAssignByUser({
                                      id: user.id,
                                      username: user.username,
                                    });
                                    setFilterUsers(users);
                                    setFilterUsers((prevUsers) =>
                                      prevUsers.filter((u) => u.id !== user.id)
                                    );
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
                    {validationErrors.assigned_by && (
                      <p className="text-red-500 mt-2">
                        {validationErrors.assigned_by}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ******************* COMMENT ********************************** */}
              <div>
                <input
                  type="text"
                  name=""
                  id=""
                  className="h-14 rounded-lg bg-white w-full mt-4 font-sfpro pl-3 focus:outline-none"
                  placeholder="Write a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-between mt-2">
                  <div className="flex gap-x-1 text-xl text-gray-400">
                    <span>
                      <IoAttachOutline />
                    </span>
                    <span>
                      <VscMention />
                    </span>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="bg-[#25A8E0] text-white rounded-lg px-6 py-1"
                      onClick={() => createComment(taskData.id)}
                    >
                      Send
                    </button>
                  </div>
                </div>

                {loading ? (
                  <p>Loading comments...</p>
                ) : (
                  comments.length > 0 && (
                    <div className="w-full">
                      <p className="text-gray-400">Comments ({comments.length})</p>
                      <div className="flex flex-col gap-2 h-36 overflow-y-scroll roundScrollsm">
                        {comments.map((c) => (
                          <div className="flex gap-4 items-center" key={c.id}>
                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-start flex-none"></div>
                            <div className="w-full mr-2 flex-1">
                              <h1 className="font-semibold font-sfpro">
                                {currentUser ? currentUser.username : "Loading..."}
                              </h1>
                              {editingCommentId === c.id ? (
                                <input
                                  type="text"
                                  value={editedComment}
                                  onChange={(e) => setEditedComment(e.target.value)}
                                  autoFocus
                                  className="border-b border-gray-300 w-full py-2 focus:outline-none pl-2"
                                />
                              ) : (
                                <p className="text-gray-700">{c.comment}</p>
                              )}
                              <div className="text-sm space-x-4 text-gray-600">
                                {editingCommentId === c.id ? (
                                  <>
                                    <span className="underline cursor-pointer" onClick={() => saveEdit(c.id)}>Save</span>
                                    <span className="underline cursor-pointer" onClick={cancelEdit}>Cancel</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="underline cursor-pointer" onClick={() => startEdit(c.id, c.comment)}>Edit</span>
                                    <span
                                      className="underline cursor-pointer"
                                      onClick={() => deleteComment(c.id)}
                                    >
                                      Delete
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}
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
