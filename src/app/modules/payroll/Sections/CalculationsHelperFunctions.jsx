
  const parseFormattedValue = (formattedValue) => {
    // Check for "Flat Amount" format
    if (formattedValue.includes("Flat Amount")) {
      // Example: "AED 1200.00 Flat Amount" -> "1200.00"
      return parseFloat(
        formattedValue.replace(/AED\s|Flat Amount/g, "").trim()
      );
    }

    // Check for "% of Gross" format
    if (formattedValue.includes("% of Gross")) {
      // Example: "40% of Gross" -> "40"
      return parseFloat(formattedValue.replace("% of Gross", "").trim());
    }

    // Check for "% of Basic" format
    if (formattedValue.includes("% of Basic")) {
      // Example: "40% of Basic" -> "40"
      return parseFloat(formattedValue.replace("% of Basic", "").trim());
    }

    // Return the value as is if no matching format is found
    return formattedValue;
  };


export const calculateEarningsAndDeductions = (
  monthlyGrossSalary,
  earnAndDeductionType
) => {
  const earnings = [];
  const deductions = [];
  let totalEarnings = 0;
  let totalDeductions = 0;
  console.log("calculate",earnAndDeductionType);

  // Helper function to calculate percentage-based values
  const calculateAmount = (parsedValue, base) => {
    if (typeof parsedValue === "number" && parsedValue <= 100) {
      return (base * parsedValue) / 100;
    }
    return parsedValue;
  };

  earnAndDeductionType.forEach((item) => {
     if (!item.is_active) return;
    const parsedAmount = parseFormattedValue(item.amounts);

    if (item.income_type === "earning") {
      const monthlyAmount = calculateAmount(parsedAmount, monthlyGrossSalary);
      earnings.push({
        name: item.name,
        amounts: item.amounts,
        monthly_amount: monthlyAmount,
      });
      totalEarnings += monthlyAmount;
    } else {
      const monthlyAmount = calculateAmount(parsedAmount, monthlyGrossSalary);
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

  totalEarnings += otherAllowance;

  return {
    earnings,
    deductions,
    totalEarnings,
    totalDeductions,
  };
};
