import { getAllProjects } from "app/hooks/taskManagment";
import { MembersList } from "app/modules/TaskManagment/Sections";
import moment from "moment";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EmployeeName } from "utils/getValuesFromTables";
import { Card, CardHeader, CardContent, CardTitle} from "../../../../src/@/components/ui/card";
import { Button } from '../../../../src/@/components/ui/button';
import { Table, TableRow,  TableBody, TableCell } from "../../../../src/@/components/ui/table";
export default function AllProjects(){
    const userProfile = useSelector((state) => state.user.userProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [AllProjects, setAllProjects] = useState([]);
    const fetchData = async (isMounted) => {
      setIsLoading(true);
      try {
        const projectsData = await getAllProjects({  }, userProfile);
        if (isMounted) {
          setAllProjects(projectsData);
        }
      } catch (error) {
        console.error("Error fetching employeeLeaveTypes:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    useEffect(() => {
      let isMounted = true;
      fetchData(isMounted);
      return () => {
        isMounted = false;
      };
    }, [userProfile]);

  return (
    <>
   <Card className="w-full h-[640px]">
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="font-semibold text-plum-1100">{userProfile.role === 4 ? "My Projects" : "All Projects"}</div>
          <Button variant="outline" className="">
            <Link to="/projects">View Details</Link>
          </Button>
        </CardTitle>
        
      </CardHeader>
      <CardContent>
      {AllProjects.count > 0 &&
          AllProjects.results.slice(0, 5).map((project) => (
            <RenderProject key={project.id} project={project} />
          ))}
      </CardContent>
    
    </Card>
    
    </>
  );
}

const RenderProject = ({ project }) => {
  return (
  
        <Table className="overflow-hidden">
          <TableBody>
            <TableRow>
              <TableCell className="w-full px-4 py-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-[35.80px] h-9 rounded-[100px] justify-center items-center gap-2.5 inline-flex bg-gray-300 text-white">
                      {`${project?.name.charAt(0).toUpperCase()}${project?.name.charAt(1).toUpperCase()}`}
                    </div>
                    <div className="h-[50px] flex-col justify-center gap-1 items-start inline-flex">
                      <div className="w-[173px] text-[#323233] text-sm font-bold">
                        {project.name}
                      </div>
                      <div className="text-[#989ba5] text-[11px] font-normal">
                        Created By <EmployeeName value={project?.created_by} /> |{" "}
                        {moment(project?.start_date).format("DD-MM-YY")}
                      </div>
                    </div>
                  </div>
                  <MembersList members={project?.project_members || []} />
                </div>
                <div className="h-[0px] border border-[#dadada] "></div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    };
    
   