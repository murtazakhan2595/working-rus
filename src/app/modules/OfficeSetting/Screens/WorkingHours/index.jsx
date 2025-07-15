import TableCustom from "components/CustomTable";
import { CardTitle, CardHeader, CardContent, Card } from "components/ui/card";
import { WorkingHoursColumn } from "../../sections/OfficeSettingTableColumns";
import { CardDescription } from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { useState, useEffect, useMemo } from "react";
import { OfficeSettingPermissionWrapper } from "../../components/PermissionWrapper";
import { OFFICE_SETTING_PERMISSIONS } from "../../permissions/constants";
import { getWorkingHours } from "app/hooks/general";
import { PageLoader } from "components";

const WorkingHours = ({ reload }) => {
  const [Shifts, setShifts] = useState({});
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
      const response = await getWorkingHours({
        filterData,
        options,
        ordering,
      });
      if (isMounted && response) {
        setShifts(response);
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
      permissions={OFFICE_SETTING_PERMISSIONS.WORKING_HOURS.VIEW}
      showError={true}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Working Hours</CardTitle>
          <CardDescription className="text-neutral-1100">
            Here you can manage your working hours. Add, edit, or delete working
            hours as needed.
          </CardDescription>
          <div className="flex justify-end">
            <FilterInput
              filters={[
                {
                  type: "search",
                  placeholder: "Search Shift Name",
                  name: "shift_name",
                },
                {
                  type: "select",
                  placeholder: "Shift Type",
                  name: "type",
                  options: [
                    { value: "Weekday", label: "Weekday" },
                    { value: "Weekend", label: "Weekend" },
                  ],
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
              columns={WorkingHoursColumn(reload)}
              data={Shifts.results || []}
              tableOptions={tableOptions}
              dataTotalSize={Shifts?.count || 0}
              pagination={true}
              className="organization-table"
            />
          )}
        </CardContent>
      </Card>
    </OfficeSettingPermissionWrapper>
  );
};

export default WorkingHours;
