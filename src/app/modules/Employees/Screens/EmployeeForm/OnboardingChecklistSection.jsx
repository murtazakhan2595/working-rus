import React, { useEffect, useState, useCallback } from "react";
import { Switch } from "src/@/components/ui/switch";
import { DateInput } from "components/FormControl";
import { Label } from "src/@/components/ui/label";
import { Card, CardContent } from "components/ui/card";
import { Attachments } from "app/modules/TaskManagment/Sections";
import { getOnboardingDocument } from "app/hooks/officeSetting";

const OnboardingChecklistSection = ({
  name,
  onChange = () => {},
  error,
  touch,
  value = [],
}) => {
  const [isLoading, setIsLoading] = useState(false); // Start with false since parent handles it

  useEffect(() => {
    const initializeDocuments = async (isMounted) => {
      try {
        setIsLoading(true);
        const response = await getOnboardingDocument();
        if (response?.results && isMounted) {
          // Check if documents are already initialized by parent
          const currentDocs = value;

          const hasExistingDocs = currentDocs && currentDocs.length > 0;

          if (!hasExistingDocs) {
            // Initialize new documents only if parent didn't
            const initialDocuments = response.results.map((template) => ({
              templateId: template.id,
              name: template.name,
              isActive: false,
              hasExpiryDate: false,
              expiryDate: null,
              attachment: [],
            }));

            onChange(name, initialDocuments);
          } else {
            // Check if existing docs need template name mapping
            const needsMapping = currentDocs.some((doc) => doc.checklist_id);

            if (needsMapping) {
              const mappedDocuments = currentDocs.map((doc) => {
                const template = response.results.find(
                  (t) => t.id === doc.checklist_id
                );
                return {
                  id: doc.id,
                  templateId: doc.checklist_id,
                  name: template?.name || doc.name,
                  isActive: doc.is_Active,
                  hasExpiryDate: doc.has_expiry_date,
                  expiryDate: doc.expiry_date,
                  attachment: doc.attachment,
                };
              });

              onChange(name, mappedDocuments);
            } else {
            }
          }
        } else {
          console.error("❌ Child: No results in API response");
        }
      } catch (error) {
        console.error("❌ Child: Error in initializeDocuments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    // Only initialize if we haven't done so already
    let isMounted = true;
    initializeDocuments(isMounted);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleActiveToggle = (index, checked) => {
    const updatedDocs = [...value];
    updatedDocs[index].isActive = checked;

    if (!checked) {
      updatedDocs[index].hasExpiryDate = false;
      updatedDocs[index].expiryDate = null;
    }

    onChange(name, updatedDocs);
  };

  const handleExpiryToggle = (index, checked) => {
    const updatedDocs = [...value];
    updatedDocs[index].hasExpiryDate = checked;

    if (!checked) {
      updatedDocs[index].expiryDate = null;
    }

    onChange(name, updatedDocs);
  };

  const handleExpiryDateChange = (index, date) => {
    const updatedDocs = [...value];
    updatedDocs[index].expiryDate = date;
    onChange(name, updatedDocs);
  };

  const handleAttachmentChange = (index, attachment) => {
    const updatedDocs = [...value];
    updatedDocs[index].attachment = attachment;
    onChange(name, updatedDocs);
  };

  const getDocumentError = (index, field) => {
    const errors = error;
    if (errors && errors[index] && errors[index][field]) {
      return errors[index][field];
    }
    return null;
  };

  const getDocumentTouched = (index, field) => {
    const touched = touch;
    if (touched && touched[index] && touched[index][field]) {
      return touched[index][field];
    }
    return false;
  };

  // Show loading state only if we're actively loading
  if (isLoading) {
    return <div>Loading document templates...</div>;
  }

  if (isLoading) return <div>Initializing documents...</div>;
  // If no documents exist at all, show no documents message
  if (!value || value.length === 0) {
    // Only show loading message if we're still trying to initialize
    return <div>No onboarding documents found.</div>;
  }

  return (
    <div className="space-y-4">
      {value.map((doc, index) => (
        <Card key={doc.templateId || index} className="pt-4">
          <CardContent className="">
            <div className=" flex justify-between items-center">
              <p className="">{doc.name}</p>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`active-${index}`} className="text-sm">
                  {doc.isActive ? "Active" : "Inactive"}
                </Label>
                <Switch
                  id={`active-${index}`}
                  checked={doc.isActive}
                  onCheckedChange={(checked) =>
                    handleActiveToggle(index, checked)
                  }
                />
              </div>
            </div>

            {doc.isActive && (
              <>
                <div className="my-4">
                  <Attachments
                    attachmentSelected={doc.attachment || []}
                    onChange={(attachment) =>
                      handleAttachmentChange(index, attachment)
                    }
                    acceptedFileTypes=".pdf,.png,.jpg,.jpeg"
                    error={getDocumentError(index, "attachment")}
                    touch={getDocumentTouched(index, "attachment")}
                  />
                </div>

                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`expiry-${index}`} className="text-sm">
                      Expiry Date
                    </Label>
                    <Switch
                      id={`expiry-${index}`}
                      checked={doc.hasExpiryDate}
                      onCheckedChange={(checked) =>
                        handleExpiryToggle(index, checked)
                      }
                    />
                  </div>

                  {doc.hasExpiryDate && (
                    <div className="w-full max-w-xs">
                      <DateInput
                        name={`onboardingDocuments[${index}].expiryDate`}
                        value={doc.expiryDate}
                        error={getDocumentError(index, "expiryDate")}
                        touch={getDocumentTouched(index, "expiryDate")}
                        onChange={(field, date) =>
                          handleExpiryDateChange(index, date)
                        }
                        required={doc.hasExpiryDate}
                        disabled={!doc.hasExpiryDate}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OnboardingChecklistSection;
