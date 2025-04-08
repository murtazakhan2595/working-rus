
export const calculateEarningsAndDeductions = (
  monthlyGrossSalary,
  earnAndDeductionType
) => {
  const earnings = [];
  const deductions = [];
  let totalEarnings = 0;
  let totalDeductions = 0;
  earnAndDeductionType.forEach((item) => {
    if (!item.is_active) return;

    if (item.income_type === "earning") {
      let monthlyAmount;
      console.log("item", item, monthlyGrossSalary);
        if (item.amounts_types === "percentage") {
          monthlyAmount = (monthlyGrossSalary * item.amounts) / 100;
        } else if (item.amounts_types === "fixed") {
          monthlyAmount = item.amounts;
        }
     earnings.push({
       name: item.name,
       amounts:
         item.amounts_types === "percentage"
           ? `Variable ${item.amounts}%`
           : `Fixed, Amt: AED ${item.amounts}`,
       monthly_amount: monthlyAmount,
     });
     totalEarnings += Number(monthlyAmount);
     console.log("MONTHLYAMOUNT ", totalEarnings);
    } else {
      let monthlyAmount;
      if (item.amounts_types === "percentage") {
        monthlyAmount = (monthlyGrossSalary * item.amounts) / 100;
      }
      else if(item.amounts_types === "fixed"){
        monthlyAmount = item.amounts;
      }
      deductions.push({
        name: item.name,
        amounts:
          item.amounts_types === "percentage"
            ? `Variable ${item.amounts}%`
            : `Fixed, Amt: AED ${item.amounts}`,
        monthly_amount: monthlyAmount,
      });
      totalDeductions += Number(monthlyAmount);
    }
  });

  const otherAllowance = monthlyGrossSalary - totalEarnings;
  earnings.push({
    name: "Other Allowance",
    amounts: "Remaining after other earnings",
    monthly_amount: otherAllowance,
  });
  console.log("Total earnings", earnings);

  totalEarnings += otherAllowance;

  return {
    earnings,
    deductions,
    totalEarnings,
    totalDeductions,
  };
};

export const calculateTotalMonthlyEarningsAndDeductions = (
  salary,
  components
) => {
  let totalEarnings = 0;
  let totalDeductions = 0;
  // components.forEach((item) => {
  //   const { type, value } = parseFormattedValue(item.amounts);

  //   if (item.income_type === "earning") {
  //     const monthlyAmount = calculateAmount(value, type, salary);
  //     totalEarnings += monthlyAmount;
  //   } else {
  //     const monthlyAmount = calculateAmount(value, type, salary);
  //     totalDeductions += monthlyAmount;
  //   }
  // });
  // const otherAllowance = salary - totalEarnings;
  // totalEarnings += otherAllowance;
  return {
    totalEarnings,
    totalDeductions,
  };
};
