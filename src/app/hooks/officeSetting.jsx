import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { HandleLogout } from "./general";
import moment from "moment";
const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
});


const saveOrganization = async (id, payload) => {
  console.log(id, "ID")
  try {
    if (id) {
      const response = await axios.patch(
        `${baseUrl}/organization/${id}`,
        payload,
        {
          headers: formDataHeader()
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      const response = await axios.post(
        `${baseUrl}/organization/`,
        payload,
        {
          headers: formDataHeader(),
        }
      );
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
}

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
}

const getRegionsList = async (payload)=>{
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/regions?ordering=-id&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
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
    console.error("Error getting regions list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
}
 const getCitiesList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const URL = `/cities?ordering=-id&${
    pageNo ? `page=${pageNo}&` : ""
  }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
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
    console.error("Error getting cities list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
}

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
}

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
}

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
}

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
}
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
};