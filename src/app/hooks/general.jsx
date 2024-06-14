import axios from "axios";
import { toast } from "react-toastify"; 
import {initialState} from '../../state/slices/UserSlice';
import Cookies from "universal-cookie";

const baseUrl = initialState.baseUrl;
const cookies = new Cookies();
const token = cookies.get("token");
console.log(token)
const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
};

const getDepartmentList = async () => {
    try {
        const response = await axios.get(`${baseUrl}/department/`, {
            headers,
        })
        if (response.status === 200) {
            const departmentResponse = response.data;
            const departmentList = await departmentResponse.map(department => ({
                value: department.id,
                label: department.name,
            }));
            return departmentList;
        }
        else
            return []
    } catch (error) {
        console.error("Error fetching Personal Info data :", error);
    }
    return [];
}
const getDesignationList = async () => {
    try {
        const response = await axios.get(`${baseUrl}/designation/`, {
            headers,
        })
        if (response.status === 200) {
            const departmentResponse = response.data;
            const designationList = await departmentResponse.map(department => ({
                value: department.id,
                label: department.name,
            }));
            return designationList
        }
        else
            return []
    } catch (error) {
        console.error("Error fetching Personal Info data :", error);
    }
    return [];
}

const getManagersList = async () => {
    try {
        const response = await axios.get(`${baseUrl}/emplistofmanager/`, {
            headers,
        })
        if (response.status === 200) {
            const managerResponse = response.data;
            const managersList = managerResponse.map(manager => ({
                value: manager.id,
                label: manager.username,
            }))
            return managersList;
        }
        else
            return []
    } catch (error) {
        console.error("Error fetching Personal Info data :", error);
    }
    return [];
}

const getList = async (URL) => {
    try {
        const response = await axios.get(`${baseUrl}${URL}`, { headers, })
        if (response.status === 200)
            return response.data;
        else
            return []
    } catch (error) {
        console.error("Error fetching Personal Info data :", error);
    }
    return [];
}

const deleteRecord = async (URL, recordName) => {
    try {
        const response = await axios.delete(`${baseUrl}${URL}`, { headers });
        if (response.status === 204) {
            toast.success(`${recordName} deleted successfully`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            });
        } else {
            toast.error(`Unexpected response status: ${response.status}`);
        }
    } catch (error) {
        toast.error(error.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
        });
    } finally {
        return true;
    }
};

export {
    getDepartmentList,
    getManagersList,
    getDesignationList,
    getList,
    deleteRecord,
}