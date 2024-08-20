import axios from "axios";
import { toast } from "react-toastify";
import { initialState } from "state/slices/UserSlice";
import { HandleLogout } from "./general";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getEmployeesResignations = async (payload) => {
  const filterData = payload?.filterData ?? {};
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  try {
    const URL = `/employeeExit?order=-created_at&${
      pageNo ? `page=${pageNo}&` : ""
    }${pageSize ? `page_size=${pageSize}&` : ""}search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const resignationData = response.data;
      return {
        count: resignationData.count,
        results: resignationData?.results?.result,
        total_exit: resignationData?.results?.total_exit,
        rejected_resignation: parseInt(resignationData?.results?.rejected_resignation)+parseInt(resignationData?.results?.rejected_termination),
        approved_resignation: parseInt(resignationData?.results?.approved_resignation)+parseInt(resignationData?.results?.approved_termination),

      };
    } else {
      return null;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }
    console.error("Error fetching Personal Info data :", error);
    return null;
  }
};
const saveEmployeeExitDetail = async (payload) => {
  try {
    if (payload?.id) {
      const URL = `${baseUrl}/employeeExit/${payload?.id}`;
      const response = await axios.patch(URL, payload, {
        headers: headers(),
      });
      if (response) {
        return response;
      }
    } else {
      const URL = `${baseUrl}/employeeExit`;
      const response = await axios.post(URL, payload, {
        headers: headers(),
      });
      if (response) {
        return response;
      }
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      HandleLogout();
    }

    console.error("Error fetching Personal Info data :", error);
    return false;
  }
};

export { getEmployeesResignations,saveEmployeeExitDetail };
