import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { getCurrentRequestApprover, HandleLogout } from "./general";
import moment from "moment";
import {
  mapLeaveTypeListData,
  mapLeaveTypeData,
  mapPublicHolidayPayloadeData,
  mapPublicHolidayListData,
  mapPublicHolidayData,
  mapLeaveListData,
  mapLeaveStatsData,
  mapLeaveOffsetSettingPayloadeData,
  mapLeaveData,
  mapLeavePayloadData,
  mapOffsetLeaveSettingListData,
  mapOffsetLeaveSettingData,
  mapOffsetLeavesData,
  mapSpecialLeavePayloadData,
  mapSpecialLeavesListData,
  mapEmpSpecialLeaveType,
} from "app/utils/MappingObjects/mapLeaveData";
import { renderErrorMessages } from "utils/renderErrors";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  // Don't explicitly set 'Content-Type' for FormData
});

export const getLeaveStatusDaily = async (payload = {}) => {
  try {
    // Extract and sanitize filter data
    const filterData = payload.filterData || {};
    const departments = filterData.departments ?? "";
    const branchIdsArray = Array.isArray(filterData.branch_ids)
      ? filterData.branch_ids
      : [];

    // Convert branch_ids array [1,2,3] → {1,2,3}
    const branch_ids = branchIdsArray.length
      ? `{${branchIdsArray.join(",")}}`
      : "";

    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (departments) queryParams.append("departments", departments);
    if (branch_ids) queryParams.append("branch_ids", branch_ids);

    const url = `${baseUrl}/leaves_statistics?${queryParams.toString()}`;

    const response = await axios.get(url, {
      headers: headers(),
    });

    if (response.status === 200 && response.data) {
      return response.data;
    }

    return [];
  } catch (error) {
    console.error("Error fetching daily leave status:", error);

    if (error?.response?.status === 401) {
      HandleLogout();
    }

    return [];
  }
};

export const saveLeaveDuration = async (payload) => {
  try {
    if (payload?.id) {
      // If there's an ID, use PATCH to update the existing leave duration
      const response = await axios.patch(
        `${baseUrl}/leave-durations/${payload.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      // If no ID, use POST to create a new leave duration
      const response = await axios.post(
        `${baseUrl}/leave-durations/`,
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
    console.error("Error fetching daily leave status:", error);

    if (error?.response?.status === 401) {
      HandleLogout();
    }

    throw error;
  }
};
export const getLeaveDurations = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/leave-durations?ordering=${sortField}&${
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
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const deleteLeaveDuration = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/leave-durations/${id}`, {
      headers: headers(),
    });
    if (response.status === 204) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting leave duration:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const getLeaveTypeListData = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/leave-types?ordering=${sortField}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseList = await mapLeaveTypeListData(ResponseData.results);
      return { results: ResponseList, count: ResponseData.count };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

export const getLeaveTypeData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/leave-types/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = await mapLeaveTypeData(response.data.data);
      return ResponseData;
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};
export const getOffsetLeaveInfo = async (employee_id) => {
  let URL = employee_id
    ? `/employee-leaves/eligible_leave_types/`
    : `/offset-leaves/my-offset-leaves/`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const offsetLeaveData = await mapOffsetLeavesData(ResponseData);
      return offsetLeaveData;
    }
    return [];
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};
export const getEligibleLeaveTypeDurations = async (
  isType = true,
  employee_id
) => {
  let URL = isType
    ? `/employee-leaves/eligible_leave_types/`
    : `/employee-leaves/eligible_leave_durations/`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      const ResponseData = response.data;
      // const ResponseList = await mapLeaveTypeListData(ResponseData);
      const ResponseList = ResponseData.data;
      if (
        !ResponseList ||
        !Array.isArray(ResponseList) ||
        ResponseList.length === 0
      )
        return [];
      const offsetLeave = await getOffsetLeaveInfo();
      const sepcialLeave = await getEmpSpecialLeave(employee_id);
      const OffsetLeaveType = ResponseList.find(
        (obj) => obj.name === "Offset Leaves"
      );
      const SepcialLeaveType = ResponseList.find(
        (obj) => obj.name === "Special Leave"
      );
      const OtherLeaveType = ResponseList.filter(
        (obj) => obj.name !== "Offset Leaves" && obj.name !== "Special Leave"
      );
      const FinalResponsList = [
        ...OtherLeaveType,
        { ...OffsetLeaveType, ...offsetLeave },
        { ...SepcialLeaveType, ...sepcialLeave },
      ];
      return FinalResponsList;
    }
    return [];
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const getEligibleLeaveTypeByEmployeeId = async (
  employee_id,
  leave_type,
  isType = true
) => {
  let URL = isType
    ? `/employee-leaves/employee-eligible-leave-types/${employee_id}/`
    : `/employee-leaves/eligible_leave_durations/`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseList = ResponseData.data;
      if (leave_type) {
        const eligibleLeaveType = ResponseList.find(
          (leaveType) => parseInt(leaveType.id) === parseInt(leave_type)
        );
        if (eligibleLeaveType) return eligibleLeaveType;
        else return {};
      }
      return ResponseList;
    }
    return [];
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const getLeaveStatsData = async (payload) => {
  try {
    const response = await getLeaveListData(payload);
    if (response.results) {
      const ResponseData = response.results || [];
      const ResponseStats = await mapLeaveStatsData(ResponseData);
      return ResponseStats;
    }
    return {};
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};
export const getLeaveListData = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/employee-leaves?ordering=${sortField}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseList = await mapLeaveListData(ResponseData.results);
      return { results: ResponseList, count: ResponseData.count };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

export const getLeaveData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/employee-leaves/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const currentapprover = await getCurrentRequestApprover(
        Response.request_id
      );
      const ResponseData = await mapLeaveData({
        ...Response,
        ...currentapprover,
      });
      const employeeAllotedLeave = await getEligibleLeaveTypeByEmployeeId(
        ResponseData.employee,
        ResponseData.leave_type
      );
      return { ...ResponseData, ...currentapprover, ...employeeAllotedLeave };
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getHolidaysListData = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/holidays?ordering=${sortField}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseList = await mapPublicHolidayListData(ResponseData.results);
      return { results: ResponseList, count: ResponseData.count };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

export const saveUpdateLeave = async (payload, id) => {
  const ID = id || payload?.id;
  try {
    const finalPayload = mapLeavePayloadData(payload);

    const url = ID
      ? `${baseUrl}/employee-leaves/${ID}/` // Use id if updating
      : `${baseUrl}/employee-leaves/`; // No id means create new

    const method = ID ? "PATCH" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: formDataHeader(),
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

export const saveUpdateHoliday = async (payload, id) => {
  const ID = id || payload?.id;
  try {
    const finalPayload = mapPublicHolidayPayloadeData(payload);

    const url = ID
      ? `${baseUrl}/holidays/${ID}/` // Use id if updating
      : `${baseUrl}/holidays/`; // No id means create new

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

export const getHolidayData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/holidays/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = await mapPublicHolidayData(response.data);
      return ResponseData;
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const cancelEmployeeLeave = async (id) => {
  try {
    const url = `${baseUrl}/employee-leaves/${id}/cancel_leave/`;

    const method = "PATCH"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      headers: headers(),
      data: { is_cancelled: true },
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
export const saveLeaveType = async (payload) => {
  try {
    if (payload?.id) {
      // If there's an ID, use PATCH to update the existing leave type
      const response = await axios.patch(
        `${baseUrl}/leave-types/${payload.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      // If no ID, use POST to create a new leave type
      const response = await axios.post(`${baseUrl}/leave-types/`, payload, {
        headers: headers(),
      });
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error saving leave type:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    throw error;
  }
};

export const getLeaveTypes = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/leave-types?ordering=${sortField}&${
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
    console.error("Error fetching leave types:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const deleteLeaveType = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/leave-types/${id}`, {
      headers: headers(),
    });
    if (response.status === 204) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting leave type:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const uploadHolidaysData = async (formData) => {
  try {
    const response = await axios.post(
      `${baseUrl}/holidays/bulk-import/`,
      formData,
      {
        headers: {
          ...headers(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const ResponseData = response.data;
    return ResponseData;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error uploading employees data:", error);
    return error?.response?.data;
  }
};

export const saveUpdateOffsetSettings = async (payload, id) => {
  const ID = id || payload?.id;
  try {
    const finalPayload = mapLeaveOffsetSettingPayloadeData(payload);

    const url = ID
      ? `${baseUrl}/leave-offset-settings/${ID}/` // Use id if updating
      : `${baseUrl}/leave-offset-settings/`; // No id means create new

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
export const getLeaveOffsetSettingListData = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/leave-offset-settings?ordering=${sortField}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseList = await mapOffsetLeaveSettingListData(
        ResponseData.results
      );
      return { results: ResponseList, count: ResponseData.count };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};
export const getLeaveOffsetSettingData = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl}/leave-offset-settings/${id}/`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      const ResponseData = await mapOffsetLeaveSettingData(response.data);
      return ResponseData;
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const saveLeaveOpeningBalance = async (payload) => {
  try {
    // If there's an ID, use PATCH to update the existing leave opening balance
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/leave-openingbalance/${payload.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      // If no ID, use POST to create a new leave opening balance
      const response = await axios.post(
        `${baseUrl}/leave-openingbalance/`,
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
    console.error("Error saving leave opening balance:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const getLeaveOpeningBalance = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/leave-openingbalance?ordering=${sortField}&${
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
    console.error("Error fetching leave opening balance:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const getOpeningBalanceSummary = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  // const sortField = payload?.ordering || "serial_number";
  let URL = `/leave-balance/all-summary/?${
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
    console.error("Error fetching opening balance summary:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const getOpeningBalanceSummaryByEmpSerialNumber = async (
  serialNumber
) => {
  try {
    const response = await axios.get(
      `${baseUrl}/leave-balance/summary/${serialNumber}`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error(
      "Error fetching opening balance summary by employee serial number:",
      error
    );
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getLeaveOpeningBalanceById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/leave-openingbalance/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting leave opening balance by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getLeaveOpeningBalanceSummary = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl}/leave-balance/summary/${id}/`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting leave opening balance summary by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getLeaveOpeningBalanceTemplate = async () => {
  try {
    const response = await axios.get(`${baseUrl}/leave-balance/template/`, {
      headers: headers(),
      responseType: "blob", // This is crucial for binary files
    });
    if (response.status === 200) {
      return response.data; // This will be a Blob object
    }
  } catch (error) {
    console.error("Error getting leave opening balance template:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
  }
};

export const uploadLeaveOpeningBalance = async (formData) => {
  try {
    const response = await axios.post(
      `${baseUrl}/leave-balance/bulk-import/`,
      formData,
      {
        headers: {
          ...headers(),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error uploading employees data:", error);
    return error?.response?.data;
  }
};

export const saveSpecialLeave = async (payload, id) => {
  const ID = id || payload?.id;
  try {
    const finalPayload = mapSpecialLeavePayloadData(payload);

    const url = ID
      ? `${baseUrl}/special-leaves/${ID}/` // Use id if updating
      : `${baseUrl}/special-leaves/`; // No id means create new

    const method = ID ? "PATCH" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: formDataHeader(),
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

export const getSpecialLeave = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/special-leaves?ordering=${sortField}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseList = await mapSpecialLeavesListData(ResponseData.results);
      return { results: ResponseList, count: ResponseData.count };
    }
    return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

export const getEmpSpecialLeave = async (employee_id) => {
  const filterData = { employee: employee_id };
  try {
    const response = await getSpecialLeave({ filterData });
    if (response) {
      const ResponseData = mapEmpSpecialLeaveType(response.results);
      return ResponseData;
    }
    return {};
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};
