import React from 'react';
import { Modal } from 'reactstrap';
import { PersonalInformation } from '../Profile';

function PersonalInformationModal({ openModal, closeModal, employeeId }) {
    alert('fjk')
    console.log(openModal, employeeId);
    return (
        <div className="contact-modal-screen">
            <Modal
                isOpen={openModal}
                className="modal-success contact-modal"
            >
                <PersonalInformation
                    employeeId={employeeId}
                    isEditMode={true}
                />
            </Modal>
        </div>
    );
}

export default PersonalInformationModal;
