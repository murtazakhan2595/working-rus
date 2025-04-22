import React, { useEffect, useState } from "react";
import { PageLoader, Header } from "components";
import { connect } from "react-redux";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs.jsx";
import { Button } from "components/ui/button";
import { PayRunList, PaySlipCard } from "app/modules/Payroll/Screens";
import { getSalarySetupData } from "app/hooks/payroll.jsx";
import { useNavigate } from "react-router-dom";
import { getPayun } from "app/hooks/payroll.jsx";

const PayRun = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("runPayroll");
  const [payRunData, setPayRunData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getPayun();
      if (data) {
        console.log(data);
        setPayRunData(data);
      }
      setIsLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabsData = [
    { value: "runPayroll", label: "Run Payroll" },
    { value: "paySlip", label: "Pay Slip" },
  ];

  return (
    <div className="flex flex-col gap-4 salary-startup">
      <Header />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="runPayroll"
      >
        <div className="flex flex-col justify-between lg:flex-row md:flex-row xl:flex-row">
          <TabsList className="flex justify-center mb-4">
            {tabsData?.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary-200 w-28 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            className="bg-black"
            onClick={() => navigate("/payroll/create-payrun")}
          >
            Create New Payroll
          </Button>
        </div>
        <TabsContent value="runPayroll">
          {isLoading ? <PageLoader /> : <PayRunList />}
        </TabsContent>
        <TabsContent value="paySlip">
          {isLoading ? <PageLoader /> : <PaySlipCard cardData={payRunData} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(PayRun);
