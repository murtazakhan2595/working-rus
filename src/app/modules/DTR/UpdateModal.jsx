import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { connect } from "react-redux";
import { openModal, closeModal, openEmpDropdown, closeEmpDropdown } from '../../../state/slices/ModalSlice';
import { RxCross2, RxPlus } from "react-icons/rx";
import { PiHeadlightsBold, PiUsersLight } from "react-icons/pi";
import { AiOutlineUnorderedList } from "react-icons/ai";
import { TbCircleDashed } from "react-icons/tb";
import { priority2Options, status2Options, statusOptions, typeOptions } from "../../../data/Data";
import Select from "react-select";
import { updateTask } from "../../../state/slices/UpdateDtrSlice";
import { fetchDTRByEmployeeId } from "../../../state/slices/GetDtrSlice";
import { getDTRAll } from "../../../state/slices/GetDtrAllSlice";


const UpdateModal = ({ task, getReportingManager, setAssignToSearchQuery, filteredAssignToUsers, onClose, handleDtrClick }) => {

    const userProfile = useSelector(state => state.user.userProfile);

    // Access the id from the userProfile object
    const userId = userProfile.id;

    const [formData, setFormData] = useState(task);
    const [assignToUser, setAssignToUser] = useState({});

    const dispatch = useDispatch();
    const empDropdown = useSelector(state => state.modal.isEmpDropdownOpen);

    const handleUpdate = (name, value) => {
        // Check if the updated field is task_start_date or due_date
        if (name === "task_start_date" || name === "due_date") {
            // Convert the date format to dd-mm-yyyy
            value = convertToDDMMYYYY(value);
        }
        // Update the formData state
        setFormData({ ...formData, [name]: value });
    };

    // Function to convert date format from YYYY-MM-DD to dd-mm-yyyy
    const convertToDDMMYYYY = (dateString) => {
        // Convert the date string from YYYY-MM-DD to dd-mm-yyyy
        if (!dateString) return ""; // Return empty string if dateString is falsy
        const [year, month, day] = dateString.split("-");
        return `${day}-${month}-${year}`;
    };


    const handleUpdateTask = async (e) => {
        e.preventDefault();

        try {
            console.log("Updating task:", formData);
            const response = await dispatch(updateTask(formData));
            // Dispatch the updateTask action with formData
            console.log('i am update response', response);
            console.log("Task updated successfully!");
            // Ensure that the update was successful before showing the success popup
            // setShowSuccessPopup(true); // Show success pop-up after successful API call
            // dispatch(fetchDTRByEmployeeId(userId)); // Fetch updated data after successful update
            // dispatch(getDTRAll());
            if (response) {
                handleDtrClick(response.payload.assigne)
            }
            onClose(); // Close the modal after successful update
        } catch (error) {
            console.error("Error updating task:", error);
            // Handle error (e.g., show error message)
        }
    };

    // const handleUpdateTask = async (e) => {
    //     e.preventDefault();

    //     try {
    //         await dispatch(updateTask(formData)); // Dispatch the postTasks action with tasks data
    //         setShowSuccessPopup(true); // Show success pop-up after successful API call
    //         dispatch(fetchDTRByEmployeeId(userId));
    //         onClose()
    //     } catch (error) {
    //         console.error("Error posting tasks:", error);
    //         // Handle error (e.g., show error message)
    //     }
    // };

    // const handleUpdateTask = async (e) => {
    //     e.preventDefault();
    //     console.log("Form Data:", formData);
    //     dispatch(closeModal());
    // };

    const convertToYYYYMMDD = (dateString) => {
        // Split the date string into day, month, and year
        const [day, month, year] = dateString.split("-");
        // Construct the date in "YYYY-MM-DD" format
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white lg:p-8 rounded-lg lg:w-[40%] lg:h-[95vh] relative">
                    <h2 className="text-xl font-lato text-[#323333] font-bold lg:pt-4 lg:mb-4">Update Task</h2>
                    <button onClick={() => onClose()} className="absolute top-6 right-8"><RxCross2 /></button>
                    <form onSubmit={handleUpdateTask}>
                        <label htmlFor="task" className="text-[18px] font-lato font-semibold text-baseGray">Title</label>
                        <input id="task" placeholder="Add here" type="text" required name="task" value={formData.task} onChange={(e) => handleUpdate(e.target.name, e.target.value)} className="block pl-2 lg:w-full outline-none border rounded-lg h-9 border-baseGray placeholder:font-lato lg:mb-4" />
                        <label htmlFor="task_details" className="text-[18px] font-lato font-semibold text-baseGray">Task Details</label>
                        <textarea name="task_details" required value={formData.task_details} onChange={(e) => handleUpdate(e.target.name, e.target.value)} id="task_details" className="block pl-2 lg:w-full outline-none border rounded-lg border-baseGray lg:mb-4 placeholder:font-lato" cols="30" rows="4" placeholder="Add here"></textarea>


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
                                    {formData.assigne && (
                                        <div className="w-9 h-9 rounded-full flex justify-center items-center cursor-pointer bg-pink-500 border-2">
                                            <span className="text-white text-sm flex justify-center items-center plus-icon w-9 h-9">
                                                {/* {assignToUser?.username?.toUpperCase().slice(0, 2)} */}
                                                {getReportingManager(formData.assigne)}
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


                                <input
                                    type="date"
                                    name="task_start_date"
                                    value={convertToYYYYMMDD(formData.task_start_date) || ""}
                                    onChange={(e) => handleUpdate(e.target.name, e.target.value)}
                                    className="w-[60%] border border-baseGray h-9 rounded-lg px-2"
                                />

                                <input
                                    type="date"
                                    name="due_date"
                                    value={convertToYYYYMMDD(formData.due_date) || ""}
                                    onChange={(e) => handleUpdate(e.target.name, e.target.value)}
                                    className="w-[60%] border border-baseGray h-9 rounded-lg px-2"
                                />

                                <Select
                                    name="Type"
                                    // value={typeOptions.find(
                                    //     (opt) => opt.value === taskType
                                    // )}
                                    value={typeOptions.find(
                                        (opt) => opt.value === formData.Type
                                    )}
                                    options={typeOptions}
                                    className="w-[60%]"
                                    isSearchable={false}
                                    // onChange={(selectedOption) => {
                                    //     setPriority(selectedOption.value);
                                    // }}
                                    onChange={(selectedOption) => {
                                        handleUpdate("Type", selectedOption.value)
                                    }}
                                    required
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
                                    name="priorty"
                                    value={priority2Options.find(
                                        (opt) => opt.value === formData.priorty
                                    )}
                                    options={priority2Options}
                                    className="w-[60%]"
                                    isSearchable={false}
                                    // onChange={(selectedOption) => {
                                    //     setPriority(selectedOption.value);
                                    // }}
                                    onChange={(selectedOption) => {
                                        handleUpdate("priorty", selectedOption.value)
                                    }}
                                    required
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
                                        (opt) => opt.value === formData.status
                                    )}
                                    options={status2Options}
                                    className="w-[60%]"
                                    isSearchable={false}
                                    // onChange={(selectedOption) => {
                                    //     setPriority(selectedOption.value);
                                    // }}
                                    onChange={(selectedOption) => {
                                        handleUpdate("status", selectedOption.value)
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

                        <button type="submit" className="mt-8 bg-black rounded-lg flex items-center justify-center gap-x-2 text-white font-lato text-base font-semibold w-28 h-10"><FaPlus className="text-white font-normal" />Update</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateModal