import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import { getFormattedDropdownItems } from "utils/Lists";
import { EmployeeListData } from "app/utils/Types/General";
import {
  mapDocumentAssignedData,
  mapDocumentCategoryPayloadData,
  mapDocumentPayloadData,
  mapDocumentAssignmentPayloadData,
  mapDocumentCategoryData,
  mapDocumentData,
} from "app/utils/MappingObjects/mapHRDocumentData";
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

export const getDocumentList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const ordering = payload?.ordering ?? "-id";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/document/?ordering=${ordering}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const employeeTransferDataResponse = response.data;
      const HRDocumentData = {
        count: employeeTransferDataResponse.count,
        results: employeeTransferDataResponse.results,
      };
      return HRDocumentData;
    } else return { results: [], count: 0 };
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return { results: [], count: 0 };
};

export const getDocumentAssignmentList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const ordering = payload?.ordering ?? "-id";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/document-assignments/?ordering=${ordering}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const documentAssignmentsDataResponse = response.data;
      const documentAssignmentsData = {
        count: documentAssignmentsDataResponse.count,
        results: documentAssignmentsDataResponse.results,
      };
      return documentAssignmentsData;
    } else return { results: [], count: 0 };
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return { results: [], count: 0 };
};

export const getDocumentAssignmentData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/document-assignments/${id}`, {
      headers: headers(),
    });
    const HRDocumentData = mapDocumentAssignedData(response.data);
    return HRDocumentData;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return 0;
};

export const getEmployeeTransferStats = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const ordering = payload?.ordering ?? "-id";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/employee-transfer/stats/?search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    } else return {};
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return {};
};

export const getHRDocumentData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/document/${id}`, {
      headers: headers(),
    });
    const HRDocumentData = mapDocumentData(response.data);
    return HRDocumentData;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return null;
};

export const addUpdateDocumentAssignment = async (payload, id = null) => {
  try {
    const endPoint =
      payload.target_audience === "Department"
        ? "assign_to_department/"
        : payload.target_audience === "Specific Employee"
        ? "assign_to_employee/"
        : payload.target_audience === "All Employees"
        ? "assign_to_organization/"
        : "";

    const finalPayload = mapDocumentAssignmentPayloadData(payload);
    const url = id
      ? `${baseUrl}/document-assignments/${endPoint}${id}/` // Use id if updating
      : `${baseUrl}/document-assignments/${endPoint}`; // No id means create new

    const method = id ? "PATCH" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: formDataHeader(),
    });

    // Check response status
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // Handle errors
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error adding/updating LogTime:", error);
    return false;
  }
};

export const addUpdateHRDocumentDetails = async (payload, id = 16) => {
  try {
    const finalPayload = mapDocumentPayloadData(payload);
    const url = id
      ? `${baseUrl}/document/${id}` // Use id if updating
      : `${baseUrl}/document/`; // No id means create new

    const method = id ? "PUT" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: formDataHeader(),
    });

    // Check response status
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // Handle errors
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error adding/updating LogTime:", error);
    return false;
  }
};

// Document Category

export const getDocumentCategoryList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const ordering = payload?.ordering ?? "-id";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/documentcategory/?ordering=${ordering}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const documentCategoryDataResponse = response.data;
      const documentCategoryData = {
        count: documentCategoryDataResponse.count,
        results: getFormattedDropdownItems(
          documentCategoryDataResponse.results
        ),
      };
      return documentCategoryData;
    } else return { results: [], count: 0 };
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return { results: [], count: 0 };
};

export const getDocumentCategoryData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/documentcategory/${id}`, {
      headers: headers(),
    });
    const documentCategoryData = mapDocumentCategoryData(response.data);
    return documentCategoryData;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return 0;
};

export const addUpdateDocumentcategory = async (payload, id = null) => {
  try {
    const finalPayload = mapDocumentCategoryPayloadData(payload);

    const url = id
      ? `${baseUrl}/documentcategory/${id}` // Use id if updating
      : `${baseUrl}/documentcategory/`; // No id means create new

    const method = id ? "PUT" : "POST"; // Determine method based on existence of id

    const response = await axios({
      method,
      url,
      data: finalPayload,
      headers: headers(),
    });

    // Check response status
    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    // Handle errors
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error adding/updating LogTime:", error);
    return false;
  }
};


export const getLetterRequestData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/letterrequest/${id}`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching letter request data:", error);
  }
  return null;
};

// Update existing function to use formDataHeader for file uploads
export const addUpdateLetterRequest = async (payload, id = null) => {
  try {
    const url = id
      ? `${baseUrl}/letterrequest/${id}`
      : `${baseUrl}/letterrequest/`;

    const method = id ? "PATCH" : "POST";

    const response = await axios({
      method,
      url,
      data: payload,
      headers: formDataHeader(), // Changed from headers() to handle file uploads
    });

    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error adding/updating Letter Request:", error);
    return false;
  }
};

export const getLetterRequestList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const ordering = payload?.ordering ?? "-id";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/letterrequest/?ordering=${ordering}&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
    JSON.stringify(filterData)
  )}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data
    } else return { results: [], count: 0 };
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Letter Request data :", error);
  }
  return { results: [], count: 0 };
};
