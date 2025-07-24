import React from "react";
import { connect } from "react-redux";
import { useEffect, useState, useCallback, useMemo } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getEmployeeExitStats } from "app/hooks/employeeExitAndClearance";
import RequestTerminationCard from "./RequestTerminationCard";
import {
  CircleCheckBig,
  CircleX,
  FolderInput,
  FileCheck2,
  LogOut,
  Loader,
} from "lucide-react";
import { Card } from "components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Header } from "components";
import Stats from "components/ui/Stats";
import { ExitRequests } from "app/modules/ExitAndClearance/ExitRequests";
import { ExitRecords } from "app/modules/ExitAndClearance/ExitRecords";
import { TerminationReasons } from "app/modules/ExitAndClearance";
import EOSSettlementList from "../SelfService/Exit/EOSSettlementList";
import useEOSSettlement from "../../hooks/useEOSSettlement";
import { HasAccess } from "utils/PermissionUtils";
import { Button } from "components/ui/button";
import { AddUpdateTerminationReasons } from "./TerminationReasons";
import { GetDispatchStateList } from "utils/Lists";

const ExitAndClearance = ({ userProfile, isTeamView = false }) => {
  const isAdminView = HasAccess("VIEW_EXIT");
  const isBranchView = HasAccess("VIEW_BRANCH_EXIT");
  const isDepartmentView = HasAccess("VIEW_DPT_EXIT");
  const {
    id: user_id,
    branch_id: user_branch,
    department_name: user_department,
  } = GetDispatchStateList("user_details", "emp") || {}
  const Managers = GetDispatchStateList("reportingManagers", "emp") || []
  const Departments = GetDispatchStateList("departments", "common") || []
  const Branches = GetDispatchStateList("branches", "common") || []
  const [activeTab, setActiveTab] = useState("Exit Requests");
  const [ExitStats, setExitStats] = useState(0);
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [terminationReasonsReload, setTerminationReasonsReload] = useState(0);
  const [terminationReasons, setTerminationReasons] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const manageExitRequestsPermitted = HasAccess("MANAGE_EXIT_REQUESTS");

  const { showEOSSettlement } = useEOSSettlement(
    { id: userProfile?.employeeId, status: userProfile?.status },
    userProfile
  );

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      setPermittedViewFilterData(() => {
        if (isTeamView) return { reporting_employees: [user_id] };
        else if (isAdminView) return {};
        else if (isBranchView) return { branch: user_branch };
        else if (isDepartmentView) return { department: user_department };
      });
    return () => {
      isMounted = false;
    };
  }, [isTeamView, isAdminView, isBranchView, isDepartmentView, user_branch, user_department, user_id]);

  const fetchData = useCallback(async () => {
    try {
      const filter = { ...permittedViewFilterData };
      const response = await getEmployeeExitStats({
        filterData: filter,
      });

      if (response) {
        setExitStats(response);
      }
    } catch (e) {
      console.error(e);
    }
  }, [permittedViewFilterData]);

  useEffect(() => {
    let isMounted = true;
    if (permittedViewFilterData) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [permittedViewFilterData, fetchData]);

  const closeRequestTerminationCard = () => {
    fetchData();
    setReloadData(!reloadData);
  };

  const statsData = React.useMemo(() => [
    { label: "Total Exits", value: ExitStats.Total, icon: FolderInput },
    { label: "Pending", value: ExitStats.Pending, icon: Loader },
    { label: "Accepted", value: ExitStats.Approved, icon: CircleCheckBig },
    { label: "Rejected", value: ExitStats.Rejected, icon: CircleX },
    { label: "Clearance Completed", value: ExitStats.Clearance, icon: FileCheck2 },
    { label: "Exit Interview", value: ExitStats.Exit, icon: LogOut },
  ], [ExitStats]);

  const Filters = React.useMemo(() => {
    const baseFilters = [
      {
        type: "search",
        placeholder: "Search by Employee ID",
        name: "emp_serial_no",
      },
    ];

    const departmentFilter =
      isAdminView || isBranchView
        ? [
          {
            type: "select",
            options: Departments,
            name: "department",
            placeholder: "Department",
          },
        ]
        : [];

    const branchFilter =
      isAdminView || !isBranchView
        ? [
          {
            type: "select",
            options: Branches,
            name: "branch",
            placeholder: "Branch",
          },
        ]
        : [];

    const managerFilter = [
      {
        type: "select",
        options: [],
        name: "managers",
        placeholder: "Reporting Manager",
      },
    ];

    return [...baseFilters, ...departmentFilter, ...branchFilter, ...managerFilter];
  }, [isAdminView, isBranchView]); // dependencies



  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <>
            {manageExitRequestsPermitted &&
              (activeTab === "Exit Requests" ||
                activeTab === "Exit Records") && (
                <RequestTerminationCard
                  closeModel={closeRequestTerminationCard}
                />
              )}
            {activeTab === "Resons of Termination" && (
              <Button
                onClick={() => {
                  setTerminationReasons(true);
                }}
              >
                Add Termination Reason
              </Button>
            )}
          </>
        }
      />
      <Stats stats={statsData} />
      <Tabs
        defaultValue="Exit Requests"
        className="w-full"
        onValueChange={(tab) => {
          setActiveTab(tab);
        }}
        value={activeTab}
      >
        <TabsList>
          {["Exit Requests", "Exit Records", "Resons of Termination"].map(
            (tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            )
          )}
        </TabsList>
        <Card>
          <TabsContent value="Exit Requests">
            <ExitRequests
              reload={reloadData}
              permittedViewFilterData={permittedViewFilterData}
              isTeamView={isTeamView}
              Filters={Filters}
            />
          </TabsContent>
          <TabsContent value="Exit Records">
            <ExitRecords
              isTeamView={isTeamView}
              permittedViewFilterData={permittedViewFilterData}
              Filters={Filters}
            />
          </TabsContent>
          <TabsContent value="Resons of Termination">
            <TerminationReasons reload={terminationReasonsReload} />
          </TabsContent>
        </Card>
      </Tabs>
      {terminationReasons && (
        <AddUpdateTerminationReasons
          isOpen={terminationReasons}
          setIsOpen={setTerminationReasons}
          reload={() => {
            fetchData();
            setTerminationReasonsReload((prev) => prev + 1); // Trigger reload
          }}
        />
      )}
      {showEOSSettlement && (
        <div className="mt-4">
          <EOSSettlementList employeeId={userProfile?.employeeId} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(ExitAndClearance);
