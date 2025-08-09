import React from "react";
import { CardTitle, CardHeader } from "components/ui/card";
import { Card, CardContent } from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { PageLoader, TableCustom } from "components";
import { JobRotationColumns } from "../section/RotationTableColums";

const RotationForm = () => {
  const isLoading = false;
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Employee Rotation History</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterInput
            filters={[
              // {
              //   type: "search",
              //   placeholder: "Biometric Id",
              //   name: "user_no",
              // },
              {
                type: "select",
                placeholder: "Employee",
                name: "emp_id",
              },
              {
                type: "select",
                placeholder: "Status",
                name: "status",
                options: [
                  { label: "Break", value: "break" },
                  { label: "Check-In", value: "check-in" },
                  { label: "Check-Out", value: "check-out" },
                ],
              },
              {
                type: "date-range-filter",
                name: "range_date",
              },
            ]}
            className="justify-end mb-4"
          />
          {isLoading ? (
            <PageLoader />
          ) : (
            <TableCustom
              data={[]}
              columns={JobRotationColumns}
              pagination={true}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default RotationForm;
