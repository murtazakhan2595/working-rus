import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { HandleLogout } from "./general";
import moment from "moment";
const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  // Don't explicitly set 'Content-Type' for FormData
});
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const getDtr = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  let URL = `/dtr?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching dtr list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};
const getLogTimeList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  let URL = `/logtime?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching dtr list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};
const getTaskDetailsFromLogtime = async (logTimeList) => {
  if (!Array.isArray(logTimeList) || logTimeList.length === 0) {
    console.warn("Invalid or empty logTimeList provided.");
    return [];
  }

  const taskPromises = logTimeList.map(async (logTime) => {
    try {
      // Fetch log time details
      const logTimeResponse = await axios.get(`${baseUrl}/logtime/${logTime}`, {
        headers: headers(),
      });

      if (logTimeResponse?.status === 200 && logTimeResponse?.data?.task_id) {
        // Fetch task details using task_id from log time response
        const taskResponse = await axios.get(
          `${baseUrl}/task/${logTimeResponse.data.task_id}`,
          {
            headers: headers(),
          }
        );

        if (taskResponse?.status === 200) {
          return {
            ...taskResponse.data,
            ...{ consumed_time: logTimeResponse?.data?.consumed_time },
          }; // Return task data
        }
      }
    } catch (error) {
      console.error("Error fetching task details:", error.message);
      if (error?.response?.status === 401) {
        HandleLogout();
      }
    }
    return null; // Return null for failed or invalid cases
  });

  // Wait for all promises to resolve
  const taskResults = await Promise.all(taskPromises);

  // Filter out null results
  return taskResults.filter((task) => task !== null);
};

const addLogTime = async (payload, id = null) => {
  try {
    // Create FormData object
    const formData = new FormData();
    if (payload.attachment instanceof File)
      formData.append("attachment", payload.attachment);
    if (payload.consumed_time)
      formData.append("consumed_time", payload.consumed_time);
    if (payload.notes) formData.append("notes", payload.notes);
    if (payload.task_id) formData.append("task_id", payload.task_id);
    if (payload.id) formData.append("id", payload.id);
    if (payload.date) formData.append("date", payload.date);

    const url = id
      ? `${baseUrl}/logtime/${id}` // Use id if updating
      : `${baseUrl}/logtime/`; // No id means create new

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
    console.error("Error adding/updating LogTime:", error);
    return false;
  }
};
const addUpdateDTR = async (payload, id = null) => {
  try {
    const url = id
      ? `${baseUrl}/dtr/${id}` // Use id if updating
      : `${baseUrl}/dtr/`; // No id means create new

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
    console.error("Error adding/updating LogTime:", error);
    return false;
  }
};
const deleteDTR = async (id = null) => {
  try {
    const url = `${baseUrl}/dtr/${id}`;
    const method = "DELETE";

    const response = await axios({
      method,
      url,
      headers: headers(),
    });

    // Check response status
    if (response.status === 204 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // Handle errors
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error adding/updating LogTime:", error);
    return false;
  }
};

export {
  getDtr,
  addLogTime,
  getLogTimeList,
  addUpdateDTR,
  getTaskDetailsFromLogtime,
};
