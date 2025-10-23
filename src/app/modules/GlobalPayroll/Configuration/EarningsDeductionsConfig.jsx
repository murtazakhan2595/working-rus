import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEarningsDeductions } from "state/slices/GlobalPayrollSlice";
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Switch } from "components/ui/switch";
import { Badge } from "components/ui/badge";
import { toast } from "react-toastify";

const EarningsDeductionsConfig = () => {
  const dispatch = useDispatch();
  const { components, earnings, deductions } = useSelector(
    (state) => state.globalPayroll
  );

  const [activeTab, setActiveTab] = useState("earnings");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "earning", // earning or deduction
    category: "",
    country: "",
    calculation_type: "fixed", // fixed, percentage, formula
    amount: 0,
    percentage: 0,
    is_taxable: false,
    is_mandatory: false,
    is_active: true,
    wps_mapping: "",
    description: "",
  });

  useEffect(() => {
    dispatch(fetchEarningsDeductions());
  }, [dispatch]);

  // Mock data - replace with actual data from API
  const mockEarnings = [
    {
      id: 1,
      name: "Basic Salary",
      code: "BASIC",
      category: "Basic",
      country: "UAE",
      calculation_type: "fixed",
      is_taxable: false,
      is_mandatory: true,
      is_active: true,
    },
    {
      id: 2,
      name: "Housing Allowance",
      code: "HRA",
      category: "Allowance",
      country: "UAE",
      calculation_type: "percentage",
      percentage: 30,
      is_taxable: false,
      is_mandatory: false,
      is_active: true,
    },
    {
      id: 3,
      name: "Transport Allowance",
      code: "TRANSPORT",
      category: "Allowance",
      country: "UAE",
      calculation_type: "fixed",
      amount: 1500,
      is_taxable: false,
      is_mandatory: false,
      is_active: true,
    },
    {
      id: 4,
      name: "Medical Allowance",
      code: "MEDICAL",
      category: "Allowance",
      country: "UAE",
      calculation_type: "fixed",
      amount: 1000,
      is_taxable: false,
      is_mandatory: false,
      is_active: true,
    },
    {
      id: 5,
      name: "Overtime",
      code: "OT",
      category: "Variable",
      country: "UAE",
      calculation_type: "formula",
      is_taxable: false,
      is_mandatory: false,
      is_active: true,
    },
  ];

  const mockDeductions = [
    {
      id: 1,
      name: "Pension Fund",
      code: "PF",
      category: "Statutory",
      country: "UAE",
      calculation_type: "percentage",
      percentage: 5,
      is_mandatory: true,
      is_active: true,
    },
    {
      id: 2,
      name: "Income Tax",
      code: "TAX",
      category: "Tax",
      country: "UK",
      calculation_type: "formula",
      is_mandatory: true,
      is_active: true,
    },
    {
      id: 3,
      name: "Loan Deduction",
      code: "LOAN",
      category: "Loan",
      country: "UAE",
      calculation_type: "fixed",
      is_mandatory: false,
      is_active: true,
    },
    {
      id: 4,
      name: "Absence Deduction",
      code: "ABSENCE",
      category: "Absence",
      country: "UAE",
      calculation_type: "formula",
      is_mandatory: false,
      is_active: true,
    },
  ];

  const displayEarnings = earnings.length > 0 ? earnings : mockEarnings;
  const displayDeductions = deductions.length > 0 ? deductions : mockDeductions;

  const handleAddNew = () => {
    setModalMode("add");
    setFormData({
      name: "",
      code: "",
      type: activeTab === "earnings" ? "earning" : "deduction",
      category: "",
      country: "",
      calculation_type: "fixed",
      amount: 0,
      percentage: 0,
      is_taxable: false,
      is_mandatory: false,
      is_active: true,
      wps_mapping: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setModalMode("edit");
    setSelectedItem(item);
    setFormData({ ...item, type: activeTab === "earnings" ? "earning" : "deduction" });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      toast.success(`${item.name} deleted successfully`);
      // Call API to delete
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.code || !formData.country) {
      toast.error("Please fill all required fields");
      return;
    }

    if (modalMode === "add") {
      toast.success(`${formData.name} added successfully`);
    } else {
      toast.success(`${formData.name} updated successfully`);
    }

    setIsModalOpen(false);
    // Call API to save
  };

  const filterItems = (items) => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCountry = countryFilter === "all" || item.country === countryFilter;
      return matchesSearch && matchesCountry;
    });
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Earnings & Deductions Configuration
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configure salary components with country-specific rules
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Component
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search components..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="UAE">UAE</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="Kenya">Kenya</SelectItem>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="earnings" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Earnings ({displayEarnings.length})
          </TabsTrigger>
          <TabsTrigger value="deductions" className="gap-2">
            <TrendingDown className="w-4 h-4" />
            Deductions ({displayDeductions.length})
          </TabsTrigger>
        </TabsList>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filterItems(displayEarnings).map((earning) => (
              <ComponentCard
                key={earning.id}
                item={earning}
                type="earning"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </TabsContent>

        {/* Deductions Tab */}
        <TabsContent value="deductions" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filterItems(displayDeductions).map((deduction) => (
              <ComponentCard
                key={deduction.id}
                item={deduction}
                type="deduction"
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modalMode === "add" ? "Add New" : "Edit"}{" "}
              {formData.type === "earning" ? "Earning" : "Deduction"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Component Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Housing Allowance"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g., HRA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.type === "earning" ? (
                      <>
                        <SelectItem value="Basic">Basic</SelectItem>
                        <SelectItem value="Allowance">Allowance</SelectItem>
                        <SelectItem value="Variable">Variable</SelectItem>
                        <SelectItem value="Bonus">Bonus</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Tax">Tax</SelectItem>
                        <SelectItem value="Statutory">Statutory</SelectItem>
                        <SelectItem value="Loan">Loan</SelectItem>
                        <SelectItem value="Absence">Absence</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UAE">UAE</SelectItem>
                    <SelectItem value="UK">UK</SelectItem>
                    <SelectItem value="Kenya">Kenya</SelectItem>
                    <SelectItem value="Nigeria">Nigeria</SelectItem>
                    <SelectItem value="South Africa">South Africa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="calculation_type">Calculation Type</Label>
                <Select
                  value={formData.calculation_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, calculation_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="formula">Formula</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.calculation_type === "fixed" && (
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: parseFloat(e.target.value) })
                    }
                  />
                </div>
              )}

              {formData.calculation_type === "percentage" && (
                <div className="space-y-2">
                  <Label htmlFor="percentage">Percentage (%)</Label>
                  <Input
                    id="percentage"
                    type="number"
                    value={formData.percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, percentage: parseFloat(e.target.value) })
                    }
                  />
                </div>
              )}

              {formData.country === "UAE" && (
                <div className="space-y-2">
                  <Label htmlFor="wps_mapping">WPS Mapping</Label>
                  <Input
                    id="wps_mapping"
                    value={formData.wps_mapping}
                    onChange={(e) =>
                      setFormData({ ...formData, wps_mapping: e.target.value })
                    }
                    placeholder="WPS field code"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Component description"
              />
            </div>

            {/* Switches */}
            <div className="space-y-3 border-t pt-4">
              {formData.type === "earning" && (
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_taxable">Taxable</Label>
                  <Switch
                    id="is_taxable"
                    checked={formData.is_taxable}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_taxable: checked })
                    }
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="is_mandatory">Mandatory</Label>
                <Switch
                  id="is_mandatory"
                  checked={formData.is_mandatory}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_mandatory: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Component</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Component Card
const ComponentCard = ({ item, type, onEdit, onDelete }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-full ${
                  type === "earning"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {type === "earning" ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">Code: {item.code}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary">{item.category}</Badge>
              <Badge variant="outline">{item.country}</Badge>
              <Badge variant="outline">{item.calculation_type}</Badge>
              {item.is_mandatory && <Badge className="bg-purple-500">Mandatory</Badge>}
              {item.is_taxable && <Badge className="bg-orange-500">Taxable</Badge>}
              {item.is_active ? (
                <Badge className="bg-green-500">Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </div>

            {item.calculation_type === "fixed" && item.amount && (
              <p className="mt-3 text-sm text-gray-600">Amount: AED {item.amount}</p>
            )}
            {item.calculation_type === "percentage" && item.percentage && (
              <p className="mt-3 text-sm text-gray-600">Percentage: {item.percentage}%</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EarningsDeductionsConfig;

