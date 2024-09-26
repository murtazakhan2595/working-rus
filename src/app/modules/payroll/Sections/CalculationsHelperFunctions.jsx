
const parseFormattedValue = (formattedValue) => {
  // Check for "Flat Amount" format
  if (formattedValue.includes("Flat Amount")) {
    // Example: "AED 1200.00 Flat Amount" -> { type: "flat_amount", value: 1200.00 }
    return {
      type: "flat_amount",
      value: parseFloat(
        formattedValue.replace(/AED\s|Flat Amount/g, "").trim()
      ),
    };
  }

  // Check for "% of Gross" format
  if (formattedValue.includes("% of Gross")) {
    // Example: "40% of Gross" -> { type: "percentage", value: 40 }
    return {
      type: "percentage",
      value: parseFloat(formattedValue.replace("% of Gross", "").trim()),
    };
  }

  // Check for "% of Basic" format
  if (formattedValue.includes("% of Basic")) {
    // Example: "40% of Basic" -> { type: "percentage", value: 40 }
    return {
      type: "percentage",
      value: parseFloat(formattedValue.replace("% of Basic", "").trim()),
    };
  }

  // Return the value as is if no matching format is found
  return formattedValue;
};


export const calculateEarningsAndDeductions = (
  monthlyGrossSalary,
  earnAndDeductionType
) => {
  console.log("calculate",earnAndDeductionType);
  console.log("calculate",monthlyGrossSalary);
  const earnings = [];
  const deductions = [];
  let totalEarnings = 0;
  let totalDeductions = 0;
  console.log("calculate",earnAndDeductionType);

  // Helper function to calculate percentage-based values
  const calculateAmount = (parsedValue, type , base) => {
    if (type === "flat_amount") {
      return parsedValue;
    }
    else if (typeof parsedValue === "number" && parsedValue <= 100 && type === "percentage") {
      return (base * parsedValue) / 100;
    }
    return parsedValue;
  };

  earnAndDeductionType.forEach((item) => {
     if (!item.is_active) return;
     console.log("item",item.amounts);
    const {type, value} = parseFormattedValue(item.amounts);
    console.log("type, value",type,value);

    if (item.income_type === "earning") {
      const monthlyAmount = calculateAmount(value, type, monthlyGrossSalary);
      console.log("monthlyAmount",monthlyAmount);
      earnings.push({
        name: item.name,
        amounts: item.amounts,
        monthly_amount: monthlyAmount,
      });
      totalEarnings += monthlyAmount;
    } else {
      const monthlyAmount = calculateAmount(value,type, monthlyGrossSalary);
      deductions.push({
        name: item.name,
        amounts: item.amounts,
        monthly_amount: monthlyAmount,
      });
      totalDeductions += monthlyAmount;
    }
  });

  const otherAllowance = monthlyGrossSalary - totalEarnings;
  earnings.push({
    name: "Other Allowance",
    amounts: "Remaining after other earnings",
    monthly_amount: otherAllowance,
  });
  console.log("Total earnings", earnings)

  totalEarnings += otherAllowance;

  return {
    earnings,
    deductions,
    totalEarnings,
    totalDeductions,
  };
};
