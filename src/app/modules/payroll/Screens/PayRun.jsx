import React, { useEffect, useState } from "react";
import Header from "../../../../components/Header.jsx";
import { PageLoader } from "components";
import { connect } from "react-redux";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../../../src/@/components/ui/tabs.jsx";
import PayRunAndPaySlipCard from "../Sections/PayRunAndPaySlipCard.jsx";
import { getSalarySetupData } from "app/hooks/payroll.jsx";

const PayRun = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("runPayroll");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getSalarySetupData();
      if (data) {
        console.log(data);
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

  const payRollData = [
    {
      title: "Process Pay Run for October 2024",
      employeesNetPay: "",
      paymentDate: "",
      numberofEmployees: "",
      buttonLabel: "Create Pay Run",
      onBtnClick: () => {},
    },
    {
      title: "Process Pay Run for September 2024",
      employeesNetPay: "200000",
      paymentDate: "10 September, 2024",
      numberofEmployees: "200",
      buttonLabel: "",
    },
  ];

  const paySlipData = [
    {
      title: "Payslips for September 2024",
      employeesNetPay: "200000",
      paymentDate: "10 September, 2024",
      numberofEmployees: "200",
      buttonLabel: "Genarate",
      onBtnClick: () => {},
    },
    {
      title: "Payslips for August 2024",
      employeesNetPay: "190000",
      paymentDate: "10 August, 2024",
      numberofEmployees: "199",
      buttonLabel: "",
    },
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
                className="data-[state=active]:bg-plum-500 w-28 data-[state=active]:text-plum-900 rounded-full data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="runPayroll">
          {isLoading ? (
            <PageLoader />
          ) : (
            <PayRunAndPaySlipCard cardData={payRollData} />
          )}
        </TabsContent>
        <TabsContent value="paySlip">
          <PayRunAndPaySlipCard cardData={paySlipData} />
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
