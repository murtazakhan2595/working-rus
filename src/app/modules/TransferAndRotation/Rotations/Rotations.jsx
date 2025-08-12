import React, { useState, useEffect } from "react";
import { saveJobRotation, getJobRotationReasons, getJobRotationRequests, getJobRotationById } from 'app/hooks/transferAndRotation';
import { JobRotationColumns } from "app/modules/TransferAndRotation/Sections";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "src/@/components/ui/tabs";
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "components/ui/card";
import { TableCustom, PageLoader } from "components";
import { HasAccess } from "utils/PermissionUtils";
import { GetDispatchStateList, GetEmployeeFilteredList } from "utils/Lists";
import {FilterInput} from 'components/FormControl'
const Rotations = ({ reload }) => {
  const isAdminView = HasAccess("VIEW_LEAVE_REQUEST");
  const isBranchView = HasAccess("VIEW_BRN_LEAVE_REQUEST");
  const isDepartmentView = HasAccess("VIEW_DPT_LEAVE_REQUEST");
  const {
    id: user_id,
    branch_id: user_branch,
    department_name: user_department,
  } = GetDispatchStateList("user_details", "emp") || {};
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Requests");
  const [JobRotationList, setJobRotationList] = useState(null);
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [filterData, setFilterData] = useState({ request_status: "PENDING", });

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
  }, [isAdminView, isBranchView, isDepartmentView]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const filter = { ...filterData, ...permittedViewFilterData, request_status: "PENDING" };
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
  }, [reload]);

  const handleTabChange = (tab) => {
    setFilterData((prevFilters) => {
      return {
        ...prevFilters,
        exit_category:
          tab === "Resignations"
            ? "RESIGNATION"
            : tab === "Terminations"
              ? "TERMINATION"
              : null,
      };
    });
  };

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
    <Tabs
      className="w-full"
      onValueChange={(tab) => {
        handleTabChange(tab);
        setActiveTab(tab);
      }}
      value={activeTab}
    >
      <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
        <TabsList>
          {["Requests", "Records"].map((tab) => (
            <TabsTrigger key={tab} value={tab} variant={"inner-tab"}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <CardHeader>
        <CardTitle>{activeTab} Requests</CardTitle>
        <CardDescription>
          Here you can manage and {activeTab.toLowerCase()} requests of
          employees.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FilterInput
          filters={[
            {
              type: "search",
              name: "employee",
              placeholder: "Employee ID/Name",
            },
            ...(isAdminView || isBranchView
              ? [
                {
                  type: "select",
                  options: 'Departments',
                  name: "department",
                  placeholder: "Department",
                },
              ]
              : []),
            // ...(isAdminView || !isBranchView
            //   ? [
            //     {
            //       type: "select",
            //       options: Branches,
            //       name: "branch",
            //       placeholder: "Branch",
            //     },
            //   ]
            //   : []),
            // {
            //   type: "select",
            //   options: leaveTypesData || [],
            //   name: "leave_type",
            //   placeholder: "Leave Type",
            // },
            // {
            //   type: "date-range",
            //   name: "date_range",
            //   placeholder: "Leave Period",
            // },
            // ...(activeTab === "Records"
            //   ? [
            //     {
            //       type: "select",
            //       options: [
            //         ...GlobalStatusOptions(false),
            //         {
            //           label: "Cancelled",
            //           value: "cancelled_by_employee",
            //         },
            //       ],
            //       name: "status",
            //       placeholder: "Status",
            //     },
            //   ]
            //   : []),
          ]}
          onChange={handleFilterChange}
          className="justify-end mb-4"
        />
        {isLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            data={JobRotationList.results}
            columns={JobRotationColumns}
            pagination={true}
            dataTotalSize={JobRotationList.count || 0}
            tableOptions={tableOptions}
          />
        )}
      </CardContent>

    </Tabs>
  );
};

export default Rotations;
