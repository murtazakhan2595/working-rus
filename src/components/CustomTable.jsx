import React, { useState, useMemo } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "../src/@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "../src/@/components/ui/pagination";

export default function TableCustom({
  columns,
  data,
  tableOptions,
  dataTotalSize,
  rowExpand,
  renderExpandedContent,
  dataStyle,
  pagination = true,
  itemsPerPage = 10,
  className = "",
  showHeader = true, // Show header by default
}) {
  const [expandedRow, setExpandedRow] = useState(null);
  const options = {
    page: tableOptions?.page ?? 1,
    sizePerPage: tableOptions?.sizePerPage ?? 10,
  };

  const toggleExpandRow = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState({ key: 'name', order: 'asc' });
  const [statusFilter, setStatusFilter] = useState('all');
  const [designationFilter, setDesignationFilter] = useState('all');

  const employees = useMemo(() => {
    return data
      .filter((employee) => {
        const searchValue = search.toLowerCase();
        const statusFilterValue = statusFilter === "all" ? "" : statusFilter;
        const designationFilterValue = designationFilter === "all" ? "" : designationFilter;
        return (
          (employee.name && employee.name.toLowerCase().includes(searchValue)) ||
          (employee.email && employee.email.toLowerCase().includes(searchValue)) ||
          (employee.designation && employee.designation.toLowerCase().includes(searchValue)) ||
          (statusFilterValue ? employee.status && employee.status.toLowerCase() === statusFilterValue : true) ||
          (designationFilterValue ? employee.designation && employee.designation.toLowerCase() === designationFilterValue : true) ||
          (employee.leaveDate && employee.leaveDate.includes(searchValue))
        );
      })
      .sort((a, b) => {
        if (sort.order === "asc") {
          return a[sort.key] > b[sort.key] ? 1 : -1;
        } else {
          return a[sort.key] < b[sort.key] ? 1 : -1;
        }
      });
  }, [data, search, sort, statusFilter, designationFilter]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return employees.slice(startIndex, startIndex + itemsPerPage);
  }, [employees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(dataTotalSize / itemsPerPage);

  const handleSort = (key) => {
    setSort((prevSort) => ({
      key,
      order: prevSort.key === key && prevSort.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (name, page) => {
    if (page >= 1 && page <= totalPages) {
      tableOptions.onPageChange("page", page);
    }
  };

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        <div>
          <div className="">
            <Table>
              {showHeader && Array.isArray(columns) && (
                <TableHeader>
                  <TableRow>
                    {columns.map((column, index) => (
                      <TableHead
                        key={index}
                        className="cursor-pointer"
                        style={column.width ? { width: column.width } : {}}
                        onClick={() => handleSort(column.dataField)}
                      >
                        {column.text}
                        {sort.key === column.dataField && (
                          <span className="ml-1">{sort.order === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
              )}
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, recordIndex) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        onClick={() => {
                          if (rowExpand) toggleExpandRow(row.id);
                          else if (tableOptions?.onRowClick) tableOptions.onRowClick(row);
                        }}
                      >
                        {Array.isArray(columns) && columns.map((column, index) => (
                          <TableCell
                            className={`${column.onClick ? "cursor-pointer " : ""}`}
                            key={index}
                            style={{ ...(column.width ? { width: `${column.width}` } : {}), ...dataStyle }}
                            onClick={() => {
                              if (column.rowExpandOnClick) toggleExpandRow(row.id);
                              else if (column.onClick) column.onClick(recordIndex, data, row);
                            }}
                          >
                            {column.formatter ? column.formatter(row[column.dataField], row, data, index) : row[column.dataField]}
                          </TableCell>
                        ))}
                      </TableRow>
                      {expandedRow === row.id && renderExpandedContent && (
                        <TableRow>
                          <TableCell colSpan={columns.length}>
                            {renderExpandedContent(row)}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="py-4 text-center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {pagination && (
          <Pagination>
            <PaginationContent>
              <PaginationPrevious onClick={() => handlePageChange("page", currentPage - 1)} />
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink onClick={() => handlePageChange("page", index + 1)}>
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext onClick={() => handlePageChange("page", currentPage + 1)} />
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}
