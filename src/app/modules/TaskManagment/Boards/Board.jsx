import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Project } from "app/utils/Types/TaskManagment";
import { Table, Header, PageLoader } from "components";
import { FilterInput } from "components/form-control";
import { Card, CardHeader, CardBody, Row, Col, Button } from "reactstrap";
import { getAllBoards, getProjectById } from "app/hooks/taskManagment";
import { CiCirclePlus } from "react-icons/ci";
import ProjectModel from "./CreateProjectModel";
import { JobSortingFilters } from "data/Data";
import moment from "moment";
import { FaPlus } from "react-icons/fa";
import { getRandomColor } from "utils/getValuesFromTables";
import { EmployeeName } from "utils/getValuesFromTables";
import { FiFilter } from "react-icons/fi";
import { RxPlus } from "react-icons/rx";
import EditProjectModal from "../Sections/EditBoardDetails";
import { useParams, Link } from "react-router-dom";
import RenderProject from "./Sections/RenderProject";
import { MembersList } from "../Sections";
import { AddNewListModel } from "./Sections";
import { BsThreeDotsVertical } from "react-icons/bs";

import highpriority from "assets/images/highpriority.svg";
import lowpriority from "assets/images/lowpriority.svg";
import TimeIcon from "assets/images/timeIcon";
import message from "assets/images/message.svg";
import attachmentsIcon from "assets/images/attachments.svg";

const Board = ({ userProfile }) => {
  const [isLoading, setIsLoading] = useState(true);
  const projectId = useParams()?.projectId || null;
  const [projectData, setProjectData] = useState(Project);
  const [filterData, setFilterData] = useState({});
  const [AllBoards, setAllBoards] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAddNewListModel, setshowAddNewListModel] = useState(false);
  console.log(projectId);

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
          <Card className="p-0">
            <CardBody className="py-3">
              {showAddNewListModel && (
                <AddNewListModel
                  projectId={projectId}
                  onClose={toggleAddBoardModal}
                />
              )}
              <div className="flex flex-row justify-between items-center mb-5">
                <RenderProject projectId={projectId} />
                <div className="flex flex-wrap justify-end gap-2">
                  <MembersList
                    projectMembers={projectData?.project_members || null}
                  />
                  <Button
                    onClick={toggleAddBoardModal}
                    className="rounded-md btn-dark d-flex gap-1 items-center justify-center"
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
                        option: JobSortingFilters,
                        name: "sorting",
                        placeholder: (
                          <span className="d-flex justify-center items-center gap-1">
                            <FiFilter /> Filter
                          </span>
                        ),
                        values: filterData,
                        className: "custom-dropdown-toggle-filter",
                        mainHeading: "Sort",
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
                      <TaskColumn key={index} board={board} />
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

const TaskColumn = ({ color, count, board }) => {
  return (
    <div className="flex flex-col min-w-[290px] ">
      <div className="flex flex-col ">
        <header className="flex gap-5 justify-between pl-5 w-full">
          <div className="flex gap-4">
            <h2 className="flex gap-2 text-base font-bold text-zinc-800">
              <div
                className={`shrink-0 my-auto w-2 h-2 ${color} rounded-full`}
              />
              <span>{board.name}</span>
            </h2>
            <span className="justify-center p-0.5 text-sm leading-6 whitespace-nowrap bg-white rounded text-zinc-600">
              {count}
            </span>
          </div>
          <BsThreeDotsVertical className="text-[#757880]" onClick={() => {}} />
        </header>
        <button className="flex gap-2 justify-center items-center px-5 py-2 mt-10 text-base font-medium bg-white rounded border border-solid border-zinc-300 text-zinc-600">
          <RxPlus className=" text-xl" />
          <span>Add Card</span>
        </button>
        {board &&
          board.length > 0 &&
          board.map((card, index) => <TaskCard key={index} {...card} />)}
      </div>
    </div>
  );
};

const TaskCard = ({
  title,
  description,
  dueDate,
  status,
  comments,
  attachments,
  priority,
  project_members,
  completed,
}) => {
  console.log(status, "status");
  const getStatusClass = (status) => {
    switch (status) {
      case "amber":
        return "text-amber-500 bg-orange-100";
      case "red":
        return "text-white bg-red-600";
      default:
        return "bg-neutral-200 text-zinc-600";
    }
  };

  const getPriorityIcon = (priority) => {
    console.log(priority, "priority");
    if (priority === "high") {
      return (
        <div className="flex justify-center items-center px-1.5 pt-1 pb-0.5 rounded-[100px]">
          <img loading="lazy" src={highpriority} alt="" />
        </div>
      );
    }
    return (
      <div className="flex justify-center items-center px-1.5 pt-1 pb-0.5  rounded-[100px]">
        <img loading="lazy" src={lowpriority} alt="" />
      </div>
    );
  };

  return (
    <div className="flex flex-col px-5 pt-5 mt-6 w-full bg-white rounded-lg shadow-sm">
      <div className="flex gap-3 justify-between items-center py-0.5 ">
        {getPriorityIcon(priority)}
        <BsThreeDotsVertical className="text-[#757880]" onClick={() => {}} />
      </div>
      <div className="flex flex-col pb-4 mt-3 border-b border-solid border-zinc-300 text-zinc-800">
        <h3 className="text-base font-bold">{title}</h3>
        <p className="mt-3 text-sm leading-5">{description}</p>
      </div>
      <footer className="flex justify-between py-5">
        <div className="flex gap-1 items-center">
          <div className="flex -space-x-2.5">
            {project_members.slice(0, 2).map((member) => (
              <span
                className={`${getRandomColor()} font-lato flex justify-center items-center text-[7.7px] font-bold text-[#FAFBFC] w-5 h-5 rounded-full`}
                key={member}
              >
                <EmployeeName value={member} length={2} />
              </span>
            ))}
          </div>
          <FaPlus className="text-black p-1 bg-[#e3e3e3] text-center text-xl font-normal rounded-full cursor-pointer" />
        </div>
        <div className="flex gap-2 items-center text-xs text-zinc-600">
          {dueDate && (
            <div
              className={`flex gap-1 justify-center items-center self-stretch px-1.5 py-1 text-xs leading-6 rounded ${getStatusClass(
                status
              )}`}
            >
              <TimeIcon
                color={
                  status === "amber"
                    ? "#FF9A1F"
                    : status === "red"
                    ? "#fff"
                    : "#5C5E64"
                }
              />
              <div className="my-auto">{dueDate}</div>
            </div>
          )}
          {comments !== null && (
            <div className="flex gap-0.5 items-center self-stretch my-auto whitespace-nowrap">
              <img
                loading="lazy"
                src={message}
                className="shrink-0 self-start w-3 aspect-square"
                alt=""
              />
              <div>{comments}</div>
            </div>
          )}
          {attachments !== null && (
            <div className="flex items-center gap-0.5 self-stretch my-auto whitespace-nowrap">
              <img
                loading="lazy"
                src={attachmentsIcon}
                className="shrink-0 self-start w-3 aspect-square"
                alt=""
              />
              <div>{attachments}</div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(Board);
