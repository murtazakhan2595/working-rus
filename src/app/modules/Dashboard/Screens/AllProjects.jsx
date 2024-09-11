import { getAllProjects } from "app/hooks/taskManagment";
import { MembersList } from "app/modules/TaskManagment/Sections";
import moment from "moment";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EmployeeName } from "utils/getValuesFromTables";
import { Card, CardHeader, CardContent, CardTitle} from "../../../../components/ui/card";
import { Button } from '../../../../src/@/components/ui/button';
import { Table, TableRow,  TableBody, TableCell } from "../../../../src/@/components/ui/table";
// import { Avatar, AvatarImage, AvatarFallback } from "../../../../src/@/components/ui/avatar"
import { CustomTable } from 'components/CustomTable';
import Avatar from "components/ui/Avatar";
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
   <Card className="w-full h-[100%]">
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">{userProfile.role === 4 ? "My Projects" : "All Projects"}</div>
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


           {/* {project.length > 0 ? (
            <RenderProject project={projects} />
          ) : (
            <div>No Projects available.</div>
          )} */}
      </CardContent>
    
    </Card>
    
    </>
  );
}

const RenderProject = ({ project }) => {
  return (
        <Table className="">
          <TableBody>
            <TableRow>
              <TableCell className="w-full px-4 py-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                  <Avatar
                  src="/placeholder-user.jpg"
                  alt="Avatar"
                  fallbackText={`${project?.name.charAt(0).toUpperCase()}`}
                  className="h-14 w-14"
                />
                    
                    <div className="inline-flex flex-col items-start justify-center gap-1 ">
                      <div className="font-medium">
                        {project.name}
                      </div>
                      <div   className="hidden text-sm text-muted-foreground md:inline">
                        Created By <EmployeeName value={project?.created_by} /> |{" "}
                        {moment(project?.start_date).format("DD-MM-YY")}
                      </div>
                    </div>
                  </div>
                  <MembersList members={project?.project_members || []} />
                </div>
                
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
    };
    
   