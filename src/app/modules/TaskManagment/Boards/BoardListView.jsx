import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { PageLoader, TableCustom } from "components";
import { getTaskByprojectId } from "app/hooks/taskManagment";
import { ProjectBoardColumn } from "app/modules/TaskManagment/Sections";
import { Card, CardContent } from "components/ui/card";

const BoardListView = ({ filterData, projectId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [AllBoardTasks, setAllBoardTasks] = useState([]);
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
      const boardsData = await getTaskByprojectId({
        filterData: { ...filterData, project_id: [projectId] },
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
  }, [projectId, filterData]);
  return isLoading ? (
    <PageLoader />
  ) : (
    <Card>
      <CardContent>
        <TableCustom
          columns={ProjectBoardColumn}
          data={AllBoardTasks.results || []}
          pagination={false}
          dataTotalSize={AllBoardTasks?.count || 0}
          tableOptions={tableOptions}
          dataStyle={{ backgroundColor: "white" }}
        />
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    employees: state.emp.employees,
  };
};

export default connect(mapStateToProps)(BoardListView);
