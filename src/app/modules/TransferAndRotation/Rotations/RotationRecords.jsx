import React, { useState, useEffect } from "react";
import {
  saveJobRotation,
  getJobRotationReasons,
  getJobRotationRecords,
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
import { GetDispatchStateList, GetEmployeeFilteredList } from "utils/Lists";
import { FilterInput } from "components/FormControl";
import { JobRotationRecordsColumns } from "../Sections/TableColumns";

const RotationRecords = ({ reload }) => {
  const {
    id: user_id,
    branch_id: user_branch,
    department_name: user_department,
  } = GetDispatchStateList("user_details", "emp") || {}
  const isAdminView = HasAccess("VIEW_JOB_ROTATION");
  const isBranchView = HasAccess("VIEW_BRN_JOB_ROTATION");
  const isDepartmentView = HasAccess("VIEW_DPT_JOB_ROTATION");
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      setPermittedViewFilterData(() => {
        if (isAdminView) return {};
        else if (isBranchView) return { branch: user_branch };
        else if (isDepartmentView) return { department: user_department };
      });
    return () => {
      isMounted = false;
    };
  }, [isAdminView, isBranchView, isDepartmentView, user_branch, user_department, user_id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const filter = {
        ...filterData,
        ...permittedViewFilterData,
      };
      const response = await getJobRotationRecords({
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
  return (
    <CardContent>
      <FilterInput
        filters={[
          {
            type: "search",
            name: "employee_id_or_name",
            placeholder: "Employee ID/Name",
          },
          ...(isAdminView || isBranchView
            ? [
              {
                type: "select",
                options: "Departments",
                name: "department_name",
                placeholder: "Department",
              },
            ]
            : []),
          ...(isAdminView || !isDepartmentView
            ? [
              {
                type: "select",
                options: 'Branches',
                name: "branch_id",
                placeholder: "Branch",
              },
            ]
            : []),
          {
            type: "select",
            options: 'Designations',
            name: "department_position",
            placeholder: "Designation",
          },
        ]}
        onChange={handleFilterChange}
        className="justify-end mb-4"
      />
      {isLoading ? (
        <PageLoader />
      ) : (
        <TableCustom
          data={JobRotationList.results}
          columns={JobRotationRecordsColumns}
          pagination={true}
          dataTotalSize={JobRotationList.count || 0}
          tableOptions={tableOptions}
        />
      )}
    </CardContent>
  );
};

export default RotationRecords;
