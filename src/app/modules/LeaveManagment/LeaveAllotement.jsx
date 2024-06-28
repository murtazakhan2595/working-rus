import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LeaveAllotementForm from "./LeaveAllotementForm";
import { getEmployeeLeaveTypes } from "app/hooks/leaveManagment";
import { getList } from "app/hooks/general";
import { BsBoxArrowUpRight } from "react-icons/bs";
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
import {
  Card,
  CardHeader,
  CardBody,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from "reactstrap";
import { FaPlus } from "react-icons/fa";

const LeaveAllotement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [openLeaveAllotment, setOpenLeaveAllotment] = useState(null);
  const [filterData, setFilterData] = useState({});
  const [employeeList, setEmployeeData] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const getPosts = async () => {
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

    getPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDotsClick = (post) => {
    setOpenLeaveAllotment(post);
  };

  const closeModal = () => {
    setOpenLeaveAllotment(null);
  };

  const handleFilterChange = (filterName, filterValue, filterCheckStatus) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (!filterValue || filterCheckStatus === false) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] =
          filterCheckStatus === false ? "" : filterValue;
      }
      return updatedFilters;
    });
  };
  console.log(filterData);
  return (
    <div className="screen bg-[#F0F1F2]">
      <Header title="Employee Leave Allotement" />
      {openLeaveAllotment && (
        <Col md={6}>
          <LeaveAllotementForm
            employee={openLeaveAllotment}
            onClose={closeModal}
          />
        </Col>
      )}
      <Row>
        <Col lg={12} className="mx-auto">
          <Card className="p-0">
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <div className="py-3 px-3 flex justify-between">
                    <FilterInput
                      filters={[
                        {
                          type: "select",
                          option: leaveTypes,
                          name: "leave_type",
                          placeholder: "Leave Type",
                        },
                        {
                          type: "select",
                          option: LeaveStatus,
                          name: "status_hr",
                          placeholder: "Status",
                        },
                      ]}
                      onChange={handleFilterChange}
                    />

                    <div className="flex items-center gap-x-3">
                      <div className="font-lato text-[#47484C] text-[17px]">
                        New Leave Request
                      </div>
                      <Link
                        to="/leave-request"
                        className="p-2 rounded-md bg-black"
                        style={{ fontSize: "12px" }}
                      >
                        <FaPlus className="text-white" />
                      </Link>
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
                  <Col lg={12}>
                    <div>
                      <RenderEmployees
                        employeeList={employeeList}
                        handleDotsClick={handleDotsClick}
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

const RenderEmployees = ({ employeeList, handleDotsClick }) => {
  return (
    <div className="m-2 bg-white">
      {employeeList && employeeList.length > 0 ? (
        employeeList.map((employee) => (
          <div className={`whitespace-nowrap`} key={employee.id}>
            <div className="px-4 pt-5">
              <RenderEmployee
                employee={employee}
                handleDotsClick={handleDotsClick}
              />
            </div>
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

const RenderEmployee = ({ employee, handleDotsClick }) => {
  const [employeeLeaveTypes, setEmployeeLeaveTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getPosts = async () => {
      setIsLoading(true);
      try {
        const data = await getEmployeeLeaveTypes({
          employee_id: employee.employee_id,
        });
        setEmployeeLeaveTypes(data);
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
      />
      <div className="text-base text-baseGray flex items-center gap-x-4">
        <Link
          to="/applicants"
          state={{ employeeId: employee.id }}
          className="border px-3 py-2 rounded-md border-gray-400"
        >
          View applications
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.user.token,
    employeeList: state.emp.employees,
  };
};

export default connect(mapStateToProps)(LeaveAllotement);
