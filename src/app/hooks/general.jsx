import axios from "axios";
import { toast } from "react-toastify";

const getDepartmentList = async (baseUrl, headers) => {
    try {
        const response = await axios.get(`${baseUrl}/department/`, {
            headers,
        })
        if (response.status === 200)
            return response.data;
        else
            return []
    } catch (error) {
        console.error("Error fetching Personal Info data :", error);
    }
    return [];
}
const getDesignationList = async (baseUrl, headers) => {
    try {
        const response = await axios.get(`${baseUrl}/designation/`, {
            headers,
        })
        if (response.status === 200)
            return response.data;
        else
            return []
    } catch (error) {
        console.error("Error fetching Personal Info data :", error);
    }
    return [];
}

const getManagersList = async (baseUrl, headers) => {
    try {
        const response = await axios.get(`${baseUrl}/emplistofmanager/`, {
            headers,
        })
        if (response.status === 200)
            return response.data;
        else
            return []
    } catch (error) {
        console.error("Error fetching Personal Info data :", error);
    }
    return [];
}

const getList = async (URL, headers) => {
    try {
        const response = await axios.get(URL, { headers, })
        if (response.status === 200)
            return response.data;
        else
            return []
    } catch (error) {
        console.error("Error fetching Personal Info data :", error);
    }
    return [];
}

const deleteRecord = async (URL, headers, recordName) => {
    try {
        const response = await axios.delete(URL, { headers });
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