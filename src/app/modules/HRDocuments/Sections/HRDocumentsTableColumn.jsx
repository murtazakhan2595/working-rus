import {  StatusLabel, ViewSignature } from "components";
import { renderDate } from "utils/renderValues";
import { DocCategoryName } from "utils/getValuesFromTables";
import { CategoryActions } from "app/modules/HRDocuments/Sections";
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
  {
    dataField: "signature_file",
    text: "Signature",
    formatter: (cell, row) => <ViewSignature signature={cell} className='w-14 h-12'/>,
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
    width:'90px'
  },
];
