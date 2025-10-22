import { useState, useEffect } from "react";
import { 
  getTalentSphereSummary,
  getHiringPrediction,
  getHiringTrends,
  getSkillsGap
} from "app/hooks/talentSphere";
import { mapRequisitionRequestList } from "app/utils/MappingObjects/mapTalentSphere";
import axios from "axios";
import { baseUrl, headers } from "app/hooks/general";

export const useTalentSphereDashboard = (filterData = {}) => {
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [funnelData, setFunnelData] = useState([]);
  const [interviewData, setInterviewData] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [emiratizationData, setEmiratizationData] = useState([]);
  const [budgetWarnings, setBudgetWarnings] = useState([]);
  const [hiringPredictions, setHiringPredictions] = useState([]);
  const [aiFlaggedData, setAiFlaggedData] = useState(null);
  const [aiSuggestedCandidates, setAiSuggestedCandidates] = useState(null);
  const [requisitionsData, setRequisitionsData] = useState([]);
  
  // Predictive Analytics States
  const [hiringPredictionData, setHiringPredictionData] = useState(null);
  const [hiringTrendsData, setHiringTrendsData] = useState(null);
  const [skillsGapData, setSkillsGapData] = useState(null);

  // Build single search param with JSON-encoded filterData (dt- prefixed keys)
  // Optionally exclude certain keys (e.g., ["date_range"]) per-endpoint
  const buildFilterParams = (filters, excludeKeys = []) => {
    if (!filters || Object.keys(filters).length === 0) return "";

    const sanitized = {};
    const filterMap = {
      department: "dt-department",
      job_title: "dt-job_title",
      date_range: "dt-date_range",
      requisition_type: "dt-requisition_type",
      requisition_status: "dt-requisition_status",
      applicant_status: "dt-applicant_status",
      is_emiratization: "dt-is_emiratization",
    };
    Object.keys(filters).forEach((key) => {
      let value = filters[key];
      if (value === undefined || value === null || value === "") return;
      if (excludeKeys && excludeKeys.includes(key)) return;
      if (key === "date_range" && Array.isArray(value)) value = value.join(",");
      const backendKey = filterMap[key] || key;
      sanitized[backendKey] = value;
    });

    const encoded = encodeURIComponent(JSON.stringify(sanitized));
    return encoded ? `?search=${encoded}` : "";
  };
  
  const buildRequisitionFilterParams = (filters) => {
    if (!filters || Object.keys(filters).length === 0) return "";

    const sanitized = {};
    const allowedKeys = [
      "department",
      "branch",
      "job_title",
      "work_mode",
      "payment_frequency",
      "currency",
      "is_emiratization_role",
      "requested_by",
      "requisition_status",
    ];

    // Map frontend keys to backend keys
    const keyMapping = {
      "requisition_status": "status"
    };

    Object.keys(filters).forEach((key) => {
      let value = filters[key];
      if (value === undefined || value === null || value === "") return;
      // Skip date_range as it's not supported
      if (key === "date_range") return;
      // Only include allowed keys
      if (allowedKeys.includes(key)) {
        // Use mapped key if available, otherwise use original key
        const backendKey = keyMapping[key] || key;
        sanitized[backendKey] = value;
      }
    });

    const encoded = encodeURIComponent(JSON.stringify(sanitized));
    return encoded ? `?search=${encoded}` : "";
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const filterParams = buildFilterParams(filterData);
      const noDateParams = buildFilterParams(filterData, ["date_range"]);
      const requisitionParams = buildRequisitionFilterParams(filterData);
      // Fetch all API data in parallel
      const [
        summary,
        funnel,
        interviews,
        offers,
        sources,
        emiratization,
        budget,
        predictions,
        flagged,
        requisitions,
        hiringPrediction,
        hiringTrends,
        skillsGap,
      ] = await Promise.all([
        // Top summary (no date_range)
        axios.get(`${baseUrl}/top-summary/${noDateParams}`, { headers: headers() }),
        // Recruitment funnel (no date_range)
        axios.get(`${baseUrl}/recruitment-funnel/${noDateParams}`, { headers: headers() }),
        // Interview widget
        axios.get(`${baseUrl}/interview-widget${filterParams}`, { headers: headers() }),
        // Offer tracker (no date_range)
        axios.get(`${baseUrl}/offer-tracker${noDateParams}`, { headers: headers() }),
        // Applicant source
        axios.get(`${baseUrl}/applicaant-source${filterParams}`, { headers: headers() }),
        // Emiratization insights
        axios.get(`${baseUrl}/Emiratizatio-Insights${filterParams}`, { headers: headers() }),
        // Department budget warnings
        axios.get(`${baseUrl}/department-budget/budget_warnings/${filterParams}`, {
          headers: headers(),
        }),
        // AI hiring prediction
        axios.get(`${baseUrl}/Ai-Hiring-Pridiction/${filterParams}`, { headers: headers() }),
        // AI flagged
        axios.get(`${baseUrl}/ai-flaged${filterParams}`, { headers: headers() }),
        // Requisitions list (uses raw keys: department, branch, job_title, work_mode, payment_frequency, currency, is_emiratization_role, requested_by)
        axios.get(`${baseUrl}/requisition-requests/${requisitionParams}`, { headers: headers() }),
        // Predictive Analytics APIs
        getHiringPrediction(),
        getHiringTrends(),
        getSkillsGap(),
      ]);

      setSummaryData(summary.data || null);
      setFunnelData(funnel.data || []);
      setInterviewData(interviews.data?.results || []);
      setOfferData(offers.data || []);
      setSourceData(sources.data || []);
      setEmiratizationData(emiratization.data || []);
      setBudgetWarnings(budget.data?.results || []);
      setHiringPredictions(predictions.data?.results || []);
      setAiFlaggedData(flagged.data || null);
      const reqResults = requisitions.data?.results || [];
      console.log("REQ REJECTED DEBUG", reqResults)
      const mappedReqs = await mapRequisitionRequestList(reqResults);
      console.log("MAP REQS  ",mappedReqs)
      setRequisitionsData(mappedReqs || []);
      
      // Set Predictive Analytics Data
      setHiringPredictionData(hiringPrediction || null);
      setHiringTrendsData(hiringTrends || null);
      setSkillsGapData(skillsGap || null);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch AI suggested candidates for a specific vacancy
  const fetchAISuggestedCandidates = async (vacancyId) => {
    if (!vacancyId) {
      setAiSuggestedCandidates(null);
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/ai-suggested-candidate/`,
        { vacancy_id: vacancyId },
        { headers: headers() }
      );
      setAiSuggestedCandidates(response.data);
    } catch (error) {
      console.error("Error fetching AI suggested candidates:", error);
      setAiSuggestedCandidates({
        msg: "Error fetching candidates",
        resumes: [],
      });
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);
  console.log("REQ DATA IN GENERAL", requisitionsData);
  return {
    loading,
    summaryData,
    funnelData,
    interviewData,
    offerData,
    sourceData,
    emiratizationData,
    budgetWarnings,
    hiringPredictions,
    aiFlaggedData,
    aiSuggestedCandidates,
    requisitionsData,
    fetchAISuggestedCandidates,
    refetch: fetchAllData,
    // Predictive Analytics
    hiringPredictionData,
    hiringTrendsData,
    skillsGapData,
  };
};
