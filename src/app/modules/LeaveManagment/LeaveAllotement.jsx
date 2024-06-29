import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RenderEmployeesLeaveAllotement from "./Screens/RenderEmployeesLeaveAllotement";
import { getList } from "app/hooks/general";
import { BsBoxArrowUpRight } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import { EmployeeNameInfo, Header, PageLoader } from "components";
import {
  getEmployeeType,
  getWorkType,
  getemployeeType,
  getWorkLocation,
} from "utils/getValuesFromTables";
import { employeeSortingFilters } from "data/Data";
import moment from "moment";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { LeaveStatus } from "data/Data";
import { FilterInput } from "components/form-control";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import { FaPlus } from "react-icons/fa";

const LeaveAllotement = ({ departments, designations }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [filterData, setFilterData] = useState({});
  const [employeeList, setEmployeeData] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);

  const getPosts = async (isMounted) => {
    setIsLoading(true);
    try {
      let URL = `/customemp/?search=${encodeURIComponent(
        JSON.stringify(filterData)
      )}`;
      const employeeData = await getList(URL);
      if (isMounted) {
        setEmployeeData(employeeData.results.employees);
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
  }, [filterData]);

  

  

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
                  <Col lg={12}>
                    <div>
                      <RenderEmployees
                        employeeList={employeeList}
                      />
                    </div>
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

const RenderEmployees = ({ employeeList }) => {
  return (
    <div className="m-2 bg-white">
      {employeeList && employeeList.length > 0 ? (
        employeeList.map((employee) => (
          <div className={`whitespace-nowrap`} key={employee.id}>
            {employee.id && (
              <div className="px-4 pt-5">
                <RenderEmployeesLeaveAllotement
                  employee={employee}
                  employeeList={employeeList}
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <div
          className="flex justify-center items-center"
          style={{ minHeight: "20vh" }}
        >
          No records to display
        </div>
      )}
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
