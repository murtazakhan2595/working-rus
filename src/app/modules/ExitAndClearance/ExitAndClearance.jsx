import React from "react";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { getEmployeesExitCount } from "app/hooks/employeeExitAndClearance";
import Resignations from "./Resignations";
import Terminations from "./Terminations";
import RequestTerminationCard from "./RequestTerminationCard";
import Terminated from "./Terminated";
import Resigned from "./Resigned";
// import { TerminationStatus } from "utils/getValuesFromTables";
import { FaRegCheckCircle } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { RxCrossCircled } from "react-icons/rx";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../src/@/components/ui/tabs";
import { Header } from "components";
import { StatusList } from "./Sections";
import { FilterInput } from "components/form-control";
import { ResignationStatusOptions } from "data/Data";
import Stats from "components/ui/Stats";
import { TerminationStatusOptions } from "data/Data";

const ExitAndClearance = ({ userProfile, departments }) => {
  const [activeTab, setActiveTab] = useState("Resignations");
  const [totalExit, setTotalExit] = useState(0);
  const [approvedResignation, setApprovedResignation] = useState(0);
  const [rejectedResignation, setRejectedResignation] = useState(0);
  const [filterData, setFilterData] = useState({
     exit_category: "resignation",
     status_resignation: StatusList(),
    ...(userProfile.role === 2 ? { reporting_to: userProfile.id } : {}),
  });
  const fetchData = async () => {
    try {
      const response = await getEmployeesExitCount(
        userProfile.role === 2
          ? { filterData: { reporting_to: userProfile.id } }
          : {}
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
  }, []);

  const closeRequestTerminationCard = () => {
    fetchData();
  };

  const handleFilterChange = (filterName, filterValue) => {
    if (
      filterName === "status_resignation" ||
      (filterName === "status_termination" && filterValue)
    ) {
      filterValue = [filterValue];
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
    if (tab === "Resignations") {
      setFilterData({
        status_resignation: StatusList(),
        ...(userProfile.role === 2 ? { reporting_to: userProfile.id } : {}),
        exit_category: "resignation",
      });
    } else if (tab === "Terminations") {
      setFilterData({
        status_termination: StatusList(false),
        ...(userProfile.role === 2 ? { reporting_to: userProfile.id } : {}),

        exit_category: "termination",
      });
    } else if (tab === "Resigned") {
      setFilterData({
        ...(userProfile.role === 2 ? { reporting_to: userProfile.id } : {}),

        exit_category: "resignation",
        status_resignation: ["exit interview"],
      });
    } else if (tab === "Terminated") {
      setFilterData({
        ...(userProfile.role === 2 ? { reporting_to: userProfile.id } : {}),

        exit_category: "termination",
        status_termination: ["exit interview"],
      });
    }
    setActiveTab(tab);
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

  const filterNameMapping = {
    Resignations: "status_resignation",
    Terminations: "status_termination",
    Resigned: "departments",
    Terminated: "departments",
  };
  return (
    <div className="flex flex-col gap-4 profile-management">
      <Header
        content={
          <RequestTerminationCard closeModel={closeRequestTerminationCard} />
        }
      />
      <Stats stats={statsData} />
      <Tabs
        defaultValue="Resignations"
        className="w-full"
        onValueChange={handleTabChange}
        value={activeTab}
      >
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex justify-center mb-4">
            {["Resignations", "Terminations", "Resigned", "Terminated"].map(
              (tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
                >
                  {tab}
                </TabsTrigger>
              )
            )}
          </TabsList>
          <FilterInput
            filters={[
              {
                type: "search",
                placeholder: "Search by id",
                name: "employee_id",
              },
              {
                type: "select-one",
                option: getFilterInputOptions(),
                name: filterNameMapping[activeTab],
                placeholder: "Status",
              },
            ]}
            onChange={handleFilterChange}
          />
        </div>
        <TabsContent value="Resignations">
          <Resignations filterData={filterData} />
        </TabsContent>

        <TabsContent value="Terminations">
          <Terminations filterData={filterData} />
        </TabsContent>
        <TabsContent value="Resigned">
          <Resigned filterData={filterData} />
        </TabsContent>
        <TabsContent value="Terminated">
          <Terminated filterData={filterData} />
        </TabsContent>
      </Tabs>
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
