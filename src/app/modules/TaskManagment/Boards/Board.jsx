import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ViewOptions, SortingFilters } from "components";
import { getLabelDropdownList } from "utils/Lists";
import BoardListView from "app/modules/TaskManagment/Boards/BoardListView";
import BoardGridView from "app/modules/TaskManagment/Boards/BoardGridView";
import { MembersList } from "app/modules/TaskManagment/Sections";
import { useParams, Link, useNavigate } from "react-router-dom";
import { RenderProject } from "./Sections";
import { ArrowLeft } from "lucide-react";
import { DateInput } from "components/form-control";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { FilterInput } from "components/form-control";
import { PriorityList, TaskSortingFilters } from "data/Data";
import { getProjectById, addProject } from "app/hooks/taskManagment";
import { AlignRight } from "lucide-react";

const Board = ({ TaskLabelList }) => {
  const navigate = useNavigate();
  const projectId = useParams()?.projectId || null;
  const [filterData, setFilterData] = useState({});
  const [projectData, setProjectData] = useState(null);
  const [activeView, setActiveView] = useState("grid");

  const fetchData = async (isMounted) => {
    try {
      const projectDetails = await getProjectById(projectId);
      if (isMounted) {
        setProjectData(projectDetails);
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
  }, [projectId]);
  const removeMember = async (members) => {
    try {
      const response = await addProject(
        { project_members: members },
        projectId
      );
      if (response) {
        fetchData(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (
    filterName,
    filterValue,
    filterValueStatus = true
  ) => {
    const updatedFilters = { ...filterData };

    if (filterName === "end_date" ||filterName === "name") {
      if (filterValue) {
        // Update end_date with the provided value
        updatedFilters[filterName] = filterValue;
      } else {
        // Remove end_date if the filterValue is null
        delete updatedFilters[filterName];
      }
      console.log(updatedFilters);
      // Update the filter data
      setFilterData(updatedFilters);
      return;
    }

    // Check if the filterName exists in updatedFilters, if not, initialize it as an array
    if (!updatedFilters[filterName]) {
      updatedFilters[filterName] = [];
    }
    if (filterValueStatus) {
      // Add the filterValue if it does not already exist
      if (!updatedFilters[filterName].includes(filterValue)) {
        updatedFilters[filterName].push(filterValue);
      }
    } else {
      // Remove the filterValue if it exists
      updatedFilters[filterName] = updatedFilters[filterName].filter(
        (value) => value !== filterValue
      );
      // Remove the filterName from updatedFilters if the array is empty
      if (updatedFilters[filterName].length === 0) {
        delete updatedFilters[filterName];
      }
    }
    console.log(updatedFilters);
    // Update the filter data
    setFilterData(updatedFilters);
    return;
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ArrowLeft
            className="w-6 h-6 mr-2 bg-white rounded-lg shadow-sm cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <RenderProject
            projectId={projectId}
            projectName={projectData?.name}
          />
        </div>
        <div className="flex items-center justify-end gap-3 flex-wrap">
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search by Task Name",
                name: "name",
              },
            ]}
            onChange={handleFilterChange}
          />
          <SortingFilters
            items={TaskSortingFilters}
            lists={[
              {
                title: "Priority",
                label: "priority",
                options: PriorityList,
                values: filterData["priority"] || [],
              },
              {
                title: "Label",
                label: "label",
                options: getLabelDropdownList(TaskLabelList, "name", "id"),
                values: filterData["label"] || [],
              },
            ]}
            onChange={(name, value, filterCheckStatus) => {
              handleFilterChange(name, value, filterCheckStatus);
            }}
            values={filterData}
            filterButton={
              <Button variant="outline" className="">
                <AlignRight className="w-4 h-4 mr-1" />
                Filters
              </Button>
            }
            label={"Task Sort"}
            className={null}
          />

          <DateInput
            placeholder="Due Date"
            value={filterData[""]}
            className="flex items-center align-middle "
            name="end_date"
            onChange={(field, value) => {
              handleFilterChange(field, value);
            }}
          />
          <MembersList
            members={projectData?.project_members || []}
            removeMember={removeMember}
          />
          <ViewOptions activeView={activeView} setActiveView={setActiveView} />
        </div>
      </div>
      {activeView === "grid" ? (
        <BoardGridView filterData={filterData} projectId={projectId} />
      ) : (
        <BoardListView filterData={filterData} projectId={projectId} />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    employees: state.emp.employees,
    TaskLabelList: state.task_managment.task_labels,
  };
};

export default connect(mapStateToProps)(Board);
