import axios from "axios";
import { HandleLogout, baseUrl, headers, getCurrentRequestApprover } from "./general";
import moment from "moment";
import { renderErrorMessages } from "utils/renderErrors";
import {
  mapManpowerPayloadData,
  mapManpowerData,
  mapBenefitList,
  mapBenefitData,
  mapBenefitPayloadData,
  mapCareerLevelList,
  mapCareerLevelData,
  mapCareerLevelPayloadData,
  mapRemoteWorkChecklistList,
  mapRemoteWorkChecklistData,
  mapRemoteWorkChecklistPayloadData,
  mapJobTypeList,
  mapJobTypeData,
  mapJobTypePayloadData,
  mapEducationList,
  mapEducationData,
  mapEducationPayloadData,
  mapHeadcountRequestList,
  mapHeadcountRequestData,
  mapHeadcountRequestPayloadData,
} from "app/utils/MappingObjects/mapTalentSphere";

export const getManpowerPlanningList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/manpower-plans/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
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

export const getManpowerById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/manpower-plans/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const ResponseData = await mapManpowerData({ ...Response, });

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

export const saveManpowerPanning = async (payload, id) => {
  const ID = id || payload?.id;
  try {
    const finalPayload = mapManpowerPayloadData(payload);
    const url = ID
      ? `${baseUrl}/manpower-plans/${ID}/` // Use id if updating
      : `${baseUrl}/manpower-plans/`; // No id means create new

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

export const getBenefitList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/recruitment-benefits/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapBenefitList(ResponseData.results);
      return { results: ResponseDataList, count: ResponseData.count };
    }
  } catch (error) {
    console.error("Error getting regions list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getBenefitData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment-benefits/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapBenefitData(response.data);
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

export const saveUpdateBenefit = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/recruitment-benefits/${id}/`
      : `${baseUrl}/recruitment-benefits/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapBenefitPayloadData(payload);
    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });

    if (response.status === expectedStatus) {
      return response.data;
    }
    renderErrorMessages(response?.data);
    console.warn(
      "API call succeeded but with unexpected status code:",
      response.status
    );
    return false;
  } catch (error) {
    console.error("API error in saveUpdateUserRole:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

export const getRemoteWorkChecklistList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/remote-work-checklist/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapRemoteWorkChecklistList(ResponseData.results);
      return { results: ResponseDataList, count: ResponseData.count };
    }
  } catch (error) {
    console.error("Error getting regions list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getRemoteWorkChecklistData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/remote-work-checklist/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapRemoteWorkChecklistData(response.data);
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

export const saveUpdateRemoteWorkChecklist = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/remote-work-checklist/${id}/`
      : `${baseUrl}/remote-work-checklist/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapRemoteWorkChecklistPayloadData(payload);
    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });

    if (response.status === expectedStatus) {
      return response.data;
    }
    renderErrorMessages(response?.data);
    console.warn(
      "API call succeeded but with unexpected status code:",
      response.status
    );
    return false;
  } catch (error) {
    console.error("API error in saveUpdateUserRole:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};


export const getJobTypeList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/job-types/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapJobTypeList(ResponseData.results);
      return { results: ResponseDataList, count: ResponseData.count };
    }
  } catch (error) {
    console.error("Error getting regions list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getJobTypeData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/job-types/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapJobTypeData(response.data);
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

export const saveUpdateJobType = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/job-types/${id}/`
      : `${baseUrl}/job-types/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapJobTypePayloadData(payload);
    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });

    if (response.status === expectedStatus) {
      return response.data;
    }
    renderErrorMessages(response?.data);
    console.warn(
      "API call succeeded but with unexpected status code:",
      response.status
    );
    return false;
  } catch (error) {
    console.error("API error in saveUpdateUserRole:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

export const getEducationList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/recruitment-education/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapEducationList(ResponseData.results);
      return { results: ResponseDataList, count: ResponseData.count };
    }
  } catch (error) {
    console.error("Error getting regions list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getEducationData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment-education/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapEducationData(response.data);
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

export const saveUpdateEducation = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/recruitment-education/${id}/`
      : `${baseUrl}/recruitment-education/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapEducationPayloadData(payload);
    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });

    if (response.status === expectedStatus) {
      return response.data;
    }
    renderErrorMessages(response?.data);
    console.warn(
      "API call succeeded but with unexpected status code:",
      response.status
    );
    return false;
  } catch (error) {
    console.error("API error in saveUpdateUserRole:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

export const getCareerLevelList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/recruitment-career-levels/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapCareerLevelList(ResponseData.results);
      return { results: ResponseDataList, count: ResponseData.count };
    }
  } catch (error) {
    console.error("Error getting regions list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getCareerLevelData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment-career-levels/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapCareerLevelData(response.data);
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

export const saveUpdateCareerLevel = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/recruitment-career-levels/${id}/`
      : `${baseUrl}/recruitment-career-levels/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapCareerLevelPayloadData(payload);
    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });

    if (response.status === expectedStatus) {
      return response.data;
    }
    renderErrorMessages(response?.data);
    console.warn(
      "API call succeeded but with unexpected status code:",
      response.status
    );
    return false;
  } catch (error) {
    console.error("API error in saveUpdateUserRole:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};


export const getHeadcountRequestList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/headcount-requests/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapHeadcountRequestList(ResponseData.results);
      return { results: ResponseDataList, count: ResponseData.count };
    }
  } catch (error) {
    console.error("Error getting regions list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getHeadcountRequestData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/headcount-requests/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapHeadcountRequestData(response.data);
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

export const saveUpdateHeadcountRequest = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/headcount-requests/${id}/`
      : `${baseUrl}/headcount-requests/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapHeadcountRequestPayloadData(payload);
    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });

    if (response.status === expectedStatus) {
      return response.data;
    }
    renderErrorMessages(response?.data);
    console.warn(
      "API call succeeded but with unexpected status code:",
      response.status
    );
    return false;
  } catch (error) {
    console.error("API error in saveUpdateUserRole:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};