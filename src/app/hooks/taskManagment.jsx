import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import { handleLogout } from "./general";
import { Project } from "app/utils/Types/TaskManagment";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getAllProjects = async (payload) => {
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
    if (response.status === 200) {
      const data = response.data;
      const ProjectsData = {
        count: data.length,
        results: data,
      };
      return ProjectsData;
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
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/task/?${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const data = response.data;
      const ProjectsData = {
        count: data.length,
        results: data,
      };
      return ProjectsData;
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
const getAllTasks = async (payload) => {
  const filterData = payload?.filterData ?? {};
  console.log("filterData", filterData);
  const URL = `/task/?order=-date${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const data = response.data;
      console.log("get all tasks", data);
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
        {attachments: payload},
        {
          headers: headers(),
        }
      );
      if(response.status === 201){
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
        `${baseUrl}/TaskmanagementAttachment/${attachmentId}`,
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

const fetchComments = async (taskId) => {
  try {
    const response = await axios.get(`${baseUrl}/comments?task_id=${taskId}`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

const postComment = async (taskId, userId, comment) => {
  try {
    const response = await axios.post(
      `${baseUrl}/comments/`,
      {
        task_id: taskId,
        user_id: userId,
        comment: comment,
      },
      {
        headers: headers(), 
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error posting comment:", error);
    throw error; // Re-throw the error to handle it in the component
  }
};

export {
  getAllProjects,
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
  getAttachmentById,
  deleteAttachment,
  fetchComments,
  postComment,
};
