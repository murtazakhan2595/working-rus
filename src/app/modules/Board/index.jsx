import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { RiArrowDownSFill } from "react-icons/ri";
import { BsTrash3 } from "react-icons/bs";
import { Link } from "react-router-dom";
import TaskModal from "./TaskModal";
import TaskView from "./TaskView";
import { toast, ToastContainer } from "react-toastify";
import "./index.css";
import axios from "axios";
import Cookies from "universal-cookie";
import { setUserLogout } from "../../../state/actions/UserAction";
import { RxCross2 } from "react-icons/rx";
import { MdCheck, MdDeleteForever } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Board = ({ isSidebarOpen, userProfile, baseUrl, token }) => {
  const initialData = {
    name: "",
    serial_number: null,
  };
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [status, setStatus] = useState("");
  const [board, setBoard] = useState([]);
  const [reload, setReload] = useState(false);
  const [project, setProject] = useState({});
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [boardHidden, setBoardHidden] = useState(false);
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const [tasks, setTasks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [formData, setFormData] = useState(initialData);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState([]);
  // const [boardStatusId, setBoardStatusId] = useState(null);
  const searchParams = new URLSearchParams(window.location.search);
  const projectId = searchParams.get("pId");
  const [selectedBoardStatusId, setSelectedBoardStatusId] = useState(null);
  const [taskView, setTaskView] = useState({});
  const [shouldFetchTasks, setShouldFetchTasks] = useState(false);
  const [newSerialNumber, setNewSerialNumber] = useState("");
  const [isDelete, setIsDeleted] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editBoardId, setEditBoardId] = useState(null);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [editTexts, setEditTexts] = useState({});
  const [openTaskId, setOpenTaskId] = useState(null);
  const { id } = useParams();

  // Simplified function to open TaskView
  const openTaskView = (taskId) => {
    setOpenTaskId(taskId);
  };

  // Simplified function to close TaskView
  const closeTaskView = () => {
    setOpenTaskId(null);
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    const sourceBoardStatusId = source.droppableId;
    const destinationBoardStatusId = destination.droppableId;

    // Find the dragged task in the tasks array
    const draggedTask = tasks.find((task) => task.id === parseInt(draggableId));

    // Check if draggedTask is defined
    if (!draggedTask) {
      console.error(`Task with id ${draggableId} not found`);
      return;
    }

    // Update the board_status_id of the dragged task
    draggedTask.board_status_id = destinationBoardStatusId;

    // Update the state with the new order of tasks
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];

      // Find the index of the dragged task in the current state
      const movedTaskIndex = updatedTasks.findIndex(
        (task) => task.id === parseInt(draggableId)
      );

      // Check if the task is found before updating
      if (movedTaskIndex !== -1) {
        // Remove the task from the source board
        updatedTasks.splice(movedTaskIndex, 1);

        // Insert the task at the destination board
        updatedTasks.splice(destination.index, 0, draggedTask);
      } else {
        console.error(`Task with id ${draggableId} not found in tasks array`);
      }

      return updatedTasks;
    });

    // Update the API with the new board_status_id
    await axios.put(
      `${baseUrl}/task/${draggableId}`,
      {
        board_status_id: destinationBoardStatusId,
        name: draggedTask.name,
        description: draggedTask.description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await getTasks();
  };

  const closeModal = () => {
    setIsAddTaskOpen(false);
  };

  // edit board pop up

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    cookies.set("token", "", { path: "*" });
    setUserLogout();
    navigate("/");
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const getBoard = async () => {
    try {
      await axios
        .get(`${baseUrl}/board/${id}`, {
          // navigate(`/board/${task.board_id}?pId=${task.project_id}`);
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            setBoard(response.data);
          }
        });
    } catch (error) {
      navigate("/404");
    }
  };

  const getProject = async () => {
    try {
      await axios
        .get(`${baseUrl}/project/${projectId}`, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            setProject(response.data);
          }
        });
    } catch (error) {
      navigate("/404");
    }
  };
  // `${baseUrl}/task/?search={"board_status_id":[${id}]}`
  const getTasks = async (
    // url = `${baseUrl}/task/?search={"board_status_id":[${boardStatusId}]}`
    url = `${baseUrl}/task/`
  ) => {
    try {
      setIsLoading(true);
      await axios
        .get(url, {
          headers,
        })
        .then((response) => {
          if (response.status === 200) {
            const tasksData = response.data;
            setTasks(tasksData);
          }
        });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTasks = async (taskId) => {
    try {
      await axios
        .delete(`${baseUrl}/task/${taskId}`, {
          headers,
        })
        .then((response) => {
          if (response.status === 204) {
            toast.success("Card Deleted !", {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
            });
            setReload(!reload);
          }
        });
    } catch (error) {
      toast.error();
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
            setUsers(response.data);
          }
        });
    } catch (error) {}
  };

  const getRandomColor = () => {
    const colorClasses = [
      "bg-red-400",
      "bg-blue-600",
      "bg-green-700",
      "bg-gray-700",
      "bg-pink-600",
    ];
    const randomIndex = Math.floor(Math.random() * colorClasses.length);
    return colorClasses[randomIndex];
  };

  useEffect(() => {
    getUsers();
    getProject();
  }, []);
  useEffect(() => {
    getTasks();
  }, [location, reload, isAddTaskOpen, users]);

  useEffect(() => {
    getBoard();
  }, [location]);

  // Open and closing modal

  const openListModal = () => {
    setIsModalOpen(true);
  };

  const closeListModal = () => {
    setIsModalOpen(false);
  };

  // handling pop up
  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${baseUrl}/boardstatus/`,
        {
          name: formData.name,
          board_id: id,
          serial_number: formData.serial_number,
        },
        {
          headers,
        }
      );

      if (response.status === 201) {
        toast.success("Card created successfully!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setFormData(initialData);
        closeListModal();
        await getBoardStatus();
      }
    } catch (error) {
      toast.error("Error submitting the form. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } finally {
      // setIsButtonDisabled(false); // Re-enable the button
    }
  };

  // getBoard status

  const getBoardStatus = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/boardstatus/?search={"board_id": [${id}]}&ordering=id`,
        {
          headers,
        }
      );

      if (response.status === 200) {
        setCards(response.data);
      }
    } catch (error) {
      toast.error("Error fetching board status. Please try again.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // edit board Status
  const handleBoardListEdit = (id) => {
    setEditBoardId(id);
    setIsEditBoardOpen(true);
    const boardToEdit = cards.find((card) => card.id === id);
    setNewBoardName(boardToEdit.name);
    setNewSerialNumber(boardToEdit.serial_number);
  };

  const handleEditBoardSave = async () => {
    try {
      const updatedCards = cards.map((card) =>
        card.id === editBoardId
          ? { ...card, name: newBoardName, serial_number: newSerialNumber }
          : card
      );

      setCards(updatedCards);
      const response = await axios.put(
        `${baseUrl}/boardstatus/${editBoardId}`,
        {
          name: newBoardName,
          serial_number: newSerialNumber,
        },
        { headers }
      );

      if (response.status === 200) {
        toast.success("Board List Updated!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      }
    } catch (error) {
      console.error("Error updating board list:", error);
      toast.error("Error updating Board List", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    } finally {
      setIsEditBoardOpen(false);
      setEditBoardId(null);
    }
  };
  // delete BoardStatus
  const deleteBoardList = async (id) => {
    try {
      const updatedTodos = isDelete.filter((delet) => delet.id !== id);
      setIsDeleted(updatedTodos);
      const response = await axios.delete(`${baseUrl}/boardstatus/${id}`, {
        headers,
      });

      if (response.status === 204) {
        toast.success("Board List Deleted!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
        });
        await getBoardStatus();
      }
      // Display a success toast
    } catch (error) {
      console.error("Error deleting Board list", error);

      // Display an error toast
      toast.error("Error deleting Board List", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
    }
  };

  useEffect(() => {
    getBoardStatus();
  }, []);

  // assigned Users
  const getAssignedUserName = (userId) => {
    const assignedUser = users.find((user) => user.id === userId);
    return assignedUser
      ? assignedUser.username.toUpperCase().slice(0, 2)
      : "Unassigned";
    // console.log(assignedUser.username);
  };

  return (
    <div className={`w-full h-screen bg-[#F9F9F9] ${boardHidden ? "" : ""}`}>
      {/* ***************************************************** Header ***************************************************** */}
      <div className="py-5 sm:pl-10 pr-2 flex flex-col justify-center sm:flex-row gap-3 items-center sm:justify-between">
        <div className="flex items-center">
          <h1 className="text-3xl mr-2 leading-none font-semibold  opacity-80 tracking-widest">
            <Link to="/">My Boards</Link>
          </h1>
        </div>
        <div className="relative">
          <div
            className="flex py-2 justify-end px-5 items-center gap-3 rounded-lg bg-gray-200 cursor-pointer"
            onClick={handleDropdownClick}
          >
            <div className="text-3xl w-8 h-8 rounded-full border bg-white"></div>
            <div className="text-[#283b91]">{userProfile.username}</div>
            <div className="text-[#283b91]">
              <RiArrowDownSFill />
            </div>
          </div>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-[#283b91] border rounded-lg shadow-lg">
              <button
                className="block w-full py-2 px-4 text-left hover:bg-gray-100 hover:text-[#283b91] text-white"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      {/* ***************************************************** Board Header ***************************************************** */}
      <div className="bg-[#ebebeb] mb-6 pr-1 pl-1 sm:pl-5 gap-3  justify-between py-2 flex flex-col md:flex-row lg:flex-row">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-36 rounded-md h-6 bg-gray-300 animate-pulse"></div>
          </div>
        ) : (
          <h2 className="text-xl font-semibold">{board.name}</h2>
        )}
      </div>

      {/* ***************************************************** Board Status Card ***************************************************** */}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex w-full justify-start overflow-x-auto xScroll lg:w-[100vw] lg:h-[75vh] px-6">
          <div id="boardList" className="flex">
            {cards?.map((card) => (
              <div
                className="bg-white mr-3 px-2 pt-1 pb-3 h-fit rounded-md w-72"
                key={card.id}
              >
                <Droppable droppableId={card.id.toString()} key={card.id}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {/* {isLoading ? (
                        <div className="bg-gray-300 rounded-md p-3 m-2 animate-pulse">
                          <div className="opacity-70 h-5 w-3/4 mb-2"></div>
                          <hr className="bg-white h-2 my-2" />
                          <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                              <div className="rounded-full cursor-pointer text-[.60rem] text-white flex p-1 w-6 h-6 opacity-60 border justify-center items-center font-bold bg-gray-500"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-[0.60rem]"></div>
                              <div className="text-sm opacity-50 cursor-pointer"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        
                      )} */}

                      <div className="flex justify-between items-center mb-3 mt-3">
                        <div className="flex items-center">
                          <div className="text-[#283b91]">{card.name}</div>
                          <div className="bg-gray-200 rounded-full px-1 text-sm ml-4 text-[#283b91]">
                            {/* 3 */}
                          </div>
                        </div>
                        {/* //////////////edit and delete */}
                        <div className="flex gap-1 justify-end cursor-pointer">
                          {editTexts[card.id] !== undefined ? (
                            <MdCheck
                              className="text-[#283b91] opacity-0.2"
                              // onClick={() => handleSave(card.id)}
                            />
                          ) : (
                            <div className="flex items-center gap-x-2">
                              <AiOutlineEdit
                                className="text-[#283b91] opacity-0.2 text-sm"
                                onClick={() => handleBoardListEdit(card.id)}
                              />
                              <MdDeleteForever
                                className="text-red-400 opacity-0.2 text-sm"
                                onClick={() => {
                                  // deleteBoardList(card.id);
                                  setTodoToDelete(card.id);
                                  setShowDeleteConfirmation(true);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* {isLoading ? (
                        <>
                          <div className="bg-gray-300 rounded-md p-3 m-2 animate-pulse">
                            <div className="opacity-70 h-5 w-3/4 mb-2"></div>
                            <hr className="bg-white h-2 my-2" />
                            <div className="flex justify-between">
                              <div className="flex items-center gap-2">
                                <div className="rounded-full cursor-pointer text-[.60rem] text-white flex p-1 w-6 h-6 opacity-60 border justify-center items-center font-bold bg-gray-500"></div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-[0.60rem]"></div>
                                <div className="text-sm opacity-50 cursor-pointer"></div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                       
                      )} */}

                      <div className="h-auto max-h-[55vh] overflow-y-auto xScroll">
                        {tasks
                          ?.filter((task) => task.board_status_id === card.id)
                          ?.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="flex-shrink-0 p-2 pt-1 pb-3 max-w-[300px] rounded-md"
                                  onClick={() => openTaskView(task.id)}
                                >
                                  <div className="max-w-[255px] bg-[#F2F2F2] rounded-md overflow-hidden">
                                    <div className="px-6 py-4">
                                      <div className="text-base mb-2">
                                        {task.name}
                                      </div>
                                      <hr />
                                      <div className="flex items-center justify-between mt-2 gap-2">
                                        <div
                                          title={task.assignedUser}
                                          className={`rounded-full cursor-pointer text-[.60rem] text-white flex 
                                        p-1 w-6 h-6 opacity-60 border justify-center items-center font-bold ${getRandomColor()}`}
                                        >
                                          {getAssignedUserName(
                                            task.assigned_to
                                          )}
                                        </div>
                                        <div className="flex items-center gap-x-2">
                                          {task.priority === 1 ? (
                                            <div className="text-[0.60rem]">
                                              🔴
                                            </div>
                                          ) : task.priority === 2 ? (
                                            <div className="text-[0.60rem]">
                                              🟡
                                            </div>
                                          ) : task.priority === 3 ? (
                                            <div className="text-[0.60rem]">
                                              🟢
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                          <BsTrash3
                                            className="text-sm opacity-50 cursor-pointer"
                                            onClick={() => {
                                              deleteTasks(task.id);
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {openTaskId === task.id && (
                                    <TaskView
                                      onClose={() => closeTaskView(openTaskId)}
                                      getTasks={getTasks}
                                      taskData={{
                                        id: task.id,
                                        name: task.name,
                                        description: task.description,
                                        dueDate: task.end_date,
                                        startDate: task.start_date,
                                        priority: task.priority,
                                        status: task.status,
                                        assigned_to: task.assigned_to,
                                        assigned_by: task.assigned_by,
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                      </div>

                      <div
                        onClick={() => {
                          setIsAddTaskOpen(true);
                          setSelectedBoardStatusId(card.id);
                        }}
                        className="border hover:bg-gray-200 hover:text-white border-gray-200 text-gray-400 py-1 rounded-md text-center mt-auto max-w-[253px] block mx-auto"
                      >
                        Add Task
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
            <div className={`${isSidebarOpen ? "pr-56" : "pr-0"}`}>
              <button
                className="bg-baseBlue text-white rounded-md px-6 py-2 w-[240px]"
                onClick={openListModal}
              >
                Add Another List
              </button>
            </div>
          </div>
        </div>
      </DragDropContext>
      {isAddTaskOpen && (
        <TaskModal
          onClose={closeModal}
          currentStatus={status}
          id={id}
          boardStatusId={selectedBoardStatusId}
        />
      )}

      <ToastContainer />

      {/* Opening list modal for new list */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto scroll h-[100%] flex justify-center items-center backdrop-blur-sm">
          <div className="flex items-center justify-center z-50">
            <div className="md:mx-auto pb-10 max-w-3xl relative ">
              <div className="space-y-3 bg-[#F8F8F8] w-96 lg:pt-8 lg:pb-4 py-6 rounded-3xl lg:p-8 p-3 lg:m-6 m-4 lg:max-w-6xl max-w-xs border border-gray-100 shadow-md relative">
                <div
                  className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
                  onClick={closeListModal}
                >
                  <RxCross2 />
                </div>
                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-sfpro leading-3 font-bold mb-8">
                    Create New List
                  </h2>

                  <div>
                    {/* ************************ Name ***************************** */}
                    <div className="flex flex-col">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                        className="rounded-md bg-white text-black h-9 w-full py-2 pl-2 my-1 focus:outline-none font-sfpro tracking-wider mb-1"
                        placeholder="TecBrix Dashboard Design"
                        required
                      />
                      <input
                        type="number"
                        name="serial_number"
                        value={formData.serial_number}
                        onChange={(e) =>
                          handleChange(e.target.name, e.target.value)
                        }
                        className="rounded-md bg-white text-black h-9 w-full py-2 pl-2 my-1 focus:outline-none font-sfpro tracking-wider mb-1"
                        placeholder="Serial Number"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="block m-auto py-1 px-16 mt-6 rounded-lg bg-[#283B91] text-white"
                    disabled={isLoading}
                  >
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}

      {/* Edit Board Modal */}
      {isEditBoardOpen && (
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto scroll h-[100%] flex justify-center items-center backdrop-blur-sm">
          <div className="flex items-center justify-center z-50">
            <div className="md:mx-auto pb-10 max-w-3xl relative">
              <div className="space-y-3 bg-[#F8F8F8] w-96 lg:pt-8 lg:pb-4 py-6 rounded-3xl lg:p-8 p-3 lg:m-6 m-4 lg:max-w-6xl max-w-xs border border-gray-100 shadow-md relative">
                <div
                  className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
                  onClick={() => setIsEditBoardOpen(false)}
                >
                  <RxCross2 />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-2xl font-sfpro leading-3 font-bold mb-8">
                    Edit Board List
                  </h2>
                  <div>
                    <input
                      type="text"
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      className="rounded-md bg-white text-black h-9 w-full py-2 pl-2 my-1 focus:outline-none font-sfpro tracking-wider mb-1"
                      placeholder="Board Name"
                    />
                    <input
                      type="number"
                      value={newSerialNumber}
                      onChange={(e) => setNewSerialNumber(e.target.value)}
                      className="rounded-md bg-white text-black h-9 w-full py-2 pl-2 my-1 focus:outline-none font-sfpro tracking-wider mb-1"
                      placeholder="Serial Number"
                    />
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      className="block m-auto py-1 px-16 mt-6 rounded-lg bg-[#283B91] text-white"
                      onClick={handleEditBoardSave}
                    >
                      Save
                    </button>
                    {/* <button
                      className="px-4 py-1 mr-2 text-white bg-blue-500 rounded"
                      onClick={handleEditBoardSave}
                    >
                      Save
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      )}

      {/* delete list modal from list */}
      {showDeleteConfirmation &&
        cards?.map((card) => (
          <div
            key={card.id}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-opacity-50"
          >
            <div className="bg-white p-3 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Delete Item</h1>
                <div className="text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer">
                  <RxCross2 onClick={() => setShowDeleteConfirmation(false)} />
                </div>
              </div>
              <p className="text-gray-700 mt-2">
                Are you sure you want to delete this board Status?
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-1 mr-2 text-white bg-red-500 rounded"
                  onClick={() => {
                    deleteBoardList(todoToDelete);
                    setShowDeleteConfirmation(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
    isLogin: state.user.isLogin,
  };
};

export default connect(mapStateToProps)(Board);
