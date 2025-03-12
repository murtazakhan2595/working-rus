import React, { useEffect, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import {
  InternalTransferColumns,
  TransferForm,
} from "app/modules/EmployeeTranfer/Sections";
import { UsersRound, Contact, UserRoundCheck } from "lucide-react";
import { Header } from "components";
import { FilterInput, SelectInputComponent } from "components/FormControl";
import { EmployeeTranferStatus } from "data/Data";
import { getEmployeeTransferList } from "app/hooks/employeeTranfer";
import { PageLoader } from "components";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import Stats from "components/ui/Stats";
import TableCustom from "components/CustomTable";
import { useSelector } from "react-redux";
import { Button } from "components/ui/button";
import EmployeeInternalTranfer from "app/modules/EmployeeTranfer/InternalTransfer";
import EmployeeExternalTranfer from "app/modules/EmployeeTranfer/ExternalTransfer";
import Config from "constants/config";

const ExternalTabs = [
  Config.TEAM_INTERNALTRANSFER ? "Internal" : null,
  Config.TEAM_EXTERNALTRANSFER ? "External" : null,
].filter(Boolean);

const InternalTabs = ["Requests", "Records"];

export default function EmployeeTranfer() {
  const [isLoading, setIsLoading] = useState(true);
  const [employeeTransferData, setEmployeeTransferData] = useState({
    results: [],
    count: 0,
  });
  const [OpenTransferForm, setOpenTransferForm] = useState(false);
  const [activeExternalTab, setActiveExternalTab] = useState("Internal");
  const [activeInternalTab, setActiveInternalTab] = useState("Requests");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const Departments = useSelector((state) => state.common.departments);
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({});

  const onPageChange = (name, value) => {
    setOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
  };

  const tableOptions = {
    page: options.page,
    sizePerPage: options.sizePerPage,
    onPageChange: onPageChange,
    onSortChange: (sortName) => {
      setOrdering(sortName);
    },
  };

  const fetchData = async (isMounted) => {
    setIsLoading(true);
    try {
      const data = await getEmployeeTransferList({
        options,
        filterData,
        ordering,
      });
      if (isMounted) {
        setEmployeeTransferData(data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);
    return () => {
      isMounted = false;
    };
  }, [options, filterData, ordering]);

  const handleFilterChange = (filterName, filterValue) => {
    onPageChange("page", 1);
    if (filterName === "department_name") setSelectedDepartment(filterValue);
    if (filterName === "status") setSelectedStatus(filterValue);

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

  const statsData = [
    { label: "Total", value: 0, icon: UsersRound },
    { label: "Approved", value: 0, icon: Contact },
    { label: "Rejected", value: 0, icon: UserRoundCheck },
  ];
  useEffect(() => {
    if (activeExternalTab === "Internal" && activeInternalTab === "Requests") {
      setFilterData({
        // status: "PENDING,APPROVED BY MANAGER",
        transfer_type: "INTERNAL",
      });
    } else if (
      activeExternalTab === "External" &&
      activeInternalTab === "Requests"
    ) {
      setFilterData({
        // status: "PENDING,APPROVED BY MANAGER",
        transfer_type: "EXTERNAL",
      });
    } else if (
      activeExternalTab === "Internal" &&
      activeInternalTab === "Records"
    ) {
      setFilterData({
        // status: "PENDING,APPROVED BY MANAGER",
        transfer_type: "INTERNAL",
      });
    } else if (
      activeExternalTab === "External" &&
      activeInternalTab === "Records"
    ) {
      setFilterData({
        // status: "PENDING,APPROVED BY MANAGER",
        transfer_type: "EXTERNAL",
      });
    }
  }, [activeExternalTab, activeInternalTab]);
  return (
    <div
      className={`flex flex-col gap-4 ${window.location.pathname.substring(1)}`}
    >
      <Header
        content={
          <Button
            onClick={(e) => {
              e.preventDefault();
              setOpenTransferForm(true);
            }}
          >
            Request Transfer
          </Button>
        }
      />
      <Stats stats={statsData} />
      <Tabs
        defaultValue="Internal"
        className="w-full"
        onValueChange={(tab) => {
          setActiveExternalTab(tab);
          setActiveInternalTab("Requests");
        }}
        value={activeExternalTab}
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex items-center justify-center mb-4">
            {ExternalTabs.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          {/* <FilterInput
            filters={[
              // {
              //   type: "search",
              //   placeholder: "Search by ID and Name",
              //   name: "id_and_first_name",
              // },
              // {
              //   type: "select-one",
              //   option: Departments,
              //   name: "department_name",
              //   placeholder: "Department",
              //   values: selectedDepartment,
              // },
              {
                type: "select-one",
                option: EmployeeTranferStatus,
                name: "status",
                placeholder: "Status",
                values: selectedStatus,
              },
            ]}
            onChange={handleFilterChange}
          /> */}
        </div>
        <Card>
          <CardContent>
            <TabsContent value="Internal">
              <EmployeeInternalTranfer
                TabList={InternalTabs}
                activeTab={activeInternalTab}
                setActiveTab={setActiveInternalTab}
                EmployeesTransferData={employeeTransferData}
                reloadData={fetchData}
              />
            </TabsContent>
            <TabsContent value="External">
              <EmployeeExternalTranfer
                TabList={InternalTabs}
                activeTab={activeInternalTab}
                setActiveTab={setActiveInternalTab}
                EmployeesTransferData={employeeTransferData}
                reloadData={fetchData}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      {OpenTransferForm && (
        <TransferForm
          isOpen={OpenTransferForm}
          setIsOpen={() => {
            setOpenTransferForm(false);
            fetchData(true)
          }}
          transfer_type={
            activeExternalTab === "Internal" ? "INTERNAL" : "EXTERNAL"
          }
        />
      )}
    </div>
  );
}
