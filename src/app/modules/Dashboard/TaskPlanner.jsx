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
  const [isCompleteTab, setIsCompleteTab] = useState(false);
  const [boards, setBoards] = useState([]);
  const [nextPage, setNextPage] = useState("");

  const navigate = useNavigate();

  const getTasks = async (
    url = `${baseUrl}/task/?search={"user_id":[${userProfile.id}]}&ordering=end_date`
  ) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const tasksData = response.data;

        const tasksWithBardName = [];
        for (const task of tasksData) {
          let username = users.filter((u) => u.id === task.assigned_by);
          let boardname = boards.filter((b) => b.id === task.board_id);
          let project_id = boardname[0].project_id
          const taskWithname = {
            ...task,
            boardName: boardname[0].name,
            userName: username[0].username,
            project_id: project_id,
          };
          tasksWithBardName.push(taskWithname);
          setLoading(false);
          setTasks(tasksWithBardName);
        }
      }
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
            setBoards((prevTasks) => [...prevTasks, ...response.data.results]);
            setNextPage(response.data.next);
          }
        });
    } catch (error) { }
  };

  const getLenght = (task) => {
    let tName = String(task.name);
    return tName.length > 25 && "...";
  };

  useEffect(() => {
    do {
      nextPage ? getBoards(nextPage) : getBoards();
    } while (nextPage);
    getUsers();
  }, []);
  useEffect(() => {
    getTasks();
  }, [users]);

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
          className={` cursor-pointer ${isCompleteTab ? "opacity-30" : "text-blue-600"}`}
          onClick={() => {
            setIsCompleteTab(false);
          }}
        >
          Ongoing
        </div>
        {/* <div className="opacity-30">Overdue</div> */}
        <div
          className={` cursor-pointer ${isCompleteTab ? "text-blue-600" : "opacity-30"}`}
          onClick={() => {
            setIsCompleteTab(true);
          }}
        >
          Completed
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
          {!loading ? (
            <div className="h-[30vh] roundScroll overflow-auto mt-6">
              {isCompleteTab
                ? tasks.map(
                  (task, index) =>
                    task.status === "Completed" && (
                      <div
                        onClick={() => {
                          navigate(`/board/${task.board_id}`);
                        }}
                        key={index}
                        className="flex justify-around py-3 my-5 rounded-md shadow-md bg-[#eeeff7] text-[#283b91] hover:bg-[#283b91] hover:text-white transition-all duration-300 group text-center text-sm"
                      >
                        <div className="w-44">
                          {task.name.substring(0, 25)} {getLenght(task)}
                        </div>
                        <div className="w-28">{task.userName}</div>
                        <div className="w-28">{task.end_date}</div>
                        <div className="w-28">{task.status}</div>
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
                          navigate(`/board/${task.board_id}?pId=${task.project_id}`);
                        }}
                        key={index}
                        className="flex justify-around py-3 my-5 rounded-md shadow-md bg-[#eeeff7] text-[#283b91] hover:bg-[#283b91] hover:text-white transition-all duration-300 group text-center text-sm"
                      >
                        <div className="w-44">
                          {task.name.substring(0, 25)} {getLenght(task)}
                        </div>
                        <div className="w-28">{task.userName}</div>
                        <div className="w-28">{task.end_date}</div>
                        <div className="w-28">{task.status}</div>
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
                )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[30vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                <p className="text-gray-600 mt-4">Loading...</p>
              </div>
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
