import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { handleLogout } from "./general";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const getEmployeePayroll = async (payload) => {
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  console.log("filterData", filterData);
  console.log("payload", payload);
  const URL = `/payroll/employee-payroll/?ordering=-id&${
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
    console.error("Error fetching payroll data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
};

const getEmployeePayrollById = async (id) => {
  try {
    const response = await axios.get(
      `${baseUrl}/payroll/employee-payroll/${id}`,
      {
        headers: headers(),
      }
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching payroll data:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return [];
  }
};
export { getEmployeePayroll, getEmployeePayrollById };
