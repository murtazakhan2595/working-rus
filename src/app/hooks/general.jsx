import axios from "axios";

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

export {
    getDepartmentList,
    getManagersList,
    getDesignationList,
}