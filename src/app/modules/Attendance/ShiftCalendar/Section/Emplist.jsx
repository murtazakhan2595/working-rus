import { getEmployeeCustomList } from "app/hooks/general";
import { RenderTeamMembers } from "app/modules/Dashboard/Screens/MyTeams";
import { CardContent } from "components/ui/card";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
import Calender from "./Calendar";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import Listview from "../../Sections/Listview";
import { getShiftById, employeeData } from "app/hooks/attendance";
import { toast } from "react-toastify";

const Emplist = ({ teamMembers }) => {
  const [activeMember, setActiveMember] = useState(null);
  const [employeeShift, setEmployeeShift] = useState(null);

  const handleSelect = async (memberId) => {
    setActiveMember(memberId);
    const empData = await employeeData(memberId);
    if (!empData?.shift_assignment) {
      toast.error("Employee has no shift assigned");
      setEmployeeShift(null);
      return;
    }
    const shiftData = await getShiftById(empData.shift_assignment);
    if (shiftData) {
      setEmployeeShift({
        ...shiftData,
      });
    }
  };

  // If active member is no longer in filtered list, reset the calendar view
  useEffect(() => {
    if (activeMember && teamMembers?.results) {
      const memberStillInList = teamMembers.results.some(
        (member) => member.id === activeMember
      );

      if (!memberStillInList) {
        setActiveMember(null);
        setEmployeeShift(null);
      }
    }
  }, [teamMembers, activeMember]);

  return (
    <div className="flex gap-2">
      <Card className="min-w-[25%]">
        <CardHeader>
          <CardTitle>
            <div className="flex justify-between">
              <p className="text-sm">All Members</p>
              <p className="text-sm">{teamMembers?.count || 0}</p>
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
                activeMember={activeMember}
              />
            ))}
          {(!teamMembers?.results || teamMembers.results.length === 0) && (
            <div className="text-center py-4 text-gray-500">
              No employees match the selected filters
            </div>
          )}
        </CardContent>
      </Card>
      <Calender shift={employeeShift} />
    </div>
  );
};

export default Emplist;
