import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { PageLoader, Header } from "components";
import { Status, getDecision, StatusIcon, RenderStatus } from "../Sections";
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

import checked from "../../../../assets/images/checked.svg";
import employee from "../../../../assets/images/employee.svg";
import time from "../../../../assets/images/time.svg";
import cross from "../../../../assets/images/cross.svg";
import {
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaTimesCircle,
  FaUser,

} from "react-icons/fa";
import { LeaveStatus } from "data/Data";
import { Blocks } from "../Sections";
import { getLeaveApplications, getLeaveTypes } from "app/hooks/leaveManagment";
import { EmployeeNameInfo } from "components";
import moment from "moment";
import { StatusLabel } from "components";
import {
  DepartmentName,
  LeaveType,
  EmployeeName,

} from "utils/getValuesFromTables";


const RenderAllApplications = ({ applicationsList }) => {
  const Leave = applicationsList;
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const renderView = (row) => (

    <Link className="btn btn-outline-dark bg-white text-dark shadow-none"
      style={{ padding: ".35em .65em", fontSize: ".75em", minWidth: "100px" }}
      role={"button"}
    >View</Link>

  );

  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  return (

    <>


      <div className="m-2 bg-white px-2 py-4">

        {/* <Row>

        <Col lg={12}>

          <div>

            <BootstrapTable

              data={Leave || []}

              version="4"

              remote

              className={"bootstrap-main-table"}

            >

              <TableHeaderColumn

                className="table-header-bg"

                dataField="employee_id"

                dataAlign="center"

                width="15%"

                dataFormat={(cell, row) => (

                  <EmployeeNameInfo

                    name={row.name}

                    department={row.department_name}

                    position={row.position}

                  />

                )}

              >

                Employees

              </TableHeaderColumn>

              <TableHeaderColumn

                isKey

                className="table-header-bg"

                dataField="id"

                dataAlign="center"

              >

                ID

              </TableHeaderColumn>

              <TableHeaderColumn

                className="table-header-bg"

                dataField="report_to"

                headerAlign="left"

                dataAlign="left"

                dataFormat={(cell) => {

                  return <EmployeeName value={cell} />;

                }}

              >

                Report To

              </TableHeaderColumn>
 
              <TableHeaderColumn

                dataField="leave_type"

                className="table-header-bg"

                dataAlign="center"

                dataFormat={(cell) => {

                  return <LeaveType value={cell} />;

                }}

              >

                Leave Type

              </TableHeaderColumn>

              <TableHeaderColumn

                dataField="total_leave"

                className="table-header-bg text-center"

                headerAlign="center"

                dataAlign="center"

              >

                No. of Leaves

              </TableHeaderColumn>

              <TableHeaderColumn

                className="table-header-bg"

                dataField="start_date"

                dataAlign="center"

                dataFormat={(cell) => <>{moment(cell).format("DD-MM-YYYY")}</>}

              >

                Start Date

              </TableHeaderColumn>
 
              <TableHeaderColumn

                className="table-header-bg"

                dataField="end_date"

                dataAlign="center"

                dataFormat={(cell) => <>{moment(cell).format("DD-MM-YYYY")}</>}

              >

                End Date

              </TableHeaderColumn>
 
              <TableHeaderColumn

                className="table-header-bg text-center overflow-visible"

                dataField="status_hr"

                headerAlign="center"

                dataAlign="center"

                dataFormat={(cell, row) => {

                  return <StatusLabel status={Status(cell)} />;

                }}

              >

                Status

              </TableHeaderColumn>
 
              <TableHeaderColumn

                className="table-header-bg text-center"

                dataAlign="center"

                headerAlign="center"

                dataFormat={(cell, row) => {

                  return <RenderStatus row={row} />;

                }}

              ></TableHeaderColumn>

            </BootstrapTable>

          </div>

        </Col>

      </Row> */}

      </div>

    </>

  );

};

export default RenderAllApplications;