import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { HandleLogout } from "./general";
import moment from "moment";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  // Don't explicitly set 'Content-Type' for FormData
});


const getJobRotationRequests = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/job-rotation-requests?ordering=${sortField}&${
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
    console.error("Error fetching job rotation requests:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}

const getJobRotationById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/job-rotation-requests/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching job rotation by ID:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
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

export { getJobRotationRequests, getJobRotationById };