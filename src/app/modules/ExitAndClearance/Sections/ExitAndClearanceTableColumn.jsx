import { ManagerName } from "utils/getValuesFromTables";
import { RenderTerminationAction, } from "app/modules/ExitAndClearance/ExitRequests";
import { EmployeeOverview } from "components";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";
import AttachmentUI from "components/ui/AttachmentUI";



/**
 * ExitRequestColumns
 *
 * Returns an array of column definitions for the Exit Request table.
 *
 * @param {function} handleRowClicked - A function to handle row clicks.
 * @param {function} reload - A function to reload the table.
 * @param {boolean} hideActions - A boolean to hide actions.
 * @returns {array} An array of column definitions.
 */
export const ExitRequestColumns = (reloadData = () => { }) => [
  {
    dataField: "employee_id__first_name",
    text: "Employees",
    width: "200px",
    formatter: (_, row) => (
      <EmployeeOverview
        id={row.employee_id}
        showId={true}
        showBranchName={true}
        showDepartment={true}
      />
    ),
    dataSort: true,
  },
  {
    dataField: "report_to",
    text: "Report To",
    formatter: (cell, row) => <ManagerName value={cell} />,
  },
  {
    dataField: "notice_period",
    text: "Notice Period",
    dataSort: true,
  },
  {
    dataField: "final_working_day",
    text: "Last Working Day",
    formatter: (cell) => renderDate(cell),
    dataSort: true,
    minWidth: "115px",
  },
  {
    dataField: "",
    text: "Attachment",
    formatter: (_, row) => (
      <>
        <AttachmentUI
          attachment={row.exit_category === 'RESIGNATION' ? row.resignation_letter : row.exit_category === 'TERMINATION' ? row.termination_letter : null}
          viewOnly={true}
          variant={'preview-only'}
          fallBackText='--'
        />
      </>
    ),
  },
  {
    dataField: "clearance_status",
    text: "Clearance Status",
    formatter: (cell) => {
      const status = cell ? cell.toLowerCase().replace('_', ' ') : null;
      if (status)
        return <StatusLabel status={status}>{status}</StatusLabel>;
      return '--';
    },
    dataSort: true,
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => <StatusLabel status={cell}>{cell?.toLowerCase()}</StatusLabel>,
    dataSort: true,
  },
  {
    dataField: "",
    text: "",
    formatter: (_, row, data_list) => (
      <RenderTerminationAction
        data={row}
        reloadData={reloadData}
        DataList={data_list}
      />
    ),
  },
];