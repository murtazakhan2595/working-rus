import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Project } from "app/utils/Types/TaskManagment";
import { Header, PageLoader } from "components";
import { FilterInput } from "components/form-control";
// import { Card, CardBody, Row, Col, Button } from "reactstrap";
import {
  getAllBoards,
  getProjectById,
  getTaskByBoardId,
  deleteBoard,
  moveTask,
} from "app/hooks/taskManagment";
import { FaPlus } from "react-icons/fa";
import { RxPlus } from "react-icons/rx";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CustomDropdown } from "../Sections";
import {
  AddNewListModel,
  MembersDropdown,
  TaskSortingFilters,
  RenderProject,
} from "./Sections";
import CreateCard from "./CreateCardModal";
import TaskCard from "./Task";
import { getRandomColor } from "utils/renderValues";
import { ArrowLeft, LayoutList } from "lucide-react";
import { DateInput } from "components/form-control";
import { ClaimExpenseTypeOptions } from "data/Data";
import { Button } from "components/ui/button";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import SheetComponent from "components/ui/SheetComponent";
import CreateAndEditCardForm from "./Sections/CreateAndEditCardForm";
import TableCustom from "components/CustomTable";
import AlertDialogue from "components/ui/AlertDialogue";

const Board = ({ employees }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState(null);
  const projectId = useParams()?.projectId || null;
  const [projectData, setProjectData] = useState(Project);
  const [filterData, setFilterData] = useState({});
  const [AllBoards, setAllBoards] = useState([]);
  const [filterList, setFilterList] = useState([]);
  const [showAddNewListModel, setshowAddNewListModel] = useState(false);

  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      console.log(updatedFilters, "UPDATED FILTERS")
      return updatedFilters;
    });
  };

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const boardsData = await getAllBoards({
        filterData: { project_id: [projectId] },
      });
      const projectDetails = await getProjectById(projectId);
      if (isMounted) {
        setAllBoards(boardsData);
        setProjectData(projectDetails);
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // useEffect(() => {
  //   if (employees && employees.length > 0) {
  //     setFilterList(TaskSortingFilters(employees));
  //   }
  // }, [employees]);

  // const handleFilterChange = (filterName, filterValue, filterCheckStatus) => {
  //   setFilterData((prevFilters) => {
  //     debugger;
  //     const updatedFilters = { ...prevFilters };
  //     if (!filterValue || filterCheckStatus === false) {
  //       delete updatedFilters[filterName];
  //     } else {
  //       if (
  //         filterName !== "assigned_to" &&
  //         filterName !== "label" &&
  //         filterName !== "end_datefilterValue" &&
  //         filterName !== "priority"
  //       ) {
  //         if (updatedFilters.optionsValues) {
  //           if (updatedFilters.optionsValues.includes(filterValue)) {
  //             updatedFilters.optionsValues =
  //               updatedFilters.optionsValues.filter(
  //                 (item) => item !== filterValue
  //               );
  //           } else updatedFilters.optionsValues.push(filterValue);
  //         } else updatedFilters.optionsValues = [filterValue];
  //       }
  //       else if (filterName === "assigned_to" && filterValue === "noMemberSelected") {
  //         updatedFilters[filterName] =
  //           filterCheckStatus === false ? "" : filterValue;
  //         updatedFilters.optionsValues = null;
  //       } else
  //         updatedFilters[filterName] =
  //           filterCheckStatus === false ? "" : filterValue;
  //     }
  //     return updatedFilters;
  //   });
  // };

  const toggleAddBoardModal = () => {
    if (showAddNewListModel) {
      fetchData(true);
    }
    setshowAddNewListModel(!showAddNewListModel);
  };


  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-4 text-xl text-balance"
        >
          <ArrowLeft className="w-6 h-6 mr-2 bg-white rounded-lg shadow-sm" />
        </Button>
          <RenderProject projectId={projectId} />
          </div>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={toggleAddBoardModal}>
            Add New List
          </Button>
          <FilterInput
            filters={[
              {
                type: "select-one",
                option: ClaimExpenseTypeOptions,
                name: "expense_type",
                placeholder: "Filters",
              },
            ]}
            onChange={handleFilterChange}
          />
          <DateInput
            placeholder="Date"
            value={filterDate}
            className="flex items-center align-middle"
            name="start_date"
            onChange={(field, value) => {
              setFilterDate(value);
              handleFilterChange(field, value);
            }}
          />
          <MembersDropdown members={projectData?.project_members || []} />

          <LayoutList size={18} />
        </div>
      </div>

      <Card className="p-0 bg-white" style={{ background: "#FAFBFC" }}>
        <CardContent className="py-3">
          {showAddNewListModel && (
            <AddNewListModel
              projectId={projectId}
              onClose={toggleAddBoardModal}
              setIsOpen={setshowAddNewListModel}
            />
          )}

          {isLoading ? (
            <PageLoader />
          ) : (
            <div className="flex gap-5 mt-5 overflow-x-auto">
              {AllBoards.count > 0 ? (
                AllBoards.results.map((board, index) => (
                  <TaskColumn
                    key={index}
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
                ))
              ) : (
                <div className="mt-3 mb-5 text-center w-100">
                  Project Board is empty
                </div>
              )}
          {/* <Button variant="outline" onClick={toggleAddBoardModal}>Add New List</Button> */}

            </div>

          )}

        </CardContent>
      </Card>

      {/* <TableCustom

      /> */}
    </>
  );
};

const TaskColumn = ({ reloadData, board, projectId, filterData }) => {
  const [openCreateCard, setOpenCreateCard] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddNewListModel, setshowAddNewListModel] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const fetchData = async (isMounted) => {
    try {
      const TaskData = await getTaskByBoardId({ filterData });
      if (isMounted) {
        setTasks(TaskData);
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

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
    e.dataTransfer.setData("sourceBoardId", board.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
      onClick: () => {
        setshowAddNewListModel(true);
      },
    },
    {
      label: "Delete",
      onClick: () => {
        setIsDeleteModalOpen(true);
      },
    },
  ];

  const confirmDelete = async () => {
    await deleteBoard(board.id);
    reloadData();
    setIsDeleteModalOpen(false);
  };

  const formSheetData = {
    triggerText: null,
    title: "Add Card",
    description: null,
    footer: null,
  };

  return (
    <div
      className="flex flex-col min-w-[290px] max-w-[320px] mb-5"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col ">
        <header className="flex justify-between w-full gap-5 pl-5">
          <div className="flex gap-4">
            <h2 className="flex gap-2 text-base font-bold text-zinc-800">
              <div
                className={`shrink-0 my-auto w-2 h-2 ${getRandomColor(
                  board.name?.charAt(0)
                )} rounded-full`}
              />
              <span>{board.name}</span>
            </h2>
            <span className="justify-center flex text-sm bg-white text-zinc-600 w-[22px] h-[22px]">
              {tasks?.count || 0}
            </span>
          </div>

          <CustomDropdown
            isOpen={isDropdownOpen}
            toggleDropdown={() => {
              setIsDropdownOpen(!isDropdownOpen);
            }}
            options={dropdownOptions}
          />
        </header>
        <button
          className="flex items-center justify-center gap-2 px-5 py-2 mt-10 text-base font-medium bg-white border border-solid rounded border-zinc-300 text-zinc-600"
          onClick={() => {
            setOpenCreateCard(true);
          }}
        >
          <RxPlus className="text-xl " />
          <span>Add Card</span>
        </button>
        {tasks &&
          tasks.count > 0 &&
          tasks.results.map((task, index) => (
            <TaskCard
              key={index}
              task={task}
              projectId={projectId}
              boardId={board.id}
              reloadData={() => {
                fetchData(true);
              }}
              onDragStart={handleDragStart}
            />
          ))}
      </div>

      <SheetComponent
      {...formSheetData}
      isOpen={openCreateCard}
      setIsOpen={setOpenCreateCard}
    
      >
          <CreateCard
          onClose={() => {
            setOpenCreateCard(false);
            reloadData();
          }}
          boardId={board.id}
          projectId={projectId}
          setIsOpen={setOpenCreateCard}
          />
      </SheetComponent>
      {showAddNewListModel && (
        
        <AddNewListModel
          boardId={board.id}
          onClose={() => {
            setshowAddNewListModel(false);
            reloadData();
          }}
          isEditMode={showAddNewListModel}
          setIsOpen={setshowAddNewListModel}
        />
      )}
      {isDeleteModalOpen && (
        <AlertDialogue
          isOpen={isDeleteModalOpen}
          setIsOpen={()=> setIsDeleteModalOpen(false)}
          handleContinue={confirmDelete}
          title="Confirm Delete"
          description="This action can't be undone. All information associated with this
            will be lost."
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

export default connect(mapStateToProps)(Board);
