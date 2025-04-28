
import TableCustom from "components/CustomTable";
import { CardTitle, CardHeader, CardContent, Card } from "components/ui/card";


import { CardDescription } from "components/ui/card";
import { OnboardingChecklistColumn } from "../../sections/OfficeSettingTableColumns";

const OnboardingChecklist = ({ data, reload }) => {
 

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
          columns={OnboardingChecklistColumn(reload)}
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
