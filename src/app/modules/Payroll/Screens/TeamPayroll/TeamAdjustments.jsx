import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "components/ui/card.jsx";
import Header from "components/Header.jsx";
import { SalaryComponents } from "app/modules/Payroll/Screens/SalarySetup";
import { connect } from "react-redux";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "src/@/components/ui/tabs";
import AddComponentSheet from "../../Sections/AddComponentSheet.jsx";
import { EmployeesSalaryList } from "app/modules/Payroll/Screens/SalarySetup";
import AddAdjustmentSheet from "../../Sections/AddAdjustmentSheet.jsx";
import PayrollAdjustment from "../../Sections/PayrollAdjustment.jsx";

const TeamAdjustments = ({ departments }) => {

  return (
    <div className="flex flex-col gap-4 salary-startup">
      <Header />
        <Card>
          <CardContent>
            <PayrollAdjustment />
          </CardContent>
        </Card>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    departments: state.common.departments,
  };
};

export default connect(mapStateToProps)(TeamAdjustments);
