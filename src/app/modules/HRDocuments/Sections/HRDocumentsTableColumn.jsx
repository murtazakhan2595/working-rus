import { StatusLabel, ViewSignature, EmployeeOverview } from "components";
import { renderDate } from "utils/renderValues";
import { DocCategoryName } from "utils/getValuesFromTables";
import { CategoryActions } from "app/modules/HRDocuments/Sections";
import { DocumentActions } from "app/modules/HRDocuments/Screens";
import DueDateUI from "components/ui/DueDateUI";
/**
 * HRDocumentsColumns
 *
 * Returns an array of column definitions for the InternalTransfer table.
 *
 * @returns {array} An array of column definitions.
 */
export const HRDocumentsColumns = (
  showAction = false,
  reloadData = () => {}
) => [
  {
    dataField: "name",
    text: "Name",
    // maxWidth: "200px",
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
    dataField: "expiration_date",
    text: "Expiration Date",
    formatter: (cell, row) => renderDate(cell),
    dataSort: true,
    minWidth: "110px",
  },
  ...(!showAction
    ? [
        {
          dataField: "doc_status",
          text: "Status",
          formatter: (cell, row) => (
            <StatusLabel status={cell}>
              {cell?.charAt(0) + cell?.slice(1).toLowerCase()}
            </StatusLabel>
          ),
          dataSort: true,
          minWidth: "110px",
        },
      ]
    : []),
  // Action column with dropdown menu
  {
    dataField: "",
    text: "Actions",
    formatter: (cell, row) => (
      <DocumentActions document={row} showAction={showAction} reloadData={reloadData} />
    ),
    width: "100px",
    headerAlign: "right",
    align: "right",
  },
];

/**
 * HRDocumentAssigneesColumns
 *
 * Returns an array of column definitions for the InternalTransfer table.
 *
 * @returns {array} An array of column definitions.
 */
export const HRDocumentAssigneesColumns = [
  {
    dataField: "assigned_to_name",
    text: "Employee",
    dataSort: true,
    formatter: (cell, row) => (
      <EmployeeOverview
        id={row.object_id}
        showId={true}
        showDepartment={true}
        showPosition={true}
      />
    ),
  },
  {
    dataField: "assigned_date",
    text: "Assigned Date",
    formatter: (cell, row) => renderDate(cell),
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "acknowledged_date",
    text: "Acknowledged Date",
    formatter: (cell, row) => renderDate(cell, "--"),
    dataSort: true,
    minWidth: "110px",
  },
  {
    dataField: "signature_file",
    text: "Signature",
    formatter: (cell, row) => (
      <ViewSignature signature={cell} className="w-14 h-12" />
    ),
  },
  {
    dataField: "status",
    text: "Status",
    formatter: (cell, row) => (
      <StatusLabel status={cell}>
        {cell?.charAt(0) + cell?.slice(1).toLowerCase()}
      </StatusLabel>
    ),
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
    dataSort: true,
    minWidth: "120px",
  },
  {
    dataField: "document_category",
    text: "Category",
    formatter: (cell, row) => (
      <DocCategoryName value={cell} fallBackText={"-"} />
    ),
    minWidth: "110px",
    dataSort: true,
  },
  {
    dataField: "due_date",
    text: "Due Date",
    formatter: (cell, row) => (
      <DueDateUI
        dueDate={renderDate(cell)}
        tooltipMessagePrefix={"This document"}
        completionState={row.status}
        className={"bg-transparent p-0 text-sm"}
      />
    ),
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
  {
    dataField: "signature_file",
    text: "Signature",
    formatter: (cell, row) => (
      <ViewSignature signature={cell} className="w-14 h-12" />
    ),
  },
];

/**
 * DocCategoryColumns
 *
 * Returns an array of column definitions for the DocCategory table.
 *
 * @returns {array} An array of column definitions.
 */
export const DocCategoryColumns = (reload) => [
  {
    dataField: "name",
    text: "Name",
    minWidth: "120px",
  },
  {
    dataField: "description",
    text: "Description",
    minWidth: "110px",
  },
  {
    text: "Action",
    formatter: (cell, row) => <CategoryActions reload={reload} data={row} />,
    width: "90px",
  },
];
