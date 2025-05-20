import TableCustom from 'components/CustomTable';
import { CardTitle, CardHeader, CardContent, Card } from 'components/ui/card';
import { WorkingHoursColumn } from '../sections/OfficeSettingTableColumns';
import { CardDescription } from 'components/ui/card';
import { FilterInput } from 'components/FormControl';
import { useState, useEffect } from 'react';

const WorkingHours = ({ data, reload }) => {
  const [filteredData, setFilteredData] = useState(data || []);
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setFilteredData(data || []);
  }, [data]);

  const handleFilterChange = (filterName, filterValue) => {
    if (!data) return;

    if (filterName === 'shift_name') {
      setSearchTerm(filterValue);
    }
    if (filterName === 'type') {
      setSelectedType(filterValue);
    }

    const filtered = data.filter(item => {
      const matchesSearch = !searchTerm || 
        (filterName === 'shift_name' ? 
          item.shift_name?.toLowerCase().includes(filterValue.toLowerCase()) :
          item.shift_name?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = !selectedType || 
        (filterName === 'type' ? 
          item.shift_type === filterValue :
          item.shift_type === selectedType);

      return matchesSearch && matchesType;
    });

    setFilteredData(filtered);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Working Hours</CardTitle>
        <CardDescription className="text-neutral-1100">
          Here you can manage your working hours. Add, edit, or delete working hours as needed.
        </CardDescription>
        <div className="flex justify-end">
          <FilterInput 
            filters={[
              {
                type: "search",
                placeholder: "Search Shift Name",
                name: "shift_name",
                values: searchTerm
              },
              {
                type: "select-one",
                placeholder: "Shift Type",
                name: "type",
                values: selectedType,
                option: [
                  { value: "Weekday", label: "Weekday" },
                  { value: "Weekend", label: "Weekend" }
                ]
              }
            ]} 
            onChange={handleFilterChange} 
            className="justify-end"
          />
        </div>
      </CardHeader>
      <CardContent>
        <TableCustom
          columns={WorkingHoursColumn(reload)}
          data={filteredData}
          pagination={false}
          itemsPerPage={100}
          className="organization-table"
        />
      </CardContent>
    </Card>
  );
};

export default WorkingHours;
