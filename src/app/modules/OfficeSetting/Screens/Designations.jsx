import { getDepartmentList } from "app/hooks/general";
import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import DepartmentAction from "../sections/DepartmentAction";
import { getDesignationList } from "app/hooks/general";
import DesignationAction from "../sections/DesignationAction";

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
      <TableCustom
        columns={columns}
        data={designation || []}
        // tableOptions={tableOptions}
        dataTotalSize={designation?.length || 0}
        pagination={true}
        itemsPerPage={10}
        className="designation-table"
      />
    </Card>
  );
};

export default Designations;
