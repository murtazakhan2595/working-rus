import React, { useState, useMemo } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "../src/@/components/ui/table";
const TableCustom = ({
  columns,
  data,
  tableOptions,
  dataTotalSize,
  className,
  rowExpand,
  renderExpandedContent,
  pagination,
  dataStyle,
}) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const options = {
    page: tableOptions?.page ?? 1,
    sizePerPage: tableOptions?.sizePerPage ?? 10,
  };

  const toggleExpandRow = (rowId) => {
    setExpandedRow(expandedRow === rowId ? null : rowId);
  };

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: "name", order: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [statusFilter, setStatusFilter] = useState("all");
  const [designationFilter, setDesignationFilter] = useState("all");

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
      })
      .slice((page - 1) * pageSize, page * pageSize);
  }, [data, search, sort, page, pageSize, statusFilter, designationFilter]);

  const handleSort = (key) => {
    if (sort.key === key) {
      setSort({ key, order: sort.order === "asc" ? "desc" : "asc" });
    } else {
      setSort({ key, order: "asc" });
    }
  };

  return (
    <div className={`table-container ${className}`}>
      <Table className="overflow-hidden">
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort(column.dataField)}
                key={index}
                style={column.width ? { width: `${column.width}` } : {}}
              >
                {column.text}
                {sort.key === column.dataField && (
                  <span className="ml-1">{sort.order === "asc" ? "\u2191" : "\u2193"}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees && employees.length > 0 ? (
            employees.map((row, recordIndex) => (
              <React.Fragment key={row.id}>
                <TableRow
                  onClick={() => {
                    if (rowExpand) toggleExpandRow(row.id);
                    else if (tableOptions?.onRowClick) tableOptions.onRowClick(row);
                  }}
                >
                  {columns.map((column, index) => (
                    <TableCell
                      className={`${column.onClick ? "cursor-pointer" : ""}`}
                      key={index}
                      style={{ ...(column.width ? { width: `${column.width}` } : {}), ...dataStyle }}
                      onClick={() => {
                        if (column.rowExpandOnClick) toggleExpandRow(row.id);
                        else if (column.onClick) column.onClick(recordIndex, data, row);
                      }}
                    >
                      {column.formatter
                        ? column.formatter(row[column.dataField], row, data, index)
                        : row[column.dataField]}
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
              <TableCell colSpan={columns.length} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
     
    </div>
  );
};

export default TableCustom;
