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
import {
  getApprovalHierarchyHistoryLogsList,
  getApprovalHierarchyData,
} from "app/hooks/approvalHierarchy";
import {
  HierarchyLevelsColumn,
  HierarchyHistoryDetailsColumn,
} from "app/modules/ApprovalHierarchy/Sections";
import { Levels,LevelDelegations } from "app/modules/ApprovalHierarchy";
import { useNavigate, useLocation } from "react-router-dom";
import { EmployeeDetailUI } from "components";
import { DetailBox } from "components/SheetCardExtension";
import { ApprovalHierarchyRequestTypeName } from "utils/getValuesFromTables";

const ApprovalHierarchyHistoryLogs = () => {
  const location = useLocation();
  const { GOTO_URLS, id } = location.state || {};
  const [roles, setRoles] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(false);
  const [HierarchyDetails, setHierarchyDetails] = useState(null);
  const [filterData, setFilterData] = useState({ hierarchy: id });
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
      const hierarchyResponse = await getApprovalHierarchyData(id);
      setHierarchyDetails(hierarchyResponse);
      const response = await getApprovalHierarchyHistoryLogsList({
        filterData,
        options,
        ordering,
      });

      if (isMounted) {
        setRoles(response);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
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
    <div className="flex flex-col gap-5">
      <Header
        showBackButton={true}
        navigationLink={
          GOTO_URLS || "/office-settings/approval-hierarchy/history"
        }
      />
      <Card className="">
        <CardTitle className="text-primary px-6 pt-6">
          Hierarchy Details
        </CardTitle>
        <CardDescription className="text-neutral-1100 px-6 pb-6">
          Here is the hierarchy informations
        </CardDescription>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-5">
            <DetailBox
              value={HierarchyDetails?.name}
              label="Name"
              orientation="horizontal"
            />
            <DetailBox
              orientation="horizontal"
              value={
                <ApprovalHierarchyRequestTypeName
                  value={HierarchyDetails?.request_type}
                />
              }
              label="Request Type"
            />
            {HierarchyDetails?.auto_forward_enabled && (
              <DetailBox
                orientation="horizontal"
                value={`${HierarchyDetails?.auto_forward_threshold}hr`}
                label="Auto-Forward Thershold"
              />
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardTitle className="text-primary p-6">Hierarchy Levels</CardTitle>
        <CardDescription></CardDescription>
        <CardContent>
          <Levels
            HierarchyDetails={HierarchyDetails}
            fetchData={fetchData}
            hierarchy_id={id}
            viewMode={true}
          />
        </CardContent>
      </Card>
      <LevelDelegations heirarchy_id={id}  viewMode={true} />

      <Card>
        <CardTitle className="text-primary pt-6 px-6">History & Logs</CardTitle>
        <CardDescription className="text-neutral-1100 px-6 pb-6">
          Here is role assignment history logs of employee.
        </CardDescription>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* <FilterInput
              filters={[
                {
                  type: "search",
                  placeholder: "Search Role Name",
                  name: "role",
                },
              ]}
              className="justify-end"
              onChange={handleFilterChange}
            /> */}

            {loading ? (
              <PageLoader />
            ) : (
              <TableCustom
                columns={HierarchyHistoryDetailsColumn}
                data={roles?.results || []}
                tableOptions={tableOptions}
                dataTotalSize={roles?.count || 0}
                pagination={true}
                className="roles-table"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalHierarchyHistoryLogs;
