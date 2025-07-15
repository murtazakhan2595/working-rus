import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import { getDesignationList } from "app/hooks/general";
import { CardContent } from "components/ui/card";
import { PageLoader } from "components";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { DesignationColumn } from "../../sections/OfficeSettingTableColumns";
import { FilterInput } from "components/FormControl";
import { OfficeSettingPermissionWrapper } from "../../components/PermissionWrapper";
import { OFFICE_SETTING_PERMISSIONS } from "../../permissions/constants";

const Designations = ({ reload }) => {
  const [DesignationList, setDesignationList] = useState({});
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [isLoading, setIsLoading] = useState(false);

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

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const response = await getDesignationList({
        filterData,
        options,
        ordering,
      });
      if (isMounted && response) {
        setDesignationList(response);
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

  return (
    <OfficeSettingPermissionWrapper
      permissions={OFFICE_SETTING_PERMISSIONS.DESIGNATIONS.VIEW}
      showError={true}
    >
      <div className="flex flex-col justify-end gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Designations</CardTitle>
            <CardDescription className="text-neutral-1100">
              Here you can manage your designations. Add, edit, or delete
              designations as needed.
            </CardDescription>
            <div className="flex justify-end">
              <FilterInput
                filters={[
                  {
                    type: "search",
                    placeholder: "Search Designation Name",
                    name: "name",
                  },
                ]}
                onChange={handleFilterChange}
                className="justify-end"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <PageLoader />
            ) : (
              <TableCustom
                columns={DesignationColumn(fetchData)}
                data={DesignationList?.results || []}
                dataTotalSize={DesignationList?.count || 0}
                pagination={true}
                tableOptions={tableOptions}
                className="designation-table"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </OfficeSettingPermissionWrapper>
  );
};

export default Designations;
