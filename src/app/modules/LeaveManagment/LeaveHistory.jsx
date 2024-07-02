import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import { getEmployeeLeaveTypes } from "app/hooks/leaveManagment";
import { getEmployeeCustomList } from "app/hooks/general";
import { FilterInput } from "components/form-control";
import {
  EmployeeID,
  ManagerName,
  DepartmentName,
  DesignationName,
  LeaveTypeOfEmployee,
} from "utils/getValuesFromTables";
import { LeaveHistoryColumns } from "app/utils/Types/TableColumns";
import { getLeavesTypeNameList,getEmployeeLeavesAgainsLeaveType } from "utils/Lists";
import { PageLoader, Header, BarChart, Table } from "components";

const LeaveHistory = ({ leaveTypes, designations, departments }) => {
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [expandedRow, setExpandedRow] = useState(null);
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
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const employeeData = await getEmployeeCustomList({
          options,
          filterData,
        });
        if (isMounted) {
          fetchEmployeesWithLeaveDetails(employeeData);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [options, filterData]);

  const fetchEmployeesWithLeaveDetails = async (employeeData) => {
    try {
      setIsLoading(true);
      const employeeList = employeeData?.results || [];
      if (employeeList && employeeList.length > 0) {
        const updatedEmployeeList = await Promise.all(
          employeeList.map(async (employee) => {
            const leaveTypeResponse = await getEmployeeLeaveTypes({
              employee_id: employee.id,
            });
            const leavesData = {
              leaveTypes: leaveTypeResponse.leaveTypes,
              allotedLeaves: leaveTypeResponse.allotedLeaves,
              remainingLeaves: leaveTypeResponse.remainingLeaves,
              usedLeaves: leaveTypeResponse.usedLeaves,
              leaveTypeList:leaveTypeResponse.results,
            };
            return { ...employee, ...leavesData };
          })
        );
        setEmployeeData({ ...employeeData, results: updatedEmployeeList });
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const renderExpandedContent = (row) => {
   const leavesInfo = getEmployeeLeavesAgainsLeaveType(row.leaveTypeList,leaveTypes);
   const series = [{name:"Leaves Used",data:leavesInfo.usedLeaves ||[]},{name:"Total Leaves",data:leavesInfo.totalLeaves ||[]}];
   console.log(series) 
   return (
      <BarChart
        categories={getLeavesTypeNameList(leaveTypes)}
        series={series}
      />
    );
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: (name, value) => {
      onPageChange(name, value);
    },
  };

  return (
    <div className="screen bg-[#F0F1F2]">
      <Header title="Leave History" />
      <Row>
        <Col lg={12} className="mx-auto">
          <Card className="p-0">
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="flex justify-between">
                    <div className="py-3 px-3">
                      <FilterInput
                        filters={[
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
                    <div className="py-3 px-3">
                      <FilterInput
                        filters={[
                          {
                            type: "date",
                            placeholder: "From",
                            value: filterData['from'],
                            name: "from",
                          },
                          {
                            type: "date",
                            name: "to",
                            placeholder: "To",
                            value: filterData['to'],
                          },
                        ]}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {isLoading ? (
                <Row>
                  <Col lg={12}>
                    <PageLoader />
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col lg={12} className="react-bs-table-container">
                    <Table
                      data={employeeData.results || []}
                      columns={LeaveHistoryColumns}
                      rowExpand={true}
                      renderExpandedContent={renderExpandedContent}
                      dataTotalSize={employeeData.count || 0}
                      s
                      tableOptions={tableOptions}
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

const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
  leaveTypes: state.common.leaveTypes,
  designations: state.common.designations,
  departments: state.common.departments,
});

export default connect(mapStateToProps)(LeaveHistory);
