import React from "react";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getEmployeeTransferStats, getRotationStats } from "app/hooks/transferAndRotation";
import { CircleCheckBig, CircleX, FolderInput, Loader, } from "lucide-react";
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
import { JobRotationCalendar } from ".";

const TransferAndRotation = ({ }) => {
  // permissions for tranfer
  const isAdminView = HasAccess("VIEW_EMPLOYEE_TRANSFER");
  const isBranchView = HasAccess("VIEW_BRANCH_EXIT");
  const isDepartmentView = HasAccess("VIEW_DPT_EXIT");
  // permissions for rotation
  const isRAdminView = HasAccess("VIEW_JOB_ROTATION");
  const isRBranchView = HasAccess("VIEW_BRN_JOB_ROTATION");
  const isRDepartmentView = HasAccess("VIEW_DPT_JOB_ROTATION");
  const {
    id: user_id,
    branch_id: user_branch,
    department_name: user_department,
  } = GetDispatchStateList("user_details", "emp") || {}
  const [OpenTransferForm, setOpenTransferForm] = useState(false);
  const [OpenRotationForm, setOpenRotationForm] = useState(false);
  const [activeTab, setActiveTab] = useState("Transfers");
  const [TransferStats, setTransferStats] = useState({});
  const [RotationStats, setRotationStats] = useState({});
  const [permittedViewFilterData, setPermittedViewFilterData] = useState(null);
  const [reloadData, setReloadData] = useState({});
  const [permittedRotationViewFilterData, setPermittedRotationViewFilterData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (isMounted)
      setPermittedRotationViewFilterData(() => {
        if (isRAdminView) return {};
        else if (isRBranchView) return { branch: user_branch };
        else if (isRDepartmentView) return { department: user_department };
      });
    return () => {
      isMounted = false;
    };
  }, [isRAdminView, isRBranchView, isRDepartmentView, user_branch, user_department, user_id]);


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
        const response = await getEmployeeTransferStats({
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


  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const filter = { ...permittedRotationViewFilterData };
        const response = await getRotationStats({
          filterData: filter,
        });

        if (response) {
          setRotationStats(response);
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (permittedRotationViewFilterData) fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [permittedRotationViewFilterData]);


  const TransferStatsData = React.useMemo(() => [
    { label: "Total Tranfers", value: TransferStats.Total, icon: FolderInput },
    { label: "Pending", value: TransferStats.Pending, icon: Loader },
    { label: "Approved", value: TransferStats.Approved, icon: CircleCheckBig },
    { label: "Rejected", value: TransferStats.Rejected, icon: CircleX },
  ], [TransferStats]);

  const RotationStatsData = React.useMemo(() => [
    { label: "Total Rotations", value: RotationStats.Total, icon: FolderInput },
    { label: "Pending", value: RotationStats.Pending, icon: Loader },
    { label: "Approved", value: RotationStats.Approved, icon: CircleCheckBig },
    { label: "Rejected", value: RotationStats.Rejected, icon: CircleX },
  ], [RotationStats]);

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
              <Button title="rotations" onClick={handleRequestClick}>
                Request Rotation
              </Button>
            )}
          </>
        }
      />
      {activeTab === "Transfers" && <Stats stats={TransferStatsData} />}
      {activeTab === "Rotations" && <Stats stats={RotationStatsData} />}
      <Tabs
        defaultValue="Transfers"
        className="w-full"
        onValueChange={(tab) => {
          setActiveTab(tab);
        }}
        value={activeTab}
      >
        <TabsList>
          {["Transfers", "Rotations", "Job Rotation Calendar"].map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <Card>
          <TabsContent value="Rotations">
            <Rotations reload={reloadData['rotation']} permittedViewFilterData={permittedRotationViewFilterData} />
          </TabsContent>
          <TabsContent value="Transfers">
            <EmployeeTransfer reload={reloadData['transfer']} />
          </TabsContent>
          <TabsContent value="Job Rotation Calendar">
            <JobRotationCalendar />
          </TabsContent>
        </Card>
      </Tabs>
      {OpenTransferForm && (
        <TransferForm
          isOpen={OpenTransferForm}
          setIsOpen={() => {
            setOpenTransferForm(false);
            setReloadData((prev) => {
              return {
                ...prev,
                "transfer": !prev["transfer"],
              };
            })
          }}
          initiator={'MANAGER'}
        />
      )}
      {OpenRotationForm && (
        <RotationRequestForm
          isOpen={OpenRotationForm}
          setIsOpen={() => {
            setOpenRotationForm(false);
            setReloadData((prev) => {
              return {
                ...prev,
                "rotation": !prev["rotation"],
              };
            })
          }}
          isAdminView={isRAdminView}
          isBranchView={isRBranchView}
          isDepartmentView={isRDepartmentView}
        />
      )}
    </div>
  );
};

export default TransferAndRotation
