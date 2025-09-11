import axios from "axios";
import { HandleLogout, baseUrl, headers, getCurrentRequestApprover } from "./general";
import moment from "moment";
import { renderErrorMessages } from "utils/renderErrors";
import {
  mapRotationPayloadData,
  mapRotationData,
  mapEmployeeTransferData,
  mapEmployeeTransferPayloadData,
  mapTransferStatsData,
  mapRotationStatsData,
} from "app/utils/MappingObjects/mapTransferRotationData";


export const getJobRotationRecords = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/rotationemp/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers(), });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching job rotation requests:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}
export const getJobRotationRequests = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/job-rotation-requests?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
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
    console.error("Error fetching job rotation requests:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}

export const getJobRotationById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/job-rotation-requests/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const currentapprover = await getCurrentRequestApprover(Response.hierarchy_request);
      const ResponseData = await mapRotationData({
        ...Response,
        ...currentapprover,
      });

      return { ...ResponseData, ...currentapprover };
    }
  } catch (error) {
    console.error("Error fetching job rotation by ID:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const saveJobRotation = async (payload, id) => {
  const ID = id || payload?.id;
  try {
    const finalPayload = mapRotationPayloadData(payload);

    const url = ID
      ? `${baseUrl}/job-rotation-requests/${ID}/` // Use id if updating
      : `${baseUrl}/job-rotation-requests/`; // No id means create new

    const method = ID ? "PATCH" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error saving attendance:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

export const transformJobRotationStatus = (rotation) => {
  const { status: apiStatus, effective_date, rotation_cap_time } = rotation;
  const currentDate = moment();
  const effectiveDate = moment(effective_date);
  const capEndDate = effectiveDate.clone().add(rotation_cap_time, "days");

  // Handle API status mapping
  switch (apiStatus) {
    case "pending":
      return "Pending Approval";

    case "rejected":
      return "Cancelled";

    case "approved":
      // For approved status, we need to check dates to determine actual status

      // If effective date hasn't arrived yet
      if (currentDate.isBefore(effectiveDate)) {
        return "Scheduled";
      }

      // If effective date has passed but within cap time
      if (
        currentDate.isAfter(effectiveDate) &&
        currentDate.isBefore(capEndDate)
      ) {
        return "In Progress";
      }

      // If cap time has expired
      if (currentDate.isAfter(capEndDate)) {
        return "Overdue";
      }

      // Default to scheduled if dates are unclear
      return "Scheduled";

    default:
      return "Pending Approval";
  }
};

export const getJobRotationReasons = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/rotation-reasons?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
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
    console.error("Error fetching job rotation requests:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}

export const saveRotationReasons = async (payload, id) => {
  const ID = id || payload?.id;
  try {
    const finalPayload = payload;

    const url = ID
      ? `${baseUrl}/rotation-reasons/${ID}/` // Use id if updating
      : `${baseUrl}/rotation-reasons/`; // No id means create new

    const method = ID ? "PATCH" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error saving attendance:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

export const addUpdateEmpTransferDetails = async (payload, id = null) => {
  try {
    const finalPayload = mapEmployeeTransferPayloadData(payload);

    const url = id
      ? `${baseUrl}/employeetranfer/${id}` // Use id if updating
      : `${baseUrl}/employeetranfer/`; // No id means create new

    const method = id ? "PUT" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: finalPayload,
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
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

export const getEmployeeTransferList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const ordering = payload?.ordering ?? "-id";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/employeetranfer/?ordering=${ordering}&${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const employeeTransferDataResponse = response.data;
      const employeeTransferData = {
        count: employeeTransferDataResponse.count,
        results: employeeTransferDataResponse.results,
      };
      return employeeTransferData;
    } else return { results: [], count: 0 };
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return { results: [], count: 0 };
};

export const getEmployeeTransferStats = async (payload) => {
  try {
    const response = await getEmployeeTransferList(payload);
    if (response) {
      const ResponseData = response.results;
      const StatData = mapTransferStatsData(ResponseData);
      return StatData;
    } else return {};
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return {};
};

export const getRotationStats = async (payload) => {
  try {
    const response = await getJobRotationRequests(payload);
    if (response) {
      const ResponseData = response.results;
      const StatData = mapRotationStatsData(ResponseData);
      return StatData;
    } else return {};
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return {};
};

export const getEmployeeTransferData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/employeetranfer/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const currentapprover = await getCurrentRequestApprover(Response.hierarchy_request);
      const ResponseData = await mapEmployeeTransferData({
        ...Response,
        ...currentapprover,
      });

      return { ...ResponseData, ...currentapprover };
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return 0;
};
