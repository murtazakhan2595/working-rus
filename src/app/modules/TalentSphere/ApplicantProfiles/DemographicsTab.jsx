import React, { useState, useEffect } from "react";
import { PageLoader } from "components";
import {
  getDemographicResponsesByApplicant,
  getDemographicFormById,
} from "app/hooks/talentSphere";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { FileText } from "lucide-react";
import { renderDate } from "utils/renderValues";
import AttachmentUI from "components/ui/AttachmentUI";

const DemographicsTab = ({ applicantId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [demographicData, setDemographicData] = useState(null);
  const [formStructure, setFormStructure] = useState(null);

  useEffect(() => {
    const fetchDemographicData = async () => {
      setIsLoading(true);
      try {
        const response = await getDemographicResponsesByApplicant(applicantId);

        if (response && response.results && response.results.length > 0) {
          const responseData = response.results[0];
          setDemographicData(responseData);

          const formData = await getDemographicFormById(responseData.form);
          if (formData) {
            setFormStructure(formData);
          }
        }
      } catch (error) {
        console.error("Error fetching demographic data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (applicantId) {
      fetchDemographicData();
    }
  }, [applicantId]);

  const getFieldDetails = (fieldId) => {
    if (!formStructure || !formStructure.sections) return null;

    for (const section of formStructure.sections) {
      const field = section.fields?.find((f) => f.id === fieldId);
      if (field) {
        return {
          label: field.label,
          fieldType: field.field_type,
          section: section.heading,
        };
      }
    }
    return null;
  };

  const formatValue = (value, fieldType) => {
    if (!value) return "N/A";

    switch (fieldType) {
      case "date":
        return renderDate(value, "N/A", "date");
      case "toggle":
        return value === "true" ? "Yes" : "No";
      case "checkbox":
        return value.split(",").join(", ");
      default:
        return value;
    }
  };

  const groupAnswersBySection = () => {
    if (!demographicData || !formStructure) return {};

    const grouped = {};

    demographicData.answers.forEach((answer) => {
      const fieldDetails = getFieldDetails(answer.field);
      if (fieldDetails) {
        const sectionName = fieldDetails.section || "Other Information";

        if (!grouped[sectionName]) {
          grouped[sectionName] = [];
        }

        grouped[sectionName].push({
          label: fieldDetails.label,
          value: formatValue(answer.value, fieldDetails.fieldType),
          attachment: answer.attachment,
          fieldType: fieldDetails.fieldType,
        });
      }
    });

    return grouped;
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (!demographicData) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No Demographics Data
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This applicant hasn't submitted any demographic information yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const groupedAnswers = groupAnswersBySection();

  return (
    <div className="space-y-6">
      {/* Header Card - matching Applicant Info style */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-neutral-1200">
                {formStructure?.name || "Demographics form"}
              </CardTitle>
              {formStructure?.description && (
                <p className="text-sm text-neutral-1000 mt-1">
                  {formStructure.description}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-neutral-800">Submitted on</p>
              <p className="text-sm font-medium text-neutral-1200">
                {renderDate(demographicData.submitted_at, "N/A", "date-time")}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Answers grouped by section - matching Applicant Info grid style */}
      {Object.entries(groupedAnswers).map(([sectionName, answers]) => (
        <Card key={sectionName}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{sectionName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {answers.map((answer, index) => (
                <div key={index} className="space-y-1">
                  <dt className="text-sm font-medium text-neutral-900">
                    {answer.label}
                  </dt>
                  <dd className="text-sm text-neutral-1200">
                    {answer.fieldType === "file" ? (
                      answer.attachment ? (
                        <AttachmentUI
                          attachment={answer.attachment}
                          name={answer.label}
                          viewOnly={true}
                        />
                      ) : (
                        "No file"
                      )
                    ) : (
                      <>
                        <div>{answer.value}</div>
                        {answer.attachment && (
                          <div className="mt-2">
                            <AttachmentUI
                              attachment={answer.attachment}
                              name={`${answer.label} - Attachment`}
                              viewOnly={true}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DemographicsTab;
