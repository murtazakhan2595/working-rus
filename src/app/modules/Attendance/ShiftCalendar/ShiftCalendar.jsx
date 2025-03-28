import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Header } from "components";
import React, { useEffect, useState } from "react";
import Emplist from "./Section/Emplist";
import AssignShift from "./Section/AssignShift";
import { useSelector } from "react-redux";
import { getEmployeeCustomList } from "app/hooks/general";
import { getShift } from "app/hooks/attendance";

const ShiftCalender = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [teamMembers, setTeamMembers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const userProfile = useSelector((state) => state.user.userProfile);

  useEffect(() => {
    const fetchData = async () => {
      const filterData = {
        ...(userProfile.role === 2 ? { direct_report: userProfile.id } : {}),
      };
      try {
        const response = await getEmployeeCustomList({ filterData });
        if (response) {
          setTeamMembers(response);
        }

        const shifts = await getShift();
        if (shifts) {
          console.log("Shifts", shifts);
          setShifts(shifts);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <Header
      content={<AssignShift employees={teamMembers.results} shifts={shifts.results} />}
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
        <TabsContent value="all">
          <Emplist teamMembers={teamMembers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ShiftCalender;
