import axios from "axios";
import { HandleLogout, baseUrl, headers, getCurrentRequestApprover } from "./general";
import moment from "moment";
import { renderErrorMessages } from "utils/renderErrors";


export const getEvaluationFormsList = async (payload) => {
    const pageNo = payload?.options?.page ?? "";
    const pageSize = payload?.options?.sizePerPage ?? "";
    const filterData = payload?.filterData ?? {};
    const sortField = payload?.ordering || "id";
    let URL = `/evaluation-forms/?ordering=${sortField}&${pageNo ? `page=${pageNo}&` : ""
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