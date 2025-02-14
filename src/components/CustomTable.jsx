import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../src/@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "../src/@/components/ui/pagination";
import { SelectComponent } from "./FormControl";

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
  const handleRowSelection = (event, rowId) => {
    event.preventDefault();
    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowId)
        ? prevSelected.filter((id) => id !== rowId)
        : [...prevSelected, rowId]
    );
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
                    <input
                      type="checkbox"
                      onChange={handleSelectAllRows}
                      checked={
                        data?.length > 0 &&
                        selectedRows?.length === data?.length
                      }
                      className="w-4 h-4 accent-[#ab4aba] border-[#ab4aba] border-[2px] outline-none rounded focus:ring-0"
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
                      ...(column.width ? { width: column.width } : {}),
                      ...(column.minWidth ? { minWidth: column.minWidth } : {}),
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
                      expandedRowId === row.id && renderExpandedContent
                        ? "border-none"
                        : ""
                    } ${tableOptions?.onRowClick ? "cursor-pointer" : ""} ${
                      selectedRows?.includes(row.id) ? "bg-[#fdf7fd]" : ""
                    } ${disabledRows?.includes(row.id) ? "opacity-50" : ""}`}
                  >
                    {/* Select Row Checkbox */}
                    {selectable && (
                      <TableCell className="p-0 pl-1 w-[0px] text-right ml-0 text-neutral-1200">
                        <input
                          type="checkbox"
                          onChange={(e) => handleRowSelection(e, row.id)}
                          checked={selectedRows?.includes(row.id)}
                          className="w-4 h-4 accent-[#ab4aba] border-[#ab4aba] border-[2px] outline-none rounded focus:ring-0"
                        />
                      </TableCell>
                    )}
                    {/* Table Data */}
                    {Array.isArray(columns) &&
                      columns.map((column, index) => (
                        <TableCell
                          key={index}
                          className={`min-w-fit text-neutral-1200 ${
                            column.onClick || column.rowExpandOnClick
                              ? "cursor-pointer expandable-cell"
                              : ""
                          }`}
                          style={{
                            ...(column.width ? { width: column.width } : {}),
                            ...(column.minWidth
                              ? { minWidth: column.minWidth }
                              : {}),
                            ...(column.dataAlign
                              ? { textAlign: column.dataAlign }
                              : {}),
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
                                index
                              )
                            : row[column.dataField]}
                        </TableCell>
                      ))}
                  </TableRow>
                  {/* Expanded Row Content */}
                  {expandedRowId === row.id && renderExpandedContent && (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="text-neutral-1200 pt-0"
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
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
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
      <SelectComponent
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
