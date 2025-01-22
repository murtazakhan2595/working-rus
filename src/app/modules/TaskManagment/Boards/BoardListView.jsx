import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { PageLoader, TableCustom } from "components";
import { getTaskByprojectId } from "app/hooks/taskManagment";
import { ProjectBoardColumn } from "app/modules/TaskManagment/Sections";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import { RxPlus } from "react-icons/rx";
import CreateAndEditCardForm from "app/modules/TaskManagment/Boards/Sections/CreateAndEditCardForm";
import TaskDetail from "./TaskDetail";

const BoardListView = ({ filterData, projectId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [AllBoardTasks, setAllBoardTasks] = useState([]);
  const [openCreateCard, setOpenCreateCard] = useState(false);
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [viewTaskID, setViewTaskID] = useState(null);

  const onPageChange = (name, value) => {
    debugger;
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
      setIsTaskDetailOpen(true);
      setViewTaskID(row.id);
    },
  };

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const boardsData = await getTaskByprojectId(projectId, {
        filterData,
        options,
      });
      if (isMounted) {
        setAllBoardTasks(boardsData);
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
  }, [projectId, filterData, options]);
  return isLoading ? (
    <PageLoader />
  ) : (
    <>
      <Card>
        <CardContent>
          <TableCustom
            columns={ProjectBoardColumn}
            data={AllBoardTasks.results || []}
            pagination={true}
            dataTotalSize={AllBoardTasks?.count || 0}
            tableOptions={tableOptions}
            dataStyle={{ backgroundColor: "white" }}
          />
        </CardContent>
      </Card>
      <Button
        variant="outline"
        type="button"
        size="lg"
        className="mt-3"
        onClick={() => setOpenCreateCard(true)}
      >
        <RxPlus className="text-xl" />
        <span className="ml-2">Add Task</span>
      </Button>
      {openCreateCard && (
        <CreateAndEditCardForm
          onClose={() => {
            setOpenCreateCard(false);
            fetchData(true);
          }}
          isOpen={openCreateCard}
          projectId={projectId}
          setIsOpen={setOpenCreateCard}
        />
      )}
      {isTaskDetailOpen && (
        <TaskDetail
          taskId={viewTaskID} // Pass task Id as props to TaskDetail
          isOpen={isTaskDetailOpen}
          setIsOpen={() => {
            setIsTaskDetailOpen(false);
            setViewTaskID(null);
            fetchData(true);
          }}
          reloadData={fetchData}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(BoardListView);
