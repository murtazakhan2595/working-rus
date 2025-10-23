import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for Global Payroll
const initialState = {
  // Payroll Dashboard
  dashboardData: null,
  payrollStatus: {
    draft: 0,
    inReview: 0,
    approved: 0,
    processed: 0,
  },
  
  // Payroll Runs
  payrollRuns: [],
  currentPayrollRun: null,
  payrollRunStatus: "idle",
  
  // Countries & Currencies
  countries: [],
  currencies: [],
  exchangeRates: {},
  
  // Earnings & Deductions
  earnings: [],
  deductions: [],
  components: [],
  
  // Tax & Statutory
  taxTables: [],
  pfRules: [],
  socialSecurityRules: [],
  
  // WPS & Payments
  wpsFiles: [],
  paymentBatches: [],
  
  // Claims & Reimbursements
  claims: [],
  reimbursements: [],
  
  // AI Recommendations
  aiAlerts: [],
  aiRecommendations: [],
  anomalies: [],
  
  // Reports & Analytics
  reports: [],
  analytics: {},
  
  // Audit Logs
  auditLogs: [],
  
  // API States
  loading: false,
  error: null,
  apiStatus: "idle",
};

// Async Thunks for API calls

// Fetch Payroll Dashboard Data
export const fetchPayrollDashboard = createAsyncThunk(
  "globalPayroll/fetchDashboard",
  async (_, { getState }) => {
    const { user } = getState();
    const response = await axios.get(`${user.baseUrl}/payroll/dashboard/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  }
);

// Fetch Payroll Runs
export const fetchPayrollRuns = createAsyncThunk(
  "globalPayroll/fetchRuns",
  async (filters, { getState }) => {
    const { user } = getState();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${user.baseUrl}/payroll/runs/?${queryParams}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  }
);

// Create Payroll Run
export const createPayrollRun = createAsyncThunk(
  "globalPayroll/createRun",
  async (runData, { getState }) => {
    const { user } = getState();
    const response = await axios.post(`${user.baseUrl}/payroll/runs/`, runData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  }
);

// Fetch Countries
export const fetchCountries = createAsyncThunk(
  "globalPayroll/fetchCountries",
  async (_, { getState }) => {
    const { user } = getState();
    const response = await axios.get(`${user.baseUrl}/payroll/countries/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  }
);

// Fetch Exchange Rates
export const fetchExchangeRates = createAsyncThunk(
  "globalPayroll/fetchExchangeRates",
  async (_, { getState }) => {
    const { user } = getState();
    const response = await axios.get(`${user.baseUrl}/payroll/exchange-rates/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  }
);

// Fetch Earnings & Deductions
export const fetchEarningsDeductions = createAsyncThunk(
  "globalPayroll/fetchEarningsDeductions",
  async (_, { getState }) => {
    const { user } = getState();
    const response = await axios.get(`${user.baseUrl}/payroll/components/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  }
);

// Generate WPS File
export const generateWPSFile = createAsyncThunk(
  "globalPayroll/generateWPS",
  async (data, { getState }) => {
    const { user } = getState();
    const response = await axios.post(`${user.baseUrl}/payroll/wps/generate/`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  }
);

// Fetch AI Recommendations
export const fetchAIRecommendations = createAsyncThunk(
  "globalPayroll/fetchAIRecommendations",
  async (payrollRunId, { getState }) => {
    const { user } = getState();
    const response = await axios.get(`${user.baseUrl}/payroll/ai/recommendations/${payrollRunId}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  }
);

// Fetch Audit Logs
export const fetchAuditLogs = createAsyncThunk(
  "globalPayroll/fetchAuditLogs",
  async (filters, { getState }) => {
    const { user } = getState();
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${user.baseUrl}/payroll/audit-logs/?${queryParams}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  }
);

// Global Payroll Slice
const globalPayrollSlice = createSlice({
  name: "globalPayroll",
  initialState,
  reducers: {
    // Set current payroll run
    setCurrentPayrollRun: (state, action) => {
      state.currentPayrollRun = action.payload;
    },
    
    // Clear current payroll run
    clearCurrentPayrollRun: (state) => {
      state.currentPayrollRun = null;
    },
    
    // Add AI Alert
    addAIAlert: (state, action) => {
      state.aiAlerts.unshift(action.payload);
    },
    
    // Clear AI Alerts
    clearAIAlerts: (state) => {
      state.aiAlerts = [];
    },
    
    // Update Payroll Status
    updatePayrollStatus: (state, action) => {
      state.payrollStatus = { ...state.payrollStatus, ...action.payload };
    },
    
    // Reset State
    resetGlobalPayroll: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard
      .addCase(fetchPayrollDashboard.pending, (state) => {
        state.loading = true;
        state.apiStatus = "loading";
      })
      .addCase(fetchPayrollDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.apiStatus = "succeeded";
        state.dashboardData = action.payload;
        state.payrollStatus = action.payload.status || state.payrollStatus;
      })
      .addCase(fetchPayrollDashboard.rejected, (state, action) => {
        state.loading = false;
        state.apiStatus = "failed";
        state.error = action.error.message;
      })
      
      // Fetch Payroll Runs
      .addCase(fetchPayrollRuns.pending, (state) => {
        state.payrollRunStatus = "loading";
      })
      .addCase(fetchPayrollRuns.fulfilled, (state, action) => {
        state.payrollRunStatus = "succeeded";
        state.payrollRuns = action.payload.results || action.payload;
      })
      .addCase(fetchPayrollRuns.rejected, (state, action) => {
        state.payrollRunStatus = "failed";
        state.error = action.error.message;
      })
      
      // Create Payroll Run
      .addCase(createPayrollRun.fulfilled, (state, action) => {
        state.payrollRuns.unshift(action.payload);
        state.currentPayrollRun = action.payload;
      })
      
      // Fetch Countries
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countries = action.payload.results || action.payload;
      })
      
      // Fetch Exchange Rates
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.exchangeRates = action.payload;
      })
      
      // Fetch Earnings & Deductions
      .addCase(fetchEarningsDeductions.fulfilled, (state, action) => {
        state.components = action.payload.results || action.payload;
        state.earnings = action.payload.earnings || [];
        state.deductions = action.payload.deductions || [];
      })
      
      // Generate WPS File
      .addCase(generateWPSFile.fulfilled, (state, action) => {
        state.wpsFiles.unshift(action.payload);
      })
      
      // Fetch AI Recommendations
      .addCase(fetchAIRecommendations.fulfilled, (state, action) => {
        state.aiRecommendations = action.payload.recommendations || [];
        state.anomalies = action.payload.anomalies || [];
        state.aiAlerts = action.payload.alerts || [];
      })
      
      // Fetch Audit Logs
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLogs = action.payload.results || action.payload;
      });
  },
});

// Export actions and reducer
export const {
  setCurrentPayrollRun,
  clearCurrentPayrollRun,
  addAIAlert,
  clearAIAlerts,
  updatePayrollStatus,
  resetGlobalPayroll,
} = globalPayrollSlice.actions;

export default globalPayrollSlice.reducer;

