import React from "react";
import tick from '../../../assets/images/tick.png';
import { RxCross2 } from "react-icons/rx";

const SuccessPopup = ({ onClose, heading, message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#4a4a4a69]">
      <div className="bg-white shadow-md rounded-2xl px-8 py-3 flex items-center gap-x-3 font-lato relative">
        <RxCross2 className="absolute top-4 right-6 text-sm text-baseGray cursor-pointer" onClick={onClose} />
        <div className="">
          <img src={tick} alt="check sign" width='70' height="70" />
        </div>
        <div>
          <div className="text-xl font-bold">{heading}</div>
          <div className="text-lg">{message}</div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;
