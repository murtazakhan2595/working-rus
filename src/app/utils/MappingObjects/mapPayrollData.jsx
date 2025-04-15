import { PayRun, EmployeePayRoll } from "app/utils/Types/Payroll";
import moment from "moment";

export function mapPayRunData(data) {
  const payrunData = Object.keys(PayRun).reduce((acc, key) => {
    if (data.hasOwnProperty(key)) {
      if (key === "start_date") {
        acc["title"] = `Process Pay Run for ${moment(data[key]).format(
          "MMMM YYYY"
        )}`;
      }
      acc[key] = data[key];
    }
    return acc;
  }, {});

  return payrunData;
}

export async function mapPayRunList(data) {
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
