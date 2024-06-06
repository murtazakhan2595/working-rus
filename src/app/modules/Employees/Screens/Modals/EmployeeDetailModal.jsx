import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { PersonalInformation } from '../Profile';

function EmployeeDetailModal({ openModal, closeModal, employeeId, currentClick, }) {
    console.log(openModal, employeeId, typeof currentClick);
    const getTitle = () => {
        if (currentClick === 1)
            return 'Edit Personal Details';
        else if (currentClick === 2)
            return 'Contact Information';
        else if (currentClick === 3)
            return 'Banking Details';
        else if (currentClick === 4)
            return 'Experience';
        else if (currentClick === 5)
            return 'Academics';
        else if (currentClick === 6)
            return 'Certification and Licences';
        else if (currentClick === 7)
            return 'Identification Details';

    }
    return (
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
                            nextstep={()=>{
                                closeModal();
                            }}
                        />
                    }
                </ModalBody>
            </Modal>
        </div>
    );
}

export default EmployeeDetailModal;
