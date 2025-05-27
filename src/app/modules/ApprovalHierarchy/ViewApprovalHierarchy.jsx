import React, { useEffect, useState } from "react";
import { TableCustom } from "components";
import PageLoader from "components/PageLoader";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { getApprovalHierarchyList } from "app/hooks/approvalHierarchy";
import { ApprovalHierarchyColumn } from "app/modules/ApprovalHierarchy/Sections";
import { HasAccess } from "utils/PermissionUtils";
import Error from "app/modules/Error";
import { ApprovalHierarchyRequestType } from "data/Data";

const ViewApprovalHierarchy = ({reload}) => {
  const [ApprovalHierarchies, setApprovalHierarchies] = useState({
    results: [],
    count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [reloadCounter, setReloadCounter] = useState(0);
  const [selectedRequestType, setSelectedRequestType] = useState("");

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
      setLoading(true);

      const response = await getApprovalHierarchyList({
        filterData,
        options,
        ordering,
      });

      if (isMounted) {
        setApprovalHierarchies(response);
      }
    } catch (error) {
      console.error("Error fetching Approval Hierarchy:", error);
    } finally {
      setLoading(false);
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
    if (filterName === "request_type") setSelectedRequestType(filterValue);
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
  }, [reload]);
  return (
    <div className="flex flex-col gap-4">
      <CardTitle className="text-primary pt-6">
        Approval Hierarchy List
      </CardTitle>
      <CardDescription className="text-neutral-1100">
        Here you can manage approval Hierarchy and their levels. Add, edit, or
        delete Approval Hierarchy as needed.
      </CardDescription>
      <FilterInput
        filters={[
          {
            type: "search",
            placeholder: "Search By Hierarchy Name",
            name: "name",
          },
          {
            type: "select-one",
            placeholder: "RequestType",
            name: "request_type",
            option: ApprovalHierarchyRequestType,
            values: selectedRequestType,
          },
        ]}
        className="justify-end"
        onChange={handleFilterChange}
      />

      {loading ? (
        <PageLoader />
      ) : (
        <TableCustom
          columns={ApprovalHierarchyColumn(fetchData)}
          data={ApprovalHierarchies?.results || []}
          tableOptions={tableOptions}
          dataTotalSize={ApprovalHierarchies?.count || 0}
          pagination={true}
          className="ApprovalHierarchies-table"
        />
      )}
    </div>
  );
};

export default ViewApprovalHierarchy;
