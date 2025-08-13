import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "components/ui/card";
import { UsersRound, Contact, UserRoundCheck } from "lucide-react";
import { TransferColumns } from "app/modules/TransferAndRotation/Sections";
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
import { PageLoader } from "components";
import TableCustom from "components/CustomTable";
import { useSelector } from "react-redux";
import { Button } from "components/ui/button";
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
  const [activeTab, setActiveTab] = useState("Requests");
  const [activeInternalTab, setActiveInternalTab] = useState("Requests");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const Departments = useSelector((state) => state.common.departments);
  const Designations = useSelector((state) => state.common.designations);
  const Branches = useSelector((state) => state.common.branches);
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({});

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
        filterData: { status: activeTab === 'Requests' ? 'PENDING' : 'APPROVED,REJECTED' },
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
      ...(activeTab === "Requests"
        ? { status_transfer: "PENDING,ACCEPTED BY MANAGER" }
        : {}),
      ...(activeTab === "Records"
        ? { status_transfer: "REJECTED,REJECTED BY MANAGER" }
        : {}),
    }));
    resetUserFilters();
  }, [activeTab, activeInternalTab]);

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
  if (!viewEmployeeTransferPermitted) return null;

  return (
    <Tabs
      defaultValue=""
      className="w-full"
      onValueChange={(tab) => {
        setActiveTab(tab);
      }}
      value={activeTab}
    >
      <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">

        <TabsList className="flex items-center justify-center mb-4">
          {["Requests", "Records"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              variant={"inner-tab"}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <CardHeader>
        <CardTitle>Employee Transfers</CardTitle>
        <CardDescription>Here you can view and manage the employee transfer requests</CardDescription>
      </CardHeader>
      <CardContent>
        <FilterInput
          filters={[
            {
              type: "search",
              placeholder: "Search by ID and Name",
              name: "employee_name_or_id",
            },
            {
              type: "select",
              options: Departments,
              name: "old_department",
              placeholder: "Department",
            },
            {
              type: "select",
              options: Designations,
              name: "designation",
              placeholder: "Designation",
            },
            {
              type: "select",
              options: Branches,
              name: "old_branch",
              placeholder: "Branch",
            },
            {
              type: 'select',
              options: [{ label: 'Internal Transfer', value: 'INTERNAL' }, { label: 'External Transfer', value: 'ExTERNAL' }],
              name: 'transfer_type',
              placeholder: 'Transfer Type',
            }
          ]}
          filterValues={filterData}
          className={'justify-end mb-4'}
          onChange={handleFilterChange}
        />
        {/* <Button
          variant="outline"
          onClick={handleResetFilters}
          className="shrink-0"
        >
          Reset Filters
        </Button> */}
        {isLoading ? (
          <PageLoader />
        ) : (
          <TableCustom
            data={employeeTransferData.results}
            columns={TransferColumns(fetchData)}
            pagination={true}
            dataTotalSize={employeeTransferData.count || 0}
            tableOptions={tableOptions}
          />
        )}

      </CardContent>
    </Tabs>
  );
}
