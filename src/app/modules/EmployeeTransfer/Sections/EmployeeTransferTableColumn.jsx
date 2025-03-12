import { EmployeeID, UserRole } from "utils/getValuesFromTables";
import { EmployeeTransferStatusView } from "app/modules/EmployeeTransfer/Sections";
import { dropdownOptions, formatNumber } from "data/Data";
import { EmployeeOverview, StatusLabel, OverviewCard } from "components";
import EmployeeAction from "app/modules/Employees/Screens/Sections/EmployeeActions";
import { EmployeeAttendenceHistoryActions } from "app/modules/Attendance/EmployeeAttendance/Section";
import moment from "moment";
import { renderDate } from "utils/renderValues";
import { AiOutlineDownload } from "react-icons/ai";
import { RenderTerminatedRow } from "app/modules/ExitAndClearance/Sections";
import { RenderResignedRow } from "app/modules/ExitAndClearance/Sections";
import EmployeeDataInfo from "app/modules/payroll/Sections/EmployeeDataInfo";
import { DesignationName } from "utils/getValuesFromTables";
import { DepartmentName,ManagerName } from "utils/getValuesFromTables";
import { Switch } from "src/@/components/ui/switch";
import { getExpenseType } from "utils/getValuesFromTables";
import { Clock } from "lucide-react";
import ClaimRequestStatus from "app/modules/claims/Sections/ClaimRequestStatus";
import { StatusLabelAttendance } from "components/StatusLabel";
import { formatDuration } from "utils/renderValues";
/**
 * InternalTransferColumns
 *
 * Returns an array of column definitions for the InternalTransfer table.
 *
 * @returns {array} An array of column definitions.
 */
export const InternalTransferColumns = [
  {
    dataField: "employee_id",
    text: "Employees",
    formatter: (cell, row) => (
      <EmployeeOverview
        id={row.employee_id}
        showId={true}
        showPosition={true}
        showDepartment={true}
      />
    ),
    minWidth: "120px",
    // dataSort: true,
  },
  {
    dataField: "new_department",
    text: "New Department",
    formatter: (cell, row) => <DepartmentName value={cell} />,
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "new_reporting_manager",
    text: "New Reporting Manager",
    formatter: (cell, row) => <ManagerName value={cell} />,
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "effective_transfer_date",
    text: "Effective Transfer Date",
    formatter: (cell, row) => renderDate(cell),
    
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell, row) => <EmployeeTransferStatusView status={cell||'PENDING'} />,
  },
];
