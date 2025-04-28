import React, { useEffect } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import PageLoader from '../../../../../components/PageLoader';
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { DepartmentColumn } from "../../sections/OfficeSettingTableColumns";

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

 

  useEffect(() => {
    getDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.page, options.sizePerPage]);

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Departments</CardTitle>
          <CardDescription className="text-neutral-1100">
            Here you can manage your departments. Add, edit, or delete departments as needed.
          </CardDescription>
          </CardHeader>
          <CardContent>
            <TableCustom
              columns={DepartmentColumn(getDepartments)}
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
