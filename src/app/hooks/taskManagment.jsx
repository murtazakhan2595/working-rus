import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import { HandleLogout } from "./general";
import { Project } from "app/utils/Types/TaskManagment";
import { mapProjectPayloadData } from "app/utils/MappingObjects/mapTaskManagementData";
import { convertStringsArrayToJsonArray } from "utils/Lists";
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

export const getAllProjects = async (payload, userProfile) => {
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
      const projects = await Promise.all(
        data?.results &&
          data?.results?.length &&
          data?.results.map(async (project) => {
            const profileResponse = await getAttachmentById(
              project.profile_picture
            );
            return {
              ...project,
              profile_img: profileResponse?.attachment || null,
            };
          })
      );
      const ProjectsData = {
        count: data?.count,
        results: projects,
      };
      return ProjectsData;
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};
const getTaskByBoardId = async (payload) => {
  const filterData = payload?.filterData ?? {};
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const URL = `/task/?${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const data = response.data;
      const TasksData = {
        count: data.count,
        results: data.results,
      };
      return TasksData;
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};
export const getTaskByprojectId = async (projectId, payload) => {
  try {
    // Fetch all boards
    const allBoards = await getAllBoards({
      filterData: { project_id: [projectId] },
    });

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
      const filterData = payload?.filterData ?? {};
      const options = payload?.options ?? {};
      const tasksList = await getTaskByBoardId({
        filterData: { ...filterData, board_id: boardIdsList },
        options: options,
      });
      return tasksList; // Extract results from task data
    } catch (error) {
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      console.error(`Error fetching tasks for board IDs:`, error);
      return []; // Return an empty array for this board if fetching fails
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
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
  const URL = `/board/?order=-id&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      let data = response.data?.results;

      // Sort by 'ordering' if available, otherwise fall back to 'id'
      data = data.sort((a, b) => {
        if (a.ordering !== null && b.ordering !== null) {
          return a.ordering - b.ordering;
        }
        return a.id - b.id; // Fallback sorting by ID
      });

      return {
        count: data.length,
        results: data,
      };
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Board data:", error);
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
      HandleLogout();
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
      HandleLogout();
    }
    console.error("Error adding job:", error);
    return false;
  }
};
const addProject = async (payload, projectID) => {
  const profilePictureResponse =
    payload.profile_img instanceof File
      ? await addAttachments(
          { attachment: payload.profile_img },
          payload.profile_picture
        )
      : null;
  const formData = mapProjectPayloadData({
    ...payload,
    profile_picture: profilePictureResponse?.id || payload.profile_picture,
  });
  try {
    if (projectID) {
      const response = await axios.patch(
        `${baseUrl}/project/${projectID}/`,
        formData,
        {
          headers: formDataHeader(),
        }
      );

      return response;
    } else {
      const response = await axios.post(`${baseUrl}/project/`, formData, {
        headers: formDataHeader(),
      });

      return response;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error adding project:", error);
    return false;
  }
};
const addTask = async (payload, id) => {
  const taskId = payload.id || id;
  try {
    if (taskId) {
      const response = await axios.patch(
        `${baseUrl}/task/${taskId}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200 || response.status === 201) return response;
      else return false;
    } else {
      const response = await axios.post(`${baseUrl}/task/`, payload, {
        headers: headers(),
      });
      if (response.status === 201) return response;
      else return false;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
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
      HandleLogout();
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
      HandleLogout();
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
      HandleLogout();
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
      HandleLogout();
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
    formData.append("attachment", payload.attachment);

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
      HandleLogout();
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
      HandleLogout();
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
    console.error("Error adding job:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    } else if (error?.response?.status === 404) {
      return -1;
    }
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
      HandleLogout();
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
      HandleLogout();
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
      HandleLogout();
    }
    console.error("Error deleting board:", error);
    return false;
  }
};
const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${baseUrl}/task/${taskId}`, {
      headers: headers(),
    });
    if (response.status === 200 || response.status === 204) {
      toast.success("Task Deleted!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
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
      HandleLogout();
    }
    console.error("Error deleting attachment:", error);
    return false;
  }
};
export const getAttachmentDetails = async (attachmentIds) => {
  if (!attachmentIds || attachmentIds.length === 0) return [];
  try {
    const attachmentDetails = (
      await Promise.all(
        attachmentIds.map(async (id) => {
          const response = await getAttachmentById(id);
          return response.attachment
            ? {
                attachment: response.attachment,
                id: response.id,
                name: getFileNameFromURL(response.attachment),
              }
            : null; // Return null if no attachment
        })
      )
    ).filter(Boolean); // Remove null values in the same statement
    return attachmentDetails;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching attachments:", error);
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
        HandleLogout();
      }
      console.error("Error fetching checklist items:", error);
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
          ? await getAttachmentDetails([cardDetails.attachment])
          : [];
        const checklistItems = cardDetails.task_checklist?.length
          ? await getCheckListItemDetails(cardDetails.task_checklist)
          : [];

        // Update state only if the component is still mounted
        const finalDetails = {
          ...cardDetails,
          attachment: attachments,
          task_checklist: checklistItems,
          custom_fields: convertStringsArrayToJsonArray(
            cardDetails.custom_fields,
            "field",
            "value"
          ),
        };
        return finalDetails;
      } else {
        return {};
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
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
      HandleLogout();
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
      HandleLogout();
    }
    console.error("Error fetching comments:", error);
    return [];
  }
};

const postComment = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/comments/${payload.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      return response;
    } else {
      const response = await axios.post(`${baseUrl}/comments/`, payload, {
        headers: headers(),
      });
      return response;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error handling comment:", error);
    return false;
  }
};
export const getAllTasks = async (payload) => {
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-start_date";
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const URL = `/task/?ordering=${ordering}&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;

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
      HandleLogout();
    }
    console.error("Error fetching task data :", error);
  }
  return [];
};

const getCommentsAttachmentDetails = async (attachmentIds) => {
  if (!attachmentIds || attachmentIds.length === 0) return [];
  try {
    const attachmentDetails = (
      await Promise.all(
        attachmentIds.map(async (id) => {
          const response = await axios.get(
            `${baseUrl}/CommentAttachment/${id}`,
            {
              headers: headers(),
            }
          );
          return response?.data?.attachment
            ? {
                attachment: response?.data?.attachment,
                id: response?.data?.id,
                name: getFileNameFromURL(response?.data?.attachment),
              }
            : null; // Return null if no attachment
        })
      )
    ).filter(Boolean); // Remove null values in the same statement
    return attachmentDetails;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching attachments:", error);
    throw error; // Propagate error to the caller
  }
};

const getCommentsWithAttachments = async (filter) => {
  // Helper function to fetch attachment details
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
            ? await getCommentsAttachmentDetails(comment.commentattach)
            : [];
        return {
          ...comment,
          commentattach: attachments,
        };
      })
    );
    return commentsWithAttachments;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching comments:", error);
  }
};

const addSubtask = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/subtask/${payload.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) return true;
      else return false;
    } else {
      const response = await axios.post(`${baseUrl}/subtask`, payload, {
        headers: headers(),
      });
      if (response.status === 201) return response.data;
      else return false;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error adding task:", error);
    return false;
  }
};

const getSubtaskById = async (subtaskId) => {
  try {
    if (subtaskId) {
      const response = await axios.get(`${baseUrl}/subtask/${subtaskId}`, {
        headers: headers(),
      });
      if (response.status === 200) {
        return getTaskById(response?.data?.tasks[0]);
      } else {
        return {};
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error getting subtask:", error);
    return {};
  }
};

const createActivity = async (payload) => {
  try {
    const response = await axios.post(`${baseUrl}/activities/`, payload, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error adding activity:", error);
    return false;
  }
};

const getActivities = async (payload) => {
  const filterData = payload?.filterData ?? {};
  const URL = `/activities/?ordering=-created_at&search=${encodeURIComponent(
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
      HandleLogout();
    }
    console.error("Error fetching task data :", error);
  }
  return [];
};

const getAllCustomFields = async (projectId, payload = {}) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? { project: [projectId] };
  const URL = `/dynamic-fields/?ordering=-created_at&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return { results: [], count: 0 };
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

const addCustomFields = async (payload, id) => {
  try {
    // Create FormData object
    const url = id
      ? `${baseUrl}/dynamic-fields/${id}/` // Use id if updating
      : `${baseUrl}/dynamic-fields/`; // No id means create new

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
      HandleLogout();
    }
    console.error("Error adding/updating attachment:", error);
    return false;
  }
};

const deleteCustomFields = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/dynamic-fields/${id}`, {
      headers: headers(),
    });
    if (response.status === 204 || response.status === 200) {
      return response;
    }
    return false;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error deleting task Check List Item:", error);
    return false;
  }
};
export const deleteTaskLabel = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/TaskLabel/${id}`, {
      headers: headers(),
    });
    if (response.status === 200 || response.status === 204) {
      return response;
    }
    return false;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error deleting task Label:", error);
    return false;
  }
};
export const getTaskLabelById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/TaskLabel/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
    return false;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error deleting task Label:", error);
    return false;
  }
};

export const addTaskLabel = async (payload, id) => {
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append("name", payload?.name);
    formData.append("color", payload?.color);
    const url = id
      ? `${baseUrl}/TaskLabel/${id}` // Use id if updating
      : `${baseUrl}/TaskLabel`; // No id means create new

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
      HandleLogout();
    }
    console.error("Error adding/updating task Label:", error);
    return false;
  }
};

const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`${baseUrl}/comments/${commentId}`, {
      headers: headers(),
    });
    if (response.status === 204) {
      toast.success("Comment Deleted!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
    return true;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error deleting comment:", error);
    toast.error("Error deleting comment!", {
      position: toast.POSITION.TOP_RIGHT,
    });
    return false;
  }
};

const updateBoardPosition = async (boardId, ordering) => {
  console.log(boardId, ordering, "HELLO KASHIF");
  try {
    const response = await axios.patch(
      `${baseUrl}/board/${boardId}`,
      { ordering },
      { headers: headers() }
    );
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error updating board position:", error);
    throw error;
  }
};

const addRelationship = async (payload) => {
  try {
    const response = await axios.post(`${baseUrl}/relationship/`, payload, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error adding relationship:", error);
    return false;
  }
}

export {
  addRelationship,
  createActivity,
  getActivities,
  addSubtask,
  getSubtaskById,
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
  deleteComment,
  getCommentsWithAttachments,
  getAllCustomFields,
  addCustomFields,
  deleteCustomFields,
  updateBoardPosition,
};
