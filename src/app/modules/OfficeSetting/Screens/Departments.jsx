import { getDepartmentList } from "app/hooks/general";
import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import DepartmentAction from "../sections/DepartmentAction";

const Departments = () => {
  const [department, setDepartments] = useState(null);

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
        const departmentResponse = await getDepartmentList(true);
        setDepartments(departmentResponse);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };
    fetchLists();
  }, []);


  return (
    <Card>
      <TableCustom
        columns={columns}
        data={department || []}
        // tableOptions={tableOptions}
        dataTotalSize={department?.length || 0}
        pagination={true}
        itemsPerPage={10}
        className="organization-table"
      />
    </Card>
  );
};

export default Departments;
