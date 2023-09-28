import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { RxCross2 } from 'react-icons/rx';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { connect } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const DailyTaskRpt = ({ token, baseUrl }) => {
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

    const handleSave = () => {
        try {
            const dataToSave = JSON.stringify({ description: editorHtml, date: selectedDate });
            localStorage.setItem('dailyTaskData', dataToSave);
            closeModal();

            toast.success('Data saved successfully!', {
                position: toast.POSITION.TOP_RIGHT,
            });
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error('Error saving the data. Please try again.', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    const handleSubmit = async () => {
        const data = {
            description: editorHtml,
        };

        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(`${baseUrl}/dtr/`, data, { headers });
            if (response.status === 201){
                toast.success('DTR submitted successfully!', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            }

            setEditorHtml("");
            closeModal();
            localStorage.removeItem('dailyTaskData');
        } catch (error) {
            console.error('API Error:', error);

            // Show an error notification
            toast.error('Error submitting the form. Please try again.', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };


    useEffect(() => {
        const savedData = localStorage.getItem('dailyTaskData');
        if (savedData) {
            const { description } = JSON.parse(savedData);
            setEditorHtml(description)
        }
    }, [])

    return (
        <>
            <div className='flex flex-col md:flex-row md:bg-white justify-between items-center font-sfpro bg-none lg:bg-white rounded-full mx-2 lg:mx-10 mt-3 mb-9'>
                <div>
                    <h1 className='text-xl font-bold lg:pl-12 md:pl-8 py-2 lg:py-0'>Daily Task Report</h1>
                </div>
                <div className='flex items-center py-1 rounded-full'>
                    <span className='-z-0 px-3 lg:px-6  text-sm'><CustomDatePicker selectedDate={selectedDate} onChange={date => setSelectedDate(date)} /></span>
                    <button
                        className='border-2 border-[#283B91] bg-[#283B91] text-white rounded-full lg:rounded-3xl px-7 py-1 mr-1 lg:mr-2 hover:bg-white hover:text-[#283B91]'
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
                                <div className="h-72 mt-4 w-full resize-none overflow-y-auto outline-none roundScrollsm rounded-2xl border-none bg-white">
                                    <ReactQuill
                                        className='text-center'
                                        style={{ height: "200px" }}
                                        value={editorHtml}
                                        onChange={handleEditorChange}
                                        modules={{
                                            toolbar: {
                                                container: [
                                                    [{ size: ["small", false, "large", "huge"] }],
                                                    ["bold", "italic", "underline"],
                                                    [{ list: "ordered" }, { list: "bullet" }],
                                                    [{ align: [] }],
                                                    ["link", "image"],
                                                ],
                                            },
                                        }}
                                    />
                                </div>
                                {/* Buttons */}
                                <div className="flex justify-center space-x-10">
                                    <CustomButton text="Save" className="custom-class" onClick={handleSave} />
                                    <CustomButton text="Submit" className="custom-class" onClick={handleSubmit} />
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
            <ToastContainer />
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        token: state.user.token,
        baseUrl: state.user.baseUrl,
    };
};

export default connect(mapStateToProps)(DailyTaskRpt);
