import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { HandleLogout } from "./general";
import moment from "moment";
import { CalculateTotalWorkingHours } from "utils/renderValues";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  startOfWeek,
  parseISO,
  isWithinInterval,
  format,
} from "date-fns";
import { getEmployeeAttendanceDetails } from "app/hooks/attendance";

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
        `${baseUrl}/shift/${payload.id}`,
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

const deleteShiftSchedule = async (scheduleId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/shift-schedules/${scheduleId}/`,
      {
        headers: headers(),
      }
    );
    if (response.status === 204 || response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting shift schedule:", error);
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
  if (!filterData?.draft) {
    filterData.draft = false;
  }
  let URL = `/shift-schedules?ordering=${sortField}&${
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

const saveShiftSchedulesLogs = async (payload) => {
  try {
    const response = await axios.post(
      `${baseUrl}/shift-schedules-logs/`,
      payload,
      {
        headers: headers(),
      }
    );
    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error saving shift schedules logs:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getShiftSchedulesLogs = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "-id";
  let URL = `/shift-schedules-logs?ordering=${sortField}&${
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
    console.error("Error fetching shift schedules logs:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

// get active shift
export const getActiveShiftList = async (
  employee_id,
  start_date = new Date(),
  end_date
) => {
  if (!employee_id || !start_date) return [];
  try {
    const ShiftStartDate = moment(start_date);
    const ShiftEndDate =
      end_date && moment(end_date).isValid ? moment(end_date) : ShiftStartDate;
    if (!moment(ShiftStartDate).isValid || !moment(ShiftEndDate).isValid)
      return [];
    const { default_shift } = await getEmployeeAttendanceDetails(employee_id);
    const datesOfMonth = eachDayOfInterval({
      start: moment(start_date),
      end: moment(end_date),
    });
    // 1. Fetch approved custom schedule
    const scheduleResponse = await getShiftSchedule({
      filterData: {
        employee: employee_id,
        status: "Approved",
        end_date_gte: ShiftStartDate,
        start_date_lte: ShiftEndDate,
        is_change_request: "true,false",
      },
      ordering: "-created_at",
    });

    const shiftPromises = datesOfMonth.map(async (date) => {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      try {
        const schedule = scheduleResponse?.results?.[0];
        const customSchedule = schedule?.custom_schedule?.[formattedDate];
        const res = await getActiveShiftsData(employee_id, default_shift, date);
        if (!res) return null;
        return res;
      } catch (err) {
        console.error(`Error fetching shift for ${formattedDate}:`, err);
        return null;
      }
    });

    const shifts = await Promise.all(shiftPromises);
    const ShiftList = shifts.filter(Boolean);
    return ShiftList;
  } catch (error) {
    console.error("Error fetching monthly shift data:", error);
    return [];
  }
};

export async function getActiveShiftsData(
  employeeId,
  date = new Date(),
  defaultShift,
  customSchedule
) {
  try {
    console.log();
    if (!employeeId || !date) return null;
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const isWeekend = moment(date).day() === 0 || moment(date).day() === 6;
    const isDefaultShiftValid =
      defaultShift &&
      typeof defaultShift === "object" &&
      defaultShift.start_time &&
      defaultShift.end_time;

    const active_shift = {
      date: formattedDate,
      is_split_shift: false,
      total_hours: 0,
      shifts: [],
      shift_assigned: true,
      status: false,
      is_weekly_off: false,
      isOffToday: false,
    };

    if (customSchedule) {
      if (customSchedule.is_off) {
        return {
          ...active_shift,
          isOffToday: true,
          is_weekly_off: true,
          OffLabel: "Weekly Off",
        };
      }

      active_shift.status = true;
      active_shift.isOffToday = false;

      if (customSchedule.is_split) {
        if (
          customSchedule.start_time_1 &&
          customSchedule.end_time_1 &&
          customSchedule.start_time_2 &&
          customSchedule.end_time_2
        ) {
          const first_start_time = `${formattedDate}T${customSchedule.start_time_1}`;
          const first_end_time = `${formattedDate}T${customSchedule.end_time_1}`;
          const second_start_time = `${formattedDate}T${customSchedule.start_time_2}`;
          const second_end_time = `${formattedDate}T${customSchedule.end_time_2}`;

          active_shift.is_split_shift = true;
          active_shift.shifts = [
            {
              start_time: format(new Date(first_start_time), "hh:mm a"),
              end_time: format(new Date(first_end_time), "hh:mm a"),
            },
            {
              start_time: format(new Date(second_start_time), "hh:mm a"),
              end_time: format(new Date(second_end_time), "hh:mm a"),
            },
          ];
          active_shift.total_hours =
            CalculateTotalWorkingHours(first_start_time, first_end_time) +
            CalculateTotalWorkingHours(second_start_time, second_end_time);
        }
        return active_shift;
      }

      // Regular shift fallback
      const start_time = customSchedule.start_time;
      const end_time = customSchedule.end_time;

      if (start_time && end_time) {
        const start_time = `${formattedDate}T${customSchedule.start_time}`;
        const end_time = `${formattedDate}T${customSchedule.end_time}`;
        active_shift.shifts = [
          {
            start_time: format(new Date(start_time), "hh:mm a"),
            end_time: format(new Date(end_time), "hh:mm a"),
          },
        ];
        active_shift.total_hours = CalculateTotalWorkingHours(
          start_time,
          end_time
        );
      }
      return active_shift;
    }

    // 2. Fallback to default shift
    if (!isDefaultShiftValid) {
      return {
        ...active_shift,
        status: false,
        shift_assigned: false,
        isOffToday: true,
        OffLabel: "No Shift Assigned",
      };
    }

    const weekend_shift = defaultShift?.type === "Weekend";
    const default_start = defaultShift.start_time;
    const default_end = defaultShift.end_time;

    if ((weekend_shift && isWeekend) || (!weekend_shift && !isWeekend)) {
      if (default_start && default_end) {
        active_shift.status = true;
        active_shift.shifts = [
          {
            start_time: format(new Date(default_start), "hh:mm a"),
            end_time: format(new Date(default_end), "hh:mm a"),
          },
        ];
        active_shift.total_hours = CalculateTotalWorkingHours(
          default_start,
          default_end
        );
        active_shift.isOffToday = false;
      }
    } else {
      active_shift.status = false;
      active_shift.isOffToday = true;
      active_shift.OffLabel = "Weekly Off";
      active_shift.is_weekly_off = true;
    }

    return active_shift;
  } catch (error) {
    console.error("Error in getEmployeeActiveShift:", error);
    return null;
  }
}

export const saveCustomShift = async (
  employee_id,
  date,
  start_time,
  end_time,
  isSecondShift,
  user_id= null
) => {
  try {
    if (!employee_id || !date || !start_time || !end_time || !user_id) return false;
    
    const baseDate = moment(date);
    if (!baseDate.isValid()) return false;
    
    const formattedDate = moment(date).format("YYYY-MM-DD");

    // Step 1: Find existing approved custom schedule for this specific date
    const overlappingSchedules = await getShiftSchedule({
      filterData: {
        employee: employee_id,
        end_date_gte: formattedDate,
        start_date_lte: formattedDate,
        status: "Approved",
        is_change_request: "true,false",
      },
      ordering: "-created_at",
    });

    // Step 2: Format times to HH:mm
    const formatTimeForBackend = (timeStr) => {
      if (!timeStr) return null;
      return moment(timeStr).format("HH:mm");
    };

    const formattedStartTime = formatTimeForBackend(start_time);
    const formattedEndTime = formatTimeForBackend(end_time);

    if (!formattedStartTime || !formattedEndTime) {
      console.error("Invalid time format provided");
      return false;
    }

    // Step 3: Get user information for assigned_by
    let assignedBy = user_id 

    // Step 4: Check if there's an existing custom schedule covering this date
    let existingCustomSchedule = null;
    if (overlappingSchedules?.results && overlappingSchedules.results.length > 0) {
      existingCustomSchedule = overlappingSchedules.results.find(schedule => {
        const scheduleStart = moment(schedule.start_date);
        const scheduleEnd = moment(schedule.end_date);
        return baseDate.isBetween(scheduleStart, scheduleEnd, 'day', '[]');
      });
    }

    let payload;

    if (existingCustomSchedule && !existingCustomSchedule.is_org_based) {
      // Case: Update existing custom schedule - only modify the specific day
      console.log("Updating existing custom schedule for date:", formattedDate);

      const existingCustomScheduleData = {
        ...existingCustomSchedule.custom_schedule,
      };

      // Get current day's schedule or create new one
      let daySchedule = existingCustomScheduleData[formattedDate] || {
        is_off: false,
        is_split: false,
      };

      // Update based on isSecondShift parameter
      if (isSecondShift) {
        // Update second shift in split shift
        daySchedule.is_split = true;
        daySchedule.start_time_2 = formattedStartTime;
        daySchedule.end_time_2 = formattedEndTime;
      } else {
        // Check if this should be first shift of split or regular shift
        if (daySchedule.start_time_2 && daySchedule.end_time_2) {
          // There's already a second shift, so this is first shift of split
          daySchedule.is_split = true;
          daySchedule.start_time_1 = formattedStartTime;
          daySchedule.end_time_1 = formattedEndTime;
        } else {
          // Regular shift
          daySchedule.is_split = false;
          daySchedule.start_time = formattedStartTime;
          daySchedule.end_time = formattedEndTime;
        }
      }

      daySchedule.is_off = false;

      // Update only this specific day in the custom schedule
      existingCustomScheduleData[formattedDate] = daySchedule;

      payload = {
        id: existingCustomSchedule.id,
        employee: employee_id,
        shift: null,
        schedule_name: existingCustomSchedule.schedule_name,
        start_date: existingCustomSchedule.start_date,
        end_date: existingCustomSchedule.end_date,
        is_org_based: false,
        custom_schedule: existingCustomScheduleData,
        total_weekly_hours: existingCustomSchedule.total_weekly_hours, // Keep existing
        assigned_by: assignedBy,
        approved_by: assignedBy,
        status: "Approved",
        shift_requested: "Employee",
        is_off_day: Object.values(existingCustomScheduleData).some(
          (day) => day.is_off
        ),
        is_change_request: "false",
      };
    } else {
      // Case: Create new single-day custom schedule
      console.log(
        "Creating new single-day custom schedule for date:",
        formattedDate
      );

      const daySchedule = {
        is_off: false,
        is_split: false,
      };

      if (isSecondShift) {
        // Create split shift with second shift
        daySchedule.is_split = true;
        daySchedule.start_time_2 = formattedStartTime;
        daySchedule.end_time_2 = formattedEndTime;
      } else {
        // Create regular shift
        daySchedule.start_time = formattedStartTime;
        daySchedule.end_time = formattedEndTime;
      }

      const customSchedule = {
        [formattedDate]: daySchedule,
      };

      payload = {
        employee: employee_id,
        shift: null,
        schedule_name: `Custom Schedule - ${moment(formattedDate).format(
          "MMM DD, YYYY"
        )}`,
        start_date: formattedDate,
        end_date: formattedDate,
        is_org_based: false,
        custom_schedule: customSchedule,
        assigned_by: assignedBy,
        approved_by: assignedBy,
        status: "Approved",
        shift_requested: "Employee",
        is_off_day: false,
        is_change_request: "false",
      };
    }

    console.log("saveCustomShift payload:", payload);

    // Step 5: Save the schedule
    const response = await saveShiftSchedule(payload);
    
    if (response) {
      console.log("Custom shift saved successfully");
      return response;
    } else {
      console.error("Failed to save custom shift");
      return false;
    }

  } catch (error) {
    console.error("Error in saveCustomShift:", error);
    return false;
  }
};

export {
  saveShift,
  saveShiftSchedule,
  deleteShiftSchedule,
  getShiftSchedule,
  getShiftChangeRequests,
  getShiftChangeRequestById,
  getEmployeeShiftCalendar,
  getEmployeeEffectiveShift,
  saveShiftSchedulesLogs,
  getShiftSchedulesLogs,
};
