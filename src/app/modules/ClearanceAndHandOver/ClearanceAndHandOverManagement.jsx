import { Header } from "components";
import { useCallback, useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import ClearanceRequests from "./Sections/ClearanceRequests";
// import { getClearanceRequests } from "app/hooks/clearanceHooks"; // You'll need to create this

export default function ClearanceAndHandover() {
  const [activeTab, setActiveTab] = useState("clearance-requests");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const payload = { options, ordering, filterData };
      console.log("Fetching clearance data with payload:", activeTab);

      if (activeTab === "clearance-requests") {
        // const response = await getClearanceRequests(payload);
        // Mock data for now - this will be replaced with real API call
        const response = {
          results: [
            {
              id: 1,
              employee_name: "John Doe",
              employee_id: "EMP001",
              department: "IT Department",
              designation: "Software Engineer",
              clearance_type: "Leave",
              clearance_start_date: "2024-08-20",
              status: "Pending",
            },
            {
              id: 2,
              employee_name: "Jane Smith",
              employee_id: "EMP002",
              department: "HR Department",
              designation: "HR Specialist",
              clearance_type: "Internal Transfer",
              clearance_start_date: "2024-08-18",
              status: "In Process",
            },
            {
              id: 3,
              employee_name: "Mike Johnson",
              employee_id: "EMP003",
              department: "Finance Department",
              designation: "Financial Analyst",
              clearance_type: "External Transfer",
              clearance_start_date: "2024-08-15",
              status: "Completed",
            },
            {
              id: 4,
              employee_name: "Sarah Wilson",
              employee_id: "EMP004",
              department: "Marketing Department",
              designation: "Marketing Manager",
              clearance_type: "Job Rotation",
              clearance_start_date: "2024-08-22",
              status: "Pending",
            },
            {
              id: 5,
              employee_name: "David Brown",
              employee_id: "EMP005",
              department: "Operations Department",
              designation: "Operations Lead",
              clearance_type: "Resignation",
              clearance_start_date: "2024-08-16",
              status: "Rejected",
            },
            {
              id: 6,
              employee_name: "Emily Davis",
              employee_id: "EMP006",
              department: "IT Department",
              designation: "Senior Developer",
              clearance_type: "Special Leave",
              clearance_start_date: "2024-08-19",
              status: "In Process",
            },
          ],
          count: 6,
        };

        if (response) {
          setData(response);
        }
      }
    } catch (error) {
      console.error("Error fetching clearance requests:", error);
    } finally {
      setLoading(false);
    }
  }, [options, ordering, filterData, activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Reset options and filterData when the active tab changes
    setOptions({ page: 1, sizePerPage: 10 });
    setFilterData({});
    setOrdering("-id");
  }, [activeTab]);

  const onPageChange = (name, value) => {
    setOptions((prev) => ({ ...prev, [name]: value }));
  };

  const tabsData = [
    {
      value: "clearance-requests",
      label: "Clearance Requests",
      component: (
        <ClearanceRequests
          options={options}
          onPageChange={onPageChange}
          setOrdering={setOrdering}
          loading={loading}
          data={data}
          reload={fetchData}
          filterData={filterData}
          setFilterData={setFilterData}
        />
      ),
    },
    // Future tabs can be added here like:
    // {
    //   value: "clearance-templates",
    //   label: "Clearance Templates",
    //   component: <ClearanceTemplates />
    // },
    // {
    //   value: "clearance-reports",
    //   label: "Clearance Reports",
    //   component: <ClearanceReports />
    // }
  ];

  return (
    <div className="flex flex-col gap-4">
      <Header
        // content={
        //   <>
        //     {activeTab === "clearance-requests" && (
        //       <div className="flex gap-2">
        //         <Button variant="outline">Export Clearance Data</Button>
        //         <Button>Generate Report</Button>
        //       </div>
        //     )}
        //   </>
        // }
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="clearance-requests"
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row mb-4">
          <TabsList>
            {tabsData.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <Card>
          {tabsData.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.component}
            </TabsContent>
          ))}
        </Card>
      </Tabs>
    </div>
  );
}
