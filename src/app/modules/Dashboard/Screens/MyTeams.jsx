import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { DesignationName } from "utils/getValuesFromTables";

import { connect } from "react-redux";
import { getEmployeeCustomList } from "app/hooks/general";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../../components/ui/card";
import { Button } from "components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../src/@/components/ui/accordion";
import { MailIcon, PhoneIcon, LinkIcon } from "lucide-react";
import Avatar from "components/ui/Avatar";
import { getRandomColor } from "utils/renderValues";



const MyTeams = ({ userProfile, employees }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const user = employees.find((emp) => emp.value === userProfile.id);
      try {
        const response = await getEmployeeCustomList({
          filterData: { department_name: user.department_name },
        });
        if (response) {
          setTeamMembers(response);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [userProfile, employees]);
  const toggleCollapse = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Card className={"h-[100%]"}>
        <CardHeader className="items-start pb-0">
          <CardTitle className="flex flex-row justify-between w-full">
            <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
              Team Members
            </div>
            <Button variant="outline">
              <Link to="/my-team">View Detail</Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers.count > 0 &&
            teamMembers.results
              .slice(0, 5)
              .map((member, index) => (
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
};

const RenderTeamMembers = ({ teamMemeber, isOpen, toggle }) => {
  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="user-info-1">
          <AccordionTrigger className="flex items-center gap-4 p-4 hover:no-underline">
            <div className="flex flex-row items-center justify-start gap-4">
              {/* <Avatar className=" h-14 w-14">
                <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
                <AvatarFallback className="flex items-center justify-center text-base font-normal rounded-full border-plum-500 bg-plum-300">
                  {teamMemeber?.first_name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar> */}
              <Avatar
               src="/placeholder-user.jpg"
               fallbackText={teamMemeber?.first_name?.charAt(0)?.toUpperCase()}
               alt="Avatar"
               className={`${getRandomColor(teamMemeber?.first_name?.charAt(0))} h-12 w-12 text-base`}
              />

              <div className="flex flex-col justify-start gap-1">
                <div className="flex justify-start text-base font-medium text-[#111827] ">
                  {`${teamMemeber.first_name} ${teamMemeber.last_name}`}
                </div>
                <div className="flex justify-start text-sm text-muted-foreground md:inlin">
                  <DesignationName
                    className="flex justify-start text-sm text-muted-foreground md:inline"
                    value={teamMemeber.department_position}
                  />
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 pt-0">
            <div className="space-y-4">
              <div className="bg-[#F9FAFB] p-6 rounded-md">
                <div className="text-xs font-medium text-muted-foreground">
                  Contact
                </div>
                <div className="space-y-1 text-sm">
                  <div>
                    <MailIcon className="inline w-4 h-4 mr-2" />
                    Email: {teamMemeber.work_email}
                  </div>
                  <div>
                    <PhoneIcon className="inline w-4 h-4 mr-2" />
                    Phone: {teamMemeber.mobile_no}
                  </div>
                  <div>
                    <LinkIcon className="inline w-4 h-4 mr-2" />
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
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(MyTeams);
