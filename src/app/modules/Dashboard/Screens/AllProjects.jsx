import { getAllProjects } from "app/hooks/taskManagment";
import { MembersList } from "app/modules/TaskManagment/Sections";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { EmployeeName } from "utils/getValuesFromTables";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "../../../../src/@/components/ui/card";
import { Button } from '../../../../src/@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "../../../../src/@/components/ui/table";
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
   <Card className="w-full h-[642px]">
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
    {/* <div className="w-full px-3.5 py-6 bg-white rounded-md flex-col justify-start items-end gap-6 inline-flex">
      <header className="inline-flex items-center justify-between w-full">
        <div className="text-[#323233] text-lg font-normal leading-tight">
          {userProfile.role === 4 ? "My Projects" : "All Projects"}
          all
        </div>
        <div className="flex items-center justify-start gap-1">
          <Link to="/projects">
            <div className="flex gap-1.5 justify-center px-2.5 py-2 my-auto text-xs leading-5 text-black rounded items-center ">
              <div className="my-auto grow">View All</div>
              <FaChevronRight size={11} />
            </div>
          </Link>
        </div>
      </header>
      <div className="w-full max-h-[236px] overflow-y-auto no-scrollbar">
        {AllProjects.count > 0 &&
          AllProjects.results.slice(0, 5).map((project) => (
            <RenderProject key={project.id} project={project} />
          ))}
          
      </div>
    </div> */}
    </>
  );
}

const RenderProject = ({ project }) => {
  return (
  
        <Table className="overflow-hidden">
          <TableBody>
            <TableRow>
              <TableCell className="w-full">
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
    
    // <div className="w-full">
    //   <div className="flex items-center justify-between w-full">
    //     <div className="flex items-center gap-2">
    //       <div className="w-[35.80px] h-9 rounded-[100px] justify-center items-center gap-2.5 inline-flex bg-gray-300 text-white">
    //         {`${project?.name.charAt(0).toUpperCase()}${project?.name
    //           .charAt(1)
    //           .toUpperCase()}`}
    //       </div>
    //       <div className="h-[50px] flex-col justify-center gap-1 items-start inline-flex">
    //         <div className="w-[173px] text-[#323233] text-sm font-bold">
    //           {project.name}
    //         </div>
    //         <div className="text-[#989ba5] text-[11px] font-normal">
    //           Created By <EmployeeName value={project?.created_by} /> |{" "}
    //           {moment(project?.start_date).format("DD-MM-YY")}
    //         </div>
    //       </div>
    //     </div>
    //     <MembersList members={project?.project_members || []} />
    //   </div>
    //   <div className="h-[0px] border border-[#dadada] my-2.5"></div>
    // </div>
