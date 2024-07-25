import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { JobDetail } from "app/utils/Types/Recruitment.jsx";
import { handleLogout } from "./general";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

export const fetchJobPosts = async (filterData, sortData) => {
  filterData = filterData ?? {};
  sortData = sortData && sortData === "dsc" ? "-updated_at" : "updated_at";
  try {
    const response = await axios.get(
      `${baseUrl}/recruitment/?ordering=${sortData}&search=${encodeURIComponent(
        JSON.stringify(filterData)
      )}`,
      {
        headers: headers(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const fetchJobById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    return JobDetail;
  }
};

const getJobApplications = async (URL) => {
  try {
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return false;
  }
};

export const updateApplicationStatus = async (selectedApplicant, option) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/candidate/${selectedApplicant.id}`,
      {
        application_status: option,
        first_name: selectedApplicant.first_name,
        last_name: selectedApplicant.last_name,
        phone_number: selectedApplicant.phone_number,
        email: selectedApplicant.email,
        cv: selectedApplicant.cv,
        job_id: selectedApplicant.job_id,
      },
      {
        headers: headers(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};

export const downloadCV = async (cv, name) => {
  try {
    const response = await axios.get(cv, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name}_cv.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error fetching CV:", error);
    throw error;
  }
};

export const addJob = async (baseUrl, values, token) => {
  try {
    const response = await axios.post(`${baseUrl}/recruitment/`, values, {
      headers: headers(),
    });
    return response;
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};
export const getJobById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment/${id}`, {
      headers: headers(),
    });
    return response.data;
  } catch (error) {
    console.error("Error adding job:", error);
    return false;
  }
};

const getNewJobCode = async () => {
  try {
    const response = await axios.get(`${baseUrl}/lastrecruitment/`, {
      headers: headers(),
    });
    const id = response.data?.id;
    return id + 1;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return '';
};

export const addApplication = async (values) => {
  try {
    const response = await axios.post(`${baseUrl}/candidate/`, values, {
      headers: headers(),
    });
    return response;
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};

export const updateJob = async (baseUrl, values, id) => {
  try {
    const response = await axios.patch(`${baseUrl}/recruitment/${values}`, id, {
      headers: headers(),
    });
    return response;
  } catch (error) {
    console.error("Error adding job:", error);
    throw error;
  }
};

export { getJobApplications ,getNewJobCode};
