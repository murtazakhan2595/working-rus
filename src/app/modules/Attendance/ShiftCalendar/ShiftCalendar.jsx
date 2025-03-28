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

  // const tabsData = [
  //   { value: "all", label: "All" },
  //   { value: "my", label: "My" },
  //   { value: "my-team", label: "My Team" },
  // ];

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
      content={<AssignShift users={teamMembers.results} shifts={shifts.results} />}
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="all">
        {/* <div className="flex justify-start">
          <TabsList className="flex justify-center mb-4">
            {tabsData?.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div> */}
        <TabsContent value="all">
          <Emplist teamMembers={teamMembers} />
        </TabsContent>
        {/* <TabsContent value="my">
          <h1>My</h1>
        </TabsContent>
        <TabsContent value="my-team">
          <h1>My Team</h1>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default ShiftCalender;
