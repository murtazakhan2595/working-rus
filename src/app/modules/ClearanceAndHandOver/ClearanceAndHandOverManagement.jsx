import { Header } from "components";
import { useCallback, useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import { Card, CardContent } from "components/ui/card";
import ClearanceRequests from "./Sections/ClearanceRequestsAndRecords/ClearanceRequests";
import ClearanceCertificates from "./Sections/ClearanceCertificates/ClearanceCertificates";
import ClearanceAnalyticsDashboard from "./Sections/AnalyticsDashboard/ClearanceAnalyticsDashboard";
import {
  getClearanceRequestsList,
  getClearanceCertificatesList,
} from "app/hooks/clearanceAndHandover";
import { getClearanceTypeList } from "app/hooks/officeSetting";
import { HasAccess } from "utils/PermissionUtils";
import AccessConfiguration from "./Sections/AccessConfiguration";
import ClearanceRecords from "./Sections/ClearanceRequestsAndRecords/ClearanceRecords";

export default function ClearanceAndHandover() {
  const [activeTab, setActiveTab] = useState("clearance-requests");
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ results: [], count: 0 });
  const [clearanceTypes, setClearanceTypes] = useState([]);
  const isViewClearanceAnalytics = HasAccess(
    "VIEW_CLEARANCE_ANALYTICS_DASHBOARD"
  );

  // Load clearance types on component mount
  useEffect(() => {
    fetchClearanceTypes();
  }, []);

  const fetchClearanceTypes = async () => {
    try {
      const response = await getClearanceTypeList();
      if (response) {
        setClearanceTypes(response?.results || []);
      }
    } catch (error) {
      console.error("Error fetching clearance types:", error);
      setClearanceTypes([]);
    }
  };

  const fetchData = useCallback(async () => {
    // Skip data fetching for analytics tab as it handles its own data
    if (activeTab === "analytics") return;

    setLoading(true);
    try {
      const payload = { options, ordering, filterData };

      if (activeTab === "clearance-requests") {
        const requestsPayload = {
          ...payload,
          filterData: {
            ...payload.filterData,
            // Only apply default status filter if user hasn't selected a specific status
            ...(payload.filterData.status
              ? {
                  // Ensure user-selected status is always an array for consistency
                  status: Array.isArray(payload.filterData.status)
                    ? payload.filterData.status
                    : [payload.filterData.status],
                }
              : {
                  status: ["PENDING", "IN_PROCESS", "REJECTED", "ONHOLD"],
                }),
          },
        };
        const response = await getClearanceRequestsList(requestsPayload);
        if (response && response.results) {
          setData(response);
        } else {
          setData({ results: [], count: 0 });
        }
      } else if (activeTab === "clearance-records") {
        const recordsPayload = {
          ...payload,
          filterData: {
            ...payload.filterData,
            // Only apply default status filter if user hasn't selected a specific status
            ...(payload.filterData.status
              ? {
                  // Ensure user-selected status is always an array for consistency
                  status: Array.isArray(payload.filterData.status)
                    ? payload.filterData.status
                    : [payload.filterData.status],
                }
              : {
                  status: ["COMPLETED", "REJECTED"],
                }),
          },
        };
        const response = await getClearanceRequestsList(recordsPayload);
        if (response && response.results) {
          setData(response);
        } else {
          setData({ results: [], count: 0 });
        }
      } else if (activeTab === "clearance-certificates") {
        // Fetch certificates data
        const response = await getClearanceCertificatesList(payload);
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
    {
      value: "clearance-records",
      label: "Clearance Records",
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

    {
      value: "clearance-certificates",
      label: "Clearance Certificates",
      component: (
        <ClearanceCertificates
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
    ...(isViewClearanceAnalytics
      ? [
          {
            value: "analytics",
            label: "Analytics Dashboard",
            component: <ClearanceAnalyticsDashboard />,
          },
        ]
      : []),
    {
      value: "access-configuration", // NEW TAB
      label: "Access Configuration",
      component: <AccessConfiguration />,
    },
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

        {tabsData.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {/* Only wrap non-analytics tabs in Card */}
            {tab.value === "analytics" ? (
              tab.component
            ) : (
              <Card>{tab.component}</Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
