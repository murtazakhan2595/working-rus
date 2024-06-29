import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AllotLeaves from "./Screens/AllotLeaves";
import { getEmployeeLeaveTypes } from "app/hooks/leaveManagment";
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
  const [openLeaveAllotment, setOpenLeaveAllotment] = useState(null);
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

  const closeModal = () => {
    setOpenLeaveAllotment(null);
    getPosts(true);
  };

  const handleAllotLeaves = (employeeLeaveTypes) => {
    setOpenLeaveAllotment(employeeLeaveTypes);
  };

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
      {openLeaveAllotment && (
        <Col md={6}>
          <AllotLeaves
            employeeData={openLeaveAllotment}
            closeModel={closeModal}
          />
        </Col>
      )}
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
                        handleAllotLeaves={handleAllotLeaves}
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

const RenderEmployees = ({ employeeList, handleAllotLeaves }) => {
  return (
    <div className="m-2 bg-white">
      {employeeList && employeeList.length > 0 ? (
        employeeList.map((employee) => (
          <div className={`whitespace-nowrap`} key={employee.id}>
            {employee.id && (
              <div className="px-4 pt-5">
                <RenderEmployee
                  employee={employee}
                  handleAllotLeaves={handleAllotLeaves}
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

const RenderEmployee = ({ employee, handleAllotLeaves }) => {
  const [employeeLeaveTypes, setEmployeeLeaveTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getPosts = async () => {
      setIsLoading(true);
      try {
        const data = await getEmployeeLeaveTypes({
          employee_id: employee.id,
        });
        setEmployeeLeaveTypes({
          data: data.results,
          leaveTypes: data.count,
          allotedLeave: data.results.reduce(
            (sum, leave) => sum + leave.total_alloted_leaves,
            0
          ),
        });
      } catch (error) {
        console.error("Error fetching employeeLeaveTypes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getPosts();
  }, []);
  return (
    <div className="flex flex-row justify-between gap-y-10 border-b px-2 pb-4">
      <EmployeeNameInfo
        name={`${employee.first_name} ${employee.last_name}`}
        department={employee.department_name}
        position={employee.department_position}
        id={employee.id}
        leaveTypes={employeeLeaveTypes.leaveTypes}
        allotedLeave={employeeLeaveTypes.allotedLeave}
      />
      <div className="text-base text-baseGray flex items-center gap-x-4">
        <div
          className="border px-3 py-2 rounded-md border-gray-400 flex cursor-pointer"
          onClick={() => {
            handleAllotLeaves({
              ...employee,
              ...{ employeeLeaveDetails: employeeLeaveTypes.data },
            });
          }}
        >
          <CiEdit className="text-2xl cursor-pointer opacity-80 mr-2" />
          Allot leaves
        </div>
      </div>
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
