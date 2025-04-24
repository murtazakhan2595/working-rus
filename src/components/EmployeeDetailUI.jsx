import React from "react";
import {
  getLabelByValue,
  DesignationName,
  getEmployeeType,
} from "utils/getValuesFromTables";
import { GetUser } from "utils/getValuesFromTables";
import { TextInput } from "components/FormControl";
import { BranchName } from "utils/getValuesFromTables";
import { DetailBox } from "components/SheetCardExtension";
import { renderDate } from "utils/renderValues";
import { useSelector } from "react-redux";

const EmployeeDetailUI = React.memo(
  ({
    id,
    className = null,
    variant = "ViewMode", // othere options are [ViewMode,FormView]
    InformationKeys = [],
  }) => {
    const Departments = useSelector((state) => state.common.departments);
    const Designations = useSelector((state) => state.common.designations);
    const Branches = useSelector((state) => state.common.branches);
    const Employees = useSelector((state) => state.emp.employess);
    const Managers = useSelector((state) => state.emp.reportingManagers);
    const userProfile = id ? GetUser(id) : {};
    if (!userProfile) return null;
    const employeeDataList = [
      ...(InformationKeys.includes("id")
        ? [
            {
              name: "serial_number",
              label: "Employee ID",
              value: userProfile.serial_number,
              name: "serial_number",
            },
          ]
        : []),
      ...(InformationKeys.includes("name")
        ? [
            {
              name: "name",
              label: "Employee Name",
              value: userProfile.name,
            },
          ]
        : []),
      ...(InformationKeys.includes("department")
        ? [
            {
              name: "department_name",
              label: "Department",
              value: getLabelByValue(userProfile.department_name, Departments),
            },
          ]
        : []),
      ...(InformationKeys.includes("position")
        ? [
            {
              name: "department_position",
              label: "Designation",
              value: getLabelByValue(
                userProfile.department_position,
                Designations
              ),
            },
          ]
        : []),
      ...(InformationKeys.includes("branch")
        ? [
            {
              name: "branch_id",
              label: "Branch",
              value: getLabelByValue(userProfile.branch_id, Branches),
            },
          ]
        : []),
      ...(InformationKeys.includes("employment_type")
        ? [
            {
              name: "employee_type",
              label: "Employment Type",
              value: getEmployeeType(userProfile.employee_type),
            },
          ]
        : []),
      ...(InformationKeys.includes("joining_date")
        ? [
            {
              name: "joining_date",
              label: "Joining Date",
              value: renderDate(userProfile.joining_date),
            },
          ]
        : []),
      ...(InformationKeys.includes("currency")
        ? [
            {
              name: "Currency",
              label: "Currency",
              value: "AED",
            },
          ]
        : []),
      ...(InformationKeys.includes("disbursement_type")
        ? [
            {
              name: "disbursement_type",
              label: "Disbursement Type",
              value: userProfile.disbursement_type || "N/A",
            },
          ]
        : []),
      ...(InformationKeys.includes("contracted_salary")
        ? [
            {
              name: "isContracted",
              label: "Contracted Salary",
              value: userProfile.isContracted ? "Contracted" : "Not Contracted",
            },
          ]
        : []),
    ].filter(Boolean);
    return variant === "ViewMode"
      ? employeeDataList &&
          employeeDataList.map((data) => {
            return (
              <DetailBox
                orientation="horizontal"
                key={data.label}
                className=""
                label={data.label}
                value={data.value}
                fallbackText={""}
              />
            );
          })
      : employeeDataList &&
          employeeDataList.map((data) => {
            return (
              <div className="space-y-2" key={data.label}>
                <TextInput
                  value={data.value}
                  name={data.name}
                  label={data.label}
                  disabled={true}
                />
              </div>
            );
          });
  }
);

export default EmployeeDetailUI;
