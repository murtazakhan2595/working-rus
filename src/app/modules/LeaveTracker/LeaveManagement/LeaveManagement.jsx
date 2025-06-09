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
import {AddUpdateLeaveDuration,LeaveDuration,Holidays,AddUpdateHolidays} from "app/modules/LeaveTracker";
import { getLeaveDurations } from "app/hooks/leaveTracker";
export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("leave-duration");
  const [addDuration, setAddDuration] = useState(false);
  const [addHolidays, setAddHolidays] = useState(false);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const payload = { options, ordering, filterData };
      const response = await getLeaveDurations(payload);
      if (response) {
        setData(response);
      }
    } catch (error) {
      console.error("Error fetching leave durations:", error);
    } finally {
      setLoading(false);
    }
  }, [options, ordering, filterData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onPageChange = (name, value) => {
    setOptions((prev) => ({ ...prev, [name]: value }));
  };

  const tabsData = [
    ...(true
      ? [
          {
            value: "leave-duration",
            label: "Leave Duration",
            component: (
              <LeaveDuration
                options={options}
                onPageChange={onPageChange}
                setOrdering={setOrdering}
                loading={loading}
                data={data}
                reload={fetchData}
              />
            ),
          },
        ]
      : []),
    {
      value: "public-holidays",
      label: "Public Holidays",
      component: (
        <Holidays
          options={options}
          onPageChange={onPageChange}
          setOrdering={setOrdering}
          loading={loading}
          data={data}
          reload={fetchData}
        />
      ),
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <Header
        content={
          <>
            {activeTab === "leave-duration" && (
              <Button
                onClick={() => {
                  setAddDuration(true);
                }}
              >
                Add Duration
              </Button>
            )}
            {activeTab === "public-holidays" && (
              <Button
                onClick={() => {
                  setAddHolidays(true);
                }}
              >
                Add Holidays
              </Button>
            )}
          </>
        }
      />
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="leave-duration"
      >
        <div className="flex flex-col items-start justify-between lg:flex-row md:flex-row xl:flex-row mb-4">
          <TabsList className="flex justify-center mb-4">
            {tabsData.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary-200 w-40 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <Card>
          <CardContent>
            {tabsData.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {tab.component}
              </TabsContent>
            ))}
          </CardContent>
        </Card>
      </Tabs>
      {addDuration && (
        <AddUpdateLeaveDuration
          isOpen={addDuration}
          setIsOpen={setAddDuration}
          reload={fetchData}
        />
      )}
      {addHolidays && (
        <AddUpdateHolidays
          isOpen={addHolidays}
          setIsOpen={setAddHolidays}
          reload={fetchData}
        />
      )}
    </div>
  );
}
