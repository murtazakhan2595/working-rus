import React from 'react';
import { Modal , ModalHeader, ModalBody,} from 'reactstrap';
import { PersonalInformation} from '../Profile';

function EmployeeDetailModal({ openModal, closeModal, employeeId, currentClick, }) {
    console.log(openModal, employeeId);
    const getTitle = () => {
        if (currentClick === 1)
            return 'Personal Details';
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
                className="modal-success contact-modal"
            >
                <ModalHeader toggle={closeModal()} tag="h4">
                    <h5 className="mb-0">{getTitle(currentClick)}</h5>
                </ModalHeader>
                <ModalBody>
                    {currentClick === 1 &&
                        <PersonalInformation
                            employeeId={employeeId}
                            isEditMode={true}
                        />
                    }
                </ModalBody>

            </Modal>
        </div>
    );
}

export default EmployeeDetailModal;
