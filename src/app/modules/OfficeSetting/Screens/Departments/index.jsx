import React, { useEffect, useState } from "react";
import { TableCustom, PageLoader } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { DepartmentColumn } from "app/modules/OfficeSetting/sections/OfficeSettingTableColumns";
import { FilterInput } from "components/FormControl";
import { getDepartmentList } from "app/hooks/general";
import { OfficeSettingPermissionWrapper } from "../../components/PermissionWrapper";
import { OFFICE_SETTING_PERMISSIONS } from "../../permissions/constants";

const Departments = ({ reload }) => {
  const [Departments, setDepartments] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
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

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const response = await getDepartmentList({
        filterData,
        options,
        ordering,
      });
      if (isMounted && response) {
        setDepartments(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, ordering, options]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      onPageChange("page", 1);
      setOrdering("-id");
      setFilterData({});
      fetchData(true);
    }
  }, [reload]);

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

  return (
    <OfficeSettingPermissionWrapper
      permissions={OFFICE_SETTING_PERMISSIONS.DEPARTMENTS.VIEW}
      showError={true}
    >
      <div className="flex flex-col justify-end gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Department List</CardTitle>
            <CardDescription className="text-neutral-1100">
              Here you can manage your departments. Add, edit, or delete
              departments as needed.
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
                className="justify-end"
                onChange={handleFilterChange}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <PageLoader />
            ) : (
              <TableCustom
                columns={DepartmentColumn(fetchData)}
                data={Departments?.results || []}
                tableOptions={tableOptions}
                dataTotalSize={Departments?.count || 0}
                pagination={true}
                className="organization-table"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </OfficeSettingPermissionWrapper>
  );
};

export default Departments;
