import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "../src/@/components/ui/table";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  ButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";

import { IoMdArrowDropdown } from "react-icons/io";
import { useMemo } from "react";
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
    return [...data]
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
  }, [search, sort, page, pageSize, statusFilter, designationFilter]);

  const handleSort = (key) => {
    if (sort.key === key) {
      setSort({ key, order: sort.order === "asc" ? "desc" : "asc" });
    } else {
      setSort({ key, order: "asc" });
    }
  };

  const handlePageChange = (name, page) => {
    setPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleDesignationFilterChange = (designation) => {
    setDesignationFilter(designation);
    setPage(1);
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
          {data && data.length > 0 ? (
            data.map((row, recordIndex) => (
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
                {expandedRow === row.id && (
                  <tr style={{ background: "white" }}>
                    <td colSpan={columns.length}>{renderExpandedContent(row)}</td>
                  </tr>
                )}
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No records to display
              </td>
            </tr>
          )}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </div>
  );
};

const CustomPagination = ({
  currentPage,
  dataTotalSize,
  sizePerPage,
  onPageChange,
}) => {
  return (
    <div className="flex justify-between">
      <CustomPageSizePagination
        sizePerPage={sizePerPage}
        onPageChange={onPageChange}
      />
      <CustomPagePagination
        currentPage={currentPage}
        dataTotalSize={dataTotalSize}
        sizePerPage={sizePerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};


const CustomPageSizePagination = ({ sizePerPage, onPageChange }) => {
  const [openDropdownRow, setOpenDropdownRow] = useState(false);
  const toggleDropdown = () => {
    setOpenDropdownRow(!openDropdownRow);
  };
  const handleSizeClick = (size) => {
    onPageChange("page", 1);
    onPageChange("sizePerPage", size);
  };
  return (
    <div>
      <ButtonDropdown isOpen={openDropdownRow} toggle={() => toggleDropdown()}>
        <DropdownToggle className="btn-brand">
          <span className="flex">
            {sizePerPage} <IoMdArrowDropdown style={{ margin: "auto" }} />
          </span>
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem onClick={() => handleSizeClick(10)}>10</DropdownItem>
          <DropdownItem onClick={() => handleSizeClick(25)}>25</DropdownItem>
          <DropdownItem onClick={() => handleSizeClick(50)}>50</DropdownItem>
          <DropdownItem onClick={() => handleSizeClick(100)}>100</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    </div>
  );
};

const CustomPagePagination = ({
  currentPage,
  dataTotalSize,
  sizePerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(dataTotalSize / sizePerPage);

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange("page", page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    for (let i = currentPage; i <= currentPage + 3 && i <= totalPages; i++) {
      items.push(
        <PaginationItem key={i} active={i === currentPage}>
          <PaginationLink href="#" onClick={() => handlePageClick(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  return (
    <div className="table-pagination">
      <Pagination>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink first href="#" onClick={() => handlePageClick(1)} />
        </PaginationItem>
        <PaginationItem disabled={currentPage === 1}>
          <PaginationLink
            previous
            href="#"
            onClick={() => handlePageClick(currentPage - 1)}
          />
        </PaginationItem>
        {renderPaginationItems()}
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            next
            href="#"
            onClick={() => handlePageClick(currentPage + 1)}
          />
        </PaginationItem>
        <PaginationItem disabled={currentPage === totalPages}>
          <PaginationLink
            last
            href="#"
            onClick={() => handlePageClick(totalPages)}
          />
        </PaginationItem>
      </Pagination>
    </div>
  );
};

export default TableCustom;
