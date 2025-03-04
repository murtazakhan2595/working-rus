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
import { EmployeeOverview } from "components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../src/@/components/ui/accordion";
import { MailIcon, PhoneIcon, LinkIcon } from "lucide-react";
import { Button } from "components/ui/button";
import { getRandomColor } from "utils/renderValues";

const MyTeams = ({ user_details }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEmployeeCustomList({
          filterData: { department_name: user_details?.department_name },
        });
        if (response) {
          setTeamMembers(response);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user_details]);
  const toggleCollapse = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const TeamMembers = showAll
    ? teamMembers?.results || []
    : teamMembers?.results?.slice(0, 6) || [];

  return (
    <>
      <CardHeader className="items-start pb-0">
        <CardTitle className="flex flex-row justify-between w-full">
          <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
            Team Members
          </div>
          {/* Hiding button untill My Team page developed */}
          {/* <Button variant="outline">
              <Link to="/my-team">View Detail</Link>
            </Button> */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {teamMembers.count > 0 &&
          TeamMembers.map((member, index) => (
            <RenderTeamMembers
              key={index}
              teamMemeber={member}
              isOpen={openIndex === index}
              toggle={() => toggleCollapse(index)}
            />
          ))}
        {teamMembers.count > 6 && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                setShowAll((prev) => {
                  return !prev;
                });
              }}
            >
              {showAll ? "Show Less" : "Show All"}
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
};

export const RenderTeamMembers = ({
  teamMemeber,
  showDetails = true,
}) => {
  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="user-info-1">
          <AccordionTrigger className="flex items-center gap-4 p-4 hover:no-underline">
            <div className="flex flex-row items-center justify-start gap-4">
              <EmployeeOverview
                className={"text-sm"}
                id={teamMemeber.id}
                showPosition={true}
              />
            </div>
          </AccordionTrigger>
          {showDetails && (
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
                    {/* <div>
                      <LinkIcon className="inline w-4 h-4 mr-2" />
                      <Link href="#" prefetch={false}>
                        oliviadavis.com
                      </Link>
                    </div> */}
                  </div>
                </div>
              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      </Accordion>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    employees: state.emp.employees,
    user_details: state.emp.user_details,
  };
};

export default connect(mapStateToProps)(MyTeams);
