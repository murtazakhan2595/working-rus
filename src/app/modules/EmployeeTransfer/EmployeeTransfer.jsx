import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import {
  InternalTransferColumns,
  TransferForm,
} from "app/modules/EmployeeTransfer/Sections";
import { UsersRound, Contact, UserRoundCheck } from "lucide-react";
import { Header } from "components";
import {
  getEmployeeTransferList,
  getEmployeeTransferStats,
} from "app/hooks/employeeTransfer";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import Stats from "components/ui/Stats";
import TableCustom from "components/CustomTable";
import { useSelector } from "react-redux";
import { Button } from "components/ui/button";
import {
  EmployeeInternalTranfer,
  EmployeeExternalTranfer,
} from "app/modules/EmployeeTransfer";
import Config from "constants/config";
import { HasAccess } from "utils/PermissionUtils";
import { FilterInput } from "components/FormControl";

const ExternalTabs = [
  Config.TEAM_INTERNALTRANSFER ? "Internal" : null,
  Config.TEAM_EXTERNALTRANSFER ? "External" : null,
].filter(Boolean);

const InternalTabs = ["Requests", "Records"];

export default function EmployeeTransfer() {

   const viewEmployeeTransferPermitted = HasAccess("VIEW_EMPLOYEE_TRANSFER");
  const userRole = useSelector((state) => state.user.userProfile.role);
  const userID = useSelector((state) => state.user.userProfile.id);
  const [isLoading, setIsLoading] = useState(true);
  const [employeeTransferData, setEmployeeTransferData] = useState({
    results: [],
    count: 0,
  });
  const [employeeTransferStat, setEmployeeTransferStat] = useState({});
  const [OpenTransferForm, setOpenTransferForm] = useState(false);
  const [activeExternalTab, setActiveExternalTab] = useState("Internal");
  const [activeInternalTab, setActiveInternalTab] = useState("Requests");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const Departments = useSelector((state) => state.common.departments);
  const Designations = useSelector((state) => state.common.designations);
  const Branches = useSelector((state) => state.common.branches);
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState(
    {}
  );

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
    setIsLoading(true);
    try {
      const data = await getEmployeeTransferList({
        options,
        filterData,
        ordering,
      });
      if (isMounted) {
        setEmployeeTransferData(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  const fetchStatData = async (isMounted) => {
    setIsLoading(true);
    try {
      const data = await getEmployeeTransferStats({
        filterData: { transfer_type: filterData.transfer_type },
      });
      if (isMounted) {
        setEmployeeTransferStat(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [options, filterData, ordering]);

  useEffect(() => {
    let isMounted = true;
    fetchStatData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData.transfer_type]);

  const statsData = [
    {
      label: "Total",
      value: employeeTransferStat.total_transfers || 0,
      icon: UsersRound,
    },
    {
      label: "Approved",
      value: employeeTransferStat.approved_transfers || 0,
      icon: Contact,
    },
    {
      label: "Rejected",
      value: employeeTransferStat.rejected_transfers || 0,
      icon: UserRoundCheck,
    },
    {
      label: "Pending",
      value: employeeTransferStat.pending_transfers || 0,
      icon: UserRoundCheck,
    },
  ];
  useEffect(() => {
    setFilterData((prevFilter) => ({
      ...prevFilter,
      ...(activeExternalTab === "Internal" && activeInternalTab === "Requests"
        ? { status_transfer: "PENDING,ACCEPTED BY MANAGER", transfer_type: "INTERNAL" }
        : {}),
      ...(activeExternalTab === "External" && activeInternalTab === "Requests"
        ? { status_transfer: "PENDING,ACCEPTED BY MANAGER", transfer_type: "EXTERNAL" }
        : {}),
      ...(activeExternalTab === "Internal" && activeInternalTab === "Records"
        ? { status_transfer: "REJECTED,REJECTED BY MANAGER", transfer_type: "INTERNAL" }
        : {}),
      ...(activeExternalTab === "External" && activeInternalTab === "Records"
        ? { status_transfer: "REJECTED,REJECTED BY MANAGER", transfer_type: "EXTERNAL" }
        : {}),
    }));
    resetUserFilters();
  }, [activeExternalTab, activeInternalTab]);

  const resetUserFilters = () => {
    setOptions((prevOptions) => ({ ...prevOptions, page: 1 }));

    setFilterData((prevFilters) => {
      const resetFilters = { ...prevFilters };

      // Remove only user-applied filters
      delete resetFilters.id_and_first_name;
      delete resetFilters.old_department;
      delete resetFilters.designation;
      delete resetFilters.old_branch;

      return resetFilters;
    });
  };

  // Update your handleResetFilters to use the same logic
  const handleResetFilters = () => {
    resetUserFilters();
  };

  const handleFilterChange = (filterName, filterValue) => {
    setOptions((prevOptions) => ({ ...prevOptions, page: 1 }));
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        // Convert specific fields to arrays for backend
        if (
          ["old_department", "designation", "old_branch"].includes(filterName)
        ) {
          updatedFilters[filterName] = [filterValue];
        } else {
          updatedFilters[filterName] = filterValue;
        }
      }
      return updatedFilters;
    });
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <Button
            onClick={(e) => {
              e.preventDefault();
              setOpenTransferForm(true);
            }}
          >
            Request Transfer
          </Button>
        }
      />
      <Stats stats={statsData} />
      <div className="flex justify-end items-center gap-2">
        <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Search by ID and Name",
              name: "employee_name_or_id",
              values: filterData.employee_name_or_id || "", // Add current value
            },
            {
              type: "select",
              options: Departments,
              name: "old_department",
              placeholder: "Department",
              values: Array.isArray(filterData.old_department)
                ? filterData.old_department[0] || ""
                : filterData.old_department || "", // Convert array back to single value for display
            },
            {
              type: "select-two",
              option: Designations,
              name: "designation",
              placeholder: "Designation",
              values: Array.isArray(filterData.designation)
                ? filterData.designation[0] || ""
                : filterData.designation || "",
            },
            {
              type: "select-three",
              option: Branches,
              name: "old_branch",
              placeholder: "Branch",
              values: Array.isArray(filterData.old_branch)
                ? filterData.old_branch[0] || ""
                : filterData.old_branch || "",
            },
          ]}
          onChange={handleFilterChange}
        />
        <Button
          variant="outline"
          onClick={handleResetFilters}
          className="shrink-0"
        >
          Reset Filters
        </Button>
      </div>
      <Tabs
        defaultValue="Internal"
        className="w-full"
        onValueChange={(tab) => {
          setActiveExternalTab(tab);
          setActiveInternalTab("Requests");
        }}
        value={activeExternalTab}
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
          {ExternalTabs.length > 1 && (
            <TabsList className="flex items-center justify-center mb-4">
              {ExternalTabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          )}
        </div>
        {viewEmployeeTransferPermitted && (
          <Card>
            <CardContent>
              <TabsContent value="Internal">
                <EmployeeInternalTranfer
                  TabList={InternalTabs}
                  activeTab={activeInternalTab}
                  setActiveTab={setActiveInternalTab}
                  EmployeesTransferData={employeeTransferData}
                  reloadData={fetchData}
                  resetFilters={resetUserFilters}
                />
              </TabsContent>
              <TabsContent value="External">
                {
                  <EmployeeExternalTranfer
                    TabList={InternalTabs}
                    activeTab={activeInternalTab}
                    setActiveTab={setActiveInternalTab}
                    EmployeesTransferData={employeeTransferData}
                    reloadData={fetchData}
                  />
                }
              </TabsContent>
            </CardContent>
          </Card>
        )}
      </Tabs>
      {OpenTransferForm && (
        <TransferForm
          isOpen={OpenTransferForm}
          setIsOpen={() => {
            setOpenTransferForm(false);
            fetchData(true);
          }}
          transfer_type={
            activeExternalTab === "Internal" ? "INTERNAL" : "EXTERNAL"
          }
        />
      )}
    </div>
  );
}
