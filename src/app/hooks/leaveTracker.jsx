import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { getEmployeeCustomList, handleLogout } from "./general";
import moment from "moment";
const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const saveLeaveComponents = async (payload) => {
  try {
    if (payload?.id) {
      // If there's an ID, use PATCH to update the existing leave component
      const response = await axios.patch(
        `${baseUrl}/leavecomponents/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      // If no ID, use POST to create a new leave component
      const response = await axios.post(
        `${baseUrl}/leavecomponents/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error saving leave components:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
};


const getLeaveComponents = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/leavecomponents?ordering=-id&${
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
    }
  } catch (error) {
    console.error("Error fetching earn and deduction data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
};


const deleteLeaveComponent = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/leavecomponents/${id}`, {
      headers: headers(),
    });
    if (response.status === 204) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting leave component:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
}

const saveLeaveTransaction = async (payload) => {
  try {
    if (payload?.id) {
      // If there's an ID, use PATCH to update the existing leave transaction
      const response = await axios.patch(
        `${baseUrl}/employeeleavetrasanction/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      // If no ID, use POST to create a new leave transaction
      const response = await axios.post(
        `${baseUrl}/employeeleavetrasanction/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error saving leave transactions:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
};

const saveLeave = async (payload) => {
  try {
    if (payload?.id) {
      // If there's an ID, use PATCH to update the existing leave
      const response = await axios.patch(
        `${baseUrl}/leave/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      // If no ID, use POST to create a new leave
      const response = await axios.post(
        `${baseUrl}/leave/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error saving leave:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
}

const getLeaves = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/leave?ordering=-id&${
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
    }
  } catch (error) {
    console.error("Error fetching leave data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
}

export {
  saveLeaveComponents,
  getLeaveComponents,
  deleteLeaveComponent,
  saveLeaveTransaction,
  saveLeave,
  getLeaves,
};