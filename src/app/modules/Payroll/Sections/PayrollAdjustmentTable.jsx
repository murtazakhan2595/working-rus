import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { usePDF } from "react-to-pdf";
import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { getPayslip } from "app/hooks/payroll";
// import RevisedSalarySheet from "./RevisedSalarySheet";
import {
  DesignationName,
  EmployeeID,
  // getExperience,
} from "utils/getValuesFromTables";
import { getEmployeeData } from "app/hooks/employee";
import { numberToWords, renderDate } from "utils/renderValues";
import { PageLoader, TableCustom } from "components";
import { ArrowLeft } from "lucide-react";
import moment from "moment";
import { getPayslip } from "app/hooks/payroll";
import { getPayslipByID } from "app/hooks/payroll";
import { getFinalSettlement } from "app/hooks/payroll";
import Newlogo from "../../../../assets/images/NewLogo";
import "../styles/payslip.css";
import { DetailBox } from "components/SheetCardExtension";
import {
  EmployeeAllowancesColumns,
  EmployeeDeductionsColumns,
} from "app/modules/Payroll/Sections";

export default function PayrollAdjustmentTable({
  AdjustmentRecord,
  footerText,
  fallbackText,
  AdjustmentTitle = "Adjustment",
}) {
  return (
    <Card>
      <CardTitle className="text-plum-900 p-6">{AdjustmentTitle}</CardTitle>
      <CardContent className="">
        {/* Employee Earnings */}
        <h3 className="mb-4 text-xl font-semibold text-plum-900"></h3>
        <TableCustom
          data={AdjustmentRecord?.results || []}
          columns={EmployeeAllowancesColumns}
          pagination={false}
          dataTotalSize={AdjustmentRecord?.count || 0}
          fallbackText={fallbackText}
          footerText={footerText}
        />
      </CardContent>
    </Card>
  );
}
