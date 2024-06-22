// Header.js
import React from "react";

const StatusLabel = ({ status }) => {
    if (!status) {
        return '';
    }
    let classname = '';
    if (status === 'Selected') {
        classname = 'label-success';
    } else if (status === 'Pending') {
        classname = 'label-Pending';
    } else if (status === 'Shortlisted') {
        classname = 'label-closed';
    } else if (status === 'Rejected') {
        classname = 'label-danger';
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
