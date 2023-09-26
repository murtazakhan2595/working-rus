import React, { useEffect, useRef, useState } from "react";
import { TbCircleChevronsDown, TbCircleChevronsUp } from "react-icons/tb";
import todoImg from "../../../assets/images/todolist.png";
import { MdCheck, MdDeleteForever } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';
import { BiSolidPlusCircle } from 'react-icons/bi';
import { MdOutlineAddTask } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import Joi from "joi";
import axios from "axios";
import { connect } from "react-redux";

const Dashboard = ({ token, baseUrl }) => {
  const [todos, setTodos] = useState([]);
  const [editTexts, setEditTexts] = useState({});
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [newTodoText, setNewTodoText] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);
  const [validationError, setValidationError] = useState(null);

  const todoSchema = Joi.object({
    text: Joi.string().trim().required().label('Todo')
  });

  const addInputRef = useRef(null);

  // Functions for calling api started
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  //  1. Fetch Todos
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${baseUrl}/todotask`, { headers });
        const todosData = response.data;
        setTodos(todosData);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };
    fetchTodos();
  }, []);

  // 2. Create a todo
  const createTodo = async () => {
    try {
      const response = await axios.post(`${baseUrl}/todotask/`, {
        description: newTodoText,
      }, { headers });

      const createdTodo = response.data;
      const updatedTodos = [...todos, createdTodo];
      setTodos(updatedTodos);

      setShowAddInput(false);
      setNewTodoText('');
      setValidationError(null);
    } catch (error) {
      console.error('Error creating todo', error);
    }
  };


  // 3. Update Todo
  const updateTodo = async (id, newText) => {
    try {
      const updatedTodos = todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, description: newText };
        }
        return todo;
      });
      setTodos(updatedTodos);

      await axios.put(`${baseUrl}/todotask/${id}`, { description: newText }, { headers });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // 4. Function delete todo
  const deleteTodo = async (id) => {
    try {
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);

      await axios.delete(`${baseUrl}/todotask/${id}`, { headers });
    } catch (error) {
      console.error('Error deleting todo', error);
    }
  };
  // Functions for calling api ended


  const handleEdit = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);
    setEditTexts((prevEditTexts) => ({
      ...prevEditTexts,
      [id]: todoToEdit.description,
    }));
  };
  const handleInputChange = (e, id) => {
    setEditTexts((prevEditTexts) => ({
      ...prevEditTexts,
      [id]: e.target.value,
    }));
  };

  const handleSave = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) return { ...todo, description: editTexts[id] };
      return todo;
    });
    setTodos(updatedTodos);
    setEditTexts((prevEditTexts) => ({
      ...prevEditTexts,
      [id]: undefined
    }));

    const updatedTodo = updatedTodos.find(todo => todo.id === id);
    updateTodo(updatedTodo.id, updatedTodo.description); // Call the updateTodo function here
  };

  const handleAdd = () => {
    const { error } = todoSchema.validate({ text: newTodoText });
    if (error) {
      setValidationError(error.details[0].message);
      return;
    }

    if (newTodoText.trimEnd() !== "") {
      const newTodo = {
        id: Date.now(),
        description: newTodoText,
      };
      setTodos([newTodo, ...todos]);
      setShowAddInput(false);
      setNewTodoText("");
      setValidationError(null);
      createTodo(); // Call the createTodo function here
    }
  };

  // const handleCheckboxChange = (id) => {
  //   const updatedTodos = todos.map(todo => {
  //     if (todo.id === id) return { ...todo, completed: !todo.completed };
  //     return todo;
  //   });


  //   updatedTodos.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  //   setTodos(updatedTodos);
  // };

  const handleCheckboxChange = async (id, isCompleted) => {
    try {
      const updatedTodos = todos.map(todo => {
        if (todo.id === id) return { ...todo, is_completed: !isCompleted };
        return todo;
      });

      updatedTodos.sort((a, b) => (a.is_completed === b.is_completed ? 0 : a.is_completed ? 1 : -1));

      setTodos(updatedTodos);
      await axios.patch(
        `${baseUrl}/todotask/${id}`,
        { is_completed: !isCompleted },
        { headers }
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };



  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (addInputRef.current && !addInputRef.current.contains(e.target)) {
        setShowAddInput(false);
        setNewTodoText("");
        setValidationError(null);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  return (
    <div className="relative flex flex-col pt-5 justify-start sm:ml-5 sm:w-[95%] sm:mr-7 md:w-[60%] w-[90%] md:ml-10 items-start mx-auto ">
      <img
        className="absolute top-0 right-0 transform translate-y-[-15%] translate-x-[-20%]"
        src={todoImg}
        alt=""
      />
      <div className="mb-5 mt-2 pb-3 pl-3 pr-8 pt-3 rounded w-full 2xl:mx-0  bg-white  flex flex-col justify-start gap-3">
        <div className={`${showAddInput ? 'block' : 'flex'} justify-between items-center mb-3`}>
          <h1 className="text-xl font-bold ">To-Do List</h1>
          {showAddInput ? (
            <div className="flex items-end space-x-3 mt-4" ref={addInputRef}>
              <input
                type="text"
                className="border-b focus:outline-none py-1 w-full"
                value={newTodoText}
                onChange={(e) => { setNewTodoText(e.target.value); setValidationError(null) }}
                placeholder="Enter new item"
              />
              <MdOutlineAddTask onClick={handleAdd} className="text-[#283b91] text-2xl font-bold" />
            </div>
          ) : (
            <BiSolidPlusCircle className="text-[#283b91] text-2xl" onClick={() => setShowAddInput(true)} />
          )}
          {validationError && (
            <p className="text-red-500 text-sm">{validationError}</p>
          )}
        </div>
        <div className={`overflow-y-auto max-h-[160px] roundScroll`}>
          {todos.slice(0, showAllItems ? todos.length : 4).map(todo => (
            <div key={todo.id} className="flex gap-3 w-full px-2 border-b border-gray-500">
              <div className="flex justify-between w-full py-1.5 px-0">
                {editTexts[todo.id] !== undefined ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="focus:outline-none"
                      value={editTexts[todo.id]}
                      onChange={(e) => handleInputChange(e, todo.id)}
                    />
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <input
                      type="checkbox"
                      className="accent-[#283b91]"
                      id={`checkbox-${todo.id}`}
                      checked={todo.is_completed}
                      onChange={() => handleCheckboxChange(todo.id, todo.is_completed)}
                    />
                    <label
                      htmlFor={`checkbox-${todo.id}`}
                      className={`text-gray-400 text-sm ${todo.is_completed ? "line-through" : ""}`}
                    >
                      {todo.description}
                    </label>
                  </div>
                )}

                <div className="flex gap-1 justify-end cursor-pointer">
                  {editTexts[todo.id] !== undefined ? (
                    <MdCheck className="text-[#283b91] opacity-0.2" onClick={() => handleSave(todo.id)} />
                  ) : (
                    <div className="flex items-center gap-1">
                      <AiOutlineEdit className="text-[#283b91] opacity-0.2 text-sm" onClick={() => handleEdit(todo.id)} />
                      <MdDeleteForever className="text-red-400 opacity-0.2 text-sm" onClick={() => {
                        setTodoToDelete(todo.id);
                        setShowDeleteConfirmation(true);
                      }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {todos.length <= 0 &&
            <p className="text-lg text-gray-400 text-center">No data</p>
          }
        </div>

        {showDeleteConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-3 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Delete Item</h1>
                <div className="text-white bg-[#ECECEC] rounded-full p-1 cursor-pointer">
                  <RxCross2 onClick={() => setShowDeleteConfirmation(false)} />
                </div>
              </div>
              <p className="text-gray-700 mt-2">Are you sure you want to delete this item?</p>
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-1 mr-2 text-white bg-red-500 rounded"
                  onClick={() => {
                    deleteTodo(todoToDelete);
                    setShowDeleteConfirmation(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex w-full justify-center items-center">
          {todos.length > 4 && (
            showAllItems ? (
              <TbCircleChevronsUp
                className="text-gray-400 text-xl drop-shadow-lg text-center cursor-pointer"
                onClick={() => setShowAllItems(!showAllItems)} // Toggle state
              />
            ) : (
              <TbCircleChevronsDown
                className="text-gray-400 text-xl drop-shadow-lg text-center cursor-pointer"
                onClick={() => setShowAllItems(!showAllItems)} // Toggle state
              />
            )
          )}
        </div>
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

export default connect(mapStateToProps)(Dashboard);
