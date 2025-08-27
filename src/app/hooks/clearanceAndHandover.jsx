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

const getClearanceAnalytics = async (filterData = {}) => {
  const queryParams = new URLSearchParams();

  // Add filters to query params
  Object.keys(filterData).forEach((key) => {
    if (
      filterData[key] !== "" &&
      filterData[key] !== null &&
      filterData[key] !== undefined
    ) {
      if (Array.isArray(filterData[key])) {
        queryParams.append(key, filterData[key].join(","));
      } else {
        queryParams.append(key, filterData[key]);
      }
    }
  });

  const URL = `/analytics/clearance/list/?${queryParams.toString()}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting clearance analytics:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {
      status_summary: [],
      department_summary: [],
      type_summary: [],
      clearance_list: [],
    };
  }
};

// ==================== CERTIFICATE APIs ====================

// Get clearance certificates list
const getClearanceCertificatesList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";

  const URL = `/clearance-certificates/?${
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
    console.error("Error getting clearance certificates list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

// Create new clearance certificate
const createClearanceCertificate = async (payload) => {
  try {
    const response = await axios.post(
      `${baseUrl}/clearance-certificates/`,
      payload,
      {
        headers: headers(),
      }
    );
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error creating clearance certificate:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

// Upload clearance certificate
const uploadClearanceCertificate = async (id, payload) => {
  try {
    const response = await axios.post(
      `${baseUrl}/clearance-certificates/${id}/upload_certificate/`,
      payload,
      {
        headers: formDataHeader(),
      }
    );
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error uploading clearance certificate:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

// Send clearance certificate
const sendClearanceCertificate = async (id, payload) => {
  try {
    const response = await axios.post(
      `${baseUrl}/clearance-certificates/${id}/send_certificate/`,
      payload,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error sending clearance certificate:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

// Check if certificate exists for a request
const getClearanceCertificateByRequest = async (requestId) => {
  try {
    const response = await getClearanceCertificatesList({
      filterData: { request: requestId },
      options: { page: 1, sizePerPage: 1 },
      ordering: "-id",
    });
    return response?.results?.[0] || null;
  } catch (error) {
    console.error("Error checking existing certificate:", error);
    return null;
  }
};

export {
  getClearanceRequestsList,
  getClearanceRequestById,
  getClearanceRequestItems,
  getClearanceAnalytics,
  updateClearanceRequestItem,
  createClearanceRequest,
  updateClearanceRequest,
  getClearanceActionLogs,

  // Certificate exports
  getClearanceCertificatesList,
  createClearanceCertificate,
  uploadClearanceCertificate,
  sendClearanceCertificate,
  getClearanceCertificateByRequest,
};
