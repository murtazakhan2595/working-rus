import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  BoardListView,
  UserTaskActivityDetails,
} from "app/modules/TaskManagment/Boards";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjectById,
  addProject,
  getAllBoards,
} from "app/hooks/taskManagment";
import TaskEditAddViewDetails from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails";
import AlertDialogue from "components/ui/AlertDialogue";
import ActionAlert from "components/ui/ActionAlert";
import { useSelector } from "react-redux";
import Err404 from "app/modules/Error/Err404";
import { ArrowLeft } from "lucide-react";
import { GetUser } from "utils/getValuesFromTables";
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
  const userDetails = GetUser(userId);
  const [activeTab, setActiveTab] = useState("cards");
  const [AllBoards, setAllBoards] = useState([]);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [filterData, setFilterData] = useState({
    is_subtask: [false],
    is_archive: [false],
    assigned_to: [userId],
  });

  const fetchAllBoards = async (isMounted) => {
    try {
      const boardsData = await getAllBoards({
        filterData: { project_id: [projectId] },
      });
      if (isMounted) {
        setAllBoards(boardsData);
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchAllBoards(isMounted);
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  if (projectId === -1 || !userId || !userDetails) {
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
          <TabsContent value="activity">
            <UserTaskActivityDetails userId={userId} />
          </TabsContent>
          <TabsContent value="cards">
            <BoardListView
              filterData={filterData}
              projectId={projectId}
              AllBoards={AllBoards}
              reloadData={fetchAllBoards}
              isEditMode={false}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default UserProfileTaskDetails;
