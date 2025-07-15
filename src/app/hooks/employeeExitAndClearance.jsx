import axios from "axios";
import { getFormattedDropdownItems } from "utils/Lists";
import {
  mapEmployeeExitData,
  mapEmployeeExitPayloadData,
  mapExitStatsData,
} from "app/utils/MappingObjects/mapEmployeeExitData";
import {
  HandleLogout,
  getCurrentRequestApprover,
  baseUrl,
  headers,
  formDataHeader,
} from "./general";
import { renderErrorMessages } from "utils/renderErrors";

const getEmployeesResignations = async (payload) => {
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-exit_date";
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";

  try {
    const URL = `/employeeExit?order=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });

    if (response.status === 200) {
      const resignationData = response.data;
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
      status: error.response?.status,
    });
    return null;
  }
};

export const getEmployeeExitStats = async (payload) => {
  try {
    // Making the GET request to the constructed URL
    const response = await getEmployeesResignations(payload);

    if (response) {
      const ResponseResults = response.results || [];
      const ResponseData = await mapExitStatsData(ResponseResults);

      // Returning the calculated values
      return ResponseData;
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
      status: error.response?.status,
    });
    return null;
  }
};

export const getEmployeeExitData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/employeeExit/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const currentapprover = await getCurrentRequestApprover(Response.request);
      const ResponseData = await mapEmployeeExitData({
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

export const saveEmployeeExitDetail = async (payload, id) => {
  const finalId = id;
  try {
    const finalPayload = mapEmployeeExitPayloadData(payload);

    const url = finalId
      ? `${baseUrl}/employeeExit/${finalId}` // Use id if updating
      : `${baseUrl}/employeeExit`; // No id means create new

    const method = finalId ? "PATCH" : "POST"; // Determine method based on existence of id

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

// const saveEmployeeExitDetail = async (payload, id) => {
//   try {
//     if (id) {
//       const URL = `${baseUrl}/employeeExit/${id}`;
//       const response = await axios.patch(URL, payload, {
//         headers: formDataHeader(),
//       });
//       if (response) {
//         return response;
//       }
//     } else {
//       const URL = `${baseUrl}/employeeExit`;
//       const response = await axios.post(URL, payload, {
//         headers: formDataHeader(),
//       });
//       if (response) {
//         return response;
//       }
//     }
//   } catch (error) {
//     if (error?.response?.status === 401) {
//       // HandleLogout();
//     }

//     console.error("Error fetching Personal Info data :", error);
//     return false;
//   }
// };

const getTerminationReason = async (payload) => {
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
const saveTerminationReason = async (payload, id) => {
  try {
    const paylodid = payload?.id || id;
    if (paylodid) {
      const URL = `${baseUrl}/terminationreason/${paylodid}`;
      const response = await axios.patch(URL, payload, {
        headers: formDataHeader(),
      });
      if (response) {
        return response;
      }
    } else {
      const URL = `${baseUrl}/terminationreason/`;
      const response = await axios.post(URL, payload, {
        headers: formDataHeader(),
      });
      if (response) {
        return response;
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    return false;
  }
};

const deleteTerminationReason = async (id) => {
  try {
    const URL = `${baseUrl}/terminationreason/${id}`;
    const response = await axios.delete(URL, {
      headers: formDataHeader(),
    });
    if (response) {
      return response;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    return false;
  }
};

const getTerminationReasonById = async (id) => {
  try {
    const URL = `${baseUrl}/terminationreason/${id}`;
    const response = await axios.get(URL, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    return null;
  }
};

export {
  getEmployeesResignations,
  getTerminationReason,
  saveTerminationReason,
  deleteTerminationReason,
  getTerminationReasonById,
};
