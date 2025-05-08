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
import { FilterInput } from "components/FormControl";
import { ResignationStatusOptions } from "data/Data";
import Stats from "components/ui/Stats";
import { TerminationStatusOptions } from "data/Data";
import { ExitRequests } from "app/modules/ExitAndClearance/ExitRequests";
import { ExitRecords } from "app/modules/ExitAndClearance/ExitRecords";
import EOSSettlementList from "../SelfService/Exit/EOSSettlementList";
import useEOSSettlement from "../../hooks/useEOSSettlement";
import { useDispatch, useSelector } from "react-redux";
import { fetchDepartments, setDepartments } from "state/slices/CommonSlice";
import axios from "axios";
import { initialState as userInitialState } from "state/slices/UserSlice";

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
  const [activeInnerTab, setActiveInnerTab] = useState("Terminations");
  const [totalExit, setTotalExit] = useState(0);
  const [approvedResignation, setApprovedResignation] = useState(0);
  const [rejectedResignation, setRejectedResignation] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [reloadData, setReloadData] = useState(false);
  const [filterData, setFilterData] = useState({
    exit_category: "termination",
    status_termination: StatusList(false),
    ...(userProfile.role === 2 || isTeamView
      ? { reporting_to: userProfile.id }
      : {}),
  });
  const [filterInnerData, setFilterInnerData] = useState({});
  const [reloadCounter, setReloadCounter] = useState(0);
  const dispatch = useDispatch();
  const organizationId = userProfile?.organization;

  const { showEOSSettlement } = useEOSSettlement(
    { id: userProfile?.employeeId, status: userProfile?.status },
    userProfile
  );

  // Fetch departments on component mount
  useEffect(() => {
    if (organizationId) {
      const loadDepartments = async () => {
        try {
          // First try direct API call
          const departmentsFromAPI = await fetchDepartmentsDirectly(
            organizationId
          );
          if (departmentsFromAPI && departmentsFromAPI.length > 0) {
            console.log(
              departmentsFromAPI.length
            );
            dispatch(setDepartments(departmentsFromAPI));
          } else {
            // Fallback to redux action
            dispatch(fetchDepartments());
          }
        } catch (error) {
          console.error("Error loading departments:", error);
          // Fallback to redux action
          dispatch(fetchDepartments());
        }
      };

      loadDepartments();
    }
  }, [organizationId, dispatch]);

  const fetchData = async () => {
    try {
      const response = await getEmployeesExitCount(
        userProfile.role === 2 || isTeamView
          ? { filterData: { reporting_to: userProfile.id } }
          : {},
        activeTab,
        activeInnerTab
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
  }, [activeTab, activeInnerTab, isTeamView]);

  const closeRequestTerminationCard = () => {
    fetchData();
    setReloadData(!reloadData);
  };

  const handleFilterChange = (filterName, filterValue) => {
    if (filterName === "status_resignation") setSelectedStatus(filterValue);
    if (filterName === "status_termination") setSelectedStatus(filterValue);
    if (filterName === "departments_name") {
      setSelectedStatus(filterValue);
      filterValue = [filterValue];
    } else if (
      filterName === "status_resignation" ||
      (filterName === "status_termination" && filterValue)
    ) {
      filterValue = filterValue;
    }
    setFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };
  const handleTabChange = (tab) => {
    if (tab === "Resignations" || tab === "Exit Requests") {
      setFilterData({
        status_resignation: StatusList(),
        ...(userProfile.role === 2 || isTeamView
          ? { reporting_to: userProfile.id }
          : {}),
        exit_category: "resignation",
      });
    } else if (tab === "Terminations") {
      setFilterData({
        status_termination: StatusList(false),
        ...(userProfile.role === 2 || isTeamView
          ? { reporting_to: userProfile.id }
          : {}),
        exit_category: "termination",
      });
    } else if (tab === "Resigned" || tab === "Exit Records") {
      setFilterData({
        ...(userProfile.role === 2 || isTeamView
          ? { reporting_to: userProfile.id }
          : {}),
        exit_category: "resignation",
        status_resignation: "exit interview",
      });
    } else if (tab === "Terminated") {
      setFilterData({
        ...(userProfile.role === 2 || isTeamView
          ? { reporting_to: userProfile.id }
          : {}),
        exit_category: "termination",
        status_termination: "exit interview",
      });
    }
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

  const getFilterInputOptions = () => {
    if (activeTab === "Resignations") {
      return ResignationStatusOptions;
    } else if (activeTab === "Terminations") {
      return TerminationStatusOptions;
    } else {
      return departments;
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          userProfile.role === 1 || userProfile.role === 3 ? (
            <RequestTerminationCard closeModel={closeRequestTerminationCard} />
          ) : null
        }
      />
      {!isTeamView && <Stats stats={statsData} />}
      <Tabs
        defaultValue="Exit Requests"
        className="w-full"
        onValueChange={(tab) => {
          handleTabChange(tab);
          setActiveTab(tab);
          setActiveInnerTab(
            tab === "Exit Requests" ? "Resignations" : "Resigned"
          );
        }}
        value={activeTab}
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex items-center justify-center mb-4">
            {["Exit Requests", "Exit Records"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search by ID",
                name: "emp_serial_no",
              },
              ...(activeInnerTab === "Resignations"
                ? [
                    {
                      type: "select-one",
                      option: ResignationStatusOptions,
                      name: "status_resignation",
                      placeholder: "Status",
                      values: selectedStatus,
                      value: selectedStatus,
                    },
                  ]
                : activeInnerTab === "Terminations"
                ? [
                    {
                      type: "select-one",
                      option: TerminationStatusOptions,
                      name: "status_termination",
                      placeholder: "Status",
                      values: selectedStatus,
                      value: selectedStatus,
                    },
                  ]
                : [
                    {
                      type: "select-one",
                      option: departments,
                      name: "departments_name",
                      placeholder: "Department",
                      values: selectedStatus,
                      value: selectedStatus,
                    },
                  ]),
            ]}
            onChange={handleFilterChange}
          />
        </div>
        <Card>
          <CardContent>
            <TabsContent value="Exit Requests">
              <ExitRequests
                filterData={filterData}
                handleTabChange={handleTabChange}
                activeTab={activeInnerTab}
                setActiveTab={setActiveInnerTab}
                reload={reloadData}
              />
            </TabsContent>
            <TabsContent value="Exit Records">
              <ExitRecords
                filterData={filterData}
                handleTabChange={handleTabChange}
                activeTab={activeInnerTab}
                setActiveTab={setActiveInnerTab}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
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
