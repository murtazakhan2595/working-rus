import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
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
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import PageLoader from "../../../components/PageLoader.jsx";
import "./style.css";
import EmpDataHeader from "./Screens/Sections/Header.jsx";
import { BsThreeDots } from "react-icons/bs";
import tie from "../../../assets/images/tie.png";
import profile from "assets/images/profile.png";
import active from "assets/images/active.png";
import { FilterInput, CustomDarkButton } from "components/form-control.jsx";
import { UserRoles } from "data/Data.js";
import { useNavigate, Link } from "react-router-dom";
import {
  getDepartmentList,
  getDesignationList,
  getEmployeeCustomList,
  deleteRecord,
} from "../../hooks/general.jsx";

const Employee = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeData, setEmployeeData] = useState([]);
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
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
    sortName: "",
    sortOrder: "",
  });

  const onSizePerPageList = (sizePerPage) => {
    if (options.sizePerPage !== sizePerPage) {
      setOptions((prevOptions) => ({ ...prevOptions, sizePerPage }));
    }
  };

  const onPageChange = (page, sizePerPage) => {
    if (options.page !== page) {
      setOptions((prevOptions) => ({ ...prevOptions, page }));
    }
  };

  const sortColumn = (sortName, sortOrder) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      sortName,
      sortOrder,
    }));
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

  const handleDelete = async (employeeId) => {
    setIsLoading(true);
    try {
      const URL = `/emp/${employeeId}`;
      await deleteRecord(URL, "Employee");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderName = (cell, row) => (
    <div className="flex items-center">
      <div className="bg-[#BE24A5] text-[#FAFBFC] flex font-lato font-semibold text-lg items-center justify-center rounded-full w-10 h-10">
        {row.first_name.toUpperCase().charAt(0)}
        {row.last_name.toUpperCase().charAt(0)}
      </div>
      <div className="flex flex-col ml-2">
        <div className="text-base font-bold leading-normal text-[#323333] font-lato">
          {`${row.first_name} ${row.last_name}`}
        </div>
        <div className="text-base font-lato">{`${row.department_position}`}</div>
      </div>
    </div>
  );

  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  const renderAction = (row) => (
    <ButtonDropdown
      isOpen={openDropdownRow === row.id}
      toggle={() => toggleDropdown(row.id)}
      className="float-end"
    >
      <DropdownToggle size="sm" className="btn-brand">
        <BsThreeDots />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem onClick={() => navigate(`/profile/${row.id}`)}>
          Edit Profile
        </DropdownItem>
        <DropdownItem>
          <Link to="/edit-employee" state={{ id: row.id }}>
            Edit Employee
          </Link>
        </DropdownItem>
        <DropdownItem onClick={() => navigate(`/user/${row.id}`)}>
          View Profile
        </DropdownItem>
        <DropdownItem onClick={() => handleDelete(row.id)}>
          Delete Employee
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onSizePerPageList,
    onPageChange,
    onSortChange: sortColumn,
    paginationPosition: "bottom",
  };

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange(1);
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
                      <BootstrapTable
                        data={employeeData?.results || []}
                        version="4"
                        hover
                        remote
                        pagination
                        options={tableOptions}
                        fetchInfo={{ dataTotalSize: employeeData?.count || 0 }}
                        className={"bootstrap-main-table"}
                      >
                        <TableHeaderColumn
                          tdStyle={{ whiteSpace: "normal" }}
                          isKey
                          dataField="id"
                          dataSort
                          dataFormat={(cell) =>
                            `TXB-${cell.toString().padStart(4, "0")}`
                          }
                          className="table-header-bg"
                        >
                          ID
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="name"
                          dataSort
                          className="table-header-bg"
                          dataFormat={renderName}
                          width="20%"
                        >
                          Name
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="user_role"
                          dataSort
                          className="table-header-bg"
                          dataFormat={(cell) => {
                            const role = UserRoles.find(
                              (obj) => obj.value === cell
                            );
                            return role?.label ?? "";
                          }}
                        >
                          Role
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="username"
                          dataSort
                          className="table-header-bg"
                        >
                          Username
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          dataField="phone"
                          dataSort
                          className="table-header-bg"
                          width="20%"
                          dataFormat={(cell, row) => (
                            <>
                              <div className="text-base font-lato">
                                {row.mobile_no || ""}
                              </div>
                              <div className="text-base font-lato">
                                {row.work_email || ""}
                              </div>
                            </>
                          )}
                        >
                          Phone no/Email
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          className="table-header-bg text-right"
                          dataField="employee_status"
                          headerAlign="right"
                          dataAlign="right"
                          width="10%"
                        >
                          Status
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          columnClassName="text-right"
                          className="table-header-bg text-right"
                          headerAlign="right"
                          dataFormat={(cell, row) => renderAction(row)}
                        >
                          Action
                        </TableHeaderColumn>
                      </BootstrapTable>
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
