import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DashbaordJobApplicationColumns } from "app/modules/Dashboard/Screens/Sections";
import { fetchJobPosts, getJobApplications, getJobApplicants } from "app/hooks/recruitment";
import { PageLoader } from "components";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Button } from 'components/ui/button';
import TableCustom from './../../../../../components/TableCustom';
import { Briefcase, Users, UserCheck, UserPlus } from "lucide-react";
import { Separator } from "../../../../../src/@/components/ui/separator";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../../../../src/@/components/ui/table";
import { Badge } from "../../../../../components/ui/badge";

const TalentSphere = () => {
  const [posts, setPosts] = useState([]);
  const [applicantsData, setApplicantsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplicantsLoading, setIsApplicantsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchJobPosts();
      setPosts(data.results);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
    fetchData();
    fetchLists();
  }, []);

  return (
    <>
      <Card className="col-span-2">
        <CardHeader className="items-start p-6">
          <CardTitle className="flex flex-row justify-between w-full">
            <div className="font-semibold text-plum-1100">Talent Sphere</div>
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
          <StatsTalent />
          {isLoading ? (
            <PageLoader />
          ) : (
            <TableCustom
              columns={DashbaordJobApplicationColumns(navigate)}
              data={posts.slice(0, 5)}
              pagination={false}
              dataStyle={{ backgroundColor: "white" }}
              rowExpand={false}
              tableOptions={{ onRowClick: false }}
            />
          )}
        </CardContent>
      </Card>
      <Card className="w-full xl:col-span-1 lg:col-span-1 md:col-span-2 sm:col-span-1">
        <CardHeader>
          <CardTitle>
            <div className="font-semibold text-plum-1100">Ongoing Process</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isApplicantsLoading ? (
            <PageLoader />
          ) : (
            <OnGoingApplicatns applicantsData={applicantsData} />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default TalentSphere;

function StatsTalent() {
  return (
    <div className="w-full p-6">
      <div className="flex flex-wrap items-start justify-between xl:flex-nowrap xl:items-center">
        <StatItem icon={Briefcase} label="Job Opening" value="6" />
        <Separator orientation="vertical" className="w-px mx-2 h-14" />
        <StatItem icon={UserPlus} label="Applications" value="50" />
        <Separator orientation="vertical" className="w-px mx-2 h-14" />
        <StatItem icon={UserCheck} label="Shortlisted" value="20" />
        <Separator orientation="vertical" className="w-px mx-2 h-14" />
        <StatItem icon={Users} label="Interview" value="5" />
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex items-center justify-center p-4 rounded-full bg-mauve-200">
      <Icon className="h-7 w-7 text-plum-1100" aria-hidden="true" />
      </div>
       
      <div className="flex flex-col items-start">
      <div className="text-2xl font-bold leading-none tabular-nums">{value}</div>
        <div className="font-xl medium text-muted-foreground">{label}</div>
      </div>
      
    </div>
  );
}

const OnGoingApplicatns = ({ applicantsData }) => {
  return (
    <div className="h-full overflow-y-auto hideScroll">
      <Table className="min-w-full bg-white">
        <TableHeader>
          <TableRow>
            <TableHead className="py-4">ID</TableHead>
            <TableHead className="py-4">Full Name</TableHead>
            <TableHead className="py-4">Job Title</TableHead>
            <TableHead className="py-4 whitespace-nowrap">Application Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicantsData.slice(0, 5).map((applicant) => (
            <TableRow key={applicant.id} className="border-t">
              <TableCell className="py-4 text-xs ">{applicant.id}</TableCell>
              <TableCell className="py-4 text-sm font-bold ">
                {applicant.full_name}
              </TableCell>
              <TableCell className="py-4 text-xs ">
                {applicant.job_title}
              </TableCell>
              <TableCell className="py-4 text-sm leading-4 whitespace-nowrap">
                <Badge variant="outline" className="text-xs">{applicant.application_status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
