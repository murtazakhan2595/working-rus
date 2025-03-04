import React, { useState } from "react";
import { CardHeader, CardBody, Row, Col } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  BankInformation,
  PersonalInformation,
  ExperienceInformation,
  ContactInformation,
  EducationInformation,
  CertificationsInformation,
  IdentificationInformation,
} from "./index";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

const EditEmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //   const [currentTab, setCurrentTab] = useState(4);
  const [currentTab, setCurrentTab] = useState(1);
  const getTitle = () => {
    if (currentTab === 1) return "Personal Details";
    else if (currentTab === 2) return "Contact Information";
    else if (currentTab === 3) return "Banking Details";
    else if (currentTab === 4) return "Experience";
    else if (currentTab === 5) return "Academics";
    else if (currentTab === 6) return "Certification and Licences";
    else if (currentTab === 7) return "Identification Details";
  };

  return (
    <>
      <div className="screen">
        <Row>
          <Col lg={8} className="mx-auto">
            <CardHeader>
              <div className="flex items-center">
                <ArrowLeft
                  className="w-6 h-6 mr-2 bg-transparent rounded-lg shadow-sm cursor-pointer"
                  onClick={() => navigate("/profile-management")}
                />
                <span className="text-neutral-1200 text-2xl font-bold">{getTitle()}</span>
              </div>
            </CardHeader>
            <CardBody>
              {currentTab === 1 && (
                <PersonalInformation
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={false}
                />
              )}
              {currentTab === 2 && (
                <ContactInformation
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={false}
                  prevStep={() => {
                    setCurrentTab(currentTab - 1);
                  }}
                />
              )}
              {currentTab === 3 && (
                <BankInformation
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={false}
                  prevStep={() => {
                    setCurrentTab(currentTab - 1);
                  }}
                />
              )}
              {currentTab === 4 && (
                <ExperienceInformation
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={false}
                  prevStep={() => {
                    setCurrentTab(currentTab - 1);
                  }}
                />
              )}
              {currentTab === 5 && (
                <EducationInformation
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={false}
                  prevStep={() => {
                    setCurrentTab(currentTab - 1);
                  }}
                />
              )}
              {currentTab === 6 && (
                <CertificationsInformation
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={false}
                  prevStep={() => {
                    setCurrentTab(currentTab - 1);
                  }}
                />
              )}
              {currentTab === 7 && (
                <IdentificationInformation
                  employeeId={id}
                  nextstep={() => {
                    toast.success("Employee Profile Updated Successfully!", {
                      position: toast.POSITION.TOP_RIGHT,
                    });
                    navigate("/profile-management");
                  }}
                  isEditMode={false}
                  prevStep={() => {
                    setCurrentTab(currentTab - 1);
                  }}
                />
              )}
            </CardBody>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default EditEmployeeProfile;
