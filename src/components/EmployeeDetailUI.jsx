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
    className = "",
    variant = "ViewMode", // othere options are [ViewMode,FormView]
    InformationKeys = [],
    ViewVariant = "horizontal", // othere options are [horizontal,veritical,simple-text]
  }) => {
    const Departments = useSelector((state) => state.common.departments);
    const Designations = useSelector((state) => state.common.designations);
    const Branches = useSelector((state) => state.common.branches);
    const Managers = useSelector((state) => state.emp.reportingManagers);
    const userProfile = id ? GetUser(id) : {};
    if (!userProfile) return null;
    const employeeDataList = [
      ...(InformationKeys.includes("id")
        ? [
            {
              name: "serial_number",
              label: "ID",
              value: userProfile.serial_number,
              name: "serial_number",
            },
          ]
        : []),
      ...(InformationKeys.includes("name")
        ? [
            {
              name: "name",
              label: "Name",
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
      ...(InformationKeys.includes("manager")
        ? [
            {
              name: "report_to",
              label: "Reporting Manager",
              value: getLabelByValue(
                parseInt(userProfile.direct_report),
                Managers
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
      ...(InformationKeys.includes("work_location")
        ? [
            {
              name: "employee_location",
              label: "Work Location",
              value: userProfile.employee_location,
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

         ...(InformationKeys.includes("joining_date_tenure")?[
           {
          name: "branch_tenure",
          label: "Current Branch Tenure",
          value: calculateTenure(userProfile.joining_date)
        },
         ]:[]),

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
      ...(InformationKeys.includes("contact_no")
        ? [
            {
              name: "contact_no",
              label: "Phone No",
              value: userProfile.contact_no,
            },
          ]
        : []),
    ].filter(Boolean);
    if (variant === "ViewMode" && ViewVariant === "simple-text") {
      const values =
        employeeDataList && employeeDataList.map((data) => data.value);
      return <span className={className}> {values.join(" - ")}</span>;
    }
    return (
      <div className={className}>
        {variant === "ViewMode"
          ? employeeDataList &&
            employeeDataList.map((data) => {
              return (
                <DetailBox
                  orientation={ViewVariant}
                  key={data.label}
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
            })}
      </div>
    );
  }
);

function calculateTenure(date) {
  if (!date) return "N/A";
  const diff = new Date() - new Date(date);
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor((diff / (1000 * 60 * 60 * 24 * 30)) % 12);
  return `${years} years ${months} months`;
}

export default EmployeeDetailUI;


