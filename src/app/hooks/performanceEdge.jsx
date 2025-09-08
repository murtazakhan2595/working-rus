import axios from "axios";
import { HandleLogout, baseUrl, headers, getCurrentRequestApprover } from "./general";
import moment from "moment";
import { renderErrorMessages } from "utils/renderErrors";
import {
  mapEvaluationPayloadData,
  mapEvaluatoionData,
  mapPerformanceCyclePayloadData,
  mapPerformanceCycleData,
  mapAssesmentForm,
  mapEvaluationSubmissionPayloadData,
  mapEvaltaionResults,
} from 'app/utils/MappingObjects/mapPerformanceEdgeData'


export const getEvaluationFormsList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  // let URL = `/evaluation-forms/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
  //   }${pageSize ? `page_size=${pageSize}&` : ""}`;
  let URL = `/evaluation-forms/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers(), });
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

export const getEvaluationFormById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/evaluation-forms/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const ResponseData = await mapEvaluatoionData(Response);

      return { ...ResponseData };
    }
  } catch (error) {
    console.error("Error fetching job rotation by ID:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const saveEvaluationForm = async (payload, id) => {
  const ID = id || payload?.id;
  try {
    const finalPayload = mapEvaluationPayloadData(payload);

    const url = ID
      ? `${baseUrl}/evaluation-forms/${ID}/` // Use id if updating
      : `${baseUrl}/evaluation-forms/`; // No id means create new

    const method = ID ? "PATCH" : "POST"; // Determine method based on existence of id

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

export const getPerformanceCycleList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/cycles/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}`;
  // let URL = `/cycles/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
  //   }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
  //     JSON.stringify(filterData)
  //   )}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers(), });
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

export const savePerformanceCycle = async (payload, id) => {
  const ID = id || payload?.id;
  try {
    const finalPayload = mapPerformanceCyclePayloadData(payload);

    const url = ID
      ? `${baseUrl}/cycles/${ID}/` // Use id if updating
      : `${baseUrl}/cycles/`; // No id means create new

    const method = ID ? "PATCH" : "POST"; // Determine method based on existence of id

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

export const getPerformanceCycleById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/cycles/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const ResponseData = await mapPerformanceCycleData(Response);

      return { ...ResponseData };
    }
  } catch (error) {
    console.error("Error fetching job rotation by ID:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};




export const getDashboardMetrics = async (filterData = {}) => {
  const URL = `/dashboard/matrics?search=${encodeURIComponent(
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
    console.error("Error fetching dashboard metrics:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};



export const getBulkDashboardData = async (payload = {}) => {
  const URL = `/BulkDataView`;
  // const URL = `/Bulkdataview/?search=${encodeURIComponent(
  //   JSON.stringify(payload)
  // )}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers() });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching bulk dashboard data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};


export const exportPerformanceReports = async (params = {}) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${baseUrl}/pendingHr/reports`,
      // params: params, // Use params instead of data for GET request
      headers: headers(),
      responseType: "blob", // This is crucial for file downloads
    });

    if (response.status === 200 || response.status === 201) {
      return response; // Return the entire response object
    }
  } catch (error) {
    console.error("Error exporting performance reports:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

export const getOrgStructure = async () => {
  try {
    const response = await axios.get(`${baseUrl}/org-structure/`, {
      headers: headers()
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching org structure:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const getMyPerformanceForms = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/my-performance/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}`;
  // let URL = `/cycles/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
  //   }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
  //     JSON.stringify(filterData)
  //   )}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers(), });
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

export const getMyPerformanceFormsById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/my-performance/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const formData = await getEvaluationFormById(3);
      const ResponseData = await mapAssesmentForm({ ...Response, forms: [formData] });

      return { ...ResponseData };
    }
  } catch (error) {
    console.error("Error fetching job rotation by ID:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}


export const saveEvaluationSubmission = async (payload, id) => {
  const ID = id || payload?.id;
  try {
    const finalPayload = mapEvaluationSubmissionPayloadData(payload);

    const url = ID
      ? `${baseUrl}/submissions/${ID}/` // Use id if updating
      : `${baseUrl}/submissions/`; // No id means create new

    const method = ID ? "PATCH" : "POST"; // Determine method based on existence of id

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

export const saveEvaluationSubmissionAnswers = async (payload, id) => {
  const ID = id || payload?.id;
  try {
    // const finalPayload = mapEvaluationSubmissionPayloadData(payload);
    const finalPayload = payload;

    const url = ID
      ? `${baseUrl}/submissionanswers/${ID}/` // Use id if updating
      : `${baseUrl}/submissionanswers/`; // No id means create new

    const method = ID ? "PATCH" : "POST"; // Determine method based on existence of id

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
export const getSubmissionAnswers = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    const sortField = payload?.ordering || "id";
    const URL = `/submissionanswers/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
      }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
        JSON.stringify(filterData)
      )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      return Response;
    }
  } catch (error) {
    console.error("Error fetching job rotation by ID:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}
export const getEvaluationsResults = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    const sortField = payload?.ordering || "id";
    const URL = `/FinalEvaluation/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
      }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
        JSON.stringify(filterData)
      )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const ResponseData = await mapEvaltaionResults(Response.results, []);

      return { count: Response.count, results: ResponseData };
    }
  } catch (error) {
    console.error("Error fetching job rotation by ID:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}
export const getFinalEvaluationById = async (id) => {
  try {
    const URL = `/FinalEvaluation/${id}/`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;

      return Response;
    }
  } catch (error) {
    console.error("Error fetching job rotation by ID:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}