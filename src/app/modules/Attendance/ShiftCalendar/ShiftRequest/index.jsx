import React, { useState, useEffect } from "react";
import { Card, CardContent } from "components/ui/card";
import { TableCustom } from "components";
import { useSelector } from "react-redux";
import { getShiftSchedule } from "app/hooks/shiftManagement";
import { getChangeRequestComparison } from "../ShiftCalendarTab/shiftScheduleUtils";
import { toast } from "react-toastify";
import { FilterInput } from "components/FormControl";
import { getRoleList } from "app/hooks/general";
import { EmployeeColumns } from "../ShiftCalendarTab/shiftChangeRequestColumns";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { HasAccess } from "utils/PermissionUtils";
import { PageLoader } from "components";
const ShiftRequest = () => {
  const isViewRecordsPermitted = HasAccess("VIEW_SHIFT_REQUEST_RECORDS");
  const isEditEmployeeShiftPermitted = HasAccess("EDIT_EMPLOYEE_SHIFT");
  // const isViewRecordsPermitted = true;
  const [isLoading, setIsLoading] = useState(true);
  const [ordering, setOrdering] = useState("-id");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [roles, setRoles] = useState([]);
  const [activeTab, setActiveTab] = useState("Request");
  const [shiftRequests, setShiftRequests] = useState({
    results: [],
    count: 0,
  });
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
  const fetchRoles = async (isMounted) => {
    const response = await getRoleList();
    if (isMounted && response) {
      setRoles(response.results || []);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchRoles(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    if (isViewRecordsPermitted) {
      setOptions((prev) => ({ ...prev, page: 1 }));
      setFilters((prev) => ({ ...prev, status: "" }));
    }
  }, [activeTab, isViewRecordsPermitted]);
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
      if(isViewRecordsPermitted){
        if(activeTab === "Request") {
          filterData.status = filters.status || "Pending";
        }
        else if(activeTab === "Record") {
          filterData.status = filters.status || "Approved,Rejected";
          filterData.is_change_request = "true,false";
        }
      } else{
        if(filters.status){
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
        options
      });

      if (response && response.results) {
        // Enhance results with additional data
        const enhancedResults = await Promise.all(
          response.results.map(async (request) => {
            const comparisonData = await getChangeRequestComparison(request);
            const employeeData = employees.find(
              (emp) => emp.id === request.employee
            );
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

  const FiltersSection = (
    <div className="">
      <FilterInput
        filters={[
          ...(activeTab === "Record"
            ? [
                {
                  type: "select-one",
                  option: [
                    { label: "Approved", value: "Approved" },
                    { label: "Rejected", value: "Rejected" },
                  ],
                  name: "status",
                  placeholder: "Status",
                  values: filters.status,
                },
              ]
            : []),
          {
            type: "select-two",
            option: roles.map((role) => ({
              label: role.name,
              value: role.name,
            })),
            name: "user_role",
            placeholder: "Requestor Role",
            values: filters.user_role,
          },
        ]}
        onChange={handleFilterChange}
      />
    </div>
  );

  const TableSection = (
    <Card>
      <CardContent>
        {isLoading ? <PageLoader/> :<TableCustom
          data={shiftRequests.results}
          columns={EmployeeColumns(fetchShiftRequests)}
          pagination={true}
          dataTotalSize={shiftRequests.count}
          tableOptions={tableOptions}
        />}
      </CardContent>
    </Card>
  );
  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      {isViewRecordsPermitted ? (
        // HR View with Tabs
        <Tabs
          defaultValue="Request"
          className="w-full"
          onValueChange={(tab) => {
            setActiveTab(tab);
          }}
          value={activeTab}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full">
            <div className="w-full sm:w-auto overflow-hidden mb-4">
              <TabsList className="flex flex-nowrap w-full overflow-x-auto overflow-y-hidden sm:overflow-visible">
                {ShiftRequestTabs.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="shadow-none border-transparent border-b data-[state=active]:border-plum-1100 data-[state=active]:text-primary-1100 rounded-none data-[state-active]:font-medium whitespace-nowrap px-2 sm:w-28 flex-1 sm:flex-initial text-sm sm:text-base"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {FiltersSection}
          </div>
          {TableSection}
        </Tabs>
      ) : (
        // Manager View without Tabs
        <>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between w-full">
            {FiltersSection}
          </div>
          {TableSection}
        </>
      )}
    </div>
  );
};

export default ShiftRequest;
