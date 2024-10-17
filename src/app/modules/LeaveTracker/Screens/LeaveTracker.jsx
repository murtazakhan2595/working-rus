import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PageLoader, Header } from "components";
import { MyLeavesColumns } from "app/utils/Types/TableColumns";

import { FaPlus } from "react-icons/fa";
import { LeaveStatus } from "data/Data";
import {
  getLeaveApplications,
  getEmployeeLeaveTypes,
  deleteLeaveRequest,
} from "app/hooks/leaveManagment";
import { FilterInput } from "components/form-control";
import { getEmployeeLeavesTypesList } from "utils/Lists";
// import LeaveTrackerStats from "./LeaveTrackerStats";
import CustomTable from "components/CustomTable";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../components/ui/card.jsx";
import { LeaveRecordColumns } from "app/utils/Types/TableColumns";
import { LeaveTypesColumns } from "app/utils/Types/TableColumns.jsx";
import  AddTypeSheet  from "../Sections/AddTypeSheet";
import { getLeaveComponents } from "app/hooks/leaveTracker.jsx";
import { saveLeaveComponents } from "app/hooks/leaveTracker.jsx";

const dummyData =[
  {
    id: 1,
    work_email: "khan@gmail.com",
    full_name: "Khan",
    department: "IT",
    total_Alloted: 10,
    total_used: 5,
    total_remaining: 5,
  }
]
const LeaveTracker = ({ userProfile, leaveTypes }) => {
  const [Leave, setLeave] = useState([]); // Leave applications data
  const [isLoading, setIsLoading] = useState(false); // Loading indicator
  const [leaveTypesOfEmployee, setLeaveTypesOfEmployee] = useState([]); // Leave types available to employee
  const [activeTab, setActiveTab] = useState("records");
  const [recordsFilterData, setRecordsFilterData] = useState({});
  const [typesFilterData, setTypesFilterData] = useState({});
  const [leaveTpesData, setLeaveTypesData] = useState([]);
  const [selectedType, setSelectedType] = useState(null);

  const [options, setOptions] = useState({
    page: 1, // Current page number
    sizePerPage: 10, // Number of items per page
  });

  const onPageChange = (name, value) => {
    const pageOptions = options;
    if (pageOptions[name] !== value) {
      pageOptions[name] = value;
      setOptions((prevOptions) => ({ ...prevOptions, ...pageOptions }));
    }
  };

  const fetchLeaveTypesData = async () => {
    const leaveTypesData = await getLeaveComponents({filterData:{...typesFilterData}});
    if(leaveTypesData){
      setLeaveTypesData(leaveTypesData)
    }
  }
  console.log("typesFilterData", typesFilterData);

  useEffect(() => {
    fetchLeaveTypesData();
  }, [typesFilterData]);

  // Separate handler for records filters
  const handleRecordsFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    setRecordsFilterData((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterValue === "") {
        delete updatedFilters[filterName];
      } else {
        updatedFilters[filterName] = filterValue;
      }
      return updatedFilters;
    });
  };

  // Separate handler for types filters
  const handleTypestFilterChange = (filterName, filterValue) => {
    const updatedFilters = { ...typesFilterData };
    if (filterValue === "") {
      delete updatedFilters[filterName];
    } else {
      updatedFilters[filterName] = filterValue;
    }
    setTypesFilterData(updatedFilters); // Update component filters
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
  };
  const leaveTypesTableOptions ={
    onRowClick: (row) => {
      setSelectedType(row);
    }
  }

  const tabsData = [
    { value: "records", label: "Records" },
    { value: "types", label: "Types" },
  ];
  const filters =
    activeTab === "recordss"
      ? [
          {
            type: "select-one",
            option: [],
            name: "department_name",
            placeholder: "Department",
          },
          {
            type: "select-two",
            option: [],
            name: "salary_type",
            placeholder: "Salary Type",
          },
        ]
      : [
          {
            type: "search",
            placeholder: "Leave Type",
            name: "name",
          },
          {
            type: "select-two",
            option: [
              { value: true, label: "Active" },
              { value: false, label: "Inactive" },
            ],
            name: "status",
            placeholder: "Active",
          },
        ];
          const onCheckedChange = async (value, type) => {
            console.log("INFO", value, type);
            const updatedComponent = { ...type, status: value };
            const response = await saveLeaveComponents(updatedComponent);
            if (response) {
              setLeaveTypesData((prevState) =>
                prevState.map((item) =>
                  item.id === updatedComponent.id ? updatedComponent : item
                )
              );
            }
          };
  return (
    <div className="flex flex-col gap-4 profile-management">
      <Header content={activeTab === "types" && <AddTypeSheet />} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="salary"
      >
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex justify-center mb-4">
            {tabsData?.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-plum-500 w-28 data-[state=active]:text-plum-900 rounded-full data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="h-[47px] flex-col justify-center items-start inline-flex">
                <div className="flex-col justify-start items-start flex">
                  <div className="self-stretch text-[#ab4aba] text-2xl font-medium font-['Inter'] leading-normal">
                    {activeTab === "records"
                      ? "Leave Types"
                      : "Employee Salaries"}
                  </div>
                </div>
                <div className="pt-1.5 flex-col justify-start items-start flex">
                  <div className="flex-col justify-start items-start flex">
                    <div className="self-stretch text-[#8b8d98] text-sm font-normal font-['Inter'] leading-[16.80px]">
                      {activeTab === "records"
                        ? "Leaves of all employees are listed below"
                        : "Types details are listed here"}
                    </div>
                  </div>
                </div>
              </div>
              <FilterInput
                filters={filters}
                onChange={
                  activeTab === "records"
                    ? handleRecordsFilterChange
                    : handleTypestFilterChange
                }
              />
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="records">
              {isLoading ? (
                <PageLoader />
              ) : (
                <CustomTable
                  data={dummyData || []}
                  columns={LeaveRecordColumns}
                  pagination={true}
                  dataTotalSize={dummyData?.count || 0}
                  tableOptions={tableOptions}
                />
              )}
            </TabsContent>
            <TabsContent value="types">
              {isLoading ? (
                <PageLoader />
              ) : (
                <CustomTable
                  data={leaveTpesData || []}
                  columns={LeaveTypesColumns(onCheckedChange)}
                  pagination={false}
                  tableOptions={leaveTypesTableOptions}
                />
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      {selectedType && (
        <AddTypeSheet
          type={selectedType}
          openSheet={true}
          reload={fetchLeaveTypesData}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    leaveTypes: state.common.leaveTypes,
  };
};

export default connect(mapStateToProps)(LeaveTracker);
