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
  let URL = `/asset_management?ordering=-id&${
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

const uploadAttachment = async (file) => {
  try {

    const formData = new FormData();
    // Match the working pattern exactly
    formData.append("attachment", file);

    const response = await axios({
      method: "POST",
      url: `${baseUrl}/asset_attachment/`,
      data: formData,
      headers: formDataHeader(),
    });

    if (response.status === 201) {
      return response.data.id;
    }
  } catch (error) {
    console.error("Error uploading attachment:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    throw error;
  }
};
const addAsset = async (formValues) => {
  try {
    // Handle the attachment format coming from the existing component
    let attachmentIds = [];

    // Process existing attachments that already have IDs
    if (formValues.attachment) {
      // If attachment is an array, extract the IDs
      if (Array.isArray(formValues.attachment)) {
        attachmentIds = formValues.attachment
          .filter((att) => att && att.id) // Only include items with IDs
          .map((att) => att.id);
      }
    }

    // Process new files if they exist in the format provided by the component
    const newFiles = [];

    // Check if attachment is an array of objects with attachment property
    if (Array.isArray(formValues.attachment)) {
      formValues.attachment.forEach((item) => {
        if (item instanceof File) {
          newFiles.push(item);
        } else if (item && item.attachment instanceof File) {
          newFiles.push(item.attachment);
        }
      });
    }

    // Upload any new files
    if (newFiles.length > 0) {
      // Upload each new file and get back the IDs
      const uploadPromises = newFiles.map((file) => uploadAttachment(file));
      const newIds = await Promise.all(uploadPromises);
      attachmentIds = [...attachmentIds, ...newIds];
    }

    // Prepare payload directly using backend field names
    const payload = {
      asset_name: formValues.asset_name,
      asset_type: formValues.category,
      asset_description: formValues.specifications,
      asset_serial_number: formValues.serial_number,
      asset_purchase_date: formValues.purchase_date,
      asset_purchase_price: formValues.purchase_cost,
      asset_model: formValues.specifications, // Using specifications for model as well
      asset_notes: formValues.notes,
      asset_warranty: formValues.warranty_expiry ? "Yes" : "No",
      asset_warranty_expiry: formValues.warranty_expiry || null,
      asset_initial_condition: formValues.condition,
      asset_location: formValues.location?.value || formValues.location,
      attachment: attachmentIds,
    };

    if (formValues.id) {
      const response = await axios.put(
        `${baseUrl}/asset_management/${formValues.id}/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } else {
      const response = await axios.post(
        `${baseUrl}/asset_management/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error saving asset:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
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
      // If there's an ID, use PATCH to update the existing asset request
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

   let URL = `/asset_assignment?ordering=-created_at&${
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
    console.error("Error fetching employee assets:", error);
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    return false;
  }
}

export {
  getAssetList,
  addAsset,
  deleteAsset,
  getAssetById,
  uploadAttachment,
  getLocations,
  requestAsset,
  getEmployeeAssets,
};
