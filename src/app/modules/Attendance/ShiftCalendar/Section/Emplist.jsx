import { getEmployeeCustomList } from "app/hooks/general";
import { RenderTeamMembers } from "app/modules/Dashboard/Screens/MyTeams";
import { CardContent } from "components/ui/card";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
import Calender from "./Calendar";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import Listview from "../../Sections/Listview";
import { getShiftAssignment } from "app/hooks/attendance";

const Emplist = ({ teamMembers }) => {
  const [activeMember, setActiveMember] = useState(null);
  const [employeeShift, setEmployeeShift] = useState([]);
  const handleSelect = async(memberId) => {
    setActiveMember(memberId);
    // const shiftData = await getShiftAssignment({ filterData: { employee: memberId } });
    // console.log("Shift Data", shiftData);
    setEmployeeShift([
      {
        id: 1,
        employee: 496,
        starttime: "2024-12-10T09:00:00", // Shift start time
        endtime: "2024-12-10T13:00:00", // Shift end time
        name: "ahmed",
      },
      {
        id: 2,
        employee: 496,
        starttime: "2024-12-10T16:00:00", // Shift start time
        endtime: "2024-12-10T18:00:00", // Shift end time
        name: "ahmed",
      },
    ]);

  }
  return (
    <div className="flex gap-2">
      <Card className=" min-w-[25%]">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between">
              <p className="text-sm">All Members</p>
              <p className="text-sm">{teamMembers?.count}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[450px] overflow-auto">
          {teamMembers?.count > 0 &&
            teamMembers?.results?.map((member, index) => (
              <Listview
                teamMemeber={member}
                key={index}
                handleSelect={handleSelect}
              />
            ))}
        </CardContent>
      </Card>
      <Calender shifts={employeeShift} />
    </div>
  );
};

export default Emplist;
