import React, { useState ,useEffect} from "react";
import { EmployeeDetailModal } from "../../../Employees/Screens/Modals";
import { FiDownload } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { renderDate } from "utils/renderValues";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import { getEmployeeAcademicRecordData } from "app/hooks/employee";
import {getFileNameFromURL} from 'utils/downUtils';
import { PageLoader } from "components";

const AcademicInfo = ({
  isEditable,
  employeeId,
}) => {
  const [showPersonalDetailCard, setShowPersonalDetailCard] = useState(false);
  const [educations, setEducations] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);
  const getDataByHooks = async () => {
    setIsLoading(true);
    try {
      const educationData = await getEmployeeAcademicRecordData(employeeId);
      setEducations(
        Array.isArray(educationData) &&
          educationData?.length > 0 &&
          educationData[0]?.id
          ? educationData
          : null
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDataByHooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId]);
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-primary">Academic Details</CardTitle>
            {isEditable && (
              <div
                className="flex items-center gap-4"
                onClick={() => {
                  setShowPersonalDetailCard(true);
                }}
              >
                <CiEdit className="text-2xl cursor-pointer opacity-80" />
              </div>
            )}
          </div>
        </CardHeader>
        {isLoading ? (
          <PageLoader />
        ) : (
          <CardContent className="flex items-center pt-6 space-x-4">
            <div className="grid w-full grid-cols-1 gap-4 mb-4">
              {educations?educations?.map((edu, index) => (
                <div
                  key={index}
                  className="flex flex-wrap justify-between w-full mb-7"
                >
                  <div>
                    <div className="text-sm font-semibold text-black xl:text-base lg:text-base md:text-sm whitespace-nowrap">
                      {edu.institute_name || "Institution Name(N/A)"}
                    </div>
                    <div className="text-sm text-black break-all xl:break-normal lg:break-all md:break-all xl:text-base lg:text-base md:text-sm">
                      {edu.education_level || "N/A"} in{" "}
                      {edu.program || "------"}
                    </div>
                    <div className="text-sm xl:text-base lg:text-base md:text-sm text-muted-foreground">
                      {renderDate(edu?.edu_start_date)} -{" "}
                      {renderDate(edu?.edu_end_date)}
                    </div>
                  </div>
                  <div>
                    {edu.education_body && (
                      <a
                        download={getFileNameFromURL(edu.education_body)}
                        className="flex items-center gap-2 text-sm no-underline"
                        href={edu?.education_body}
                        target="_blank"
                      >
                        Certification <FiDownload />
                      </a>
                    )}
                  </div>
                </div>
              )):<div>
              <div className="flex-1 text-sm xl:text-base lg:text-base md:text-sm text-neutral-1000 ">
              Academic Details are not posted yet.
              </div>
            </div>}
            </div>
          </CardContent>
        )}
      </Card>
      {showPersonalDetailCard && (
        <EmployeeDetailModal
          openModal={showPersonalDetailCard}
          closeModal={() => {
            setShowPersonalDetailCard(false);
            getDataByHooks();
          }}
          employeeId={employeeId}
          currentClick={5}
        />
      )}
    </>
  );
};

export default AcademicInfo;
