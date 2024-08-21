import React, { useState } from "react";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  ButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import "./style.css";
import { IoMdArrowDropdown } from "react-icons/io";

const Table = ({
  columns,
  data,
  tableOptions,
  dataTotalSize,
  className,
  rowExpand,
  renderExpandedContent,
  pagination,
  hideTableHeader,
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

  const handlePageChange = (name, page) => {
    if (tableOptions.onPageChange) {
      tableOptions.onPageChange(name, page);
    }
  };

  return (
    <div className={`table-container ${className}`}>
      <table className="table custom-table">
        {!hideTableHeader && (
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  style={column.width ? { width: `${column.width}` } : {}}
                >
                  {column.text}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {data && data.length > 0 ? (
            data.map((row,recordIndex) => (
              <React.Fragment key={row.id}>
                <tr
                  onClick={() => {
                    if (rowExpand) toggleExpandRow(row.id);
                    else if (tableOptions?.onRowClick)
                      tableOptions.onRowClick(row);
                  }}
                >
                  {columns.map((column, index) => (
                    <td
                      className={`${column.onClick ? "cursor-pointer" : ""}`}
                      key={index}
                      style={{
                        ...(column.width ? { width: `${column.width}` } : {}),
                        ...dataStyle
                      }}
                      onClick={() => {
                        if (column.roWExpandOnClick) toggleExpandRow(row.id);
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
                    </td>
                  ))}
                </tr>
                {expandedRow === row.id && (
                  <tr style={{ background: "white" }}>
                    <td colSpan={columns.length}>
                      {renderExpandedContent(row)}
                    </td>
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
        </tbody>
        {pagination && (
          <tfoot>
            <tr >
              <td colSpan={columns.length}>
                <CustomPagination
                  currentPage={options.page}
                  dataTotalSize={dataTotalSize}
                  sizePerPage={options.sizePerPage}
                  onPageChange={handlePageChange}
                />
              </td>
            </tr>
          </tfoot>
        )}
      </table>
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
    <div className="flex justify-between mt-4">
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

export default Table;
