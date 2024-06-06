import React, { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Welcome from "./Welcome";
import PersonalInformation from "../Profile/PersonalInformation";
import ContactInformation from "../Profile/ContactInformation";
import BankInformation from "../Profile/BankInformation";
import ExperienceInformation from "../Profile/ExperienceInformation";
import EducationInformation from "../Profile/EducationInformation";
import CertificationsInformation from "../Profile/CertificationsInformation";
import logo from "../../../../../assets/images/tecbrix-logo.png";
// import OnboardComplete from "./OnboardComplete";
import IdentificationInformation from "../Profile/IdentificationInformation";


const CreateEmployeeProfile = () => {
  const { id } = useParams();
  //   const [currentTab, setCurrentTab] = useState(4);
  const [currentTab, setCurrentTab] = useState(1);

  return (
    <>
      <div className="h-screen flex justify-center">
        <div className="w-full flex flex-col min-h-full p-3 md:p-5 lg:p-7">
          <div className="flex justify-between">
            <div className="flex justify-start items-start">
              <img
                src={logo}
                className="w-[142px] h-auto md:h-auto lg:pl-5"
                alt="Tecbrix logo"
              />
            </div>
          </div>
          {/*  */}
          {currentTab === 1 && (
            <Welcome
              employeeId={id}
              nextstep={() => {
                setCurrentTab(currentTab + 1);
              }}
              isEditMode={true}
            />
          )}
          {currentTab === 2 && (
            <PersonalInformation
              employeeId={id}
              nextstep={() => {
                setCurrentTab(currentTab + 1);
              }}
              isEditMode={true}
            />
          )}
          {currentTab === 3 && (
            <ContactInformation
              employeeId={id}
              nextstep={() => {
                setCurrentTab(currentTab + 1);
              }}
              isEditMode={true}
            />
          )}
          {currentTab === 4 && (
            <BankInformation
              employeeId={id}
              nextstep={() => {
                setCurrentTab(currentTab + 1);
              }}
              isEditMode={true}
            />
          )}
          {currentTab === 5 && (
            <ExperienceInformation
              employeeId={id}
              nextstep={() => {
                setCurrentTab(currentTab + 1);
              }}
              isEditMode={true}
            />
          )}
          {currentTab === 6 && (
            <EducationInformation
              employeeId={id}
              nextstep={() => {
                setCurrentTab(currentTab + 1);
              }}
              isEditMode={true}
            />
          )}
          {currentTab === 7 && (
            <CertificationsInformation
              employeeId={id}
              nextstep={() => {
                setCurrentTab(currentTab + 1);
              }}
              isEditMode={true}
            />
          )}
          {currentTab === 8 && (
            <IdentificationInformation
              employeeId={id}
              nextstep={() => {
                setCurrentTab(currentTab + 1);
              }}
              isEditMode={true}
            />
          )}
          {/* {currentTab === 9 && (
            <OnboardComplete
              employeeId={id}
              nextstep={() => {
                setCurrentTab(currentTab + 1);
              }}
              isEditMode={true}
            />
          )} */}
          <div className="flex justify-start items-start">
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
