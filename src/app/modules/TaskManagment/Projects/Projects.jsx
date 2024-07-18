import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getAllProjects, deleteProject } from "app/hooks/taskManagment";
import { LeaveAllotmentColumns } from "app/utils/Types/TableColumns";
import { Header, PageLoader, ConfirmationModal } from "components";
import { FilterInput } from "components/form-control";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import { CiCirclePlus } from "react-icons/ci";
import ProjectModel from "./CreateProjectModel";
import { useNavigate } from "react-router-dom";
import { BiDotsVerticalRounded } from "react-icons/bi";
import moment from "moment";
import { MembersList, CustomDropdown, ViewBoardDetails } from "../Sections";
import { LuFolderX } from "react-icons/lu";


const Projects = ({ userProfile }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [AllProjects, setAllProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const projectsData = await getAllProjects({ filterData });
      if (isMounted) {
        if (userProfile.role === 4) {
          const filteredResults = projectsData.results.filter((project) =>
            project.project_members.includes(userProfile.id)
          );
          const filteredProjectsData = {
            count: filteredResults.length,
            results: filteredResults,
          };
          setAllProjects(filteredProjectsData);
        }
        else
        setAllProjects(projectsData);
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
  }, [filterData]);

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

  const toggleAddProject = (projectId) => {
    if (showProjectModal) {
      fetchData(true);
    }
    setShowProjectModal(projectId ?? !showProjectModal);
  };

  const handleDeleteSuccess = () => {
    fetchData(true);
  };

  return (
    <div className="screen bg-[#F0F1F2] ">
      <Header
        title={`${userProfile.role === 4 ? "My Projects" : "All Projects"}`}
      />
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
                <Row className="m-0">
                  {showProjectModal && (
                    // <ProjectModel onClose={toggleAddProject} />
                    <ProjectModel
                      projectId={showProjectModal || null}
                      isEditMode={typeof showProjectModal === "number"}
                      onClose={() => {
                        toggleAddProject();
                      }}
                    />
                  )}
                  {userProfile.role !== 4 && (
                    <Col lg={4} className="py-3">
                      <RenderProject
                        toggleAddProject={toggleAddProject}
                        onDeleteSuccess={handleDeleteSuccess}
                      />
                    </Col>
                  )}
                  {AllProjects.count > 0 &&
                    AllProjects.results.map((project, index) => (
                      <Col lg={4} key={index} className="py-3">
                        <RenderProject
                          project={project}
                          toggleAddProject={toggleAddProject}
                          onDeleteSuccess={handleDeleteSuccess}
                        />
                      </Col>
                    ))}
                    {
                      AllProjects.count === 0 && (
                        <main className="flex flex-col flex-wrap justify-center content-center items-center self-stretch p-8 text-2xl tracking-tight leading-4 bg-white rounded-xl text-zinc-600 max-md:px-5 h-[75dvh]">
                        <LuFolderX className="w-20 h-20 text-zinc-600" /> 
                        <p className="mt-6">Looks like you don't have any projects</p>
                      </main>
                      )
                    }
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const RenderProject = ({ project, toggleAddProject, onDeleteSuccess }) => {
  const navigate = useNavigate();
  const projectMembers = project?.project_members || [];
  const displayedMembers = projectMembers.slice(0, 3);
  const remainingCount = projectMembers.length - displayedMembers.length;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isViewBoardDetails, setIsViewBoardDetails] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const closeModal = () => {
    setIsViewBoardDetails(false);
    setIsEditMode(false);
  };

  const viewDetails = () => {
    setIsDropdownOpen(false);
    setIsViewBoardDetails(true);
  };

  const handleDelete = () => {
    setIsDropdownOpen(false);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    const response = await deleteProject(project.id);
    if (response && response.status === 200) {
      onDeleteSuccess();
    }
    setIsDeleteModalOpen(false);
  };
  const dropdownOptions = [
    {
      label: "Edit Details",
      onClick: () => {
        toggleAddProject(parseInt(project.id));
      },
    },
    { label: "View Details", onClick: viewDetails },
    { label: "Delete", onClick: handleDelete },
  ];

  const navigateToBoard = () => {
    navigate(`/project-board/${project.id}`);
  };

  return (
    <div
      className={`${
        project ? "projectCard-shadow" : "border border-dark"
      } rounded h-100 flex justify-center items-center`}
    >
      {project ? (
        <div className="bg-[#FAFBFC] rounded-[10px] p-4 flex flex-col space-y-4 w-full relative">
          <div className="flex justify-between">
            <img
              className="w-20 h-20 rounded-full object-cover"
              src="https://via.placeholder.com/180"
              alt="Profile"
            />
            <CustomDropdown
              isOpen={isDropdownOpen}
              toggleDropdown={toggleDropdown}
              options={dropdownOptions}
            />
          </div>
          <div
            className="flex justify-between"
            onClick={() => {
              navigateToBoard();
            }}
          >
            <div>
              <h2 className="text-base font-lato text-[#323333] font-semibold">
                {project?.name}
              </h2>
              <p className="text-[11px] font-lato text-[#989CA6]">
                Created by Hani Hassan |{" "}
                {moment(project?.start_date).format("DD-MM-YY")}
              </p>
            </div>
            <MembersList members={projectMembers} />
          </div>
        </div>
      ) : (
        <div
          className="flex items-center justify-center flex-col cursor-pointer"
          onClick={() => {
            toggleAddProject();
          }}
        >
          <CiCirclePlus className="w-[30px] h-[30px]" />
          <span>Add New Project</span>
        </div>
      )}
      {isViewBoardDetails && project && (
        <ViewBoardDetails
          project={project}
          onClose={closeModal}
          onEdit={() => setIsEditMode(true)}
          setIsEditMode={setIsEditMode}
        />
      )}
      {isEditMode && project && (
        <ProjectModel
          projectId={project.id}
          isEditMode={true}
          onClose={closeModal}
        />
      )}
      {isDeleteModalOpen && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={confirmDelete}
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

export default connect(mapStateToProps)(Projects);
