import React from "react";
import CreateUpdateJob from "./CreateUpdateJob";

const EditJobDetails = ({ job, onClose, fetchJobPosts }) => {
  return (
    
        <CreateUpdateJob formData={job} onClose={onClose} isEditMode={true} fetchJobPosts={fetchJobPosts} />
  );
};

export default EditJobDetails;
