import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Project } from "app/utils/Types/TaskManagment";
import { Table, Header, PageLoader } from "components";
import { FilterInput } from "components/form-control";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import { getAllBoards, getProjectById } from "app/hooks/taskManagment";
import { CiCirclePlus } from "react-icons/ci";
import ProjectModel from "./CreateProjectModel";
import { JobSortingFilters } from "data/Data";
import moment from "moment";
import { FaPlus } from "react-icons/fa";
import { getRandomColor } from "utils/getValuesFromTables";
import { EmployeeName } from "utils/getValuesFromTables";
import CustomDropdown from "../Sections/CutsomDropdown";
import ViewBoardDetails from "../Sections/ViewBoardDetails";
import EditProjectModal from "../Sections/EditBoardDetails";
import { useParams, Link } from "react-router-dom";
import RenderProject from "./Sections/RenderProject";
import { MembersList } from "../Sections";
import BoardLists from "./BoardLists";

const Board = ({ userProfile }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [projectId, setProjectId] = useState(useParams()?.projectId || null);
  const [projectData, setProjectData] = useState(Project);
  const [filterData, setFilterData] = useState({});
  const [AllBoards, setAllBoards] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
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
  const toggleAddProject = () => {
    setShowProjectModal(!showProjectModal);
  };

  return (
    <div className="screen bg-[#F0F1F2] ">
      <Header title="My Boards" />
      <Row>
        <Col lg={12} className="mx-auto">
          <Card className="p-0">
            <CardBody className="py-3">
              <div className="flex flex-row justify-between">
                <RenderProject projectId={projectId} />
                <div className="flex flex-wrap justify-end gap-2">
                  <MembersList projectMembers={projectData.project_members} />
                  <Link
                    to="/job-post"
                    className="p-2 rounded-md btn btn-dark d-flex gap-1 items-center justify-center"
                  >
                    <FaPlus
                      className="text-white"
                      style={{ fontSize: "1px" }}
                    />
                    Add List
                  </Link>
                  <FilterInput
                    filters={[
                      {
                        type: "sorting",
                        option: JobSortingFilters,
                        name: "sorting",
                        placeholder: "Sort By",
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
                <Row className="m-0">
                  {showProjectModal && (
                    <ProjectModel onClose={toggleAddProject} />
                  )}
                  {AllBoards.count > 0 &&
                    AllBoards.results.map((board, index) => (
                      <Col lg={4} key={index} className="py-3">
                        <BoardLists
                          board={board}
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

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(Board);
