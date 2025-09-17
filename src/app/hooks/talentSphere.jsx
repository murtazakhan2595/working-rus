import axios from "axios";
import { HandleLogout, baseUrl, headers, getCurrentRequestApprover } from "./general";
import moment from "moment";
import { renderErrorMessages } from "utils/renderErrors";
import { mapManpowerPayloadData, mapManpowerData } from "app/utils/MappingObjects/mapTalentSphere";

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
      return response.data;
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