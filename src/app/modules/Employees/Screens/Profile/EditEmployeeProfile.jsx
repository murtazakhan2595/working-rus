import React, { useEffect, useState } from "react";
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

  return (
    <>
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
    </>
  );
};

export default EditEmployeeProfile;
