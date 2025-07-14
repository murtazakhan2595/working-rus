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
import {
  AddUpdateLeaveDuration,
  LeaveDuration,
  Holidays,
  AddUpdateOffsetLeave,
  AddUpdateHolidays,
  LeaveTypes,
  AddUpdateLeaveType,
  OffsetLeaves,
  OpeningLeaveBalance,
} from "app/modules/LeaveTracker";
import { getLeaveDurations } from "app/hooks/leaveTracker";
import { getLeaveTypes } from "app/hooks/leaveTracker";
import AddUpdateLeaveBalance from "./OpeningLeaveBalance/AddUpdateLeaveBalance";

export default function LeaveManagement() {
  const [activeTab, setActiveTab] = useState("leave-duration");
  const [addDuration, setAddDuration] = useState(false);
  const [addHolidays, setAddHolidays] = useState(false);
  const [options, setOptions] = useState({ page: 1, sizePerPage: 10 });
  const [ordering, setOrdering] = useState("-id");
  const [filterData, setFilterData] = useState({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [addLeaveType, setAddLeaveType] = useState(false);
  const [addLeaveOffet, setAddLeaveOffet] = useState(false);
  const [reloadHolidays, setReloadHolidays] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const payload = { options, ordering, filterData };
      console.log("Fetching data with payload:", activeTab);
      if (activeTab === "leave-duration") {
        const response = await getLeaveDurations(payload);
        if (response) {
          setData(response);
        }
      } else if (activeTab === "leave-types") {
        const response = await getLeaveTypes(payload);
        if (response) {
          setData(response);
        }
      }
    } catch (error) {
      console.error("Error fetching leave durations:", error);
    } finally {
      setLoading(false);
    }
  }, [options, ordering, filterData]);

  useEffect(() => {
    fetchData();
  }, [fetchData, activeTab]);

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
    ...(true
      ? [
          {
            value: "leave-types",
            label: "Leave Types",
            component: (
              <LeaveTypes
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
          reload={reloadHolidays}
        />
      ),
    },
    {
      value: "offset_leave_settings",
      label: "Offset Leave Settings",
      component: (
        <OffsetLeaves
          reload={reloadHolidays}
        />
      ),
    },
    {
      value: "opening_leave_balance",
      label: "Opening Leave Balance",
      component: (
        <OpeningLeaveBalance
          reload={reloadHolidays}
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
            {activeTab === "leave-types" && (
              <Button
                onClick={() => {
                  setAddLeaveType(true);
                }}
              >
                Add Leave Type
              </Button>
            )}
            {activeTab === "offset_leave_settings" && (
              <Button
                onClick={() => {
                  setAddLeaveOffet(true);
                }}
              >
                Add Leave Offset
              </Button>
            )}
            {activeTab === "opening_leave_balance" && (
              <Button
                onClick={() => {
                  setOpeningBalance((prev) => !prev);
                }}
              >
                Add Leave Opening Balance
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
          {tabsData.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.component}
            </TabsContent>
          ))}
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
          reloadData={() => {
            setReloadHolidays(!reloadHolidays);
          }}
        />
      )}
      {addLeaveOffet && (
        <AddUpdateOffsetLeave
          isOpen={addLeaveOffet}
          setIsOpen={setAddLeaveOffet}
          reloadData={() => {
            setReloadHolidays(!reloadHolidays);
          }}
        />
      )}
      {addLeaveType && (
        <AddUpdateLeaveType
          isOpen={addLeaveType}
          setIsOpen={setAddLeaveType}
          reload={fetchData}
          isLeaveType={true}
        />
      )}
      {openingBalance && (
        <AddUpdateLeaveBalance
          isOpen={openingBalance}
          setIsOpen={setOpeningBalance}
          reloadData={() => {
            // setReloadHolidays(!reloadHolidays);
          }}
        />
      )}
    </div>
  );
}
