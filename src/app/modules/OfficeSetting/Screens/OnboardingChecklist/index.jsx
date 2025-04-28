
import TableCustom from "components/CustomTable";
import { CardTitle, CardHeader, CardContent, Card } from "components/ui/card";

import OnboardingActions from "./OnboardingActions";
import { CardDescription } from "components/ui/card";

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
        <CardDescription className="text-neutral-1100">
          Here you can manage your onboarding document checklist. Add, edit, or delete onboarding document checklist as needed.
        </CardDescription>
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
