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
import Joi from 'joi';

const schema = Joi.object({
    description: Joi.string().required().label('DTR')
});

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
            dateFormat="d-MMMM-yyyy"
            className='bg-transparent z-50 border-none outline-none'
        />
    );
};

const DailyTaskRpt = ({ token, baseUrl }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editorHtml, setEditorHtml] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [validationErrors, setValidationErrors] = useState({});
    const [formFilled, setFormFilled] = useState(true);
    const [submittedOnce, setSubmittedOnce] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date(),
        task: '',
        status: '',
        priorty: '',
        task_start_date: '',
        task_end_date: '',
        totalTaskDays: '',
        due_date: '',
        assigne: '',
        notes: ''
    });

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handlePopupToggle = () => {
        setIsModalOpen(!isModalOpen);
    };


    const handleSubmit = (e) => {

    };



    useEffect(() => {
        const savedData = localStorage.getItem('dailyTaskData');
        if (savedData) {
            const { description } = JSON.parse(savedData);
            setEditorHtml(description);
        }
    }, []);


    return (
        <>
            <div className='flex flex-col md:flex-row md:bg-white justify-between items-center font-sfpro bg-none lg:bg-white rounded-full mx-2 lg:mx-10 mt-3 mb-9'>
                <div>
                    <h1 className='text-xl font-bold lg:pl-12 md:pl-8 py-2 lg:py-0'>Daily Task Report</h1>
                </div>
                <div className='flex flex-col md:flex-row items-center py-1 rounded-full'>
                    <span className='-z-0 pl-20 lg:px-6  text-sm '><CustomDatePicker selectedDate={selectedDate} onChange={date => setSelectedDate(date)} /></span>
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
                        <div className="w-full">
                            <div className="space-y-3 my-2 bg-[#F8F8F8] lg:pt-8 lg:pb-4 py-6 rounded-3xl lg:p-6 md:p-5 p-3 lg:m-6 m-4 max-w-800 border border-gray-100 shadow-md relative">
                                <div
                                    className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer"
                                    onClick={closeModal}
                                >
                                    <RxCross2 />
                                </div>
                                <div className="flex justify-center px-4 py-0">
                                    <div className="flex items-center">
                                        <span className="text-xl font-semibold">Today's DTR</span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className='bg-[#EBEBEB] h-14 text-base'>
                                                <th className='border-2 border-white'>Date</th>
                                                <th className='border-2 border-white'>Task</th>
                                                <th>Status</th>
                                                <th className='border-2 border-white'>Priority</th>
                                                <th className='border-2 border-white'>Task Start Date</th>
                                                <th className='border-2 border-white'>Task End Date</th>
                                                <th className='border-2 border-white'>Total Task Days</th>
                                                <th className='border-2 border-white'>Due Date</th>
                                                <th className='border-2 border-white'>Assignee</th>
                                                <th className='border-2 border-white'>Notes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className='h-14'>
                                                <div className="w-24 text-sm">
                                                    <DatePicker
                                                        name='date'
                                                        selected={formData.date}
                                                        onChange={date => handleChange('date', date)}
                                                        dateFormat="d-MMM-yyyy"
                                                        className='bg-transparent z-50 border-none outline-none'
                                                    />
                                                </div>
                                                <td className='h-14'>
                                                    <textarea name="task" className='h-full' value={formData.task} onChange={e => handleChange(e.target.name, e.target.value)} cols="30" rows="4"></textarea>
                                                </td>
                                                <td className='h-14'><input type="text" name="status" value={formData.status} onChange={e => handleChange(e.target.name, e.target.value)} className="w-full h-full" /></td>
                                                <td className='h-14'><input type="text" name="priority" value={formData.priority} onChange={e => handleChange(e.target.name, e.target.value)} className="w-full h-full" /></td>
                                                <td><input type="date" name="taskStartDate" value={formData.taskStartDate} onChange={handleChange} className="w-full" /></td>
                                                <td><DatePicker
                                                    selected={formData.date}
                                                    onChange={date => handleChange('date', date)}
                                                    dateFormat="d-MMM-yyyy"
                                                    className='bg-transparent z-50 border-none outline-none'
                                                /></td>
                                                <td><input type="date" name="taskEndDate" value={formData.taskEndDate} onChange={handleChange} className="w-full" /></td>
                                                <td><input type="number" name="totalTaskDays" value={formData.totalTaskDays} onChange={handleChange} className="w-full" /></td>
                                                <td><input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full" /></td>
                                                <td><input type="text" name="assignee" value={formData.assignee} onChange={handleChange} className="w-full" /></td>
                                                <td><input type="text" name="notes" value={formData.notes} onChange={handleChange} className="w-full" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/* Buttons */}
                                <div className="flex justify-center space-x-10">
                                    <CustomButton text="Save" className="custom-class"
                                    // onClick={handleSave} 

                                    />
                                    <CustomButton text="Submit" className="custom-class" disabled={isLoading} onClick={handleSubmit} />
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
