import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "components/ui/card";
import { FilterInput } from "components/FormControl";
import { Header, PageLoader, TableCustom } from "components";
import { getLeavestats, getLeaveListData } from "app/hooks/leaveTracker";
import {
  getLeaveTransaction,
  getLeaveComponents,
} from "app/hooks/leaveTracker";
import { LeaveAplicationColumns } from "app/modules/LeaveTracker/Sections";
import { LeaveTrackerOptions } from "data/Data";
import { UserRoundCheck, UsersRound } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import { HasAccess } from "utils/PermissionUtils";
import { GetDispatchStateList } from "utils/Lists";
import { getDropdownList } from "utils/Lists";

const EmployeeLeaveCount = ({
  isTeamView = false,
  activeView = "Requests",
}) => {
  const Departments = GetDispatchStateList("departments", "common") || [];
  const Branches = GetDispatchStateList("branches", "common") || [];
  const Employees = GetDispatchStateList("employees", "emp") || [];
  const { id: user_id } = GetDispatchStateList("user_details", "emp") || {};
  const isViewLTPermitted = HasAccess("VIEW_ATT_UPDATE_LOGS");
  const isViewBLTPermitted = HasAccess("VIEW_BRN_ATT_UPDATES_LOGS");
  const isViewDLTermitted = HasAccess("VIEW_DPT_ATT_UPDATES_LOGS");
  const [activeTab, setActiveTab] = useState(activeView);

  const [selectedLeaveApplication, setSelectedLeaveApplication] =
    useState(null);
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [leaveTransaction, setLeaveTransaction] = useState();
  const [isLeaveTransactionLoading, setIsLeaveTransactionLoading] =
    useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });

  const TimeAdjustmentOuterTab = useMemo(() => {
    return ["Requests", "Records"];
  }, []);

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };
  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };

  const [LeaveTrackerStats, setLeaveTrackerStats] = useState([
    { label: "Total Applications", value: 0, icon: UsersRound },
    { label: "Pending Requests", value: 0, icon: UserRoundCheck },
    { label: "Accepted Requests", value: 0, icon: UserRoundCheck },
  ]);

  useEffect(() => {
    let isMounted = true;
    setFilterData(() => {
      if (isTeamView) return { managers: user_id };
      else return {};
    });
    return () => {
      isMounted = false;
    };
  }, [isTeamView]);

  const fetchData = async () => {
    setLoading(true);
    const statsData = await getLeavestats({});
    if (statsData) {
      setLeaveTrackerStats([
        {
          label: "Total Applications",
          value: statsData?.total_applications,
          icon: UsersRound,
        },
        {
          label: "Pending Requests",
          value: statsData?.pending_applications,
          icon: UserRoundCheck,
        },
        {
          label: "Accepted Requests",
          value: statsData?.accepted_applications,
          icon: UserRoundCheck,
        },
      ]);
    }
    setLoading(false);
    const leaveTypesData = await getLeaveComponents({});
    if (leaveTypesData) {
      const dropdownList = await getDropdownList(leaveTypesData?.results || []);
      setLeaveTypesData(dropdownList);
    }
  };

  const fetchLeaveTransaction = async (isMounted) => {
    setIsLeaveTransactionLoading(true);
    const leaveTransaction = await getLeaveListData({
      filterData,
      options,
    });
    if (leaveTransaction && isMounted) {
      setLeaveTransaction(leaveTransaction);
    }
    setIsLeaveTransactionLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchLeaveTransaction(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, options]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "" || filterValue === null) {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }

      return updatedFilters;
    });
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header />
      <Card>
        <div className="flex flex-col gap-4 px-6">
          <CardTitle className="text-primary pt-6">Leave Records</CardTitle>
          <CardDescription className="text-neutral-1100">
            {`Here you can view leaves of all employees.`}
          </CardDescription>
          <FilterInput
            filters={[
              {
                type: "select",
                option: Employees,
                name: "employee",
                placeholder: "Employee",
              },
              {
                type: "select",
                option: Departments,
                name: "departmentt",
                placeholder: "Department",
              },
              {
                type: "select",
                option: Branches,
                name: "branch",
                placeholder: "Branch",
              },
              {
                type: "select",
                option: leaveTypesData || [],
                name: "leave_type",
                placeholder: "Leave Type",
              },
              {
                type: "date-range",
                name: "date_range",
                placeholder: "Leave Period",
              },
            ]}
            onChange={handleFilterChange}
            className="justify-end"
          />
          <CardContent className="px-0">
            {isLeaveTransactionLoading ? (
              <PageLoader />
            ) : (
              <TableCustom
                data={leaveTransaction?.results || []}
                columns={LeaveAplicationColumns(false, fetchLeaveTransaction)}
                pagination={true}
                dataTotalSize={leaveTransaction?.count || 0}
                tableOptions={tableOptions}
              />
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeLeaveCount;
