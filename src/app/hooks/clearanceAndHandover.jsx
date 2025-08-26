import axios from "axios";
import { HandleLogout, baseUrl, headers, formDataHeader } from "./general";
import {
  mapGraceTimeList,
  mapGraceTimeData,
  mapGraceTimePayloadData,
} from "app/utils/MappingObjects/mapOfficeSettingData";
import { renderErrorMessages } from "utils/renderErrors";

const getClearanceRequestsList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";

  const URL = `/clearance-request/?${ordering ? `ordering=${ordering}&` : ""}${
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
    console.error("Error getting clearance requests list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Get clearance request by ID
const getClearanceRequestById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/clearance-request/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting clearance request by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
  }
};

const getClearanceRequestItems = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";

  const URL = `/clearance-request-items/?${
    ordering ? `ordering=${ordering}&` : ""
  }${pageNo ? `page=${pageNo}&` : ""}${
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
    console.error("Error getting clearance request items:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Update clearance request item
const updateClearanceRequestItem = async (id, payload) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/clearance-request-items/${id}/`,
      payload,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error updating clearance request item:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

// Create new clearance request
const createClearanceRequest = async (payload) => {
  try {
    const response = await axios.post(
      `${baseUrl}/clearance-request/`,
      payload,
      {
        headers: headers(),
      }
    );
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error creating clearance request:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

// Update clearance request
const updateClearanceRequest = async (id, payload) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/clearance-request/${id}/`,
      payload,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error updating clearance request:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

const getClearanceActionLogs = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";

  const URL = `/clearance-action-logs/?${
    ordering ? `ordering=${ordering}&` : ""
  }${pageNo ? `page=${pageNo}&` : ""}${
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
    console.error("Error getting clearance action logs:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

export {
  getClearanceRequestsList,
  getClearanceRequestById,
  getClearanceRequestItems,
  updateClearanceRequestItem,
  createClearanceRequest,
  updateClearanceRequest,
  getClearanceActionLogs,
};
