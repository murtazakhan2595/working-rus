import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { handleLogout } from "./general";
import moment from "moment";
const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


const getDtr = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  let URL = `/dtr?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
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
    console.error("Error fetching dtr list:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
};


export { getDtr };