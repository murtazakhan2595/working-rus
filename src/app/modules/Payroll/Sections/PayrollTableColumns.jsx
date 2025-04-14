import { EmployeeID, UserRole } from "utils/getValuesFromTables";
import { RenderJobApplicationActions } from "app/modules/RecruitmentData/Applications/Sections";
import { dropdownOptions } from "data/Data";
import { EmployeeOverview, StatusLabel, OverviewCard } from "components";
import moment from "moment";
import { renderDate } from "utils/renderValues";
import { Switch } from "src/@/components/ui/switch";
import { RenderTerminatedRow } from "app/modules/ExitAndClearance/Sections";
import { RenderResignedRow } from "app/modules/ExitAndClearance/Sections";
import { SalaryType, DesignationName } from "utils/getValuesFromTables";
import { Badge } from "components/ui/badge";
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

export const SalarySetupColumns = [
  {
    dataField: "serial_number",
    text: "ID",
    formatter: (cell) => <EmployeeID value={cell} />,
  },
  {
    dataField: "id",
    text: "Employees",
    formatter: (cell, row) => (
      <EmployeeOverview id={cell} showDepartment={true} />
    ),
  },
  {
    dataField: "salary",
    text: "Monthly Salary",
  },
  {
    dataField: "salary_type",
    text: "Salary Type",
    formatter: (cell) => <SalaryType value={cell} fallBackText={"-"} />,
  },
  {
    dataField: "is_new",
    text: "",
    formatter: (cell, row) => {
      const showNewBadge = cell === null || cell === true;
      const showEosBadge = row.is_eos_applicable === true;
      if (showNewBadge || showEosBadge) {
        return (
          <div class="flex gap-2">
            {showNewBadge && <Badge variant={"dot-plum"} dot={'bg-plum-1100'}>New</Badge>}
            {showEosBadge && <Badge variant={"dot-plum"} dot={'bg-plum-1100'}>EOS</Badge>}
          </div>
        );
      }
    },
  },
];

export const SalaryComponentColumns = (onCheckedChange) => [
  {
    dataField: "name",
    text: "Component Name",
  },
  {
    dataField: "income_type",
    text: "Component Type",
    formatter: (cell) => (
      <div className="">
        <div className="h-6 px-3 py-[3px] rounded-full border border-[#f0f0f3] justify-center items-center gap-1.5 inline-flex">
          <div
            className={`w-1.5 h-1.5 ${
              cell === "deduction" ? "bg-[#29a385]" : "bg-[#EA3E69]"
            } rounded-full`}
          />
          <div className="text-neutral-1200 text-xs font-semibold  leading-3 capitalize">
            {cell}
          </div>
        </div>
      </div>
    ),
  },
  {
    dataField: "amounts_types",
    text: "Amount Type",
    formatter: (cell) => (
      <div className="capitalize">
        {cell === "percentage" ? "Variable" : cell}
      </div>
    ),
  },
  {
    dataField: "amounts",
    text: "Amount",
    formatter: (cell, row) => {
      console.log("INFO", cell, row);
      const amount =
        row.amounts_types === "percentage"
          ? `${Math.fround(cell)}% of gross`
          : `AED ${cell} Flat Amount`;
      return <>{amount}</>;
    },
  },
  {
    dataField: "is_active",
    text: "Active",
    formatter: (cell, row) => {
      return (
        <div
          onClick={(event) => {
            // Stop the event propagation to prevent onRowClick from being triggered
            event.stopPropagation();
          }}
        >
          <Switch
            id="activate"
            checked={cell}
            onCheckedChange={(value) => {
              // The event is handled by the div, so no need to stop it here
              onCheckedChange(value, row);
            }}
          />
        </div>
      );
    },
  },
];

