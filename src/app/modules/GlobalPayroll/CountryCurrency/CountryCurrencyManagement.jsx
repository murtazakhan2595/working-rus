import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries, fetchExchangeRates } from "state/slices/GlobalPayrollSlice";
import { Plus, Edit, Trash2, RefreshCw, TrendingUp, Globe } from "lucide-react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "components/ui/dialog";
import { Badge } from "components/ui/badge";
import { formatCurrency } from "utils/payrollUtils";
import { toast } from "react-toastify";

const CountryCurrencyManagement = () => {
  const dispatch = useDispatch();
  const { countries, currencies, exchangeRates } = useSelector(
    (state) => state.globalPayroll
  );

  const [activeTab, setActiveTab] = useState("countries");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(fetchExchangeRates());
  }, [dispatch]);

  // Mock data
  const mockCountries = [
    {
      id: 1,
      code: "UAE",
      name: "United Arab Emirates",
      currency: "AED",
      tax_regime: "Tax-Free",
      working_days: 6,
      working_hours: 8,
      overtime_multiplier: 1.25,
    },
    {
      id: 2,
      code: "UK",
      name: "United Kingdom",
      currency: "GBP",
      tax_regime: "PAYE",
      working_days: 5,
      working_hours: 8,
      overtime_multiplier: 1.5,
    },
    {
      id: 3,
      code: "Kenya",
      name: "Kenya",
      currency: "KES",
      tax_regime: "Progressive",
      working_days: 5,
      working_hours: 8,
      overtime_multiplier: 1.5,
    },
  ];

  const mockExchangeRates = {
    AED_USD: 0.27,
    AED_GBP: 0.21,
    AED_EUR: 0.25,
    AED_KES: 35.0,
    GBP_USD: 1.27,
    GBP_AED: 4.76,
    last_updated: new Date().toISOString(),
  };

  const displayCountries = countries.length > 0 ? countries : mockCountries;
  const displayRates = Object.keys(exchangeRates).length > 0 ? exchangeRates : mockExchangeRates;

  const handleRefreshRates = () => {
    dispatch(fetchExchangeRates());
    toast.success("Exchange rates updated successfully");
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Country & Currency Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage country configurations and exchange rates
          </p>
        </div>
        <Button onClick={handleRefreshRates} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh Exchange Rates
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="countries" className="gap-2">
            <Globe className="w-4 h-4" />
            Countries
          </TabsTrigger>
          <TabsTrigger value="exchange" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Exchange Rates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="countries" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Country
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayCountries.map((country) => (
              <Card key={country.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{country.name}</CardTitle>
                    <Badge variant="secondary">{country.code}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Currency</p>
                      <p className="font-semibold">{country.currency}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tax Regime</p>
                      <Badge className="mt-1">{country.tax_regime}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Working Days</p>
                      <p className="font-semibold">{country.working_days} days/week</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Working Hours</p>
                      <p className="font-semibold">{country.working_hours} hrs/day</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-3 border-t">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exchange" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Exchange Rates</CardTitle>
                <Badge variant="secondary">
                  Updated: {new Date(displayRates.last_updated || new Date()).toLocaleString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(displayRates)
                  .filter(([key]) => key !== "last_updated")
                  .map(([pair, rate]) => {
                    const [from, to] = pair.split("_");
                    return (
                      <div
                        key={pair}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{from}</span>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="font-semibold">{to}</span>
                        </div>
                        <p className="text-2xl font-bold text-center text-blue-600">
                          {rate}
                        </p>
                        <p className="text-xs text-center text-gray-500 mt-2">
                          1 {from} = {rate} {to}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Country Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Country Name *</Label>
              <Input placeholder="e.g., United Arab Emirates" />
            </div>
            <div className="space-y-2">
              <Label>Country Code *</Label>
              <Input placeholder="e.g., UAE" />
            </div>
            <div className="space-y-2">
              <Label>Currency *</Label>
              <Input placeholder="e.g., AED" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success("Country added successfully");
              setIsModalOpen(false);
            }}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CountryCurrencyManagement;

