import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { formatCurrency, convertCurrency } from "utils/payrollUtils";
import { DollarSign, TrendingUp } from "lucide-react";

const MultiCurrencySelector = ({
  value,
  onChange,
  disabled = false,
  showConversion = false,
  baseAmount = 0,
  baseCurrency = "AED",
  label = "Currency",
  className = "",
}) => {
  const { currencies, exchangeRates } = useSelector((state) => state.globalPayroll);
  const [convertedAmount, setConvertedAmount] = useState(0);

  // Default currencies if not loaded from API
  const defaultCurrencies = [
    { code: "AED", name: "UAE Dirham", symbol: "د.إ", country: "UAE" },
    { code: "GBP", name: "British Pound", symbol: "£", country: "UK" },
    { code: "USD", name: "US Dollar", symbol: "$", country: "USA" },
    { code: "EUR", name: "Euro", symbol: "€", country: "Europe" },
    { code: "KES", name: "Kenyan Shilling", symbol: "KSh", country: "Kenya" },
    { code: "NGN", name: "Nigerian Naira", symbol: "₦", country: "Nigeria" },
    { code: "ZAR", name: "South African Rand", symbol: "R", country: "South Africa" },
  ];

  const availableCurrencies = currencies.length > 0 ? currencies : defaultCurrencies;

  useEffect(() => {
    if (showConversion && baseAmount > 0 && value !== baseCurrency) {
      const converted = convertCurrency(baseAmount, baseCurrency, value, exchangeRates);
      setConvertedAmount(converted);
    }
  }, [baseAmount, value, baseCurrency, exchangeRates, showConversion]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          {label}
        </label>
      )}
      
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select currency">
            {value && (
              <span className="flex items-center gap-2">
                <span className="font-semibold">
                  {availableCurrencies.find((c) => c.code === value)?.symbol}
                </span>
                <span>{value}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select Currency</SelectLabel>
            {availableCurrencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                <div className="flex items-center justify-between w-full gap-4">
                  <span className="font-semibold">{currency.symbol}</span>
                  <span className="text-sm">{currency.code}</span>
                  <span className="text-xs text-gray-500">{currency.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {showConversion && convertedAmount > 0 && value !== baseCurrency && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
          <TrendingUp className="w-4 h-4" />
          <span>
            {formatCurrency(baseAmount, baseCurrency)} = {formatCurrency(convertedAmount, value)}
          </span>
        </div>
      )}
    </div>
  );
};

export default MultiCurrencySelector;

