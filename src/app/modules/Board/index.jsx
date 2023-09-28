import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { RiArrowDownSFill } from "react-icons/ri";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { AiTwotoneStar } from "react-icons/ai";
import { FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";
import TaskModal from "./TaskModal";
import TaskView from "./TaskView";
import { toast, ToastContainer } from "react-toastify";
import "./index.css";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Board = ({ userProfile, baseUrl, token }) => {
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
  const { id } = useParams();

  const closeModal = () => {
    setIsAddTaskOpen(false);
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

  return (
    <div className={`w-full h-screen bg-[#F9F9F9] ${boardHidden ? '' : ''}`}>
      {/* ***************************************************** Header ***************************************************** */}
      <div className="py-5 pl-10 pr-2 flex gap-3 items-center justify-between">
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
        <div className="flex py-2 justify-end px-5 items-center gap-3 rounded-lg bg-gray-200">
          <div className="text-3xl w-8 h-8 rounded-full border bg-white"></div>{" "}
          <div className=" text-[#283b91]">{userProfile.username}</div>
          <div className=" text-[#283b91]">
            <RiArrowDownSFill />
          </div>
        </div>
      </div>
      {/* ***************************************************** Board Header ***************************************************** */}
      <div className="bg-[#ebebeb] mb-6 pr-1 pl-5 gap-3  justify-between py-2 flex">
        <div className="flex gap-2">
          <div className="flex justify-center ml-4 items-center">
            <AiTwotoneStar className="text-3xl text-[#283b91]" />
          </div>
          <div className="flex font-bold items-center ml-2 tracking-widest ">
            {board.name}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white px-2 py-1 gap-3 items-center rounded-lg">
            <div className=" px-4 text-[#283b91]">Share</div>
          </div>
          <div className="flex bg-[#f7f7f8] px-2 py-1 gap-3 items-center rounded-lg">
            <div className=" px-1 text-gray-400">
              <BsPencil />
            </div>
          </div>
          <div className="flex bg-[#f7f7f8] px-2 py-1 gap-3 items-center rounded-lg">
            <div className=" px-1 text-gray-400">
              <FiFilter />
            </div>
          </div>
          <div className="flex bg-[#f7f7f8] px-2 mr-5 py-1 gap-3 items-center rounded-lg">
            <div className=" px-1 text-gray-400">
              <BsTrash3 />
            </div>
          </div>
        </div>
      </div>

      {/* ***************************************************** Board Card ***************************************************** */}
      <DragDropContext onDragEnd={boardHidden ? '' : handleDragEnd}>
        <div className="flex w-full justify-start ">
          <div className="flex xScroll  ml-10 pb-2 overflow-x-auto w-[82vw] justify-start">
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
                                    onClick={() => {openTodoView(index); setBoardHidden(true)}}
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
                                        <div className="text-[0.50rem]">🟢</div>
                                      ) : t.priority === 2 ? (
                                        <div className="text-[0.50rem]">🟡</div>
                                      ) : t.priority === 3 ? (
                                        <div className="text-[0.50rem]">🔴</div>
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
                                    onClick={() => {openInProgressView(index); setBoardHidden(true)}}
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
                                        <div className="text-[0.50rem]">🟢</div>
                                      ) : t.priority === 2 ? (
                                        <div className="text-[0.50rem]">🟡</div>
                                      ) : t.priority === 3 ? (
                                        <div className="text-[0.50rem]">🔴</div>
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
                                    onClick={() => {openCompletedView(index); setBoardHidden(true)}}
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
                                        <div className="text-[0.50rem]">🟢</div>
                                      ) : t.priority === 2 ? (
                                        <div className="text-[0.50rem]">🟡</div>
                                      ) : t.priority === 3 ? (
                                        <div className="text-[0.50rem]">🔴</div>
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
