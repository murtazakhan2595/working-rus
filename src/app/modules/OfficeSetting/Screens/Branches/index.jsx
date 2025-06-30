import React, { useEffect, useState } from "react";
import TableCustom from "components/CustomTable";
import { Card } from "components/ui/card";
import { getBranchList } from "app/hooks/general";
import { CardContent } from "components/ui/card";
import PageLoader from "../../../../../components/PageLoader";
import { BranchColumn } from "app/modules/OfficeSetting/sections/OfficeSettingTableColumns";
import { FilterInput } from "components/FormControl";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { OfficeSettingPermissionWrapper } from "../../components/PermissionWrapper";
import { OFFICE_SETTING_PERMISSIONS } from "../../permissions/constants";

const Branches = ({ reload }) => {
  const [BranchesList, setBranchesList] = useState({});
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

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
      const response = await getBranchList({ filterData, options, ordering });
      if (isMounted && response) {
        setBranchesList(response);
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
    if (filterName === "branch_status") {
      setSelectedStatus(filterValue);
    }
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
      permissions={OFFICE_SETTING_PERMISSIONS.BRANCHES.VIEW}
      showError={true}
    >
      <div className="flex flex-col justify-end gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Branch List</CardTitle>
            <CardDescription className="text-neutral-1100">
              Here you can manage your branches. Add, edit, or delete branches
              as needed.
            </CardDescription>
            <div className="flex justify-end">
              <FilterInput
                filters={[
                  {
                    type: "search",
                    placeholder: "Search Branch Name",
                    name: "branch_name",
                  },
                  {
                    type: "search",
                    placeholder: "Search Branch Number",
                    name: "branch_number",
                  },

                  {
                    type: "select-one",
                    placeholder: "Status",
                    name: "branch_status",
                    values: selectedStatus,
                    option: [
                      { value: "Active", label: "Active" },
                      { value: "Inactive", label: "Inactive" },
                    ],
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
                columns={BranchColumn(fetchData)}
                data={BranchesList?.results || []}
                tableOptions={tableOptions}
                dataTotalSize={BranchesList?.count || 0}
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

export default Branches;
