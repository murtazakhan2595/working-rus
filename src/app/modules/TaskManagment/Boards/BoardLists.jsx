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

const BoardLists = ({ board }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [projectId, setProjectId] = useState(useParams()?.projectId || null);
  const [filterData, setFilterData] = useState({});
  const [AllBoards, setAllBoards] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  console.log(projectId);

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const boardsData = await getAllBoards({
        filterData: { project_id: [board.id] },
      });
      if (isMounted) {
        setAllBoards(boardsData);
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



  return (
    <div>
      {board?.name}

      {isLoading ? (
        <Row>
          <Col lg={12}>
            <PageLoader />
          </Col>
        </Row>
      ) : (
        <Row className="m-0">
         
        </Row>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(BoardLists);
