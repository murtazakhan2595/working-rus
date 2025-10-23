import React, { useState } from "react";
import { Plus, Edit, Trash2, Calculator, Globe } from "lucide-react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Badge } from "components/ui/badge";
import { toast } from "react-toastify";

const TaxManagement = () => {
  const [activeTab, setActiveTab] = useState("tax");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("UAE");

  // Mock tax tables
  const taxTables = {
    UAE: { type: "Tax-Free", brackets: [] },
    UK: {
      type: "Progressive",
      brackets: [
        { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
        { min: 12570, max: 50270, rate: 20, name: "Basic Rate" },
        { min: 50270, max: 125140, rate: 40, name: "Higher Rate" },
        { min: 125140, max: null, rate: 45, name: "Additional Rate" },
      ],
    },
    Kenya: {
      type: "Progressive",
      brackets: [
        { min: 0, max: 24000, rate: 10, name: "Band 1" },
        { min: 24000, max: 32333, rate: 25, name: "Band 2" },
        { min: 32333, max: null, rate: 30, name: "Band 3" },
      ],
    },
  };

  // Mock PF rules
  const pfRules = {
    UAE: {
      employee: 5,
      employer: 12.5,
      applicable_to: "UAE Nationals",
      max_salary: null,
    },
    UK: {
      employee: 5,
      employer: 3,
      applicable_to: "All Employees",
      max_salary: null,
    },
    Kenya: {
      employee: 6,
      employer: 6,
      applicable_to: "All Employees",
      max_salary: null,
    },
  };

  // Mock social security
  const socialSecurityRules = {
    UAE: {
      contribution: 0,
      description: "No social security contributions in UAE",
    },
    UK: {
      contribution: 13.8,
      description: "National Insurance - Employer contribution",
    },
    Kenya: {
      contribution: 2,
      description: "NSSF Contribution",
    },
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Tax, PF & Social Security Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage country-specific tax rules and statutory deductions
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Tax Rule
        </Button>
      </div>

      {/* Country Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Globe className="w-5 h-5 text-gray-500" />
            <Label>Country:</Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UAE">UAE</SelectItem>
                <SelectItem value="UK">United Kingdom</SelectItem>
                <SelectItem value="Kenya">Kenya</SelectItem>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
                <SelectItem value="South Africa">South Africa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="tax">Income Tax</TabsTrigger>
          <TabsTrigger value="pf">Pension Fund</TabsTrigger>
          <TabsTrigger value="social">Social Security</TabsTrigger>
        </TabsList>

        {/* Tax Tab */}
        <TabsContent value="tax" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                {selectedCountry} - Tax Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {taxTables[selectedCountry]?.type === "Tax-Free" ? (
                <div className="text-center py-8">
                  <Badge className="bg-green-500 text-lg px-6 py-2">Tax-Free Country</Badge>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    No income tax applicable in {selectedCountry}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary">{taxTables[selectedCountry]?.type} Tax System</Badge>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Bracket
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Min (Annual)
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Max (Annual)
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Rate (%)
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {taxTables[selectedCountry]?.brackets.map((bracket, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                              {bracket.name}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              {bracket.min.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              {bracket.max ? bracket.max.toLocaleString() : "No Limit"}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <Badge
                                className={
                                  bracket.rate === 0
                                    ? "bg-green-500"
                                    : bracket.rate <= 25
                                    ? "bg-blue-500"
                                    : "bg-orange-500"
                                }
                              >
                                {bracket.rate}%
                              </Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PF Tab */}
        <TabsContent value="pf" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{selectedCountry} - Pension Fund Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {pfRules[selectedCountry] ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-2 border-blue-200">
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-lg mb-2">Employee Contribution</h4>
                        <p className="text-3xl font-bold text-blue-600">
                          {pfRules[selectedCountry].employee}%
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Deducted from employee salary
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-purple-200">
                      <CardContent className="p-6">
                        <h4 className="font-semibold text-lg mb-2">Employer Contribution</h4>
                        <p className="text-3xl font-bold text-purple-600">
                          {pfRules[selectedCountry].employer}%
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Additional employer contribution
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Applicable To:</span>
                        <Badge variant="secondary">{pfRules[selectedCountry].applicable_to}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Maximum Salary:</span>
                        <span>
                          {pfRules[selectedCountry].max_salary
                            ? pfRules[selectedCountry].max_salary.toLocaleString()
                            : "No Limit"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Rules
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">
                  No pension fund rules configured for {selectedCountry}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Security Tab */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{selectedCountry} - Social Security Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              {socialSecurityRules[selectedCountry] ? (
                <div className="space-y-6">
                  <Card className="border-2 border-green-200">
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-lg mb-2">Contribution Rate</h4>
                      <p className="text-3xl font-bold text-green-600">
                        {socialSecurityRules[selectedCountry].contribution}%
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {socialSecurityRules[selectedCountry].description}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Configuration
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">
                  No social security rules configured for {selectedCountry}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tax Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Country</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UAE">UAE</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Add more fields */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success("Tax rule added successfully");
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

export default TaxManagement;

