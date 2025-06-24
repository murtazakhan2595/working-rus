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
import { downloadAttachmentDirectLink } from "utils/fileUtils";
import { StatusLabel } from "components";
import { renderDate } from "utils/renderValues";

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
      dataField: "serial_number",
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
            <button
              className="justify-start items-center gap-2.5 inline-flex"
              onClick={(e) => {
                e.preventDefault();
                downloadAttachmentDirectLink(
                  row.resignation_letter,
                  `Resignation_${row.employee_id || row.emp_name}`
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
      headerAlign: "right",

      width: "80px",
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
export const ExitRequestColumns = (reloadData = () => {}) => [
  {
    dataField: "serial_number",
    text: "Employees",
    width: "200px",
    formatter: (_, row) => (
      <EmployeeOverview
        id={row.employee_id}
        showId={true}
        showPosition={true}
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
// if (!hideActions) {
//   columns.push({
//     dataField: "",
//     text: "Action",
//     formatter: (cell, row) => (
//       <RenderTerminationAction row={row} reload={reload} viewMode={false} />
//     ),
//     width: "80px",
//     headerAlign: "right",
//   });
// }
