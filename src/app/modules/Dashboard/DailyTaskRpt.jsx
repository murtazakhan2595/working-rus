import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RxCross2 } from 'react-icons/rx';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CustomButton = ({ text, onClick, className }) => {
    return (
        <button
            type="button"
            className={`py-1 w-28 rounded-xl mt-10 mb-2 bg-[#283B91] text-white ${className}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

const CustomDatePicker = ({ selectedDate, onChange }) => {
    return (
        <DatePicker
            selected={selectedDate}
            onChange={onChange}
            disabled
            dateFormat="MMMM-d-yyyy"
            className='bg-transparent z-50 border-none outline-none'
        />
    );
};

const DailyTaskRpt = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editorHtml, setEditorHtml] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleEditorChange = html => {
        setEditorHtml(html);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handlePopupToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleSubmit = () => {
        const formattedDate = selectedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const data = {
            currentDate: formattedDate,
            editorData: editorHtml,
        };
        console.log('Submitted Data', data);

        setEditorHtml("");
        closeModal();
    };

    return (
        <>
            <div className='flex flex-col md:flex-row md:bg-white justify-between items-center font-sfpro bg-none lg:bg-white rounded-full mx-2 lg:mx-10 mt-3 mb-9'>
                <div>
                    <h1 className='text-xl font-bold lg:pl-12 md:pl-8 py-2 lg:py-0'>Daily Task Report</h1>
                </div>
                <div className='bg-[#283B91] flex items-center py-1 text-white rounded-full'>
                    <span className='z-50 px-3 lg:px-6'><CustomDatePicker selectedDate={selectedDate} onChange={date => setSelectedDate(date)} /></span>
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
                                        <span className="text-lg"><CustomDatePicker selectedDate={selectedDate} onChange={date => setSelectedDate(date)} /></span>
                                    </div>
                                </div>
                                {/* Date drop down ended */}

                                {/* Text area */}
                                <div className="h-72 mt-4 w-full resize-none overflow-y-auto outline-none roundScrollsm rounded-2xl border-none bg-white">

                                    <ReactQuill
                                        className='text-center'
                                        style={{ height: "200px" }}
                                        value={editorHtml}
                                        onChange={handleEditorChange}
                                        modules={{
                                            toolbar: {
                                                container: [
                                                    ["bold", "italic", "underline", "strike"],
                                                    [{ list: "ordered" }, { list: "bullet" }],
                                                    [{ align: [] }],
                                                    ["link", "image"],
                                                    // [
                                                    //     { header: "1" },
                                                    //     { header: "2" },
                                                    // ],
                                                    [{ size: ["small", false, "large", "huge"] }],
                                                ],
                                            },
                                        }}
                                    />

                                </div>
                                {/* Buttons */}
                                <div className="flex justify-center space-x-10">
                                    <CustomButton text="Save" className="custom-class" />
                                    <CustomButton text="Submit" className="custom-class" onClick={handleSubmit} />
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
