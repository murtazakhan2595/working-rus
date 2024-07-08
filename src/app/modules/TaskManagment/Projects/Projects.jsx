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

  return (
    <div className="screen bg-[#F0F1F2]">
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
                      <RenderProject toggleAddProject={toggleAddProject} />
                    </Col>
                  )}
                  {AllProjects.count > 0 &&
                    AllProjects.results.map((project, index) => (
                      <Col lg={4} key={index} className="py-3">
                        <RenderProject
                          project={project}
                          toggleAddProject={toggleAddProject}
                        />
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

const RenderProject = ({ project, toggleAddProject }) => {
  return (
    <div
      className={`${
        project ? "shadow" : "border border-dark"
      } rounded h-100 flex justify-center p-3 items-center`}
    >
      {project ? (
        <div>
          <img src={project.image} alt="project" />
          <h2>{project.name}</h2>
          <p dangerouslySetInnerHTML={{ __html: project.description }} />
        </div>
      ) : (
        <div
          className="flex items-center flex-col cursor-pointer"
          onClick={() => {
            toggleAddProject();
          }}
        >
          <CiCirclePlus className="w-[30px] h-[30px]" />
          <span>Add New Project</span>
        </div>
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
