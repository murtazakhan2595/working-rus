import { getDepartmentList } from "app/hooks/general";
import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import DepartmentAction from "../sections/Departments/DepartmentAction";
import DesignationAction from "../sections/Designations/DesignationAction";
import { CardContent } from "components/ui/card";
import { PageLoader } from "components";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";

const Designations = ({
  loading,
  designation,
  setDesignation,
  options,
  setOptions,
  getDesignations,
}) => {
  //
  // const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

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
      dataField: "organization",
      text: "Organization",
    },
    {
      text: "Action",
      formatter: (cell, row) => (
        <DesignationAction reload={getDesignations} data={row} />
      ),
    },
  ];

  useEffect(() => {
    getDesignations();
  }, [options]);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Designations</CardTitle>
          </CardHeader>
          <CardContent>
            <TableCustom
              columns={columns}
              data={designation?.results || []}
              // tableOptions={tableOptions}
              dataTotalSize={designation?.count || 0}
              pagination={true}
              tableOptions={tableOptions}
              className="designation-table"
            />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Designations;
