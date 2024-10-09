import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashboardJobApplicationColumns, DashboardOnGoingColumns } from "../../../../../app/modules/Dashboard/Screens/Sections/TableColumns";

import { fetchJobPosts, getJobApplicants } from "app/hooks/recruitment";
import { PageLoader } from "components";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Button } from 'components/ui/button';
import CustomTable from '../../../../../components/CustomTable';
import { Briefcase, UserPlus, UserCheck, Users } from "lucide-react";
import Stats from "./../../../../../components/ui/Stats";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../../../src/@/components/ui/table";
import { Badge } from "../../../../../components/ui/badge";

/**
 * TalentSphere component
 * 
 * This component displays a dashboard for talent management, showing job openings, applications, shortlisted, and interviewed candidates.
 * 
 * @returns {JSX.Element} The TalentSphere component
 */
const TalentSphere = () => {
  const [posts, setPosts] = useState([]);
  const [applicantsData, setApplicantsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplicantsLoading, setIsApplicantsLoading] = useState(true);
  const [jobOpenings, setJobOpenings] = useState(0);
  const [applications, setApplications] = useState(0);
  const [shortlisted, setShortlisted] = useState(0);
  const [interviewed, setInterviewed] = useState(0);
  const navigate = useNavigate();

  /**
   * Fetches job posts and updates the state
   * 
   * @async
   * @returns {Promise<void>}
   */
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchJobPosts();
      setPosts(data.results);
      setJobOpenings(data.results.length); // Set job openings count
      setInterviewed(data.results.length); // Set job openings count
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };
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
        setApplications(applicants.length); // Set applications count
        setShortlisted(applicants.filter(applicant => applicant.status === 'shortlisted').length); // Set shortlisted count
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsApplicantsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchLists();
  }, []);

  const statsData = [
    { icon: Briefcase, label: "Job Openings", value: jobOpenings },
    { icon: UserPlus, label: "Applications", value: applications },
    { icon: UserCheck, label: "Shortlisted", value: shortlisted },
    { icon: Users, label: "Interviewed", value: interviewed },
  ];
  return (
    <>
      <Card className="col-span-2">
        <CardHeader className="items-start p-6">
          <CardTitle className="flex flex-row justify-between w-full">
            <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">Talent Sphere</div>
            <div className="flex flex-row gap-4">
              <Button variant="outline">
                <Link to="/jobs">View Detail</Link>
              </Button>
              <Button variant="secondary">
                <Link to="/job-post">Add New Job</Link>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* <StatsTalent jobOpenings={jobOpenings} applications={applications} shortlisted={shortlisted} /> */}
          {/* <Stats stats= {statsData}  /> */}
          {isLoading ? (
            <PageLoader />
          ) : (
            <CustomTable
              showHeader={true}
              columns={DashboardJobApplicationColumns(navigate)}
              data={posts.slice(0, 5)}
              pagination={false}
              rowExpand={false}
              tableOptions={{ onRowClick: false }}
            />
          )}
        </CardContent>
      </Card>
      <Card className="w-full xl:col-span-1 lg:col-span-1 md:col-span-2 sm:col-span-1">
        <CardHeader>
          <CardTitle>
            <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">Ongoing Process</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isApplicantsLoading ? (
            <PageLoader />
          ) : (
            <OnGoingApplications applicantsData={applicantsData} />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TalentSphere;


// ...

  /**
   * OnGoingApplications component
   * 
   * This component displays a table of ongoing job applications
   * 
   * @param {object} applicantsData - The applicants data
   * @returns {JSX.Element} The OnGoingApplications component
   */
  const OnGoingApplications = ({ applicantsData }) => {
    const navigate = useNavigate();
    console.log(applicantsData, "APPLICATIONS DATA")
    return (
      <div className="h-full overflow-y-auto hideScroll">
        <CustomTable
          showHeader={false}
          columns={DashboardOnGoingColumns(navigate)}
          data={applicantsData.slice(0, 5)}
          pagination={false}
        />
      </div>
    );
  };