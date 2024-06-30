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
import { EmployeeID } from "utils/getValuesFromTables";
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
import Select from "react-select";

import StatusCard from "../Sections/StatusCard";

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

  const options = [
    { value: "annual", label: "Annual Leave" },
    { value: "sick", label: "Sick Leave" },
    { value: "maternity", label: "Maternity Leave" },
    { value: "casual", label: "Casual Leave" },
  ];

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="bg-white md:w-[60%] flex items-center rounded-lg">
            {/* Left section */}
            <div className="md:w-[45%] px-4 py-2 rounded-lg">
              <h2 className="text-base font-lato text-baseGray font-semibold mb-2">
                My Leave Allowance
              </h2>
              <div className="text-3xl font-bold text-[#00A8F0] mb-6">
                25 days
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 mb-2">Leave Year</label>
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option>22-04-24 - 22-04-24</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-gray-700 mb-2">Leave Type</label>
                <Select
                  className="w-full"
                  options={options}
                  styles={{
                    control: (base) => ({
                      ...base,
                      padding: "2px",
                      borderColor: "gray",
                      borderRadius: "5px",
                    }),
                  }}
                />
              </div>
            </div>

            {/* Center section */}

            <div className="md:w-[55%] flex flex-col md:flex-row items-center justify-around">
              <div className="flex flex-col items-center mb-6 md:mb-0">
                <h3 className="text-base font-lato text-baseGray font-medium mb-2">
                  Leaves Remaining
                </h3>
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                    05
                  </div>
                  <div
                    className="absolute inset-0 w-32 h-32 rounded-full border-4 border-[#00A8F0]"
                    style={{ clipPath: "inset(0 0 0 20%)" }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-base font-lato text-baseGray font-medium mb-2">
                  Leaves Used
                </h3>
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
                    08
                  </div>
                  <div
                    className="absolute inset-0 w-32 h-32 rounded-full border-4 border-[#556CBF]"
                    style={{ clipPath: "inset(0 70% 0 0)" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* right */}

          <div className="md:w-[45%] flex justify-center items-center">
            <div className="grid grid-cols-2 gap-2 h-full w-full max-w-5xl">
              <StatusCard icon={checked} count={6} label={"Approved"} />
              <StatusCard icon={time} count={1} label={"Pending"} />
              <StatusCard icon={employee} count={8} label={"Request"} />
              <StatusCard icon={cross} count={1} label={"Denied"} />
            </div>
          </div>
        </div>
      </div>

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
                dataFormat={(cell) => {
                            return <EmployeeID value={cell} />;
                          }}

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
