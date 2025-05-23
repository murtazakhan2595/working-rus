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
import { HierarchyHistoryColumn } from "app/modules/ApprovalHierarchy/Sections"
import { useNavigate } from "react-router-dom";
 
const ApprovalHierarchyHistory = () => {
  const [ApprovalHierarchy, setApprovalHierarchy] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(false);
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
            placeholder: "Search Employee ID",
            name: "serial_number",
          },
          {
            type: "search",
            placeholder: "Search Employee Name",
            name: "first_name",
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
