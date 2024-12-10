import { getEmployeeCustomList } from "app/hooks/general";
import { RenderTeamMembers } from "app/modules/Dashboard/Screens/MyTeams";
import { CardContent } from "components/ui/card";
import { Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
import Calender from "./Calendar";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import Listview from "../../Sections/Listview";

const Emplist = ({ teamMembers }) => {
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
              <Listview teamMemeber={member} key={index} />
            ))}
        </CardContent>
      </Card>
      <Calender />
    </div>
  );
};

export default Emplist;
