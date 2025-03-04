import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { toast } from "react-toastify";
import { getDocumentChecklist } from "app/hooks/employee";
import { CheckCircle, Circle } from "lucide-react";

const ReadOnlyOnboardingChecklist = ({ employeeId }) => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [checklistData, setChecklistData] = useState(null);

  // Fetch existing checklist data
  useEffect(() => {
    const fetchChecklistData = async () => {
      setIsDataLoading(true);
      try {
        const response = await getDocumentChecklist(employeeId);

        if (response && response.results && response.results.length > 0) {
          setChecklistData(response.results[0]);
        } else {
          setChecklistData(null);
        }
      } catch (error) {
        console.error("Error fetching checklist data:", error);
        toast.error("Failed to load checklist data", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setChecklistData(null);
      } finally {
        setIsDataLoading(false);
      }
    };

    if (employeeId) {
      fetchChecklistData();
    }
  }, [employeeId]);

  // Define the checklist items
  const checklistItems = [
    { key: "is_resume", label: "Resume" },
    { key: "is_signed_offer_letter", label: "Signed Offer Letter" },
    { key: "is_educational_documents", label: "Educational Documents" },
    { key: "is_professional_certificates", label: "Professional Certificate" },
    { key: "is_picture", label: "Picture with White Background" },
    { key: "is_id_card", label: "Country Residency ID Card" },
    { key: "is_passport_copy", label: "Passport Copy" },
    { key: "is_visa_copy", label: "Visa Page Copy" },
    { key: "is_leave_application", label: "Leave Applications" },
    { key: "is_increment_letter", label: "Increment Letters" },
    { key: "is_confirmation_letter", label: "Confirmation Letters" },
    { key: "is_others", label: "Others" },
  ];

  // If data is still loading, show a loading state
  if (isDataLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            Onboarding Documents Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If no checklist data is available
  if (!checklistData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            Onboarding Documents Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-gray-500">
            No onboarding checklist data available for this employee.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">
          Onboarding Documents Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full grid-cols-1 gap-4">
          {checklistItems.map(
            (item) =>
              checklistData[item.key] && (
                <div
                  key={item.key}
                  className="flex items-center p-3 border rounded-md"
                >
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  <span className="text-gray-900">{item.label}</span>
                </div>
              )
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadOnlyOnboardingChecklist;
