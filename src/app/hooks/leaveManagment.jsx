import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import { handleLogout } from "./general";
import { EmployeeLeaveTypesList } from "app/utils/Types/LeaveManagment";
import { getEmployeeLeavesTypesList } from "utils/Lists";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getLeaveApplications = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/leave/?order=-date&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const data = response.data;
      const LeaveData = {
        count: data.count,
        results: data.results.leaves,
        approved_leaves: data.results.approved_leaves,
        pending_leaves: data.results.pending_leaves,
        rejected_leaves: data.results.rejected_leaves,
        requested_leaves: data.results.total_count,
      };
      // const updatedData = await Promise.all(
      //   data.map(async (leave) => {
      //     const leaveTypeList = await getEmployeeLeaveTypes({
      //       employee_id: leave.employee_id,
      //     });
      //     const leaveType = leaveTypeList.find(
      //       (obj) => obj.id === leave.leave_type
      //     );
      //     return {
      //       ...leave,
      //       employee_leave_type: leaveType?.leave_type ?? "",
      //     };
      //   })
      // );
      return LeaveData;
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};


const getEmployeeLeaveTypes = async (filterData = {}) => {
  try {
    const response = await axios.get(
      `${baseUrl}/employeeleavetypes?search=${encodeURIComponent(
        JSON.stringify(filterData)
      )}`,
      { headers: headers() }
    );

    if (response.status === 200) {
      const { count, results = [] } = response.data; // Destructure and provide default value

      // Calculating sums in one pass
      const { allotedLeaves, remainingLeaves, usedLeaves } = results.reduce(
        (emp, leave) => {
          emp.allotedLeaves += leave.total_alloted_leaves || 0;
          emp.remainingLeaves += leave.left_leave || 0;
          emp.usedLeaves += leave.used_leave || 0;
          return emp;
        },
        { allotedLeaves: 0, remainingLeaves: 0, usedLeaves: 0 }
      );

      return {
        count,
        results,
        leaveTypes: count,
        allotedLeaves,
        remainingLeaves,
        usedLeaves,
      };
    } else {
      return EmployeeLeaveTypesList;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching Employee Leave Types data:", error);
    return EmployeeLeaveTypesList;
  }
};

const addLeaveRequest = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/leave/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      return response;
    } else {
      const response = await axios.post(`${baseUrl}/leave/`, payload, {
        headers: headers(),
      });
      return response;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding job:", error);
    return false;
  }
};


const deleteLeaveRequest = async (payload) => {
  try {
    if (payload) {
      const response = await axios.delete(`${baseUrl}/leave/${payload}`, {
        headers: headers(),
      });
      return response;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding job:", error);
    return false;
  }
};

const allotLeavesToEmployee = async (employeeId, payload) => {
  if (payload && payload.length > 0) {
    try {
      payload.map(async (leaveType, index) => {
        leaveType.employee_id = employeeId;
        if (leaveType?.id) {
          await axios.patch(
            `${baseUrl}/employeeleavetypes/${leaveType.id}`,
            leaveType,
            {
              headers: headers(),
            }
          );
        } else {
          await axios.post(`${baseUrl}/employeeleavetypes/`, leaveType, {
            headers: headers(),
          });
        }
      });
      
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching Personal Info data :", error);
      return false;
    }
  }
  return true;
};

const getLeaveTypes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/leavecomponents/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const leaveTypeResponse = response.data;
      const leaveTypesList = leaveTypeResponse.map((type) => ({
        value: type.id,
        label: type.name,
      }));
      return leaveTypesList;
    } else return [];
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching leave types data :", error);
  }
  return [];
};

const updateLeaveStatus = async (payload, loggedInUser) => {
  try {
    if (payload?.id) {
      let URL = loggedInUser.role === 2? `${baseUrl}/leaveManager/${payload.id}`:  `${baseUrl}/leaveHr/${payload.id}`;
      const response = await axios.patch(
       URL,
        payload,
        {
          headers: headers(),
        }
      );
      return response;
    } 
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error updating leave status by HR:", error);
    return false;
  }
};

const filterByYearAndLeaveType = (data, year, leaveComponentName) => {
  const startDate = year ? new Date(`${year}-01-01`) : null;
  const endDate = year ? new Date(`${year}-12-31`) : null;

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const isWithinYear = !year || (date >= startDate && date <= endDate);
    const isMatchingLeaveType =
      !leaveComponentName || item.leave_component_name === leaveComponentName;

    return isWithinYear && isMatchingLeaveType;
  });
    const counts = {
      approved: 0,
      pending: 0,
      denied: 0,
      requested: filteredData.length,
    };

    filteredData.forEach((item) => {
      if (item.status_hr === "Approved by HR") {
        counts.approved += 1;
      } else if (item.status_hr === "Pending") {
        counts.pending += 1;
      } else if (item.status_hr === "Declined by HR") {
        counts.denied += 1;
      }
    });

    return counts;
};

const getLeaveTrackerStats = async (filterStats, leaveTypeList) => {
  const { year, employee_id, leave_type } = filterStats;
  const LeaveTypeLabel = leaveTypeList[leave_type-1];

  try {
    const empLeaveTypes = await getEmployeeLeaveTypes({
      employee_id: employee_id,
      year,
      leave_type,
    });
    let leaveApplications = await getLeaveApplications({
      filterData: { employee_id: employee_id },
    });
    const remainingStats = filterByYearAndLeaveType(
      leaveApplications.results,
      year,
      LeaveTypeLabel
    );
    return {
      remainingLeaves: empLeaveTypes.remainingLeaves,
      usedLeaves: empLeaveTypes.usedLeaves,
      allotedLeaves: empLeaveTypes.allotedLeaves,
      ...remainingStats,
    };
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};


const getFilteredLeaveApplication = async (payload) => {
  try {
    const data = await getLeaveApplications({payload});
    if (data) {
          const filterLeaveData = (leaveData) => {
            // Get today's date and next week's date range
            const today = new Date();
            const nextWeekStart = new Date();
            nextWeekStart.setDate(today.getDate() + 7);
            const nextWeekEnd = new Date();
            nextWeekEnd.setDate(today.getDate() + 14);

            // Function to get only the date part (year, month, day)
            const getDateOnly = (date) =>
              new Date(date.getFullYear(), date.getMonth(), date.getDate());

            // Format dates to compare with the 'start_date' field
            const formatDate = (date) =>
              getDateOnly(new Date(date.toISOString().split("T")[0]));

            // Get date only versions for comparison
            const todayDateOnly = getDateOnly(today);
            const nextWeekStartDateOnly = getDateOnly(nextWeekStart);
            const nextWeekEndDateOnly = getDateOnly(nextWeekEnd);

            // Filter records for leave today
            const filteredOnLeaveToday = leaveData.filter((item) => {
              const startDate = formatDate(new Date(item.start_date));
              const isOnLeaveToday =
                startDate.getTime() === todayDateOnly.getTime();
              return isOnLeaveToday;
            });

            // Filter records for leave next week
            const filteredOnLeaveNextWeek = leaveData.filter((item) => {
              const startDate = formatDate(new Date(item.start_date));
              const isOnLeaveNextWeek =
                startDate >= nextWeekStartDateOnly &&
                startDate <= nextWeekEndDateOnly;
              return isOnLeaveNextWeek;
            });
            return {
              onLeaveToday: filteredOnLeaveToday,
              onLeaveNextWeek: filteredOnLeaveNextWeek,
            }
          };
          const result = filterLeaveData(data.results);
          return { ...result, data: data.results, pending_leaves:data.pending_leaves};
    } else {
      return [];
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

export {
  getLeaveApplications,
  addLeaveRequest,
  getLeaveTypes,
  getEmployeeLeaveTypes,
  allotLeavesToEmployee,
  deleteLeaveRequest,
  updateLeaveStatus,
  getLeaveTrackerStats,
  getFilteredLeaveApplication,
};
