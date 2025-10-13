import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";
import TableCustom from "components/CustomTable";
import { SelectInputComponent } from "components/FormControl";
import {
  GraduationCap,
  CheckCircle,
  Clock,
  AlertTriangle,
  Scale,
  Eye,
} from "lucide-react";
import { mandatoryTrainingColumns, mandatoryTrainingData } from "./dummyData";

const MandatoryTraining = () => {
  // Mandatory Training filter states
  const [trainingFilters, setTrainingFilters] = useState({
    branch: "All Branches",
    department: "All Departments",
    trainingProgram: "All Programs",
    frequency: "All Frequencies",
    status: "All Statuses",
  });

  // Handle mandatory training filter changes
  const handleTrainingFilterChange = (filterType, value) => {
    setTrainingFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Filter mandatory training data
  const getFilteredTrainingData = () => {
    let filtered = [...mandatoryTrainingData];

    // Filter by branch
    if (trainingFilters.branch !== "All Branches") {
      filtered = filtered.filter(
        (item) => item.branch === trainingFilters.branch
      );
    }

    // Filter by department (using designation as department)
    if (trainingFilters.department !== "All Departments") {
      filtered = filtered.filter(
        (item) => item.designation === trainingFilters.department
      );
    }

    // Filter by training program
    if (trainingFilters.trainingProgram !== "All Programs") {
      filtered = filtered.filter(
        (item) => item.trainingProgramName === trainingFilters.trainingProgram
      );
    }

    // Filter by frequency
    if (trainingFilters.frequency !== "All Frequencies") {
      filtered = filtered.filter(
        (item) => item.frequency === trainingFilters.frequency
      );
    }

    // Filter by status
    if (trainingFilters.status !== "All Statuses") {
      filtered = filtered.filter(
        (item) => item.status === trainingFilters.status
      );
    }

    return filtered;
  };

  return (
    <div>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-black">
              Total Assigned Trainings
            </h3>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">8</p>
            <div className="flex items-center text-sm">
              <span className="text-gray-700">
                All mandatory trainings assigned
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-black">
              Completed Trainings
            </h3>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">3</p>
            <div className="flex items-center text-sm">
              <span className="text-green-500 font-medium">
                Successfully completed
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-black">
              In Progress Trainings
            </h3>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">3</p>
            <div className="flex items-center text-sm">
              <span className="text-blue-500 font-medium">
                Currently being completed
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-black">
              Pending / Overdue Trainings
            </h3>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">2</p>
            <div className="flex items-center text-sm">
              <span className="text-orange-500 font-medium">
                Due or not started
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-black">Compliance %</h3>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-black">37.5%</p>
            <div className="flex items-center text-sm">
              <span className="text-purple-500 font-medium">
                Training completion rate
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <SelectInputComponent
              name="branch"
              label="Branch"
              value={trainingFilters.branch}
              onChange={handleTrainingFilterChange}
              options={[
                { label: "All Branches", value: "All Branches" },
                {
                  label: "Dubai Mall Pharmacy",
                  value: "Dubai Mall Pharmacy",
                },
                {
                  label: "Abu Dhabi Marina Pharmacy",
                  value: "Abu Dhabi Marina Pharmacy",
                },
                {
                  label: "Sharjah City Center Pharmacy",
                  value: "Sharjah City Center Pharmacy",
                },
                {
                  label: "Dubai Healthcare City Pharmacy",
                  value: "Dubai Healthcare City Pharmacy",
                },
                { label: "Al Ain Pharmacy", value: "Al Ain Pharmacy" },
              ]}
              className="w-48"
            />
          </div>
          <div>
            <SelectInputComponent
              name="department"
              label="Department"
              value={trainingFilters.department}
              onChange={handleTrainingFilterChange}
              options={[
                { label: "All Departments", value: "All Departments" },
                { label: "Pharmacist", value: "Pharmacist" },
                {
                  label: "Pharmacy Technician",
                  value: "Pharmacy Technician",
                },
                { label: "Manager", value: "Manager" },
                { label: "Supervisor", value: "Supervisor" },
                { label: "Cashier", value: "Cashier" },
              ]}
              className="w-48"
            />
          </div>
          <div>
            <SelectInputComponent
              name="trainingProgram"
              label="Training Program"
              value={trainingFilters.trainingProgram}
              onChange={handleTrainingFilterChange}
              options={[
                { label: "All Programs", value: "All Programs" },
                {
                  label: "UAE Labor Law Compliance",
                  value: "UAE Labor Law Compliance",
                },
                {
                  label: "Workplace Safety & Health",
                  value: "Workplace Safety & Health",
                },
                {
                  label: "UAE Pharmacy Regulations",
                  value: "UAE Pharmacy Regulations",
                },
                {
                  label: "Fire Safety & Emergency Response",
                  value: "Fire Safety & Emergency Response",
                },
                {
                  label: "Data Privacy & GDPR Compliance",
                  value: "Data Privacy & GDPR Compliance",
                },
                {
                  label: "Patient Counseling Excellence",
                  value: "Patient Counseling Excellence",
                },
              ]}
              className="w-48"
            />
          </div>
          <div>
            <SelectInputComponent
              name="frequency"
              label="Frequency"
              value={trainingFilters.frequency}
              onChange={handleTrainingFilterChange}
              options={[
                { label: "All Frequencies", value: "All Frequencies" },
                { label: "Monthly", value: "Monthly" },
                { label: "Quarterly", value: "Quarterly" },
                { label: "Annual", value: "Annual" },
              ]}
              className="w-48"
            />
          </div>
          <div>
            <SelectInputComponent
              name="status"
              label="Status"
              value={trainingFilters.status}
              onChange={handleTrainingFilterChange}
              options={[
                { label: "All Statuses", value: "All Statuses" },
                { label: "Pending", value: "Pending" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
              ]}
              className="w-48"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="successOutline" className="flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Mandatory Training Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mandatory Training Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <TableCustom
            columns={mandatoryTrainingColumns}
            data={getFilteredTrainingData()}
            pagination={true}
            dataTotalSize={getFilteredTrainingData().length}
            tableOptions={{ page: 1, sizePerPage: 10 }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MandatoryTraining;
