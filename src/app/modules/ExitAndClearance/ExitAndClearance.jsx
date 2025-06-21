import React from "react";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getEmployeesExitCount } from "app/hooks/employeeExitAndClearance";
import RequestTerminationCard from "./RequestTerminationCard";
import { FaRegCheckCircle } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { RxCrossCircled } from "react-icons/rx";
import { Card, CardContent } from "components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Header } from "components";
import { StatusList } from "./Sections";
import { ResignationStatusOptions } from "data/Data";
import Stats from "components/ui/Stats";
import { TerminationStatusOptions } from "data/Data";
import { ExitRequests } from "app/modules/ExitAndClearance/ExitRequests";
import { ExitRecords } from "app/modules/ExitAndClearance/ExitRecords";
import { TerminationReasons } from "app/modules/ExitAndClearance";
import EOSSettlementList from "../SelfService/Exit/EOSSettlementList";
import useEOSSettlement from "../../hooks/useEOSSettlement";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments, setDepartments } from "state/slices/CommonSlice";
import axios from "axios";
import { initialState as userInitialState } from "state/slices/UserSlice";
import { HasAccess } from "utils/PermissionUtils";
import { Button } from "components/ui/button";
import { AddUpdateTerminationReasons } from "./TerminationReasons";

// Get baseUrl from user initial state
const baseUrl = userInitialState.baseUrl;

// Headers function for API requests
const headers = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});

// Add function to fetch departments directly from API
const fetchDepartmentsDirectly = async (organizationId) => {
  try {
    const response = await axios.get(`${baseUrl}/department/`, {
      headers: headers(),
      params: {
        ordering: "created_at",
        organization: organizationId,
      },
    });

    if (response.data && response.data.results) {
      return response.data.results.map((dept) => ({
        id: dept.id,
        value: dept.id,
        name: dept.name,
        label: dept.name,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching departments directly:", error);
    return [];
  }
};

const ExitAndClearance = ({ userProfile, departments, isTeamView = false }) => {
  const [activeTab, setActiveTab] = useState("Exit Requests");
  const [totalExit, setTotalExit] = useState(0);
  const [approvedResignation, setApprovedResignation] = useState(0);
  const [rejectedResignation, setRejectedResignation] = useState(0);
  const [terminationReasonsReload, setTerminationReasonsReload] = useState(0);
  const [terminationReasons, setTerminationReasons] = useState(false);
  const [reloadData, setReloadData] = useState(false);
  const manageExitRequestsPermitted = HasAccess("MANAGE_EXIT_REQUESTS");

  const { showEOSSettlement } = useEOSSettlement(
    { id: userProfile?.employeeId, status: userProfile?.status },
    userProfile
  );

  const fetchData = async () => {
    try {
      const response = await getEmployeesExitCount(
        userProfile.role === 2 || isTeamView
          ? { filterData: { reporting_to: userProfile.id } }
          : {},
        activeTab,
      );

      if (response) {
        setTotalExit(response.total);
        setRejectedResignation(response.rejected);
        setApprovedResignation(response.approved);
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    fetchData();
  }, [activeTab, isTeamView]);

  const closeRequestTerminationCard = () => {
    fetchData();
    setReloadData(!reloadData);
  };

  const statsData = [
    { label: "Total Exits", value: totalExit, icon: ImExit },
    { label: "Accepted", value: approvedResignation, icon: FaRegCheckCircle },
    {
      label: "Rejected",
      value: rejectedResignation,
      icon: RxCrossCircled,
    },
  ];

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
      {!isTeamView && <Stats stats={statsData} />}
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
            <ExitRequests reload={reloadData} />
          </TabsContent>
          <TabsContent value="Exit Records">
            <ExitRecords />
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
