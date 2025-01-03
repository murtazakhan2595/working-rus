import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import DepartmentAction from "../sections/Departments/DepartmentAction";
import { CardContent } from "components/ui/card";
import PageLoader from './../../../../components/PageLoader';

const Departments = ({
  options,
  setOptions,
  loading,
  getDepartments,
  department,
}) => {
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const columns = [
    {
      dataField: "id",
      text: "ID",
    },
    {
      dataField: "name",
      text: "Name",
    },
    {
      dataField: "description",
      text: "Description",
    },
    {
      dataField: "Parent Department",
      text: "Parent Department",
    },
    {
      dataField: "organization",
      text: "Organization",
    },
    {
      text: "Action",
      formatter: (cell, row) => (
        <DepartmentAction
          // setEdit={setEdit}
          // setEditData={setEditData}
          reload={getDepartments}
          data={row}
        />
      ),
    },
  ];

  useEffect(() => {
    getDepartments();
  }, [options]);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardContent>
            <TableCustom
              columns={columns}
              data={department?.results || []}
              tableOptions={tableOptions}
              dataTotalSize={department?.count || 0}
              pagination={true}
              className="organization-table"
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Departments;
