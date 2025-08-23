import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import BoardListView from "app/modules/TaskManagment/Boards/BoardListView";
import BoardGridView from "app/modules/TaskManagment/Boards/BoardGridView";
import BoardHeader from "app/modules/TaskManagment/Boards/BoardHeader";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getProjectById,
  addProject,
  getAllBoards,
} from "app/hooks/taskManagment";
import TaskEditAddViewDetails from "app/modules/TaskManagment/Boards/TaskEditAddViewDetails";
import AlertDialogue from "components/ui/AlertDialogue";
import ActionAlert from "components/ui/ActionAlert";
import { useSelector , useDispatch} from "react-redux";
import Err404 from "app/modules/Error/Err404";
import { AddNewListModel } from "./Sections";
import { fetchTaskLabels } from "state/slices/TaskManagmentSlice";


const Board = () => {
  const { projectId, taskId, boardId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch()
  // const { activeView } = location.state || {};
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userProfile).id;
  const userRole = useSelector((state) => state.user.userProfile).role;
  const [AllBoards, setAllBoards] = useState([]);
  const isTaskDetailOpen = !!taskId || !!boardId;
  const activeView = localStorage.getItem("boardActiveView") || "grid";
  const [projectData, setProjectData] = useState({});
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);
  const [openRequestJoinDialogBox, setOpenRequestJoinDialogBox] = useState(false);

  const previousFilters = React.useMemo(() => {
    const stored = window.localStorage.getItem("project-filters");
    return stored ? JSON.parse(stored) : null;
  }, []);

  const [filterData, setFilterData] = useState({
    is_subtask: [false],
    is_archive: [false],
  });
  const [showAddNewListModel, setShowAddNewListModel] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    dispatch(fetchTaskLabels(project));
    
    return () => {
      isMounted = false;
    };
  }, [projectId, taskId]);

  useEffect(() => {
    let isMounted = true;
    fetchAllBoards(isMounted);
    return () => {
      isMounted = false;
    };
  }, [projectId, taskId]);

  const fetchData = async (isMounted) => {
    try {
      const projectDetails = await getProjectById(projectId);
      if (isMounted) {
        setProjectData(projectDetails);
        const members = projectDetails?.project_members || [];
        if (userRole === 4 || userRole === 3 || userRole === 2) {
          if (!Array.isArray(members) || !members.includes(userId)) {
            setOpenRequestJoinDialogBox(true);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching project details:", error);
    }
  };

  const fetchAllBoards = async (isMounted) => {
    try {
      const boardsData = await getAllBoards({
        filterData: { project_id: [projectId] },
      });
      if (isMounted) {
        setAllBoards(boardsData);
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
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
      console.error("Error submitting join request:", error);
    }
  };

  const toggleAddBoardModal = () => {
    if (showAddNewListModel) {
      fetchAllBoards(true);
    }
    setShowAddNewListModel(!showAddNewListModel);
  };

  if (projectData === -1) {
    return <Err404 />;
  }
  console.log(activeView, "activeViewactiveView");
  return (
    <>
      {showAddNewListModel && (
        <AddNewListModel
          projectId={projectId}
          setIsOpen={toggleAddBoardModal}
        />
      )}
      <BoardHeader
        setFilterData={setFilterData}
        filterData={filterData}
        projectId={projectId}
        activeView={activeView}
        setActiveView={(viewStyle) => {
          localStorage.setItem("boardActiveView", viewStyle);
          navigate(`/project-board/${projectId}`, {
            state: {
              GOTO_URLS: `/project-board/${projectId}`,
            },
          });
        }}
        projectData={projectData}
        fetchData={fetchData}
      />
      {activeView === "list" ? (
        <BoardListView
          filterData={filterData}
          projectId={projectId}
          AllBoards={AllBoards}
          reloadData={fetchAllBoards}
          toggleAddBoardModal={toggleAddBoardModal}
        />
      ) : (
        <BoardGridView
          filterData={filterData}
          projectId={projectId}
          AllBoards={AllBoards}
          reloadData={fetchAllBoards}
          toggleAddBoardModal={toggleAddBoardModal}
        />
      )}
      {/* Task Detail Modal */}
      {isTaskDetailOpen && <TaskEditAddViewDetails />}
      {openRequestJoinDialogBox && (
        <AlertDialogue
          isOpen={openRequestJoinDialogBox}
          setIsOpen={() => {
            setOpenRequestJoinDialogBox(false);
            navigate("/project-board");
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
            "Your request has been submitted successfully! You can access the project once the request is approved."
          }
        />
      )}
    </>
  );
};

export default Board;
