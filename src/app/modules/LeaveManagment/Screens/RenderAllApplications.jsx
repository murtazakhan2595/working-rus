import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { AllLeavesApplicationColumns } from "app/utils/Types/TableColumns";
import { Table, PageLoader } from "components";
import { getLeaveApplications } from "app/hooks/leaveManagment";
import { useSelector } from "react-redux";

const RenderAllApplications = ({reload}) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });
  const loggedInUser = useSelector((state) => state.user.userProfile);
  const onPageChange = (name, value) => {
    const pageOptions = options;
    if (pageOptions[name] !== value) {
      pageOptions[name] = value;
      setOptions((prevOptions) => ({ ...prevOptions, ...pageOptions }));
    }
  };
  const getApplications = async () => {
    setLoading(true);
    try {
      const data = await getLeaveApplications({ filterData });
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getApplications();
  }, [filterData]);

  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      //  debugger
      const updatedFilters = { ...prevFilters };
      if (!filterValue) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  return (
    <>
      <div className="m-2 bg-white px-2 py-4">
        {loading ? (
          <PageLoader />
        ) : (
          <Row>
            <Col lg={12}>
              <div>
                <Table
                  data={applications?.results || []}
                  columns={AllLeavesApplicationColumns(reload,loggedInUser.role)}
                  pagination={true}
                  dataTotalSize={applications?.count || 0}
                  tableOptions={tableOptions}
                />
              </div>
            </Col>
          </Row>
        )}
      </div>
    </>
  );
};

export default RenderAllApplications;
