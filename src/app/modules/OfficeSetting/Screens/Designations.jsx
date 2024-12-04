import { getDepartmentList } from "app/hooks/general";
import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import DepartmentAction from "../sections/Departments/DepartmentAction";
import { getDesignationList } from "app/hooks/general";
import DesignationAction from "../sections/Designations/DesignationAction";
import { CardContent } from "components/ui/card";

const Designations = () => {
  const [designation, setDesignation] = useState(null);

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
        dataField: "organization",
        text: "Organization",
      },
      {
        text: "Action",
        formatter: (cell, row) => (
          <DesignationAction
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
        const response = await getDesignationList(true);
        setDesignation(response);
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
        data={designation?.results || []}
        // tableOptions={tableOptions}
        dataTotalSize={designation?.length || 0}
        pagination={true}
        itemsPerPage={100}
        className="designation-table"
      />
      </CardContent>
    </Card>
  );
};

export default Designations;
