import React, { useState } from "react";
import { Plus, Eye, Check, X, Download } from "lucide-react";
import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { Badge } from "components/ui/badge";
import PayrollStatusBadge from "../components/PayrollStatusBadge";
import { formatCurrency } from "utils/payrollUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";

const ClaimsReimbursements = () => {
  const [activeTab, setActiveTab] = useState("all");

  const mockClaims = [
    {
      id: 1,
      employee_name: "John Doe",
      employee_id: "E001",
      type: "Travel",
      amount: 2500,
      currency: "AED",
      date: "2024-12-20",
      status: "pending",
      description: "Business trip to Dubai",
    },
    {
      id: 2,
      employee_name: "Jane Smith",
      employee_id: "E002",
      type: "Medical",
      amount: 1500,
      currency: "AED",
      date: "2024-12-18",
      status: "approved",
      description: "Medical checkup expenses",
    },
    {
      id: 3,
      employee_name: "Ahmed Ali",
      employee_id: "E003",
      type: "Meal",
      amount: 500,
      currency: "AED",
      date: "2024-12-15",
      status: "rejected",
      description: "Client meeting meal expenses",
    },
  ];

  const filterClaims = (status) => {
    if (status === "all") return mockClaims;
    return mockClaims.filter((claim) => claim.status === status);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Employee Claims & Reimbursements
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage employee claims and post to payroll
          </p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export Claims
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Claims</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4">
            {filterClaims(activeTab).map((claim) => (
              <Card key={claim.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{claim.employee_name}</h3>
                        <Badge variant="secondary">{claim.employee_id}</Badge>
                        <Badge>{claim.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{claim.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Date: {claim.date}</span>
                        <span className="font-semibold text-lg">
                          {formatCurrency(claim.amount, claim.currency)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <PayrollStatusBadge status={claim.status} />
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      {claim.status === "pending" && (
                        <>
                          <Button size="sm" className="gap-2 bg-green-600">
                            <Check className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-2">
                            <X className="w-4 h-4" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClaimsReimbursements;

