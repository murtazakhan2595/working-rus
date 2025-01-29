import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import {
  ExitStatusCurrentStep,
  Status,
} from "app/modules/ExitAndClearance/Sections";
import { HandleLogout} from "./general";
const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  // Don't explicitly set 'Content-Type' for FormData
});
const getEmployeesExitCount = async (payload) => {
  const filterData = payload?.filterData ?? {};
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";

  try {
    // Constructing the URL based on provided pagination and filter data
    const URL = `/employeeExit?order=-created_at&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    // Making the GET request to the constructed URL
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      const resignationData = response.data?.results?.result || [];
      const total = response?.data?.count || 0;
      let rejected = 0; // Changed from const to let to allow updating
      let approved = 0; // Changed from const to let to allow updating

      // Iterating through each resignation to calculate counts
      resignationData.forEach((resignation) => {
        const status_resignation = resignation.status_resignation;
        const status_termination = resignation.status_termination;

        // Check status for resignation
        if (ExitStatusCurrentStep(status_resignation) === 2) {
          if (Status(status_resignation, 2) === "Approved") {
            approved += 1;
          } else {
            rejected += 1;
          }
        }
        if (
          ExitStatusCurrentStep(status_resignation) >= 3 ||
          ExitStatusCurrentStep(status_termination) >= 3
        ) {
          approved += 1;
        }
        // Check status for termination
        else if (ExitStatusCurrentStep(status_termination) === 0) {
          if (Status(status_resignation, 0) === "Approved") {
            approved += 1;
          } else {
            rejected += 1;
          }
        }
      });

      // Returning the calculated values
      return { total, approved, rejected };
    } else {
      return null;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      // HandleLogout();
    }
    console.error("Error fetching Personal Info data:", error);
    return null;
  }
};

const getEmployeesResignations = async (payload) => {
  console.log("getEmployeesResignations", payload);
  const filterData = payload?.filterData ?? {};
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  try {
    const URL = `/employeeExit?order=-created_at&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    console.log("getemployeeresignation", response);
    if (response.status === 200) {
      const resignationData = response.data;
      return {
        count: resignationData.count,
        results: resignationData?.results?.result,
      };
    } else {
      return null;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      // HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    return null;
  }
};
const saveEmployeeExitDetail = async (payload) => {
  try {
    if (payload?.id) {
      const URL = `${baseUrl}/employeeExit/${payload?.id}`;
      const response = await axios.patch(URL, payload, {
        headers: formDataHeader(),
      });
      if (response) {
        return response;
      }
    } else {
      const URL = `${baseUrl}/employeeExit`;
      const response = await axios.post(URL, payload, {
        headers: formDataHeader(),
      });
      if (response) {
        return response;
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      // HandleLogout();
    }

    console.error("Error fetching Personal Info data :", error);
    return false;
  }
};

export {
  getEmployeesResignations,
  saveEmployeeExitDetail,
  getEmployeesExitCount,
};
