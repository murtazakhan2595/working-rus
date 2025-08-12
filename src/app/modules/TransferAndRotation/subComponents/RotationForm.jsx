import React, {  useState } from "react";
import { CardTitle, CardHeader } from "components/ui/card";
import { Card, CardContent } from "components/ui/card";
import { PageLoader, TableCustom } from "components";


const RotationForm = () => {
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };



  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Employee Rotation History</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length < 0 ? (
            <PageLoader />
          ) : (
            <TableCustom
              data={data.results}
              columns={JobRotationColumns}
              pagination={true}
              dataTotalSize={data.count || 0}
              tableOptions={tableOptions}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default RotationForm;
