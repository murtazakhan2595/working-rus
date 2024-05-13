import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoCalendarOutline, IoChevronForwardCircleOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { openModal, closeModal, openEmpDropdown, closeEmpDropdown } from '../../../state/slices/ModalSlice';
import { RxCross2, RxPlus } from "react-icons/rx";
import { PiHeadlightsBold, PiUsersLight } from "react-icons/pi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { TbCircleDashed } from "react-icons/tb";
import { department, priority2Options, status2Options, statusOptions, typeOptions } from "../../../data/Data";
import Select from "react-select";
import { fetchEmployees } from "../../../state/slices/EmpSlice";
import { postTasks } from "../../../state/slices/DtrPostSlice";
import { CiViewBoard } from "react-icons/ci";
import { CiCircleMore } from "react-icons/ci";
import { IoMdArrowDropdownCircle, IoMdArrowDropupCircle } from "react-icons/io";
import { FiMinusCircle } from "react-icons/fi";
import { fetchDTRByEmployeeId } from "../../../state/slices/GetDtrSlice";
import { FaAngleUp } from "react-icons/fa6";
import SuccessPopup from "./SuccessPop";
import { getDTRAll } from "../../../state/slices/GetDtrAllSlice";
import { GetAssigneDtr } from "../../../state/slices/GetAssigneDtr";
import ViewTaskDetails from "./ViewTaskDetails";
import UpdateModal from "./UpdateModal";
import { BsThreeDotsVertical } from "react-icons/bs";
import { toggleFilter } from "../../../state/slices/FilterSlice";

const CreateTask = ({ baseUrl, token }) => {

    const statusStyles = {
        Inprogress: "bg-[#FFE8CD] text-[#FF9A1F]",
        Pending: "bg-[#DADADA] text-baseGray",
        Completed: "bg-[#CCEFE3] text-[#5B8C7B]"
    };

    const statusIcons = {
        Low: <IoMdArrowDropdownCircle className=" text-baseGray text-xl" />,
        Medium: <FiMinusCircle className="text-[#FF9A1F] text-xl" />,
        High: <IoMdArrowDropupCircle className="text-[#D12C15] text-xl" />,
    };


    const [formData, setFormData] = useState({
        title: "",
        taskDetails: "",
        startDate: "",
        dueDate: "",
        taskType: null,
        priority: null,
        taskStatus: null,
        assigne: null
    });

    const isOpen = useSelector(state => state.modal.isModalOpen);
    const empDropdown = useSelector(state => state.modal.isEmpDropdownOpen);
    const employees = useSelector(state => state.emp.employees);
    const dtrsAll = useSelector(state => state.getDtrAll.dtrs);
    const filters = useSelector(state => state.filters);
    const assigneDtr = useSelector(state => state.getAssigne.assigneDtr);
    const dispatch = useDispatch();
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    console.log('I am assigne dtr', assigneDtr)

    const [currentDate, setCurrentDate] = useState('');
    const [taskType, setTaskType] = useState(null);
    const [priority, setPriority] = useState(null);
    const [taskStatus, setTaskStatus] = useState(null);
    const [assignToOpen, setAssignToOpen] = useState(false);
    const [assignToUser, setAssignToUser] = useState({});
    const [assignToSearchQuery, setAssignToSearchQuery] = useState("");
    const [tasks, setTasks] = useState([]);
    const [dropdownStates, setDropdownStates] = useState({});
    const [hoveredTask, setHoveredTask] = useState(null);
    const [showHoveredTask, setShowHoveredTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [showFiltersDropdown, setShowFilterDropdown] = useState(false);
    const [filter, setFilter] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(dtrsAll);
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [dueDate, setDueDate] = useState('');

    const userProfile = useSelector(state => state.user.userProfile);

    // Access the id from the userProfile object
    const userId = userProfile.id;


    console.log(tasks);


    useEffect(() => {
        dispatch(getDTRAll());
    }, []);


    useEffect(() => {
        dispatch(fetchEmployees());
    }, []);

    // useEffect(() => {
    //     dispatch(fetchDTRByEmployeeId(userId));
    // }, [dispatch, userId]);


    const filteredAssignToUsers = Object.values(employees).filter((user) =>
        user.username.toLowerCase().includes(assignToSearchQuery.toLowerCase())
    );

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };


    const handleAddTask = (e) => {
        e.preventDefault();

        const formattedStartDate = formatDate(formData.startDate);
        const formattedDueDate = formatDate(formData.dueDate);

        // Create a new task object
        const newTask = {
            ...formData,
            startDate: formattedStartDate,
            dueDate: formattedDueDate,
            assigne: assignToUser
        };

        // Update tasks array state by adding the new task
        setTasks(prevTasks => [...prevTasks, newTask]);

        // Clear form data
        setFormData({
            title: "",
            taskDetails: "",
            dueDate: "",
            taskType: null,
            priority: null,
            taskStatus: null,
            assigne: null
        });

        // Close the modal
        // handleCloseModal();
        dispatch(closeModal())
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };


    const handlePostTasks = async (e) => {
        e.preventDefault();

        try {
            await dispatch(postTasks(tasks)); // Dispatch the postTasks action with tasks data
            setShowSuccessPopup(true); // Show success pop-up after successful API call
            dispatch(fetchDTRByEmployeeId(userId));

            setTasks([]);
            dispatch(getDTRAll());
        } catch (error) {
            console.error("Error posting tasks:", error);
            // Handle error (e.g., show error message)
        }
    };


    const getReportingManager = (userId) => {
        const reportingManager = employees?.find((user) => user.id === userId);
        return reportingManager ? reportingManager.username.toUpperCase().slice(0, 2) : null;
    };

    const groupedTasks = assigneDtr
        ? assigneDtr.reduce((acc, dtr) => {
            acc[dtr.date] = acc[dtr.date] || [];
            acc[dtr.date].push(dtr);
            return acc;
        }, {})
        : {};


    const toggleDropdown = (date) => {
        setDropdownStates(prevState => ({
            ...prevState,
            [date]: !prevState[date]
        }));
    };

    const handleDtrClick = (employeeId, status, type, due_date) => {
        console.log('date changed', due_date);
        // Call the function to fetch the respective person's DTR
        dispatch(GetAssigneDtr({ assigneId: employeeId, status, due_date }));
    };



    const currenDate = new Date();
    const day = currenDate.getDate().toString().padStart(2, '0'); // Add leading zero if needed
    const month = (currenDate.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
    const year = currenDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setOpenUpdateModal(true);
    }

    const handleCheckboxChange = (filterName) => {
        dispatch(toggleFilter({ filterName, value: !filters[filterName] }));
    };

    useEffect(() => {
        const lowerCaseFilter = filter.toLowerCase();
        const filtered = dtrsAll.filter((user) => {
            const userIdWithPrefix = `TXB-${user.employee_id.toString().padStart(4, "0")}`;
            const designation = user.designation || ''
            return (
                userIdWithPrefix.toLowerCase().includes(lowerCaseFilter) ||
                user.employee_name.toLowerCase().includes(lowerCaseFilter)
                || designation.toLowerCase().includes(lowerCaseFilter)
            );
        });
        setFilteredUsers(filtered);
    }, [filter, dtrsAll]);

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setFilter(term);
    };

    const handleStatusChange = (value) => {
        setStatus(value.value);
    };
    const handleTypeChange = (value) => {
        setType(value.value);
    };

    const handleDateChange = (event) => {
        const inputDate = event.target.value; // Get the input value
        const formattedDate = formatDate(inputDate); // Format the input date
        setDueDate(formattedDate); // Set the formatted date to state
    };
    return (
        <div className="flex w-full flex-col h-[100vh] lg:px-6 lg:py-2 bg-gray-50">
            {showSuccessPopup && (
                <SuccessPopup onClose={() => setShowSuccessPopup(false)} heading="DTR Submitted" message="Your daily task report was successfully submitted." />
            )}
            <div className="flex justify-between lg:px-2 lg:py-4">
                {/* <h1 className="font-lato lg:text-[24px] text-baseGray font-bold"> My Daily Task Report</h1> */}
                <div className="flex justify-between">
                    <div className="flex items-center gap-x-2 lg:w-[75vw]">
                        {filters.search &&
                            <input type="text" placeholder="Search by ID, Name or designation"
                                onChange={handleSearchChange}
                                className="pl-2 bg-[#F0F1F2] h-8 outline-none rounded-lg placeholder:text-xs" />}
                        {filters.department &&
                            <Select
                                className="w-[180px]"
                                options={department}
                            // value={department.find(
                            //     (option) => option.label === departmentInfo.department_name
                            // )}
                            // onChange={(selectedOption) =>
                            //     handleChange("department_name", selectedOption.value)
                            // }
                            />}
                        {filters.date &&
                            <input type="date" name="startDate" className="w-[170px] border border-baseGray h-9 rounded-lg px-2"
                                onChange={handleDateChange}
                            />
                        }
                        {filters.priority &&
                            <Select
                                name="priority"
                                options={priority2Options}
                                className="w-[170px]"

                            />
                        }
                        {filters.status &&
                            <Select
                                name="status"
                                options={status2Options}
                                className="w-[170px]"
                                onChange={handleStatusChange}
                            />
                        }
                        {filters.type &&
                            <Select
                                name="type"
                                options={typeOptions}
                                className="w-[180px]"
                                onChange={handleTypeChange}

                            />
                        }
                        {filters.assignes &&
                            <Select
                                name="assignes"
                                options={employees.map((emp) => (
                                    { label: emp.username, value: emp.employee_id }
                                ))}
                                className="w-[180px]"
                            // onChange={handleTypeChange}

                            />
                        }
                    </div>
                    <div className="relative">
                        <div className="bg-[#F0F1F2] w-8 h-8 rounded-md flex justify-center items-center">
                            <BsThreeDotsVertical className="text-xl" onClick={() => setShowFilterDropdown(prev => !prev)} />
                        </div>
                        {showFiltersDropdown && (
                            <div className="absolute top-10 right-4 p-3 w-36 bg-[#FAFBFC] rounded-lg shadow-bottom">
                                <h3 className="font-lato font-semibold">Manage Filters</h3>
                                <div className="font-lato mt-3 flex flex-col gap-y-2">
                                    <div className="flex items-center gap-x-4">
                                        <input type="checkbox" className="w-3.5 h-3.5" checked={filters.search}
                                            onChange={() => handleCheckboxChange('search')} />
                                        <label className="text-sm" htmlFor="search">Search</label>
                                    </div>
                                    <div className="flex items-center gap-x-4">
                                        <input type="checkbox" className="w-3.5 h-3.5" checked={filters.department}
                                            onChange={() => handleCheckboxChange('department')} />
                                        <label className="text-sm" htmlFor="department">Department</label>
                                    </div>
                                    {/* <div className="flex items-center gap-x-4">
                                        <input type="checkbox" className="w-3.5 h-3.5" checked={filters.designation}
                                            onChange={() => handleCheckboxChange('designation')} />
                                        <label className="text-sm" htmlFor="designation">Designation</label>
                                    </div> */}
                                    <div className="flex items-center gap-x-4">
                                        <input type="checkbox" className="w-3.5 h-3.5" checked={filters.date}
                                            onChange={() => handleCheckboxChange('date')} />
                                        <label className="text-sm" htmlFor="date">Date</label>
                                    </div>
                                    <div className="flex items-center gap-x-4">
                                        <input type="checkbox" className="w-3.5 h-3.5" checked={filters.priority}
                                            onChange={() => handleCheckboxChange('priority')} />
                                        <label className="text-sm" htmlFor="priority">Priority</label>
                                    </div>
                                    <div className="flex items-center gap-x-4">
                                        <input type="checkbox" className="w-3.5 h-3.5" checked={filters.status}
                                            onChange={() => handleCheckboxChange('status')} />
                                        <label className="text-sm" htmlFor="status">Status</label>
                                    </div>
                                    <div className="flex items-center gap-x-4">
                                        <input type="checkbox" className="w-3.5 h-3.5" checked={filters.type}
                                            onChange={() => handleCheckboxChange('type')} />
                                        <label className="text-sm" htmlFor="type">Type</label>
                                    </div>
                                    <div className="flex items-center gap-x-4">
                                        <input type="checkbox" className="w-3.5 h-3.5" checked={filters.assignes}
                                            onChange={() => handleCheckboxChange('assignes')} />
                                        <label className="text-sm" htmlFor="assignes">Assignes</label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <div>
                <div className="flex flex-col bg-white lg:px-6 lg:pb-1 lg:pt-3 rounded-lg mb-3">
                    <div className="flex justify-between border-b pb-3">
                        <div className="flex items-center gap-x-2">
                            <div className="w-3 h-3 rounded-full bg-[#25A8E0]"></div>
                            <h3 className="font-lato lg:text-[25px] text-[#323333] font-bold">Today</h3>
                            <div className="text-[#323333]">{currentDate}</div>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <div className="font-lato text-[20px] text-[#47484C] font-bold">Add Task</div>
                            <button onClick={() => dispatch(openModal())} className="p-2 rounded-md bg-black"><FaPlus className="text-white" /></button>
                        </div>

                        {/* modal open */}
                        {isOpen && (
                            <div className="fixed z-50 inset-0 flex items-center justify-center bg-[#4a4a4a69]
                             w-screen overflow-y-auto scroll h-screen">
                                <div className="bg-white lg:p-8 rounded-lg lg:w-[40%] lg:h-[100vh] relative">
                                    <h2 className="text-xl font-lato text-[#323333] font-bold lg:pt-3 lg:mb-3">Add Task</h2>
                                    <button onClick={() => dispatch(closeModal())} className="absolute top-8 right-8"><RxCross2 /></button>
                                    <form onSubmit={handleAddTask}>
                                        <label htmlFor="title" className="text-[18px] font-lato font-semibold text-baseGray">Title</label>
                                        <input id="title" placeholder="Add here" type="text" required name="title" value={formData.title} onChange={(e) => handleChange(e.target.name, e.target.value)} className="block pl-2 lg:w-full outline-none border rounded-lg h-9 border-baseGray placeholder:font-lato lg:mb-4" />
                                        <label htmlFor="taskDetails" className="text-[18px] font-lato font-semibold text-baseGray">Task Details</label>
                                        <textarea name="taskDetails" required value={formData.taskDetails} onChange={(e) => handleChange(e.target.name, e.target.value)} id="taskDetails" className="block pl-2 lg:w-full outline-none border rounded-lg border-baseGray lg:mb-4 placeholder:font-lato" cols="30" rows="4" placeholder="Add here"></textarea>


                                        <div className="flex items-center gap-x-6">
                                            <div className="flex lg:flex-col lg:gap-y-3">
                                                <div className="text-baseGray flex items-center gap-x-2 h-9"><PiUsersLight className="text-xl" />
                                                    <h3 className="font-medium text-[18px] font-lato">Assignee</h3>
                                                </div>
                                                <div className="text-baseGray flex items-center gap-x-2 h-9"><IoCalendarOutline className="text-xl" />
                                                    <h3 className="font-medium text-[18px] font-lato">Start Date</h3>
                                                </div>
                                                <div className="text-baseGray flex items-center gap-x-2 h-9"><IoCalendarOutline className="text-xl" />
                                                    <h3 className="font-medium text-[18px] font-lato">Due Date</h3>
                                                </div>
                                                <div className="text-baseGray flex items-center gap-x-2 h-9"><AiOutlineUnorderedList className="text-xl" />
                                                    <h3 className="font-medium text-[18px] font-lato">Type</h3>
                                                </div>
                                                <div className="text-baseGray flex items-center gap-x-2 h-9"><PiHeadlightsBold className="text-xl" />
                                                    <h3 className="font-medium text-[18px] font-lato">Priority</h3>
                                                </div>
                                                <div className="text-baseGray flex items-center gap-x-2 h-9"><TbCircleDashed className="text-xl" />
                                                    <h3 className="font-medium text-[18px] font-lato">Status</h3>
                                                </div>
                                            </div>
                                            <div className="flex lg:flex-col lg:gap-y-2.5 lg:w-[60%]">
                                                <div className="flex mt-2 gap-2">
                                                    {assignToUser && (
                                                        <div className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer bg-pink-500 border-2">
                                                            <span className="text-white text-sm flex justify-center items-center plus-icon w-9 h-9">
                                                                {/* {assignToUser?.username?.toUpperCase().slice(0, 2)} */}
                                                                {getReportingManager(assignToUser)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div
                                                        // onClick={() => {
                                                        //     setAssignToOpen(!assignToOpen);
                                                        // }}
                                                        onClick={() => dispatch(openEmpDropdown())}
                                                        className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer bg-[#eceaea] border-2"
                                                    >
                                                        <span className="text-white text-2xl flex justify-center items-center plus-icon w-9 h-9">
                                                            <RxPlus />
                                                        </span>
                                                    </div>

                                                    <div className="relative">
                                                        {empDropdown && (
                                                            <div className="absolute w-40  bg-white rounded-md border border-gray-300 shadow-md z-50">
                                                                <div className="flex justify-end pt-[5px] px-[5px]">
                                                                    <RxCross2
                                                                        // onClick={() => {
                                                                        //     setAssignToOpen(!assignToOpen);
                                                                        // }}
                                                                        onClick={() => dispatch(openEmpDropdown())}
                                                                    />
                                                                </div>
                                                                <input
                                                                    type="search"
                                                                    placeholder="Search"
                                                                    className="mt-1 border-b border-t bg-[#D7D7D7] w-[158px] focus:outline-none pl-2 text-gray-600"
                                                                    onChange={(e) =>
                                                                        setAssignToSearchQuery(e.target.value)
                                                                    }
                                                                />

                                                                <div className="overflow-y-auto max-h-24 roundScrollsm">
                                                                    <ul className="text-black">
                                                                        {filteredAssignToUsers.map((user) => (
                                                                            <div
                                                                                onClick={() => {
                                                                                    // setAssignToUser({
                                                                                    //     id: user.id,
                                                                                    //     username: user.username,
                                                                                    // });
                                                                                    setAssignToUser(user.id);
                                                                                    dispatch(closeEmpDropdown())
                                                                                }}
                                                                                className="flex gap-3 px-2 py-1 relative items-center group cursor-pointer"
                                                                                key={user.id}
                                                                            >
                                                                                <div className="rounded-full text-sm bg-cyan-600 text-white flex p-1 w-7 h-7 opacity-60 border justify-center items-center ">
                                                                                    {user.username.toUpperCase().slice(0, 2)}
                                                                                </div>
                                                                                <p className="gap-3 text-sm">
                                                                                    {user.username}
                                                                                </p>
                                                                            </div>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>


                                                <input type="date" name="startDate" required value={formData.startDate} onChange={(e) => handleChange(e.target.name, e.target.value)} className="w-[60%] border border-baseGray h-9 rounded-lg px-2" />
                                                <input type="date" name="dueDate" required value={formData.dueDate} onChange={(e) => handleChange(e.target.name, e.target.value)} className="w-[60%] border border-baseGray h-9 rounded-lg px-2" />

                                                <Select
                                                    name="taskType"
                                                    value={typeOptions.find(
                                                        (opt) => opt.value === taskType
                                                    )}
                                                    options={typeOptions}
                                                    className="w-[60%]"
                                                    isSearchable={false}
                                                    // onChange={(selectedOption) => {
                                                    //     setPriority(selectedOption.value);
                                                    // }}
                                                    onChange={(selectedOption) => {
                                                        handleChange("taskType", selectedOption.value)
                                                    }}
                                                    required
                                                    menuPlacement="auto"
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        control: (provided) => ({
                                                            ...provided,
                                                            border: "1px solid #5C5E64",
                                                            borderRadius: "8px",
                                                        }),
                                                        option: (provided, state) => ({
                                                            ...provided,
                                                            fontSize: "16px",
                                                            fontWeight: state.isSelected ? "bold" : "normal",
                                                            color: state.isSelected ? "#000" : "#777",
                                                            padding: "8px 12px",
                                                            backgroundColor: state.isSelected ? '#E0F3FB' : 'transparent'
                                                        }),
                                                        menu: (provided) => ({
                                                            ...provided,
                                                            borderRadius: "8px",
                                                            overflow: "hidden",
                                                        }),
                                                        scrollbarWidth: (base) => ({
                                                            ...base,
                                                            borderRadius: "8px",
                                                            backgroundColor: "#ccc",
                                                        }),
                                                        dropdownIndicator: (provided) => ({
                                                            ...provided,
                                                            color: "#555",
                                                        }),
                                                    }}
                                                />
                                                <Select
                                                    name="priority"
                                                    value={priority2Options.find(
                                                        (opt) => opt.value === priority
                                                    )}
                                                    options={priority2Options}
                                                    className="w-[60%]"
                                                    isSearchable={false}
                                                    // onChange={(selectedOption) => {
                                                    //     setPriority(selectedOption.value);
                                                    // }}
                                                    onChange={(selectedOption) => {
                                                        handleChange("priority", selectedOption.value)
                                                    }}
                                                    required
                                                    menuPlacement="auto"
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        control: (provided) => ({
                                                            ...provided,
                                                            border: "1px solid #5C5E64",
                                                            borderRadius: "8px",
                                                        }),
                                                        option: (provided, state) => ({
                                                            ...provided,
                                                            fontSize: "16px",
                                                            fontWeight: state.isSelected ? "bold" : "normal",
                                                            color: state.isSelected ? "#000" : "#777",
                                                            padding: "8px 12px",
                                                            backgroundColor: state.isSelected ? '#E0F3FB' : 'transparent'
                                                        }),
                                                        menu: (provided) => ({
                                                            ...provided,
                                                            borderRadius: "8px",
                                                            overflow: "hidden",
                                                        }),
                                                        scrollbarWidth: (base) => ({
                                                            ...base,
                                                            borderRadius: "8px",
                                                            backgroundColor: "#ccc",
                                                        }),
                                                        dropdownIndicator: (provided) => ({
                                                            ...provided,
                                                            color: "#555",
                                                        }),
                                                    }}
                                                />
                                                <Select
                                                    name="status"
                                                    value={status2Options.find(
                                                        (opt) => opt.value === taskStatus
                                                    )}
                                                    options={status2Options}
                                                    className="w-[60%]"
                                                    isSearchable={false}
                                                    // onChange={(selectedOption) => {
                                                    //     setPriority(selectedOption.value);
                                                    // }}
                                                    onChange={(selectedOption) => {
                                                        handleChange("taskStatus", selectedOption.value)
                                                    }}
                                                    required
                                                    menuPlacement="auto"
                                                    styles={{
                                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                                        control: (provided) => ({
                                                            ...provided,
                                                            border: "1px solid #5C5E64",
                                                            borderRadius: "8px",
                                                        }),
                                                        option: (provided, state) => ({
                                                            ...provided,
                                                            fontSize: "16px",
                                                            fontWeight: state.isSelected ? "bold" : "normal",
                                                            color: state.isSelected ? "#000" : "#777",
                                                            padding: "8px 12px",
                                                            backgroundColor: state.isSelected ? '#E0F3FB' : 'transparent'
                                                        }),
                                                        menu: (provided) => ({
                                                            ...provided,
                                                            borderRadius: "8px",
                                                            overflow: "hidden",
                                                        }),
                                                        scrollbarWidth: (base) => ({
                                                            ...base,
                                                            borderRadius: "8px",
                                                            backgroundColor: "#ccc",
                                                        }),
                                                        dropdownIndicator: (provided) => ({
                                                            ...provided,
                                                            color: "#555",
                                                        }),
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className="mt-4 bg-black rounded-lg flex items-center justify-center gap-x-2 text-white font-lato text-base font-semibold w-28 h-10"><FaPlus className="text-white font-normal" />Add</button>
                                    </form>
                                </div>
                            </div>
                        )}
                        {/* modal close */}


                    </div>
                    <div className="max-h-36 overflow-y-auto">
                        {tasks.map((task) => (
                            <div key={task.title} className="flex items-center lg:gap-x-20 lg:px-3 lg:py-1 hover:border my-1 transition-all hover:border-blue-500 hover:rounded-lg">
                                <div className="lg:w-[70%] font-lato lg:flex items-center gap-x-3">
                                    <div className="text-xl font-bold">{task.taskType === "Project" ? <CiViewBoard className="text-[#FF61C0] bg-[#FFE8F6] rounded-full p-0.5" /> : <CiCircleMore className="text-[#935AF2] bg-[#F1E8FF] rounded-full p-0.5" />}</div>
                                    <div className="flex items-center gap-x-2 text-sm px-3 text-baseGray">
                                        <IoCalendarOutline className="text-xl" /> Due
                                        <div className="font-lato">{task.dueDate.slice(0, 5)}</div>
                                    </div>
                                    <h3 className="text-[18px] font-bold text-[#323333]">{task.title}</h3>
                                </div>
                                <div className="lg:w-[30%] flex items-center justify-end gap-x-4">
                                    <div className="text-2xl">{statusIcons[task.priority]}</div>
                                    <div className="flex justify-between items-center lg:w-24">
                                        <div className={`px-3 py-1 rounded-lg ${statusStyles[task.taskStatus]}`}>{task.taskStatus}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-[#DF418D] text-sm">{getReportingManager(task.assigne)}</div>
                                    {/* <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-[#DF418D] text-sm">{task.assignee?.username?.split(' ')
                                    .map(word => word[0].toUpperCase())
                                    .join('')
                                    .slice(0, 2)}</div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end border-t">
                        {tasks.length > 0 && <button className="my-2 py-2 px-6 rounded-lg bg-[#323333] text-white" onClick={handlePostTasks}>Submit</button>
                        }
                    </div>
                </div>

            </div>


            {/* display all employees names */}
            <div className="flex">
                <div className="w-[30%] lg:max-h-[75vh] overflow-y-auto bg-[#f0f1f2]">
                    {filteredUsers?.map((dtr) => (
                        <div className="flex items-center gap-x-2 group relative">
                            <div className="flex items-center gap-x-2 border-b m-1 p-2 w-full hover:bg-blue-100 hover:rounded-md">
                                <div className="w-12 h-12 rounded-full flex items-center text-xl justify-center text-white bg-[#DF418D] tracking-wider">{dtr.employee_name.toUpperCase().slice(0, 2)}</div>
                                <div className="flex flex-col leading-none">
                                    <div className="text-gray-400 text-sm leading-none">TXB-{dtr.employee_id.toString().padStart(4, "0")}</div>
                                    <div className="font-semibold text-[16px] text-[#323333] font-lato">{dtr.employee_name}</div>
                                    <div className="flex items-center gap-x-1">
                                        <div className="text-gray-400 text-sm">{dtr.department}</div>
                                        <div className="text-gray-400 text-sm border-l-4 pl-1">{dtr.designation}</div>
                                    </div>
                                </div>
                            </div>
                            <IoChevronForwardCircleOutline
                                className="text-xl absolute top-7 right-3 opacity-0 group-hover:opacity-100 cursor-pointer"
                                onClick={() => {
                                    handleDtrClick(dtr.assigne, status, type, dueDate);
                                }}
                            />

                        </div>
                    ))}
                </div>

                {/* update task modal */}
                {openUpdateModal && selectedTask && (
                    <UpdateModal
                        task={selectedTask}
                        onClose={() => setOpenUpdateModal(false)}
                        getReportingManager={getReportingManager}
                        setAssignToSearchQuery={setAssignToSearchQuery}
                        filteredAssignToUsers={filteredAssignToUsers}
                        handleDtrClick={handleDtrClick}
                    />
                )}

                <div className="w-[70%] lg:max-h-[80vh] overflow-y-auto">
                    {Object.entries(groupedTasks).map(([date, tasks]) => (
                        <div key={date} className="w-full m-0">
                            <div className={`font-normal font-lato text-[18px] text-[#323333] rounded-lg px-4 py-2 border-b ${dropdownStates[date] ? 'bg-blue-100' : ''}`}>
                                <div onClick={() => toggleDropdown(date)} className="focus:outline-none flex items-center justify-between cursor-pointer">
                                    {date}
                                    <FaAngleUp className={`text-sm transform transition-transform duration-300 ${dropdownStates[date] ? 'rotate-180' : ''}`} />
                                </div>
                            </div>
                            <div className={dropdownStates[date] ? '' : 'hidden'}>
                                {tasks.map(task => (
                                    <div key={task.task} className="flex items-center lg:gap-x-20 lg:px-3 lg:py-1 hover:border my-1 transition-all hover:border-blue-500 hover:rounded-lg"
                                        onMouseEnter={() => setHoveredTask(task)}
                                        onMouseLeave={() => setHoveredTask(null)}
                                        // onClick={() => setShowHoveredTask(true)}
                                        onClick={() => handleTaskClick(task)}
                                    >
                                        <div className="lg:w-[70%] font-lato lg:flex items-center gap-x-3">
                                            <div className="text-xl font-bold">
                                                {task.Type === "Project" ? (
                                                    <CiViewBoard className="text-[#FF61C0] bg-[#FFE8F6] rounded-full p-0.5" />
                                                ) : (
                                                    <CiCircleMore className="text-[#935AF2] bg-[#F1E8FF] rounded-full p-0.5" />
                                                )}
                                            </div>
                                            <div className={`flex items-center gap-x-2 text-sm px-2 ${task?.due_date < formattedDate ? 'text-[#D96C6C] bg-[#F2DCDA] rounded-lg py-1' : 'text-baseGray'}`}>
                                                <IoCalendarOutline className="text-xl" /> Due
                                                <div className={`font-lato`}>
                                                    {task?.due_date?.slice(0, 5)}

                                                </div>
                                            </div>
                                            <h3 className="text-[18px] font-bold text-[#323333]">{task.task}</h3>
                                        </div>
                                        <div className="lg:w-[30%] flex items-center justify-end gap-x-4">
                                            <div className="text-2xl">{statusIcons[task.priorty]}</div>
                                            <div className="flex justify-between items-center lg:w-24">
                                                <div className={`px-3 py-1 rounded-lg ${statusStyles[task.status]}`}>
                                                    {task.status}
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-[#DF418D] text-sm">
                                                {getReportingManager(task.assigne)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>


                {/* view task card started */}
                {(hoveredTask) && (
                    <ViewTaskDetails hoveredTask={hoveredTask} setShowHoveredTask={setShowHoveredTask} statusIcons={statusIcons} getReportingManager={getReportingManager} statusStyles={statusStyles} />
                )}
                {/* view task card ended */}
            </div>

        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        token: state.user.token,
        baseUrl: state.user.baseUrl,
    };
};

export default connect(mapStateToProps)(CreateTask);
