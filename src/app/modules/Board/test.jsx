import React from "react";

const test = () => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex w-full justify-start overflow-x-auto xScroll lg:w-[100vw] lg:h-[75vh] px-6">
        <div id="boardList" className="flex">
          {cards?.map((card) => (
            <div
              className="bg-white mr-3 px-2 pt-1 pb-3 h-fit rounded-md w-72"
              key={card.id}
            >
              <div className="flex justify-between items-center mb-3 mt-3">
                <div className="flex items-center">
                  <div className="text-[#283b91]">{card.name}</div>
                  <div className="bg-gray-200 rounded-full px-1 text-sm ml-4 text-[#283b91]">
                    {/* 3 */}
                  </div>
                </div>

                {/* //////////////edit and delete */}
                <div className="flex gap-1 justify-end cursor-pointer">
                  {editTexts[card.id] !== undefined ? (
                    <MdCheck
                      className="text-[#283b91] opacity-0.2"
                      // onClick={() => handleSave(card.id)}
                    />
                  ) : (
                    <div className="flex items-center gap-x-2">
                      <AiOutlineEdit
                        className="text-[#283b91] opacity-0.2 text-sm"
                        onClick={() => handleBoardListEdit(card.id)}
                      />
                      <MdDeleteForever
                        className="text-red-400 opacity-0.2 text-sm"
                        onClick={() => {
                          // deleteBoardList(card.id);
                          setTodoToDelete(card.id);
                          setShowDeleteConfirmation(true);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Filter is based on card's board_status_id */}
              {isLoading ? (
                <>
                  <div className="bg-gray-300 rounded-md p-3 m-2 animate-pulse">
                    <div className="opacity-70 h-5 w-3/4 mb-2"></div>
                    <hr className="bg-white h-2 my-2" />
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full cursor-pointer text-[.60rem] text-white flex p-1 w-6 h-6 opacity-60 border justify-center items-center font-bold bg-gray-500"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-[0.60rem]"></div>
                        <div className="text-sm opacity-50 cursor-pointer"></div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-auto max-h-[55vh] overflow-y-auto xScroll">
                  {tasks
                    ?.filter((task) => task.board_status_id === card.id)
                    ?.map((task) => (
                      <div
                        className="flex-shrink-0 p-2 pt-1 pb-3 max-w-[300px] rounded-md"
                        key={task.id}
                        onClick={() => openTaskView(task.id)}
                      >
                        <div className="max-w-[255px] bg-[#F2F2F2] rounded-md overflow-hidden">
                          <div className="px-6 py-4">
                            <div className="text-base mb-2">{task.name}</div>
                            <hr />
                            <div className="flex items-center justify-between mt-2 gap-2">
                              {task.priority === 1 ? (
                                <div className="text-[0.60rem]">🔴</div>
                              ) : task.priority === 2 ? (
                                <div className="text-[0.60rem]">🟡</div>
                              ) : task.priority === 3 ? (
                                <div className="text-[0.60rem]">🟢</div>
                              ) : (
                                ""
                              )}
                              <BsTrash3
                                className="text-sm opacity-50 cursor-pointer"
                                onClick={() => {
                                  deleteTasks(task.id);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        {openTaskId === task.id && (
                          <TaskView
                            onClose={() => closeTaskView(openTaskId)}
                            taskData={{
                              id: task.id,
                              name: task.name,
                              description: task.description,
                              dueDate: task.end_date,
                              startDate: task.start_date,
                              priority: task.priority,
                              status: task.status,
                              assigned_to: task.assigned_to,
                              assigned_by: task.assigned_by,
                            }}
                          />
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Add Task button */}
              <div
                onClick={() => {
                  setIsAddTaskOpen(true);
                  setSelectedBoardStatusId(card.id);
                }}
                className="border hover:bg-gray-200 hover:text-white border-gray-200 text-gray-400 py-1 rounded-md text-center mt-auto max-w-[253px] block mx-auto"
              >
                Add Task
              </div>
            </div>
          ))}
          <div className={`${isSidebarOpen ? "pr-56" : "pr-0"}`}>
            <button
              className="bg-baseBlue text-white rounded-md px-6 py-2 w-[240px]"
              onClick={openListModal}
            >
              Add Another List
            </button>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default test;
