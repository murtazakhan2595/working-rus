import { EmployeeID, ManagerName } from "utils/getValuesFromTables";
import {
  ResignationStatusView,
  RenderResignationAction,
  TerminationStatusView,
  RenderTerminationAction,
} from "app/modules/ExitAndClearance/ExitRequests";
import { EmployeeOverview } from "components";
import moment from "moment";
import { AiOutlineDownload } from "react-icons/ai";

export const EmployeeResignationsColumns = (handleRowClicked, reload) => {
  const columns = [
    {
      dataField: "emp_name",
      text: "Employees",
      formatter: (cell, row) => (
        <EmployeeOverview
          id={row.employee_id}
          showPosition={true}
          showDepartment={true}
        />
      ),
      dataSort: true,
      minWidth: "180px",
      onClick: (recordIndex, data, row) => {
        handleRowClicked(recordIndex, data, row);
      },
    },
    {
      dataField: "employee_id",
      minWidth: "105px",
      text: "ID",
      formatter: (cell) => <EmployeeID value={cell} />,
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
    },
    {
      dataField: "exit_date",
      text: "Exit date",
      formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
      dataSort: true,
      minWidth: "115px",
    },
    {
      dataField: "",
      text: "Application",
      formatter: (cell, row) => (
        <>
          {row?.resignation_letter ? (
            <a
              className="justify-start items-center gap-2.5 inline-flex"
              href={row.resignation_letter}
              target="_blank"
              rel="noreferrer"
              download
            >
              <div className="text-[#5c5e64] text-base font-normal">File</div>

              <AiOutlineDownload />
            </a>
          ) : (
            "N/A"
          )}
        </>
      ),
    },
    {
      dataField: "status_resignation",
      text: "Status",
      dataSort: true,
      formatter: (cell, row) => (
        <ResignationStatusView status={cell} row={row} />
      ),
    },
    {
      dataField: "",
      text: "Action",
      formatter: (cell, row) => (
        <RenderResignationAction row={row} reload={reload} />
      ),
    },
  ];
  return columns;
};

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
export const ExitRequestColumns = (
  handleRowClicked,
  reload,
  hideActions = false
) => {
  const columns = [
    {
      dataField: "employee_id",
      text: "Employees",
      width: "180px",
      formatter: (cell) => (
        <EmployeeOverview id={cell} showPosition={true} showDepartment={true} />
      ),
      onClick: (recordIndex, data, row) => {
        handleRowClicked(recordIndex, data, row);
      },
      dataSort: true,
    },
    {
      dataField: "employee_id",
      text: "ID",
      formatter: (cell) => <EmployeeID value={cell} />,
      dataSort: true,
      minWidth: "105px",
    },
    {
      dataField: "report_to",
      text: "Report To",
      formatter: (cell, row) => <ManagerName value={cell} />,
    },
    {
      dataField: "notice_period",
      text: "Notice Period",
    },
    {
      dataField: "exit_date",
      text: "Exit date",
      formatter: (cell) => <>{moment(cell).format("DD-MM-YYYY")}</>,
      dataSort: true,
      minWidth: "115px",
    },
    {
      dataField: "",
      text: "Application",
      formatter: (cell, row) => (
        <>
          {row?.termination_letter ? (
            <a
              className="justify-start items-center gap-2.5 inline-flex"
              href={row.termination_letter}
              target="_blank"
              rel="noreferrer"
              download
            >
              <div className="text-[#5c5e64] text-base font-normal">File</div>

              <AiOutlineDownload />
            </a>
          ) : (
            "N/A"
          )}
        </>
      ),
    },
    {
      dataField: "status_termination",
      text: "Status",
      formatter: (cell, row) => (
        <TerminationStatusView status={cell} row={row} />
      ),
      dataSort: true,
    },
  ];
  if (!hideActions) {
    columns.push({
      dataField: "",
      text: "Action",
      formatter: (cell, row) => (
        <RenderTerminationAction row={row} reload={reload} viewMode={false} />
      ),
    });
  }
  return columns;
};
