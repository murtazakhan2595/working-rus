import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import {
  mapApprovalHierarchyListData,
  mapApprovalHierarchyPayloadData,
  mapApprovalHierarchyData,
  mapApprovalHierarchyHistoryLogsListData,
  mapHierarchyLevelData,
  mapDelegateLevelPayloadData,
  mapDelegateLevelListData,
  mapDelegateLevelData,
} from "app/utils/MappingObjects/mapApprovalHierarchy";
import { HandleLogout } from "./general";
import { renderErrorMessages } from "utils/renderErrors";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

// Get hierarchy list
export const getApprovalHierarchyList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";
  try {
    const URL = `/hierarchies/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const hierarchyResponse = response.data;
      const hierarchyList = await mapApprovalHierarchyListData(
        hierarchyResponse?.results
      );
      return { results: hierarchyList, count: hierarchyResponse.count };
    } else return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching hierarchy data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

export const saveUpdateApprovalHierarchy = async (payload, hierarchyID) => {
  try {
    const url = hierarchyID
      ? `${baseUrl}/hierarchies/${hierarchyID}/`
      : `${baseUrl}/hierarchies/`;

    const method = hierarchyID ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = hierarchyID ? 200 : 201;
    const finalPayload = await mapApprovalHierarchyPayloadData(payload);
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
    console.error("API error in saveUpdateApprovalHierarchy:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

export const getApprovalHierarchyData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/hierarchies/${id}`, {
      headers: headers(),
    });
    const ApprovalHierarchyData = await mapApprovalHierarchyData(response.data);

    return ApprovalHierarchyData;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return {};
};

export const getApprovalHierarchyHistoryLogsList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "-id";
  try {
    const URL = `/logs/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const hierarchyResponse = response.data;
      const hierarchyList = await mapApprovalHierarchyHistoryLogsListData(
        hierarchyResponse?.results
      );
      return { results: hierarchyList, count: hierarchyResponse.count };
    } else return { results: [], count: 0 };
  } catch (error) {
    console.error("Error fetching hierarchy data:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return { results: [], count: 0 };
  }
};

export const getHierarchyLevelData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/levels/${id}`, {
      headers: headers(),
    });
    const HierarchyLevelData = mapHierarchyLevelData(response.data);

    return HierarchyLevelData;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return {};
};

export const saveUpdateDelegateLevel = async (payload, delegateID) => {
  try {
    const url = delegateID
      ? `${baseUrl}/delegations/${delegateID}/`
      : `${baseUrl}/delegations/`;

    const method = delegateID ? "PATCH" : "POST"; // Determine method based on existence of id
    const expectedStatus = delegateID ? 200 : 201;
    const finalPayload = mapDelegateLevelPayloadData(payload);
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
    console.error("API error in saveUpdatedelegatelevel:", error);
    if (error?.response?.status === 401) {
      HandleLogout(); // Assuming this logs out the user properly
    }
    renderErrorMessages(error?.response?.data);
    return false; // To be caught and handled in UI/component
  }
};

export const getDelegationList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "order";
  try {
    const URL = `/delegations/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const delegationResponse = response.data;
      const delegationList = await mapDelegateLevelListData(
        delegationResponse?.results
      );
      return { results: delegationList, count: delegationResponse.count };
    } else return [];
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};

export const getDelegateLevelData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/delegations/${id}`, {
      headers: headers(),
    });
    const DelegateLevelData = mapDelegateLevelData(response.data);

    return DelegateLevelData;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return {};
};
