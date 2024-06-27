import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { PageLoader, Header } from "components";
import { Status, getDecision, StatusIcon } from "../Sections";
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
import { cut, file, list } from "assets/images";
import { FaPlus } from "react-icons/fa";
import { LeaveStatus } from "data/Data";
import { Blocks } from "../Sections";
import { getLeaveApplications, getLeaveTypes } from "app/hooks/leaveManagment";
import { FilterInput } from "components/form-control";
import moment from "moment";
import { StatusLabel } from "components";
import { DepartmentName, LeaveType } from "utils/getValuesFromTables";

const RenderAllApplications = ({ applicationsList }) => {
  const Leave = applicationsList;
  const [openDropdownRow, setOpenDropdownRow] = useState(null);

  const renderView = (row) => (
    <Link
      className="btn btn-outline-dark bg-white text-dark shadow-none"
      style={{ padding: ".35em .65em", fontSize: ".75em", minWidth: "100px" }}
      role={"button"}
    >
      View
    </Link>
  );
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };
  const renderStatus = (row) => {
    const status = Status(row.status_hr);
    const spanClassName = "text-[14px] flex justify-start items-center";
    const itemClassName = "custom-dropdown-item py-2";
    return (
      <div>
        <ButtonDropdown
          isOpen={openDropdownRow === row.id}
          toggle={() => toggleDropdown(row.id)}
        >
          <DropdownToggle className="border-0 shadow-none bg-transparent">
            <StatusLabel status={status} />
          </DropdownToggle>
          <DropdownMenu start className="p-3 ml-2">
            <DropdownItem className={`${itemClassName} fw-bold`}>
              <span> Your Application Status</span>
            </DropdownItem>
            <DropdownItem className={`${itemClassName}`}>
              <span className={`${spanClassName}`}>
                <StatusIcon status={"Approved"} /> Viewed
              </span>
            </DropdownItem>
            <DropdownItem className={`${itemClassName}`}>
              <span className={`${spanClassName}`}>
                <StatusIcon status={row.status_indirect_manager} />
                Direct Manager Approval
              </span>
            </DropdownItem>
            <DropdownItem className={`${itemClassName}`}>
              <span className={`${spanClassName}`}>
                <StatusIcon status={row.status_hr} />
                In-Direct Manager Approval
              </span>
            </DropdownItem>
            <DropdownItem className={`${itemClassName}`}>
              <span className={`${spanClassName}`}>
                <StatusIcon status={row.status_hr} />
                {getDecision(status)}
              </span>
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  };

  return (
    <div className="m-2 bg-white px-2 py-4">
      <Row>
        <Col lg={12}>
          <div>
            <BootstrapTable
              data={Leave || []}
              version="4"
              remote
              className={"bootstrap-main-table"}
            >
              <TableHeaderColumn
                isKey
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
                Total Days
              </TableHeaderColumn>
              <TableHeaderColumn
                className="table-header-bg text-center overflow-visible"
                headerAlign="center"
                dataAlign="center"
                dataFormat={(cell, row) => renderStatus(row)}
              >
                Status
              </TableHeaderColumn>

              <TableHeaderColumn
                className="table-header-bg text-center"
                dataAlign="center"
                headerAlign="center"
                dataFormat={(cell, row) => renderView(row)}
              ></TableHeaderColumn>
            </BootstrapTable>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RenderAllApplications;
