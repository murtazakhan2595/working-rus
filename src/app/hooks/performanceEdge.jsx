import axios from "axios";
import { HandleLogout, baseUrl, headers, getCurrentRequestApprover } from "./general";
import moment from "moment";
import { renderErrorMessages } from "utils/renderErrors";
import { mapEvaluationPayloadData } from 'app/utils/MappingObjects/mapPerformanceEdgeData'


export const getEvaluationFormsList = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  const sortField = payload?.ordering || "id";
  let URL = `/evaluation-forms/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}`;
  // let URL = `/evaluation-forms/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
  //   }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
  //     JSON.stringify(filterData)
  //   )}`;

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

export const saveEvaluationForm = async (payload, id) => {
  const ID = id || payload?.id;
  try {
    const finalPayload = mapEvaluationPayloadData(payload);

    const url = ID
      ? `${baseUrl}/evaluation-forms/${ID}/` // Use id if updating
      : `${baseUrl}/evaluation-forms/`; // No id means create new

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