import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getAllProjects } from "app/hooks/taskManagment";
import { LeaveAllotmentColumns } from "app/utils/Types/TableColumns";
import { Table, Header, PageLoader } from "components";
import { FilterInput } from "components/form-control";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import { CiCirclePlus } from "react-icons/ci";
import ProjectModel from "./CreateProjectModel";
import { BiDotsVerticalRounded } from "react-icons/bi";
import moment from "moment";
import { getRandomColor } from "utils/getValuesFromTables";
import { EmployeeName } from "utils/getValuesFromTables";
import CustomDropdown from "../sections/CutsomDropdown";
import ViewBoardDetails from "../sections/ViewBoardDetails";
import EditProjectModal from "../sections/EditBoardDetails";
import ConfirmationModal from "../sections/ConfirmationModal";
import { deleteProject } from "app/hooks/taskManagment";


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

  const toggleAddProject = () => {
    setShowProjectModal(!showProjectModal);
  };

  const handleDeleteSuccess = () => {
    fetchData(true);
  };

  return (
    <div className="screen bg-[#F0F1F2] ">
      <Header title="All Projects" />
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
                    <ProjectModel onClose={toggleAddProject} />
                  )}
                  {userProfile.role !== 4 && (
                    <Col lg={4} className="py-3">
                      <RenderProject toggleAddProject={toggleAddProject} onDeleteSuccess={handleDeleteSuccess} />
                    </Col>
                  )}
                  {AllProjects.count > 0 &&
                    AllProjects.results.map((project, index) => (
                      <Col lg={4} key={index} className="py-3">
                        <RenderProject project={project} toggleAddProject={toggleAddProject} onDeleteSuccess={handleDeleteSuccess} />
                      </Col>
                    ))}
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
  const projectMembers = project?.project_members || [];
  const displayedMembers = projectMembers.slice(0, 3);
  const remainingCount = projectMembers.length - displayedMembers.length;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRemainingDropdownOpen, setIsRemainingDropdownOpen] = useState(false);
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

  const EditDetails = () => {
    setIsDropdownOpen(false);
    setIsEditMode(true);
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
    { label: 'Edit Details', onClick: EditDetails },
    { label: 'View Details', onClick: viewDetails },
    { label: 'Delete', onClick: handleDelete },
  ];

  return (
    <div
      className={`${
        project ? 'projectCard-shadow' : 'border border-dark'
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
          <div className="flex justify-between">
            <div>
              <h2 className="text-base font-lato text-[#323333] font-semibold">
                {project?.name}
              </h2>
              <p className="text-[11px] font-lato text-[#989CA6]">
                Created by Hani Hassan |{' '}
                {moment(project?.start_date).format('DD-MM-YY')}
              </p>
            </div>
            <div className="flex -space-x-2.5 h-10">
              {displayedMembers.map((member) => (
                <span
                  className={`${getRandomColor()} font-lato flex justify-center items-center text-[10.5px] font-bold text-[#FAFBFC] w-8 h-8 rounded-full`}
                  key={member}
                >
                  <EmployeeName value={member} length={2} />
                </span>
              ))}
              {remainingCount > 0 && (
                <span
                  className="bg-[#B6E5F9] font-lato flex justify-center items-center text-[10.5px] font-bold text-[#0D2282] w-8 h-8 rounded-full"
                  key="remaining-count"
                >
                  +{remainingCount}
                </span>
              )}
            </div>
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
        <EditProjectModal project={project} onClose={closeModal} />
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
