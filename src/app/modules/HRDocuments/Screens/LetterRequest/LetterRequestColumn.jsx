import { StatusLabel, EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { EmployeeName } from "utils/getValuesFromTables";
import { LetterRequestActions } from "./LetterRequestActions";

export const LetterRequestColumns = (
  showActions = false,
  reloadData = () => { }
) => [
    {
      dataField: "employee_id",
      text: "Employee",
      formatter: (cell, row) => (
        <EmployeeOverview
          id={cell}
          showId={true}
          showDepartment={true}
          showPosition={true}
        />
      ),
      dataSort: true,
    },
    {
      dataField: "name",
      text: "Request Name",
      dataSort: true,
    },
    {
      dataField: "description",
      text: "Description",
      formatter: (cell) => (
        <div className="max-w-xs truncate" title={cell}>
          {cell}
        </div>
      ),
    },
    {
      dataField: "created_at",
      text: "Request Date",
      formatter: (cell, row) => renderDate(cell),
      dataSort: true,
      minWidth: "110px",
    },
    {
      dataField: "attachments",
      text: "Attachment",
      formatter: (cell) => (
        <div className="text-center">
          {cell ? (
            <span className="text-green-600">✓</span>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      ),
      width: "100px",
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell) => (
        <StatusLabel status={cell}>{cell.toLowerCase()}</StatusLabel>
      ),
      dataSort: true,
      minWidth: "110px",
    },
    ...(showActions
      ? [
        {
          dataField: "",
          text: "Actions",
          formatter: (cell, row) => (
            <LetterRequestActions request={row} reloadData={reloadData} />
          ),
          width: "100px",
          headerAlign: "right",
          align: "right",
        },
      ]
      : []),
  ];

// For Employee View in MyLetterRequest
export const MyLetterRequestColumns = (reloadData)=>[
  {
    dataField: "name",
    text: "Request Name",
    dataSort: true,
  },
  {
    dataField: "description",
    text: "Description",
    formatter: (cell) => (
      <div className="max-w-xs truncate" title={cell}>
        {cell}
      </div>
    ),
  },
  {
    dataField: "created_at",
    text: "Request Date",
    formatter: (cell) => renderDate(cell),
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "attachments",
    text: "Attachment",
    formatter: (cell) => (
      <div className="text-center">
        {cell ? (
          <span className="text-green-600">✓</span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </div>
    ),
    width: "100px",
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => {
      // Show special status for acknowledgment needed
      if (cell === "PENDING" && row.is_acknowledgment && !row.is_emp_ack) {
        return (
          <StatusLabel status="ACKNOWLEDGMENT_NEEDED">
            Acknowledgment Needed
          </StatusLabel>
        );
      }
      return <StatusLabel status={cell}>{cell.toLowerCase()}</StatusLabel>;
    },
    dataSort: true,
    minWidth: "150px",
  },
  {
    dataField: "",
    text: "Actions",
    formatter: (cell, row) => (
      <LetterRequestActions request={row} reloadData={reloadData} isEmpView={true}/>
    ),
    width: "100px",
    headerAlign: "right",
    align: "right",
  }
];
