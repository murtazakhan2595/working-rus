import { useState } from "react";
import ReactDOM from "react-dom";

const TaskModal = ({ onClose }) => {
  const initialValues = {
    task: "",
    assignBy: "",
    dueDate: "",
    status: "",
    progress: "",
    priority: "",
  };
  const [addTask, setAddTask] = useState(initialValues);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form values:", addTask);
  };
  return ReactDOM.createPortal(
    <>
      <div className="fixed inset-0 bg-gray-900 opacity-40"></div>

      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-5/6 md:w-1/2 lg:w-1/2">
          {/* <h2 className="mb-4 text-lg font-semibold">Add Task</h2> */}
          <form
            // className="space-y-3 bg-white my-2 lg:py-12 py-6 rounded-3xl shadow-md p-8 m-6 max-w-800 shadow-xl border border-gray-100"
            onSubmit={handleSubmit}
            method="POST"
          >
            <div>
              <h2 className="text-[#1176BC] text-center text-lg font-montserrat font-[700] leading-9 tracking-tight  mb-2">
                Task Details
              </h2>
            </div>

            <div className="mt-2">
              <input
                id="task"
                name="task"
                type="text"
                placeholder="Task Name"
                // value={addTask.task}
                // onChange={handleChange}
                className="bg-zinc-100 w-full rounded-md py-2 my-1 text-gray-900 placeholder-style
   placeholder:text-gray-400 border-l-8 border-[#25A8E0] placeholder:mx-2 pl-2 md:text-base text-sm sm:leading-8 focus:outline-none font-montserrat"
              />
              {/* <div className="text-sm text-rose-500">{errors.email}</div> */}
            </div>
            <div className="mt-2">
              <input
                id="assignBy"
                name="assignBy"
                type="text"
                placeholder="Assign By"
                // value={addTask.assignBy}
                // onChange={handleChange}
                className="bg-zinc-100 w-full rounded-md py-2 my-1 text-gray-900 placeholder-style
   placeholder:text-gray-400 border-l-8 border-[#25A8E0] placeholder:mx-2 pl-2 md:text-base text-sm sm:leading-8 focus:outline-none font-montserrat"
              />
              {/* <div className="text-sm text-rose-500">{errors.email}</div> */}
            </div>
            <div className="mt-2">
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                placeholder="Due Date"
                // value={addTask.dueDate}
                // onChange={handleChange}
                className="bg-zinc-100 w-full rounded-md py-2 my-1 text-gray-900 placeholder-style
   placeholder:text-gray-400 border-l-8 border-[#25A8E0] placeholder:mx-2 pl-2 md:text-base text-sm sm:leading-8 focus:outline-none font-montserrat"
              />
              {/* <div className="text-sm text-rose-500">{errors.email}</div> */}
            </div>
            <div className="mt-2">
              <input
                id="status"
                name="status"
                type="number"
                placeholder="Status"
                // value={addTask.status}
                // onChange={handleChange}
                className="bg-zinc-100 w-full rounded-md py-2 my-1 text-gray-900 placeholder-style
   placeholder:text-gray-400 border-l-8 border-[#25A8E0] placeholder:mx-2 pl-2 md:text-base text-sm sm:leading-8 focus:outline-none font-montserrat"
              />
              {/* <div className="text-sm text-rose-500">{errors.email}</div> */}
            </div>
            <div className="mt-2">
              <input
                id="progress"
                name="progress"
                type="number"
                placeholder="Progress"
                // value={addTask.progress}
                // onChange={handleChange}
                className="bg-zinc-100 w-full rounded-md py-2 my-1 text-gray-900 placeholder-style
   placeholder:text-gray-400 border-l-8 border-[#25A8E0] placeholder:mx-2 pl-2 md:text-base text-sm sm:leading-8 focus:outline-none font-montserrat"
              />
              {/* <div className="text-sm text-rose-500">{errors.email}</div> */}
            </div>
            <div className="mt-2">
              <input
                id="priority"
                name="priority"
                type="text"
                placeholder="Priority"
                // value={addTask.priority}
                // onChange={handleChange}
                className="bg-zinc-100 w-full rounded-md py-2 my-1 text-gray-900 placeholder-style
   placeholder:text-gray-400 border-l-8 border-[#25A8E0] placeholder:mx-2 pl-2 md:text-base text-sm sm:leading-8 focus:outline-none font-montserrat"
              />
              {/* <div className="text-sm text-rose-500">{errors.email}</div> */}
            </div>

            <div className="mt-2 flex flex-wrap justify-between">
              <button
                type="submit"
                className="flex w-4/6 justify-center rounded-md bg-gradient-to-b from-[#25A5DE] to-[#1176BC] px-3 py-1.5 text-sm md:text-lg font-semibold 
    leading-8 text-white shadow-sm hover:bg-cyan-900 focus-visible:outline focus-visible:outline-2 
    focus-visible:outline-offset-2 focus-visible:outline-indigo-600 font-montserrat"
              >
                Add Task
              </button>
              <button
                className="w-20p md:w-1/6 px-3  hover:text-gray-800 border border-gray-500 rounded-md text-gray-500 font-montserrat"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.querySelector(".form-modal")
  );
};

export default TaskModal;
