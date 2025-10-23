import React, { useState } from "react";
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const PayrollProcessingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, title: "Period Selection", description: "Select payroll period" },
    { id: 2, title: "Employee Selection", description: "Choose employees" },
    { id: 3, title: "Computation", description: "Calculate payroll" },
    { id: 4, title: "Review", description: "Review calculations" },
    { id: 5, title: "Validation", description: "Validate data" },
    { id: 6, title: "Approval", description: "Get approval" },
    { id: 7, title: "Finalize", description: "Complete payroll" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Multi-Step Payroll Processing Wizard</h1>
        <p className="text-gray-600 mt-1">
          Complete your payroll processing in 7 easy steps
        </p>
      </div>

      {/* Progress Stepper */}
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => handleStepClick(step.id)}
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    step.id < currentStep
                      ? "bg-green-600 border-green-600"
                      : step.id === currentStep
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        step.id === currentStep ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      step.id <= currentStep ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    step.id < currentStep ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <Card className="p-8 bg-white">
        <div className="min-h-[400px]">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Step {currentStep}: {steps[currentStep - 1].title}
          </h2>

          {/* Dynamic Step Content */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-gray-600">Select the payroll period for processing.</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border-2 border-blue-600 rounded-lg bg-blue-50">
                  <h3 className="font-semibold">Monthly</h3>
                  <p className="text-sm text-gray-600">January 2025</p>
                </div>
                <div className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 cursor-pointer">
                  <h3 className="font-semibold">Weekly</h3>
                  <p className="text-sm text-gray-600">Week 1-4, Jan 2025</p>
                </div>
                <div className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-600 cursor-pointer">
                  <h3 className="font-semibold">Custom</h3>
                  <p className="text-sm text-gray-600">Select custom dates</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-gray-600">Select employees to include in this payroll run.</p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold">Total Employees: 245</p>
                  <Button className="bg-blue-600 text-white">Select All</Button>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded">
                      <input type="checkbox" checked className="w-4 h-4" readOnly />
                      <span>Employee {i}</span>
                      <span className="ml-auto text-gray-600">Department {i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-gray-600">Computing payroll with real-time calculations...</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Computation Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">$125,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Deductions</p>
                    <p className="text-2xl font-bold text-red-600">$25,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Net Payable</p>
                    <p className="text-2xl font-bold text-blue-600">$100,000</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Currency</p>
                    <p className="text-2xl font-bold text-gray-900">USD</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <p className="text-gray-600">Review payroll calculations before proceeding.</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Employee</th>
                      <th className="p-3 text-left">Gross</th>
                      <th className="p-3 text-left">Deductions</th>
                      <th className="p-3 text-left">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="border-b">
                        <td className="p-3">Employee {i}</td>
                        <td className="p-3">$5,000</td>
                        <td className="p-3">$1,000</td>
                        <td className="p-3 font-bold">$4,000</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-gray-600">Validating payroll data and detecting anomalies...</p>
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800">All validations passed successfully</span>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-semibold mb-2">AI Anomaly Detection</p>
                  <p className="text-sm text-gray-600">No anomalies detected in payroll data</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-4">
              <p className="text-gray-600">Submit payroll for approval.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Approval Required</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This payroll requires approval from Finance Manager
                </p>
                <div className="flex gap-3">
                  <Button className="bg-green-600 text-white">Submit for Approval</Button>
                  <Button className="bg-gray-200 text-gray-700">Save as Draft</Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-4">
              <p className="text-gray-600">Finalize and complete the payroll processing.</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-center font-bold text-xl mb-2">Ready to Finalize</h3>
                <p className="text-center text-gray-600 mb-4">
                  All checks completed. Click below to finalize payroll.
                </p>
                <div className="flex justify-center">
                  <Button className="bg-green-600 text-white">Finalize Payroll</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === steps.length}
            className="flex items-center gap-2 bg-blue-600 text-white disabled:opacity-50"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PayrollProcessingWizard;

