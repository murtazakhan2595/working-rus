import axios from "axios";
import { initialState } from "state/slices/UserSlice";
import { JobDetail } from "app/utils/Types/Recruitment.jsx";
import { handleLogout } from "./general";
import { toast } from "react-toastify";

const baseUrl = initialState.baseUrl;
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
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
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const fetchJobById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/recruitment/${id}`);
    console.log("FETCH JOBS", response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    return JobDetail;
  }
};

const getJobApplications = async (payload) => {
  const { options, filterData } = payload;
  try {
    const URL = `/candidateall/?ordering=-updated_at&page=${
      options.page
    }&page_size=${options.sizePerPage}&search=${encodeURIComponent(
      JSON.stringify(filterData)
    )}`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    if (response.status === 200) {
      const applicationsResponse = response.data;
      const applicationsData = {
        count: applicationsResponse.count,
        results: applicationsResponse.results.candidate,
        total_count: applicationsResponse.results.total_count,
        shortlisted_application:
          applicationsResponse.results.shortlisted_application,
        rejected_application: applicationsResponse.results.rejected_application,
        selected_application: applicationsResponse.results.selected_application,
      };
      if (filterData.job_id) {
        const jobPosts = await fetchJobPosts({ id: filterData.job_id });
        applicationsData.total_count = jobPosts.results[0]?.total_applications;
        applicationsData.shortlisted_application =
          jobPosts.results[0]?.shortlisted_count;
        applicationsData.selected_application =
          jobPosts.results[0]?.selected_count;
        applicationsData.rejected_application =
          jobPosts.results[0]?.rejected_count;
      }

      return applicationsData;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
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
        // cv: selectedApplicant.cv,
        job_id: selectedApplicant.job_id,
        reason: selectedApplicant?.reason
      },
      {
        headers: headers(),
      }
    );
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
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
    if (error?.response?.status === 401) {
      handleLogout();
    }
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
    if (error?.response?.status === 401) {
      handleLogout();
    }
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
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding job:", error);
    return false;
  }
};

const getNewJobCode = async () => {
  try {
    const response = await axios.get(`${baseUrl}/lastrecruitment/`, {
      headers: headers(),
    });
    const id = response.data?.serial_number;
    return Number(id) + 1;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return "";
};

export const addApplication = async (values) => {
  console.log(values, "VALUES")
  try {
    const response = await axios.post(`${baseUrl}/candidate/`, values,         {
      headers: formDataHeader(),
    });
    return response;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
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
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error adding job:", error);
    throw error;
  }
};


const getJobApplicants = async () => {
  try {
    console.log("calling")
    const URL = `/candidateall/?ordering=updated_at`;
    const response = await axios.get(`${baseUrl}${URL}`, {
      headers: headers(),
    });
    const jobPosts = await fetchJobPosts();
    if (response.data && jobPosts) {
      const jobMap = jobPosts.results.reduce((map, job) => {
        map[job.id] = job.Job_Title;
        return map;
      }, {});

      // Map candidates to jobs
      const mappedResults = response.data.results.candidate
        .filter((candidate) =>
          ["contacted", "shortlisted", "offer_made"].includes(
            candidate.application_status
          )
        )
        .map((candidate) => {
          return {
            id: candidate.id,
            full_name: `${candidate.first_name} ${candidate.last_name}`,
            application_status: candidate.application_status,
            job_id: candidate.job_id,
            job_title: jobMap[candidate.job_id],
          };
        });
      return mappedResults
    }
    else{
      return false
    }
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return false;
  }
};


export const deleteJob = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/recruitment/${id}`, {
      headers: headers(),
    });
    console.log(response, "DELETE RESPONSE")
    if (response.status === 204) {
      toast.success("Job Deleted Successfully!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return response;
    }
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    } else {
      toast.error("Failed to delete the job", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.error('Error deleting job:', error);
    }
  }
};

export { getJobApplications, getNewJobCode, getJobApplicants };
