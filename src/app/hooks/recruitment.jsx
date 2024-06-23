import axios from "axios";
import { initialState } from "../../state/slices/UserSlice";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});


export const fetchJobPosts = async (filterData) => {
 
  try {
    const response = await axios.get(
      `${baseUrl}/recruitment/?search=${encodeURIComponent(
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

export const fetchJobById = async (baseUrl, id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
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

export const updateApplicationStatus = async (
  selectedApplicant,
  option,
) => {
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
  console.log("I am id from recruitment.jsx", id);
  console.log("i am values from recruitment.jsx", values);

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

export { getJobApplications };
