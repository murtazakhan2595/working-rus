import axios from "axios";
import { initialState } from "state/slices/UserSlice";
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

const getAssetList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.options?.sortField ?? "id";
  const sortOrder = payload?.options?.sortOrder ?? "desc";
  let URL = `/asset_management?ordering=${
    sortOrder === "desc" ? "-" : ""
  }${sortField}&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching asset list:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getLocations = async () => {
  try {
    const response = await axios.get(`${baseUrl}/location/`, {
      headers: headers(),
    });
    if (response.status === 200) {
      // Transform the data for use in a dropdown
      const locations = response.data.results.map((location) => ({
        value: location.id,
        label: location.name,
      }));
      return locations;
    }
  } catch (error) {
    console.error("Error fetching locations:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return [];
  }
};

const uploadAttachment = async (formData) => {
  try {
    // formData should already be a FormData object with the file
    const response = await axios({
      method: "POST",
      url: `${baseUrl}/asset_attachment/`,
      data: formData,
      headers: formDataHeader(),
    });

    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.error("Error uploading attachment:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    throw error;
  }
};
const addAsset = async (payload, id = null) => {
  try {
    const requestData = {
      asset_name: payload.asset_name,
      asset_type_id: payload.asset_type_id,
      asset_purchase_date: payload.asset_purchase_date,
      asset_purchase_price: payload.asset_purchase_price,
      asset_notes: payload.asset_notes,
      asset_warranty: payload.asset_warranty,
      asset_warranty_expiry: payload.asset_warranty_expiry,
      asset_initial_condition: payload.asset_initial_condition,
      asset_location: payload.asset_location,
      attachment: payload.attachment, // Array of attachment IDs
      dynamic_field_values: payload.dynamic_field_values,
    };

    if (payload.id) {
      requestData.id = payload.id;
    }

    const url = id
      ? `${baseUrl}/asset_management/${id}/`
      : `${baseUrl}/asset_management/`;

    const method = id ? "PUT" : "POST";

    const response = await axios({
      method,
      url,
      data: requestData,
      headers: headers(),
    });

    if (response.status === 201 || response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error saving asset:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    throw error;
  }
};
const deleteAsset = async (assetId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/asset_management/${assetId}/`,
      {
        headers: headers(),
      }
    );
    return response.status === 204;
  } catch (error) {
    console.error("Error deleting asset:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getAssetById = async (assetId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/asset_management/${assetId}/`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching asset details:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const requestAsset= async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/asset_assignment/${payload.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      // If no ID, use POST to create a new asset request
      const response = await axios.post(
        `${baseUrl}/asset_assignment/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    }
    return false;
  } catch (error) {
    console.error("Error updating asset request:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const getEmployeeAssets = async (payload) => {
   const pageNo = payload?.options?.page ?? "";
   const pageSize = payload?.options?.sizePerPage ?? "";
   const filterData = payload?.filterData ?? {};
   const sortField = payload?.options?.sortField ?? "created_at";
   const sortOrder = payload?.options?.sortOrder ?? "desc";
   let URL = `/asset_assignment?ordering=${
     sortOrder === "desc" ? "-" : ""
   }${sortField}&${pageNo ? `page=${pageNo}&` : ""}${
     pageSize ? `page_size=${pageSize}&` : ""
   }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching employee assets:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}
const getAssetCategories = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  let URL = `/asset-categories?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching asset categories:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const addAssetCategory = async (payload) => {
  try {
    if (payload.id) {
      const response = await axios.put(
        `${baseUrl}/asset-categories/${payload.id}/`,
        payload,
        { headers: headers() }
      );
      return response.status === 200 ? response.data : false;
    } else {
      const response = await axios.post(
        `${baseUrl}/asset-categories/`,
        payload,
        { headers: headers() }
      );
      return response.status === 201 ? response.data : false;
    }
  } catch (error) {
    console.error("Error saving asset category:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};

const deleteAssetCategory = async (categoryId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/asset-categories/${categoryId}/`,
      { headers: headers() }
    );
    return response.status === 204;
  } catch (error) {
    console.error("Error deleting asset category:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
};
export {
  getAssetList,
  addAsset,
  deleteAsset,
  getAssetById,
  uploadAttachment,
  getLocations,
  requestAsset,
  getEmployeeAssets,
  getAssetCategories,
  addAssetCategory,
  deleteAssetCategory,
};
