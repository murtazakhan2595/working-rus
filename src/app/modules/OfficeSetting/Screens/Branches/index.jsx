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

const Branches = ({
  loading,
  reload,
}) => {
  const [Branches, setBranches] = useState({});
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
    try {
      const response = await getBranchList({filterData,options,ordering});
      if (isMounted && response) {
        setBranches(response);
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
  }, [filterData,ordering,options,reload]);

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
    <div className="flex flex-col justify-end gap-4">
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
            type: "search",
            placeholder: "Search Branch Address",
            name: "branch_address",
          },
        ]}
        className='justify-end'
        onChange={handleFilterChange}
      />
      {loading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Branch List</CardTitle>
            <CardDescription className="text-neutral-1100">
              Here you can manage your branches. Add, edit, or delete branches as needed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TableCustom
              columns={BranchColumn(fetchData)}
              data={Branches?.results || []}
              tableOptions={tableOptions}
              dataTotalSize={Branches?.count || 0}
              pagination={true}
              className="organization-table"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Branches;
