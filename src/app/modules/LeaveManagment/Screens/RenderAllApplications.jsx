import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { AllLeavesApplicationColumns } from "app/utils/Types/TableColumns";
import { Table, PageLoader } from "components";
import { getLeaveApplications } from "app/hooks/leaveManagment";

const RenderAllApplications = ({ reload }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
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

  useEffect(() => {
    const getApplications = async () => {
      setLoading(true);
      try {
        const data = await getLeaveApplications({ filterData, options });
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    getApplications();
  }, [filterData]);

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
                  columns={AllLeavesApplicationColumns(reload)}
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
