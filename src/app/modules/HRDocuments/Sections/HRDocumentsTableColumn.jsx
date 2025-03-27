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
import { DocCategoryName, ManagerName } from "utils/getValuesFromTables";
import { Switch } from "src/@/components/ui/switch";
import { getExpenseType } from "utils/getValuesFromTables";
import { Clock } from "lucide-react";
import ClaimRequestStatus from "app/modules/claims/Sections/ClaimRequestStatus";
import { StatusLabelAttendance } from "components/StatusLabel";
import { formatDuration } from "utils/renderValues";
/**
 * HRDocumentsColumns
 *
 * Returns an array of column definitions for the InternalTransfer table.
 *
 * @returns {array} An array of column definitions.
 */
export const HRDocumentsColumns = [
  {
    dataField: "name",
    text: "Name",
    // minWidth: "120px",
    dataSort: true,
  },
  {
    dataField: "category",
    text: "Category",
    formatter: (cell, row) => <DocCategoryName value={cell} />,
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "target_audience",
    text: "Target Audience",
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "expiration_date",
    text: "Expiration Date",
    formatter: (cell, row) => renderDate(cell),
    dataSort: true,
    minWidth: "110px",
  },
  // {
  //   dataField: "status",
  //   text: "Type",
  //   dataSort: true,
  //   formatter: (cell, row) => (
  //     <EmployeeTransferStatusView status={cell || "PENDING"} />
  //   ),
  // },
];

/**
 * MyTransfersColumns
 *
 * Returns an array of column definitions for the MyTransfers table.
 *
 * @returns {array} An array of column definitions.
 */
export const MyHRDocumentsColumns = [
  {
    dataField: "document_name",
    text: "Name",
    minWidth: "120px",
    dataSort: true,
  },
  {
    dataField: "new_department",
    text: "Category",
    formatter: (cell, row) => (
      <DocCategoryName value={cell} fallBackText={"-"} />
    ),
    dataSort: true,
    minWidth: "110px",
  },
  // {
  //   dataField: "new_reporting_manager",
  //   text: "New Reporting Manager",
  //   formatter: (cell, row) => <ManagerName value={cell} fallBackText="-" />,
  //   dataSort: true,
  //   minWidth: "110px",
  // },
  // {
  //   dataField: "new_location",
  //   text: "New Location",
  //   dataSort: true,
  //   minWidth: "110px",
  // },
  {
    dataField: "due_date",
    text: "Due Date",
    formatter: (cell, row) => renderDate(cell),

    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "status",
    text: "Status",
    dataSort: true,
    formatter: (cell, row) => (
      <StatusLabel className="cursor-pointer" status={cell}>
        {cell.charAt(0) + cell.slice(1).toLowerCase()}
      </StatusLabel>
    ),
  },
];
