import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeForm from "./EmployeeForm";
import {
  Card,
  CardHeader,
  // CardTitle,
  // CardDescription,
  CardContent,
  // CardFooter,
} from "components/ui/card.jsx";
import Header from "components/Header.jsx";
import { HasAccess } from "utils/PermissionUtils";
import ImportEmployeesButton from "app/modules/Employees/Screens/Sections/ImportEmployeesButton"; // Adjust the path as needed

const CreateUpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const SalarySetupAllowed = HasAccess("EDIT_EMPLOYEE_SALARY_SETUP");
  const closeModal = () => {
    navigate("/profile-management");
  };

  return (
    <>
      <div className={`max-w-[1040px] mx-auto ${window.location.pathname.substring(1)}`}>
        <Header />
        <Card>
          <CardHeader className="flex flex-row flex-wrap justify-end gap-2 items-center">
            <ImportEmployeesButton reload={closeModal} />
          </CardHeader>
          <CardContent>
            <EmployeeForm
              id={id}
              setIsOpen={() => { }}
              SalarySetupAllowed={!id && SalarySetupAllowed}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CreateUpdateEmployee;
