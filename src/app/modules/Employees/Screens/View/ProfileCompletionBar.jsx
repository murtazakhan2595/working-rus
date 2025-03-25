import React, { useMemo } from "react";
import { Progress } from "src/@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

const ProfileCompletionBar = ({ employeeData }) => {
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

  // Determine color based on completion percentage
  const getColorClass = () => {
    if (completionPercentage < 50) return "#EF4444"; // red-500 hex equivalent
    if (completionPercentage < 80) return "#EAB308"; // yellow-500 hex equivalent
    return "#22C55E"; // green-500 hex equivalent
  };

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
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h3 className="text-sm font-medium">Profile Completion</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="w-4 h-4 ml-2 " />
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
                    <p className="text-sm text-green-500">
                      Profile is complete!
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-sm font-medium">
          {completedFields}/{requiredFields.length} ({completionPercentage}%)
        </span>
      </div>
      <Progress
        value={completionPercentage}
        className="h-2"
        indicatorClassName={getColorClass()}
      />
    </div>
  );
};

export default ProfileCompletionBar;
