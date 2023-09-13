import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Datepicker from '../Dashboard/Datepicker';
import Select from 'react-select';
import { RxCross2 } from 'react-icons/rx';
import { priority } from '../../../data/Data';

const status = [
  { value: 'inprogress', label: 'In-Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'testing', label: 'Testing' },
];

const TaskView = ({  data ,onClose  }) => {
  const initialData = {
    title: data.title,
    desc: data.desc,
    dueDate: "",
    status: data.status,
    priority: data.p,
    assignedTo: [],
    assignedBy: [],
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [assignToList, setAssignToList] = useState(false);
  const [assignByList, setAssignByList] = useState(false);
  const [formData, setFormData] = useState(initialData);
  const [assignedToList, setAssignedToList] = useState([]);
  const [assignedByList, setAssignedByList] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); 

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption,
    }));
  };

  // Function to handle assigning users to "Assigned to"
  const handleAssignToClick = (index) => {
    setActiveIndex(index);
    setAssignToList(true);
    setAssignByList(false);
  };

  // Function to handle assigning users to "Assigned by"
  const handleAssignByClick = (index) => {
    setActiveIndex(index);
    setAssignByList(true);
    setAssignToList(false);
  };

  // Function to handle assigning users to "Assigned to"
  const handleAssignToSelect = (user) => {
    setAssignedToList((prevList) => [...prevList, user]);
    setAssignToList(false);
    setFormData((prevData) => ({
      ...prevData,
      assignedTo: [...prevData.assignedTo, user],
    }));
  };

  // Function to handle selecting a user for "Assigned by"
  const handleAssignBySelect = (user) => {
    setAssignedByList((prevList) => [...prevList, user]);
    setAssignByList(false);
    setFormData((prevData) => ({
      ...prevData,
      assignedBy: [...prevData.assignedBy, user],
    }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  };


  return ReactDOM.createPortal(
    <>
      <div className={` fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm`}></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="md:mx-auto w-full max-w-lg relative">
          <div className="space-y-3 my-2 bg-[#F8F8F8] lg:pt-8 lg:pb-4 py-6 rounded-3xl p-8 m-6 max-w-800 border border-gray-100 shadow-md relative">
            <div className="absolute top-6 right-5 text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer" onClick={onClose}>
              <RxCross2 />
            </div>
            <form className="" onSubmit={handleSubmit}>
              <h2 className="text-2xl font-sfpro leading-3 font-bold mb-8">Task View</h2>
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
                </div>
                <div className="flex flex-col">
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
                <h3 className="w-1/2 pl-4">Assigned to</h3>
                <h3 className="w-1/2 pl-4">Assigned by</h3>
              </div>
              <div className="flex gap-x-6 mt-1">
                <div className="relative">
                  <div
                    className="w-[180px] mx-auto overflow-x-scroll"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch',
                    }}
                  >
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
                    <div className="flex space-x-2 p-2">
                      {assignedToList.map((user, userIndex) => (
                        <img
                          key={user.id}
                          src={user.imageUrl}
                          alt={user.name}
                          className={`w-9 h-9 rounded-full cursor-pointer ${userIndex === activeIndex ? 'border-2 border-blue-500' : ''
                            }`}
                          onClick={() => handleAssignToClick(userIndex)}
                        />
                      ))}
                      <div
                        className={`w-9 h-9 rounded-full cursor-pointer bg-[#EFEFEF] ${activeIndex === assignedToList.length ? 'border-2 border-blue-500' : ''
                          }`}
                        onClick={() => handleAssignToClick(assignedToList.length)}
                      >
                        <span className="text-white text-2xl flex justify-center items-center">+</span>
                      </div>
                    </div>
                    {assignToList && (
                      <div className="absolute top-5 left-40 w-40 h-40 bg-white rounded-md border border-gray-300 shadow-md pr-2 z-50">
                        <input
                          type="text"
                          placeholder="Search"
                          className="mt-2 border-b border-t bg-[#D7D7D7] w-[158px] focus:outline-none pl-2 text-white"
                        />
                        <div className="overflow-y-auto max-h-32 roundScrollsm">
                          <ul className="text-black">
                            {/* {newImages.map((user) => (
                              <div
                                className="flex gap-3 px-2 py-1"
                                key={user.id}
                                onClick={() => handleAssignToSelect(user)}
                              >
                                <img src={user.imageUrl} alt={user.name} className="w-6 h-6 rounded-full gap-3" />
                                <p className="gap-3 text-sm">{user.name}</p>
                              </div>
                            ))} */}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {/* {images.slice(0, 3).map((_, index) => (
                      <span
                        key={index}
                        className={`w-2 h-2 rounded-full bg-gray-400 mx-1 ${index === activeIndex ? 'bg-blue-500' : ''
                          }`}
                        onClick={() => handleAssignToClick(index)}
                      />
                    ))} */}
                  </div>
                </div>

                <div className="relative">
                  <div
                    className="w-[180px] mx-auto overflow-x-scroll"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch',
                    }}
                  >
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
                    <div className="flex space-x-2 p-2">
                      {assignedByList.map((user, userIndex) => (
                        <img
                          key={user.id}
                          src={user.imageUrl}
                          alt={user.name}
                          className={`w-9 h-9 rounded-full cursor-pointer ${userIndex === activeIndex ? 'border-2 border-blue-500' : ''
                            }`}
                          onClick={() => handleAssignByClick(userIndex)}
                        />
                      ))}
                      <div
                        className={`w-9 h-9 rounded-full cursor-pointer bg-[#EFEFEF] ${activeIndex === assignedByList.length ? 'border-2 border-blue-500' : ''
                          }`}
                        onClick={() => handleAssignByClick(assignedByList.length)}
                      >
                        <span className="text-white text-2xl flex justify-center items-center">+</span>
                      </div>
                    </div>
                    {assignByList && (
                      <div className="absolute top-5 left-40 w-40 h-40 bg-white rounded-md border border-gray-300 shadow-md pr-2 z-50">
                        <input
                          type="text"
                          placeholder="Search"
                          className="mt-2 border-b border-t bg-[#D7D7D7] w-[158px] focus:outline-none pl-2 text-white"
                        />
                        <div className="overflow-y-auto max-h-32 roundScrollsm">
                          <ul className="text-black">
                            {/* {newImages.map((user) => (
                              <div
                                className="flex gap-3 px-2 py-1"
                                key={user.id}
                                onClick={() => handleAssignBySelect(user)}
                              >
                                <img src={user.imageUrl} alt={user.name} className="w-6 h-6 rounded-full gap-3" />
                                <p className="gap-3 text-sm">{user.name}</p>
                              </div>
                            ))} */}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {/* {images.slice(0, 3).map((_, index) => (
                      <span
                        key={index}
                        className={`w-2 h-2 rounded-full bg-gray-400 mx-1 ${index === activeIndex ? 'bg-blue-500' : ''
                          }`}
                        onClick={() => handleAssignByClick(index)}
                      />
                    ))} */}
                  </div>
                </div>
              </div>
              <button onClick={onClose} type="submit" className="block m-auto py-1 px-16 mt-6 rounded-lg bg-[#283B91] text-white">
                Done
              </button>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.querySelector('.form-modal')
  );
};

export default TaskView;
