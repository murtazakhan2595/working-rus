import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { RiArrowDownSFill } from "react-icons/ri";
import { FaRegShareSquare } from "react-icons/fa";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { AiTwotoneStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import TaskModal from "./TaskModal";
import TaskView from "./TaskView";
import { toast, ToastContainer } from "react-toastify";
import "./index.css";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Cookies from "universal-cookie";
import { setUserLogout } from "../../../state/actions/UserAction";

const Board = ({ userProfile, baseUrl, token }) => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [status, setStatus] = useState("");
  const [board, setBoard] = useState([]);
  const [reload, setReload] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [boardHidden, setBoardHidden] = useState(false);
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditBoardOpen, setIsEditBoardOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

  const { id } = useParams();

  const closeModal = () => {
    setIsAddTaskOpen(false);
  };

  // edit board pop up

  const openEditBoardPopup = () => {
    setNewBoardName(board.name);
    setIsEditBoardOpen(true);
  };

  const handleEditBoardNameChange = (event) => {
    setNewBoardName(event.target.value);
  };

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    cookies.set("token", "", { path: "*" });
    setUserLogout();
    navigate("/");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const getBoard = async () => {
    try {
      await axios
        .get(`${baseUrl}/board/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setBoard(response.data);
          }
        });
    } catch (error) { }
  };

  const getTasks = async (
    url = `${baseUrl}/task/?search={"board_id":[${id}]}&ordering=id`
  ) => {
    try {
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const tasksData = response.data;

            const todoWithUserName = [];
            const inProgressWithUserName = [];
            const completedWithUserName = [];
            for (const task of tasksData) {
              let username = users.filter((u) => u.id === task.assigned_to);
              const taskWithname = {
                ...task,
                userName: username[0].username,
              };
              if (taskWithname.status === "To Do") {
                todoWithUserName.push(taskWithname);
              }
              if (taskWithname.status === "In Progress") {
                inProgressWithUserName.push(taskWithname);
              }
              if (taskWithname.status === "Completed") {
                completedWithUserName.push(taskWithname);
              }
            }
            setTasks({
              todo: todoWithUserName,
              inProgress: inProgressWithUserName,
              completed: completedWithUserName,
            });
          }
        });
    } catch (error) { }
  };

  const deleteTasks = async (taskId) => {
    try {
      await axios
        .delete(`${baseUrl}/task/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    } catch (error) { }
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
          }
        });
    } catch (error) { }
  };

  const [isTodoViewOpen, setIsTodoViewOpen] = useState(
    Array(tasks.todo.length).fill(false)
  );
  const [isProgressViewOpen, setIsProgressViewOpen] = useState(
    Array(tasks.inProgress.length).fill(false)
  );
  const [isCompletedViewOpen, setIsCompletedViewOpen] = useState(
    Array(tasks.completed.length).fill(false)
  );

  const openTodoView = (index) => {
    const updatedModals = [...isTodoViewOpen];
    updatedModals[index] = true;
    setIsTodoViewOpen(updatedModals);
  };

  const closeTodo = (index) => {
    setBoardHidden(false)
    setReload(!reload);
    const updatedModals = [...isTodoViewOpen];
    updatedModals[index] = false;
    setIsTodoViewOpen(updatedModals);
  };

  const openInProgressView = (index) => {
    const updatedModals = [...isProgressViewOpen];
    updatedModals[index] = true;
    setIsProgressViewOpen(updatedModals);
  };

  const closeProgess = (index) => {
    setBoardHidden(false)
    setReload(!reload);
    const updatedModals = [...isProgressViewOpen];
    updatedModals[index] = false;
    setIsProgressViewOpen(updatedModals);
  };

  const openCompletedView = (index) => {
    const updatedModals = [...isCompletedViewOpen];
    updatedModals[index] = true;
    setIsCompletedViewOpen(updatedModals);
  };

  const closeCompleted = (index) => {
    setBoardHidden(false)
    setReload(!reload);
    const updatedModals = [...isCompletedViewOpen];
    updatedModals[index] = false;
    setIsCompletedViewOpen(updatedModals);
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

  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }
    const sourceColumn = result.source.droppableId;
    const destinationColumn = result.destination.droppableId;
    let destinationCol =
      destinationColumn === "todo"
        ? "To Do"
        : destinationColumn === "inProgress"
          ? "In Progress"
          : destinationColumn === "completed"
            ? "Completed"
            : "";
    let task = tasks[sourceColumn][result.source.index];
    const { sourceIndex, destinationIndex } = result;
    // Update Board Staticly
    const updatedTasks = { ...tasks };
    const [movedTask] = updatedTasks[sourceColumn].splice(sourceIndex, 1);
    updatedTasks[destinationColumn].splice(destinationIndex, 0, movedTask);
    setTasks(updatedTasks);

    // Update Board Dynamictly
    const response = await axios.patch(
      `${baseUrl}/task/${task.id}`,
      { status: destinationCol },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) {
      setReload(!reload);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);
  useEffect(() => {
    getTasks();
  }, [location, reload, isAddTaskOpen, users]);

  useEffect(() => {
    getBoard();
  }, [location]);

  const handleDeleteBoard = async () => {
    try {
      const response = await axios.delete(`${baseUrl}/board/${board.id}`, {
        headers,
      });
      if (response.status === 204) {
        console.log("Board deleted successfully!");
        navigate(`/project/${id}`)
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting board:", error);
    }

    setIsDeleteConfirmationOpen(false);
  };

  const EditBoardName = async () => {
    try {
      const response = await axios.patch(`${baseUrl}/board/${board.id}`, { name: newBoardName }, { headers });
      if (response.status === 200) {
        setBoard({ ...board, name: newBoardName });
        setIsEditBoardOpen(false);
        toast.success("Board name updated!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
        });
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error updating board name:", error);
    }
  };


  return (
    <div className={`w-full h-screen bg-[#F9F9F9] ${boardHidden ? '' : ''}`}>
      {/* ***************************************************** Header ***************************************************** */}
      <div className="py-5 sm:pl-10 pr-2 flex flex-col justify-center sm:flex-row gap-3 items-center sm:justify-between">
        <div className="flex items-center">
          <h1 className="text-3xl mr-2 leading-none font-semibold  opacity-80 tracking-widest">
            <Link to="/">My Boards</Link>
          </h1>
          <div className="relative">
            <IoIosSearch className="absolute top-2 left-3 text-white" />
            <input
              type="search"
              placeholder="Search"
              className="focus:outline-none focus:border-non bg-gray-200 py-1 pl-8 pr-4 text-white placeholder-white border-none  md:flex lg:w-64 xs:w-[12.5rem] hidden rounded-md"
            />
          </div>
        </div>
        <div className="relative">
          <div className="flex py-2 justify-end px-5 items-center gap-3 rounded-lg bg-gray-200 cursor-pointer" onClick={handleDropdownClick}>
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
      <div className="bg-[#ebebeb] mb-6 pr-1 pl-1 sm:pl-5 gap-3  justify-between py-2 flex">
        <div className="flex gap-2">
          <div className="flex justify-center ml-4 items-center">
            <AiTwotoneStar className="text-3xl text-[#283b91]" />
          </div>
          <div className="flex font-bold items-center ml-2 tracking-widest ">
            {board.name}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="sm:flex hidden bg-white px-2 py-1 gap-3 items-center rounded-lg">
            <div className=" px-4 text-[#283b91]">Share</div>
          </div>
          <div className="sm:hidden flex bg-[#f7f7f8] px-2 py-1 gap-3 items-center rounded-lg">
            <div className=" px-1 text-gray-400">
              <FaRegShareSquare />
            </div>
          </div>
          <div className="flex bg-[#f7f7f8] px-2 py-1 gap-3 items-center rounded-lg"
            onClick={openEditBoardPopup}
          >
            <div className=" px-1 text-gray-400">
              <BsPencil />
            </div>
          </div>
          <div className="flex bg-[#f7f7f8] px-2 mr-5 py-1 gap-3 items-center rounded-lg"
            onClick={()=>{setIsDeleteConfirmationOpen(true);}}
          >
            <div className=" px-1 text-gray-400">
              <BsTrash3 />
            </div>
          </div>
        </div>
      </div>

      {/* ***************************************************** Board Card ***************************************************** */}
      <DragDropContext onDragEnd={boardHidden ? '' : handleDragEnd}>
        <div className="flex w-full justify-start ">
          <div className="flex xScroll  sm:ml-10 ml-5 pb-2 overflow-x-auto w-[90%] lg:w-[82vw] justify-start">
            <div id="boardList" className="flex">
              {/* Box 1 */}
              <div className="bg-white  mr-3 px-2 pt-1 pb-3 h-fit rounded-md w-72">
                <div className="flex justify-between items-center mb-3 mt-3 ml-2">
                  <div className="flex justify-center items-center">
                    <div className="text-[#283b91]">Todo </div>
                    <div className="bg-gray-200 rounded-full px-1 text-sm ml-2 text-[#283b91]">
                      {/* 3 */}
                    </div>
                  </div>
                </div>
                <Droppable droppableId="todo">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="boardScroll overflow-y-auto overflow-x-hidden max-h-[63vh] mb-2"
                    >
                      {tasks["todo"].map((t, index) => (
                        <>
                          <Draggable
                            isDragDisabled={boardHidden}
                            key={t.id}
                            draggableId={t.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  className={`bg-[#F2F2F2] rounded-md p-3 m-2`}
                                >
                                  <div
                                    onClick={() => { openTodoView(index); setBoardHidden(true) }}
                                    className="opacity-70"
                                  >
                                    {t.name}
                                  </div>
                                  <hr className=" bg-white h-[2px] my-2" />
                                  <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                      {/* <BsBookmark className="text-xs text- opacity-50" /> */}
                                      <div
                                        title={t.userName}
                                        className={`rounded-full cursor-pointer text-[.60rem] text-white flex p-1 w-6 h-6 opacity-60 border justify-center items-center ${getRandomColor()}`}
                                      >
                                        {t.userName.toUpperCase().slice(0, 2)}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {t.priority === 1 ? (
                                        <div className="text-[0.50rem]">🔴</div>
                                      ) : t.priority === 2 ? (
                                        <div className="text-[0.50rem]">🟡</div>
                                      ) : t.priority === 3 ? (
                                        <div className="text-[0.50rem]">🟢</div>
                                      ) : (
                                        ""
                                      )}
                                      <BsTrash3
                                        className="text-xs opacity-50 "
                                        onClick={() => {
                                          deleteTasks(t.id);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {isTodoViewOpen[index] && (
                                  <TaskView
                                    onClose={() => closeTodo(index)}
                                    taskData={{
                                      id: t.id,
                                      name: t.name,
                                      description: t.description,
                                      dueDate: t.end_date,
                                      startDate: t.start_date,
                                      priority: t.priority,
                                      status: t.status,
                                      assigned_to: t.assigned_to,
                                      assigned_by: t.assigned_by,
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </Draggable>
                        </>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div
                  onClick={() => {
                    setIsAddTaskOpen(true);
                    setStatus("To Do");
                  }}
                  className="border  hover:bg-gray-200 hover:text-white border-gray-200 text-gray-400 py-1 rounded-md text-center mx-2"
                >
                  Add a Card
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-white  mr-3 px-2 pt-1 pb-3 h-fit rounded-md w-72">
                <div className="flex justify-between items-center mb-3 mt-3 ml-2">
                  <div className="flex justify-center items-center">
                    <div className="text-[#283b91]">In Progress </div>
                    <div className="bg-gray-200 rounded-full px-1 text-sm ml-2 text-[#283b91]">
                      {/* 3 */}
                    </div>
                  </div>
                </div>
                <Droppable droppableId="inProgress">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="boardScroll overflow-y-auto overflow-x-hidden  max-h-[63vh] mb-2"
                    >
                      {tasks["inProgress"].map((t, index) => (
                        <>
                          <Draggable
                            isDragDisabled={boardHidden}
                            key={t.id}
                            draggableId={t.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  className={`bg-[#F2F2F2] rounded-md p-3 m-2`}
                                >
                                  <div
                                    onClick={() => { openInProgressView(index); setBoardHidden(true) }}
                                    className="opacity-70"
                                  >
                                    {t.name}
                                  </div>
                                  <hr className=" bg-white h-[2px] my-2" />
                                  <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                      <div
                                        title={t.userName}
                                        className={`rounded-full cursor-pointer text-[.60rem] text-white flex p-1 w-6 h-6 opacity-60 border justify-center items-center ${getRandomColor()}`}
                                      >
                                        {t.userName.toUpperCase().slice(0, 2)}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {t.priority === 1 ? (
                                        <div className="text-[0.50rem]">🔴</div>
                                      ) : t.priority === 2 ? (
                                        <div className="text-[0.50rem]">🟡</div>
                                      ) : t.priority === 3 ? (
                                        <div className="text-[0.50rem]">🟢</div>
                                      ) : (
                                        ""
                                      )}
                                      <BsTrash3
                                        className="text-xs opacity-50 "
                                        onClick={() => {
                                          deleteTasks(t.id);
                                        }}
                                      />
                                    </div>{" "}
                                  </div>
                                </div>

                                {isProgressViewOpen[index] && (
                                  <TaskView
                                    onClose={() => closeProgess(index)}
                                    taskData={{
                                      id: t.id,
                                      name: t.name,
                                      description: t.description,
                                      dueDate: t.end_date,
                                      startDate: t.start_date,
                                      priority: t.priority,
                                      status: t.status,
                                      assigned_to: t.assigned_to,
                                      assigned_by: t.assigned_by,
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </Draggable>
                        </>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <div
                  onClick={() => {
                    setIsAddTaskOpen(true);
                    setStatus("In Progress");
                  }}
                  className="border  hover:bg-gray-200 hover:text-white border-gray-200 text-gray-400 py-1 rounded-md text-center mx-2"
                >
                  Add a Card
                </div>
              </div>

              {/* Box 3 */}
              <div className="bg-white  mr-3 px-2 pt-1 pb-3 h-fit rounded-md w-72">
                <div className="flex justify-between items-center mb-3 mt-3 ml-2">
                  <div className="flex justify-center items-center">
                    <div className="text-[#283b91]">Completed </div>
                    <div className="bg-gray-200 rounded-full px-1 text-sm ml-2 text-[#283b91]">
                      {/* 3 */}
                    </div>
                  </div>
                </div>
                <Droppable droppableId="completed">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="boardScroll overflow-y-auto overflow-x-hidden max-h-[63vh] mb-2"
                    >
                      {tasks["completed"].map((t, index) => (
                        <>
                          <Draggable
                            isDragDisabled={boardHidden}
                            key={t.id}
                            draggableId={t.id.toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  className={`bg-[#F2F2F2] rounded-md p-3 m-2`}
                                >
                                  <div
                                    onClick={() => { openCompletedView(index); setBoardHidden(true) }}
                                    className="opacity-70"
                                  >
                                    {t.name}
                                  </div>
                                  <hr className=" bg-white h-[2px] my-2" />
                                  <div className="flex justify-between">
                                    <div className="flex items-center gap-2">
                                      <div
                                        title={t.userName}
                                        className={`rounded-full cursor-pointer text-[.60rem] text-white flex p-1 w-6 h-6 opacity-60 border justify-center items-center ${getRandomColor()}`}
                                      >
                                        {t.userName.toUpperCase().slice(0, 2)}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {t.priority === 1 ? (
                                        <div className="text-[0.50rem]">🔴</div>
                                      ) : t.priority === 2 ? (
                                        <div className="text-[0.50rem]">🟡</div>
                                      ) : t.priority === 3 ? (
                                        <div className="text-[0.50rem]">🟢</div>
                                      ) : (
                                        ""
                                      )}
                                      <BsTrash3
                                        className="text-xs opacity-50 "
                                        onClick={() => {
                                          deleteTasks(t.id);
                                        }}
                                      />
                                    </div>{" "}
                                  </div>
                                </div>
                                {isCompletedViewOpen[index] && (
                                  <TaskView
                                    onClose={() => closeCompleted(index)}
                                    taskData={{
                                      id: t.id,
                                      name: t.name,
                                      description: t.description,
                                      dueDate: t.end_date,
                                      startDate: t.start_date,
                                      priority: t.priority,
                                      status: t.status,
                                      assigned_to: t.assigned_to,
                                      assigned_by: t.assigned_by,
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </Draggable>
                        </>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div
                  onClick={() => {
                    setIsAddTaskOpen(true);
                    setStatus("Completed");
                  }}
                  className="border  hover:bg-gray-200 hover:text-white border-gray-200 text-gray-400 py-1 rounded-md text-center mx-2"
                >
                  Add a Card
                </div>
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>

      {isAddTaskOpen && (
        <TaskModal onClose={closeModal} currentStatus={status} id={id} />
      )}
      <ToastContainer />

      {/* edit board name modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${isEditBoardOpen ? '' : 'hidden'
          }`}
      >
        <div className="modal-overlay absolute w-full h-full backdrop-blur-sm"></div>
        <div className="modal-container bg-white md:w-[30%] w-[90%] mx-auto rounded shadow-lg z-50">
          <div className="modal-content py-4 px-6">
            <h2 className="text-xl font-semibold mb-4">Edit Board Name</h2>
            <input
              type="text"
              className="w-full border rounded p-2 mb-2 outline-none"
              value={newBoardName}
              onChange={handleEditBoardNameChange}
              placeholder="Enter new board name"
            />
            <div className="flex justify-end">
              <button
                className="text-sm text-white bg-red-500 hover:bg-red-600 rounded px-4 py-2 mr-2"
                onClick={() => setIsEditBoardOpen(false)}
              >
                Cancel
              </button>
              <button
                className="text-sm text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
                onClick={EditBoardName}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmatin pop up */}

      {isDeleteConfirmationOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay absolute w-full h-full backdrop-blur-sm"></div>
          <div className="modal-container bg-white w-1.5/5 mx-auto rounded shadow-lg z-50">
            <div className="modal-content py-4 px-6">
              <h2 className="text-xl font-semibold mb-2">Confirm Delete</h2>
              <p className="mb-2">Are you sure you want to delete this board?</p>
              <div className="flex justify-end">
                <button
                  className="text-sm text-white bg-red-500 hover:bg-red-600 rounded px-4 py-2 mr-2"
                  onClick={()=>{setIsDeleteConfirmationOpen(false)}}>
                  Cancel
                </button>
                <button
                  className="text-sm text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
                  onClick={handleDeleteBoard}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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


