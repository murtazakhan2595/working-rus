import React, { useEffect, useState } from "react";
import { TableCustom, Header } from "components";
import { Card } from "components/ui/card";
import { CardContent } from "components/ui/card";
import PageLoader from "components/PageLoader";
import { CardHeader } from "components/ui/card";
import { CardTitle } from "components/ui/card";
import { CardDescription } from "components/ui/card";
import { Button } from "components/ui/button";
import { FilterInput } from "components/FormControl";
import { getApprovalHierarchyList } from "app/hooks/approvalHierarchy";
import { HierarchyHistoryColumn } from "app/modules/ApprovalHierarchy/Sections";
import { ApprovalHierarchyRequestType } from "data/Data";

const ApprovalHierarchyHistory = () => {
  const [ApprovalHierarchy, setApprovalHierarchy] = useState({
    results: [],
    count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDelegatedIndex, setSelectedDelegatedIndex] = useState("");
  const [selectedAutoFowardIndex, setSelectedAutoFowardIndex] = useState("");
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
      // Add organizationId to filter if available

      const response = await getApprovalHierarchyList({
        filterData,
        options,
        ordering,
      });

      if (isMounted) {
        setApprovalHierarchy(response);
      }
    } catch (error) {
      console.error("Error fetching ApprovalHierarchy:", error);
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
    if (filterName === "status") setSelectedStatus(filterValue);
    if (filterName === "has_auto_forward") setSelectedAutoFowardIndex(filterValue);
    if (filterName === "has_delegation") setSelectedDelegatedIndex(filterValue);
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
    <div className="flex flex-col gap-4">
      <CardTitle className="text-primary pt-6">
        Approval Hierarchy History & Logs
      </CardTitle>
      <CardDescription className="text-neutral-1100">
        Here you can view approval hierarchy history.
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
          {
            type: "select-two",
            placeholder: "Status",
            name: "status",
            option: [
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ],
            values: selectedStatus,
          },
          {
            type: "select-three",
            placeholder: "Auto Forward",
            name: "has_auto_forward",
            option: [
              { label: "Enable", value: true },
              { label: "Disable", value: false },
            ],
            values: selectedAutoFowardIndex,
          },
          {
            type: "select-four",
            placeholder: "Delegated",
            name: "has_delegation",
            option: [
              { label: "Yes", value: true },
              { label: "No", value: false },
            ],
            values: selectedDelegatedIndex,
          },
        ]}
        className="justify-end"
        onChange={handleFilterChange}
      />

      {loading ? (
        <PageLoader />
      ) : (
        <TableCustom
          columns={HierarchyHistoryColumn}
          data={ApprovalHierarchy?.results || []}
          tableOptions={tableOptions}
          dataTotalSize={ApprovalHierarchy?.count || 0}
          pagination={true}
          className="ApprovalHierarchy-table"
        />
      )}
    </div>
  );
};

export default ApprovalHierarchyHistory;
