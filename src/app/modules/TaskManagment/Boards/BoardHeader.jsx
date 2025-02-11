import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ViewOptions } from "components";
import { getLabelDropdownList } from "utils/Lists";
import { MembersList } from "app/modules/TaskManagment/Sections";
import { useNavigate } from "react-router-dom";
import {
  RenderProject,
  AdditionalOption,
} from "app/modules/TaskManagment/Boards/Sections";
import { ArrowLeft } from "lucide-react";
import { DateInput } from "components/FormControl";
import { Button } from "components/ui/button";
import { FilterInput, SortingFilters } from "components/FormControl";
import { PriorityList, TaskSortingFilters, TaskStatus } from "data/Data";
import { addProject } from "app/hooks/taskManagment";
import { AlignRight } from "lucide-react";
import AlertDialogue from "components/ui/AlertDialogue";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const BoardHeader = ({
  setFilterData = () => {},
  filterData,
  projectId = null,
  activeView = "grid",
  setActiveView = () => {},
  projectData = {},
  fetchData = () => {},
}) => {
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const TaskLabelList = getLabelDropdownList(
    useSelector((state) => state.task_managment.task_labels),
    "name",
    "id"
  );
  const Employees = useSelector((state) => state.emp.employees);
  const ProjectMembers = projectData?.project_members || [];
  const AssigneesList = React.useMemo(() => {
    return Employees?.filter((employee) =>
      ProjectMembers.includes(employee.value)
    );
  }, [Employees, ProjectMembers]);
  const handleFilterChange = (
    filterName,
    filterValue,
    filterValueStatus = true
  ) => {
    const updatedFilters = { ...filterData };

    if (filterName === "end_date" || filterName === "name") {
      if (filterValue) {
        // Update end_date with the provided value
        updatedFilters[filterName] = filterValue;
      } else {
        // Remove end_date if the filterValue is null
        delete updatedFilters[filterName];
      }
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
    // Update the filter data
    setFilterData(updatedFilters);
    return;
  };
  const removeMember = (members) => {
    setSelectedMembers(members);
    setIsDelete(true);
  };
  const handleRemoveMember = async () => {
    try {
      const response = await addProject(
        { project_members: selectedMembers },
        projectId
      );
      if (response) {
        fetchData(true);
        toast.success("Member Removed successfully");
      }
    } catch (error) {
      console.error(error);
    }
    setIsDelete(false);
  };
  if (!projectId) return null;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <ArrowLeft
          className="w-6 h-6 mr-2 bg-white rounded-lg shadow-sm cursor-pointer"
          onClick={() => navigate("/projects")}
        />
        <RenderProject projectId={projectId} projectName={projectData?.name} />
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
              title: "Status",
              label: "status",
              options: TaskStatus,
              values: filterData["status"] || [],
            },
            {
              title: "Assignees",
              label: "assigned_to",
              options: AssigneesList,
              values: filterData["assigned_to"] || [],
            },
            {
              title: "Label",
              label: "label",
              options: TaskLabelList,
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
          showReset={true}
        />
        <MembersList
          members={ProjectMembers || []}
          removeMember={removeMember}
          onMemberClick={(event, user) => {
            event.preventDefault();
            navigate(`/project-board/${projectId}/user/${user.id}`)
          }}
        />
        {isDelete && (
          <AlertDialogue
            isOpen={isDelete}
            setIsOpen={setIsDelete}
            handleContinue={handleRemoveMember}
            continueText="Delete"
            title="Are you sure you want to Remove this Member?"
            description="The member will be deleted , but you can add the member again as well."
          />
        )}
        <ViewOptions activeView={activeView} setActiveView={setActiveView} />
        <AdditionalOption projectId={projectId} reloadData={fetchData} />
      </div>
    </div>
  );
};

export default BoardHeader;
