import React from "react";
import { connect } from "react-redux";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Row, Col } from "reactstrap";
import { getEmployeesExitCount } from "app/hooks/employeeExitAndClearance";
import StatCard from "./StatCard";
import Resignations from "./Resignations";
import Terminations from "./Terminations";
import { CustomDarkButton } from "components/form-control";
import RequestTerminationCard from "./RequestTerminationCard";
import Terminated from "./Terminated";
import Resigned from "./Resigned";
import { TerminationStatus } from "utils/getValuesFromTables";
import SheetOnBorading from "components/ui/sheet-onBording-form";
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

const ExitAndClearance = ({ userProfile }) => {
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

  return (
    <div className="flex flex-col gap-4 profile-management">
      <Header
        content={
          <RequestTerminationCard closeModel={closeRequestTerminationCard} />
        }
      />
      <StatCard
        totalExit={totalExit}
        approvedResignation={approvedResignation}
        rejectedResignation={rejectedResignation}
      />
      <Tabs
        defaultValue="Resignations"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="inline-flex items-center justify-center p-1 bg-white rounded-lg h-9 text-mauve-900">
            {["Resignations", "Terminations", "Resigned", "Terminated"].map(
              (tab) => (
                <TabsTrigger key={tab} value={tab}>
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
                option: ResignationStatusOptions,
                name: "status_resignation",
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
  };
};

export default connect(mapStateToProps)(ExitAndClearance);
