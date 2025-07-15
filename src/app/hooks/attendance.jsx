import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { HandleLogout, getCurrentRequestApprover } from "./general";
import {
  mapAttendanceData,
  mapShiftData,
  mapTimeAdjustmentPayloadeData,
  mapEmployeeAttendanceDetail,
  mapAttendanceAdjustmentPayloadData,
  mapAttendanceAdjustmentListData,
  mapTimeAdjustmentData,
  mapAttendanceAdjustmentData,
  mapAttendanceBreakDurationData,
  mapEmpAttendanceOverview,
  mapAttendanceCheckInPayload,
  mapAttendanceCheckOutPayload,
  mapBreakPayloadData,
} from "app/utils/MappingObjects/mapAttendanceData";
import moment from "moment";
import { renderErrorMessages } from "utils/renderErrors";
import { getEmployeeInfoData } from "app/hooks/use-store";

import {
  getActiveShiftList,
  getActiveShiftData,
} from "app/hooks/shiftManagement";
const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const saveShiftAssignment = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/shiftassignment/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      const response = await axios.post(
        `${baseUrl}/shiftassignment/`,
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
    console.error("Error saving shift assignment:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getEmployeeList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};

  let URL = `/customemp?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
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
    console.error("Error fetching employee list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getShift = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  let URL = `/shift?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
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
    console.error("Error fetching shift list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getShiftAssignment = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  let URL = `/shiftassignment?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
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
    console.error("Error fetching shift assignment list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getAttendance = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-date";
  let URL = `/attendance?${ordering ? `ordering=${ordering}&` : ""}${
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
    console.error("Error fetching attendance list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getAttendanceSummary = async (payload) => {
  const ordering = payload?.ordering ?? "-emp_name";
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const dateRange = payload?.dateRange ? payload?.dateRange?.split(",") : [];
  const end_date = dateRange[1] && dateRange[1] !== "null" ? dateRange[1] : "";
  const start_date =
    dateRange[0] && dateRange[0] !== "null" ? dateRange[0] : "";
  let URL = `/attendance/summary/?ordering=${ordering}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}${end_date ? `&end_date=${end_date}` : ""}${
    start_date ? `&start_date=${start_date}` : ""
  }`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching attendance list:", error);

    if (error?.response?.status === 401) {
      HandleLogout();
    }

    return false;
  }
};

export const saveAttendance = async (payload, shift_details, id) => {
  const attendanceId = id || payload?.id;
  try {
    const active_shift =
      shift_details ??
      (await getActiveShiftData(payload.employee_id, payload.date));
    const finalPayload = mapAttendanceData(payload, active_shift);
    const url = attendanceId
      ? `${baseUrl}/attendance/${attendanceId}/` // Use id if updating
      : `${baseUrl}/attendance/`; // No id means create new

    const method = attendanceId ? "PATCH" : "POST"; // Determine method based on existence of id

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

export const getAttendanceData = async (id) => {
  try {
    const url = `${baseUrl}/attendance/${id}/`;

    const method = "GET"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
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
    return false;
  }
};
export const getAttendancebyEmployee = async (employee_id, date) => {
  try {
    if (!employee_id) return null;
    const formattedDate = moment(date);
    const filterData = {
      employee_id: employee_id,
      ...(date && formattedDate && formattedDate.isValid()
        ? { date: formattedDate.format("YYYY-MM-DD") }
        : {}),
    };

    const response = await getAttendance({ filterData, ordering: "-id" });
    if (response.results && response.results.length > 0) {
      const attendanceRecord = response.results[0];
      return attendanceRecord;
    } else return null;
  } catch (error) {
    console.error("Error saving attendance:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return null;
  }
};
const saveBreak = async (payload, id) => {
  try {
    const ID = payload?.id || id;
    const isUpdate = Boolean(ID);
    const url = isUpdate ? `${baseUrl}/breaks/${ID}/` : `${baseUrl}/breaks/`;
    const method = isUpdate ? axios.patch : axios.post;
    const response = await method(url, payload, { headers: headers() });

    if ([200, 201].includes(response.status)) {
      return response.data;
    }
  } catch (error) {
    console.error("Error saving break:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
  }

  return false;
};

const getBreak = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  let URL = `/breaks?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
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
    console.error("Error fetching break list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const calculateBreak = async (payload) => {
  const breaks = await getBreak(payload);
  const breaksResults = breaks.results;
  const breakDuration = mapAttendanceBreakDurationData(breaksResults);
  return breakDuration;
};

const getBreakStatus = async (payload) => {
  const lastBreak = await getBreak(payload);
  if (lastBreak && lastBreak?.results && lastBreak?.results.length > 0) {
    const lastBreakEnd = lastBreak?.results[0]?.endtime;
    if (!lastBreakEnd) {
      return true;
    }
  }
  return false;
};

const endBreak = async (payload, endtime) => {
  const lastBreak = await getBreak(payload);
  const lastBreakId = lastBreak?.results[0]?.id;
  const lastBreakEnd = lastBreak?.results[0]?.endtime;
  if (!lastBreakEnd && lastBreakId) {
    const breakPayload = {
      id: lastBreakId,
      endtime: endtime,
    };

    return await saveBreak(breakPayload);
  }
  return false;
};

const getLocalTime = () => {
  // Step 1: Get the user's time zone
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Step 2: Get the current date and time in the user's local time zone
  const localDate = new Date();

  // Step 3: Convert to local time string based on the user's time zone
  const localDateStr = localDate.toLocaleString("en-US", {
    timeZone: userTimeZone,
  });

  // Step 4: Parse the resulting date and time string into components (Month, Day, Year, Hour, Minute)
  const [month, day, year, hour, minute, second] = localDateStr
    .match(/(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2}):(\d{2})/)
    .slice(1);

  // Step 5: Create a Date object using the extracted parts (adjust for the date format: YYYY-MM-DDTHH:mm:ss)
  const formattedDateString = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}T${hour.padStart(2, "0")}:${minute}:${second}`;

  // Step 6: Return the formatted date string
  return formattedDateString;
};

function convertUTCToLocal(timeString) {
  // Parse the UTC string (timestamp with 'Z')
  const date = new Date(timeString); // Date object will automatically interpret the Z as UTC

  // Convert the date to the local time zone
  const localDateString = date.toLocaleString("en-US", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  // Parse the local date into a standard string format (YYYY-MM-DDTHH:mm:ss)
  const localDate = new Date(localDateString);
  const formattedDate = localDate.toISOString().slice(0, 19); // Format: YYYY-MM-DDTHH:mm:ss

  return formattedDate;
}

const getStats = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/api/employee-hours${id}/`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stats:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const employeeData = async (id) => {
  const employeeResponse = await axios.get(`${baseUrl}/emp/${id}`, {
    headers: headers(),
  });
  const employeeData = employeeResponse.data;
  return employeeData;
};

export const getShiftById = async (id) => {
  if (id) {
    try {
      const shiftResponse = await axios.get(`${baseUrl}/shift/${id}`, {
        headers: headers(),
      });
      const shiftData = mapShiftData(shiftResponse.data);
      return shiftData;
    } catch (error) {
      console.error("Error fetching shift by id:", error);
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      return false;
    }
  } else return {};
};

const getAttendanceStats = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    const ordering = payload?.ordering ?? "";

    const URL = `/attendance/summary/overall?${
      ordering ? `ordering=${ordering}&` : ""
    }${pageNo ? `page=${pageNo}&` : ""}${
      pageSize ? `page_size=${pageSize}&` : ""
    }search=${encodeURIComponent(JSON.stringify(filterData))}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    const attendanceSummary = response.data;
    return attendanceSummary;
  } catch (error) {
    console.error("Error fetching shift by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getDepartmentPercentage = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/attendance/department-percentage`,
      {
        headers: headers(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching shift by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getWeeklySummary = async () => {
  try {
    const response = await axios.get(`${baseUrl}/attendance/weeklysummary`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shift by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const getRecentActivities = async (payload, attendance, userProfile) => {
  let recentActivities = [];
  if (!attendance) return recentActivities;
  recentActivities.push({
    time: moment(attendance.checkin).format("hh:mm A"),
    activity: "Check in",
    description: attendance.additional_info || "Checked In",
    timestamp: moment(attendance.checkin),
  });

  const getBreaks = await getBreak({
    filterData: {
      employee_id: userProfile.id,
      attendance: attendance.id,
    },
  });
  // Process breaks
  if (getBreaks.results && getBreaks.results.length > 0) {
    getBreaks.results.forEach((breakItem) => {
      // Add break start
      recentActivities.push({
        time: moment(breakItem.starttime).format("hh:mm A"),
        activity: `Break Start`,
        description: `${breakItem.break_type} break - Away`,
        timestamp: moment(breakItem.starttime),
      });

      // Add break end
      if (breakItem.endtime) {
        recentActivities.push({
          time: moment(breakItem.endtime).format("hh:mm A"),
          activity: `Break End`,
          description: `${breakItem.break_type} break - Back`,
          timestamp: moment(breakItem.endtime),
        });
      }
    });
  }
  if (attendance.checkout) {
    recentActivities.push({
      time: moment(attendance.checkout).format("hh:mm A"),
      activity: "Check out",
      description: "Checked Out",
      timestamp: moment(attendance.checkout),
    });
  }
  // Sort in reverse chronological order
  recentActivities.sort(
    (a, b) => b.timestamp.valueOf() - a.timestamp.valueOf()
  );

  // Remove timestamp field
  recentActivities = recentActivities.map(({ timestamp, ...rest }) => rest);
  return recentActivities;
};

export const getTimeAdjustmentListData = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "";
  let URL = `/time-adjustments?${ordering ? `ordering=${ordering}&` : ""}${
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
    console.error("Error fetching attendance list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const getTimeAdjustmentData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/time-adjustments/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const currentapprover = await getCurrentRequestApprover(Response.request);
      const ResponseData = await mapTimeAdjustmentData({
        ...Response,
        ...currentapprover,
      });

      return { ...ResponseData, ...currentapprover };
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const saveTimeAdjustment = async (payload, id) => {
  const timeAdjustmentId = id || payload?.id;
  try {
    const finalPayload = mapTimeAdjustmentPayloadeData(payload);

    const url = timeAdjustmentId
      ? `${baseUrl}/time-adjustments/${timeAdjustmentId}/` // Use id if updating
      : `${baseUrl}/time-adjustments/`; // No id means create new

    const method = timeAdjustmentId ? "PATCH" : "POST"; // Determine method based on existence of id

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

export const getEmployeeAttendanceDetails = async (employee_id) => {
  if (employee_id) {
    try {
      const response = await axios.get(
        `${baseUrl}/attendance/employee/${employee_id}/`,
        {
          headers: headers(),
        }
      );

      if (response) {
        const ResponseData = response.data;
        const default_shift = await getEmployeeInfoData(
          employee_id,
          "default_shift"
        );
        const MonthlytShiftData = await getActiveShiftList(
          employee_id,
          moment().startOf("month"),
          moment().endOf("month"),
          default_shift
        );
        const WeeklyShiftData = await getActiveShiftList(
          employee_id,
          moment().startOf("week"),
          moment().endOf("week"),
          default_shift
        );
        const emp_attendance_data = await mapEmployeeAttendanceDetail({
          ...ResponseData,
          default_shift: default_shift,
          monthly_shifts: MonthlytShiftData,
          weekly_shifts: WeeklyShiftData,
        });
        return emp_attendance_data;
      }
    } catch (error) {
      console.error("Error fetching by id:", error);
      if (error?.response?.status === 401) {
        HandleLogout();
      }
      return {};
    }
  } else return {};
};

export const getEmpAttendanceOverview = async (
  employee_id,
  start_date = new Date(),
  end_date = new Date()
) => {
  if (!employee_id || !start_date || !end_date) return null;
  try {
    const attendanceResponse = await getAttendance({
      filterData: {
        date_range: `${moment()
          .startOf("month")
          .format("YYYY-MM-DD")},${moment().format("YYYY-MM-DD")}`,
        employee_id: employee_id,
      },
    });
    const shiftResponse = await getActiveShiftList(
      employee_id,
      start_date,
      end_date
    );

    if (attendanceResponse || shiftResponse) {
      const ResponseData = await mapEmpAttendanceOverview({
        attendanceDetails: attendanceResponse.results || [],
        shiftResponse: shiftResponse || [],
      });

      return ResponseData;
    }
  } catch (error) {
    console.error("Error fetching by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const saveUpdateAttendanceAdjustment = async (payload, id) => {
  const attendanceId = id;
  try {
    const finalPayload = mapAttendanceAdjustmentPayloadData(payload);

    const url = attendanceId
      ? `${baseUrl}/attendance-adjustment/${attendanceId}/` // Use id if updating
      : `${baseUrl}/attendance-adjustment/`; // No id means create new

    const method = attendanceId ? "PATCH" : "POST"; // Determine method based on existence of id

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

export const getAttendanceAdjustmentListData = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "";
  let URL = `/attendance-adjustment/?${
    ordering ? `ordering=${ordering}&` : ""
  }${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapAttendanceAdjustmentListData(
        ResponseData.results
      );
      return { results: ResponseDataList, count: ResponseData.count };
    }
  } catch (error) {
    console.error("Error fetching attendance list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const getAttendanceAdjustmentData = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl}/attendance-adjustment/${id}/`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      const Response = response.data;
      const currentapprover = await getCurrentRequestApprover(
        Response.request_id
      );
      const ResponseData = await mapAttendanceAdjustmentData({
        ...Response,
        ...currentapprover,
      });

      return { ...ResponseData, ...currentapprover };
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getAttendanceAdjustmentLogsData = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl}/attendance-update-logs/${id}/`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      const ResponseData = response.data;

      return ResponseData;
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const getAttendanceAdjustmentLogsList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "";
  let URL = `/attendance-update-logs/?${
    ordering ? `ordering=${ordering}&` : ""
  }${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      // const ResponseDataList = await mapAttendanceAdjustmentListData(
      //   ResponseData.results
      // );
      return { results: ResponseData.results, count: ResponseData.count };
    }
  } catch (error) {
    console.error("Error fetching attendance list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getBiometricUserAttendanceData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/user-records/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;

      return ResponseData;
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const saveUserBiometricAttendance = async (biometric_id) => {
  try {
    const responseList = await getBiometricUserAttendanceData(biometric_id);
    if (responseList) {
      if (Array.isArray(responseList) && responseList.length > 0) {
        for (const data of responseList) {
          const date = moment(data.timestamp).format("YYYY-MM-DD");
          if (data.emp_id) {
            try {
              const response = await saveUserBiometricAttendanceLog(
                data.emp_id,
                data,
                date
              );
              console.log(response, data, "biometric");
            } catch (error) {
              console.error("Error saving attendance for:", data, error);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const saveBiometricBreak = async (payload) => {
  try {
    const existingData = await getBreak({
      filterData: {
        employee_id: payload.employee_id,
        attendance: payload.attendance,
      },
    });
    const finalPayload = mapBreakPayloadData(payload, existingData.results);
    const ID = finalPayload?.id;
    if (finalPayload) {
      debugger;
      const response = await saveBreak(finalPayload, ID);
      if (response) {
        return response;
      }
    }
  } catch (error) {
    console.error("Error saving break:", error);

    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
  }

  return false;
};

export const saveUserBiometricAttendanceLog = async (
  employee_id,
  userBiometricList,
  date
) => {
  try {
    const active_Shift = await getActiveShiftData(employee_id, date);
    const attendanceData = await getAttendancebyEmployee(employee_id, date);
    if (userBiometricList.status === "check-in") {
      const attendancePayload = mapAttendanceCheckInPayload(
        userBiometricList.timestamp,
        attendanceData,
        active_Shift.is_split_shift,
        employee_id
      );
      if (attendancePayload) {
        const response = await saveAttendance(
          { ...attendancePayload, additional_info: "Biometric Check-In" },
          active_Shift,
          attendanceData.id
        );
        return Boolean(response);
      }
    }
    if (userBiometricList.status === "check-out") {
      const attendancePayload = mapAttendanceCheckOutPayload(
        userBiometricList.timestamp,
        attendanceData,
        active_Shift.is_split_shift
      );
      if (attendancePayload) {
        const response = await saveAttendance(
          { ...attendancePayload, additional_info: "Biometric Check-Out" },
          active_Shift,
          attendanceData.id
        );
        return Boolean(response);
      }
    }
    if (userBiometricList.status === "check-out") {
      if (attendanceData) return Boolean(attendanceData);
      const response = await saveAttendance({
        employee_id: employee_id,
        date: date,
        checkin: moment(userBiometricList.timestamp).utc().toISOString(),
      });
      return Boolean(response);
    }
    const attendance =
      attendanceData ??
      (await saveAttendance({
        employee_id: employee_id,
        date: date,
        checkin: moment(userBiometricList.timestamp).utc().toISOString(),
      }));
    if (userBiometricList) {
      if (userBiometricList.status === "break") {
        const breakSaveResponse = await saveBiometricBreak({
          employee_id: employee_id,
          attendance: attendance.id,
          time: userBiometricList.timestamp,
        });
        if (breakSaveResponse) {
          debugger;
          const breakDuration = await calculateBreak({
            filterData: {
              employee_id: employee_id,
              attendance: attendance.id,
            },
          });
          const attendanceResponse = await saveAttendance({
            id: attendance?.id,
            break_duration: breakDuration,
          });
          if (attendanceResponse) {
            return true;
          }
        }
      } else {
      }
    }
    return false;
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const getUserBiometricLogsList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "";
  let URL = `/user-record-list/?${ordering ? `ordering=${ordering}&` : ""}${
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
      return { results: ResponseData.results, count: ResponseData.count };
    }
  } catch (error) {
    console.error("Error fetching attendance list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};
export {
  getAttendanceStats,
  saveShiftAssignment,
  getEmployeeList,
  getShift,
  getShiftAssignment,
  getAttendance,
  saveBreak,
  getBreak,
  calculateBreak,
  getBreakStatus,
  endBreak,
  getLocalTime,
  convertUTCToLocal,
  getStats,
  employeeData,
  getAttendanceSummary,
  getDepartmentPercentage,
  getWeeklySummary,
};
