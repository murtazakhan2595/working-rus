import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getEmployeeCustomList } from "app/hooks/general";
import { LeaveAllotmentColumns } from "app/utils/Types/TableColumns";
import { Table, Header, PageLoader } from "components";
import { FilterInput } from "components/form-control";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

const LeaveAllotement = ({ departments, designations }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState({employee_status: "Active,Probation,Notice Period"});
  const [employeeList, setEmployeeData] = useState([]);
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

  const getPosts = async (isMounted) => {
    setIsLoading(true);
    try {
      const employeeData = await getEmployeeCustomList({ options, filterData });
      console.log("employeeData", employeeData);
      if (isMounted) {
        setEmployeeData(employeeData);
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
    getPosts(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, options]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
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

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  return (
    <div className="screen bg-[#F0F1F2]">
      <Header title="Employee Leave Allotement" />
      <Row>
        <Col lg={12} className="mx-auto">
          <Card className="p-0">
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="py-3 px-3">
                    <FilterInput
                      filters={[
                        {
                          type: "text",
                          placeholder: "Search by ID",
                          name: "id",
                        },
                        {
                          type: "text",
                          placeholder: "Search by Name",
                          name: "first_name",
                        },
                        {
                          type: "select",
                          option: departments,
                          name: "department_name",
                          placeholder: "Department",
                        },
                        {
                          type: "select",
                          option: designations,
                          name: "department_position",
                          placeholder: "Designation",
                        },
                      ]}
                      onChange={handleFilterChange}
                    />
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="pt-0">
              {isLoading ? (
                <Row>
                  <Col lg={12}>
                    <PageLoader />
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col lg={12} className="mt-5 mx-2">
                    <Table
                      data={employeeList.results || []}
                      columns={LeaveAllotmentColumns(getPosts)}
                      hideTableHeader={true}
                      pagination={true}
                      dataTotalSize={employeeList.count || 0}
                      tableOptions={tableOptions}
                      dataStyle={{ backgroundColor: "white" }}
                    />
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    designations: state.common.designations,
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(LeaveAllotement);
