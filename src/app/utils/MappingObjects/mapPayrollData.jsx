import {
  PayRun,
  EmployeePayRoll,
  EmployeeSalarySetup,
  EmployeePayRunPaySlip,
} from "app/utils/Types/Payroll";
import moment from "moment";
import { calculatePercentage } from "utils/renderValues";
export function mapPayRunData(data) {
  const payrunData = Object.keys(PayRun).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      // if (key === "start_date") {
      //   acc["title"] = `Process Pay Run for ${moment(data[key]).format(
      //     "MMMM YYYY"
      //   )}`;
      // }
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return payrunData;
}

export async function mapPayRunList(data) {
  console.log("in mapPayRunList", data);
  if (!data || data.length === 0) return [];
  const PayRunList = await data?.map((payrun) => {
    return mapPayRunData(payrun);
  });

  return PayRunList;
}

export function mapEmployeePayRollData(data) {
  if (!data) return {};
  const payrunData = Object.keys(EmployeePayRoll).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return payrunData;
}
export function mapEmployeeSalarySetupData(data) {
  if (!data) return {};
  const payrunData = Object.keys(EmployeeSalarySetup).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      if (key === "ctc") acc["gross_salary"] = data[key];
      if (key === "salary_breakdown_type")
        if (data[key] === "percentage") {
          const {
            basic_salary = 0,
            medical_allowance = 0,
            transport_allowance = 0,
            house_allowance = 0,
            other_allowance = 0,
            ctc = 0,
          } = data;
          acc["basic_salary"] = calculatePercentage(basic_salary, ctc);

          acc["medical_allowance"] = calculatePercentage(
            medical_allowance,
            ctc
          );

          acc["transport_allowance"] = calculatePercentage(
            transport_allowance,
            ctc
          );

          acc["house_allowance"] = calculatePercentage(house_allowance, ctc);

          acc["other_allowance"] = calculatePercentage(other_allowance, ctc);
        }
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return payrunData;
}

export function mapPayrunPayloadData(data, id) {
  // Initialize an empty payload object
  const payload = {};
  // Iterate over the keys in the Task object
  for (const key in PayRun) {
    // Check if the key exists in the data object
    if (
      data.hasOwnProperty(key) &&
      data[key] !== null &&
      data[key] !== undefined
    ) {
      // Add the key and its value to the payload
      if (
        [
          "salary_on_hold",
          "nationalities",
          "departments",
          "branches",
          "managers",
          "religions",
          "genders",
        ].includes(key)
      ) {
        if (data[key].length > 0) payload[key] = data[key];
      } else payload[key] = data[key];
    }
  }

  // Return the constructed payload
  return payload;
}

export function mapEmployeePayrunPayslipData(data) {
  if (!data) return {};
  const payrunData = Object.keys(EmployeePayRunPaySlip).reduce((acc, key) => {
    if (key === "total_earnings") {
      const TotalEarningArrays = data[key] || [];
      // const variable_kpi = TotalEarningArrays.find(
      //   (obj) => obj.name === "Variable KPI"
      // );
      // acc["variable_kpi"] = variable_kpi.amount;
    } else if (key === "inflation_effect") {
      const TotalEarningArrays = data[key] || [];
      // const variable_kpi = TotalEarningArrays.find(
      //   (obj) => obj.name === "Variable KPI"
      // );
      // acc["variable_kpi"] = variable_kpi.amount;
    } else if (key === "reimbursements") {
      acc["reimbursements"] = data?.total_reimbursements?.approved;
    } else acc[key] = data[key];
    return acc;
  }, {});

  return payrunData;
}
