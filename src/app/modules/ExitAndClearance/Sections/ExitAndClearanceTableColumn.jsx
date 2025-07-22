import { EmployeeID, ManagerName } from "utils/getValuesFromTables";
import {
  RenderTerminationAction,
} from "app/modules/ExitAndClearance/ExitRequests";
import { EmployeeOverview } from "components";
import moment from "moment";
import { AiOutlineDownload } from "react-icons/ai";
import { downloadAttachmentDirectLink } from "utils/fileUtils";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";



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
    dataField: "serial_number",
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
    dataField: "exit_date",
    text: "Exit date",
    formatter: (cell) => renderDate(cell),
    dataSort: true,
    minWidth: "115px",
  },
  {
    dataField: "",
    text: "Application",
    formatter: (cell, row) => (
      <>
        {row?.termination_letter ? (
          <button
            className="justify-start items-center gap-2.5 inline-flex"
            onClick={(e) => {
              e.preventDefault();
              downloadAttachmentDirectLink(
                row.termination_letter,
                `Termination_${row.employee_id || row.serial_number}`
              );
            }}
          >
            <div className="text-[#5c5e64] text-base font-normal">File</div>
            <AiOutlineDownload />
          </button>
        ) : (
          "N/A"
        )}
      </>
    ),
  },
  {
    dataField: "clearance_status",
    text: "Clearance Status",
    formatter: (cell, row) => <StatusLabel status={cell}>{cell}</StatusLabel>,
    dataSort: true,
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => <StatusLabel status={cell}>{cell}</StatusLabel>,
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