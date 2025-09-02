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

  // Add filters to query params with special handling for certain arrays
  Object.keys(filterData).forEach((key) => {
    if (
      filterData[key] !== "" &&
      filterData[key] !== null &&
      filterData[key] !== undefined
    ) {
      if (Array.isArray(filterData[key])) {
        // Special handling for reporting_employees - send as [1,2,3] format
        if (key === "reporting_employees") {
          console.log(
            "Adding reporting_employees to query params:",
            filterData[key]
          );
          // Convert array [1] to string "[1]"
          const arrayAsString = `[${filterData[key].join(",")}]`;
          console.log("Array as string:", arrayAsString);
          queryParams.append("reporting_employees", arrayAsString);
        } else {
          // For other arrays, use comma-separated format
          queryParams.append(key, filterData[key].join(","));
        }
      } else {
        queryParams.append(key, filterData[key]);
      }
    }
  });

  console.log("queryParams:", queryParams.toString());

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
    // Handle both 200 and 201 status codes as success
    if (response.status === 200 || response.status === 201) {
      return response.data;
    } else {
      console.log(`Unexpected status code: ${response.status}`);
      return false;
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

const updateClearanceRequestItemWithFile = async (id, formData) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/clearance-request-items/${id}/`,
      formData,
      {
        headers: formDataHeader(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error updating clearance request item with file:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
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
  updateClearanceRequestItemWithFile,
};
