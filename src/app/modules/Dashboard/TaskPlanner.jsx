import { useState, useEffect } from "react";
import axios from "axios";
import taskImg from "../../../assets/images/task.png";
import { TbAlertCircleFilled } from "react-icons/tb";
import { connect } from "react-redux";
import { tasksTitle } from "../../../data/Data";
import { useNavigate } from "react-router-dom";

const TaskPlanner = ({ userProfile, baseUrl, token }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [isCompleteTab, setIsCompleteTab] = useState(false);
  const [board, setBoard] = useState([]);
  const [boardStatus, setBoardStatus] = useState([]);
  const [nextPage, setNextPage] = useState("");

  const navigate = useNavigate();

  const getTasks = async (
    url = `${baseUrl}/task/?search={"user_id":[${userProfile.id.toString()}]}&ordering=end_date`
  ) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const tasksData = response.data;
        setTasks(response.data);
        if (tasksData?.length === 0) {
          setMsg("You have no task");
          return;
        }
      } else {
        setMsg("Could not get tasks");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getUsers = async (url = `${baseUrl}/customemp/`) => {
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

  const getBoards = async (url = `${baseUrl}/board/`) => {
    try {
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {  
            setBoard(response.data)
          }
        });
    } catch (error) {}
  };
  const getBoardStatus = async (url = `${baseUrl}/boardstatus/`) => {
    try {
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {  
            setBoardStatus(response.data)
          }
        });
    } catch (error) {}
  };

  useEffect(() => {
    do {
      nextPage ? getBoardStatus(nextPage) : getBoardStatus();
    } while (nextPage);
    getUsers();
  }, []);
  useEffect(() => {
    getTasks();
    getBoards();
  }, [users]);

  const getLenght = (task) => {
    let tName = String(task.name);
    return tName.length > 25 && "...";
  };

  const getAssignedUsername = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user?.username;
  };

  const getBoardName = (boardId) => {
    const board = boardStatus.find((board) => board.id === boardId);
    return board?.name;
  };

  return (
    <div className="md:px-10 w-full md:mb-1 pb-3 px-5">
      <div className="flex justify-between items-center">
        <div className="flex gap-5 mb-1 items-center">
          <img src={taskImg} alt="" className="h-10 w-10" />
          <div className="text-2xl font-bold text-[#1E2022] tracking-widest">
            Task Planner
          </div>
        </div>
      </div>
      <div className="flex gap-6 my-2">
        <div
          className={` cursor-pointer ${
            isCompleteTab ? "opacity-30" : "text-blue-600"
          }`}
          onClick={() => {
            setIsCompleteTab(false);
          }}
        >
          Ongoing
        </div>
      </div>

      <div className="w-full overflow-x-auto  xScroll">
        <div className="w-fit md:w-full">
          <div className="flex justify-around py-3 rounded-md shadow-md bg-white text-[#283b91] text-center">
            {tasksTitle.map((column, index) => (
              <div key={index} className={`px-2 ${column.width}`}>
                {column.label}
              </div>
            ))}
          </div>
          {/* {tasks.length < 1 && <div>not Found</div>} */}

          {!loading ? (
            <div className="h-[30vh] roundScroll overflow-auto">
              {isCompleteTab
                ? tasks.map(
                    (task, index) =>
                      task.status === "Completed" && (
                        <div
                          onClick={() => {
                            navigate(
                              // `/board/${board_id}?pId=${task.project_id}`
                            );
                          }}
                          key={index}
                          className="flex justify-around py-3 my-5 rounded-md shadow-md bg-[#eeeff7] text-[#283b91] hover:bg-[#283b91] hover:text-white transition-all duration-300 group text-center text-sm"
                        >
                          <div className="w-44">
                            {task.name.substring(0, 25)} {getLenght(task)}
                          </div>
                          <div className="w-28">{task.userName}</div>
                          <div className="w-28">{task.end_date}</div>
                          {/* <div className="w-28">{task.status}</div> */}
                          <div className="w-28">{task.boardName}</div>
                          <div className="w-28 text-center text-sm">
                            {task.priority === 1 && (
                              <TbAlertCircleFilled className="text-red-600 text-center text-2xl mx-auto" />
                            )}
                            {task.priority === 2 && (
                              <TbAlertCircleFilled className="text-[#ffa500] text-center text-2xl mx-auto" />
                            )}
                            {task.priority === 3 && (
                              <TbAlertCircleFilled className="text-green-600 text-center text-2xl mx-auto" />
                            )}
                          </div>
                        </div>
                      )
                  )
                : tasks.map(
                    (task, index) =>
                      task.status !== "Completed" && (
                        <div
                          onClick={() => {
                            navigate(
                              `/board/${task.board_id}?pId=${task.project_id}`
                            );
                          }}
                          key={index}
                          className="flex justify-around py-3 my-5 rounded-md shadow-md bg-[#eeeff7] text-[#283b91] hover:bg-[#283b91] hover:text-white transition-all duration-300 group text-center text-sm"
                        >
                          <div className="w-44">
                            {task.name.substring(0, 25)} {getLenght(task)}
                          </div>
                          <div className="w-28">
                            {getAssignedUsername(task.assigned_by)}
                          </div>
                          <div className="w-28">{task.end_date}</div>
                          <div className="w-28">
                            {getBoardName(task.board_status_id)}
                          </div>
                          <div className="w-28 text-center text-sm">
                            {task.priority === 1 && (
                              <TbAlertCircleFilled className="text-red-600 text-center text-2xl mx-auto" />
                            )}
                            {task.priority === 2 && (
                              <TbAlertCircleFilled className="text-[#ffa500] text-center text-2xl mx-auto" />
                            )}
                            {task.priority === 3 && (
                              <TbAlertCircleFilled className="text-green-600 text-center text-2xl mx-auto" />
                            )}
                          </div>
                        </div>
                      )
                  )}
            </div>
          ) : (
            <div className="mt-2">
              <div className="bg-gray-300 h-8 mb-1 w-full animate-pulse rounded"></div>
              <div className="bg-gray-300 h-8 mb-1 w-full animate-pulse rounded"></div>
            </div>
          )}
          {msg && (
            <div className="flex justify-center items-center opacity-50 text-sm">
              {msg}
            </div>
          )}
        </div>
      </div>
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

export default connect(mapStateToProps)(TaskPlanner);
