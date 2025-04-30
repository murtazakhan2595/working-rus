import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";

import DesignationAction from "./DesignationAction";
import { CardContent } from "components/ui/card";
import { PageLoader } from "components";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { DesignationColumn } from "../../sections/OfficeSettingTableColumns";
import { Input } from "components/ui/input";
import { Search } from "lucide-react";
import { FilterInput } from "components/FormControl";

const Designations = ({
  loading,
  designation,
  setDesignation,
  options,
  setOptions,
  getDesignations,
  reload,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterData, setFilterData] = useState({});

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const onSortChange = (sortParam) => {
    // Parse sortParam: if it starts with '-', it's descending order
    let sortField = sortParam;
    let sortOrder = 'asc';
    
    if (sortParam.startsWith('-')) {
      sortField = sortParam.substring(1); // Remove the '-' prefix
      sortOrder = 'desc';
    }
    
    setOptions((prevOptions) => ({ 
      ...prevOptions, 
      sortField, 
      sortOrder 
    }));
  };

  const handleFilterChange = (filterName, filterValue) => {
    // Reset to page 1 when filter changes
    setOptions((prevOptions) => ({ ...prevOptions, page: 1 }));
    
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
    
    // Update options with the new filter
    setOptions((prevOptions) => ({
      ...prevOptions,
      filterData: {
        ...prevOptions.filterData,
        [filterName]: filterValue || undefined
      }
    }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: onSortChange,
  };

  useEffect(() => {
    getDesignations();
  }, [options]);

  // Filters configuration
  const filters = [
    {
      type: "search",
      placeholder: "Search Designation Name",
      name: "name",
    },
  ];

  return (
    <>
      <div className="flex flex-col justify-end gap-4">
        <div className="flex justify-end">
          <FilterInput 
            filters={filters} 
            onChange={handleFilterChange} 
            className="justify-end"
          />
        </div>
        {loading ? (
          <PageLoader />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Designations</CardTitle>
              <CardDescription className="text-neutral-1100">
                Here you can manage your designations. Add, edit, or delete designations as needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TableCustom
                columns={DesignationColumn(reload)}
                data={designation?.results || []}
                dataTotalSize={designation?.count || 0}
                pagination={true}
                tableOptions={tableOptions}
                className="designation-table"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default Designations;
