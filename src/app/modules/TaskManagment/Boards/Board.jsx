import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ViewOptions } from "components";
import { getLabelDropdownList } from "utils/Lists";
import BoardListView from "app/modules/TaskManagment/Boards/BoardListView";
import BoardGridView from "app/modules/TaskManagment/Boards/BoardGridView";
import BoardHeader from "app/modules/TaskManagment/Boards/BoardHeader";
import { MembersList } from "app/modules/TaskManagment/Sections";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "src/@/components/ui/dialog.jsx";
import { Button } from "components/ui/button";
import { FilterInput, SortingFilters } from "components/FormControl";
import { PriorityList, TaskSortingFilters } from "data/Data";
import { getProjectById, addProject } from "app/hooks/taskManagment";
import { AlignRight } from "lucide-react";
import TaskEditAddViewDetails from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails";
import AlertDialogue from "components/ui/AlertDialogue";
import ActionAlert from "components/ui/ActionAlert";
import { useSelector } from "react-redux";
import Err404 from "app/modules/Error/Err404";

const Board = ({}) => {
  const projectId = useParams()?.projectId || null;
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userProfile).id;
  const userRole = useSelector((state) => state.user.userProfile).role;
  const viewTaskId = useParams()?.taskId || null;
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(
    viewTaskId ? true : false
  );
  const [projectData, setProjectData] = useState({});
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);
  const [openRequestJoinDialogBox, setOpenRequestJoinDialogBox] =
    useState(false);
  const [filterData, setFilterData] = useState({
    is_subtask: [false],
    is_archive: [false],
  });
  const [activeView, setActiveView] = useState("grid");
  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const fetchData = async (isMounted) => {
    try {
      const projectDetails = await getProjectById(projectId);
      if (isMounted) {
        setProjectData(projectDetails);
        const members = projectDetails?.project_members || [];
        if (userRole === 4 || userRole === 3)
          if (!Array.isArray(members) || !members.includes(userId)) {
            setOpenRequestJoinDialogBox(true);
          }
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    }
  };
  const SubmitJoinRequest = async () => {
    try {
      const updatedMembers = [...(projectData.joining_request || []), userId];
      const payload = { joining_request: updatedMembers || [] };
      const response = await addProject(payload, projectId);
      if (response) {
        setOpenRequestJoinDialogBox(false);
        setOpenSuccessMessage(true);
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    }
  };

  if (projectData === -1) {
    return <Err404 />;
  }
  return (
    <>
      <BoardHeader
        setFilterData={setFilterData}
        filterData={filterData}
        projectId={projectId}
        activeView={activeView}
        setActiveView={setActiveView}
        projectData={projectData}
        fetchData={fetchData}
      />
      {activeView === "grid" ? (
        <BoardGridView filterData={filterData} projectId={projectId} />
      ) : (
        <BoardListView filterData={filterData} projectId={projectId} />
      )}
      {/* Render TaskDetail component if isTaskDetailOpen is true */}
      {isTaskDetailOpen && (
        <TaskEditAddViewDetails
          taskId={viewTaskId} // Pass task Id as props to TaskDetail
          isOpen={isTaskDetailOpen}
          setIsOpen={() => {
            setIsTaskDetailOpen(false);
            //    fetchData(true);
          }}
          reloadData={() => {
            setIsTaskDetailOpen(false);
            //   fetchData(true);
          }}
          projectId={projectId}
        />
      )}
      {openRequestJoinDialogBox && (
        <AlertDialogue
          isOpen={openRequestJoinDialogBox}
          setIsOpen={() => {
            setOpenRequestJoinDialogBox(false);
            navigate("/projects");
          }}
          handleContinue={SubmitJoinRequest}
          continueText="Submit Request"
          title="Request to Join Project"
          description="You are not a member of this project. To request access, please submit your application by clicking 'Submit Request'."
          buttonType={"default"}
          className={"text-plum-1200"}
        />
      )}
      {openSuccessMessage && (
        <ActionAlert
          isOpen={openSuccessMessage}
          onClose={() => {
            setOpenSuccessMessage(false);
            navigate("/projects");
          }}
          title={"Request Submitted!"}
          description={
            "Your request has been submitted successfully!. You can access the project, once request is aprroved."
          }
        />
      )}
    </>
  );
};

export default Board;
