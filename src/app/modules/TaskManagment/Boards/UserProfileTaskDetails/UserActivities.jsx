import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { EmployeeName, FormatID } from "utils/getValuesFromTables";
import { getActivities, getAllTasks } from "app/hooks/taskManagment";
import { MembersList } from "app/modules/TaskManagment/Sections";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import TaskEditAddViewDetails from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails";
import { TextUI } from "components";
import moment from "moment";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const UserActivities = ({ userId = null }) => {
  const [AllActivityDetails, setAllActivityDetails] = useState([]);
  const fetchAllActivityDetails = async (isMounted) => {
    try {
      const boardsData = await getActivities({
        filterData: { user_id: [userId] },
      });
      if (isMounted) {
        setAllActivityDetails(boardsData);
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchAllActivityDetails(isMounted);
    return () => {
      isMounted = false;
    };
  }, [userId]);
  if (!userId) return null;
  return (
    <Card>
      <CardContent className="mt-4 flex flex-col gap-3">
        {AllActivityDetails.count > 0 ? (
          AllActivityDetails.results.map((activity) => (
            <ListActivities activity={activity} />
          ))
        ) : (
          <div className="w-full text-neutral-1100 flex justify-center items-center">
            No Recent Activities
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ListActivities = ({ activity }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = location.state || {};
  const { userId } = useParams();
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const handleClick = (event) => {
    event.preventDefault();
    navigate(`/project-board/card/${activity.task_id}`, {
      state: {
        GOTO_URLS: `/project-board/user/${userId}`,
        activeView: "activity",
        projectId: projectId,
      },
    });
  };
  if (!activity) return null;
  return (
    <div key={activity.activity_id} className="flex gap-3 items-start w-full">
      {/* Avatar Section */}
      <div className="flex-shrink-0">
        <MembersList members={[activity.user_id]} display={true} />
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        <div className=" rounded-md">
          {/* User Name & Timestamp */}
          <div className="flex items-center gap-2">
            <p className="text-neutral-1200">
              <span className="font-semibold">
                <EmployeeName value={activity.user_id} />
              </span>{" "}
              on{" "}
              <Button
                variant="link"
                className="text-plum-1100 p-0 h-fit"
                onClick={(e) => handleClick(e)}
              >
                <FormatID value={`${activity.task_id}`} prefix="T-" />
              </Button>
            </p>
            <time className="text-xs mt-1 text-neutral-900 flex items-center gap-1">
              {moment(activity.timestamp).format("D MMM YYYY, HH:mm")}
            </time>
          </div>

          {/* Comment Text */}
          <div className="mt-1">
            <div className="text-neutral-1200 text-sm">
              <TextUI text={activity.content} isHTMLText={true} />
            </div>
          </div>
        </div>
      </div>
      {isTaskDetailOpen && (
        <TaskEditAddViewDetails
          taskId={activity.task_id} // Pass task Id as props to TaskDetail
          isOpen={isTaskDetailOpen}
          setIsOpen={setIsTaskDetailOpen}
          reloadData={setIsTaskDetailOpen}
        />
      )}
    </div>
  );
};

export default UserActivities;
