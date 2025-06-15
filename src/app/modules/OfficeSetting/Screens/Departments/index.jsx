import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import PageLoader from '../../../../../components/PageLoader';
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { DepartmentColumn } from "../../sections/OfficeSettingTableColumns";
import { FilterInput } from "components/FormControl";
import { getDepartmentList } from "app/hooks/general";
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";
import { OfficeSettingPermissionWrapper } from "../../components/PermissionWrapper";
import { OFFICE_SETTING_PERMISSIONS } from "../../permissions/constants";

const Departments = ({
  loading,
  reload,
}) => {
  const [Departments, setDepartments] = useState({});
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [reloadCounter, setReloadCounter] = useState(0);

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

  const fetchData = async (isMounted) => {
    try {
      const response = await getDepartmentList({filterData,options,ordering});
      if (isMounted && response) {
        setDepartments(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, ordering, options, reload, reloadCounter]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
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

  // Function to force a table reload
  const forceReload = () => {
    setReloadCounter(prev => prev + 1);
  };

  return (
    <OfficeSettingPermissionWrapper 
      permissions={OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.VIEW}
      showError={true}
    >
      <div className="flex flex-col justify-end gap-4">
       
        {loading ? (
          <PageLoader />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Department List</CardTitle>
              <CardDescription className="text-neutral-1100">
                Here you can manage your departments. Add, edit, or delete departments as needed.
              </CardDescription>
              <div className="flex justify-end">
              <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Search Department Name",
              name: "name",
            },
            
          ]}
          className='justify-end'
          onChange={handleFilterChange}
        />
              </div>
         
            </CardHeader>
            <CardContent>
              <TableCustom
                columns={DepartmentColumn(forceReload, Departments?.results || [])}
                data={Departments?.results || []}
                tableOptions={tableOptions}
                dataTotalSize={Departments?.count || 0}
                pagination={true}
                className="organization-table"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </OfficeSettingPermissionWrapper>
  );
};

export default Departments;
