import axios from "axios";
import { initialState } from "state/slices/UserSlice";

const baseUrl = initialState.baseUrl;

const formDataHeader = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

// post request for job rotation
export const PostJobRotation = async (payload) => {
  console.log(`${baseUrl}/job-rotation-requests/`);
  try {
    const api = await axios.post(`${baseUrl}/job-rotation-requests/`, payload, {
      headers: formDataHeader(),
    });
    if (api.status === 201) {
      console.log("Job rotation request posted successfully:", api.data);
      return api.data;
    }
  } catch (error) {
    console.error("Error posting job rotation:", error);
    throw error;
  }
};

export const GetJobRotation = async (id) => {
  try {
    const api = await axios.get(`${baseUrl}/job-rotation-requests/`,{
      headers: formDataHeader(),
    });
    console.log(api.data.results)
    return api.data ;
  } catch (error) {
    console.log(error);
  }
};
