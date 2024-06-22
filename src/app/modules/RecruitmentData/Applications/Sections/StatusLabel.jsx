// Header.js
import React from "react";

const StatusLabel = ({ status }) => {
    if (!status) {
        return '';
    }
    let classname = '';
    if (status === 'Onboard') {
        classname = 'label-green-2FD115';
    } else if (status === 'Contacted') {
        classname = 'label-warning-FF9900';
    } else if (status === 'Offered') {
        classname = 'label-warning-D5D912';
    } else if (status === 'Rejected') {
        classname = 'label-danger';
    } else if (status === 'Declined') {
        classname = 'label-primary-7D11EA';
    } else if (status === 'Selected') {
        classname = 'label-success';
    } else if (status === 'Shortlisted') {
        classname = 'label-green-28D9AC';
    } else {
        classname = 'label-draft';
    }
    return (
        <>
            <span className={`p-2 ${classname} badge`}>
                {status}
            </span>
        </>
    );
};


export default StatusLabel;
