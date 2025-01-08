import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import { handleLogout } from "./general";
import { Project } from "app/utils/Types/TaskManagment";
import { getTaskFilteredData } from "utils/Lists";
import { getFileNameFromURL } from "utils/downUtils";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  // Don't explicitly set 'Content-Type' for FormData
});

const getAllProjects = async (payload, userProfile) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/project/?ordering=-created_at&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const data = response.data;
      if (userProfile.role === 4 || userProfile.role === 2) {
        const filteredResults = data?.results?.filter(
          (project) =>
            project.project_members.includes(userProfile.id) ||
            project.created_by === userProfile.id
        );

        const ProjectsData = {
          count: filteredResults.length,
          results: filteredResults,
        };
        return ProjectsData;
      } else {
        const ProjectsData = {
          count: data?.results?.length,
          results: data?.results,
        };
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
      const data = response.data?.results;
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
const getTaskByprojectId = async (payload) => {
  try {
    // Fetch all boards
    const allBoards = await getAllBoards(payload);

    if (!allBoards || !allBoards.results || allBoards.results.length === 0) {
      return {
        count: 0,
        results: [],
      };
    }
    const boardIdsList = await Promise.all(
      allBoards.results.map(async (board) => {
        return board.id;
      })
    );
    // Fetch tasks for each board concurrently
    try {
      const tasksList = await getTaskByBoardId({
        filterData: { board_id: boardIdsList },
      });
      return tasksList.results; // Extract results from task data
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error(`Error fetching tasks for board IDs:`, error);
      return []; // Return an empty array for this board if fetching fails
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching tasks by project ID:", error);
    return {
      count: 0,
      results: [],
    };
  }
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
      const data = response.data?.results;
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
      const data = response.data?.results;
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
  const id = payload.get("id");
  try {
    if (id) {
      const response = await axios.patch(
        `${baseUrl}/project/${id}/`,
        payload,
        {
          headers: formDataHeader(),
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
        headers: formDataHeader(),
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
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/task/${payload.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) return true;
      else return false;
    } else {
      const response = await axios.post(`${baseUrl}/task/`, payload, {
        headers: headers(),
      });
      if (response.status === 201) return true;
      else return false;
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
        `${baseUrl}/task/${payload.id}/`,
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
const addTaskCheckListItem = async (payload, id = null) => {
  try {
    // Create FormData object
    const url = id
      ? `${baseUrl}/taskchecklist/${id}` // Use id if updating
      : `${baseUrl}/taskchecklist`; // No id means create new

    const method = id ? "PUT" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: payload,
      headers: headers(),
    });

    // Check response status
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // Handle errors
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding/updating CheckList:", error);
    return false;
  }
};
const getTaskCheckListItem = async (checkListID) => {
  try {
    const response = await axios.get(
      `${baseUrl}/taskchecklist/${checkListID}`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
    return false;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error deleting task Check List Item:", error);
    toast.error("Error deleting task Check List Item!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};
const deleteTaskCheckListItem = async (checkListID) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/taskchecklist/${checkListID}`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      toast.success("Task Check List Item Deleted!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error deleting task Check List Item:", error);
    toast.error("Error deleting task Check List Item!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};
const addAttachments = async (payload, id = null) => {
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append("attachments", payload.attachments);

    const url = id
      ? `${baseUrl}/TaskmanagementAttachment/${id}` // Use id if updating
      : `${baseUrl}/TaskmanagementAttachment`; // No id means create new

    const method = id ? "PUT" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: formData,
      headers: formDataHeader(),
    });

    // Check response status
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // Handle errors
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding/updating attachment:", error);
    return false;
  }
};

const addCommentAttachment = async (payload, id) => {
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append("attachment", payload.attachment);

    const url = id
      ? `${baseUrl}/CommentAttachment/${id}` // Use id if updating
      : `${baseUrl}/CommentAttachment`; // No id means create new

    const method = id ? "PUT" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: formData,
      headers: formDataHeader(),
    });

    // Check response status
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // Handle errors
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding/updating attachment:", error);
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
    if (response.status === 204) return true;
    else return false;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error deleting attachment:", error);
    return false;
  }
};

const getTaskById = async (taskId) => {
  // Helper function to fetch checklist item details
  const getCheckListItemDetails = async (checklistIds) => {
    if (!checklistIds || checklistIds.length === 0) return [];
    try {
      const checklistDetails = await Promise.all(
        checklistIds.map(async (id) => {
          const response = await getTaskCheckListItem(id);
          return {
            id: response.id,
            description: response.description,
            is_completed: response.is_completed,
          };
        })
      );
      return checklistDetails;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching checklist items:", error);
      throw error; // Propagate error to the caller
    }
  };

  // Helper function to fetch attachment details
  const getAttachmentDetails = async (attachmentIds) => {
    if (!attachmentIds || attachmentIds.length === 0) return [];
    try {
      const attachmentDetails = await Promise.all(
        attachmentIds.map(async (id) => {
          const response = await getAttachmentById(id);
          return {
            attachments: response.attachments,
            id: response.id,
            name: getFileNameFromURL(response.attachments),
          };
        })
      );
      return attachmentDetails;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching attachments:", error);
      throw error; // Propagate error to the caller
    }
  };
  try {
    if (taskId) {
      const response = await axios.get(`${baseUrl}/task/${taskId}`, {
        headers: headers(),
      });
      if (response.status === 200) {
        const cardDetails = response.data;
        if (!cardDetails) {
          throw new Error("Card details not found.");
        }
        // Fetch attachment and checklist details if they exist
        const attachments = cardDetails.attachment?.length
          ? await getAttachmentDetails(cardDetails.attachment)
          : [];
        const checklistItems = cardDetails.task_checklist?.length
          ? await getCheckListItemDetails(cardDetails.task_checklist)
          : [];

        // Update state only if the component is still mounted
        const finalDetails = {
          ...cardDetails,
          attachment: attachments,
          task_checklist: checklistItems,
        };
        return finalDetails;
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
      `${baseUrl}/comments/?ordering=-created_at&search=${encodeURIComponent(
        JSON.stringify(filter)
      )}`,
      {
        headers: headers(),
      }
    );
    return response.data?.results;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching comments:", error);
    return [];
  }
};

const postComment = async (payload) => {
  try {
    const response = await axios.post(`${baseUrl}/comments/`, payload, {
      headers: headers(),
    });
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error posting comment:", error);
    throw error; // Re-throw the error to handle it in the component
  }
};
const getAllTasks = async (payload) => {
  const filterData = payload?.filterData ?? {};
  const URL = `/task/?ordering=-date&search=${encodeURIComponent(
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
  // Helper function to fetch attachment details
  const getAttachmentDetails = async (attachmentIds) => {
    if (!attachmentIds || attachmentIds.length === 0) return [];
    try {
      const attachmentDetails = await Promise.all(
        attachmentIds.map(async (id) => {
          const response = await axios.get(
            `${baseUrl}/CommentAttachment/${id}`,
            {
              headers: headers(),
            }
          );
          return {
            attachment: response?.data?.attachment,
            id: response?.data?.id,
            name: getFileNameFromURL(response?.data?.attachment),
          };
        })
      );
      return attachmentDetails;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching attachments:", error);
      throw error; // Propagate error to the caller
    }
  };
  try {
    const comments = await fetchComments(filter);
    if (!comments) {
      return [];
    }

    // Merge attachments with comments
    const commentsWithAttachments = await Promise.all(
      comments.map(async (comment) => {
        // Fetch attachment and checklist details if they exist
        const attachments =
          comment.commentattach?.length > 0
            ? await getAttachmentDetails(comment.commentattach)
            : [];
        return {
          ...comment,
          commentattach: attachments,
        };
      })
    );
    console.log(commentsWithAttachments);
    return commentsWithAttachments;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
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
  addTaskCheckListItem,
  getTaskCheckListItem,
  deleteTaskCheckListItem,
  getAttachmentById,
  deleteAttachment,
  fetchComments,
  postComment,
  getAllLabels,
  getCommentsWithAttachments,
  getTaskByprojectId,
};
