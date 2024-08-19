import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Table, PageLoader } from "components";
import { FilterInput } from "components/form-control";
import { Row, Col } from "reactstrap";
import { ExitResignedColumns } from "app/utils/Types/TableColumns";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";

const Resigned = React.memo(({ userProfile, departments, reload }) => {
  const [loading, setLoading] = useState(true);
  const [Resigned, setResigned] = useState(null);
  const [filterData, setFilterData] = useState({
    exit_category: "resignation",
    status_resignation: "exit interview",
    ...(userProfile.role === 2 ? { report_to: userProfile.id } : {}),
  });
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getEmployeesResignations({ filterData, options });
      setResigned(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [options, filterData]);

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

  return (
    <div className="py-3 px-3 bg-white">
      <FilterInput
        filters={[
          {
            type: "search",
            placeholder: "Search by id",
            name: "employee_id",
          },
          {
            type: "select",
            option: departments,
            name: "department_name",
            placeholder: "Department",
          },
        ]}
        onChange={handleFilterChange}
      />
      {loading ? (
        <PageLoader />
      ) : (
        <Row className="mt-4">
          <Col lg={12}>
            <div>
              <Table
                data={Resigned?.results || []}
                columns={ExitResignedColumns}
                hideTableHeader={true}
                pagination={true}
                dataTotalSize={Resigned?.count || 0}
                tableOptions={tableOptions}
                dataStyle={{ backgroundColor: "white" }}
              />
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
});
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(Resigned);
