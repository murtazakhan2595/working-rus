import { getDelegationList } from "app/hooks/approvalHierarchy";
import { DelegateLevelsColumn } from "app/modules/ApprovalHierarchy/Sections";
import React, { useEffect, useState, useCallback } from "react";
import { PageLoader, TableCustom } from "components";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "components/ui/card";
import { useSelector } from "react-redux";
import { FilterInput } from "components/FormControl";

const LevelDelegations = ({ heirarchy_id, viewMode = false, reloadData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [Delegations, setDelegations] = useState({});
  const Departments = useSelector((state) => state.common.departments);
  const Branches = useSelector((state) => state.common.branches);
  const [filterData, setFilterData] = useState({
    delegation_hierarchy: heirarchy_id,
  });
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
      setIsLoading(true);
      const delegation = await getDelegationList({
        filterData,
        ordering,
        options,
      });
      if (isMounted) {
        setDelegations(delegation);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
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

  useEffect(() => {
    let isMounted = true;
    onPageChange("page", 1);
    setOrdering("-id");
    fetchData(true);
    return () => {
      isMounted = false;
    };
  }, [reloadData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delegations</CardTitle>
        <CardDescription>
          Here you can view, edit, and delete the delegation added again level for all
          request initiators in the hierarchy
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <FilterInput
          filters={[
            {
              type: "select",
              placeholder: "Branch",
              name: "branch",
              options: Branches,
            },
            {
              type: "select",
              placeholder: "Department",
              name: "department",
              options: Departments,
            },
          ]}
          className="justify-end"
          onChange={handleFilterChange}
        />
        {isLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            columns={DelegateLevelsColumn(fetchData, viewMode)}
            data={Delegations.results || []}
            dataTotalSize={Delegations?.count || 0}
            pagination={true}
            tableOptions={tableOptions}
            className="ApprovalHierarchiesLevels-table"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LevelDelegations;
