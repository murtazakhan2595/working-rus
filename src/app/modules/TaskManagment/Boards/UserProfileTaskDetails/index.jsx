import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { UserActivities, UserCards } from "app/modules/TaskManagment/Boards";
import { useParams, useNavigate } from "react-router-dom";
import Err404 from "app/modules/Error/Err404";
import { ArrowLeft } from "lucide-react";
import { EmployeeOverview } from "components";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";

const TabsData = [
  { value: "activity", label: "Activity" },
  { value: "cards", label: "Cards" },
];
const UserProfileTaskDetails = ({}) => {
  const projectId = useParams()?.projectId || null;
  const userId = useParams()?.userId || null;
  const [activeTab, setActiveTab] = useState("cards");

  if (projectId === -1 || !userId) {
    return <Err404 />;
  }
  return (
    <>
      <div className="mb-4 flex flex-row gap-2 justify-start items-center">
        <Button
          variant="ghost"
          to={`/project-board/${projectId}`}
          className="p-0 text-xl text-balance hover:bg-transparent"
        >
          <ArrowLeft className="w-6 h-6 shadow-none" />
        </Button>
        <div className="text-2xl font-semibold">User Details</div>
      </div>
      <div className="my-5">
        <Card>
          <CardContent className="flex items-center pt-6 space-x-4">
            <EmployeeOverview
              id={userId}
              showId={true}
              showPosition={true}
              showDepartment={true}
              avatarSize="16"
            />
          </CardContent>
        </Card>
      </div>
      <div>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="cards"
        >
          <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
            <TabsList className="flex justify-center mb-4">
              {TabsData?.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {activeTab === "activity" && (
            <TabsContent value="activity">
              <UserActivities userId={userId} />
            </TabsContent>
          )}
          {activeTab === "cards" && (
            <TabsContent value="cards">
              <UserCards projectId={projectId} userId={userId} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default UserProfileTaskDetails;
