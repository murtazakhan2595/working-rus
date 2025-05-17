import React from "react";
import {
  PersonalInformation,
  ContactInformation,
  BankInformation,
  ExperienceInformation,
  EducationInformation,
  CertificationsInformation,
  IdentificationInformation,
} from "../Profile";
import EmployeeForm from "../EmployeeForm";
import SheetComponent from "components/ui/SheetComponent";

function EmployeeDetailModal({
  openModal,
  closeModal,
  employeeId,
  currentClick,
}) {
  const getTitle = () => {
    if (currentClick === 1) return "Edit Personal Details";
    else if (currentClick === 2) return "Edit Contact Information";
    else if (currentClick === 3) return "Edit Banking Details";
    else if (currentClick === 4) return "Edit Experience";
    else if (currentClick === 5) return "Edit Academics";
    else if (currentClick === 6) return "Edit Certification and Licences";
    else if (currentClick === 7) return "Edit Identification Details";
    else if (currentClick === 8) return "Edit Work Details";
  };
  return (
    <>
      <div>
        <SheetComponent
          {...{
            triggerText: null,
            title: getTitle(currentClick),
            description: null,
            footer: null,
          }}
          // onSubmit={handleSubmit}
          
          isOpen={openModal}
          setIsOpen={closeModal}
          contentClassName="custom-sheet-width"
        >
          {currentClick === 1 && (
            <PersonalInformation
              employeeId={employeeId}
              isEditMode={true}
              nextstep={() => {
                closeModal();
              }}
            />
          )}
          {currentClick === 2 && (
            <ContactInformation
              employeeId={employeeId}
              nextstep={() => {
                closeModal();
              }}
              isEditMode={true}
            />
          )}
          {currentClick === 3 && (
            <BankInformation
              employeeId={employeeId}
              nextstep={() => {
                closeModal();
              }}
              isEditMode={true}
            />
          )}
          {currentClick === 4 && (
            <ExperienceInformation
              employeeId={employeeId}
              nextstep={() => {
                closeModal();
              }}
              isEditMode={true}
            />
          )}
          {currentClick === 5 && (
            <EducationInformation
              employeeId={employeeId}
              nextstep={() => {
                closeModal();
              }}
              isEditMode={true}
            />
          )}
          {currentClick === 6 && (
            <CertificationsInformation
              employeeId={employeeId}
              nextstep={() => {
                closeModal();
              }}
              isEditMode={true}
            />
          )}
          {currentClick === 7 && (
            <IdentificationInformation
              employeeId={employeeId}
              nextstep={() => {
                closeModal();
              }}
              isEditMode={true}
            />
          )}
          {currentClick === 8 && (
            <EmployeeForm
              id={employeeId}
              nextstep={() => {
                closeModal();
              }}
              isEditMode={true}
            />
          )}
        </SheetComponent>
      </div>
    </>
  );
}

export default EmployeeDetailModal;
