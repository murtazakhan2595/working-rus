import { useState, useEffect } from "react";
import { getTalentSphereSummary } from "app/hooks/talentSphere";
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

  const fetchAllData = async () => {
    setLoading(true);
    try {
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
      ] = await Promise.all([
        getTalentSphereSummary(),
        axios.get(`${baseUrl}/recruitment-funnel/`, { headers: headers() }),
        axios.get(`${baseUrl}/interview-widget`, { headers: headers() }),
        axios.get(`${baseUrl}/offer-tracker`, { headers: headers() }),
        axios.get(`${baseUrl}/applicaant-source`, { headers: headers() }),
        axios.get(`${baseUrl}/Emiratizatio-Insights`, { headers: headers() }),
        axios.get(`${baseUrl}/department-budget/budget_warnings/`, {
          headers: headers(),
        }),
        axios.get(`${baseUrl}/Ai-Hiring-Pridiction/`, { headers: headers() }),
        axios.get(`${baseUrl}/ai-flaged`, { headers: headers() }),
      ]);

      setSummaryData(summary);
      setFunnelData(funnel.data || []);
      setInterviewData(interviews.data?.results || []);
      setOfferData(offers.data || []);
      setSourceData(sources.data || []);
      setEmiratizationData(emiratization.data || []);
      setBudgetWarnings(budget.data?.results || []);
      setHiringPredictions(predictions.data?.results || []);
      setAiFlaggedData(flagged.data || null);
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
  }, [filterData]);

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
    fetchAISuggestedCandidates,
    refetch: fetchAllData,
  };
};
