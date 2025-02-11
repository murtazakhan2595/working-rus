import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { BoardListView, Activities } from "app/modules/TaskManagment/Boards";
import { useParams, useNavigate } from "react-router-dom";
import { getAllBoards } from "app/hooks/taskManagment";
import Err404 from "app/modules/Error/Err404";

const UserCards = ({ projectId = null, userId = null }) => {
  const [AllBoards, setAllBoards] = useState([]);
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

  if (projectId === -1 || !userId) {
    return <Err404 />;
  }
  return (
    <BoardListView
      filterData={filterData}
      projectId={projectId}
      AllBoards={AllBoards}
      reloadData={fetchAllBoards}
      isEditMode={false}
    />
  );
};

export default UserCards;
