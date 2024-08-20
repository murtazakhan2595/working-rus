import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Table, PageLoader } from "components";
import { Row, Col } from "reactstrap";
import { ExitTerminatedColumns } from "app/utils/Types/TableColumns";
import { FilterInput } from "components/form-control";
import { getEmployeesResignations } from "app/hooks/employeeExitAndClearance";

const Terminated = ({ userProfile, departments}) => {
  const [loading, setLoading] = useState(true);
  const [Terminated, setTerminated] = useState(null);
  const [filterData, setFilterData] = useState({
    exit_category: "termination",
    status_termination: "exit interview",
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
      setTerminated(response);
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
    <div className="py-4 px-3 bg-white  flex flex-col gap-3">
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
        <Row>
          <Col lg={12}>
            <div>
              <Table
                data={Terminated?.results || []}
                columns={ExitTerminatedColumns}
                hideTableHeader={true}
                pagination={true}
                dataTotalSize={Terminated?.count || 0}
                tableOptions={tableOptions}
                dataStyle={{ backgroundColor: "white" }}
              />
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(Terminated);
