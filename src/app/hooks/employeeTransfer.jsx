import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import { setUserLogout } from "state/actions/UserAction";
import { EmployeeListData } from "app/utils/Types/General";

import {
  mapEmployeeTransferData,
  mapEmployeeTransferPayloadData,
} from "app/utils/MappingObjects/mapEmployeeTransferData";
import { HandleLogout } from "./general";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const getEmployeeTransferList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const ordering = payload?.ordering ?? "-id";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/employeetranfer/?ordering=${ordering}&${
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
      const employeeTransferData = {
        count: employeeTransferDataResponse.count,
        results: employeeTransferDataResponse.results,
      };
      return employeeTransferData;
    } else return { results: [], count: 0 };
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
  }
  return { results: [], count: 0 };
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

export const getEmployeeTransferData = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/employeetranfer/${id}`, {
      headers: headers(),
    });
    const employeeTransferData = mapEmployeeTransferData(response.data);
    return employeeTransferData;
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return 0;
};

export const addUpdateEmpTransferDetails = async (payload, id = null) => {
  try {
    const finalPayload = mapEmployeeTransferPayloadData(payload);

    const url = id
      ? `${baseUrl}/employeetranfer/${id}` // Use id if updating
      : `${baseUrl}/employeetranfer/`; // No id means create new

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
