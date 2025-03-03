import { getAllTasks, getAllProjects } from "app/hooks/taskManagment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EmployeeName } from "utils/getValuesFromTables";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card.jsx";
import { Button } from "../../../../components/ui/button";
import * as React from "react";
import { getDropdownList } from "utils/Lists.js";
import TaskStatusLabel from "app/modules/TaskManagment/Sections/TaskStatus";
import { TaskStatus } from "data/Data";

import CustomTable from "components/CustomTable";
import { SelectInputComponent } from "components/FormControl";

export default function MyTasks() {
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.user.userProfile);
  const [showAll, setShowAll] = useState(false);
  const [filterData, setFilterData] = useState({
    assigned_to: [userProfile.id],
    is_subtask: [false],
    is_archive: [false],
  });
  const [tasks, setTasks] = useState([]);
  const Projects = useSelector((state) => state.common.projects);
  const AllProjects = getDropdownList(Projects, "name", "id", null, null, {
    label: "All Projects",
    value: "All Projects",
  });

  const fetchTasks = async (isMounted) => {
    try {
      const tasksData = await getAllTasks({ filterData });
      if (isMounted) {
        // const mergedResult = mergeTasksWithProjects(tasksData, projects);
        setTasks(tasksData);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchTasks(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData]);

  const handleFilterChange = (filterName, filterValue) => {
    const updatedFilters = { ...filterData };

    if (filterValue) {
      // Update end_date with the provided value
      updatedFilters[filterName] = [filterValue];
    } else {
      // Remove end_date if the filterValue is null
      delete updatedFilters[filterName];
    }
    // Update the filter data
    setFilterData(updatedFilters);
    return;
  };
  const taskData = showAll ? tasks?.results : tasks?.results?.slice(0, 5);

  return (
    <>
        <CardHeader className="items-start pb-0">
          <CardTitle className="flex flex-row justify-between w-full">
            <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
              My Tasks
            </div>

            <div className="flex items-center gap-3">
              <SelectInputComponent
                name="status"
                options={TaskStatus}
                value={filterData.status?.[0]}
                showLabel={false}
                placeholder="Select Status"
                onChange={(field, value) => {
                  handleFilterChange(field, value);
                }}
                className="w-fit"
              />
              <SelectInputComponent
                name="project_id"
                options={AllProjects}
                value={filterData.project_id?.[0] || "All Projects"}
                showLabel={false}
                placeholder="Select Project"
                onChange={(field, value) => {
                  if (value === "All Projects") handleFilterChange(field, null);
                  else handleFilterChange(field, value);
                }}
                className="w-fit"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="min-h-[25rem]">
          {tasks?.count > 0 ? (
            <CustomTable
              showHeader={false}
              pagination={false}
              columns={[
                {
                  text: "Title",
                  dataField: "name",
                  formatter: (cell, render) => (
                    <div className="flex flex-col w-full gap-2">
                      <div className="flex flex-row w-full gap-4">
                        <div className=" text-sm font-semibold text-neutral-1200 py-1 text-capitalize">
                          {render.name}
                        </div>
                        <TaskStatusLabel status={render.status} />
                      </div>
                      <div className="text-neutral-1000">
                        {render?.end_date
                          ? `Due on ${moment(render?.end_date).format(
                              "MMMM DD"
                            )} - `
                          : ""}
                        Created by <EmployeeName value={render?.assigned_by} />
                      </div>
                    </div>
                  ),
                },
                {
                  text: "View Project",
                  formatter: (cell, render) => (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-sm font-semidbold"
                      onClick={() =>
                        navigate(`/project-board/card/${render.id}`, {
                          state: {
                            GOTO_URLS: `/`,
                          },
                        })
                      }
                    >
                      View Task
                    </Button>
                  ),
                },
              ]}
              data={taskData || []}
            />
          ) : (
            <div>No tasks available.</div>
          )}
          {tasks.count > 5 && (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAll((prev) => {
                    return !prev;
                  });
                }}
              >
                {showAll ? "Show Less" : "Show All"}
              </Button>
            </div>
          )}
        </CardContent>
    </>
  );
}
