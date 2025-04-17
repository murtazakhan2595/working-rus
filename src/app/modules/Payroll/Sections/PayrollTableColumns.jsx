import React, { useState } from "react";
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
import { Clock, MapPin, Tag, Pencil, Trash2, X } from "lucide-react";
import ClaimRequestStatus from "app/modules/claims/Sections/ClaimRequestStatus";
import AddComponentSheet from "./AddComponentSheet";
import AlertDialogue from "components/ui/AlertDialogue";
import { toast } from "react-toastify";
import { deleteEarnAndDeduction } from "app/hooks/payroll";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import { format } from "date-fns";


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
    dataField: "name",
    text: "Component",
  },
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
    dataField: "ctc",
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

class ActionButtonCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenEdit: false,
      isOpenDelete: false
    };
  }

  handleOpenEdit = () => {
    this.setState({ isOpenEdit: true });
  };

  handleCloseEdit = () => {
    this.setState({ isOpenEdit: false });
  };

  handleOpenDelete = () => {
    this.setState({ isOpenDelete: true });
  };

  handleCloseDelete = () => {
    this.setState({ isOpenDelete: false });
  };

  handleDeleteConfirm = async () => {
    try {
      const response = await deleteEarnAndDeduction(this.props.row.id);
      if (response) {
        toast.success("Component deleted successfully");
        if (typeof this.props.handleReload === 'function') {
          this.props.handleReload();
        }
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete component");
    }
    this.handleCloseDelete();
  };

  render() {
    const { row, handleReload } = this.props;
    const { isOpenEdit, isOpenDelete } = this.state;

    return (
      <div 
        className="flex items-center gap-3"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="flex items-center justify-center w-8 h-8 transition-colors border border-blue-300 rounded-full hover:bg-blue-50"
                onClick={this.handleOpenEdit}
                aria-label="Edit component"
              >
                <Pencil size={16} className="text-blue-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                className="flex items-center justify-center w-8 h-8 transition-colors border border-red-400 rounded-full hover:bg-red-50"
                onClick={this.handleOpenDelete}
                aria-label="Delete component"
              >
                <X size={16} className="text-red-600" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isOpenEdit && (
          <AddComponentSheet
            component={row}
            isOpen={isOpenEdit}
            setIsOpen={this.handleCloseEdit}
            reload={handleReload}
            onSuccess={handleReload}
            existingComponents={this.props.allComponents}
          />
        )}

        {isOpenDelete && (
          <AlertDialogue
            isOpen={isOpenDelete}
            setIsOpen={this.handleCloseDelete}
            handleContinue={this.handleDeleteConfirm}
            continueText="Delete"
            title={`Are you sure you want to delete "${row.name}"?`}
            description="This action cannot be undone. Once deleted, the component data will be permanently removed."
          />
        )}
      </div>
    );
  }
}

export const SalaryComponentColumns = (onCheckedChange, handleReload, allComponents = []) => [
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
          <div className="text-xs font-semibold leading-3 capitalize text-neutral-1200">
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
            event.stopPropagation();
          }}
        >
          <Switch
            id="activate"
            checked={cell}
            onCheckedChange={(value) => {
              onCheckedChange(value, row);
            }}
          />
        </div>
      );
    },
  },
  {
    dataField: "actions",
    text: "",
    formatter: (cell, row) => <ActionButtonCell row={row} handleReload={handleReload} allComponents={allComponents} />
  }
];

export const AdjustmentComponentColumns = [
  {
    dataField: "employee_id",
    text: "Employee",
    formatter: (cell) => <EmployeeOverview id={cell} showEmail={false} />,
  },
  {
    dataField: "name",
    text: "Adjustment Name",
  },
  {
    dataField: "month",
    text: "Payable Month",
  },
  {
    dataField: "income_type",
    text: "Adjustment Type",
    formatter: (cell) => <div className="capitalize">{cell}</div>,
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
    formatter: (cell) => <>{"AED " + Math.round(cell)}</>,
  },
  {
    dataField: "",
    text: "Status",
    formatter: (cell, row) => {
      return (
        <>
          {row.is_manager_approval ? (
            <ClaimRequestStatus status={row.manager_approval.status} />
          ) : (
            <>N/A</>
          )}
        </>
      );
    },
  },
];
