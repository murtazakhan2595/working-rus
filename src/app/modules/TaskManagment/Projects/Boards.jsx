import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Table, Header, PageLoader } from "components";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import { getRandomColor } from "utils/getValuesFromTables";
import { EmployeeName } from "utils/getValuesFromTables";
import CustomBoardDropdown from "../Sections/CustomBoardDropdown";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RxPlus } from "react-icons/rx";
import highpriority from "assets/images/highpriority.svg";
import lowpriority from "assets/images/lowpriority.svg";
import { FaPlus } from "react-icons/fa";
import TimeIcon from "assets/images/timeIcon";
import message from "assets/images/message.svg";
import attachmentsIcon from "assets/images/attachments.svg";
import AddNewListModel from "./AddNewListModel";
import { FiFilter } from "react-icons/fi";

const Projects = ({ userProfile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddNewListModel, setshowAddNewListModel] = useState(false);
  const [project, setProject] = useState("HRMS");
  const columns = [
    {
      title: "To Do",
      color: "bg-red-600",
      count: 3,
      cards: [
        {
          title: "Wireframing",
          description:
            "Create low-fidelity designs that outlines the basic structure and layout of the product or service...",
          dueDate: "June 24",
          status: "amber",
          comments: 0,
          attachments: 0,
          priority: "low",
          project_members: [100, 200, 300],
        },
        {
          title: "Wireframing",
          description:
            "Create low-fidelity designs that outlines the basic structure and layout of the product or service...",
          dueDate: "June 28",
          status: "neutral",
          comments: 0,
          attachments: 0,
          priority: "medium",
          project_members: [100, 200, 300],
        },
        {
          title: "Wireframing",
          description:
            "Create low-fidelity designs that outlines the basic structure and layout of the product or service...",
          dueDate: null,
          status: null,
          comments: null,
          attachments: null,
          priority: "high",
          project_members: [100, 200, 300],
        },
      ],
    },
    {
      title: "In Progress",
      color: "bg-blue-600",
      count: 1,
      cards: [
        {
          title: "HRMS Dtr Screen",
          description:
            "Create low-fidelity designs that outlines the basic structure and layout of the product or service...",
          dueDate: "July 1",
          status: "neutral",
          comments: 0,
          attachments: 2,
          priority: "high",
          project_members: [100, 200, 300],
        },
      ],
    },
    {
      title: "To Review",
      color: "bg-yellow-400",
      count: 2,
      cards: [
        {
          title: "Wireframing",
          description:
            "Create low-fidelity designs that outlines the basic structure and layout of the product or service...",
          dueDate: "June 21",
          status: "red",
          comments: 0,
          attachments: 0,
          priority: "low",
           project_members:[100,200,300]
        },
        {
          title: "Wireframing",
          description:
            "Create low-fidelity designs that outlines the basic structure and layout of the product or service...",
          dueDate: "July 1",
          status: "neutral",
          comments: 0,
          attachments: 0,
          priority: "medium",
           project_members:[100,200,300]
        },
      ],
    },
    {
      title: "Completed",
      color: "bg-lime-500",
      count: 1,
      cards: [
        {
          title: "Wireframing",
          description:
            "Create low-fidelity designs that outlines the basic structure and layout of the product or service...",
          dueDate: "June 13",
          status: "neutral",
          comments: 0,
          attachments: 0,
          completed: true,
          priority: "high",
           project_members:[100,200,300]
        },
      ],
    },
  ];
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleAddProjectModal = () => {
    setshowAddNewListModel(!showAddNewListModel);
  };
  const projects = [
    { label: "HRMS", onClick: () => setProject("HRMS")},
    { label: "Food app", onClick: () => setProject("Food app")},
    { label: "Website revamp", onClick: () => setProject("Website revamp")},
  ];
  return (
    <div className="screen bg-[#F0F1F2] ">
     
      <Header title="My Boards" />
      <Row>
        <Col lg={12} className="mx-auto">
          <Card className="p-0">
            <CardBody className="py-3">
              {isLoading ? (
                <Row>
                  <Col lg={12}>
                    <PageLoader />
                  </Col>
                </Row>
              ) : (
                <Row className="m-0 flex gap-10">
                  {showAddNewListModel && (
                    <AddNewListModel onClose={toggleAddProjectModal} />
                  )}
                  <div className="flex gap-5 justify-between max-md:flex-wrap">
                    <div className="flex gap-5 justify-between py-2 text-xl font-bold leading-7 whitespace-nowrap border-b border-solid border-zinc-300 text-zinc-800">
                      <div className="flex gap-5 justify-between">
                        <div className="justify-center px-5 py-1.5">
                          {project}
                        </div>
                        <CustomBoardDropdown
                          isOpen={isDropdownOpen}
                          toggleDropdown={toggleDropdown}
                          projects={projects}
                        />
                      </div>
                    </div>
                    <div className="flex gap-5 justify-between items-center self-start px-5 mt-1.5">
                      <div className="flex justify-center items-center self-stretch my-auto">
                        {/* members list here */}
                      </div>
                      <button
                        className="flex gap-2 justify-center items-center self-stretch px-3 py-2 text-base font-medium tracking-tight text-white bg-black rounded"
                        onClick={toggleAddProjectModal}
                      >
                        <RxPlus className="text-white" />
                        <span>Add List</span>
                      </button>
                      <button className="flex items-center gap-2 self-stretch px-2 py-1 my-auto text-base font-semibold leading-6 whitespace-nowrap rounded-lg border border-solid border-zinc-600 text-zinc-600">
                        <div className=" px-1 text-gray-400">
                          <FiFilter />
                        </div>
                        <span>Filter</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-5 overflow-x-auto">
                    {columns.map((column, index) => (
                      <TaskColumn key={index} {...column} />
                    ))}
                  </div>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const TaskColumn = ({ title, color, count, cards }) => {
  console.log("cards", cards)
  return (
    <div className="flex flex-col min-w-[290px] ">
      <div className="flex flex-col ">
        <header className="flex gap-5 justify-between pl-5 w-full">
          <div className="flex gap-4">
            <h2 className="flex gap-2 text-base font-bold text-zinc-800">
              <div
                className={`shrink-0 my-auto w-2 h-2 ${color} rounded-full`}
              />
              <span>{title}</span>
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
        {cards.map((card, index) => (
          <TaskCard key={index} {...card} />
        ))}
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
    console.log(priority, "priority")
    if (priority === "high") {
      return (
        <div className="flex justify-center items-center px-1.5 pt-1 pb-0.5 rounded-[100px]">
          <img loading="lazy" src={highpriority} alt="" />
        </div>
      );
    }
    return (
      <div className="flex justify-center items-center px-1.5 pt-1 pb-0.5  rounded-[100px]">
        <img
          loading="lazy"
          src={lowpriority}
          alt=""
        />
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




export default connect(mapStateToProps)(Projects);
