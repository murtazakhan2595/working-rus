import React, { useState } from "react";
import { getApplicantsData } from "app/hooks/talentSphere";
import { Button } from "components/ui/button";
import {
  NavigationSheetComponent,
  DetailContent,
} from "components";
import { ApplicantDetails } from "app/modules/TalentSphere/Sections";
import {
  UpdateApplicantStatus,
  ViewInterviewFeedback,
  GenerateOffer,
} from "app/modules/TalentSphere";
import { ApplicantStatusList } from "./StatusList";
import { EmployeeName } from "utils/getValuesFromTables";

const ViewApplicationDetail = ({
  currentId,
  DataList = [],
  reloadData = () => { },
  isOpen,
  setIsOpen = () => { },
  statusUpdated = () => { },
}) => {
  const [forceLoad, setForceLoad] = useState(false);
  const [FormData, setFormData] = useState({});
  const [OpenFormModal, setOpenFormModal] = useState(false);
  const [OpenViewFeedback, setOpenViewFeedback] = useState(false);
  const [OpenOfferForm, setOpenOfferForm] = useState(false);

  const handleClick = React.useCallback(
    async (event, status, data) => {
      event.preventDefault();
      event.stopPropagation();
      if (status === "view-feedback") {
        const interview_ids = (data.interviews || []).map(
          (interview) => interview.id
        );
        setFormData({ id: interview_ids });
        setOpenViewFeedback(true);
        return null;
      }
      if (status === "generate-offer") {
        setFormData({
          applicant: data.id,
          expected_joining_date:
            data?.recruitment_shortlist?.expected_joining_date,
          contact_number: data.contact_number,
          candidate_name: data.candidate_name,
          candidate_id: data.candidate_id,
          email: data.email,
        });
        setOpenOfferForm(true);
        return null;
      }

      const FormData = {
        status: status,
        applicant: data.id,
        status_variant: status,
        initialData: {},
      };
      if (status === "hold") FormData.status_variant = "default";
      if (status === "remove_blacklist") {
        FormData.status = "rejected";
        FormData.initialData = data?.blacklist ?? {};
      }
      setFormData(FormData);
      setOpenFormModal(true);
    },
    [setOpenFormModal, setFormData, setOpenViewFeedback]
  );

  const fetchData = async (id, isMounted) => {
    try {
      const response = await getApplicantsData(id);
      if (isMounted) return response;
    } catch (error) {
      console.error("Error fetching exit data:", error);
    }
    return null;
  };
const fields = React.useMemo(
  () => [
    ...(ApplicantDetails || []),

    {
      customContent: true,
      className: "mb-6",
      renderContent: (data) => {
        if (!data) return null;

        const screenedBy =
          data.screened_by_name || <EmployeeName cell={data.screened_by} /> || "N/A";
        const screenedDate = data.screened_date
          ? new Date(data.screened_date).toLocaleString()
          : "N/A";

        const matchedSkills = data.ai_matched_skills
          ? data.ai_matched_skills.split(/[, ]+/).filter(Boolean)
          : [];
        const missingSkills = data.ai_missing_skills
          ? data.ai_missing_skills.split(/[, ]+/).filter(Boolean)
          : [];

        const matchScore = data.ai_match_score || 0;
        
        // Determine score color based on value
        const getScoreColor = (score) => {
          if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
          if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' };
          if (score >= 40) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
          return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
        };

        const scoreColors = getScoreColor(matchScore);

        return (
          <div className="space-y-4">
            {/* Screened Info Card */}
            <div className=" rounded-lg p-4 border border-gray-200 shadow-lg">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-500 block mb-1">Screened By</span>
                    <span className="text-sm font-semibold text-gray-900">{screenedBy}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className="flex-1">
                    <span className="text-xs font-medium text-gray-500 block mb-1">Screened Date</span>
                    <span className="text-sm font-semibold text-gray-900">{screenedDate}</span>
                  </div>
                </div>

                {data.ai_suggested && (
                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full px-3 py-1.5 border border-blue-200 shadow-sm">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
                      </svg>
                      AI Suggested
                    </span>
                    
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${scoreColors.bg} ${scoreColors.text} rounded-full px-3 py-1.5 border ${scoreColors.border} shadow-sm`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Match: {matchScore}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Analysis Card */}
            {(matchedSkills.length > 0 || missingSkills.length > 0) && (
              <div className="rounded-lg p-4 border border-gray-200 shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-900">AI Skills Analysis</span>
                </div>

                <div className="space-y-3">
                  {/* Matched Skills */}
                  {matchedSkills.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 block mb-2">Matched Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchedSkills.map((skill, index) => (
                          <span
                            key={`matched-${index}`}
                            className="inline-flex items-center gap-1 text-xs font-medium bg-green-100 text-green-700 rounded-full px-2.5 py-1 border border-green-200"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {missingSkills.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-600 block mb-2">Missing Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {missingSkills.map((skill, index) => (
                          <span
                            key={`missing-${index}`}
                            className="inline-flex items-center gap-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-1 border border-amber-200"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      },
    },

    {
      customContent: true,
      className: "flex flex-wrap justify-end gap-2.5 my-6",
      renderContent: (data) => {
        if (!data || !data.status || !data.status.toLowerCase()) return null;
        const Options = ApplicantStatusList[data.status.toLowerCase()];
        return (Options || []).map((option, index) => (
          <Button
            variant={option.variant}
            key={`applicant-${option.status}-${index}`}
            onClick={(event) => handleClick(event, option.status, data)}
            className="shadow-sm"
          >
            {option.label}
          </Button>
        ));
      },
    },
  ],
  [handleClick]
);
  return (
    <>
      <NavigationSheetComponent
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={`Application Details`}
        currentItem_Id={currentId}
        ForceItemLoad={forceLoad}
        dataList={DataList}
        reloadData={reloadData}
        allowEdit={false}
        allowDelete={false}
        fetchCurrentItemDetails={fetchData}
        dataUniqueKey="applicant_id"
      >
        <DetailContent fields={fields} />
      </NavigationSheetComponent>

      {OpenFormModal && (
        <UpdateApplicantStatus
          status={FormData.status}
          status_variant={FormData.status_variant}
          applicant={FormData.applicant}
          reloadData={() => {
            reloadData(true);
            setForceLoad(!forceLoad);
          }}
          isOpen={OpenFormModal}
          setIsOpen={setOpenFormModal}
          statusUpdated={statusUpdated}
          initialData={FormData.initialData}
        />
      )}

      {OpenViewFeedback && (
        <ViewInterviewFeedback
          isOpen={OpenViewFeedback}
          reloadData={() => {
            setForceLoad(!forceLoad);
            setOpenViewFeedback(false);
          }}
          setIsOpen={() => {
            setOpenViewFeedback(false);
          }}
          currentId={FormData?.id}
        />
      )}

      {OpenOfferForm && (
        <GenerateOffer
          isOpen={OpenOfferForm}
          reloadData={() => {
            setForceLoad(!forceLoad);
            setOpenOfferForm(false);
          }}
          setIsOpen={() => {
            setOpenOfferForm(false);
          }}
          initialData={FormData}
        />
      )}
    </>
  );
};

export default ViewApplicationDetail;
