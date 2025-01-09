import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { handleLogout } from "./general";
import moment from "moment";
const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
 const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


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
      handleLogout();
    }
    return false;
  }
}

const getEmployeeList = async(payload) =>{
   const pageNo = payload?.options?.page ?? "";
   const pageSize = payload?.options?.sizePerPage ?? "";
   const filterData = payload?.filterData ?? {};

   let URL = `/customemp?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
     pageSize ? `page_size=${pageSize}&` : ""
   }search=${encodeURIComponent(JSON.stringify(filterData))}`;

   try{
      const response = await axios.get(`${baseUrl}${URL}`, {
        headers: headers(),
      });
      if(response.status === 200){
        return response.data;
      }
   }catch(error){
      console.error("Error fetching employee list:", error);
      if(error?.response?.status === 401){
        handleLogout();
      }
      return false;
   }
}

const getShift = async(payload) =>{
     const pageNo = payload?.options?.page ?? "";
     const pageSize = payload?.options?.sizePerPage ?? "";
     const filterData = payload?.filterData ?? {};
     let URL = `/shift?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
       pageSize ? `page_size=${pageSize}&` : ""
     }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try{
     const response = await axios.get(`${baseUrl}${URL}`, {
       headers: headers(),
     });
     if (response.status === 200) {
       return response.data;
     }
  }catch(error){
    console.error("Error fetching shift list:", error);
    if(error?.response?.status === 401){
      handleLogout();
    }
    return false;
  }
}

const getShiftAssignment = async(payload) =>{
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  let URL = `/shiftassignment?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try{
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  }catch(error){
    console.error("Error fetching shift assignment list:", error);
    if(error?.response?.status === 401){
      handleLogout();
    }
    return false;
  }
}


const getAttendance = async (payload)=>{
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  let URL = `/attendance?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try{
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  }catch(error){
    console.error("Error fetching attendance list:", error);
    if(error?.response?.status === 401){
      handleLogout();
    }
    return false;
  }
}

const getAttendanceSummary = async (payload) => {
  console.log(payload, "PAYLOAD OF ATTENDANCE");

  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  // const filterData = payload?.filterData ?? {};
  
  let queryParams = [];
  if (pageNo) queryParams.push(`page=${pageNo}`);
  if (pageSize) queryParams.push(`page%20size=${pageSize}`);

  // Add filterData to query params if it exists
  // if (Object.keys(filterData).length > 0) {
  //   Object.entries(filterData).forEach(([key, value]) => {
  //     queryParams.push(`${key}=${encodeURIComponent(value)}`);
  //   });
  // }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  const URL = `/attendance/summary${queryString}`;

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
      handleLogout();
    }

    return false;
  }
};


const saveAttendance = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/attendance/${payload.id}/`,
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
        `${baseUrl}/attendance/`,
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
    console.error("Error saving attendance:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
}

const saveBreak = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/breaks/${payload.id}/`,
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
        `${baseUrl}/breaks/`,
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
    console.error("Error saving break:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
}

const getBreak = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  let URL = `/breaks?ordering=-starttime&${pageNo ? `page=${pageNo}&` : ""}${
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
      handleLogout();
    }
    return false;
  }
}

const calculateBreak = async (payload) => {
  const breaks = await getBreak(payload);
  let breakDuration = 0; // total duration in minutes

  if (breaks && breaks.results) {
    breaks.results.forEach((element) => {
      const start = moment(element.starttime).utc(); // parse start time as UTC
      const end = element.endtime
        ? moment(element.endtime).local() // parse and convert end time to local time
        : moment().local(); // if no endtime, use the current time in local time

      console.log("start", start);
      console.log("end", end);
      if (start.isValid() && end.isValid()) {
        breakDuration += parseFloat(end.diff(start, "hours", true)); // calculate difference in hours
      }
    });
  }
  console.log(breakDuration);
  return parseFloat(breakDuration).toFixed(2); // return the break duration as a fixed decimal value
};

const getBreakStatus = async (payload) => {
  const lastBreak = await getBreak(payload);
  if(lastBreak.results.length === 0){
    return false
  }
  else{
    const lastBreakEnd = lastBreak.results[0].endtime;
    if (!lastBreakEnd) {
      return true;
    }
  }
  return false
};

const endBreak = async (payload, endtime) => {
  console.log("endbreak", payload, endtime);
  const lastBreak = await getBreak(payload);
  const lastBreakId = lastBreak?.results[0]?.id;
  const lastBreakEnd = lastBreak?.results[0]?.endtime;
  if (!lastBreakEnd && lastBreakId) {
    const breakPayload = {
      id: lastBreakId,
      endtime: endtime,
    };

    console.log("breakPayload last break", breakPayload, lastBreakEnd);
    return await saveBreak(breakPayload);
  }
  return false;
}

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
  console.log("input", timeString);
  // Parse the UTC string (timestamp with 'Z')
  const date = new Date(timeString); // Date object will automatically interpret the Z as UTC

  // Convert the date to the local time zone
  const localDateString = date.toLocaleString("en-US", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  // Parse the local date into a standard string format (YYYY-MM-DDTHH:mm:ss)
  const localDate = new Date(localDateString);
  const formattedDate = localDate.toISOString().slice(0, 19); // Format: YYYY-MM-DDTHH:mm:ss

  console.log("output", formattedDate);
  return formattedDate;
}

function formatTimeWithAMPM(timeString) {
  const date = new Date(timeString);

  // Get the hour and minute
  let hour = date.getHours();
  const minute = date.getMinutes();

  // Determine AM or PM
  const ampm = hour >= 12 ? 'PM' : 'AM';

  // Convert hour from 24-hour format to 12-hour format
  hour = hour % 12;
  hour = hour ? hour : 12; // the hour '0' should be '12'

  // Format the minute to always have two digits
  const formattedMinute = minute < 10 ? '0' + minute : minute;

  // Return the formatted time in the desired format
  return `${hour}:${formattedMinute} ${ampm}`;
}

const getStats = async (id) => {
 try{
   const response = await axios.get(`${baseUrl}/api/employee-hours${id}/`, {
     headers: headers(),
   });
   return response.data;
 }catch(error){
    console.error("Error fetching stats:", error);
    if(error?.response?.status === 401){
      handleLogout();
    }
    return false;
 }
}

  const employeeData = async (id) => {
    const employeeResponse = await axios.get(
      `${baseUrl}/emp/${id}`,
      {
        headers: headers()
      }
    );
    const employeeData = employeeResponse.data;
    return employeeData;
  };

  const getShiftById = async (id) => {
    try{
    const shiftResponse = await axios.get(`${baseUrl}/shift/${id}`, {
      headers: headers(),
    });
    const shiftData = shiftResponse.data;
    return shiftData;
    }catch(error){
      console.error("Error fetching shift by id:", error);
      if(error?.response?.status === 401){
        handleLogout();
      }
      return false;
    }
  }

  const getAttendanceStats = async () => {
    try{
    const response = await axios.get(`${baseUrl}/attendance/summary/overall/?page=1`, {
      headers: headers(),
    });
    const attendanceSummary = response.data;
    return attendanceSummary;
    }catch(error){
      console.error("Error fetching shift by id:", error);
      if(error?.response?.status === 401){
        handleLogout();
      }
      return false;
    }
  }

  const getDepartmentPercentage = async () => {
    try{
    const response = await axios.get(
      `${baseUrl}/attendance/department-percentage`,
      {
        headers: headers(),
      }
    );
    return response.data;
    }catch(error){
      console.error("Error fetching shift by id:", error);
      if(error?.response?.status === 401){
        handleLogout();
      }
      return false;
    }
  }

  const getWeeklySummary = async () => {
    try{
    const response = await axios.get(
      `${baseUrl}/attendance/weeklysummary`,
      {
        headers: headers(),
      }
    );
    return response.data;
    }catch(error){
      console.error("Error fetching shift by id:", error);
      if(error?.response?.status === 401){
        handleLogout();
      }
      return false;
    }
  }

export {
  getAttendanceStats,
  saveShiftAssignment,
  getEmployeeList,
  getShift,
  getShiftAssignment,
  getAttendance,
  saveAttendance,
  saveBreak,
  getBreak,
  calculateBreak,
  getBreakStatus,
  endBreak,
  getLocalTime,
  convertUTCToLocal,
  formatTimeWithAMPM,
  getStats,
  employeeData,
  getShiftById,
  getAttendanceSummary,
  getDepartmentPercentage,
  getWeeklySummary
};