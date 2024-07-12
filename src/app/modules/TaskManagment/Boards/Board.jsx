import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Project } from "app/utils/Types/TaskManagment";
import { Header, PageLoader } from "components";
import { FilterInput } from "components/form-control";
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import {
  getAllBoards,
  getProjectById,
  getTaskByBoardId,
} from "app/hooks/taskManagment";
import { TaskSortingFilters } from "data/Data";
import { FaPlus } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { RxPlus } from "react-icons/rx";
import { useParams, Link } from "react-router-dom";
import RenderProject from "./Sections/RenderProject";
import { CustomDropdown } from "../Sections";
import { AddNewListModel, MembersDropdown } from "./Sections";
import { BsThreeDotsVertical } from "react-icons/bs";
import highpriority from "assets/images/highpriority.svg";
import lowpriority from "assets/images/lowpriority.svg";
import TimeIcon from "assets/images/timeIcon";
import message from "assets/images/message.svg";
import attachmentsIcon from "assets/images/attachments.svg";

import CreateCard from "./CreateCardModal";
import TaskCard from "./Task";
import { getRandomColor } from "utils/getValuesFromTables";

const Board = ({ userProfile }) => {
  const [isLoading, setIsLoading] = useState(true);
  const projectId = useParams()?.projectId || null;
  const [projectData, setProjectData] = useState(Project);
  const [filterData, setFilterData] = useState({});
  const [AllBoards, setAllBoards] = useState([]);
  const [showAddNewListModel, setshowAddNewListModel] = useState(false);
  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const boardsData = await getAllBoards({
        filterData: { project_id: [projectId] },
      });
      const projectDetails = await getProjectById(projectId);
      if (isMounted) {
        setAllBoards(boardsData );
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

  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };
  const toggleAddBoardModal = () => {
    if (showAddNewListModel) {
      fetchData(true);
    }
    setshowAddNewListModel(!showAddNewListModel);
  };

  return (
    <div className="screen bg-[#F0F1F2] ">
      <Header title="My Boards" />
      <Row>
        <Col lg={12} className="mx-auto">
          <Card className="p-0" style={{background:"#FAFBFC"}}>
            <CardBody className="py-3">
              {showAddNewListModel && (
                <AddNewListModel
                  projectId={projectId}
                  onClose={toggleAddBoardModal}
                />
              )}
              <div className="flex flex-row justify-between items-center mb-5">
                <RenderProject projectId={projectId} />
                <div className="flex flex-wrap justify-end gap-2 items-center">
                  <MembersDropdown
                    members={projectData?.project_members || []}
                  />
                  <Button
                    onClick={toggleAddBoardModal}
                    className="rounded-md btn-dark d-flex gap-1 items-center justify-center h-[37.6px]"
                  >
                    <FaPlus
                      className="text-white"
                      style={{ fontSize: "12px" }}
                    />
                    Add List
                  </Button>
                  <FilterInput
                    filters={[
                      {
                        type: "sorting",
                        option: TaskSortingFilters,
                        name: "sorting",
                        placeholder: (
                          <span className="d-flex justify-center items-center gap-1">
                            <FiFilter /> Filter
                          </span>
                        ),
                        values: filterData,
                        className: "custom-dropdown-toggle-filter",
                        mainHeading: "Manage Filters",
                      },
                    ]}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
              {isLoading ? (
                <Row>
                  <Col lg={12}>
                    <PageLoader />
                  </Col>
                </Row>
              ) : (
                <div className="flex gap-5 overflow-x-auto">
                  {AllBoards.count > 0 &&
                    AllBoards.results.map((board, index) => (
                      <TaskColumn
                        key={index}
                        board={board}
                        projectId={projectId}
                      />
                    ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const TaskColumn = ({ color, count, board, projectId }) => {
  console.log(board.id, projectId)
  const [openCreateCard, setOpenCreateCard] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddNewListModel, setshowAddNewListModel] = useState(false);

  const fetchData = async (isMounted) => {
    try {
      const TaskData = await getTaskByBoardId({
        filterData: { board_id: [board.id] },
      });
      if (isMounted) {
        setTasks(TaskData);
      }
    } catch (error) {
      console.error("Error fetching employeeLeaveTypes:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

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
        console.log("hk");
      },
    },
  ];

  console.log(tasks, "status");


  return (
    <div className="flex flex-col min-w-[290px] mb-5">
      <div className="flex flex-col ">
        <header className="flex gap-5 justify-between pl-5 w-full">
          <div className="flex gap-4">
            <h2 className="flex gap-2 text-base font-bold text-zinc-800">
              <div
                className={`shrink-0 my-auto w-2 h-2 ${getRandomColor()} rounded-full`}
              />
              <span>{board.name}</span>
            </h2>
            <span className="justify-center flex text-sm bg-white text-zinc-600 w-[22px] h-[22px]">
              {tasks?.count}
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
          className="flex gap-2 justify-center items-center px-5 py-2 mt-10 text-base font-medium bg-white rounded border border-solid border-zinc-300 text-zinc-600"
          onClick={() => {
            setOpenCreateCard(true);
          }}
        >
          <RxPlus className=" text-xl" />
          <span>Add Card</span>
        </button>
        {tasks &&
          tasks.count > 0 &&
          tasks.results.map((task, index) => (
            <TaskCard key={index} task={task} projectId={projectId} boardId={board.id}/>
          ))}
      </div>
      {openCreateCard && (
        <CreateCard
          onClose={() => setOpenCreateCard(false)}
          boardId={board.id}
          projectId={projectId}
        />
      )}
      {showAddNewListModel && (
        <AddNewListModel
          boardId={board.id}
          onClose={() => {
            setshowAddNewListModel(false);
          }}
          isEditMode={true}
        />
      )}
    </div>
  );
};


const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(Board);
