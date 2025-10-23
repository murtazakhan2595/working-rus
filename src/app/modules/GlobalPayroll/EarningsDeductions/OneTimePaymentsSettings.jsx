import React, { useState } from "react";
import { Gift, Plus, Edit2, Trash2, Save, Search } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Switch } from "components/ui/switch";

const OneTimePaymentsSettings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState([
    {
      id: 1,
      name: "Annual Bonus",
      type: "Earning",
      category: "Bonus",
      amount: 0,
      isTaxable: true,
      isRecurring: false,
      effectiveMonth: "December",
      enabled: true,
    },
    {
      id: 2,
      name: "Sales Commission",
      type: "Earning",
      category: "Commission",
      amount: 0,
      isTaxable: true,
      isRecurring: false,
      effectiveMonth: "Any",
      enabled: true,
    },
    {
      id: 3,
      name: "Festival Bonus",
      type: "Earning",
      category: "Bonus",
      amount: 5000,
      isTaxable: false,
      isRecurring: false,
      effectiveMonth: "Any",
      enabled: true,
    },
    {
      id: 4,
      name: "Loan Recovery",
      type: "Deduction",
      category: "Loan",
      amount: 0,
      isTaxable: false,
      isRecurring: false,
      effectiveMonth: "Any",
      enabled: true,
    },
    {
      id: 5,
      name: "Advance Salary Recovery",
      type: "Deduction",
      category: "Advance",
      amount: 0,
      isTaxable: false,
      isRecurring: false,
      effectiveMonth: "Any",
      enabled: true,
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentPayment, setCurrentPayment] = useState({
    name: "",
    type: "Earning",
    category: "Bonus",
    amount: 0,
    isTaxable: true,
    isRecurring: false,
    effectiveMonth: "Any",
    enabled: true,
  });

  const handleSave = () => {
    if (currentPayment.id) {
      setPayments(
        payments.map((p) => (p.id === currentPayment.id ? currentPayment : p))
      );
    } else {
      setPayments([...payments, { ...currentPayment, id: Date.now() }]);
    }
    setIsEditing(false);
    setCurrentPayment({
      name: "",
      type: "Earning",
      category: "Bonus",
      amount: 0,
      isTaxable: true,
      isRecurring: false,
      effectiveMonth: "Any",
      enabled: true,
    });
  };

  const handleEdit = (payment) => {
    setCurrentPayment(payment);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this one-time payment?")) {
      setPayments(payments.filter((p) => p.id !== id));
    }
  };

  const handleToggle = (id) => {
    setPayments(payments.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">One-Time Payments</h1>
          <p className="text-gray-600 mt-1">
            Configure one-time earnings or deductions like bonus, commission, etc.
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" />
          Add One-Time Payment
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Payments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPayments.map((payment) => (
          <Card
            key={payment.id}
            className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Gift className={`w-5 h-5 ${payment.type === "Earning" ? "text-green-600" : "text-red-600"}`} />
                <h3 className="text-lg font-semibold text-gray-900">{payment.name}</h3>
              </div>
              <Switch checked={payment.enabled} onCheckedChange={() => handleToggle(payment.id)} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.type === "Earning"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {payment.type}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  {payment.category}
                </span>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Default Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payment.amount > 0 ? `₹${payment.amount.toLocaleString()}` : "Variable"}
                </p>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Effective Month:</span>
                <span className="ml-2 font-medium text-gray-900">{payment.effectiveMonth}</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-3 border-t">
                {payment.isTaxable && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Taxable
                  </span>
                )}
                {!payment.isRecurring && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                    One-Time
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {payment.enabled ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button
                onClick={() => handleEdit(payment)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(payment.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {currentPayment.id ? "Edit One-Time Payment" : "Add New One-Time Payment"}
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Payment Name
                </Label>
                <input
                  id="name"
                  type="text"
                  value={currentPayment.name}
                  onChange={(e) => setCurrentPayment({ ...currentPayment, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="e.g., Diwali Bonus"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                  Payment Type
                </Label>
                <select
                  id="type"
                  value={currentPayment.type}
                  onChange={(e) => setCurrentPayment({ ...currentPayment, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="Earning">Earning</option>
                  <option value="Deduction">Deduction</option>
                </select>
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category
                </Label>
                <select
                  id="category"
                  value={currentPayment.category}
                  onChange={(e) =>
                    setCurrentPayment({ ...currentPayment, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  {currentPayment.type === "Earning" ? (
                    <>
                      <option value="Bonus">Bonus</option>
                      <option value="Commission">Commission</option>
                      <option value="Incentive">Incentive</option>
                      <option value="Reimbursement">Reimbursement</option>
                      <option value="Other">Other</option>
                    </>
                  ) : (
                    <>
                      <option value="Loan">Loan Recovery</option>
                      <option value="Advance">Advance Recovery</option>
                      <option value="Fine">Fine/Penalty</option>
                      <option value="Adjustment">Adjustment</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                  Default Amount
                </Label>
                <input
                  id="amount"
                  type="number"
                  value={currentPayment.amount}
                  onChange={(e) =>
                    setCurrentPayment({ ...currentPayment, amount: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                  placeholder="0 for variable amount"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 if amount varies per employee
                </p>
              </div>

              <div>
                <Label htmlFor="effectiveMonth" className="text-sm font-medium text-gray-700">
                  Effective Month
                </Label>
                <select
                  id="effectiveMonth"
                  value={currentPayment.effectiveMonth}
                  onChange={(e) =>
                    setCurrentPayment({ ...currentPayment, effectiveMonth: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
                >
                  <option value="Any">Any Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
              </div>

              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Taxable</Label>
                  <Switch
                    checked={currentPayment.isTaxable}
                    onCheckedChange={(checked) =>
                      setCurrentPayment({ ...currentPayment, isTaxable: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">Enable</Label>
                  <Switch
                    checked={currentPayment.enabled}
                    onCheckedChange={(checked) =>
                      setCurrentPayment({ ...currentPayment, enabled: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setCurrentPayment({
                    name: "",
                    type: "Earning",
                    category: "Bonus",
                    amount: 0,
                    isTaxable: true,
                    isRecurring: false,
                    effectiveMonth: "Any",
                    enabled: true,
                  });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!currentPayment.name}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Payment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OneTimePaymentsSettings;

