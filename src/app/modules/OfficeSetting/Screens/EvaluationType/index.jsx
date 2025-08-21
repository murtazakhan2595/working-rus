import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import { getGraceTimeList } from "app/hooks/officeSetting";
import { CardContent } from "components/ui/card";
import PageLoader from "../../../../../components/PageLoader";
import { GraceTimeColumn } from "app/modules/OfficeSetting/sections/OfficeSettingTableColumns";
import { FilterInput } from "components/FormControl";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { useSelector } from "react-redux";
import { useOfficeSettingPermissions } from "../../hooks/useOfficeSettingPermissions";
import { OfficeSettingPermissionWrapper } from "../../components/PermissionWrapper";
import { OFFICE_SETTING_PERMISSIONS } from "../../permissions/constants";

const EvaluationType = ({ reload }) => {
  const Branches = useSelector((state) => state.common.branches);
  const [GraceTimeList, setGraceTimeList] = useState({});
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState("");
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
      const response = await getGraceTimeList({
        filterData,
        options,
        ordering,
      });
      if (isMounted && response) {
        setGraceTimeList(response);
        setFilteredData(response.results || []);
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
    onPageChange("page", 1);
    setOrdering("-id");
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [reload]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if (filterName === "branch") setSelectedBranch(filterValue);
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
      permissions={OFFICE_SETTING_PERMISSIONS.GRACE_TIME.VIEW}
      showError={true}
    >
      <div className="flex flex-col justify-end gap-4 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-primary">Grace Time List</CardTitle>
            <CardDescription className="text-neutral-1100">
              Here you can manage your grace time. Add, edit, or delete grace time
              as needed.
            </CardDescription>
            <div className="flex justify-end">
              <FilterInput
                filters={[
                  {
                    type: "search",
                    placeholder: "Search by name",
                    name: "name",
                  },
                  {
                    type: "select-one",
                    placeholder: "Branch",
                    name: "branch",
                    option: Branches,
                    values: selectedBranch,
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
                columns={GraceTimeColumn(fetchData)}
                data={filteredData}
                tableOptions={tableOptions}
                dataTotalSize={GraceTimeList?.count || 0}
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

export default EvaluationType;
