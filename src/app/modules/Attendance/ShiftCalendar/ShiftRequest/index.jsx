import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { TableCustom } from "components";
import { useSelector } from "react-redux";
import { getShiftSchedule } from "app/hooks/shiftManagement";
import { getChangeRequestComparison } from "../ShiftCalendarTab/shiftScheduleUtils";
import { toast } from "react-toastify";
import { FilterInput } from "components/FormControl";
import { EmployeeColumns } from "../ShiftCalendarTab/shiftChangeRequestColumns";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "src/@/components/ui/tabs";
import { HasAccess } from "utils/PermissionUtils";
import { PageLoader } from "components";
import { getEmployeeData } from "app/hooks/employee";

const ShiftRequest = () => {
  const isManageTeamShiftsPermitted = HasAccess("MANAGE_TEAM_SHIFTS_REQUEST");
  const isManageOrganizationShiftsPermitted = HasAccess(
    "MANAGE_ORGANIZATION_SHIFTS_REQUEST"
  );
  const UserRoles = useSelector((state) => state.roles_permissions.user_roles);

  // Determine user role with priority: HR > Manager
  const isHR = isManageOrganizationShiftsPermitted;
  const isManager =
    !isManageOrganizationShiftsPermitted && isManageTeamShiftsPermitted;
  const hasTabAccess = isHR; // Only HR gets tabs view

  const [isLoading, setIsLoading] = useState(true);
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [activeTab, setActiveTab] = useState("Request");
  const [shiftRequests, setShiftRequests] = useState({
    results: [],
    count: 0,
  });
  const userProfile = useSelector((state) => state.user.userProfile);
  const [filters, setFilters] = useState({
    status: "",
    user_role: "",
  });

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const employees = useSelector((state) => state.emp.employees);

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  useEffect(() => {
    if (hasTabAccess) {
      setOptions((prev) => ({ ...prev, page: 1 }));
      setFilters((prev) => ({ ...prev, status: "" }));
    }
  }, [activeTab, hasTabAccess]);

  useEffect(() => {
    fetchShiftRequests();
  }, [ordering, options, filters, activeTab]);

  const fetchShiftRequests = async () => {
    setIsLoading(true);
    try {
      const filterData = {
        is_change_request: "true",
        shift_requested: "Employee",
      };

      if (hasTabAccess) {
        // HR view with tabs
        if (activeTab === "Request") {
          filterData.status = filters.status || "PENDING";
        } else if (activeTab === "Record") {
          filterData.status = filters.status || "APPROVED,REJECTED";
          filterData.is_change_request = "true,false";
        }
      } else {
        // Manager view without tabs
        filterData.manager = userProfile.id;
        if (filters.status) {
          filterData.status = filters.status;
        }
      }

      if (filters.user_role) {
        filterData.user_role = filters.user_role;
      }
      if (filters.branch) {
        filterData.branch = filters.branch;
      }
      if (filters.search) {
        filterData.search = filters.search;
      }
      const response = await getShiftSchedule({
        filterData,
        ordering: ordering,
        options,
      });

      if (response && response.results) {
        // Enhance results with additional data
        const enhancedResults = await Promise.all(
          response.results.map(async (request) => {
            const comparisonData = await getChangeRequestComparison(request);
            let employeeData;
            employeeData = employees.find(
              (emp) => emp.id === request.employee
            );
            if(!employeeData){
              console.log("HERE IS THE BUG", request);
              const empData =await  getEmployeeData(request.employee)
              if(empData){
                employeeData = empData
              }

            }
            return {
              ...request,
              employee: employeeData,
              comparison_data: comparisonData,
            };
          })
        );

        setShiftRequests({
          ...response,
          results: enhancedResults,
        });
      }
    } catch (error) {
      console.error("Error fetching shift requests:", error);
      toast.error("Failed to load shift change requests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setOptions((prev) => ({ ...prev, page: 1 }));
  };

  const ShiftRequestTabs = ["Request", "Record"].filter(Boolean);


  return (

    <Card>
      <Tabs
        defaultValue="Request"
        className="w-full"
        onValueChange={(tab) => {
          setActiveTab(tab);
        }}
        value={activeTab}
      >
        <TabsList>
          {ShiftRequestTabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              variant='inner-tab'
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <CardHeader>
        <CardTitle>Shift Request</CardTitle>
        <CardDescription>Here you can manage, view all the shift requests by employees.</CardDescription>
      </CardHeader>
      < CardContent >
        <FilterInput
          filters={[
            ...(activeTab === "Record"
              ? [
                {
                  type: "select",
                  options: [
                    { label: "Approved", value: "APPROVED" },
                    { label: "Rejected", value: "REJECTED" },
                  ],
                  name: "status",
                  placeholder: "Status",
                },
              ]
              : []),
            {
              type: "select",
              options: UserRoles,
              name: "user_role",
              placeholder: "Requestor Role",
            },
          ]}
          onChange={handleFilterChange}
          className='justify-end mb-4'
        />
        {isLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            data={shiftRequests.results}
            columns={EmployeeColumns(fetchShiftRequests)}
            pagination={true}
            dataTotalSize={shiftRequests.count}
            tableOptions={tableOptions}
          />
        )}
      </CardContent>

    </Card>
  );
};

export default ShiftRequest;
