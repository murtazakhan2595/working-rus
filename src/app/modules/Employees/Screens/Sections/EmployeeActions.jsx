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
import { BsThreeDots } from "react-icons/bs";
import { useNavigate, Link } from "react-router-dom";
import {
  saveEmployeeWorkInformationData,
} from "app/hooks/employee";

const EmployeeAction = ({ row }) => {
  const navigate = useNavigate();
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  const toggleDropdown = (index) => {
    setOpenDropdownRow(index === openDropdownRow ? null : index);
  };

  const handleDelete = async (employeeId) => {
    try {
      await saveEmployeeWorkInformationData(employeeId, {employee_status:'Terminated'});
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  return (
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
        {/* <DropdownItem onClick={() => handleDelete(row.id)}>
          Delete Employee
        </DropdownItem> */}
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default EmployeeAction;
