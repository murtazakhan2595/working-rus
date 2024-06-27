import React from 'react';
import { Modal, ModalHeader, ModalBody, } from 'reactstrap';
import { PersonalInformation, ContactInformation, BankInformation, ExperienceInformation, EducationInformation, CertificationsInformation, IdentificationInformation } from '../Profile';
import EmployeeForm from '../Sections/EmployeeForm';
function EmployeeDetailModal({ openModal, closeModal, employeeId, currentClick, }) {
    const getTitle = () => {
        if (currentClick === 1)
            return 'Edit Personal Details';
        else if (currentClick === 2)
            return 'Edit Contact Information';
        else if (currentClick === 3)
            return 'Edit Banking Details';
        else if (currentClick === 4)
            return 'Edit Experience';
        else if (currentClick === 5)
            return 'Edit Academics';
        else if (currentClick === 6)
            return 'Edit Certification and Licences';
        else if (currentClick === 7)
            return 'Edit Identification Details';
        else if (currentClick === 8)
            return 'Edit Work Details';

    }
    return (
    <>
        <div className="contact-modal-screen">
            <Modal
                isOpen={openModal}
                className="modal-success py-4 px-3"
            >
                <ModalHeader toggle={closeModal} tag="h4">
                    <span className="mb-0 fw-700">{getTitle(currentClick)}</span>
                </ModalHeader>
                <ModalBody>
                    {currentClick === 1 &&
                        <PersonalInformation
                            employeeId={employeeId}
                            isEditMode={true}
                            nextstep={() => {
                                closeModal();
                            }}

                        />
                    }
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
                    {currentClick === 8 &&
                        // <CreateUpdateEmployee
                        //     employeeId={employeeId}
                        //     nextstep={() => {
                        //         closeModal();
                        //     }}
                        //     isEditMode={true}
                        // />
                        <EmployeeForm
                        id={employeeId}
                        nextstep={() => {
                            closeModal();
                        }}
                        isEditMode={true}
        />
                    }
                </ModalBody>
            </Modal>
        </div>
    </>

    );
}

export default EmployeeDetailModal;
