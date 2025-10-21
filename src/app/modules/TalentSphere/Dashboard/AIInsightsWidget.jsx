import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Button } from "components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Badge } from "components/ui/badge";
import { SelectInput } from "components/FormControl";
import { getVacancyList } from "app/hooks/talentSphere";
import { Alert, AlertDescription } from "src/@/components/ui/alert";
import {
  AlertTriangle,
  TrendingUp,
  Users,
  AlertCircle,
  FileWarning,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SelectInputComponent } from "components/FormControl";
import { ViewInterviewDetails } from "app/modules/TalentSphere";

const AIInsightsWidget = ({
  budgetWarnings,
  hiringPredictions,
  aiFlaggedData,
  aiSuggestedCandidates,
  fetchAISuggestedCandidates,
  loading,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("budget");
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [loadingVacancies, setLoadingVacancies] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [openInterviewDetails, setOpenInterviewDetails] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);

  // Fetch vacancies when AI suggestions tab is opened
  const handleTabChange = async (value) => {
    setActiveTab(value);
    if (value === "ai_match" && vacancies.length === 0) {
      setLoadingVacancies(true);
      try {
        const response = await getVacancyList({
          options: { page: 1, sizePerPage : 100},
        });
        console.log("alinsights - vacancies", response);
        if (response?.results) {
          const vacancyOptions = response.results.map((v) => ({
            value: v.id,
            label: `${v.job_title} - ${v.department}`,
          }));
          setVacancies(vacancyOptions);
          console.log("alinsights - vacancyOptions", vacancyOptions);
        }
      } catch (error) {
        console.error("Error fetching vacancies:", error);
      } finally {
        setLoadingVacancies(false);
      }
    }
  };

  console.log("AIInsightsWidget - vacancies", vacancies);

  // Handle vacancy selection
  const handleVacancyChange = async (name, value) => {
    setSelectedVacancy(value);
    setLoadingSuggestions(true);
    try {
      await fetchAISuggestedCandidates(value);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Handle opening interview details
  const handleOpenInterviewDetails = (interviewId) => {
    setSelectedInterviewId(interviewId);
    setOpenInterviewDetails(true);
  };

  // Get budget warnings with actual warnings
  const activeWarnings = React.useMemo(() => {
    return budgetWarnings?.filter((w) => w.budget_warning === true) || [];
  }, [budgetWarnings]);

  // Calculate AI flagged counts
  const flaggedCounts = React.useMemo(() => {
    if (!aiFlaggedData) return { total: 0, demographics: 0, feedback: 0 };

    const demographics = aiFlaggedData.missing_demographics?.length || 0;
    const feedback = aiFlaggedData.incomplete_feedback?.length || 0;

    return {
      total: demographics + feedback,
      demographics,
      feedback,
    };
  }, [aiFlaggedData]);

  return (
    <Card className="flex flex-col shadow-lg border rounded-xl bg-white h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-plum-900">
          AI Insights & Analytics
        </CardTitle>
        <CardDescription>Smart recommendations and predictions</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="budget" className="text-xs">
              Budget
              {activeWarnings.length > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 text-[10px] px-1.5 rounded-full h-4 min-w-[1rem] flex items-center justify-center"
                >
                  {activeWarnings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="predictions" className="text-xs">
              Predictions
            </TabsTrigger>
            <TabsTrigger value="ai_match" className="text-xs">
              AI Match
            </TabsTrigger>
            <TabsTrigger value="ai_flags" className="text-xs min-h-2 min-w-2">
              AI Flags
              {flaggedCounts.total > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 text-[10px] px-1.5 rounded-full h-4 min-w-[1rem] flex items-center justify-center"
                >
                  {flaggedCounts.total}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Budget Warnings Tab */}
          <TabsContent value="budget" className="space-y-3">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ) : activeWarnings.length === 0 ? (
              <Alert>
                <AlertDescription className="text-sm">
                  ✅ All budgets are within limits
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {activeWarnings.map((warning, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      <div className="font-semibold">{warning.job_title}</div>
                      <div className="text-[11px] mt-1">
                        {warning.department} • Max Salary: $
                        {warning.salary_max?.toLocaleString()}
                      </div>
                      <div className="text-[11px]">
                        Budget: $
                        {warning.department_budget?.toLocaleString() || "N/A"}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Hiring Predictions Tab */}
          <TabsContent value="predictions" className="space-y-3">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ) : !hiringPredictions || hiringPredictions.length === 0 ? (
              <Alert>
                <AlertDescription className="text-sm">
                  No hiring predictions available
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {hiringPredictions.map((prediction, index) => (
                  <Card key={index} className="p-3 bg-neutral-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-plum-900" />
                          <p className="font-semibold text-sm">
                            {prediction.candidate_name}
                          </p>
                        </div>
                        <p className="text-xs text-neutral-1000 mt-1">
                          {prediction.department} • {prediction.location}
                        </p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px]">
                            Match: {prediction.ai_match_score}%
                          </Badge>
                          <Badge variant="outline" className="text-[10px]">
                            Interview: {prediction.interview_score}%
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-lg font-bold text-green-600">
                            {prediction.hiring_probability}%
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-900">
                          Hire Probability
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* AI Matched Candidates Tab */}
          <TabsContent value="ai_match" className="space-y-3">
            {loadingVacancies ? (
              <div className="space-y-3">
                {/* Dropdown skeleton */}
                <div className="h-10 bg-gray-200 rounded" />
                {/* Candidate card skeletons */}
                <div className="space-y-2">
                  <div className="h-24 bg-gray-100 rounded" />
                  <div className="h-24 bg-gray-100 rounded" />
                </div>
              </div>
            ) : (
              <SelectInputComponent
                name="vacancy"
                placeholder="Select Vacancy"
                options={vacancies}
                value={selectedVacancy}
                onChange={handleVacancyChange}
              />
            )}

            {!selectedVacancy ? (
              <Alert>
                <AlertDescription className="text-sm">
                  Select a vacancy to see AI-matched candidates
                </AlertDescription>
              </Alert>
            ) : loadingSuggestions ? (
              <div className="text-center text-sm text-neutral-700 py-6">Loading...</div>
            ) : aiSuggestedCandidates === null ? (
              <div className="text-center text-sm text-neutral-700 py-6">Loading...</div>
            ) : aiSuggestedCandidates.msg ||
              aiSuggestedCandidates.resumes?.length === 0 ? (
              <Alert>
                <AlertDescription className="text-sm">
                  {aiSuggestedCandidates.msg || "No matching candidates found"}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {!aiSuggestedCandidates?.resumes ? (
                  <div className="text-center text-sm text-neutral-700 py-4">
                    Loading...
                  </div>
                ) : (
                  aiSuggestedCandidates.resumes
                    .slice(0, 5)
                    .map((candidate, index) => (
                      <Card key={index} className="p-3 bg-neutral-50">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="font-semibold text-sm">
                              Candidate #{index + 1}
                            </div>
                            <p className="text-xs text-neutral-1000 mt-1">
                              Match Score:{" "}
                              {Math.round((candidate.score || 0) * 100)}%
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="text-[10px]">
                                Matched: {candidate.matched_skills?.length || 0}
                              </Badge>
                              <Badge variant="outline" className="text-[10px]">
                                Missed: {candidate.missed_skills?.length || 0}
                              </Badge>
                            </div>
                            {(candidate.matched_skills?.length || 0) > 0 && (
                              <p className="text-[10px] text-neutral-900 mt-1">
                                +{" "}
                                {candidate.matched_skills
                                  .slice(0, 3)
                                  .join(", ")}
                                {candidate.matched_skills.length > 3 ? "…" : ""}
                              </p>
                            )}
                          </div>
                          {candidate.path && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                window.open(candidate.path, "_blank")
                              }
                            >
                              View Resume
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))
                )}
              </div>
            )}
          </TabsContent>

          {/* AI Flags Tab */}
          <TabsContent value="ai_flags" className="space-y-3">
            {loading ? (
              <div className="animate-pulse space-y-2">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ) : !aiFlaggedData || flaggedCounts.total === 0 ? (
              <Alert>
                <AlertDescription className="text-sm">
                  ✅ No flagged items - all data is complete
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Missing Demographics Section */}
                {flaggedCounts.demographics > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      <h4 className="font-semibold text-sm text-orange-600">
                        Missing Demographics ({flaggedCounts.demographics})
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {aiFlaggedData.missing_demographics
                        ?.slice(0, 5)
                        .map((item, index) => (
                          <Card
                            key={index}
                            className="p-2 bg-orange-50 border-orange-200 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() =>
                              navigate(
                                `/talent-sphere/applicant/${item.applicant_id}`
                              )
                            }
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-xs text-neutral-1200">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-neutral-1000 mt-1">
                                  ID: {item.applicant_id}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-[9px] bg-white"
                              >
                                {item.reason}
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      {flaggedCounts.demographics > 5 && (
                        <p className="text-xs text-neutral-900 text-center">
                          +{flaggedCounts.demographics - 5} more
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Incomplete Feedback Section */}
                {flaggedCounts.feedback > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileWarning className="h-4 w-4 text-red-600" />
                      <h4 className="font-semibold text-sm text-red-600">
                        Incomplete Feedback ({flaggedCounts.feedback})
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {aiFlaggedData.incomplete_feedback
                        ?.slice(0, 5)
                        .map((item, index) => (
                          <Card
                            key={index}
                            className="p-2 bg-red-50 border-red-200 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleOpenInterviewDetails(item.interview_id)}
                          >
                            {console.log(item, "item")}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-xs text-neutral-1200">
                                  {item.applicant}
                                </p>
                                <p className="text-[10px] text-neutral-1000 mt-1">
                                  Interview ID: {item.interview_id}
                                  {item.panelist &&
                                    ` • Panelist: ${item.panelist}`}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-[9px] bg-white"
                              >
                                {item.reason}
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      {flaggedCounts.feedback > 5 && (
                        <p className="text-xs text-neutral-900 text-center">
                          +{flaggedCounts.feedback - 5} more
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {/* Interview Details Sheet */}
      {openInterviewDetails && (
        <ViewInterviewDetails
          isOpen={openInterviewDetails}
          setIsOpen={() => {
            setOpenInterviewDetails(false);
            setSelectedInterviewId(null);
          }}
          currentId={selectedInterviewId}
          DataList={[]}
          reloadData={() => {
            // Optionally refresh dashboard data when interview details are updated
            // You can add a callback prop to refresh the dashboard if needed
          }}
        />
      )}
    </Card>
  );
};

export default AIInsightsWidget;
