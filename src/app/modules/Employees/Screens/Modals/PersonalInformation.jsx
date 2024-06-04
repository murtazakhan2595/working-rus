import React from 'react';
import { Modal } from 'reactstrap';
import PersonalInformation from '../Profile/PersonalInformation';

function PersonalInformationModal({ openModal, setOpenModal, employeeId }) {

    return (
        <div className="contact-modal-screen">
            <Modal
                isOpen={openModal}
                className="modal-success contact-modal"
            >
                <PersonalInformation
                    getCurrentContactData={(contactData) => {
                        this.props.getCurrentUser(contactData);
                    }}
                    closeModal={(e) => {
                        setOpenModal(false);
                    }}
                    employeeId={employeeId}
                />
            </Modal>
        </div>
    );
}

export default PersonalInformationModal;
