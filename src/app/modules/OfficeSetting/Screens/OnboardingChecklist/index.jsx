import TableCustom from "components/CustomTable";
import { CardTitle, CardHeader, CardContent, Card } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { OnboardingChecklistColumn } from "../../sections/OfficeSettingTableColumns";
import { FilterInput } from "components/FormControl";
import { useState, useEffect } from "react";

const OnboardingChecklist = ({ data, reload }) => {
  const [filterData, setFilterData] = useState({});

  const handleFilterChange = (filterName, filterValue) => {
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  // Filter the data based on filterData
  const filteredData = data ? data.filter((item) => {
    // Return true if all filter conditions are met
    for (const [key, value] of Object.entries(filterData)) {
      if (key === 'document_name') {
        // Safe check for document_name property
        const documentName = item?.document_name || item?.name || '';
        if (!documentName.toLowerCase().includes(value.toLowerCase())) {
          return false;
        }
      }
    }
    return true;
  }) : [];

  // Log the first item to understand data structure
  useEffect(() => {
    if (data && data.length > 0) {
      console.log("Sample item structure:", data[0]);
    }
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">
          Onboarding Document Checklist
        </CardTitle>
        <CardDescription className="text-neutral-1100">
          Here you can manage your onboarding document checklist. Add, edit, or delete onboarding document checklist as needed.
        </CardDescription>
        <div className="flex justify-end">
          <FilterInput 
            filters={[
              {
                type: "search",
                placeholder: "Search Document Name",
                name: "document_name",
              },
            ]} 
            onChange={handleFilterChange} 
            className="justify-end"
          />
        </div>
      </CardHeader>
      <CardContent>
        <TableCustom
          columns={OnboardingChecklistColumn(reload)}
          data={filteredData.length > 0 ? filteredData : data || []}
          pagination={false}
          itemsPerPage={100}
          className="organization-table"
        />
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;
