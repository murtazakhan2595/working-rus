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
      handleLogout();
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
      handleLogout();
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
        return sumLeaveStats(response.data);
      }
    }
  } catch (error) {
    console.error("Error fetching leave stats:", error);
    if (error?.response?.status === 401) {
      handleLogout();
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
      handleLogout();
    }
    return [];
  }
};
const saveAttachment = async (payload) => {
  try {
    const response = await axios.post(`${baseUrl}/attachment/`, payload, {
      headers: headers(),
    });
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error saving attachment:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
};

const getAttachmentById = async (attachmentId) => {
  try {
    if (attachmentId) {
      const response = await axios.get(
        `${baseUrl}/attachment/${attachmentId}`,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        console.log("get attachment by id", response.data);
        return response.data;
      } else {
        return {};
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error getting attachment:", error);
    return {};
  }
};

const getLeaveComponentsWithUsed = async (employeeId) => {
  try {
    // Fetch the leave components (leave types)
    const leaveComponentsResponse = await axios.get(
      `${baseUrl}/leavecomponents`,
      {
        params: {
          employee_id_and_org: `${employeeId},${true}`,
        },
        headers: headers(),
      }
    );
    const leaveComponents = leaveComponentsResponse.data;

    // Process the leave components to calculate used leaves
    const leaveDataWithUsed = await Promise.all(
      leaveComponents.map(async (leaveType) => {
        const { id: leaveComponentId, max_days, name } = leaveType;

        // Fetch the latest transaction for the current leave type
        const transactionResponse = await axios.get(
          `${baseUrl}/employeeleavetransaction`,
          {
            params: {
              leave_component_id: leaveComponentId,
              employee_id: employeeId,
              sort: "created_at",
              ordering: "created_at",
              limit: 1,
            },
            headers: headers(),
          }
        );

        const transactions = transactionResponse.data;
        const latestTransaction = transactions[0]; // Get the latest transaction

        // Calculate the used leaves (max_days - balance_after)
        const used = latestTransaction
          ? max_days - latestTransaction.balance_after
          : 0;

        return {
          name,
          used,
          total: max_days,
        };
      })
    );

    return leaveDataWithUsed;
  } catch (error) {
    console.error("Error fetching leave components with used leaves:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
};

const getLeaveStatsEmployee = async () => {
  let URL = `/api/leaves/stats/`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      // Convert and flatten the object
      const flattenedData = Object.values(response.data).map((employee) => ({
        ...employee,
        ...employee.leave_stats, // Spread leave_stats properties
      }));

      // Optionally delete leave_stats if you don't want to keep it
      flattenedData.forEach((employee) => {
        delete employee.leave_stats;
      });
      return flattenedData;
    }
  } catch (error) {
    console.error("Error fetching leave stats:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
};
export {
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
};
