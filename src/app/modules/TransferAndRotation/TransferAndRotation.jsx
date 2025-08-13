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
import { Rotations, EmployeeTransfer } from 'app/modules/TransferAndRotation';
import { TransferForm, RotationRequestForm } from "app/modules/TransferAndRotation";

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
  const [OpenTransferForm, setOpenTransferForm] = useState(false);
  const [OpenRotationForm, setOpenRotationForm] = useState(false);
  const [activeTab, setActiveTab] = useState("Transfers");
  const [TransferStats, setTransferStats] = useState(0);
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
          setTransferStats(response);
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




  const TransferStatsData = React.useMemo(() => [
    { label: "Total Exits", value: TransferStats.Total, icon: FolderInput },
    { label: "Pending", value: TransferStats.Pending, icon: Loader },
    { label: "Accepted", value: TransferStats.Approved, icon: CircleCheckBig },
    { label: "Rejected", value: TransferStats.Rejected, icon: CircleX },
    { label: "Clearance Completed", value: TransferStats.Clearance, icon: FileCheck2 },
    { label: "Exit Interview", value: TransferStats.Exit, icon: LogOut },
  ], [TransferStats]);

  const handleRequestClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenTransferForm(false);
    setOpenRotationForm(false);
    const triggeredResquest = event.target.title;
    if (triggeredResquest === 'transfer')
      setOpenTransferForm(true);
    else if (triggeredResquest === 'rotations')
      setOpenRotationForm(true);
  }

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <>
            {activeTab === "Transfers" && (
              <Button
                title='transfer'
                onClick={handleRequestClick}
              >
                Request Transfer
              </Button>
            )}
            {activeTab === "Rotations" && (
              <Button
                title='rotations'
                onClick={handleRequestClick}
              >
                Request Rotation
              </Button>
            )}
          </>
        }
      />
      {activeTab === "Transfers" && <Stats stats={TransferStatsData} />}
      <Tabs
        defaultValue="Transfers"
        className="w-full"
        onValueChange={(tab) => {
          setActiveTab(tab);
        }}
        value={activeTab}
      >
        <TabsList>
          {["Transfers", "Rotations"].map(
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
          <TabsContent value="Transfers">
            <EmployeeTransfer />
          </TabsContent>
        </Card>
      </Tabs>
      {OpenTransferForm && (
        <TransferForm
          isOpen={OpenTransferForm}
          setIsOpen={() => {
            setOpenTransferForm(false);
            //fetchData(true);
          }}
          // transfer_type={activeExternalTab === "Internal" ? "INTERNAL" : "EXTERNAL"}
          initiator={'MANAGER'}
        />
      )}
      {OpenRotationForm && (
        <RotationRequestForm
          isOpen={OpenRotationForm}
          setIsOpen={() => {
            setOpenRotationForm(false);
            //fetchData(true);
          }}
          isAdminView={isAdminView}
          isBranchView={isBranchView}
          isDepartmentView={isDepartmentView}
        />
      )}
    </div>
  );
};

export default TransferAndRotation
