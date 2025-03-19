import { Switch } from "src/@/components/ui/switch";
import TableCustom from "components/CustomTable";
import { CardTitle, CardHeader, CardContent, Card } from "components/ui/card";
import React, { useEffect, useState } from "react";
import OnboardingActions from "../sections/OnboardingChecklist/OnboardingActions";

const OnboardingChecklist = ({ data, reload }) => {
  const columns = [
    {
      dataField: "name",
      text: "Document Name",
    },
    {
      text: "Action",
      formatter: (cell, row) => (
        <OnboardingActions data={row} reload={reload} />
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">
          Onboarding Document Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TableCustom
          columns={columns}
          data={data || []}
          pagination={false}
          itemsPerPage={100}
          className="organization-table"
        />
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;
