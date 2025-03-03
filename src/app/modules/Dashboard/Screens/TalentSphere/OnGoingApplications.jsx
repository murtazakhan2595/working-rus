import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardOnGoingColumns } from "app/modules/Dashboard/Screens/Sections/TableColumns";

import { getJobApplicants } from "app/hooks/recruitment";
import { PageLoader } from "components";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import CustomTable from "components/CustomTable";

/**
 * OnGoingApplications component
 *
 * This component displays a dashboard for talent management, showing job openings, applications, shortlisted, and interviewed candidates.
 *
 * @returns {JSX.Element} The OnGoingApplications component
 */
const OnGoingApplications = () => {
  const navigate = useNavigate();
  const [applicantsData, setApplicantsData] = useState([]);
  const [isApplicantsLoading, setIsApplicantsLoading] = useState(true);
  /**
   * Fetches job applicants and updates the state
   *
   * @async
   * @returns {Promise<void>}
   */
  const fetchLists = async () => {
    try {
      const applicants = await getJobApplicants();
      if (applicants) {
        setApplicantsData(applicants);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsApplicantsLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);
  return (
    <>
      <CardHeader>
        <CardTitle>
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Ongoing Process
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isApplicantsLoading ? (
          <PageLoader />
        ) : (
          <div className="h-full overflow-y-auto hideScroll">
            <CustomTable
              showHeader={false}
              columns={DashboardOnGoingColumns(navigate)}
              data={applicantsData.slice(0, 5)}
              pagination={false}
            />
          </div>
        )}
      </CardContent>
    </>
  );
};

export default OnGoingApplications;
