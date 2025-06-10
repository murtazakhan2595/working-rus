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
import { LeaveAplicationColumns } from "app/modules/LeaveTracker/Sections";
import { Tabs, TabsList, TabsTrigger } from "src/@/components/ui/tabs";
import { HasAccess } from "utils/PermissionUtils";
import { GetDispatchStateList } from "utils/Lists";
import { getDropdownList } from "utils/Lists";
import { GlobalStatusOptions } from "data/Data";
import { getLeaveTypeListData } from "app/hooks/leaveTracker";

const LeaveTracker = ({ isTeamView = false, activeView = "Requests" }) => {
  const Departments = GetDispatchStateList("departments", "common") || [];
  const Branches = GetDispatchStateList("branches", "common") || [];
  const { id: user_id } = GetDispatchStateList("user_details", "emp") || {};
  const isViewLTPermitted = HasAccess("VIEW_ATT_UPDATE_LOGS");
  const isViewBLTPermitted = HasAccess("VIEW_BRN_ATT_UPDATES_LOGS");
  const isViewDLTermitted = HasAccess("VIEW_DPT_ATT_UPDATES_LOGS");
  const [activeTab, setActiveTab] = useState(activeView);
  const [filterData, setFilterData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [leaveTypesData, setLeaveTypesData] = useState([]);
  const [Leaves, setLeaves] = useState();
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");

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
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      setFilterData(() => {
        if (isTeamView) return { managers: user_id };
        else return {};
      });
    return () => {
      isMounted = false;
    };
  }, [isTeamView]);

  const fetchData = async (isMounted) => {
    try {
      setIsLoading(true);
      const Leaves = await getLeaveListData({
        filterData,
        options,
      });
      if (Leaves && isMounted) {
        setLeaves(Leaves);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [filterData, options, ordering]);
  const fetchLeaveTypeData = async (isMounted) => {
    try {
      setIsLoading(true);
      const LeavesTypes = await getLeaveTypeListData();
      if (LeavesTypes && isMounted) {
        setLeaveTypesData(LeavesTypes.results || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let isMounted = true;
    fetchLeaveTypeData(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      // Handle other filters normally
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
      <Tabs
        defaultValue="Requests"
        className="w-full"
        onValueChange={(tab) => {
          setActiveTab(tab);
        }}
        value={activeTab}
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex items-center justify-center mb-4">
            {TimeAdjustmentOuterTab.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-primary-200 w-fit data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <Card>
          <div className="flex flex-col gap-4 px-6">
            <CardTitle className="text-primary pt-6">
              Leave {activeTab}
            </CardTitle>
            <CardDescription className="text-neutral-1100">
              {`Here you can ${
                activeTab === "Requests" ? "manage and" : ""
              } view leave ${activeTab.toLowerCase()}.`}
            </CardDescription>
            <FilterInput
              filters={[
                {
                  type: "select",
                  options: Departments,
                  name: "departmentt",
                  placeholder: "Department",
                },
                {
                  type: "select",
                  options: Branches,
                  name: "branch",
                  placeholder: "Branch",
                },
                ...(activeTab === "Records"
                  ? [
                      {
                        type: "select",
                        options: GlobalStatusOptions(false),
                        name: "status",
                        placeholder: "Status",
                      },
                    ]
                  : []),
                {
                  type: "select",
                  options: leaveTypesData || [],
                  name: "leave_component_id",
                  placeholder: "Leave Type",
                },
              ]}
              onChange={handleFilterChange}
              className="justify-end"
            />
            <CardContent className="px-0">
              {isLoading ? (
                <PageLoader />
              ) : (
                <TableCustom
                  data={Leaves?.results || []}
                  columns={LeaveAplicationColumns(
                    activeTab === "Requests",
                    fetchData
                  )}
                  pagination={true}
                  dataTotalSize={Leaves?.count || 0}
                  tableOptions={tableOptions}
                />
              )}
            </CardContent>
          </div>
        </Card>
      </Tabs>
    </div>
  );
};

export default LeaveTracker;
