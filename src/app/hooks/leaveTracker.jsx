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
  mapLeaveOffsetSettingPayloadeData,
  mapLeaveData,
  mapLeavePayloadData,
  mapOffsetLeaveSettingListData,
  mapOffsetLeaveSettingData,
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
      HandleLogout();
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
      HandleLogout();
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
      HandleLogout();
    }
    return false;
  }
};

const saveLeaveTransaction = async (payload) => {
  try {
    if (payload?.id) {
      // If there's an ID, use PATCH to update the existing leave transaction
      const response = await axios.patch(
        `${baseUrl}/employeeleavetransaction/${payload.id}`,
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
        `${baseUrl}/employeeleavetransaction/`,
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
      HandleLogout();
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
      const response = await axios.post(`${baseUrl}/leave/`, payload, {
        headers: headers(),
      });
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error saving leave:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getLeaves = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/leave?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
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
    console.error("Error fetching leave data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const getLeavestats = async (payload) => {
  const employee_id = payload?.filterData?.employee_id ?? "";
  let URL = `/api/leaves/stats/${
    employee_id ? `?employee_id=${encodeURIComponent(employee_id)}` : ""
  }`;
  console.log(`URL is :${baseUrl}${URL}`);
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      if (employee_id) {
        return response.data;
      } else {
        const sumLeaveStats = (data) => {
          return Object.values(data).reduce(
            (acc, { leave_stats }) => {
              acc.total_applications += leave_stats.total_applications;
              acc.pending_applications += leave_stats.pending_applications;
              acc.accepted_applications += leave_stats.accepted_applications;
              acc.declined_applications += leave_stats.declined_applications;
              return acc;
            },
            {
              total_applications: 0,
              pending_applications: 0,
              accepted_applications: 0,
              declined_applications: 0,
            }
          );
        };

        console.log("INFO-", sumLeaveStats(response.data));
        return sumLeaveStats(response.data);
      }
    }
  } catch (error) {
    console.error("Error fetching leave stats:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};
const getLeaveTransaction = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/employeeleavetransaction?ordering=-id&${
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
    console.error("Error fetching leave transaction data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};
const saveAttachment = async (payload) => {
  try {
    const response = await axios.post(`${baseUrl}/leaveattachments`, payload, {
      headers: formDataHeader(),
    });
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error saving attachment:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getAttachmentById = async (attachmentId) => {
  try {
    if (attachmentId) {
      const response = await axios.get(
        `${baseUrl}/leaveattachments/${attachmentId}`,
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

const getLeaveComponentsWithUsed = async (employeeId) => {
  try {
    // Fetch the leave components (leave types)
    const leaveComponentsResponse = await axios.get(
      `${baseUrl}/leavecomponents/?search=${encodeURIComponent(
        JSON.stringify({
          employee_id_and_org: `${employeeId},true`,
          status: true,
        })
      )}&ordering=-id`,
      {
        headers: headers(),
      }
    );
    const leaveComponents = leaveComponentsResponse.data?.results;
    // Process the leave components to calculate used leaves
    const leaveDataWithUsed = await Promise.all(
      leaveComponents.map(async (leaveType) => {
        const { id: leaveComponentId, max_days, name } = leaveType;

        // Fetch the latest transaction for the current leave type
        const transactionResponse = await axios.get(
          `${baseUrl}/employeeleavetransaction/?search=${encodeURIComponent(
            JSON.stringify({
              leave_component_id: leaveComponentId,
              employee_id: employeeId,
            })
          )}&ordering=-created_at&page=1&page_size=1`,
          {
            headers: headers(),
          }
        );

        const latestTransaction = transactionResponse.data?.results[0];
        // console.log("latestTransaction", latestTransaction, max_days);
        // Calculate the used leaves (max_days - balance_after)
        const used =
          latestTransaction && latestTransaction?.balance_after !== null
            ? max_days - latestTransaction.balance_after
            : 0;

        return {
          name,
          used,
          total: max_days,
          leaveComponentId,
        };
      })
    );
    return leaveDataWithUsed;
  } catch (error) {
    console.error("Error fetching leave components with used leaves:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const getLeaveStatsEmployee = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};

  let URL = `/api/leaves/stats?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    console.log("response", response);

    if (response.status === 200) {
      const flattenedData = await Promise.all(
        Object.values(response.data).map(async (employee) => {
          const leaveComponentsResponse = await axios.get(
            `${baseUrl}/leavecomponents/?search=${encodeURIComponent(
              JSON.stringify({
                employee_id_and_org: `${employee.employee_id},true`,
              })
            )}&ordering=-id`,
            {
              headers: headers(),
            }
          );

          const leaveComponents = leaveComponentsResponse.data;
          console.log("leaveComponents", leaveComponents);

          // Process the leave components to calculate used leaves
          const leaveDataWithUsed = await Promise.all(
            leaveComponents.map(async (leaveType) => {
              const { id: leaveComponentId, max_days } = leaveType;

              // Fetch the latest transaction for the current leave type
              const transactionResponse = await axios.get(
                `${baseUrl}/employeeleavetransaction/?search=${encodeURIComponent(
                  JSON.stringify({
                    leave_component_id: leaveComponentId,
                    employee_id: employee.employee_id,
                  })
                )}&ordering=-created_at&page=1&page_size=1`,
                {
                  headers: headers(),
                }
              );

              const latestTransaction = transactionResponse.data?.results[0];
              if (!latestTransaction) {
                return 0;
              }

              // Calculate the used leaves based on whether the latestTransaction exists and balance_after is not null
              const used =
                latestTransaction && latestTransaction?.balance_after !== null
                  ? max_days - latestTransaction.balance_after || 0 // If balance_after is undefined, used will be 0
                  : 0; // If latestTransaction is undefined, used will be 0

              return used;
            })
          );

          // Sum the used leaves
          const total_used_leaves = leaveDataWithUsed.reduce(
            (sum, used) => sum + used,
            0
          );

          // Total leaves allotted based on leave components
          const total_leaves_alloted = leaveComponents.reduce(
            (sum, component) => sum + component.max_days,
            0
          );

          // Calculate remaining leaves
          const remaining_leaves = total_leaves_alloted - total_used_leaves;
          return {
            ...employee,
            total_leaves_alloted,
            used_leaves: total_used_leaves,
            remaining_leaves,
          };
        })
      );
      console.log("PROBLEM RETURN", flattenedData);
      return flattenedData;
    }
  } catch (error) {
    console.error("Error fetching leave stats:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getRemainingLeaves = async (leaveTypeId, employeeId) => {
  try {
    const transactionResponse = await axios.get(
      `${baseUrl}/employeeleavetransaction/?search=${encodeURIComponent(
        JSON.stringify({
          leave_component_id: leaveTypeId,
          employee_id: employeeId,
        })
      )}&ordering=-created_at&page=1&page_size=1`,
      {
        headers: headers(),
      }
    );
    const latestTransaction = transactionResponse.data?.results[0];
    console.log("latestTransaction", latestTransaction);
    if (latestTransaction) {
      return latestTransaction.balance_after;
    } else if (latestTransaction === undefined) {
      return -1;
    }
  } catch (error) {
    console.error("Error fetching remaining leaves:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};
const getLeavestatesCustomApi = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/leavestatesCustomApi?ordering=-id&${
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
      HandleLogout();
    }
    return [];
  }
};

const getLeaveStatusDaily = async (payload = {}) => {
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

const saveLeaveDuration = async (payload) => {
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
const getLeaveDurations = async (payload) => {
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

const deleteLeaveDuration = async (id) => {
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
export const getEligibleLeaveTypeDurations = async (isType = true) => {
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
      const ResponseData = await mapLeaveData(response.data);
      const currentapprover = await getCurrentRequestApprover(
        ResponseData.request_id
      );
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
const saveLeaveType = async (payload) => {
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

const getLeaveTypes = async (payload) => {
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

const deleteLeaveType = async (id) => {
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
    const ResponseData=response.data;
    return ResponseData
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

export {
  deleteLeaveType,
  getLeaveTypes,
  saveLeaveType,
  deleteLeaveDuration,
  saveLeaveDuration,
  saveLeaveComponents,
  getLeaveComponents,
  deleteLeaveComponent,
  saveLeaveTransaction,
  getLeaveTransaction,
  saveLeave,
  getLeaves,
  getLeavestats,
  saveAttachment,
  getAttachmentById,
  getLeaveComponentsWithUsed,
  getLeaveStatsEmployee,
  getRemainingLeaves,
  getLeavestatesCustomApi,
  getLeaveStatusDaily,
  getLeaveDurations,
};
