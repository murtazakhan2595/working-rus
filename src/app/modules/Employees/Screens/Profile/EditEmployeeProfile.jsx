import React, { useState } from "react";
import {
  CardHeader,
  CardBody,
  Row,
  Col,
} from 'reactstrap';
import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  BankInformation,
  PersonalInformation,
  ExperienceInformation,
} from "./index";
import EducationInformation from "./EducationInformation";
import ContactInformation from "./ContactInformation";
import CertificationsInformation from "./CertificationsInformation";

const EditEmployeeProfile = () => {
  const { id } = useParams();
  //   const [currentTab, setCurrentTab] = useState(4);
  const [currentTab, setCurrentTab] = useState(1);
  const getTitle = () => {
    if (currentTab === 1)
      return 'Personal Details';
    else if (currentTab === 2)
      return 'Contact Information';
    else if (currentTab === 3)
      return 'Banking Details';
    else if (currentTab === 4)
      return 'Experience';
    else if (currentTab === 5)
      return 'Academics';
    else if (currentTab === 6)
      return 'Certification and Licences';
    else if (currentTab === 7)
      return 'Identification Details';

  }

  return (
    <>
      <div className="screen">
        <Row>
          <Col lg={8} className="mx-auto">
            <CardHeader>
              <Row>
                <Col lg={12}>
                  <h4 className="ml-2 fw-700">{getTitle()}</h4>
                </Col>
              </Row>
            </CardHeader>
            <CardBody>
              {currentTab === 1 && (
                <PersonalInformation
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={true}
                />
              )}
              {currentTab === 2 && (
                <ContactInformation
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={true}
                />
              )}
              {currentTab === 3 && (
                <BankInformation
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={true}
                />
              )}
              {currentTab === 4 && (
                <ExperienceInformation
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={true}
                />
              )}
              {currentTab === 5 && (
                <EducationInformation
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={true}
                />
              )}
              {currentTab === 6 && (
                <CertificationsInformation
                  employeeId={id}
                  nextstep={() => {
                    setCurrentTab(currentTab + 1);
                  }}
                  isEditMode={true}
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
