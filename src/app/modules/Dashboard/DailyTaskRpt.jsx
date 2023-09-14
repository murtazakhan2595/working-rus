import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';
import { RxCross2 } from 'react-icons/rx';

const CustomButton = ({ text, onClick, className }) => {
    return (
        <button
            type="button"
            className={`py-1 w-28 rounded-xl mt-10 mb-2 bg-[#283B91] text-white ${className}`}
        >
            {text}
        </button>
    );
};

const CustomDatePicker = ({ closeModal }) => {
    const [startDate, setStartDate] = useState(
        setHours(setMinutes(new Date(), 30), 16)
    );


    // return (
    //     <div>
    //         <DatePicker
    //             selected={startDate}
    //             // onChange={handleDatePickerChange}
    //             dateFormat="MMMM-d-yyyy"
    //             className='bg-[#283B91] z-50 border-none outline-none'
    //         />
    //     </div>
    // );

    const currentDate = new Date();

    return (
        <DatePicker
            selected={currentDate}
            onChange={() => { }}
            disabled
            dateFormat="MMMM-d-yyyy"
            className='bg-transparent z-50 border-none outline-none'
        />
    );
};

const DailyTaskRpt = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handlePopupToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <div className='flex flex-col md:flex-row md:bg-white justify-between items-center font-sfpro bg-none lg:bg-white rounded-full mx-2 lg:mx-10 mt-3 mb-9'>
                <div>
                    <h1 className='text-xl font-bold lg:pl-12 md:pl-8 py-2 lg:py-0'>Daily Task Report</h1>
                </div>
                <div className='bg-[#283B91] flex items-center py-1 text-white rounded-full'>
                    <span className='z-50 px-3 lg:px-6'><CustomDatePicker closeModal={closeModal} /></span>
                    <button
                        className='border-2 border-white rounded-full lg:rounded-xl px-7 mr-1 lg:mr-2 hover:bg-white hover:text-[#283B91]'
                        onClick={handlePopupToggle}
                    >
                        Submit Daily Task Report
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <>
                    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"></div>
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="md:mx-auto w-full max-w-md relative">
                            <div className="space-y-3 my-2 bg-[#F8F8F8] lg:pt-8 lg:pb-4 py-6 rounded-3xl p-8 m-6 max-w-800 border border-gray-100 shadow-md relative">
                                <div
                                    className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
                                    onClick={closeModal}
                                >
                                    <RxCross2 />
                                </div>
                                <div className="flex justify-center px-4 py-0">
                                    <div className="flex items-center">
                                        <span className="text-lg"><CustomDatePicker /></span>
                                    </div>
                                    {/* <div className="relative">
                                        <button
                                            className="p-2 rounded-full"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M2.293 5.293a1 1 0 011.414 0L10 11.586l6.293-6.293a1 1 0 111.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div> */}
                                </div>
                                {/* Date drop down ended */}

                                {/* Text area */}
                                <div className="h-72">
                                    <textarea
                                        className=" mt-4 w-full h-full resize-none overflow-y-auto outline-none roundScrollsm rounded-2xl p-3"
                                        rows="5"
                                        placeholder="Drop in your DTR Details here"
                                    ></textarea>
                                </div>
                                {/* Buttons */}
                                <div className="flex justify-center space-x-10">
                                    <CustomButton text="Save" className="custom-class" />
                                    <CustomButton text="Submit" className="custom-class" />


                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default DailyTaskRpt;
