import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import { EmployeeColumns } from "app/utils/Types/TableColumns";
import { PageLoader, Table } from "components";
import "./style.css";
import EmpDataHeader from "./Screens/Sections/Header.jsx";
import tie from "assets/images/tie.png";
import profile from "assets/images/profile.png";
import active from "assets/images/active.png";
import { FilterInput, CustomDarkButton } from "components/form-control.jsx";
import { UserRoles } from "data/Data.js";
import { useNavigate } from "react-router-dom";
import {
  getDepartmentList,
  getDesignationList,
  getEmployeeCustomList,
} from "app/hooks/general.jsx";

const Employee = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [totalEmployee, setTotalEmployee] = useState(0);
  const [activeEmployee, setActiveEmployee] = useState(0);
  const [totalManagers, setTotalManager] = useState(0);
  const navigate = useNavigate();
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
          setEmployeeData(employeeData);
          setActiveEmployee(employeeData?.ActiveEmployee || 0);
          setTotalEmployee(employeeData?.TotalEmployee || 0);
          setTotalManager(employeeData?.TotalManager || 0);
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

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const departmentResponse = await getDepartmentList();
        setDepartments(departmentResponse);
        const designationResponse = await getDesignationList();
        setDesignations(designationResponse);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLists();
  }, []);

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
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

  return (
    <div className="screen">
      <EmpDataHeader
        title="Profile Management"
        content={
          <CustomDarkButton
            label={"+ Add Employee"}
            onClick={() => navigate("/create-employee")}
          />
        }
      />
      {Blocks([
        {
          label: "Total Employees",
          value: totalEmployee,
          image: profile,
        },
        {
          label: "Managers Only",
          value: totalManagers,
          image: tie,
        },
        {
          label: "Active Employees",
          value: activeEmployee,
          image: active,
        },
      ])}
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
                          type: "search",
                          placeholder: "Search by ID and Name",
                          name: "id_and_first_name",
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
                        {
                          type: "select",
                          option: UserRoles,
                          name: "user_role",
                          placeholder: "Role",
                        },
                      ]}
                      onChange={handleFilterChange}
                    />
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
                      <Table
                        data={employeeData.results || []}
                        columns={EmployeeColumns}
                        dataTotalSize={employeeData.count || 0}
                        tableOptions={tableOptions}
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

function Blocks(blocks) {
  return (
    <Row className="flex items-center">
      {blocks &&
        blocks.map((block) => SubBlock(block.label, block.value, block.image))}
    </Row>
  );

  function SubBlock(label, value, image) {
    return (
      <Col md={4} className="mb-3">
        <div className="bg-[#FAFBFC] rounded-[20px] p-4 flex gap-x-[30px] m-1">
          <img src={image} alt="icon" />
          <div>
            <h4 className="font-lato text-sm font-normal leading-normal text-baseGray">
              {label}
            </h4>
            <h2 className="font-lato text-2xl text-[#323333] font-normal leading-normal">
              {value}
            </h2>
          </div>
        </div>
      </Col>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.user.userProfile,
});

export default connect(mapStateToProps)(Employee);
