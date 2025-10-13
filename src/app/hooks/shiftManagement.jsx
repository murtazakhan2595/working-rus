import axios from "axios";
import { HandleLogout, baseUrl, getCurrentRequestApprover, headers } from "./general";
import moment from "moment";
import { getEmployeeInfoData } from "app/hooks/use-store";
import { renderErrorMessages } from "utils/renderErrors";
import {
  mapCustomShiftData,
  mapActiveShiftData,
  mapCustomShiftListData,
  mapActiveShiftListData,
  mapDefaultShiftData,
} from "app/utils/MappingObjects/mapShiftManagementData";
import { mapShiftScheduleData } from "app/utils/MappingObjects/mapShiftManagementData";

const saveShift = async (payload) => {
  try {
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
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
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
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
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
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
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

  let URL = `/shift-schedules?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      // Check if response has results array (paginated) or is single object
      if (response.data.results && Array.isArray(response.data.results)) {
        // Process each result
        const mappedResults = await Promise.all(
          response.data.results.map(async (item) => {
            const mappedItem = await mapShiftScheduleData(item);

            // Get current approver if hierarchy_request exists
            if (mappedItem.hierarchy_request) {
              try {
                const currentapprover = await getCurrentRequestApprover(
                  mappedItem.hierarchy_request
                );

                if (
                  currentapprover &&
                  Object.keys(currentapprover).length > 0
                ) {
                  return { ...mappedItem, ...currentapprover };
                }
              } catch (error) {
                if (error?.response?.status === 401) {
                  HandleLogout(); // Assuming this logs out the user properly
                }
                renderErrorMessages(error?.response?.data);
              }
            }

            return mappedItem;
          })
        );

        return {
          ...response.data,
          results: mappedResults,
        };
      } else {
        // Single object response
        const ResponseData = await mapShiftScheduleData(response.data);

        if (ResponseData.hierarchy_request) {
          try {
            const currentapprover = await getCurrentRequestApprover(
              ResponseData.hierarchy_request
            );

            if (currentapprover && Object.keys(currentapprover).length > 0) {
              return { ...ResponseData, ...currentapprover };
            }
          } catch (error) {
            if (error?.response?.status === 401) {
              HandleLogout(); // Assuming this logs out the user properly
            }
            renderErrorMessages(error?.response?.data);
          }
        }

        return ResponseData;
      }
    }

    return false;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};


export const getCustomShiftByEmployeeID = async (
  employee_id,
  date = new Date()
) => {
  if (!employee_id) return false;
  try {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const response = await getShiftSchedule({
      filterData: {
        employee: employee_id,
        status: "APPROVED",
        end_date_gte: formattedDate,
        start_date_lte: formattedDate,
        is_change_request: "true,false",
      },
      ordering: "-created_at",
    });
    if (response && response?.results?.[0]) {
      const schedule = response?.results?.[0];
      const ResponseData = mapCustomShiftData(schedule, formattedDate);
      return ResponseData;
    }
    return false;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};
export const getCustomShiftListEmployeeID = async (
  employee_id,
  start_date = new Date(),
  end_date = new Date()
) => {
  if (!employee_id) return false;

  try {
    // Format dates consistently
    const formattedStartDate = moment(start_date).format("YYYY-MM-DD");
    const formattedEndDate = moment(end_date).format("YYYY-MM-DD");

    // Fetch all approved schedules that overlap with the date range
    const scheduleResponse = await getShiftSchedule({
      filterData: {
        employee: employee_id,
        status: "APPROVED",
        end_date_gte: formattedStartDate, // Schedule ends on or after start date
        start_date_lte: formattedEndDate, // Schedule starts on or before end date
        is_change_request: "true,false", // Include both regular schedules and change requests
      },
      ordering: "-created_at", // Latest first for overlapping resolution
    });
    const ResponseList = await mapCustomShiftListData(
      scheduleResponse?.results || [],
      formattedStartDate,
      formattedEndDate
    );
    return ResponseList;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

const getShiftChangeRequests = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "-id";
  let URL = `/shift-change-requests?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
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
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
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
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
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
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
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
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

const getShiftSchedulesLogs = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "-id";
  let URL = `/shift-schedules-logs?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
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
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

// get active shift
export const getActiveShiftList = async (
  employee_id,
  start_date = new Date(),
  end_date = new Date(),
  defaultShift
) => {
  try {
    if (!employee_id || !start_date || !end_date) return null;
    const default_shift =
      defaultShift && typeof defaultShift === "object"
        ? defaultShift
        : await getEmployeeInfoData(employee_id, "default_shift");
    const custom_shift_list = await getCustomShiftListEmployeeID(
      employee_id,
      start_date,
      end_date
    );
    // get if employee is on leave
    const leave_details = {};
    // get if it holiday
    const holiday_details = {};
    const active_shift_details = await mapActiveShiftListData(
      start_date,
      end_date,
      default_shift,
      custom_shift_list,
      leave_details,
      holiday_details
    );
    return active_shift_details;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

export async function getActiveShiftData(
  employeeId,
  date = new Date(),
  defaultShift
) {
  try {
    if (!employeeId || !date) return null;
    const default_shift =
      defaultShift && typeof defaultShift === "object"
        ? defaultShift
        : await getEmployeeInfoData(employeeId, "default_shift");
    const custom_shift = await getCustomShiftByEmployeeID(employeeId, date);
    // get if employee is on leave
    const leave_details = {};
    // get if it holiday
    const holiday_details = {};
    const active_shift_details = await mapActiveShiftData(
      date,
      default_shift,
      custom_shift,
      leave_details,
      holiday_details
    );
    return active_shift_details;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
}

export const saveCustomShift = async (
  employee_id,
  date,
  start_time,
  end_time,
  isSecondShift,
  user_id = null
) => {
  try {
    if (!employee_id || !date || !start_time || !end_time || !user_id)
      return false;

    const baseDate = moment(date);
    if (!baseDate.isValid()) return false;

    const formattedDate = moment(date).format("YYYY-MM-DD");

    // Step 1: Find existing approved custom schedule for this specific date
    const overlappingSchedules = await getShiftSchedule({
      filterData: {
        employee: employee_id,
        end_date_gte: formattedDate,
        start_date_lte: formattedDate,
        status: "APPROVED",
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
    let assignedBy = user_id;

    // Step 4: Check if there's an existing custom schedule covering this date
    let existingCustomSchedule = null;
    if (
      overlappingSchedules?.results &&
      overlappingSchedules.results.length > 0
    ) {
      existingCustomSchedule = overlappingSchedules.results.find((schedule) => {
        const scheduleStart = moment(schedule.start_date);
        const scheduleEnd = moment(schedule.end_date);
        return baseDate.isBetween(scheduleStart, scheduleEnd, "day", "[]");
      });
    }

    let payload;

    if (existingCustomSchedule && !existingCustomSchedule.is_org_based) {
      // Case: Update existing custom schedule - only modify the specific day

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
        shift_requested: "HR",
        is_off_day: Object.values(existingCustomScheduleData).some(
          (day) => day.is_off
        ),
        is_change_request: "false",
      };
    } else {
      // Case: Create new single-day custom schedule
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
        shift_requested: "HR",
        is_off_day: false,
        is_change_request: "false",
      };
    }

    // Step 5: Save the schedule
    const response = await saveShiftSchedule(payload);

    if (response) {
      return response;
    } else {
      console.error("Failed to save custom shift");
      return false;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
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
  saveShiftSchedulesLogs,
  getShiftSchedulesLogs,
};
