import { connect } from "react-redux";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Project } from "app/utils/Types/TaskManagment";
import { Header, PageLoader, ViewOptions, TableCustom } from "components";
import { FilterInput } from "components/form-control";
import BoardListView from "app/modules/TaskManagment/Boards/BoardListView";
import {
  getAllBoards,
  getProjectById,
  deleteBoard,
  moveTask,
} from "app/hooks/taskManagment";
import { RxPlus } from "react-icons/rx";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  CustomDropdown,
  ProjectBoardColumn,
} from "app/modules/TaskManagment/Sections";
import { AddNewListModel, MembersDropdown, RenderProject } from "./Sections";
import CreateCard from "./CreateCardModal";
import TaskCard from "./Task";
import { ArrowLeft, LayoutGrid, LayoutList } from "lucide-react";
import { DateInput } from "components/form-control";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import AlertDialogue from "components/ui/AlertDialogue";
import { useSelector } from "react-redux";
import { SelectMultiInputComponent } from "components/form-control";
import { PriorityList } from "data/Data";
import { getAllTasks } from "app/hooks/taskManagment";

const BoardGridView = ({ employees, projectId, filterData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [AllBoards, setAllBoards] = useState([]);
  const [showAddNewListModel, setshowAddNewListModel] = useState(false);

  const fetchData = async (isMounted) => {
    // debugger
    try {
      const boardsData = await getAllBoards({
        filterData: { project_id: [projectId] },
      });
      if (isMounted) {
        setAllBoards(boardsData);
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    } finally {
      // if (isMounted) {
      //   setIsLoading(false);
      // }
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const toggleAddBoardModal = () => {
    if (showAddNewListModel) {
      fetchData(true);
    }
    setshowAddNewListModel(!showAddNewListModel);
  };

  return (
    <>
      {showAddNewListModel && (
        <AddNewListModel
          projectId={projectId}
          onClose={toggleAddBoardModal}
          setIsOpen={setshowAddNewListModel}
        />
      )}
      <Card className="p-0 relative overflow-scroll h-[76vh] bg-transparent">
        <CardContent className="py-3">
          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="flex gap-8 mt-5">
              {AllBoards.count > 0 &&
                AllBoards.results.map((board) => (
                  <TaskColumn
                    key={board.id}
                    board={board}
                    projectId={projectId}
                    reloadData={() => {
                      fetchData(true);
                    }}
                    filterData={{
                      ...filterData,
                      board_id: [board.id],
                    }}
                  />
                ))}
              <div className="flex flex-col min-w-[290px] max-w-[320px] mb-5">
                <div className="flex flex-col ">
                  <header className="">
                    <Button
                      variant="outline"
                      type="button"
                      size="lg"
                      className="w-full text-start"
                      onClick={toggleAddBoardModal}
                    >
                      <RxPlus className="text-xl " />
                      <span className="ml-2">Add New List</span>
                    </Button>
                  </header>
                </div>
              </div>

              {/* <Button variant="outline" onClick={toggleAddBoardModal}>Add New List</Button> */}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

const TaskColumn = ({ key, reloadData, board, projectId, filterData }) => {
  const [openCreateCard, setOpenCreateCard] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddNewListModel, setshowAddNewListModel] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const updateTaskLocally = (taskId, updatedData) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      results: prevTasks.results.map((task) =>
        task.id === taskId ? { ...task, ...updatedData } : task
      ),
    }));
  };

  const fetchData = async (isMounted) => {
    try {
      const taskData = await getAllTasks({ filterData });
      if (taskData && isMounted) {
        setTasks(taskData);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);

  const handleDragStart = async (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceBoardId", board.id);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    const sourceBoardId = e.dataTransfer.getData("sourceBoardId");
    if (sourceBoardId !== board.id) {
      await moveTask({ id: taskId, board_id: board.id });
      reloadData();
    }
  };

  const dropdownOptions = [
    {
      label: "Edit",
      onClick: () => setshowAddNewListModel(true),
    },
    {
      label: "Delete",
      onClick: () => setIsDeleteModalOpen(true),
    },
  ];

  const confirmDelete = async () => {
    await deleteBoard(board.id);
    fetchData(true);
    setIsDeleteModalOpen(false);
  };

  return (
    <div
      className="flex flex-col min-w-[320px] max-w-[320px] mb-5"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      key={key}
    >
      <div className="flex flex-col">
        <header className="flex justify-between w-full gap-5 pl-5">
          <div className="flex gap-4">
            <h2 className="flex gap-2 text-base font-bold text-zinc-800">
              <span>{board.name}</span>
            </h2>
          </div>
          <CustomDropdown
            isOpen={isDropdownOpen}
            toggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
            options={dropdownOptions}
          />
        </header>

        <Button
          variant="outline"
          type="button"
          size="lg"
          className="w-full"
          onClick={() => setOpenCreateCard(true)}
        >
          <RxPlus className="text-xl" />
          <span className="ml-2">Add Card</span>
        </Button>
        {tasks &&
          tasks.count > 0 &&
          tasks.results.map((task) => (
            <div key={task.id}>
              <TaskCard
                task={task}
                projectId={projectId}
                boardId={board.id}
                reloadData={() => fetchData(true)}
                onDragStart={handleDragStart}
                onUpdate={updateTaskLocally}
              />
            </div>
          ))}
      </div>

      {openCreateCard && (
        <CreateCard
          onClose={() => {
            setOpenCreateCard(false);
            fetchData(true);
          }}
          boardId={board.id}
          isOpen={openCreateCard}
          projectId={projectId}
          setIsOpen={setOpenCreateCard}
        />
      )}

      {showAddNewListModel && (
        <AddNewListModel
          boardId={board.id}
          onClose={() => {
            setshowAddNewListModel(false);
            fetchData(true);
          }}
          isEditMode
          setIsOpen={setshowAddNewListModel}
        />
      )}

      {isDeleteModalOpen && (
        <AlertDialogue
          isOpen={isDeleteModalOpen}
          setIsOpen={() => setIsDeleteModalOpen(false)}
          handleContinue={confirmDelete}
          title="Confirm Delete"
          description="This action can't be undone. All information associated with this will be lost."
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(BoardGridView);
