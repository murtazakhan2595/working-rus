
import axios from "axios";
import { HandleLogout, baseUrl, headers, getCurrentRequestApprover, formDataHeader } from "./general";
import moment from "moment";
import { renderErrorMessages } from "utils/renderErrors";
import {
  mapManpowerPayloadData,
  mapManpowerData,
  mapBenefitList,
  mapBenefitData,
  mapBenefitPayloadData,
  mapSkillList,
  mapSkillData,
  mapSkillPayloadData,
  mapBlacklistReasonList,
  mapBlacklistReasonData,
  mapBlacklistReasonPayloadData,
  mapOfferLetterTemplateList,
  mapOfferLetterTemplateData,
  mapOfferLetterTemplatePayloadData,
  mapOfferTrackingList,
  mapOfferTrackingData,
  mapOfferTrackingPayloadData,
  mapOfferLetterList,
  mapOfferLetterData,
  mapOfferLetterPayloadData,
  mapInterviewFeedbackList,
  mapInterviewFeedbackData,
  mapInterviewFeedbackPayloadData,
  mapEmailTemplateList,
  mapEmailTemplateData,
  mapEmailTemplatePayloadData,
  mapFeedBackFormList,
  mapFeedBackFormData,
  mapFeedBackFormPayloadData,
  mapInterviewTypeList,
  mapInterviewTypeData,
  mapInterviewTypePayloadData,
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
  mapVacancyList,
  mapVacancyData,
  mapVacancyPayloadData,
  mapRequisitionStatsData,
  mapRequisitionRequestList,
  mapRequisitionRequestData,
  mapRequisitionRequestPayloadData,
  mapManpowerList,
  mapApplicantsList,
  mapApplicantsData,
  mapApplicationPayloadData,
  mapResumeBankApplicationPayloadData,
  mapRejectedApplicationPayloadData,
  mapResumeBankApplicantsList,
  mapInterviewData,
  mapShortlistedApplicantPayloadData,
  mapBlacklistApplicantPayloadData,
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
      const ResponseData = response.data;
      const ResponseDataList = await mapManpowerList(ResponseData.results);
      return { results: ResponseDataList, count: ResponseData.count };
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

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

export const getSkillList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/recruitment-skills/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapSkillList(ResponseData.results);
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

export const getSkillData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment-skills/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapSkillData(response.data);
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

export const saveUpdateSkill = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/recruitment-skills/${id}/`
      : `${baseUrl}/recruitment-skills/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapSkillPayloadData(payload);
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

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};


export const getInterviewTypeList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/interview-types/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapInterviewTypeList(ResponseData.results);
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

export const getInterviewTypeData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/interview-types/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapInterviewTypeData(response.data);
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

export const saveUpdateInterviewType = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/interview-types/${id}/`
      : `${baseUrl}/interview-types/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapInterviewTypePayloadData(payload);
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

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
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

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
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

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
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

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
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

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
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
      const Response = response.data;
      const currentapprover = await getCurrentRequestApprover(Response.request);
      const ResponseData = await mapHeadcountRequestData({ ...Response, ...currentapprover, }, true);
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

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};


export const getRequisitionRequestList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/requisition-requests/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapRequisitionRequestList(ResponseData.results);
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

export const getRequisitionStats = async (payload) => {
  try {
    const response = await getRequisitionRequestList();
    if (response) {
      const ResponseData = response.results;
      const StatData = mapRequisitionStatsData(ResponseData);
      return StatData;
    } else return {};
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return {};
};

export const getRequisitionRequestData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/requisition-requests/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const currentapprover = Response.request ? await getCurrentRequestApprover(Response.request) : {};
      const ResponseData = await mapRequisitionRequestData({ ...Response, ...currentapprover, }, true);
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

export const saveUpdateRequisitionRequest = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/requisition-requests/${id}/`
      : `${baseUrl}/requisition-requests/`;

    const method = id ? "PATCH" : "POST";
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapRequisitionRequestPayloadData(payload);
    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: formDataHeader(),
    });

    if (response.status === expectedStatus) {
      return response.data;
    }
    renderErrorMessages(response?.data);

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};


// Demographic Forms API hooks
export const getDemographicFormsList = async (payload = {}) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";
  const URL = `/demographic-forms/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""}${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers() });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching demographic forms:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const getDemographicFormById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/demographic-forms/${id}/`, { headers: headers() });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching demographic form by ID:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

export const saveUpdateDemographicForm = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/demographic-forms/${id}/`
      : `${baseUrl}/demographic-forms/`;
    const method = id ? "PATCH" : "POST";
    const expectedStatus = id ? 200 : 201;
    const response = await axios({
      method,
      url,
      data: payload,
      headers: headers(),
    });
    if (response.status === expectedStatus) {
      return response.data;
    }
    renderErrorMessages(response?.data);
    console.warn("API call succeeded but with unexpected status code:", response.status);
    return false;
  } catch (error) {
    console.error("API error in saveUpdateDemographicForm:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

// Demographic Sections API hooks
export const getDemographicSectionsList = async (payload = {}) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";

  const URL = `/demographic-sections/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""}${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(JSON.stringify(filterData))}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers() });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching demographic sections:", error);
    if (error?.response?.status === 401) HandleLogout();
    return false;
  }
};

export const getDemographicSectionById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/demographic-sections/${id}/`, { headers: headers() });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching demographic section by ID:", error);
    if (error?.response?.status === 401) HandleLogout();
    return false;
  }
};

export const saveUpdateDemographicSection = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/demographic-sections/${id}/`
      : `${baseUrl}/demographic-sections/`;
    const method = id ? "PATCH" : "POST";
    const expectedStatus = id ? 200 : 201;

    const response = await axios({ method, url, data: payload, headers: headers() });
    if (response.status === expectedStatus) return response.data;

    renderErrorMessages(response?.data);
    return false;
  } catch (error) {
    console.error("API error in saveUpdateDemographicSection:", error);
    if (error?.response?.status === 401) HandleLogout();
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

export const deleteDemographicSection = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/demographic-sections/${id}/`, {
      headers: headers(),
    });
    if (response.status === 204) {
      return true;
    }
    console.warn("Unexpected status on delete section:", response.status);
    return false;
  } catch (error) {
    console.error("Error deleting demographic section:", error);
    if (error?.response?.status === 401) HandleLogout();
    renderErrorMessages(error?.response?.data);
    return false;
  }
};


export const getDemographicFieldsList = async (payload = {}) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";

  const URL = `/demographic-fields/?` +
    `${ordering ? `ordering=${ordering}&` : ""}` +
    `${pageNo ? `page=${pageNo}&` : ""}` +
    `${pageSize ? `page_size=${pageSize}&` : ""}` +
    `search=${encodeURIComponent(JSON.stringify(filterData))}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers() });
    if (response.status === 200) {
      return response.data;
    }
    console.warn("Unexpected status fetching fields list:", response.status);
    return false;
  } catch (error) {
    console.error("Error fetching demographic fields list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

/**
 * Fetch a single demographic field by ID.
 * @param {number|string} id
 * @returns {Object|false}
 */
export const getDemographicFieldById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/demographic-fields/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
    console.warn("Unexpected status fetching field by id:", response.status);
    return false;
  } catch (error) {
    console.error("Error fetching demographic field by ID:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

/**
 * Create a new demographic field or update an existing one.
 * @param {Object} payload 
 * @param {number|string} [id] 
 * 
 * @returns {Object|false}
 */
export const saveUpdateDemographicField = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/demographic-fields/${id}/`
      : `${baseUrl}/demographic-fields/`;
    const method = id ? "PATCH" : "POST";
    const expectedStatus = id ? 200 : 201;

    const response = await axios({
      method,
      url,
      data: payload,
      headers: headers(),
    });

    if (response.status === expectedStatus) {
      return response.data;
    }

    renderErrorMessages(response?.data);
    console.warn("Unexpected status in saveUpdateDemographicField:", response.status);
    return false;
  } catch (error) {
    console.error("API error in saveUpdateDemographicField:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

/**
 * Delete a demographic field by ID.
 * @param {number|string} id
 * @returns {boolean}
 */
export const deleteDemographicField = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/demographic-fields/${id}/`, {
      headers: headers(),
    });
    if (response.status === 204) {
      return true;
    }
    console.warn("Unexpected status deleting field:", response.status);
    return false;
  } catch (error) {
    console.error("Error deleting demographic field:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};


export const getVacancyList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/published-vacancies/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapVacancyList(ResponseData.results);
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

export const getVacancyData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/published-vacancies/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const RequisitionData = await getRequisitionRequestData(Response.requisition);
      const ResponseData = await mapVacancyData({ ...Response });
      return { ...RequisitionData, ...ResponseData };
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const saveUpdateVacancy = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/published-vacancies/${id}/`
      : `${baseUrl}/published-vacancies/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapVacancyPayloadData(payload);
    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: formDataHeader(),
    });

    if (response.status === expectedStatus) {
      return response.data;
    }
    renderErrorMessages(response?.data);

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

// ==================== Applicants ====================

// Get Applicants list with pagination, filters, ordering
export const getApplicantsList = async (payload = {}) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";

  const URL = `/recruitment-applicants/?` +
    `${ordering ? `ordering=${ordering}&` : ""}` +
    `${pageNo ? `page=${pageNo}&` : ""}` +
    `${pageSize ? `page_size=${pageSize}&` : ""}` +
    `search=${encodeURIComponent(JSON.stringify(filterData))}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers() });
    if (response.status === 200) {
      const ResponseData = response.data;
      console.log(ResponseData)
      const ResponseDataList = await mapApplicantsList(ResponseData.results);
      return { results: ResponseDataList, count: ResponseData.count };
    }
  } catch (error) {
    console.error("Error fetching applicants list:", error);
    if (error?.response?.status === 401) HandleLogout();
    return false;
  }
};

export const getApplicantsData = async (id, applicant_details_only = false) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment-applicants/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const ResponseData = await mapApplicantsData(Response);
      if (applicant_details_only) return ResponseData;
      const VacancyData = await getVacancyData(Response.published_vacancy);
      return { ...VacancyData, ...ResponseData, };
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};



export const getApplicantById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment-applicants/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error("Error fetching applicant by ID:", error);
    if (error?.response?.status === 401) HandleLogout();
    return false;
  }
};

export const saveUpdateApplicant = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/recruitment-applicants/${id}/`
      : `${baseUrl}/recruitment-applicants/`;
    const method = id ? "PATCH" : "POST";
    const expectedStatus = id ? 200 : 201;

    const response = await axios({ method, url, data: payload, headers: headers() });
    if (response.status === expectedStatus) return response.data;

    renderErrorMessages(response?.data);
    return false;
  } catch (error) {
    console.error("API error in saveUpdateApplicant:", error);
    if (error?.response?.status === 401) HandleLogout();
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

export const deleteApplicant = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/recruitment-applicants/${id}/`, {
      headers: headers(),
    });
    if (response.status === 204) return true;
    console.warn("Unexpected status deleting applicant:", response.status);
    return false;
  } catch (error) {
    console.error("Error deleting applicant:", error);
    if (error?.response?.status === 401) HandleLogout();
    renderErrorMessages(error?.response?.data);
    return false;
  }
};
// ==================== Rejected Applications ====================


export const getRejectedApplicantList = async (payload = {}) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";

  const URL = `/recruitment-rejections/?` +
    `${ordering ? `ordering=${ordering}&` : ""}` +
    `${pageNo ? `page=${pageNo}&` : ""}` +
    `${pageSize ? `page_size=${pageSize}&` : ""}` +
    `search=${encodeURIComponent(JSON.stringify(filterData))}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers() });
    if (response.status === 200) {
      const ResponseData = response.data;
      return ResponseData;
    }
  } catch (error) {
    console.error("Error fetching applicants list:", error);
    if (error?.response?.status === 401) HandleLogout();
    return false;
  }
};

export const getRejectedApplicantById = async (applicant) => {
  try {
    const response = await getRejectedApplicantList({ filterData: { applicant: applicant } });
    if (response) {
      const ResponseList = response.results;
      if (ResponseList.length > 0) {
        const ResponseData = ResponseList.find(obj => obj.applicant === applicant);
        return ResponseData;
      }
      return {};
    }
  } catch (error) {
    console.error("Error fetching applicants list:", error);
    if (error?.response?.status === 401) HandleLogout();
    return {};
  }
};

export const saveUpdateRejectedApplication = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/recruitment-rejections/${id}/`
      : `${baseUrl}/recruitment-rejections/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapRejectedApplicationPayloadData(payload);
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
    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

// ==================== Blacklist Applications ====================

export const saveUpdateBlacklistApplicant = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/recruitment-blacklist-info/${id}/`
      : `${baseUrl}/recruitment-blacklist-info/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapBlacklistApplicantPayloadData(payload);
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
    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

// ==================== Shortlisted Applications ====================


export const getShortlistedApplicantList = async (payload = {}) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";

  const URL = `/recruitment-shortlist/?` +
    `${ordering ? `ordering=${ordering}&` : ""}` +
    `${pageNo ? `page=${pageNo}&` : ""}` +
    `${pageSize ? `page_size=${pageSize}&` : ""}` +
    `search=${encodeURIComponent(JSON.stringify(filterData))}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers() });
    if (response.status === 200) {
      const ResponseData = response.data;
      return ResponseData;
    }
  } catch (error) {
    console.error("Error fetching applicants list:", error);
    if (error?.response?.status === 401) HandleLogout();
    return false;
  }
};

export const getShortlistedApplicantById = async (applicant) => {
  try {
    const response = await getShortlistedApplicantList({ filterData: { applicant: applicant } });
    if (response) {
      const ResponseList = response.results;
      if (ResponseList.length > 0) {
        const ResponseData = ResponseList.find(obj => obj.applicant === applicant);
        return ResponseData;
      }
      return {};
    }
  } catch (error) {
    console.error("Error fetching applicants list:", error);
    if (error?.response?.status === 401) HandleLogout();
    return {};
  }
};

export const saveUpdateShortlistedApplicant = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/recruitment-shortlist/${id}/`
      : `${baseUrl}/recruitment-shortlist/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapShortlistedApplicantPayloadData(payload);
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
    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};


// ==================== Resume Bank Applications ====================


export const getResumeBankApplicantList = async (payload = {}) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";

  const URL = `/resume-bank/?` +
    `${ordering ? `ordering=${ordering}&` : ""}` +
    `${pageNo ? `page=${pageNo}&` : ""}` +
    `${pageSize ? `page_size=${pageSize}&` : ""}` +
    `search=${encodeURIComponent(JSON.stringify(filterData))}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers() });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapResumeBankApplicantsList(ResponseData.results);
      return { results: ResponseDataList, count: ResponseData.count };
    }
  } catch (error) {
    console.error("Error fetching applicants list:", error);
    if (error?.response?.status === 401) HandleLogout();
    return false;
  }
};

export const getResumeBankApplicantById = async (applicant) => {
  try {
    const response = await getResumeBankApplicantList({ filterData: { applicant: applicant } });
    if (response) {
      const ResponseList = response.results;
      if (ResponseList.length > 0) {
        const ResponseData = ResponseList.find(obj => obj.applicant === applicant);
        return ResponseData;
      }
      return {};
    }
  } catch (error) {
    console.error("Error fetching applicants list:", error);
    if (error?.response?.status === 401) HandleLogout();
    return {};
  }
};

export const saveUpdateResumeBankApplication = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/resume-bank/${id}/`
      : `${baseUrl}/resume-bank/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapResumeBankApplicationPayloadData(payload);
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
    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

// ==================== Interviews ====================

// Get Interviews list with pagination, filters, ordering
export const getInterviewsList = async (payload = {}) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";

  const URL = `/interviews/?` +
    `${ordering ? `ordering=${ordering}&` : ""}` +
    `${pageNo ? `page=${pageNo}&` : ""}` +
    `${pageSize ? `page_size=${pageSize}&` : ""}` +
    `search=${encodeURIComponent(JSON.stringify(filterData))}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers() });
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error("Error fetching interviews list:", error);
    if (error?.response?.status === 401) HandleLogout();
    return false;
  }
};

export const getInterviewById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/interviews/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const ResponseData = mapInterviewData(Response);
      const Feedbacks = await getInterviewFeedbackList({ filterData: { interview: Response.id } });
      return { interview_feedbacks: Feedbacks.results || [], ...ResponseData };
    }
  } catch (error) {
    console.error("Error fetching interview by ID:", error);
    if (error?.response?.status === 401) HandleLogout();
    return false;
  }
};

export const saveUpdateInterview = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/interviews/${id}/`
      : `${baseUrl}/interviews/`;
    const method = id ? "PATCH" : "POST";
    const expectedStatus = id ? 200 : 201;

    const response = await axios({ method, url, data: payload, headers: headers() });
    if (response.status === expectedStatus) return response.data;

    renderErrorMessages(response?.data);
    return false;
  } catch (error) {
    console.error("API error in saveUpdateInterview:", error);
    if (error?.response?.status === 401) HandleLogout();
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

export const deleteInterview = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/interviews/${id}/`, {
      headers: headers(),
    });
    if (response.status === 204) return true;
    console.warn("Unexpected status deleting interview:", response.status);
    return false;
  } catch (error) {
    console.error("Error deleting interview:", error);
    if (error?.response?.status === 401) HandleLogout();
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

export const saveUpdateApplication = async (payload, id) => {
  try {
    debugger
    const url = id
      ? `${baseUrl}/recruitment-applicants/${id}/`
      : `${baseUrl}/recruitment-applicants/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapApplicationPayloadData(payload);
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
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};



// =========================
// INTERVIEW TYPES HOOKS
// =========================

export const getInterviewTypesList = async (payload = {}) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";

  const URL =
    `/interview-types/?` +
    `${ordering ? `ordering=${ordering}&` : ""}` +
    `${pageNo ? `page=${pageNo}&` : ""}` +
    `${pageSize ? `page_size=${pageSize}&` : ""}` +
    `search=${encodeURIComponent(JSON.stringify(filterData))}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, { headers: headers() });
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error("Error fetching interview types list:", error);
    if (error?.response?.status === 401) HandleLogout();
    return false;
  }
};

export const getInterviewTypeById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/interview-types/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) return response.data;
  } catch (error) {
    console.error("Error fetching interview type by ID:", error);
    if (error?.response?.status === 401) HandleLogout();
    return false;
  }
};

export const deleteInterviewType = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/interview-types/${id}/`, {
      headers: headers(),
    });
    if (response.status === 204) return true;
    console.warn("Unexpected status deleting interview type:", response.status);
    return false;
  } catch (error) {
    console.error("Error deleting interview type:", error);
    if (error?.response?.status === 401) HandleLogout();
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

export const getFeedBackFormList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/feedback-forms/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapFeedBackFormList(ResponseData.results);
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

export const getFeedBackFormData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/feedback-forms/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapFeedBackFormData(response.data);
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

export const saveUpdateFeedBackForm = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/feedback-forms/${id}/`
      : `${baseUrl}/feedback-forms/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapFeedBackFormPayloadData(payload);
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

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};


// =========================
// RECRUITMENT EMAIL TEMPLATES HOOKS
// =========================

export const getEmailTemplateList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/recruitment-email-templates/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapEmailTemplateList(ResponseData.results);
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

export const getEmailTemplateData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment-email-templates/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapEmailTemplateData(response.data);
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

export const saveUpdateEmailTemplate = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/recruitment-email-templates/${id}/`
      : `${baseUrl}/recruitment-email-templates/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapEmailTemplatePayloadData(payload);
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

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

export const getOfferTrackingList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/offer-tracking/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapOfferTrackingList(ResponseData.results);
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

export const getOfferTrackingData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/offer-tracking/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const ResponseData = mapOfferTrackingData(Response);
      const OfferLetterData = await getOfferLetterData(Response.offer_letter);
      return { ...(OfferLetterData || {}), ...ResponseData };
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const saveUpdateOfferTracking = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/offer-tracking/${id}/`
      : `${baseUrl}/offer-tracking/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapOfferTrackingPayloadData(payload);
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
    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};
export const UpdateOfferTrackingStatus = async (payload, id) => {
  try {
    if (!id) return false
    const url = `${baseUrl}/offer-tracking/${id}/change_status/`
    const method = "POST"; // Determine method based on existence of id
    const expectedStatus = 200;
    const finalPayload = mapOfferTrackingPayloadData(payload);
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
    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};
export const getOfferLetterTemplateList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/recruitment-offer-letter-templates/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapOfferLetterTemplateList(ResponseData.results);
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

export const getOfferLetterTemplateData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment-offer-letter-templates/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapOfferLetterTemplateData(response.data);
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

export const saveUpdateOfferLetterTemplate = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/recruitment-offer-letter-templates/${id}/`
      : `${baseUrl}/recruitment-offer-letter-templates/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapOfferLetterTemplatePayloadData(payload);
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
    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

export const getOfferLetterList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/recruitment-offer-letters/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapOfferLetterList(ResponseData.results);
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

export const getOfferLetterData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment-offer-letters/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const currentapprover = await getCurrentRequestApprover(Response.request);
      const ResponseData = await mapOfferLetterData({ ...Response, ...currentapprover, }, true);
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

export const saveUpdateOfferLetter = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/recruitment-offer-letters/${id}/`
      : `${baseUrl}/recruitment-offer-letters/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapOfferLetterPayloadData(payload);
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
    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

export const getInterviewFeedbackList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/interview-feedbacks/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapInterviewFeedbackList(ResponseData.results);
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

export const getInterviewFeedbackData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/interview-feedbacks/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapInterviewFeedbackData(response.data);
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

export const saveUpdateInterviewFeedback = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/interview-feedbacks/${id}/`
      : `${baseUrl}/interview-feedbacks/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapInterviewFeedbackPayloadData(payload);
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
    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};


export const getBlacklistReasonList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/recruitment-blacklist-reasons/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapBlacklistReasonList(ResponseData.results);
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

export const getBlacklistReasonData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment-blacklist-reasons/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapBlacklistReasonData(response.data);
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

export const saveUpdateBlacklistReason = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/recruitment-blacklist-reasons/${id}/`
      : `${baseUrl}/recruitment-blacklist-reasons/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapBlacklistReasonPayloadData(payload);
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

    return false;
  } catch (error) {
    console.error("API error in saveUpdate:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};
