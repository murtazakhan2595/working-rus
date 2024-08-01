import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Welcome from "./Welcome";
import PersonalInformation from "../Profile/PersonalInformation";
import ContactInformation from "../Profile/ContactInformation";
import BankInformation from "../Profile/BankInformation";
import ExperienceInformation from "../Profile/ExperienceInformation";
import EducationInformation from "../Profile/EducationInformation";
import CertificationsInformation from "../Profile/CertificationsInformation";
import logo from "../../../../../assets/images/tecbrix-logo.png";
import IdentificationInformation from "../Profile/IdentificationInformation";
import OnboardComplete from "./OnboardComplete";
import { CardHeader, CardBody, Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { toast, } from "react-toastify";

const CreateEmployeeProfile = () => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const navigate = useNavigate();
  // Access the id from the userProfile object
  const id = userProfile.id;
  const [currentTab, setCurrentTab] = useState(1);

  const getTitle = () => {
    if (currentTab === 2) return "Personal Details";
    else if (currentTab === 3) return "Contact Information";
    else if (currentTab === 4) return "Banking Details";
    else if (currentTab === 5) return "Experience";
    else if (currentTab === 6) return "Academics";
    else if (currentTab === 7) return "Certification and Licences";
    else if (currentTab === 8) return "Identification Details";
  };
  if(userProfile.is_filled)
    navigate('/');

  return (
    <>
      <div className="h-screen flex justify-center">
        <div className="w-full flex flex-col min-h-full">
          <div className="flex justify-between p-3 md:p-5 lg:p-7">
            <div className="flex justify-start items-start">
              <img
                src={logo}
                className="w-[142px] h-auto md:h-auto lg:pl-5"
                alt="Tecbrix logo"
              />
            </div>
          </div>

          {/*  */}
          <div className="screen">
            <div className="max-w-[750px] block mx-auto">
              {currentTab === 1 && (
                <Welcome
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={false}
                />
              )}
              {currentTab === 9 && (
                <OnboardComplete
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                    toast.success("Employee Profile Updated Successfully!", {
                      position: toast.POSITION.TOP_RIGHT,
                    });
                    navigate('/')
                  }}
                  isEditMode={true}
                />
              )}
              {currentTab !== 1 && currentTab !== 9 &&
                <>
                  <CardHeader>
                    <Row>
                      <Col lg={12}>
                        <h4 className="ml-2 fw-700 font-lato">{getTitle()}</h4>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    {currentTab === 2 && (
                      <PersonalInformation
                        employeeId={id}
                        nextstep={() => {
                          setCurrentTab(currentTab + 1);
                        }}
                        isEditMode={false}
                      />
                    )}
                    {currentTab === 3 && (
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
                    {currentTab === 4 && (
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
                    {currentTab === 5 && (
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
                    {currentTab === 6 && (
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
                    {currentTab === 7 && (
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
                    {currentTab === 8 && (
                      <IdentificationInformation
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
                  </CardBody>
                </>
              }
            </div>
          </div>
          <div className="flex justify-start items-start mb-2">
            <p className="font-roboto font-normal text-base text-[#5C5E64] lg:pl-5">
              © 2024 TecBrix
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEmployeeProfile;
