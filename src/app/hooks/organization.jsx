import React from 'react'
import axios from 'axios';
import { initialState } from "state/slices/UserSlice";
import { handleLogout } from "./general";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getOrganizationData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/organization/`, {
        headers: headers(),
      });
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        handleLogout();
      }
      console.error("Error fetching data:", error);
    }
    return 0;
  };


  export {
    getOrganizationData,
  }