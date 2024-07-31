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
    return response.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    return JobDetail;
  }
};

const getJobApplications = async (payload={}) => {
  const { options, filterData } = payload;
  console.log("calling getJobApplications", payload);
  try {
    let URL = `/candidateall/?ordering=-updated_at`;

    if (options) {
      URL += `&page=${options.page}&page_size=${options.sizePerPage}`;
    }

    if (filterData) {
      URL += `&search=${encodeURIComponent(JSON.stringify(filterData))}`;
    }

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
      if (filterData?.job_id) {
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
        cv: selectedApplicant.cv,
        job_id: selectedApplicant.job_id,
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
    const id = response.data?.id;
    return id + 1;
  } catch (error) {
    if (error?.response?.status === 401) {
      handleLogout();
    }
    console.error("Error fetching data:", error);
  }
  return "";
};

export const addApplication = async (values) => {
  try {
    const response = await axios.post(`${baseUrl}/candidate/`, values, {
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
    const response = await getJobApplications();
    const jobPosts = await fetchJobPosts();
    console.log("INGO",response, jobPosts)
    if (response && jobPosts) {
      const jobMap = jobPosts.results.reduce((map, job) => {
        map[job.id] = job.Job_Title;
        return map;
      }, {});

      // Map candidates to jobs
      const mappedResults = response.results.candidate
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

export { getJobApplications, getNewJobCode, getJobApplicants };
