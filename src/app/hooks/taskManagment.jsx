import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import { handleLogout } from "./general";
import { Project } from "app/utils/Types/TaskManagment";
import { getTaskFilteredData } from "utils/Lists";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getAllProjects = async (payload, userProfile) => {
  console.log(userProfile);
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/project/?order=-date&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    console.log("response in get all projects", response);
    if (response.status === 200) {
      const data = response.data;
      if (userProfile.role === 4 || userProfile.role === 2) {
        console.log(data);
        const filteredResults = data.filter(
          (project) =>
            project.project_members.includes(userProfile.id) ||
            project.created_by === userProfile.id
        );

        const ProjectsData = {
          count: filteredResults.length,
          results: filteredResults,
        };
        console.log("returning in if", ProjectsData);
        return ProjectsData;
      } else {
        const ProjectsData = {
          count: data.length,
          results: data,
        };
        console.log("returning in else", ProjectsData);
        return ProjectsData;
      }
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};
const getTaskByBoardId = async (payload) => {
  const filterData = payload?.filterData ?? {};
  delete filterData.end_date;
  delete filterData.priority;
  filterData.assigned_to = filterData.optionsValues;
  delete filterData.optionsValues;
  const URL = `/task/?search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const data = response.data;
      const taskList = getTaskFilteredData(data, payload?.filterData ?? {});
      const TasksData = {
        count: taskList.length,
        results: taskList,
      };
      return TasksData;
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};
const getAllBoards = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/board/?order=-date&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const data = response.data;
      const BoardsData = {
        count: data.length,
        results: data,
      };
      return BoardsData;
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};
const getAllLabels = async () => {
  const URL = `/TaskLabel`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      const data = response.data;
      return data;
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching task data :", error);
  }
  return [];
};

const addBoard = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/board/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        toast.success("List Updated!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      return response;
    } else {
      const response = await axios.post(`${baseUrl}/board/`, payload, {
        headers: headers(),
      });
      if (response.status === 201) {
        toast.success("List Added!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      return response;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding job:", error);
    return false;
  }
};
const addProject = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/project/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        toast.success("Project Updated!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      return response;
    } else {
      const response = await axios.post(`${baseUrl}/project/`, payload, {
        headers: headers(),
      });
      if (response.status === 201) {
        toast.success("Project Added!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      return response;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding project:", error);
    return false;
  }
};
const addTask = async (payload) => {
  console.log("addtask payload", payload);
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/task/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        toast.success("Task Updated!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      return response;
    } else {
      const response = await axios.post(`${baseUrl}/task/`, payload, {
        headers: headers(),
      });
      if (response.status === 201) {
        toast.success("Task Added!", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      return response;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding task:", error);
    return false;
  }
};
const moveTask = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/task/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      return response;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding task:", error);
    return false;
  }
};
const addAttachments = async (payload) => {
  try {
    const response = await axios.post(
      `${baseUrl}/TaskmanagementAttachment`,
      { attachments: payload },
      {
        headers: headers(),
      }
    );
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding task:", error);
    return false;
  }
};
const addCommentAttachment = async (payload) => {
  try {
    const response = await axios.post(
      `${baseUrl}/CommentAttachment`,
      { attachment: payload },
      {
        headers: headers(),
      }
    );
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding task:", error);
    return false;
  }
};

const getProjectById = async (projectId) => {
  try {
    if (projectId) {
      const response = await axios.get(`${baseUrl}/project/${projectId}`, {
        headers: headers(),
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return Project;
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding job:", error);
    return Project;
  }
};

const getBoardById = async (boardId) => {
  try {
    if (boardId) {
      const response = await axios.get(`${baseUrl}/board/${boardId}`, {
        headers: headers(),
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return Project;
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding job:", error);
    return Project;
  }
};

const deleteProject = async (projectId) => {
  try {
    const response = await axios.delete(`${baseUrl}/project/${projectId}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      toast.success("Project Deleted!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error deleting project:", error);
    toast.error("Error deleting project!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};
const deleteBoard = async (taskId) => {
  try {
    const response = await axios.delete(`${baseUrl}/board/${taskId}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      toast.success("Bard Deleted!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error deleting board:", error);
    toast.error("Error deleting board!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};
const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${baseUrl}/task/${taskId}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      toast.success("Task Deleted!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error deleting task:", error);
    toast.error("Error deleting task!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};
const deleteAttachment = async (attachmentId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/TaskmanagementAttachment/${attachmentId}`,
      {
        headers: headers(),
      }
    );
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error deleting attachment:", error);
    return false;
  }
};

const getTaskById = async (taskId) => {
  try {
    if (taskId) {
      const response = await axios.get(`${baseUrl}/task/${taskId}`, {
        headers: headers(),
      });
      if (response.status === 200) {
        console.log("get task by id", response.data);
        return response.data;
      } else {
        return {};
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error getting task:", error);
    return {};
  }
};
const getAttachmentById = async (attachmentId) => {
  try {
    if (attachmentId) {
      const response = await axios.get(
        `${baseUrl}/attachment/${attachmentId}`,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        console.log("get attachment by id", response.data);
        return response.data;
      } else {
        return {};
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error getting attachment:", error);
    return {};
  }
};

const fetchComments = async (filter) => {
  try {
    const response = await axios.get(
      `${baseUrl}/comments/?search=${encodeURIComponent(
        JSON.stringify(filter)
      )}`,
      {
        headers: headers(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

const postComment = async (payload) => {
  try {
    const response = await axios.post(`${baseUrl}/comments/`, payload, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error; // Re-throw the error to handle it in the component
  }
};
const getAllTasks = async (payload) => {
  const filterData = payload?.filterData ?? {};
  const URL = `/task/?order=-date&search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const data = response.data;
      return data;
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching task data :", error);
  }
  return [];
};

const getCommentsWithAttachments = async (filter) => {
  try {
    const comments = await fetchComments(filter);
    const attachmentIds = comments.flatMap((comment) => comment.commentattach);
    console.log(attachmentIds);
    const attachments =
      attachmentIds.length > 0
        ? await Promise.all(
            attachmentIds.map((id) =>
              axios
                .get(`${baseUrl}/CommentAttachment/${id}`, {
                  headers: headers(),
                })
                .then((response) => response.data)
            )
          )
        : [];
    const attachmentsMap = new Map(attachments.map((att) => [att.id, att]));

    // Merge attachments with comments
    const commentsWithAttachments = comments.map((comment) => ({
      ...comment,
      attachments: comment.commentattach.map(
        (id) => attachmentsMap.get(id) || null
      ),
    }));
    return commentsWithAttachments;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};
export {
  getAllProjects,
  getAllTasks,
  addProject,
  getAllBoards,
  getProjectById,
  getBoardById,
  deleteProject,
  addBoard,
  getTaskByBoardId,
  addTask,
  getTaskById,
  deleteTask,
  deleteBoard,
  moveTask,
  addAttachments,
  addCommentAttachment,
  getAttachmentById,
  deleteAttachment,
  fetchComments,
  postComment,
  getAllLabels,
  getCommentsWithAttachments,
};
