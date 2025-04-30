import React, { useState, useEffect, useMemo } from "react";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";
import { InfoIcon, AlertCircle, CheckCircle, User } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import { getEmployeeData } from "app/hooks/employee";

const ProfileCompletenessWidget = () => {
  const [employeeData, setEmployeeData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get user profile from Redux store
  const userProfile = useSelector((state) => state.user.userProfile);
  const userId = userProfile?.id;

  // Fetch employee data
  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const empData = await getEmployeeData(userId);
      setEmployeeData(empData);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [userId]);

  // Fields to check for completion
  const requiredFields = [
    // Personal info
    { key: "first_name", category: "Personal Information" },
    { key: "last_name", category: "Personal Information" },
    { key: "date_of_birth", category: "Personal Information" },
    { key: "marital_status", category: "Personal Information" },
    { key: "nationality", category: "Personal Information" },
    { key: "gender", category: "Personal Information" },
    { key: "blood_group", category: "Personal Information" },
    { key: "father_name", category: "Personal Information" },
    { key: "mother_name", category: "Personal Information" },
    { key: "nic", category: "Personal Information" },

    // Contact info
    { key: "mobile_no", category: "Contact Information" },
    { key: "other_email", category: "Contact Information" },
    { key: "work_email", category: "Contact Information" },
    { key: "current_address", category: "Contact Information" },
    { key: "residential_address", category: "Contact Information" },

    // Emergency contact
    { key: "emergency_phone_no", category: "Emergency Contact" },
    { key: "emergency_first_name", category: "Emergency Contact" },
    { key: "emergency_last_name", category: "Emergency Contact" },
    { key: "emergency_relation", category: "Emergency Contact" },

    // Job info
    { key: "department_name", category: "Job Information" },
    { key: "department_position", category: "Job Information" },
    { key: "employee_status", category: "Job Information" },
    { key: "joining_date", category: "Job Information" },
    { key: "employee_type", category: "Job Information" },
    { key: "employee_work_type", category: "Job Information" },

    // Bank info
    { key: "bank_name", category: "Bank Information" },
    { key: "account_title", category: "Bank Information" },
    { key: "account_number", category: "Bank Information" },
  ];

  // Calculate completion percentage and missing fields
  const { completionPercentage, missingFields, completedFields } =
    useMemo(() => {
      // Count completed fields
      let completed = 0;
      const missing = [];

      requiredFields.forEach((field) => {
        if (
          employeeData[field.key] &&
          employeeData[field.key] !== "" &&
          employeeData[field.key] !== null
        ) {
          completed++;
        } else {
          missing.push(field);
        }
      });

      const percentage = Math.round((completed / requiredFields.length) * 100);

      return {
        completionPercentage: percentage,
        missingFields: missing,
        completedFields: completed,
      };
    }, [employeeData]);

  // Handle button click
  const handleCompleteProfile = () => {
    navigate("/my-profile"); // Navigate to profile page
  };

  // Circle progress calculation
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - completionPercentage / 100);

  // Group missing fields by category
  const missingByCategory = useMemo(() => {
    const grouped = {};

    missingFields.forEach((field) => {
      if (!grouped[field.category]) {
        grouped[field.category] = [];
      }
      grouped[field.category].push(field.key.replace(/_/g, " "));
    });

    return grouped;
  }, [missingFields]);

  return (
    <section className="bg-white rounded-md shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-base font-semibold text-plum-1100 xl:text-2xl lg:text-xl md:text-lg">
          Profile Completeness
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="w-5 h-5 text-slate-900 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div>
                <p className="mb-2 font-medium">Missing information:</p>
                {Object.keys(missingByCategory).length > 0 ? (
                  Object.entries(missingByCategory).map(
                    ([category, fields]) => (
                      <div key={category} className="mb-2">
                        <p className="text-sm font-medium">{category}:</p>
                        <ul className="pl-4 text-xs list-disc">
                          {fields.map((field, i) => (
                            <li key={i}>{field}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-plum-1100">Profile is complete!</p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="text-slate-500">Loading profile data...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Circular Progress */}
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={
                  completionPercentage < 50
                    ? "#EF4444"
                    : completionPercentage < 80
                    ? "#FBBF24"
                    : "#059669 "
                }
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-2xl font-bold ${
                  completionPercentage < 50
                    ? "text-red-500"
                    : completionPercentage < 80
                    ? "text-yellow-500"
                    : "text-emerald-600"
                }`}
              >
                {completionPercentage}%
              </span>
              <span className="text-xs text-slate-1200">Complete</span>
            </div>
          </div>

          {/* Status Icon */}
          <div className="mb-3">
            {completionPercentage < 50 ? (
              <AlertCircle className="w-6 h-6 text-red-500" />
            ) : completionPercentage < 100 ? (
              <User className="w-6 h-6 text-yellow-500" />
            ) : (
              <CheckCircle className="w-6 h-6 text-green-500" />
            )}
          </div>

          {/* Stats */}
          <div className="text-sm text-slate-1200 mb-5">
            <span>
              {completedFields}/{requiredFields.length} fields completed
            </span>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleCompleteProfile}
            disabled={completionPercentage === 100}
          >
            {completionPercentage === 100
              ? "Profile Complete"
              : "Complete Profile"}
          </Button>
        </div>
      )}
    </section>
  );
};

export default ProfileCompletenessWidget;
