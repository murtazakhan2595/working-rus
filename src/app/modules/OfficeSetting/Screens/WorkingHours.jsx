
import TableCustom from 'components/CustomTable';
import { CardTitle, CardHeader, CardContent, Card } from 'components/ui/card';
import { WorkingHoursColumn } from '../sections/OfficeSettingTableColumns';
import { CardDescription } from 'components/ui/card';




const WorkingHours = ({ data, reload }) => {
 
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Working Hours</CardTitle>
        <CardDescription className="text-neutral-1100">
          Here you can manage your working hours. Add, edit, or delete working hours as needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TableCustom
          columns={WorkingHoursColumn(reload)}
          data={data}
          pagination={false}
          itemsPerPage={100}
          className="organization-table"
        />
      </CardContent>
    </Card>
  );
};

export default WorkingHours;
