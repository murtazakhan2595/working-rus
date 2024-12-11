import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { handleLogout } from "./general";
import moment from "moment";
const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});


const saveShiftAssignment = async (payload) => {
  try {
    if (payload?.id) {
      const response = await axios.patch(
        `${baseUrl}/shiftassignment/${payload.id}`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
    } else {
      const response = await axios.post(
        `${baseUrl}/shiftassignment/`,
        payload,
        {
          headers: headers(),
        }
      );
      if (response.status === 201 || response.status === 200) {
        return response.data;
      }
    }
  } catch (error) {
    console.error("Error saving shift assignment:", error);
    if (error?.response?.status === 401) {
      handleLogout();
    }
    return false;
  }
}

const getEmployeeList = async(payload) =>{
   const pageNo = payload?.options?.page ?? "";
   const pageSize = payload?.options?.sizePerPage ?? "";
   const filterData = payload?.filterData ?? {};

   let URL = `/customemp?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
     pageSize ? `page_size=${pageSize}&` : ""
   }search=${encodeURIComponent(JSON.stringify(filterData))}`;

   try{
      const response = await axios.get(`${baseUrl}${URL}`, {
        headers: headers(),
      });
      if(response.status === 200){
        return response.data;
      }
   }catch(error){
      console.error("Error fetching employee list:", error);
      if(error?.response?.status === 401){
        handleLogout();
      }
      return false;
   }
}

const getShift = async(payload) =>{
     const pageNo = payload?.options?.page ?? "";
     const pageSize = payload?.options?.sizePerPage ?? "";
     const filterData = payload?.filterData ?? {};
     let URL = `/shift?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
       pageSize ? `page_size=${pageSize}&` : ""
     }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try{
     const response = await axios.get(`${baseUrl}${URL}`, {
       headers: headers(),
     });
     if (response.status === 200) {
       return response.data;
     }
  }catch(error){
    console.error("Error fetching shift list:", error);
    if(error?.response?.status === 401){
      handleLogout();
    }
    return false;
  }
}

const getShiftAssignment = async(payload) =>{
  const pageNo = payload?.options?.page ?? "";
  const pageSize = payload?.options?.sizePerPage ?? "";
  const filterData = payload?.filterData ?? {};
  let URL = `/shiftassignment?ordering=-id&${pageNo ? `page=${pageNo}&` : ""}${
    pageSize ? `page_size=${pageSize}&` : ""
  }search=${encodeURIComponent(JSON.stringify(filterData))}`;
  try{
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      return response.data;
    }
  }catch(error){
    console.error("Error fetching shift assignment list:", error);
    if(error?.response?.status === 401){
      handleLogout();
    }
    return false;
  }
}

export { saveShiftAssignment, getEmployeeList, getShift ,getShiftAssignment};