import React, { useState } from "react";
import { RefreshCw, TrendingUp, TrendingDown, Clock, DollarSign } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";

const ExchangeRateConversion = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const currencies = [
    {
      id: 1,
      code: "USD",
      symbol: "$",
      name: "US Dollar",
      rate: 1.0,
      lastUpdated: "2025-01-21 10:30:00",
      change: 0,
      isBase: true,
    },
    {
      id: 2,
      code: "GBP",
      symbol: "£",
      name: "British Pound",
      rate: 0.79,
      lastUpdated: "2025-01-21 10:30:00",
      change: -0.5,
      isBase: false,
    },
    {
      id: 3,
      code: "EUR",
      symbol: "€",
      name: "Euro",
      rate: 0.92,
      lastUpdated: "2025-01-21 10:30:00",
      change: 0.3,
      isBase: false,
    },
    {
      id: 4,
      code: "INR",
      symbol: "₹",
      name: "Indian Rupee",
      rate: 83.12,
      lastUpdated: "2025-01-21 10:30:00",
      change: 0.2,
      isBase: false,
    },
    {
      id: 5,
      code: "PKR",
      symbol: "₨",
      name: "Pakistani Rupee",
      rate: 277.85,
      lastUpdated: "2025-01-21 10:30:00",
      change: -0.1,
      isBase: false,
    },
    {
      id: 6,
      code: "ZAR",
      symbol: "R",
      name: "South African Rand",
      rate: 18.65,
      lastUpdated: "2025-01-21 10:30:00",
      change: 0.8,
      isBase: false,
    },
  ];

  const [amount, setAmount] = useState(1000);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("GBP");

  const handleUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 1500);
  };

  const getConvertedAmount = () => {
    const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;
    return ((amount / fromRate) * toRate).toFixed(2);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Real-Time Exchange Rate Conversion</h1>
          <p className="text-gray-600 mt-1">
            Convert currencies with live exchange rates
          </p>
        </div>
        <Button
          onClick={handleUpdate}
          disabled={isUpdating}
          className="flex items-center gap-2 bg-blue-600 text-white disabled:bg-gray-300"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Update Rates
            </>
          )}
        </Button>
      </div>

      {/* Currency Converter */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Currency Converter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount
            </Label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
            />
          </div>

          <div>
            <Label htmlFor="from" className="text-sm font-medium text-gray-700">
              From Currency
            </Label>
            <select
              id="from"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="to" className="text-sm font-medium text-gray-700">
              To Currency
            </Label>
            <select
              id="to"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
            >
              {currencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.code} ({curr.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg text-center">
          <p className="text-gray-600 mb-2">Converted Amount</p>
          <p className="text-4xl font-bold text-blue-600">
            {currencies.find((c) => c.code === toCurrency)?.symbol}
            {getConvertedAmount()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {amount} {fromCurrency} = {getConvertedAmount()} {toCurrency}
          </p>
        </div>
      </Card>

      {/* Exchange Rates Table */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Exchange Rates</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Currency</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Exchange Rate (vs USD)</th>
                <th className="p-3 text-left">24h Change</th>
                <th className="p-3 text-left">Last Updated</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {currencies.map((curr) => (
                <tr key={curr.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{curr.symbol}</span>
                      <span className="font-medium">{curr.name}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-mono font-semibold bg-gray-100 px-2 py-1 rounded">
                      {curr.code}
                    </span>
                  </td>
                  <td className="p-3 text-lg font-bold text-gray-900">{curr.rate}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      {curr.change > 0 ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-green-600 font-semibold">+{curr.change}%</span>
                        </>
                      ) : curr.change < 0 ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-600" />
                          <span className="text-red-600 font-semibold">{curr.change}%</span>
                        </>
                      ) : (
                        <span className="text-gray-600">0%</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {curr.lastUpdated}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        curr.isBase
                          ? "bg-purple-100 text-purple-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {curr.isBase ? "Base Currency" : "Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Conversions */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Conversions (1 USD =)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {currencies
            .filter((c) => !c.isBase)
            .map((curr) => (
              <div key={curr.id} className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200">
                <div className="text-center">
                  <p className="text-2xl mb-1">{curr.symbol}</p>
                  <p className="text-xl font-bold text-gray-900">{curr.rate}</p>
                  <p className="text-sm text-gray-600 mt-1">{curr.code}</p>
                </div>
              </div>
            ))}
        </div>
      </Card>

      {/* Update History */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rate Update History</h2>
        <div className="space-y-2">
          {[
            { time: "2025-01-21 10:30:00", type: "Automatic", changes: 3 },
            { time: "2025-01-21 08:00:00", type: "Automatic", changes: 2 },
            { time: "2025-01-20 16:00:00", type: "Manual", changes: 1 },
          ].map((update, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <span className="font-medium text-gray-900">{update.time}</span>
                  <span className="text-sm text-gray-600 ml-3">
                    {update.changes} rates updated • {update.type}
                  </span>
                </div>
              </div>
              <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <RefreshCw className="w-4 h-4 mr-2" />
          Update All Rates
        </Button>
        <Button className="bg-green-600 text-white">Export Rates</Button>
        <Button className="bg-gray-200 text-gray-700">View Full History</Button>
      </div>
    </div>
  );
};

export default ExchangeRateConversion;

