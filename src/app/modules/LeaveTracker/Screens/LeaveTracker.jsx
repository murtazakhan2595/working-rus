import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PageLoader, Header } from "components";
import { MyLeavesColumns } from "app/utils/Types/TableColumns";

import { FaPlus } from "react-icons/fa";
import { LeaveStatus } from "data/Data";
// import {
//   getLeaveApplications,
//   getEmployeeLeaveTypes,
//   deleteLeaveRequest,
// } from "app/hooks/leaveManagment";
import { FilterInput } from "components/form-control";
import { getEmployeeLeavesTypesList } from "utils/Lists";
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
import AddTypeSheet from "../Sections/AddTypeSheet";
import { getLeaveComponents } from "app/hooks/leaveTracker.jsx";
import { saveLeaveComponents } from "app/hooks/leaveTracker.jsx";
import EmployeeLeavesDetailSheet from "../Sections/EmployeeLeavesDetailSheet.jsx";
import { getLeaveStatsEmployee } from "app/hooks/leaveTracker.jsx";
import { getLeavestatesCustomApi } from "app/hooks/leaveTracker.jsx";

const dummyData = [
  {
    id: 1,
    work_email: "khan@gmail.com",
    full_name: "Khan",
    department: "IT",
    total_Alloted: 10,
    total_used: 5,
    total_remaining: 5,
  },
];
const LeaveTracker = ({ userProfile, departments }) => {
  const [Leave, setLeave] = useState([]);
  const [leaveTypesOfEmployee, setLeaveTypesOfEmployee] = useState([]);
  const [activeTab, setActiveTab] = useState("records");
  const [recordsFilterData, setRecordsFilterData] = useState({});
  const [typesFilterData, setTypesFilterData] = useState({});
  const [leaveTpesData, setLeaveTypesData] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isSelectedLeaveSheet, setIsSelectedLeaveSheet] = useState(false);
  const [empLeaveStats, setEmpLeaveStats] = useState([]);
  const [isTypesLoading, setIsTypesLoading] = useState(true);
  const [isRecordsLoading, setIsRecordsLoading] = useState(true);

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
    setIsTypesLoading(true);
    const leaveTypesData = await getLeaveComponents({
      filterData: { ...typesFilterData, employee_id_and_org: "null,true" },
    });
    if (leaveTypesData) {
      setLeaveTypesData(leaveTypesData);
    }
    setIsTypesLoading(false);
  };

  const fetchData = async () => {
  setIsRecordsLoading(true);
    const filterData = {
      ...recordsFilterData,
      ...(userProfile.role === 2 ? { direct_report: userProfile.id } : {}),
    };
    const empLeaveStats = await getLeavestatesCustomApi({
      filterData,
      options,
    });
    if (empLeaveStats) {
      setEmpLeaveStats(empLeaveStats);
    }
    setIsRecordsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [recordsFilterData, options]);

  useEffect(() => {
    fetchLeaveTypesData();
  }, [typesFilterData, options]);

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
    onRowClick: (row) => {
      console.log("Row clicked", row);
      setIsSelectedLeaveSheet(true);
      setSelectedLeave(row);
    },
  };
  const leaveTypesTableOptions = {
    onRowClick: (row) => {
      setSelectedType(row);
    },
  };

  const tabsData = [
    { value: "records", label: "Records" },
    { value: "types", label: "Types" },
  ];
  const filters =
    activeTab === "records"
      ? [
          {
            type: "select-one",
            option: departments,
            name: "department_name",
            placeholder: "Department",
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
      <Header
        content={activeTab === "types" && <AddTypeSheet triggerText="" />}
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="records"
      >
          <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
        {userProfile.role !== 2 ? (
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
        ) : <div></div>}
            <FilterInput
              filters={filters}
              onChange={
                activeTab === "records"
                  ? handleRecordsFilterChange
                  : handleTypestFilterChange
              }
            />
          </div>

        <Card>
          <CardContent>
            <TabsContent value="records">
              {isRecordsLoading ? (
                <PageLoader />
              ) : (
                <CustomTable
                  data={empLeaveStats.results || []}
                  columns={LeaveRecordColumns}
                  dataTotalSize={empLeaveStats.count || 0}
                  pagination={true}
                  tableOptions={tableOptions}
                />
              )}
            </TabsContent>
            <TabsContent value="types">
              {isTypesLoading ? (
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
          troggerText="Add Component"
        />
      )}
      {selectedLeave && (
        <EmployeeLeavesDetailSheet
          employeeLeaves={selectedLeave}
          isOpen={isSelectedLeaveSheet}
          setIsOpen={setIsSelectedLeaveSheet}
        />
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

export default connect(mapStateToProps)(LeaveTracker);
