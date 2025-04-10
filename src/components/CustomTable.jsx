import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "../src/@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "../src/@/components/ui/pagination";
import { SelectInputComponent, CheckBoxInput } from "./FormControl";

export default function TableCustom({
  columns,
  data,
  tableOptions,
  dataTotalSize,
  rowExpand,
  renderExpandedContent,
  dataStyle,
  pagination = true,
  className = "",
  showHeader = true,
  selectable = false,
  selectedRows,
  setSelectedRows,
  disabledRows,
  fallbackText = "No data available",
  footerText = null,
}) {
  // State for expanded row tracking
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(tableOptions?.page ?? 1);
  const [sortingState, setSortingState] = useState({});
  // Default table options (pagination settings)
  const paginationOptions = {
    sizePerPage: tableOptions?.sizePerPage ?? 10,
  };

  // Function to toggle row expansion
  const toggleRowExpansion = (rowId) => {
    setExpandedRowId((prevRowId) => (prevRowId === rowId ? null : rowId));
  };

  // Total pages calculation
  const totalPages = Math.ceil(dataTotalSize / paginationOptions.sizePerPage);

  // Sorting logic triggered when clicking on a column header
  const handleSortChange = (event, column) => {
    event.preventDefault();

    if (column.dataSort) {
      const key = column.dataField;
      const existingSortState = sortingState;

      let newOrder;
      if (existingSortState.key === key) {
        // Toggle sorting order
        newOrder = existingSortState.order === "asc" ? "desc" : "asc";
      } else {
        newOrder = "asc";
      }

      // Update sorting state
      setSortingState({ key, order: newOrder });

      // Trigger sorting action
      tableOptions.onSortChange(newOrder === "asc" ? key : `-${key}`);
    }
  };

  // Pagination - Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      tableOptions.onPageChange("page", page);
    }
  };

  // Pagination - Handle page size change
  const handlePageSizeChange = (name, pageSize) => {
    if (tableOptions.onPageChange) {
      setCurrentPage(1); // Reset to first page when changing page size
      tableOptions.onPageChange(name, pageSize);
    }
  };

  // Row selection logic
  const handleRowSelection = (rowId) => {
    console.log(selectedRows);
    if (selectedRows.includes(rowId)) {
      const uploadedRows = selectedRows.filter((id) => id !== rowId);
      setSelectedRows(uploadedRows);
    } else {
      setSelectedRows([...selectedRows, rowId]);
    }
  };

  // Select all rows
  const handleSelectAllRows = () => {
    if (selectedRows?.length === data?.length) {
      setSelectedRows([]); // Deselect all rows
    } else {
      setSelectedRows(data.map((row) => row.id)); // Select all rows
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Table>
          {/* Table Header */}
          {showHeader && Array.isArray(columns) && (
            <TableHeader>
              <TableRow>
                {/* Select All Checkbox */}
                {selectable && (
                  <TableHead className="p-0 w-[0px] text-right m-0">
                    <CheckBoxInput
                      name="select-all"
                      value={
                        data?.length > 0 &&
                        selectedRows?.length === data?.length
                      }
                      onChange={(_) => {
                        handleSelectAllRows();
                      }}
                    />
                  </TableHead>
                )}
                {/* Column Headers */}
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className={`min-w-fit ${
                      column.dataSort ? "cursor-pointer" : ""
                    }`}
                    style={{
                      ...(column.width
                        ? {
                            width: column.width,
                            minWidth: column.width,
                            maxWidth: column.width,
                          }
                        : {}),
                      ...(column.minWidth ? { minWidth: column.minWidth } : {}),
                      ...(column.headerStyle ? column.headerStyle : {}),
                      ...(column.headerAlign
                        ? { textAlign: column.headerAlign }
                        : {}),
                    }}
                    onClick={(e) => handleSortChange(e, column)}
                  >
                    {column.text}
                    {column.dataSort &&
                      sortingState.key === column.dataField && (
                        <span className="ml-1">
                          {sortingState.order === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          {/* Table Body */}
          <TableBody>
            {data?.length > 0 ? (
              data.map((row, recordIndex) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    onClick={(e) => {
                      e.preventDefault();
                      !e.target.closest(".expandable-cell") &&
                        (rowExpand
                          ? toggleRowExpansion(row.id)
                          : tableOptions?.onRowClick?.(row));
                    }}
                    className={`${
                      tableOptions?.onRowClick ? "cursor-pointer" : ""
                    } ${selectedRows?.includes(row.id) ? "bg-[#fdf7fd]" : ""} ${
                      disabledRows?.includes(row.id) ? "opacity-50" : ""
                    }`}
                  >
                    {/* Select Row Checkbox */}
                    {selectable && (
                      <TableCell className="p-0 pl-1 w-[0px] text-right ml-0 text-neutral-1200">
                        <CheckBoxInput
                          name="select-row"
                          value={selectedRows?.includes(row.id)}
                          onChange={(_) => {
                            handleRowSelection(row.id);
                          }}
                        />
                      </TableCell>
                    )}
                    {/* Table Data */}
                    {Array.isArray(columns) &&
                      columns.map((column, index) => (
                        <TableCell
                          key={index}
                          className={`min-w-fit w-fit text-neutral-1200 ${
                            column.onClick || column.rowExpandOnClick
                              ? "cursor-pointer expandable-cell"
                              : ""
                          }`}
                          style={{
                            ...(column.width
                              ? {
                                  width: column.width,
                                  minWidth: column.width,
                                  maxWidth: column.width,
                                }
                              : {}),
                            ...(column.minWidth
                              ? { minWidth: column.minWidth }
                              : {}),
                            ...(column.dataAlign
                              ? { textAlign: column.dataAlign }
                              : {}),
                            ...(column.dataStyle ? column.dataStyle : {}),
                            ...dataStyle,
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            if (column.rowExpandOnClick)
                              toggleRowExpansion(row.id);
                            else if (column.onClick)
                              column.onClick(recordIndex, data, row);
                          }}
                        >
                          {column.formatter
                            ? column.formatter(
                                row[column.dataField],
                                row,
                                data,
                                index,
                                expandedRowId === row.id
                              )
                            : row[column.dataField]}
                        </TableCell>
                      ))}
                  </TableRow>
                  {/* Expanded Row Content */}
                  {expandedRowId === row.id && renderExpandedContent && (
                    <TableRow
                      className={`transition-all duration-500 ease-in-out transform ${
                        expandedRowId === row.id
                          ? "scale-y-100 opacity-100"
                          : "scale-y-0 opacity-0"
                      }`}
                      style={{
                        transformOrigin: "top",
                      }}
                    >
                      <TableCell
                        colSpan={columns.length}
                        className="text-neutral-1200 p-0"
                      >
                        {renderExpandedContent(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="py-4 text-center text-neutral-1200"
                >
                  {fallbackText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {footerText && <TableFooter>{footerText}</TableFooter>}
        </Table>
      </div>

      {/* Pagination Controls */}
      {pagination && dataTotalSize > 10 && (
        <div className="flex justify-between ">
          <CustomPageSizePagination
            sizePerPage={paginationOptions.sizePerPage}
            onPageChange={handlePageSizeChange}
          />
          <Pagination className="max-w-[calc(100%_-_100px)]">
            <PaginationContent className="max-w-full justify-center">
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
              />
              <div className="flex flex-row overflow-x-hidden max-w-[calc(100%_-_185px)]">
                {Array.from({ length: totalPages }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => handlePageChange(index + 1)}
                      className={`hover:bg-plum-300 ${
                        currentPage - 1 === index
                          ? "text-plum-1000 bg-plum-300"
                          : ""
                      }`}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              </div>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
const CustomPageSizePagination = ({ sizePerPage, onPageChange }) => {
  const [size, setSize] = useState(sizePerPage);
  const handleSizeClick = (size) => {
    onPageChange("page", 1);
    onPageChange("sizePerPage", size);
  };
  return (
    <div>
      <SelectInputComponent
        value={size}
        options={[
          { value: 10, label: 10 },
          { value: 25, label: 25 },
          { value: 50, label: 50 },
          // { value: 100, label: 100 },
        ]}
        onChange={(name, value) => {
          handleSizeClick(value);
          setSize(value);
        }}
      />
    </div>
  );
};
