import React from "react";

const SuccessPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white shadow-md rounded-md p-8">
        <div className="text-2xl font-bold text-green-600 mb-4">Success!</div>
        <div className="text-base text-gray-700 mb-4">
          Your tasks have been successfully posted.
        </div>
        <button
          onClick={onClose}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup;
