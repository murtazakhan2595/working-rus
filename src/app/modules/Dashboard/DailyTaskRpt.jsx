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
import { GoPlusCircle } from "react-icons/go";
import Joi from 'joi';
import Select from "react-select";

const schema = Joi.object({
    description: Joi.string().required().label('DTR')
});



const CustomButton = ({ text, type, onClick, className }) => {
    return (
        <button
            type={type}
            className={`py-1 w-28 rounded-xl mb-2 bg-[#283B91] text-white ${className}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

// const CustomDatePicker = ({ selectedDate, onChange }) => {
//     return (
//         <DatePicker
//             selected={selectedDate}
//             onChange={onChange}
//             disabled
//             dateFormat="d-MMMM-yyyy"
//             className='bg-transparent z-50 border-none outline-none'
//         />
//     );
// };

const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Inprogress", label: "In Progress" },
    { value: "Done", label: "Completed" },
];

const priorityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
];

const DailyTaskRpt = ({ userProfile, token, baseUrl }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editorHtml, setEditorHtml] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [managers, setManagers] = useState([]);
    const [formData, setFormData] = useState([{
        employee_id: userProfile.id,
        date: new Date(),
        task: '',
        status: '',
        priorty: '',
        task_start_date: new Date(),
        task_end_date: new Date(),
        total_task_days: 0,
        due_date: new Date(),
        assigne: 0,
        notes: '',
    }]);

    // const handleChange = (index, name, value) => {
    //     const newTasks = [...formData]
    //     newTasks[index][name] = value;
    //     setFormData(newTasks)
    // };

    const handleChange = (index, name, value) => {
        const newTasks = [...formData];
        if (name === "total_task_days") {
            // Parse the value to an integer
            newTasks[index][name] = parseInt(value);
        } else {
            newTasks[index][name] = value;
        }
        setFormData(newTasks);
    };

    /*  const handleChange = (name, value) => {
         setFormData({
             ...formData,
             [name]: value
         });
     }; */


    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handlePopupToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleAddTask = () => {
        setFormData([...formData, {
            employee_id: userProfile.id,
            date: new Date(),
            task: '',
            status: '',
            priorty: '',
            task_start_date: new Date(),
            task_end_date: new Date(),
            total_task_days: 0,
            due_date: new Date(),
            assigne: 0,
            notes: '',
        }])
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/emplistofmanager/`, { headers });
                if (response.status === 200) {
                    setManagers(response.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle errors here if needed
            }
        };

        if (isModalOpen) {
            fetchData();
        }
    }, [isModalOpen]);




    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Iterate over formData and submit each task individually
            for (const task of formData) {
                // Send task data to the API
                const response = await axios.post(`${baseUrl}/dtr`, task, { headers });

                // Handle the response
                console.log('API response:', response.data);
            }

            // Optionally, reset the form data after successful submission
            setFormData([
                {
                    employee_id: userProfile.id,
                    date: new Date(),
                    task: '',
                    status: '',
                    priorty: '',
                    task_start_date: new Date(),
                    task_end_date: new Date(),
                    total_task_days: 0,
                    due_date: new Date(),
                    assigne: '',
                    notes: '',
                },
            ]);

            // Optionally, close the modal or perform any other actions
            closeModal();

            // Show a success message to the user
            toast.success('Data submitted successfully!');
        } catch (error) {
            // Handle any errors
            console.error('Error submitting data:', error);
            // You can display an error message to the user or perform any other error handling here
            toast.error('Failed to submit data. Please try again.');
        }
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //    console.log('form data', formData);
    // };

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
                    {/* <span className='-z-0 pl-20 lg:px-6  text-sm '><CustomDatePicker selectedDate={selectedDate} onChange={date => setSelectedDate(date)} /></span> */}
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
                        <div className="w-full h-full">
                            <div className="space-y-3 my-2 bg-[#F8F8F8] lg:pt-8 lg:pb-4 py-6 rounded-3xl lg:p-6 md:p-5 p-3 lg:m-6 m-4 max-w-800 lg:h-[90%] border border-gray-100 shadow-md relative">
                                <div className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer" onClick={closeModal}>
                                    <RxCross2 />
                                </div>
                                <div className="flex justify-center px-4 py-0">
                                    <div className="flex items-center">
                                        <span className="text-xl font-semibold">Today's DTR</span>
                                    </div>
                                </div>
                                <div style={{ maxHeight: 'calc(80vh - 200px)', overflow: 'visible' }} className="overflow-auto roundScrollsm">
                                    <form className='h-[23rem] overflow-auto roundScrollsm'>
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-[#EBEBEB] h-14 text-base">
                                                    <th className="border-2 border-white">Date</th>
                                                    <th className="border-2 border-white">Task</th>
                                                    <th className="border-2 border-white">Status</th>
                                                    <th className="border-2 border-white">Priority</th>
                                                    <th className="border-2 border-white">Task Start Date</th>
                                                    <th className="border-2 border-white">Task End Date</th>
                                                    <th className="border-2 border-white">Total Task Days</th>
                                                    <th className="border-2 border-white">Due Date</th>
                                                    <th className="border-2 border-white">Assignee</th>
                                                    <th className="border-2 border-white">Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.map((task, index) => (
                                                    <tr key={index}>
                                                        <td className="h-14 border-2 bg-white border-[#F8F8F8]">
                                                            <div className="w-28 text-sm">
                                                                <DatePicker
                                                                    selected={task.date}
                                                                    onChange={(date) => handleChange(index, 'date', date)}
                                                                    dateFormat="d-MMMM-yyyy"
                                                                    className="bg-transparent z-50 border-none outline-none"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="h-10 border-2 border-[#F8F8F8]">
                                                            <textarea name="task" className="h-full" value={task.task} onChange={(e) => handleChange(index, e.target.name, e.target.value)} cols="30" rows="2" required></textarea>
                                                        </td>
                                                        <td className="h-14 border-2 bg-white border-[#F8F8F8]">
                                                            <Select
                                                                className="w-[130px] h-full"
                                                                menuPlacemnt="top"
                                                                name="status"
                                                                options={statusOptions}
                                                                onChange={(selectedOption) => handleChange(index, "status", selectedOption.value)}
                                                            />
                                                        </td>
                                                        <td className="h-14 border-2 bg-white border-[#F8F8F8]">
                                                            <Select
                                                                className="w-[110px] h-full"
                                                                menuPlacemnt="top"
                                                                name="priorty"
                                                                options={priorityOptions}
                                                                onChange={(selectedOption) => handleChange(index, "priorty", selectedOption.label)}
                                                            />
                                                        </td>
                                                        <td className="h-14 border-2 border-[#F8F8F8]">
                                                            <div className="w-28 text-sm">
                                                                <DatePicker
                                                                    selected={task.task_start_date}
                                                                    onChange={(date) => handleChange(index, 'task_start_date', date)}
                                                                    dateFormat="d-MMMM-yyyy"
                                                                    className="bg-transparent z-50 border-none outline-none"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="h-14 border-2 border-[#F8F8F8]">
                                                            <div className="w-28 text-sm">
                                                                <DatePicker
                                                                    selected={task.task_end_date}
                                                                    onChange={(date) => handleChange(index, 'task_end_date', date)}
                                                                    dateFormat="d-MMMM-yyyy"
                                                                    className="bg-transparent z-50 border-none outline-none"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="h-14 border-2 border-[#F8F8F8]">
                                                            <input className="w-full h-full" type="number" name="total_task_days" value={task.total_task_days} onChange={(e) => handleChange(index, e.target.name, e.target.value)} />
                                                        </td>
                                                        <td className="h-14 border-2 border-[#F8F8F8]">
                                                            <div className="w-28 text-sm">
                                                                <DatePicker
                                                                    selected={task.due_date}
                                                                    onChange={(date) => handleChange(index, 'due_date', date)}
                                                                    dateFormat="d-MMMM-yyyy"
                                                                    className="bg-transparent z-50 border-none outline-none"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="h-14 border-2 bg-white border-[#F8F8F8]">
                                                            <Select
                                                                menuPlacement="auto"
                                                                className="w-[110px] h-full"
                                                                menuPlacemnt="top"
                                                                name="assigne"
                                                                options={managers.map((manager) => ({
                                                                    value: manager.id,
                                                                    label: manager.username,
                                                                }))}
                                                                value={managers.find(
                                                                    (option) => option.username === formData.assigne
                                                                )}
                                                                onChange={(selectedOption) =>
                                                                    handleChange(index, "assigne", selectedOption.value)
                                                                }
                                                                styles={{
                                                                    menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                                    control: (provided) => ({ ...provided, minHeight: 0 }),
                                                                    indicatorsContainer: (provided) => ({ ...provided, display: "none" }),
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="h-14 border-2 border-[#F8F8F8]">
                                                            <input type="text" name="notes" value={task.notes} onChange={(e) => handleChange(index, e.target.name, e.target.value)} className="w-full h-full" />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </form>
                                </div>
                                <div className="flex items-center justify-center gap-x-2 text-[#25A8E0] font-sfpro border-2 border-gray-200 py-2 px-4 rounded-md w-44 mx-auto" style={{ marginTop: '60px' }} onClick={handleAddTask}>
                                    <GoPlusCircle className="text-xl" />
                                    <button>Add New Task</button>
                                </div>
                                <div className="flex justify-center space-x-10">
                                    <CustomButton text="Save" type="button" className="custom-class" />
                                    <CustomButton text="Submit" type="Submit" onClick={handleSubmit} className="custom-class" disabled={isLoading} />
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
        userProfile: state.user.userProfile,
        token: state.user.token,
        baseUrl: state.user.baseUrl,
    };
};

export default connect(mapStateToProps)(DailyTaskRpt);
