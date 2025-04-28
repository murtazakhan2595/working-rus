
import React, { useEffect } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";

import DesignationAction from "./DesignationAction";
import { CardContent } from "components/ui/card";
import { PageLoader } from "components";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { DesignationColumn } from "../../sections/OfficeSettingTableColumns";

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
            <CardDescription className="text-neutral-1100">
              Here you can manage your designations. Add, edit, or delete designations as needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TableCustom
              columns={DesignationColumn(getDesignations)}
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
