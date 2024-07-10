import React from "react";
import { RxCross2 } from "react-icons/rx";

const ConfirmationModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full relative">
        <RxCross2 onClick={onClose} className="absolute text-[#BFBFBF] cursor-pointer right-5 top-5" />
        <div className="text-center">
          <div className="mb-2">
            <svg
              className="mx-auto"
              width="77"
              height="77"
              viewBox="0 0 77 77"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="77" height="77" rx="38.5" fill="#F4E4EB" />
              <g clip-path="url(#clip0_4264_47553)">
                <path
                  d="M47.3333 29H55.6666V32.3334H52.3333V54C52.3333 54.4421 52.1577 54.866 51.8452 55.1786C51.5326 55.4911 51.1087 55.6667 50.6666 55.6667H27.3333C26.8913 55.6667 26.4674 55.4911 26.1548 55.1786C25.8422 54.866 25.6666 54.4421 25.6666 54V32.3334H22.3333V29H30.6666V24C30.6666 23.558 30.8422 23.1341 31.1548 22.8215C31.4674 22.509 31.8913 22.3334 32.3333 22.3334H45.6666C46.1087 22.3334 46.5326 22.509 46.8452 22.8215C47.1577 23.1341 47.3333 23.558 47.3333 24V29ZM49 32.3334H29V52.3334H49V32.3334ZM41.3566 42.3334L44.3033 45.28L41.9466 47.6367L39 44.69L36.0533 47.6367L33.6966 45.28L36.6433 42.3334L33.6966 39.3867L36.0533 37.03L39 39.9767L41.9466 37.03L44.3033 39.3867L41.3566 42.3334ZM34 25.6667V29H44V25.6667H34Z"
                  fill="#D12C15"
                />
              </g>
              <defs>
                <clipPath id="clip0_4264_47553">
                  <rect
                    width="40"
                    height="40"
                    fill="white"
                    transform="translate(18.5 18.5)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-2xl font-lato font-bold text-[#323333] mb-2">
            Are you sure?
          </h2>
          <p className="text-[#323333] font-lato text-xl mb-10">
            This action can't be undone. All information associated with this
            will be lost.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onDelete}
              className="bg-[#D12C15] font-semibold text-base w-32 text-[#F7F8FA] font-lato px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              DELETE
            </button>
            <button
              onClick={onClose}
              className="w-32 text-base font-semibold font-lato border-2 border-[#323333] text-[#323333] px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
