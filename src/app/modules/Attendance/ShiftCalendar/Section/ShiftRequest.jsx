
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "components/ui/card";
import { TableCustom } from "components";

const ShiftRequest = () => {

  const [isLoading, setIsLoading] = useState(true);
    const [ordering, setOrdering] = useState("-id");
    const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
    const onPageChange = (name, value) => {
      setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
    };
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  return (<div
  className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
>
  <div className="flex flex-col justify-between gap-2 lg:flex-row md:flex-row xl:flex-row">

    {/* <FilterInput
      filters={[
        {
          type: "search",
          placeholder: "Search by ID and Name",
          name: "emp_search",
        },
        {
          type: "select-one",
          option: Departments,
          name: "department_name",
          placeholder: "Department",
          values: selectedDepartment,
        },
        {
          type: "select-two",
          option: Designations,
          name: "department_position",
          placeholder: "Designation",
          values: selectedDesignation,
        },
        {
          type: "select-three",
          option: UserRoles,
          name: "user_role",
          placeholder: "Role",
          values: selectedRole,
        },
      ]}
      onChange={handleFilterChange}
    /> */}
  </div>
  <Card>
    <CardContent>
      <TableCustom
        data={[]}
        columns={[]}
        pagination={true}
        dataTotalSize={ 0}
        tableOptions={tableOptions}
      />
    </CardContent>
  </Card>
</div>
);
};

export default ShiftRequest;
