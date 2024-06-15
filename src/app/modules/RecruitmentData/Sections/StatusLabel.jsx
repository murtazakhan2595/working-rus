// Header.js
import React from "react";

const StatusLabel = ({ status }) => {
    if (!status) {
        return '';
    }
    let classname = '';
    if (status === 'Selected') {
        classname = 'bg-success';
    } else if (status === 'Pending') {
        classname = 'bg-warning';
    } else if (status === 'Shortlisted') {
        classname = 'bg-info';
    } else if (status === 'Rejected') {
        classname = 'label-danger';
    } else {
        classname = 'bg-secondary';
    }
    return (
        <>
            <span className={`badge p-2 ${classname} bg-opacity-25`}>
                {status}
            </span>
        </>
    );
};


export default StatusLabel;
