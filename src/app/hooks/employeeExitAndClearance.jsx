import axios from "axios";
import { getFormattedDropdownItems } from "utils/Lists";
import { initialState } from "state/slices/UserSlice";
import {
  ExitStatusCurrentStep,
  Status,
} from "app/modules/ExitAndClearance/Sections";
import { HandleLogout } from "./general";
const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  // Don't explicitly set 'Content-Type' for FormData
});
const getEmployeesExitCount = async (payload, activeTab, activeInnerTab) => {
  const filterData = payload?.filterData ?? {};
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";

  console.log("getEmployeesExitCount - Request params:", {
    filterData,
    activeTab,
    activeInnerTab,
    pageNo,
    pageSize
  });

  try {
    // Constructing the URL based on provided pagination and filter data
    const URL = `/employeeExit?order=-created_at&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    console.log("getEmployeesExitCount - Full URL:", `${baseUrl}${URL}`);

    // Making the GET request to the constructed URL
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    console.log("getEmployeesExitCount - Response status:", response.status);

    if (response.status === 200) {
      const resignationData = response.data?.results || [];
      
      console.log("---------------------------------------------");
      console.log("📈 EMPLOYEE EXIT COUNT SUMMARY 📈");
      console.log("---------------------------------------------");
      console.log("Full response data:", response.data);
      
      // Extract and log the counts
      const totalExit = resignationData?.total_exit || 0;
      const approvedTermination = resignationData?.approved_termination || 0;
      const approvedResignation = resignationData?.approved_resignation || 0;
      const rejectedTermination = resignationData?.rejected_termination || 0;
      const rejectedResignation = resignationData?.rejected_resignation || 0;
      const totalApproved = approvedTermination + approvedResignation;
      const totalRejected = rejectedTermination + rejectedResignation;
      
      console.log("Total Exit Records:", totalExit);
      console.log("Approved Terminations:", approvedTermination);
      console.log("Approved Resignations:", approvedResignation);
      console.log("Rejected Terminations:", rejectedTermination);
      console.log("Rejected Resignations:", rejectedResignation);
      console.log("Total Approved:", totalApproved);
      console.log("Total Rejected:", totalRejected);
      console.log("---------------------------------------------");
      
      // Returning the calculated values
      return {
        total: totalExit,
        approved: totalApproved,
        rejected: totalRejected,
      };
    } else {
      console.error("API returned non-200 status:", response.status);
      return null;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      // HandleLogout();
    }
    console.error("Error fetching exit count data:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return null;
  }
};

const getEmployeesResignations = async (payload) => {
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-exit_date";
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  
  console.log("getEmployeesResignations - Request params:", {
    filterData,
    ordering,
    pageNo,
    pageSize
  });
  
  try {
    const URL = `/employeeExit?order=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    
    console.log("getEmployeesResignations - Full URL:", `${baseUrl}${URL}`);
    
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    
    console.log("getEmployeesResignations - Response status:", response.status);
    
    if (response.status === 200) {
      const resignationData = response.data;
      
      console.log("---------------------------------------------");
      console.log("🔍 EMPLOYEE RESIGNATIONS API RESULTS 🔍");
      console.log("---------------------------------------------");
      console.log("Total count:", resignationData.count || 'Not available');
      
      if (resignationData?.results?.result) {
        const results = resignationData.results.result;
        console.log("Total resignation/termination records:", results.length);
        
        // Count by type (resignation vs termination)
        const typeCount = {
          resignation: results.filter(item => item.type === 'Resignation' || item.reason_resignation).length,
          termination: results.filter(item => item.type === 'Termination' || item.reason_termination).length,
          other: results.filter(item => !item.type && !item.reason_resignation && !item.reason_termination).length
        };
        
        console.log("Results by type:", typeCount);
        
        // Show sample of first record if available
        if (results.length > 0) {
          console.log("Sample record:", results[0]);
        }
      } else {
        console.log("No results array found in the response");
      }
      console.log("---------------------------------------------");
      
      return {
        count: resignationData.count,
        results: resignationData?.results?.result,
      };
    } else {
      console.error("API returned non-200 status:", response.status);
      return null;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      // HandleLogout();
    }
    console.error("Error fetching employee exit data:", error);
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return null;
  }
};

const saveEmployeeExitDetail = async (payload, id) => {
  try {
    if (id) {
      const URL = `${baseUrl}/employeeExit/${id}`;
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

export const getTerminationReason = async (payload) => {
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  try {
    const URL = `/terminationreason?order=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const terminationReasonData = response.data;
      return {
        count: terminationReasonData.count,
        results: getFormattedDropdownItems(terminationReasonData?.results),
      };
    } else {
      return {
        count: 0,
        results: [],
      };
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    return {
      count: 0,
      results: [],
    };
  }
};

export {
  getEmployeesResignations,
  saveEmployeeExitDetail,
  getEmployeesExitCount,
};
