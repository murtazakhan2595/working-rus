import axios from "axios";
import { HandleLogout, baseUrl, headers, formDataHeader } from "./general";
import {
  mapGraceTimeList,
  mapGraceTimeData,
  mapGraceTimePayloadData,
  mapEvaluationTypeList,
  mapEvaluationTypeData,
  mapEvaluationTypePayloadData,
  mapRatingScaleSetupList,
  mapRatingScaleSetupData,
  mapRatingScaleSetupPayloadData,
  mapRatingScaleValuePayloadData,
} from "app/utils/MappingObjects/mapOfficeSettingData";
import { renderErrorMessages } from "utils/renderErrors";

const saveOrganization = async (id, payload) => {
  try {
    if (id) {
      const response = await axios.patch(
        `${baseUrl}/organization/${id}`,
        payload,
        {
          headers: formDataHeader(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      const response = await axios.post(`${baseUrl}/organization/`, payload, {
        headers: formDataHeader(),
      });
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error saving organization:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const deleteOrganization = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/organization/${id}`, {
      headers: headers(),
    });
    if (response.status === 200 || response.status === 204) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting organization:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getOrganizationCountryList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/countries/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting country list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const getRegionsList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/regions?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${pageSize ? `page_size=${pageSize}&` : ""
    }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting regions list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};
const getCitiesList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/cities?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${pageSize ? `page_size=${pageSize}&` : ""
    }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting cities list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const getRegionById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/regions/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting region by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const getCityById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/cities/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting city by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const getCountryById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/countries/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting country by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const getOrganizationTree = async () => {
  try {
    const response = await axios.get(`${baseUrl}/organizationtree`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting organization tree:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const getEmployeeReportingLine = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/api/team-hierarchy/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting employee reporting line:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const saveOnboardingDocument = async (id, payload) => {
  try {
    if (id) {
      const response = await axios.patch(
        `${baseUrl}/onboardingdoc/${id}`,
        payload,
        {
          headers: formDataHeader(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      const response = await axios.post(`${baseUrl}/onboardingdoc/`, payload, {
        headers: formDataHeader(),
      });
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error saving onboarding document:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const deleteOnboardingDocument = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/onboardingdoc/${id}`, {
      headers: headers(),
    });
    if (response.status === 200 || response.status === 204) {
      return true;
    }
  } catch (error) {
    console.error("Error deleting onboarding document:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};
const getOnboardingDocument = async (payload) => {
  try {
    const pageNo = payload?.options?.page ?? "";
    const ordering = payload?.ordering ?? "-id";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    const URL = `/onboardingdoc/?ordering=${ordering}&${pageNo ? `page=${pageNo}&` : ""
      }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
        JSON.stringify(filterData)
      )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting onboarding document:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};
const getOnboardingDocumentById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/onboardingdoc/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting onboarding document by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

export const getGraceTimeList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/grace-times/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapGraceTimeList(ResponseData.results);
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

export const getGraceTimeData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/grace-times/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapGraceTimeData(response.data);
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

export const saveUpdateGraceTime = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/grace-times/${id}/`
      : `${baseUrl}/grace-times/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapGraceTimePayloadData(payload);
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


export const getClearanceChecklistList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/clearance-checklists/?${ordering ? `ordering=${ordering}&` : ""
    }${pageNo ? `page=${pageNo}&` : ""}${pageSize ? `page_size=${pageSize}&` : ""
    }search=${encodeURIComponent(JSON.stringify(filterData))}`;

  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting clearance checklist list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export const getClearanceChecklistData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/clearance-checklists/${id}/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting clearance checklist by id:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};



export const saveUpdateClearanceChecklist = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/clearance-checklists/${id}/`
      : `${baseUrl}/clearance-checklists/`;

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
    console.warn(
      "API call succeeded but with unexpected status code:",
      response.status
    );
    return false;
  } catch (error) {
    console.error("API error in saveUpdateClearanceChecklist:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

export const getClearanceTypeList = async () => {
  try {
    const response = await axios.get(`${baseUrl}/clearance-types/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error getting clearance types:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const updateClearanceType = async (id, payload) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/clearance-types/${id}/`,
      payload,
      { headers: headers() }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error updating clearance type:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    renderErrorMessages(error?.response?.data);
    return false;
  }
};

export const getEvaluationTypeList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/evaluation-types/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapEvaluationTypeList(ResponseData.results);
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

export const getEvaluationTypeData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/evaluation-types/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = mapEvaluationTypeData(response.data);
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

export const saveUpdateEvaluationType = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/evaluation-types/${id}/`
      : `${baseUrl}/evaluation-types/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapEvaluationTypePayloadData(payload);
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

export const getRatingScaleSetupList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/RatingScale/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      const ResponseDataList = await mapRatingScaleSetupList(ResponseData.results);
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

export const getRatingScaleSetupData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/RatingScale/${id}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const Response = response.data;
      const RatingValues = await getRatingScaleValueList({ filterData: { rating_scale: Response.id } });
      const ResponseData = mapRatingScaleSetupData({ ...Response, rating_values: RatingValues.results });
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

export const saveUpdateRatingScaleSetup = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/RatingScale/${id}/`
      : `${baseUrl}/RatingScale/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapRatingScaleSetupPayloadData(payload);
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

export const saveUpdateRatingScaleValue = async (payload, id) => {
  try {
    const url = id
      ? `${baseUrl}/RatingValue/${id}/`
      : `${baseUrl}/RatingValue/`;

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = id ? 200 : 201;
    const finalPayload = mapRatingScaleValuePayloadData(payload);
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

export const getRatingScaleValueList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "id";
  const URL = `/RatingValue/?${ordering ? `ordering=${ordering}&` : ""}${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const ResponseData = response.data;
      // const ResponseDataList = await mapRatingScaleSetupList(ResponseData.results);
      // return { results: ResponseDataList, count: ResponseData.count };
      return ResponseData;
    }
  } catch (error) {
    console.error("Error getting regions list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return {};
  }
};

export {
  saveOrganization,
  deleteOrganization,
  getOrganizationCountryList,
  getRegionsList,
  getCitiesList,
  getRegionById,
  getCityById,
  getCountryById,
  getOrganizationTree,
  getEmployeeReportingLine,
  saveOnboardingDocument,
  deleteOnboardingDocument,
  getOnboardingDocument,
  getOnboardingDocumentById,
  updateClearanceType,
};
