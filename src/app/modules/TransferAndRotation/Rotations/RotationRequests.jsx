import React, { useState, useEffect } from "react";
import {
  saveJobRotation,
  getJobRotationReasons,
  getJobRotationRequests,
  getJobRotationById,
} from "app/hooks/transferAndRotation";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { HasAccess } from "utils/PermissionUtils";
import { GetDispatchStateList } from "utils/Lists";
import { FilterInput } from "components/FormControl";
import { JobRotationColumns } from "../Sections/TableColumns";
import { getManagerList } from "app/hooks/employee";
import { getDropdownList } from "utils/Lists";

const RotationRequests = ({ reload, permittedViewFilterData }) => {
  const Designations = GetDispatchStateList("designations", "common") || [];
  const Departments = GetDispatchStateList("departments", "common") || [];

  const [isLoading, setIsLoading] = useState(true);
  const [managersList, setManagersList] = useState([]);
  const [JobRotationList, setJobRotationList] = useState(null);
  const [filterData, setFilterData] = useState({ request_status: "PENDING" });

  const [ordering, setOrdering] = useState("-id");

  const [options, setOptions] = useState({
    page: 1,
    sizePerPage: 10,
  });

  const onPageChange = (name, value) => {
    const pageOptions = options;
    if (pageOptions[name] !== value) {
      pageOptions[name] = value;
      setOptions((prevOptions) => ({ ...prevOptions, ...pageOptions }));
    }
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  const fetchManagersList = async () => {
    try {
      const managers = await getManagerList();
      setManagersList(
        getDropdownList(managers, "last_name", "id", "first_name", "")
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const filter = {
        ...filterData,
        ...permittedViewFilterData,
        // status: "pending",
      };
      const response = await getJobRotationRequests({
        filterData: filter,
        options,
        ordering,
      });
      setJobRotationList(response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (permittedViewFilterData) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, options, ordering, permittedViewFilterData]);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      onPageChange("page", 1);
      setOrdering("-id");
      fetchData(true);
    }
    fetchManagersList();
  }, [reload]);

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

  const safeDepartments = (Departments || []).filter(
    (d) => d && typeof d.label === "string"
  );
  const safeDesignations = (Designations || []).filter(
    (d) => d && typeof d.label === "string"
  );

  return (
    <CardContent>
      <FilterInput
        filters={[
          {
            type: "search",
            name: "employee",
            placeholder: "Employee ID/Name",
          },
          {
            type: "select",
            name: "status",
            placeholder: "Status",
            options: [
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ],
          },
          {
            type: "select",
            options: "employees",
            name: "initiated_by",
            placeholder: "Request Initiator",
          },
          ...(!permittedViewFilterData.department
            ? [
                {
                  type: "select",
                  options: "departments",
                  name: "department",
                  placeholder: "Department",
                },
              ]
            : []),
          ...(!permittedViewFilterData.branch
            ? [
                {
                  type: "select",
                  options: "branches",
                  name: "new_branch",
                  placeholder: "Branch",
                },
              ]
            : []),
          {
            type: "select",
            options: managersList,
            name: "new_reporting_manager",
            placeholder: "New Manager",
          },
          {
            type: "select",
            options: managersList,
            name: "old_reporting_manager",
            placeholder: "Previous Manager",
          },
          {
            type: "date-range",
            name: "created_at",
            placeholder: "Request Date",
          },
          {
            type: "date-range",
            name: "effective_date",
            placeholder: "Effective Date",
          },
        ]}
        onChange={handleFilterChange}
        className="justify-end mb-4"
      />
      {isLoading ? (
        <PageLoader />
      ) : (
        <TableCustom
          data={JobRotationList?.results || []}
          columns={JobRotationColumns(fetchData)}
          pagination={true}
          dataTotalSize={JobRotationList?.count || 0}
          tableOptions={tableOptions}
        />
      )}
    </CardContent>
  );
};

export default RotationRequests;
