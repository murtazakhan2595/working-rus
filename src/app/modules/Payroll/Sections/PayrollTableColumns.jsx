import { EmployeeID, UserRole } from "utils/getValuesFromTables";
import { RenderJobApplicationActions } from "app/modules/RecruitmentData/Applications/Sections";
import { dropdownOptions } from "data/Data";
import { EmployeeOverview, StatusLabel, OverviewCard } from "components";
import moment from "moment";
import { renderDate } from "utils/renderValues";
import { AiOutlineDownload } from "react-icons/ai";
import { RenderTerminatedRow } from "app/modules/ExitAndClearance/Sections";
import { RenderResignedRow } from "app/modules/ExitAndClearance/Sections";
import { DepartmentName, DesignationName } from "utils/getValuesFromTables";
import { Switch } from "src/@/components/ui/switch";
import { getExpenseType } from "utils/getValuesFromTables";
import { Clock, MapPin, Tag } from "lucide-react";
import ClaimRequestStatus from "app/modules/claims/Sections/ClaimRequestStatus";

export const EmployeePayrollColumns = [
  {
    dataField: "serial_number",
    text: "ID",
  },
  {
    dataField: "employee",
    text: "Employee",
    formatter: (cell, row) => <EmployeeOverview id={cell} showEmail={true} />,
  },
  {
    dataField: "department_role",
    text: "Designation",
    formatter: (cell) => <DesignationName value={cell} />,
  },
  {
    dataField: "department_name",
    text: "Department",
  },
  {
    dataField: "latest_effective_date",
    text: "Last Revised Date",
    formatter: (cell, row) => {
      // Check if the cell has a value
      if (!cell)
        return (
          <div class="h-[22px] px-3 py-[3px] rounded-full border border-[#f1d1f3] justify-end items-center gap-1.5 inline-flex">
            <div class="text-[#ab4aba] text-xs font-semibold">New</div>
          </div>
        );

      return <>{renderDate(cell)}</>;
    },
  },

  {
    dataField: "basic_salary",
    text: "Total cost",
    formatter: (cell) => <>{"AED " + Math.round(cell)}</>,
  },
  {
    dataField: "salary_type",
    text: "Salary Type",
    formatter: (cell) => <div className="capitalize">{cell}</div>,
  },
];

export const EmployeePayslipColumns = [
  {
    dataField: "month",
    text: "Month",
  },
  {
    dataField: "basic_salary",
    text: "Basic Salary",
    formatter: (cell) => <>{"AED " + Math.round(cell)}</>,
  },
  {
    dataField: "gross_salary",
    text: "Total Deductions",
    formatter: (cell, row) => {
      return <>{"AED " + (cell - row.net_salary)}</>;
    },
  },
  {
    dataField: "",
    text: "Total Earnings",
    formatter: (cell, row) => {
      return <>{row.net_salary > 0 ? "AED " + row.net_salary : "0.00"} </>;
    },
  },
  {
    dataField: "net_salary",
    text: "Gross Salary",
    formatter: (cell, row) => {
      return <>{"AED " + cell}</>;
    },
  },
];

export const PayrunEmployeePayrollColumns = [
  {
    dataField: "serial_number",
    text: "ID",
  },
  {
    dataField: "employee",
    text: "Employee",
    formatter: (cell, row) => (
      <>
        <EmployeeOverview
          id={cell}
          showEmail={row.work_email}
          showDepartment={true}
        />
      </>
    ),
  },
  {
    dataField: "basic_salary",
    text: "Basic Salary",
    formatter: (cell, row) => {
      const total = Number(cell).toFixed(2);
      return <>{"AED " + total}</>;
    },
  },

  {
    dataField: "total_earnings",
    text: "Earnings",
    formatter: (cell, row) => {
      const total = Number(cell).toFixed(2);
      return <>{"AED " + total}</>;
    },
  },
  {
    dataField: "total_deductions",
    text: "Deductions",
    formatter: (cell, row) => {
      const total = Number(cell).toFixed(2);
      return <>{"AED " + total} </>;
    },
  },
  {
    dataField: "total_reimbursements",
    text: "Claims",
    formatter: (cell) => {
      const total = Number(cell).toFixed(2);
      return <>{"AED " + total}</>;
    },
  },
  {
    dataField: "total_earnings_types",
    text: "Gross Pay",
    formatter: (cell, row) => (
      <>
        {"AED " +
          Math.round(
            cell +
              row.total_earnings * 1 +
              row.basic_salary * 1 +
              row.total_reimbursements * 1
          )}
      </>
    ),
  },
];

export const EmployeeAllowancesColumns = [
  {
    dataField: "description",
    text: "Allowances types",
  },
  {
    dataField: "amount",
    text: "Amount",
    formatter: (cell, row) => {
      const total = Number(cell).toFixed(2);
      return (
        <>
          {total}
          {row.amount_type === "fixed" ? "AED" : "%"}
        </>
      );
    },
  },
];
export const EmployeeDeductionsColumns = [
  {
    dataField: "description",
    text: "Deduction types",
  },
  {
    dataField: "amount",
    text: "Amount",
    formatter: (cell, row) => {
      const total = Number(cell).toFixed(2);
      return (
        <>
          {total}
          {row.amount_type === "fixed" ? "AED" : "%"}
        </>
      );
    },
  },
];
