import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { useNavigate } from "react-router-dom";

const KPICards = ({ data, loading }) => {
  const navigate = useNavigate();

  const statsData = [
    {
      title: "Total Requisitions",
      value: data?.total_requisitions || 0,
      description: "All requisitions raised",
      color: "text-[#3B82F6]", // Match funnel: Requisitions Raised (blue)
      route: "/talent-sphere/requisition-planning",
      state: { tab: "generate-requisition" },
    },
    {
      title: "Pending Requisitions",
      value: data?.pending_requisitions || 0,
      description: "Awaiting approval",
      color: "text-yellow-600",
      route: "/talent-sphere/requisition-planning",
      state: { tab: "requisition-requests", filterData: {} },
    },
    {
      title: "Approved Requisitions",
      value: data?.approved_requisitions || 0,
      description: "Ready to publish",
      color: "text-[#10B981]", // Align with acceptance/positive state
      route: "/talent-sphere/requisition-planning",
      state: { tab: "requisition-requests", filterData: {}, subTab: "Records" },
    },
    {
      title: "Published Vacancies",
      value: data?.published_vacancies || 0,
      description: "Active job postings",
      color: "text-[#F59E0B]", // Match funnel: Vacancies Published (orange)
      route: "/talent-sphere/requisition-planning",
      state: { tab: "published-vacancies", filterData: {} },
    },
    {
      title: "Total Applicants",
      value: data?.total_applicants || 0,
      description: "Candidates applied",
      color: "text-[#8B5CF6]", // Match funnel: Total Applicants (purple)
      route: "/talent-sphere/applicant-management",
      state: { tab: "All Applicants", filterData: {} },
    },
    {
      title: "Screened Candidates",
      value: data?.screened_candidates || 0,
      description: "Shortlisted for interviews",
      color: "text-[#EF4444]", // Match funnel: Screened Candidates (red)
      route: "/talent-sphere/applicant-management",
      state: { tab: "Screened", filterData: {} },
    },
    {
      title: "Interviews Scheduled",
      value: data?.interviews_scheduled || 0,
      description: "Upcoming interviews",
      color: "text-[#06B6D4]", // Match funnel: Interviews Scheduled (cyan)
      route: "/talent-sphere/interview-tracker",
    },
    {
      title: "Offers Generated",
      value: data?.offers_generated || 0,
      description: "Offers created",
      color: "text-[#EC4899]", // Match funnel: Offers Generated (pink)
      route: "/talent-sphere/offer-tracking",
      state: { tab: "Offer Send", subTab: "Pending"},
    },
    {
      title: "Offers Accepted",
      value: data?.offers_accepted || 0,
      description: "Candidates accepted",
      color: "text-[#10B981]", // Match funnel: Offers Accepted (green)
      route: "/talent-sphere/offer-tracking",
      state: { tab: "Offer Send", subTab: "Accepted"},
    },
    {
      title: "Hired Applicants",
      value: data?.hired_applicants || 0,
      description: "Successfully onboarded",
      color: "text-[#059669]", // Match funnel: Final Hires (dark green)
      route: "/talent-sphere/applicant-management",
      state: { tab: "Hired", filterData: {} },
    },
    {
      title: "Rejected Applicants",
      value: data?.rejected_applicants || 0,
      description: "Not selected",
      color: "text-red-600",
      route: "/talent-sphere/applicant-management",
      state: { tab: "Rejected", filterData: {} },
    },
    {
      title: "Blacklisted",
      value: data?.blacklisted_applicants || 0,
      description: "Permanently blacklisted",
      color: "text-red-800",
      route: "/talent-sphere/applicant-management",
      state: { tab: "Blacklisted", filterData: {} },
    },
  ];

  const handleCardClick = (route, state) => {
    if (!route) return;
    navigate(route, state ? { state } : undefined);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="flex flex-col justify-center shadow-md border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick(stat.route, stat.state)}
        >
          {loading ? (
            <div className="animate-pulse">
              <CardHeader className="pb-2">
                <CardTitle className="h-4 bg-gray-300 rounded w-2/3"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-300 rounded w-1/2"></div>
              </CardContent>
            </div>
          ) : (
            <>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-neutral-900">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-3xl font-medium ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-neutral-800 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </>
          )}
        </Card>
      ))}
    </div>
  );
};

export default KPICards;
