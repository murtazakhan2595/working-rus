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
      color: "text-blue-600",
      route: "/talent-sphere/requisition-planning",
    },
    {
      title: "Pending Requisitions",
      value: data?.pending_requisitions || 0,
      description: "Awaiting approval",
      color: "text-yellow-600",
      route: "/talent-sphere/requisition-planning",
    },
    {
      title: "Approved Requisitions",
      value: data?.approved_requisitions || 0,
      description: "Ready to publish",
      color: "text-green-600",
      route: "/talent-sphere/requisition-planning",
    },
    {
      title: "Published Vacancies",
      value: data?.published_vacancies || 0,
      description: "Active job postings",
      color: "text-purple-600",
      route: "/talent-sphere/requisition-planning",
    },
    {
      title: "Total Applicants",
      value: data?.total_applicants || 0,
      description: "Candidates applied",
      color: "text-plum-900",
      route: "/talent-sphere/applicant-management",
    },
    {
      title: "Screened Candidates",
      value: data?.screened_candidates || 0,
      description: "Shortlisted for interviews",
      color: "text-cyan-600",
      route: "/talent-sphere/applicant-management",
    },
    {
      title: "Interviews Scheduled",
      value: data?.interviews_scheduled || 0,
      description: "Upcoming interviews",
      color: "text-indigo-600",
      route: "/talent-sphere/interview-tracker",
    },
    {
      title: "Offers Generated",
      value: data?.offers_generated || 0,
      description: "Offers created",
      color: "text-orange-600",
      route: "/talent-sphere/offer-tracking",
    },
    {
      title: "Offers Accepted",
      value: data?.offers_accepted || 0,
      description: "Candidates accepted",
      color: "text-green-700",
      route: "/talent-sphere/offer-tracking",
    },
    {
      title: "Hired Applicants",
      value: data?.hired_applicants || 0,
      description: "Successfully onboarded",
      color: "text-emerald-600",
      route: "/talent-sphere/applicant-management",
    },
    {
      title: "Rejected Applicants",
      value: data?.rejected_applicants || 0,
      description: "Not selected",
      color: "text-red-600",
      route: "/talent-sphere/applicant-management",
    },
    {
      title: "Blacklisted",
      value: data?.blacklisted_applicants || 0,
      description: "Permanently blacklisted",
      color: "text-red-800",
      route: "/talent-sphere/applicant-management",
    },
  ];

  const handleCardClick = (route) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="flex flex-col justify-center shadow-md border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick(stat.route)}
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
