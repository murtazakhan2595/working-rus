import { getDepartmentList } from "app/hooks/general";
import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import DepartmentAction from "../sections/Departments/DepartmentAction";
import { CardContent } from "components/ui/card";

const Departments = () => {
  const [department, setDepartments] = useState(null);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

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
          data={row}
        />
      ),
    },
  ];

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const departmentResponse = await getDepartmentList(true, options);
        setDepartments(departmentResponse);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };
    fetchLists();
  }, [options]);


  return (
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
  );
};

export default Departments;
