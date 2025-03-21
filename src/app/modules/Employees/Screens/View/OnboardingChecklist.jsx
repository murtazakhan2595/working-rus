import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { toast } from "react-toastify";
import { getEmployeeDocsChecklist } from "app/hooks/employee";
import { getOnboardingDocument } from "app/hooks/officeSetting";
import { CheckCircle, AlertCircle } from "lucide-react";
import AttachmentUI from "components/ui/AttachmentUI";

const ReadOnlyOnboardingChecklist = ({ employeeId }) => {
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [checklistData, setChecklistData] = useState([]);
  const [onboardingDocs, setOnboardingDocs] = useState([]);

  // Fetch existing checklist data
  useEffect(() => {
    const fetchChecklistData = async () => {
      setIsDataLoading(true);
      try {
        const response = await getEmployeeDocsChecklist({
          filterData: { employee_id: employeeId },
        });

        // Fetch onboarding document types
        const onboardingDocs = await getOnboardingDocument();
        if (onboardingDocs?.results) {
          setOnboardingDocs(onboardingDocs.results);
        } else {
          toast.error("Failed to load onboarding documents", {
            position: toast.POSITION.TOP_RIGHT,
          });
        }

        if (response && response.results && response.results.length > 0) {
          // Filter for active documents
          const activeDocuments = response.results.filter(
            (item) => item.is_Active === true
          );
          setChecklistData(activeDocuments);
        } else {
          setChecklistData([]);
        }
      } catch (error) {
        console.error("Error fetching checklist data:", error);
        toast.error("Failed to load checklist data", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setChecklistData([]);
      } finally {
        setIsDataLoading(false);
      }
    };

    if (employeeId) {
      fetchChecklistData();
    }
  }, [employeeId]);

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
  if (checklistData.length === 0) {
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

  // Check if a document has an upcoming expiry date
  const hasUpcomingExpiry = (doc) => {
    if (!doc || !doc.has_expiry_date || !doc.expiry_date) return false;

    const expiryDate = new Date(doc.expiry_date);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return expiryDate <= thirtyDaysFromNow;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">
          Onboarding Documents Checklist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full grid-cols-1 gap-4">
          {checklistData.map((document) => {
            const docDetails = onboardingDocs.find(
              (doc) => doc.id === document.checklist_id
            );
            const documentName =
              docDetails?.name || `Document ${document.checklist_id}`;
            const isExpiring = hasUpcomingExpiry(document);

            return (
              <div
                key={document.id}
                className="flex items-center justify-between px-3 py-1 border rounded-md"
              >
                {/* Left side: document name with icon */}
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  <span className="text-gray-900">{documentName}</span>
                </div>

                {/* Right side: attachment and expiry date */}
                <div className="flex items-center gap-x-3">
                  {/* Show expiry date if applicable */}
                  {document.has_expiry_date && document.expiry_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      {isExpiring && (
                        <AlertCircle
                          className="w-4 h-4 mr-1 text-amber-500"
                          title={`Expires on ${document.expiry_date}`}
                        />
                      )}
                      <span>
                        Expires:{" "}
                        {new Date(document.expiry_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* Show attachment if available */}
                  {document.attachment && (
                    <div className="flex-shrink-0">
                      <AttachmentUI
                        attachment={document.attachment}
                        name={documentName}
                        viewOnly={true}
                        displayImageAttachment={true}
                        removeFile={() => {}}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadOnlyOnboardingChecklist;
