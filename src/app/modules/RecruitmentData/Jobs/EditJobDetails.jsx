import React from "react";
import { RxCross2 } from "react-icons/rx";
import CreateUpdateJob from "./CreateUpdateJob";

const EditJobDetails = ({ job, onClose }) => {
  return (
    <div className="fixed top-0 right-0 max-w-[680px] w-[95%] h-full z-20 overflow-y-auto hideScroll pl-10">
      <div className="bg-white h-auto shadow-lg p-10">
        <div
          className="absolute right-6 top-6 cursor-pointer"
          onClick={onClose}
        >
          <RxCross2 className="text-baseGray" />
        </div>
        <CreateUpdateJob formData={job} onClose={onClose} isEditMode={true} />
      </div>
    </div>
  );
};

export default EditJobDetails;
