import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Datepicker from './Datepicker'; // Import your Datepicker component
import Select from 'react-select';
import { RxCross2 } from 'react-icons/rx';
import { assigToData, assigByData, priority } from '../../../data/Data';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connect } from "react-redux";
import Joi from 'joi';


const status = [
  { value: 'inprogress', label: 'In-Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'testing', label: 'Testing' },
];

const TaskModal = ({ onClose, token, baseUrl }) => {
  const initialData = {
    title: '',
    desc: '',
    dueDate: null,
    status: null,
    priority: null,
    assignedTo: [],
    assignedBy: [],
  };

  const [activeIndex, setActiveIndex] = useState(-1);
  const [assignToList, setAssignToList] = useState(false);
  const [assignByList, setAssignByList] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [assignedToList, setAssignedToList] = useState([]);
  const [assignedByList, setAssignedByList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTermAssignTo, setSearchTermAssignTo] = useState('');
  const [searchTermAssignBy, setSearchTermAssignBy] = useState('');
  const [searchResultsAssignTo, setSearchResultsAssignTo] = useState(assigToData);
  const [searchResultsAssignBy, setSearchResultsAssignBy] = useState(assigByData);
  const [currentPageAssignTo, setCurrentPageAssignTo] = useState(1);
  const [currentPageAssignBy, setCurrentPageAssignBy] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});


  const usersPerPage = 3;

  const dropdownToRef = useRef(null);
  const dropdownByRef = useRef(null);

  // Define the getCurrentUsers function
  const getCurrentUsers = (currentPage, usersPerPage, userList) => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return userList.slice(indexOfFirstUser, indexOfLastUser);
  };

  const assignedTo = getCurrentUsers(currentPageAssignTo, usersPerPage, assignedToList);
  const assignedBy = getCurrentUsers(currentPageAssignBy, usersPerPage, assignedByList);


  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Function to handle date changes
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData((prevData) => ({
      ...prevData,
      dueDate: date,
    }));
  };

  // Function to handle select changes
  const handleSelectChange = (name, selectedOption) => {
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption,
    }));
  };

  // Function to handle assigning users to "Assigned to"
  const handleAssignToClick = () => {
    setAssignToList(!assignToList);
    setAssignByList(false);
  };

  // Function to handle assigning users to "Assigned by"
  const handleAssignByClick = () => {
    setAssignByList(!assignByList);
    setAssignToList(false);
  };

  // Function to handle selecting a user for "Assigned to" or "Assigned by"
  const handleAssignSelect = (user, list) => {
    const updatedList = [...list];
    const userIndex = updatedList.findIndex((u) => u.id === user.id);

    if (userIndex === -1) {
      updatedList.push(user);
    } else {
      updatedList.splice(userIndex, 1);
    }

    if (list === assignedToList) {
      setAssignedToList(updatedList);
      setFormData((prevData) => ({
        ...prevData,
        assignedTo: updatedList,
      }));
    } else if (list === assignedByList) {
      setAssignedByList(updatedList);
      setFormData((prevData) => ({
        ...prevData,
        assignedBy: updatedList,
      }));
    }
  };

  // Function to check if a user is selected
  const isUserSelected = (user, list) => {
    return list.some((u) => u.id === user.id);
  };

  const headers = {
    Authorization: `Bearer ${token}`,
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);

    if (Object.keys(errors).length === 0) {
      try {
        const postData = {
          name: formData.title,
          description: formData.desc,
          assigned_to: formData.assignedTo[0].id,
          assigned_by: formData.assignedBy[0].id,
          board_id: null,
          status: formData.status.label,
        };

        const response = await axios.post(
          `${baseUrl}/task/`,
          postData,
          { headers }
        );

        console.log('Response:', response.data);

        // Show a success toast
        toast.success('Card added successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => {
          onClose();
        }, 2000); // Close the modal after 2 seconds
      } catch (error) {
        console.error('Error:', error);

        // Show an error toast
        toast.error('Something went wrong', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      // Display validation errors
      setValidationErrors(errors);
    }
  };



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownToRef.current && !dropdownToRef.current.contains(event.target)) {
        setAssignToList(false);
        setActiveIndex(-1); // Reset activeIndex to -1
      }
      if (dropdownByRef.current && !dropdownByRef.current.contains(event.target)) {
        setAssignByList(false);
        setActiveIndex(-1); // Reset activeIndex to -1
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // Function to filter users for "Assign to"
  const filterAssignToUsers = (term) => {
    const filteredUsers = assigByData.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResultsAssignTo(filteredUsers);
  };

  // Function to filter users for "Assign by"
  const filterAssignByUsers = (term) => {
    const filteredUsers = assigByData.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResultsAssignBy(filteredUsers);
  };


  const schema = Joi.object({
    title: Joi.string().required().label('Title'),
    desc: Joi.string().required().label('Description'),
    dueDate: Joi.date().iso().label('Due Date'),
    status: Joi.string().required().label('Status'),
    priority: Joi.string().required().label('Priority'),
    assignedTo: Joi.array().min(1).required().label('Assigned To'),
    assignedBy: Joi.array().min(1).required().label('Assigned By'),
  });

  const validateForm = (data) => {
    const result = schema.validate(data, { abortEarly: false });
    const errors = {};

    if (result.error) {
      for (let item of result.error.details) {
        errors[item.path[0]] = item.message;
      }
    }

    if (!data.assignedTo || data.assignedTo.length === 0) {
      errors.assignedTo = "select at least one user";
    }

    if (!data.assignedBy || data.assignedBy.length === 0) {
      errors.assignedBy = "select at least one user";
    }

    return errors;
  };


  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="md:mx-auto w-full max-w-lg relative">
          <div className="space-y-3 my-2 bg-[#F8F8F8] lg:pt-8 lg:pb-4 py-6 rounded-3xl p-8 m-6 max-w-800 border border-gray-100 shadow-md relative">
            <div className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer" onClick={onClose}>
              <RxCross2 />
            </div>
            <form className="" onSubmit={handleSubmit}>
              <h2 className="text-2xl font-sfpro leading-3 font-bold mb-8">Create New Task</h2>
              <div className="flex flex-col">
                <label htmlFor="title" className="font-sfpro text-lg font-semibold">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="rounded-md bg-white text-black h-9 w-full py-2 pl-2 my-1 focus:outline-none font-sfpro tracking-wider mb-4"
                  placeholder="TecBrix Dashboard Design"
                />
                {validationErrors.title && <span className="text-red-500 text-sm">{validationErrors.title}</span>}
              </div>
              <div className="flex flex-col">
                <label htmlFor="desc" className="font-sfpro text-lg font-semibold">
                  Description
                </label>
                <textarea
                  name="desc"
                  id="desc"
                  cols="50"
                  rows="2"
                  value={formData.desc}
                  onChange={handleInputChange}
                  className="rounded-md bg-white text-black w-full py-2 pl-2 my-1 focus:outline-none font-sfpro tracking-wider mb-4"
                ></textarea>
                {validationErrors.desc && <span className="text-red-500 text-sm">{validationErrors.desc}</span>}

              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  <label htmlFor="dueDate" className="py-1 font-sfpro text-lg font-semibold">
                    Due Date
                  </label>
                  <Datepicker onChange={handleDateChange} />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="status" className="py-1 font-sfpro text-lg font-semibold">
                    Status
                  </label>
                  <Select
                    options={status}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        borderRadius: '0.375rem',
                        borderWidth: 0,
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: 'transparent',
                        },
                      }),
                      menu: (provided) => ({
                        ...provided,
                        borderWidth: 0,
                        boxShadow: 'none',
                        marginTop: 0,
                        borderRadius: '0.375rem',
                      }),
                    }}
                    onChange={(selectedOption) => handleSelectChange('status', selectedOption)}
                    value={formData.status}
                  />
                  {validationErrors.status && <span className="text-red-500 text-sm">{validationErrors.status}</span>}

                </div>
                <div className="flex flex-col max-w-[80px]">
                  <label htmlFor="priority" className="py-1 font-sfpro text-lg font-semibold">
                    Priority
                  </label>
                  <Select
                    options={priority}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        borderRadius: '0.375rem',
                        borderWidth: 0,
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: 'transparent',
                        },
                      }),
                      menu: (provided) => ({
                        ...provided,
                        borderWidth: 0,
                        boxShadow: 'none',
                        marginTop: 0,
                        borderRadius: '0.375rem',
                      }),
                    }}
                    onChange={(selectedOption) => handleSelectChange('priority', selectedOption)}
                    value={formData.priority}
                  />
                </div>
              </div>
              <label htmlFor="assign" className="py-1 font-sfpro text-lg font-semibold">
                Assigned
              </label>
              <div className="flex justify-start bg-white rounded-md mt-2">
                <h3 className="w-1/2 pl-4" onClick={handleAssignToClick}>
                  Assigned to
                </h3>
                <h3 className="w-1/2 pl-4" onClick={handleAssignByClick}>
                  Assigned by
                </h3>
              </div>
              <div className="flex gap-x-6 mt-1">
                <div className="relative w-full" ref={dropdownToRef}>

                  <style>
                    {`
      ::-webkit-scrollbar {
        width: 0.5em;
      }
      ::-webkit-scrollbar-thumb {
        background-color: transparent;
      }
      `}
                  </style>


                  <div className="flex space-x-2 px-2 pt-2 pb-0 ">
                    <div
                      className=" overflow-x-scroll flex gap-x-1"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch',
                      }}
                    >
                      <div
                        className={`w-9 h-9 rounded-full cursor-pointer bg-[#EFEFEF] ${activeIndex === null ? 'border-2 border-blue-500' : ''
                          }`}
                        onClick={handleAssignToClick}
                      >
                        <span className="text-white text-2xl flex justify-center items-center plus-icon w-9 h-9">
                          +
                        </span>
                      </div>
                      {assignedTo.map((user, userIndex) => (
                        <div key={user.id} className="relative group cursor-pointer">
                          <div className="w-9 h-9 rounded-full">
                            <img
                              src={user.imageUrl}
                              alt={user.name}
                              className={`w-9 h-9 rounded-full cursor-pointer ${userIndex === activeIndex ? 'border-2 border-blue-500' : ''
                                }`}
                            // onClick={() => handleAssignSelect(user, assignedToList)}
                            // onClick={() => handleAssignSelect(user, userIndex)}
                            />
                          </div>
                        </div>
                      ))}
                      {/* Render "+" button */}

                    </div>
                  </div>

                  {assignToList && (
                    <div className="absolute top-11 left-10 w-40 h-40 bg-white rounded-md border border-gray-300 shadow-md z-50">
                      <input
                        type="search"
                        placeholder="Search"
                        className="mt-2 border-b border-t bg-[#D7D7D7] w-[158px] focus:outline-none pl-2 text-gray-600"
                        onChange={(e) => {
                          setSearchTermAssignTo(e.target.value);
                          filterAssignToUsers(e.target.value);
                        }}
                      />
                      <div className="overflow-y-auto max-h-32 roundScrollsm">
                        <ul className="text-black">
                          {searchResultsAssignTo.map((user) => (
                            <div
                              className={`flex gap-3 px-2 py-1 relative group cursor-pointer ${isUserSelected(user, assignedToList) ? 'bg-gray-200' : ''
                                }`}
                              key={user.id}
                              onClick={() => handleAssignSelect(user, assignedToList)}
                            >
                              <img src={user.imageUrl} alt={user.name} className="w-6 h-6 rounded-full gap-3" />
                              <p className="gap-3 text-sm">{user.name}</p>
                              {isUserSelected(user, assignedToList) && (
                                <span className="absolute top-2 right-1 w-4 h-4 bg-green-500 rounded-full text-white flex items-center justify-center">
                                  ✓
                                </span>
                              )}
                            </div>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center mx-auto -mt-2">
                    {Array.from({ length: Math.ceil(assignedToList.length / usersPerPage) }, (_, index) => (
                      <span
                        key={index}
                        className={`w-2 h-2 rounded-full bg-gray-400 mx-1 ${index === currentPageAssignTo - 1 ? 'bg-blue-500' : ''}`}
                        onClick={() => setCurrentPageAssignTo(index + 1)}
                      />
                    ))}
                  </div>

                  {validationErrors.assignedTo && (
                    <p className="text-red-500">{validationErrors.assignedTo}</p>
                  )}
                </div>
                <div className="relative w-full" ref={dropdownByRef}>

                  <style>
                    {`
      ::-webkit-scrollbar {
        width: 0.5em;
      }
      ::-webkit-scrollbar-thumb {
        background-color: transparent;
      }
      `}
                  </style>


                  <div className="flex justify-items-center space-x-2 px-2 pt-2 pb-0 ">
                    <div
                      className=" overflow-x-scroll flex justify-items-center gap-x-1"
                      style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch',
                      }}
                    >
                      <div
                        className={`w-9 h-9 rounded-full cursor-pointer bg-[#EFEFEF] ${activeIndex === null ? 'border-2 border-blue-500' : ''
                          }`}
                        onClick={handleAssignByClick}
                      >
                        <span className="text-white text-2xl flex justify-items-center justify-center items-center plus-icon w-9 h-9">
                          +
                        </span>
                      </div>
                      {assignedBy.map((user, userIndex) => (
                        <div key={user.id} className="relative group cursor-pointer">
                          <div className="w-9 h-9 rounded-full">
                            <img
                              src={user.imageUrl}
                              alt={user.name}
                              className={`w-9 h-9 rounded-full cursor-pointer ${userIndex === activeIndex ? 'border-2 border-blue-500' : ''
                                }`}
                            // onClick={() => handleAssignSelect(user, assignedToList)}
                            // onClick={() => handleAssignSelect(user, userIndex)}
                            />
                          </div>
                        </div>
                      ))}
                      {/* Render "+" button */}

                    </div>
                  </div>

                  {assignByList && (
                    <div className="absolute top-11 left-10 w-40 h-40 bg-white rounded-md border border-gray-300 shadow-md z-50">
                      <input
                        type="search"
                        placeholder="Search"
                        className="mt-2 border-b border-t bg-[#D7D7D7] w-[158px] focus:outline-none pl-2 text-gray-600"
                        onChange={(e) => {
                          setSearchTermAssignBy(e.target.value);
                          filterAssignByUsers(e.target.value);
                        }}
                      />
                      <div className="overflow-y-auto max-h-32 roundScrollsm">
                        <ul className="text-black">
                          {searchResultsAssignBy.map((user) => (
                            <div
                              className={`flex gap-3 px-2 py-1 relative group cursor-pointer ${isUserSelected(user, assignedByList) ? 'bg-gray-200' : ''
                                }`}
                              key={user.id}
                              onClick={() => handleAssignSelect(user, assignedByList)}
                            >
                              <img src={user.imageUrl} alt={user.name} className="w-6 h-6 rounded-full gap-3" />
                              <p className="gap-3 text-sm">{user.name}</p>
                              {isUserSelected(user, assignedByList) && (
                                <span className="absolute top-2 right-1 w-4 h-4 bg-green-500 rounded-full text-white flex items-center justify-center">
                                  ✓
                                </span>
                              )}
                            </div>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* <div className="block mx-auto"> */}
                  <div className="flex justify-center mx-auto -mt-2">
                    {Array.from({ length: Math.ceil(assignedByList.length / usersPerPage) }, (_, index) => (
                      <span
                        key={index}
                        className={`w-2 h-2 rounded-full bg-gray-400 mx-1 ${index === currentPageAssignBy - 1 ? 'bg-blue-500' : ''}`}
                        onClick={() => setCurrentPageAssignBy(index + 1)}
                      />
                    ))}
                  </div>
                  {/* </div> */}
                  {validationErrors.assignedBy && (
                    <p className="text-red-500">{validationErrors.assignedBy}</p>
                  )}
                </div>
              </div>
              <button type="submit" className="block m-auto py-1 px-16 mt-6 rounded-lg bg-[#283B91] text-white">
                Done
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>,
    document.querySelector('.form-modal')
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    baseUrl: state.user.baseUrl,
    token: state.user.token,
    isLogin: state.user.isLogin,
  };
};

export default connect(mapStateToProps)(TaskModal);




