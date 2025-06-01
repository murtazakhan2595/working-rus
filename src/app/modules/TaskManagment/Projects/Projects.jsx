import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getAllProjects } from "app/hooks/taskManagment";
import { Header, PageLoader } from "components";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { MembersList } from "../Sections";
import { LuFolderX } from "react-icons/lu";
import { useSelector, useDispatch } from "react-redux";
import { fetchProjects } from "state/slices/CommonSlice";
import CreateEditProject from "./CreateEditProject";
import { Badge } from "components/ui/badge";
import logo from "assets/images/tecbrix-logo.png";
import {
  CardContent,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import { LayoutGrid, ListTodo, TableOfContents, Clock } from "lucide-react";
import TableCustom from "components/CustomTable";
import { ProjectColumn } from "app/modules/TaskManagment/Sections/TaskManagementTableColumns";
import { Button } from "components/ui/button";
import { ProjectStatusList } from "data/Data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import { HasAccess } from "utils/PermissionUtils";

const Projects = ({ userProfile }) => {
  const dispatch = useDispatch();
  const isEditProjectsPermitted = HasAccess("EDIT_PROJECTS");
  const isViewAllProjectsPermitted = HasAccess("VIEW_ALL_PROJECTS");
  const isAddProjectsPermitted = HasAccess("ADD_PROJECTS");
  const userId = userProfile?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState(
    !isViewAllProjectsPermitted ? { project_members: [userId] } : {}
  );
  const [viewProject, setViewProject] = useState(false);
  const [AllProjects, setAllProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
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
    onRowClick: (row) => {
      if (isEditProjectsPermitted) setViewProject(row);
    },
  };

  const fetchData = async (isMounted) => {
    setViewProject(null);
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

  return (
    <div>
      <Header
        content={
          isAddProjectsPermitted && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(true);
              }}
            >
              Add Project
            </Button>
          )
        }
      />
      {isOpen && (
        <CreateEditProject
          isEditMode={false}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          reload={fetchData}
        />
      )}

      {isLoading ? (
        <PageLoader />
      ) : (
        <>
          <div className="flex flex-row justify-end w-full gap-4">
            <button onClick={toggleViewMode} className="mb-4 p-2 ">
              {viewMode === "table" ? <LayoutGrid /> : <TableOfContents />}
            </button>
          </div>

          {viewMode === "table" ? (
            <Card>
              <CardContent>
                <TableCustom
                  columns={ProjectColumn}
                  data={AllProjects?.results || []}
                  pagination={false}
                  dataTotalSize={AllProjects?.length || 0}
                  tableOptions={tableOptions}
                  dataStyle={{ backgroundColor: "white" }}
                />
              </CardContent>
              {viewProject && (
                <CreateEditProject
                  project={viewProject}
                  isEditMode={!!viewProject}
                  isOpen={!!viewProject}
                  setIsOpen={() => {
                    setViewProject(null);
                  }}
                  reload={fetchData}
                />
              )}
            </Card>
          ) : AllProjects?.count > 0 ? (
            <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 gap-4">
              {AllProjects.results.map((project, index) => (
                <RenderProject
                  project={project}
                  toggleAddProject={toggleAddProject}
                  fetchData={fetchData}
                  isEditProjectsPermitted={isEditProjectsPermitted}
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

const getStatusDotColor = (status) => {
  switch (status) {
    case "on_going":
      return "bg-yellow-500";
    case "On_hold":
      return "bg-red-500";
    case "completed":
      return "bg-emerald-500";
    case "closed":
      return "bg-mauve-900";
    default:
      return "bg-plum-1100";
  }
};

const RenderProject = ({ project, fetchData = () => {}, isEditProjectsPermitted }) => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const navigateToBoard = () => {
    navigate(`/project-board/${project.id}`);
  };

  const handleProjectClick = (event) => {
    event.preventDefault();
    if (isEditProjectsPermitted) setIsEditMode(true);
  };
  return (
    <Card className="rounded-lg">
      {project && (
        <>
          <CardHeader
            className="m-2 p-2 cursor-pointer rounded-lg bg-gray-500 transition-all duration-300 hover:opacity-90 hover:shadow-md"
            style={project?.color ? { backgroundColor: project.color } : {}}
            onClick={handleProjectClick}
          >
            <CardTitle>
              <div className="flex justify-between py-1 pr-3 pb-4">
                <Badge
                  variant="dot-plum"
                  className="py-1 px-3 text-sm"
                  dot={`${getStatusDotColor(project?.status)}`}
                >
                  {ProjectStatusList.find(
                    (obj) => obj.value === project?.status
                  )?.label || "On Going"}
                </Badge>
              </div>
            </CardTitle>
            <div className="flex justify-center">
              <img
                src={project?.profile_img || logo}
                alt={project.name}
                className="h-12 mb-3 transition-transform duration-300 hover:scale-105"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div onClick={navigateToBoard} className="cursor-pointer">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-2 text-neutral-1200">
                  {project.name}
                </h3>
              </div>
              <div className="flex text-neutral-1100 text-sm mb-4 gap-1">
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
            <div className="text-neutral-1100 text-sm flex justify-center items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {moment(project.start_date).format("MMM D, YYYY")}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Project was created on{" "}
                      {moment(project.start_date).format("MMM D, YYYY")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <MembersList members={project?.project_members || []} />
          </CardFooter>
        </>
      )}
      {isEditMode && project && (
        <CreateEditProject
          project={project}
          isEditMode={true}
          isOpen={isEditMode}
          setIsOpen={setIsEditMode}
          reload={fetchData}
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
