import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getAllProjects, deleteProject } from "app/hooks/taskManagment";
import { Header, PageLoader, ConfirmationModal } from "components";
import { CiCirclePlus } from "react-icons/ci";
import ProjectForm from "./ProjectForm";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import ViewBoardDetails from "./ViewBoardDetails";
import { MembersList, CustomDropdown } from "../Sections";
import { LuFolderX } from "react-icons/lu";
import { EmployeeName } from "utils/getValuesFromTables";
import { fetchProjects } from "state/slices/CommonSlice";
import { useDispatch } from "react-redux";
import CreateEditProject from "./CreateEditProject";
import { Badge } from "components/ui/badge";
import logo from "../../../../assets/images/tecbrix-logo.png";
import {
  CardContent,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { Clock, Layout, ListTodo } from "lucide-react";
import AlertDialogue from "components/ui/AlertDialogue";
import TableCustom from "components/CustomTable";
import { projectBoard } from "app/utils/Types/TableColumns";

const Projects = ({ userProfile }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [AllProjects, setAllProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const onPageChange = (name, value) => {
    const pageOptions = options;
    if (pageOptions[name] !== value) {
      pageOptions[name] = value;
      setOptions((prevOptions) => ({ ...prevOptions, ...pageOptions }));
    }
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const projectsData = await getAllProjects({ filterData }, userProfile);
      console.log(projectsData, "PROJECTS DATA IS HERE")
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

  const toggleAddProject = (projectId) => {
    if (showProjectModal) {
      fetchData(true);
      dispatch(fetchProjects(userProfile));
    }
    setShowProjectModal(projectId ?? !showProjectModal);
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "table" ? "grid" : "table"));
  };

  console.log(AllProjects?.results, "TEST KASHIF");

  return (
    <div>
      <Header
        content={
          <>
          <button onClick={toggleViewMode} className="mb-4 p-2">
          <Layout />
        </button>
          <CreateEditProject
            isEditMode={false}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            reload={fetchData}
          />
          </>
        }
      />

      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          {viewMode === "table" && userProfile.role !== 4 && (
            <RenderProject
              toggleAddProject={toggleAddProject}
              fetchData={fetchData}
            />
          )}
          {viewMode === "table" ? (
            <Card>
              <CardContent>
                <TableCustom
                  columns={projectBoard}
                  data={AllProjects?.results || []}
                  pagination={false}
                  dataTotalSize={AllProjects?.length || 0}
                  tableOptions={tableOptions}
                  dataStyle={{ backgroundColor: "white" }}
                />
              </CardContent>
            </Card>
          ) : AllProjects?.count > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 gap-4">
              {AllProjects.results.map((project, index) => (
                <RenderProject
                  project={project}
                  toggleAddProject={toggleAddProject}
                  fetchData={fetchData}
                />
              ))}
            </div>
          ) : (
            <main className="flex flex-col flex-wrap justify-center content-center items-center self-stretch p-8 text-2xl tracking-tight leading-4 bg-white rounded-xl text-zinc-600 max-md:px-5 h-[75dvh]">
              <LuFolderX className="w-20 h-20 text-zinc-600" />
              <p className="mt-6">Looks like you don't have any projects</p>
            </main>
          )}
        </>
      )}
    </div>
  );
};

const RenderProject = ({ project, toggleAddProject, fetchData }) => {
  const navigate = useNavigate();
  const projectMembers = project?.project_members || [];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isViewBoardDetails, setIsViewBoardDetails] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  console.log(project, "PROJECT");

  const viewDetails = () => {
    setIsDropdownOpen(false);
    setIsViewBoardDetails(true);
  };

  const navigateToBoard = () => {
    navigate(`/project-board/${project.id}`);
  };

  const closeModal = () => {
    setIsViewBoardDetails(false);
    setIsEditMode(false);
  };

  return (
    <Card>
      {project && (
        <>
          <CardHeader className={`m-2 bg-gray-500`} onClick={viewDetails}>
            <CardTitle>
              <Badge
                variant="dot"
                className="text-sm bg-green-100 text-green-700"
              >
                {project?.status || "Ongoing"}
              </Badge>
            </CardTitle>
            <div className="flex justify-center">
              <img
                src={project?.profile?.file || logo}
                alt={project.name}
                className="h-10 mb-3"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div onClick={navigateToBoard}>
              <h3 className="text-lg font-semibold mb-2 text-[#11182c]">
                {project.name}
              </h3>
              <div className="flex text-gray-500 text-sm mb-4 gap-1">
                <ListTodo size={18} />
                <span className="ml-2 font-semibold">
                  {project?.task_count}
                </span>
                Tasks
              </div>
            </div>
          </CardContent>
          <div className="border border-gray-400 m-2" />
          <CardFooter className="flex justify-between">
            <div className="text-gray-400 text-sm flex justify-center gap-2">
              {" "}
              <Clock /> {moment(project.start_date).format("MMM D, YYYY")}
            </div>
            <MembersList members={project?.project_members || []} />
          </CardFooter>
        </>
      )}
      {isViewBoardDetails && project && (
        <ViewBoardDetails
          project={project}
          onClose={closeModal}
          setIsEditMode={setIsEditMode}
          isOpen={isViewBoardDetails}
          setIsOpen={setIsViewBoardDetails}
          fetchData={fetchData}
        />
      )}
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
  };
};

export default connect(mapStateToProps)(Projects);
