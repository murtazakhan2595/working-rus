import React, { useRef, useState } from "react";
import { TbCircleChevronsDown } from "react-icons/tb";
import todoImg from "../../../assets/images/todolist.png"
import { todoList } from "../../../data/Data";
import { MdCheck, MdDeleteForever } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai'

const Dashboard = ({ isSidebarOpen }) => {
  const [todos, setTodos] = useState(todoList)
  const [showConfirmation, setShowConfirmation] = useState(null)
  const [editingId, setEditingId] = useState(null);
  const [editedTexts, setEditedTexts] = useState({});
  const [showAllItems, setShowAllItems] = useState(false);

  const deleteRef = useRef(null);

  const handleConfirmDelete = (id) => {
    const idToDelete = deleteRef.current;
    if (idToDelete !== null) {
      const updatedTodos = todos.filter(todo => todo.id !== id)
      setTodos(updatedTodos);
      deleteRef.current = null;
      setShowConfirmation(false)
    }
  }

  const handleDelete = (id) => {
    deleteRef.current = id;
    setShowConfirmation(true)
  }

  const handleCancelDelete = () => {
    deleteRef.current = null;
    setShowConfirmation(false);
  }

  const handleChange = (e, id) => {
    setEditedTexts((prevEditedTexts) => ({
      ...prevEditedTexts,
      [id]: e.target.value,
    }));
  };

  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setEditedTexts((prevEditedTexts) => ({
      ...prevEditedTexts,
      [todo.id]: todo.text, // Initialize edited text with current text
    }));
  };


  const handleEditSubmit = (id) => {
    const editedText = editedTexts[id];
    if (editedText && editedText.trim() !== "") {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, text: editedText } : todo
      );
      setTodos(updatedTodos);
      setEditingId(null);
    }
  };

  return (
    <div className="relative flex flex-col pt-5 justify-start sm:ml-5 sm:w-[95%] sm:mr-7 md:w-[60%] w-[90%] md:ml-10 items-start mx-auto ">
      <img
        className="absolute top-0 right-0 transform translate-y-[-5%] translate-x-[-50%]"
        src={todoImg}
        alt=""
      />        <div className="mb-5 mt-2 pb-3 pl-3 pr-8 pt-3 rounded w-full 2xl:mx-0  bg-white  flex flex-col items-start justify-start gap-3">
        <h1 className="text-xl mb-3 font-bold">To-Do List</h1>
        <div className="overflow-y-auto max-h-[300px]"></div>
        {todos.slice(0, showAllItems ? todos.length : 4).map(todo => (
          <div key={todo.id} className="flex gap-3 w-full px-2 border-b border-gray-500">
            <div className="flex justify-between w-full">
              {editingId === todo.id ? (
                <div className="flex gap-2">
                  <input
                    type="input"
                    className="focus:outline-none"
                    value={editedTexts[todo.id] || ""}
                    onChange={(e) => handleChange(e, todo.id)}
                  />
                  {/* <p className="text-gray-400 text-sm">{todo.text}</p> */}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input type="checkbox" name="" id="" />
                  <p className="text-gray-400 text-sm">{todo.text}</p>
                </div>
              )}

              <div className="flex gap-1 justify-end cursor-pointer">
                {editingId === todo.id ? (
                  <MdCheck className="text-green-700" onClick={() => handleEditSubmit(todo.id)} />
                ) : (
                  <>
                    <AiOutlineEdit className="text-[#283b91] opacity-0.2" onClick={() => handleEdit(todo)} />
                    <MdDeleteForever className="text-red-400 opacity-0.2" onClick={() => handleDelete(todo.id)} />
                  </>

                )}
              </div>
            </div>
          </div>
        ))}
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p className="text-gray-700">Are you sure you want to delete?</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 mr-2 text-white bg-red-500 rounded"
                  onClick={() => handleConfirmDelete(deleteRef.current)}
                >
                  Confirm
                </button>
                <button
                  className="px-4 py-2 text-gray-600 bg-gray-300 rounded"
                  onClick={handleCancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full justify-center items-center">
          {todos.length > 4 && (
            <TbCircleChevronsDown
              className="text-gray-400 text-xl drop-shadow-lg text-center cursor-pointer"
              onClick={() => setShowAllItems(!showAllItems)} // Toggle state
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
