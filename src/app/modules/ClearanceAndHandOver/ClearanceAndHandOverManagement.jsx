import { Header } from "components";
import { useCallback, useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Card, CardContent } from "components/ui/card";
import ClearanceRequests from "./Sections/ClearanceRequests";
import ClearanceRecords from "./Sections/ClearanceRecords"; // NEW IMPORT
import { getClearanceRequestsList } from "app/hooks/clearanceAndHandover";
import { getClearanceTypeList } from "app/hooks/officeSetting";

export default function ClearanceAndHandover() {
  const [activeTab, setActiveTab] = useState("clearance-requests");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ results: [], count: 0 });
  const [clearanceTypes, setClearanceTypes] = useState([]);

  // Load clearance types on component mount - MOVED OUTSIDE fetchData
  useEffect(() => {
    fetchClearanceTypes();
  }, []);

  const fetchClearanceTypes = async () => {
    try {
      console.log("Fetching clearance types...");
      const response = await getClearanceTypeList();
      console.log("Clearance types response:", response);

      if (response) {
        setClearanceTypes(response?.results || []);
        console.log("Clearance types set:", response);
      }
    } catch (error) {
      console.error("Error fetching clearance types:", error);
      setClearanceTypes([]); // Set empty array on error
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const payload = { options, ordering, filterData };
      console.log("Fetching clearance data with payload:", payload);

      if (activeTab === "clearance-requests") {
        // Fetch requests that are NOT completed
        const requestsPayload = {
          ...payload,
          filterData: {
            ...payload.filterData,
            status: ["PENDING", "IN_PROCESS", "COMPLETED", "REJECTED"], // Exclude completed records
          },
        };
        const response = await getClearanceRequestsList(requestsPayload);

        if (response && response.results) {
          setData(response);
        } else {
          setData({ results: [], count: 0 });
        }
      } else if (activeTab === "clearance-records") {
        // Fetch ONLY completed records
        const recordsPayload = {
          ...payload,
          filterData: {
            ...payload.filterData,
            status: ["COMPLETED"], // Only completed records
          },
        };
        const response = await getClearanceRequestsList(recordsPayload);

        if (response && response.results) {
          setData(response);
        } else {
          setData({ results: [], count: 0 });
        }
      }
    } catch (error) {
      console.error("Error fetching clearance data:", error);
      setData({ results: [], count: 0 });
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

  // Debug: Log current state
  console.log("Current clearanceTypes state:", clearanceTypes);
  console.log("Is clearanceTypes array?", Array.isArray(clearanceTypes));

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
          clearanceTypes={clearanceTypes}
        />
      ),
    },
    // NEW TAB - Clearance Records
    {
      value: "clearance-records",
      label: "Clearance & Handover Records",
      component: (
        <ClearanceRecords
          options={options}
          onPageChange={onPageChange}
          setOrdering={setOrdering}
          loading={loading}
          data={data}
          reload={fetchData}
          filterData={filterData}
          setFilterData={setFilterData}
          clearanceTypes={clearanceTypes}
        />
      ),
    },
    // Future tabs can be added here
  ];

  return (
    <div className="flex flex-col gap-4">
      <Header />

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
