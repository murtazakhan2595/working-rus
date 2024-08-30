import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight, FaChevronUp } from "react-icons/fa";
import {  useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DesignationName } from "utils/getValuesFromTables";
import { getRandomColor } from "utils/renderValues";
import { connect } from "react-redux";
import { getEmployeeCustomList } from "app/hooks/general";
import { Collapse, CardBody } from "reactstrap";
import { BsTelephone } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { MdOutlineMail } from "react-icons/md";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../../src/@/components/ui/card"
import { Button } from 'components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../../src/@/components/ui/accordion"
import { MailIcon, PhoneIcon, LinkIcon } from "lucide-react";
import { Badge } from "../../../../components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "../../../../src/@/components/ui/avatar"
;


const MyTeams =({userProfile, employees})=>{
  const [teamMembers, setTeamMembers] = useState([]);
   const [openIndex, setOpenIndex] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const user  = employees.find((emp) => emp.value === userProfile.id)
      try{
        const response =await getEmployeeCustomList({
          filterData: { department_name: user.department_name },
        });
        if(response){
          setTeamMembers(response);
        }
      }catch(err){
        console.error(err)
      }
    }
    fetchData()
    }, [userProfile, employees]);
     const toggleCollapse = (index) => {
       setOpenIndex(openIndex === index ? null : index);
     };

  return (
    <>
    <Card>
    <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="font-semibold text-plum-1100">My Teams</div>
       <Button variant="outline">
            <Link to="/my-team" >
              View Detail</Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
      {teamMembers.count > 0 &&
              teamMembers.results.slice(0, 5).map((member, index) => (
                <RenderTeamMembers
                  key={index}
                  teamMemeber={member}
                  isOpen={openIndex === index}
                  toggle={() => toggleCollapse(index)}
                />
              ))}
      </CardContent>
      
    </Card>
   
    </>
  );

}


const RenderTeamMembers = ({ teamMemeber, isOpen, toggle }) => {
  return (
    <>
   

        <Accordion type="single" collapsible>
          <AccordionItem value="user-info-1">
            <AccordionTrigger className="flex  items-center gap-4 justify-between p-4 hover:no-underline">
              <Avatar className=" h-14 w-14">
                <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                <AvatarFallback className="text-base bg-mauve-400 p-6">{teamMemeber?.first_name?.charAt(0).toUpperCase() +  teamMemeber?.last_name?.charAt(0).toLowerCase() }</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <div className="font-medium text-base text-mauve-1200">
                {`${teamMemeber.first_name} ${teamMemeber.last_name}`}
                </div>
                <div className="font-medium text-base text-mauve-1200">
                <DesignationName className="text-base text-mauve-900" value={teamMemeber.department_position}/>
                </div>
                </div>
          
            </AccordionTrigger>
            <AccordionContent className="p-4 pt-0">
              <div className="space-y-4">
                
              
                <div className="bg-[#F9FAFB] p-6 rounded-md">
                  <div className="text-xs font-medium text-muted-foreground">Contact</div>
                  <div className="space-y-1 text-sm">
                    <div>
                      <MailIcon className="w-4 h-4 mr-2 inline" />
                      Email: {teamMemeber.work_email}
                    </div>
                    <div>
                      <PhoneIcon className="w-4 h-4 mr-2 inline" />
                      Phone: {teamMemeber.mobile_no}
                    </div>
                    <div>
                      <LinkIcon className="w-4 h-4 mr-2 inline" />
                      <Link href="#" prefetch={false}>
                        oliviadavis.com
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
 
        </Accordion>
 
</>
)
}




const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    employees: state.emp.employees
  };
};

export default connect(mapStateToProps)(MyTeams);
