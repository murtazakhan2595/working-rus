import React from "react";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getEmployeeExitStats } from "app/hooks/employeeExitAndClearance";
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
import { HasAccess } from "utils/PermissionUtils";
import { Button } from "components/ui/button";
import { GetDispatchStateList } from "utils/Lists";
import { Rotations } from 'app/modules/TransferAndRotation';
const TransferAndRotation = ({ }) => {
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
  const [activeTab, setActiveTab] = useState("Tranfers");
  const [ExitStats, setExitStats] = useState(0);
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);



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



  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
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
    };
    if (permittedViewFilterData) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [permittedViewFilterData]);


  const statsData = React.useMemo(() => [
    { label: "Total Exits", value: ExitStats.Total, icon: FolderInput },
    { label: "Pending", value: ExitStats.Pending, icon: Loader },
    { label: "Accepted", value: ExitStats.Approved, icon: CircleCheckBig },
    { label: "Rejected", value: ExitStats.Rejected, icon: CircleX },
    { label: "Clearance Completed", value: ExitStats.Clearance, icon: FileCheck2 },
    { label: "Exit Interview", value: ExitStats.Exit, icon: LogOut },
  ], [ExitStats]);


  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <>

          </>
        }
      />
      <Stats stats={statsData} />
      <Tabs
        defaultValue="Tranfers"
        className="w-full"
        onValueChange={(tab) => {
          setActiveTab(tab);
        }}
        value={activeTab}
      >
        <TabsList>
          {["Tranfers", "Rotations"].map(
            (tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            )
          )}
        </TabsList>
        <Card>
          <TabsContent value="Rotations">
            <Rotations />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default TransferAndRotation
