import axios from "axios";
import { initialState as userInitialState } from 'state/slices/UserSlice';

// Get baseUrl from user initial state
const baseUrl = userInitialState.baseUrl;

// Headers function for API requests
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

/**
 * Get all EOS settlements for a user
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} Array of settlement objects
 */
export const getEOSSettlements = async (params = {}) => {
  try {
    const response = await axios.get(`${baseUrl}/eos-settlements/`, {
      headers: headers(),
      params: params
    });
    
    if (response.data && response.data.results) {
      return response.data.results;
    }
    return [];
  } catch (error) {
    console.error("Error fetching EOS settlements:", error);
    throw error;
  }
};

/**
 * Get a specific EOS settlement by ID
 * @param {string|number} id - Settlement ID
 * @returns {Promise<Object>} Settlement object
 */
export const getEOSSettlementById = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/eos-settlements/${id}/`, {
      headers: headers()
    });
    
    if (response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching EOS settlement:", error);
    throw error;
  }
};

/**
 * Acknowledge an EOS settlement
 * @param {string|number} id - Settlement ID
 * @returns {Promise<Object>} Updated settlement object
 */
export const acknowledgeEOSSettlement = async (id) => {
  try {
    const response = await axios.post(`${baseUrl}/eos-settlements/${id}/acknowledge/`, {}, {
      headers: headers()
    });
    
    if (response.data) {
      return { success: true, data: response.data };
    }
    return { success: false };
  } catch (error) {
    console.error("Error acknowledging EOS settlement:", error);
    throw error;
  }
};

/**
 * Get exit information for a user
 * @param {string|number} employeeId - Employee ID
 * @returns {Promise<Object>} Exit information object
 */
export const getExitInformation = async (employeeId) => {
  try {
    const response = await axios.get(`${baseUrl}/exit-information/`, {
      headers: headers(),
      params: { employee: employeeId }
    });
    
    if (response.data && response.data.results && response.data.results.length > 0) {
      return response.data.results[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching exit information:", error);
    throw error;
  }
};

/**
 * Get exit clearance checklist for a user
 * @param {string|number} employeeId - Employee ID
 * @returns {Promise<Array>} Array of checklist items
 */
export const getExitClearanceChecklist = async (employeeId) => {
  try {
    const response = await axios.get(`${baseUrl}/exit-clearance-checklist/`, {
      headers: headers(),
      params: { employee: employeeId }
    });
    
    if (response.data && response.data.results) {
      return response.data.results;
    }
    return [];
  } catch (error) {
    console.error("Error fetching exit clearance checklist:", error);
    throw error;
  }
}; 