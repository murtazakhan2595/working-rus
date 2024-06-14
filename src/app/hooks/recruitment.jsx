import axios from 'axios';

const headers = (token) => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });

export const fetchJobPosts = async (baseUrl, token, status) => {
  let searchStatus = '';
  if (status === 'Open') {
    searchStatus = 'live';
  } else if (status === 'Closed') {
    searchStatus = 'expired';
  }

  try {
    const response = await axios.get(
      `${baseUrl}/recruitment/?search=${encodeURIComponent(
        JSON.stringify({ status: searchStatus })
      )}`,
      {
        headers: headers(token),
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};



export const fetchJobById = async (baseUrl, id, token) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment/${id}`, {
      headers: headers(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw error;
  }
};

export const fetchApplicants = async (baseUrl, id, applicationStatus, token) => {
  try {
    const response = await axios.get(
      `${baseUrl}/candidateall/?search=${encodeURIComponent(
        `{"application_status": "${applicationStatus}", "job_id": ${id}}`
      )}`,
      {
        headers: headers(token),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching applicants:", error);
    throw error;
  }
};

export const updateApplicationStatus = async (
  baseUrl,
  selectedApplicant,
  option,
  token
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
        headers: headers(token),
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
      const response = await axios.post(`${baseUrl}/recruitment/`, values,  {
        headers: headers(token),
      });
      return response;
    } catch (error) {
      console.error("Error adding job:", error);
      throw error;
    }
  };
