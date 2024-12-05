import { getDepartmentList } from "app/hooks/general";
import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import DepartmentAction from "../sections/Departments/DepartmentAction";
import { CardContent } from "components/ui/card";

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
      <CardContent>
      <TableCustom
        columns={columns}
        data={department?.results || []}
        // tableOptions={tableOptions}
        dataTotalSize={department?.results?.length || 0}
        pagination={true}
        itemsPerPage={100}
        className="organization-table"
      />
      </CardContent>
    </Card>
  );
};

export default Departments;
