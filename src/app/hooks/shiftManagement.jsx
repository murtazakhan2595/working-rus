import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { HandleLogout } from "./general";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  // Don't explicitly set 'Content-Type' for FormData
});

const saveShift = async (payload) => {
  try {
    console.log("payload", payload);
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/shift/${payload.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } else {
      const response = await axios.post(`${baseUrl}/shift/`, payload, {
        headers: headers(),
      });
      if (response.status === 201) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error updating asset request:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    throw error;
  }
};

const saveShiftSchedule = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/shift-schedules/${payload.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } else {
      const response = await axios.post(
        `${baseUrl}/shift-schedules/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error updating asset request:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getShiftSchedule = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/shift-schedules?ordering=${sortField}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

// Shift Change Request Functions

const saveShiftChangeRequest = async (payload) => {
  try {
    console.log("Shift change request payload", payload);
    if (payload?.id) {
      // Update existing request (approve/reject)
      const response = await axios.patch(
        `${baseUrl}/shift-change-requests/${payload.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } else {
      // Create new shift change request
      const response = await axios.post(
        `${baseUrl}/shift-change-requests/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error saving shift change request:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getShiftChangeRequests = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "-id";
  let URL = `/shift-change-requests?ordering=${sortField}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching shift change requests:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getShiftChangeRequestById = async (requestId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/shift-change-requests/${requestId}/`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching shift change request:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

// Shift Calendar Related Functions

const getEmployeeShiftCalendar = async (payload) => {
  const employeeId = payload?.employeeId;
  const startDate = payload?.startDate;
  const endDate = payload?.endDate;

  let URL = `/employees/${employeeId}/shift-calendar?`;
  if (startDate) URL += `start_date=${startDate}&`;
  if (endDate) URL += `end_date=${endDate}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching employee shift calendar:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getEmployeeEffectiveShift = async (employeeId, date) => {
  try {
    const response = await axios.get(
      `${baseUrl}/employees/${employeeId}/effective-shift?date=${date}`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching effective shift:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export {
  saveShift,
  saveShiftSchedule,
  getShiftSchedule,
  saveShiftChangeRequest,
  getShiftChangeRequests,
  getShiftChangeRequestById,
  getEmployeeShiftCalendar,
  getEmployeeEffectiveShift,
};
