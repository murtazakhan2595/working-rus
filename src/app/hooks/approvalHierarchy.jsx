import axios from "axios";
import { toast } from "react-toastify";
import { deleteRole } from "./general";
import { initialState } from "state/slices/UserSlice";
import { mapModuleListData } from "app/utils/MappingObjects/mapRolesPermissionData";
import {
  mapApprovalHierarchyListData,
  mapApprovalHierarchyPayloadData,
  mapApprovalHierarchyData,
  mapApprovalHierarchyHistoryLogsListData
} from "app/utils/MappingObjects/mapApprovalHierarchy";

import { HandleLogout } from "./general";
import { renderErrorMessages } from "utils/renderErrors";
import { saveEmployeeWorkInformationData } from "./employee";
import { FilterTreeBySelectedLeafs } from "utils/Lists";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const getModuleList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const ordering = payload?.ordering ?? "order";
  try {
    const URL = `/modules/?ordering=${ordering}&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const moduleResponse = response.data;
      // const moduleList = await mapmoduleList(moduleResponse?.results);
      const moduleList = await mapModuleListData(moduleResponse?.results);
      return { results: moduleList, count: moduleResponse.count };
    } else return [];
  } catch (error) {
    console.error("Error fetching Personal Info data :", error);
  }
  return [];
};
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
    const finalPayload = mapApprovalHierarchyPayloadData(payload);
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
    const ApprovalHierarchyData = mapApprovalHierarchyData(response.data);

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
    return { results: [], count: 0 };
  }
};
