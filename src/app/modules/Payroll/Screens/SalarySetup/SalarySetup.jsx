import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
} from "components/ui/card.jsx";
import Header from "components/Header.jsx";
import {
  SalaryComponents,
} from "app/modules/Payroll/Screens/SalarySetup";
import { connect } from "react-redux";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import AddComponentSheet from "../../Sections/AddComponentSheet.jsx";
import {EmployeesSalaryList} from 'app/modules/Payroll/Screens/SalarySetup';
import AddAdjustmentSheet from "../../Sections/AddAdjustmentSheet.jsx";
import PayrollAdjustment from "../../Sections/PayrollAdjustment.jsx"

const SalarySetup = ({ departments }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("salary");

  const tabsData = [
    { value: "salary", label: "Salary" },
    { value: "components", label: "Components" },
    { value: "payroll-adjustment", label: "Payroll Adjustment" },
  ];

  return (
    <div className="flex flex-col gap-4 salary-startup">
      <Header
        content={
 
          // hide for the salary component sheet by zahid
          // (activeTab === "components" && (
          //   <AddComponentSheet isOpen={isOpen} setIsOpen={setIsOpen} />
          // )) ||
          (activeTab === "payroll-adjustment" && (
            <AddAdjustmentSheet isOpen={isOpen} setIsOpen={setIsOpen} />
          ))
        }
      />

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
                className="data-[state=active]:bg-primary-200 w-36 data-[state=active]:text-primary-1100 rounded-sm data-[state-active]:font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <Card>
          <CardContent>
            <TabsContent value="salary">
              <EmployeesSalaryList />
            </TabsContent>
            <TabsContent value="components">
              <SalaryComponents />
            </TabsContent>
            <TabsContent value="payroll-adjustment">
              <PayrollAdjustment />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(SalarySetup);
