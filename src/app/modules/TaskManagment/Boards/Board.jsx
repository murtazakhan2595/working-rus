import { connect } from "react-redux";
import React, { useState,useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ViewOptions, } from "components";
import { FilterInput } from "components/form-control";
import BoardListView from "app/modules/TaskManagment/Boards/BoardListView";
import BoardGridView from "app/modules/TaskManagment/Boards/BoardGridView";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MembersDropdown, RenderProject } from "./Sections";
import { ArrowLeft } from "lucide-react";
import { DateInput } from "components/form-control";
import { Button } from "components/ui/button";
import { useSelector } from "react-redux";
import { SelectMultiInputComponent } from "components/form-control";
import { PriorityList } from "data/Data";
import {
  getProjectById,
} from "app/hooks/taskManagment";

const Board = ({ }) => {
  const navigate = useNavigate();
  const [filterDate, setFilterDate] = useState(null);
  const projectId = useParams()?.projectId || null;
  const [filterData, setFilterData] = useState({});
  const [projectData, setProjectData] = useState(null);
  const [activeView, setActiveView] = useState("grid");
  const [multiInput, setMultiInput] = useState([]);
  const labelsList = useSelector((state) => state.task_managment.task_labels);
  const labeloptions = [
    ...labelsList.map((label) => ({
      value: label.id,
      label: label.name,
    })),
    ...PriorityList,
  ];
  
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

  const handleFilterChange = (filterName, filterValue) => {
    const updatedFilters = { ...filterData };

    if (Array.isArray(filterValue)) {
      const priority = filterValue.filter((value) => value >= 1 && value <= 3);
      const label = filterValue.filter((value) => value > 3);

      // Handle priority array
      if (priority.length === 0) {
        delete updatedFilters["priority"];
      } else {
        updatedFilters["priority"] = priority[0];
      }

      // Handle label array
      if (label.length === 0) {
        delete updatedFilters["label"];
      } else {
        updatedFilters["label"] = label;
      }
    } else {
      // Handle non-array value
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
    }

    setFilterData(updatedFilters);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ArrowLeft
            className="w-6 h-6 mr-2 bg-white rounded-lg shadow-sm cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <RenderProject projectId={projectId} />
        </div>
        <div className="flex items-center justify-end gap-3 flex-wrap">
          <SelectMultiInputComponent
            name="label"
            options={labeloptions}
            placeholder="Filter"
            value={multiInput}
            onChange={(field, value) => {
              handleFilterChange(field, value);
              setMultiInput([...value]);
            }}
            classes="max-w-96"
          />
          <DateInput
            placeholder="Due Date"
            value={filterDate}
            className="flex items-center align-middle "
            name="end_date"
            onChange={(field, value) => {
              setFilterDate(value);
              handleFilterChange(field, value);
            }}
          />
          <Button
            variant="outline"
            onClick={() => {
              setFilterDate(null);
              setMultiInput([]);
              setFilterData({});
            }}
          >
            Reset Filters
          </Button>
          <MembersDropdown members={projectData?.project_members || []} />
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
  };
};

export default connect(mapStateToProps)(Board);
