import { useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import { RiArrowDownSFill } from "react-icons/ri";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { MdPlaylistAdd } from "react-icons/md";
import {
  AiTwotoneStar,
  AiOutlineMore,
  AiOutlinePlusCircle,
} from "react-icons/ai";
import { FiFilter } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import TaskModal from "./TaskModal";
import TaskCard from "./TaskCard";
import TaskView from "./TaskView";
import "./index.css";
import { todo, inProgress, completed } from "./cards";

const Board = ({ userProfile, baseUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [createCard, setCreateCard] = useState(false);
  const [cardName, setCardName] = useState("");
  const [moreOpen1 , setMoreOpen1] = useState(false)
  const [moreOpen2 , setMoreOpen2] = useState(false)
  const [moreOpen3 , setMoreOpen3] = useState(false)
  const { id } = useParams();
  
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeTask = () => {
    setIsTaskOpen(false);
  };

  const createList = () => {
    if (!cardName) {
      setCreateCard(false);
      return;
    }
    setCreateCard(false);
    let newList = document.createElement("div");
    let boardList = document.getElementById("boardList");
    newList.innerHTML = `<div class="bg-white mx-3 px-2 pt-1 pb-3 h-fit rounded-md w-72">
      <div class="flex justify-between items-center mb-3 mt-3 ml-2">
        <div class="flex justify-center items-center">
          <div class="text-[#283b91]">${cardName} </div>
          <div class="bg-gray-200 rounded-full px-1 text-sm ml-2 text-[#283b91]">
            
          </div>
        </div>
        <div class="mr-2">...</div>
      </div>
      <div
        class="border hover:bg-gray-200 hover:text-white border-gray-200 text-gray-400 py-1 rounded-md text-center mx-2"
      >
        Add a Card
      </div>
    </div>`;

    boardList.appendChild(newList);
    setCardName("");
  };

  return (
    <div className="w-full bg-[#F9F9F9]">
      {/* ***************************************************** Header ***************************************************** */}
      <div className="py-5 pl-10 pr-2 flex gap-3 items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-3xl mr-2 leading-none font-semibold  opacity-80 tracking-widest">
            <Link to="/login">My Boards</Link>
          </h1>
          <div className="relative">
            <IoIosSearch className="absolute top-2 left-3 text-white" />
            <input
              type="search"
              placeholder="Search"
              className="focus:outline-none focus:border-non bg-gray-200 py-1 pl-8 pr-4 text-white placeholder-white border-none  md:flex lg:w-64 xs:w-[12.5rem] hidden rounded-md"
            />
          </div>
        </div>
        <div className="flex py-2 justify-end px-5 items-center gap-3 rounded-lg bg-gray-200">
          <div className="text-3xl w-8 h-8 rounded-full border bg-white"></div>{" "}
          <div className=" text-[#283b91]">{userProfile.username}</div>
          <div className=" text-[#283b91]">
            <RiArrowDownSFill />
          </div>
        </div>
      </div>
      {/* ***************************************************** Board Header ***************************************************** */}
      <div className="bg-[#ebebeb] mb-6 pr-1 pl-5 gap-3  justify-between py-2 flex">
        <div className="flex gap-2">
          <div className="flex justify-center ml-4 items-center">
            <AiTwotoneStar className="text-3xl text-[#283b91]" />
          </div>
          <div className="flex font-bold items-center ml-2 tracking-widest ">
           {id}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white px-2 py-1 gap-3 items-center rounded-lg">
            <div className=" px-4 text-[#283b91]">Share</div>
          </div>
          <div className="flex bg-[#f7f7f8] px-2 py-1 gap-3 items-center rounded-lg">
            <div className=" px-1 text-gray-400">
              <BsPencil />
            </div>
          </div>
          <div className="flex bg-[#f7f7f8] px-2 py-1 gap-3 items-center rounded-lg">
            <div className=" px-1 text-gray-400">
              <FiFilter />
            </div>
          </div>
          <div className="flex bg-[#f7f7f8] px-2 mr-5 py-1 gap-3 items-center rounded-lg">
            <div className=" px-1 text-gray-400">
              <BsTrash3 />
            </div>
          </div>
        </div>
      </div>

      {/* ***************************************************** Board Card ***************************************************** */}
      <div className="flex w-full justify-center ">
        <div className="flex xScroll  ml-10 pb-2 overflow-x-auto w-[82vw] justify-start">
          <div id="boardList" className="flex">
            {/* Box 1 */}
            <div className="bg-white  mr-3 px-2 pt-1 pb-3 h-fit rounded-md w-72">
              <div className="flex justify-between items-center mb-3 mt-3 ml-2">
                <div className="flex justify-center items-center">
                  <div className="text-[#283b91]">Todo </div>
                  <div className="bg-gray-200 rounded-full px-1 text-sm ml-2 text-[#283b91]">
                    3
                  </div>
                </div>
                {!moreOpen1 && (<AiOutlineMore
                  onClick={() => {
                    setMoreOpen1(!moreOpen1);
                  }}
                />
                )}
                {moreOpen1 && (
                  <>
                
                  <div className="relative">
                  <AiOutlineMore
                  onClick={() => {
                    setMoreOpen1(!moreOpen1);
                  }}
                />
                    <div className="absolute  bg-white rounded-xl border border-gray-300 shadow-md z-50">
                      <div className="flex flex-col gap-1 py-1">
                        <div className="flex gap-1 justify-center px-4 bg-gray-200 mt-2 ">
                          <div className="bg-blue-400 p-3"></div>
                          <div className="bg-gray-400 p-3"></div>
                          <div className="bg-red-400 p-3"></div>
                          <div className="bg-cyan-400 p-3"></div>
                          <div className="bg-pink-400 p-3"></div>
                          <div className="bg-purple-400 p-3"></div>
                        </div>
                        <div className="px-4 text-sm">
                          <div className="flex items-center gap-1 my-1">
                            <div>
                              <BsPencil />
                            </div>
                            <div>Edit</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div>
                              <BsTrash3 />
                            </div>
                            <div> Delete</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                )}
              </div>
              <div className="boardScroll overflow-y-auto max-h-[63vh] mb-2">
                {todo.map((t, key) => (
                  <>
                    <div key={key} onClick={() => setIsTaskOpen(true)}>
                      <TaskCard title={t.title} />
                    </div>
                    {isTaskOpen && (
                      <TaskView
                        onClose={closeTask}
                        data={{
                          title: t.title,
                          desc: t.desc,
                          p: t.priority,
                          status: "In-Progress",
                        }}
                      />
                    )}
                  </>
                ))}
              </div>
              <div
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className="border  hover:bg-gray-200 hover:text-white border-gray-200 text-gray-400 py-1 rounded-md text-center mx-2"
              >
                Add a Card
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-[#BFE1EC] mx-3 px-2 pt-1 pb-3 h-fit rounded-md w-72">
              <div className="flex justify-between items-center mb-3 mt-3 ml-2">
                <div className="flex justify-center items-center">
                  <div className="text-[#283b91]">In Progress </div>
                  <div className="bg-gray-200 rounded-full px-1 text-sm ml-2 text-[#283b91]">
                    8
                  </div>
                </div>
                {!moreOpen2 && (<AiOutlineMore
                  onClick={() => {
                    setMoreOpen2(!moreOpen2);
                  }}
                />
                )}
                {moreOpen2 && (
                  <>
                
                  <div className="relative">
                  <AiOutlineMore
                  onClick={() => {
                    setMoreOpen2(!moreOpen2);
                  }}
                />
                    <div className="absolute  bg-white rounded-xl border border-gray-300 shadow-md z-50">
                      <div className="flex flex-col gap-1 py-1">
                        <div className="flex gap-1 justify-center px-4 bg-gray-200 mt-2 ">
                          <div className="bg-blue-400 p-3"></div>
                          <div className="bg-gray-400 p-3"></div>
                          <div className="bg-red-400 p-3"></div>
                          <div className="bg-cyan-400 p-3"></div>
                          <div className="bg-pink-400 p-3"></div>
                          <div className="bg-purple-400 p-3"></div>
                        </div>
                        <div className="px-4 text-sm">
                          <div className="flex items-center gap-1 my-1">
                            <div>
                              <BsPencil />
                            </div>
                            <div>Edit</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div>
                              <BsTrash3 />
                            </div>
                            <div> Delete</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                )}
              </div>
              <div className="boardScroll overflow-y-auto max-h-[63vh] mb-2">
                {inProgress.map((t, key) => (
                  <>
                    <div key={key} onClick={() => setIsTaskOpen(true)}>
                      <TaskCard title={t.title} />
                    </div>
                    {isTaskOpen && (
                      <TaskView
                        onClose={closeTask}
                        data={{
                          title: t.title,
                          desc: t.desc,
                          p: t.priority,
                          status: "In-Progress",
                        }}
                      />
                    )}
                  </>
                ))}
              </div>
              <div
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className="border  hover:bg-white hover:text-gray-400 bg-gray-200 text-white py-1 rounded-md text-center mx-2"
              >
                Add a Card
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-white mx-3 px-2 pt-1 pb-3 h-fit rounded-md w-72">
              <div className="flex justify-between items-center mb-3 mt-3 ml-2">
                <div className="flex justify-center items-center">
                  <div className="text-[#283b91]">Completed </div>
                  <div className="bg-gray-200 rounded-full px-1 text-sm ml-2 text-[#283b91]">
                    3
                  </div>
                </div>
                {!moreOpen3 && (<AiOutlineMore
                  onClick={() => {
                    setMoreOpen3(!moreOpen3);
                  }}
                />
                )}
                {moreOpen3 && (
                  <>
                
                  <div className="relative">
                  <AiOutlineMore
                  onClick={() => {
                    setMoreOpen3(!moreOpen3);
                  }}
                />
                    <div className="absolute  bg-white rounded-xl border border-gray-300 shadow-md z-50">
                      <div className="flex flex-col gap-1 py-1">
                        <div className="flex gap-1 justify-center px-4 bg-gray-200 mt-2 ">
                          <div className="bg-blue-400 p-3"></div>
                          <div className="bg-gray-400 p-3"></div>
                          <div className="bg-red-400 p-3"></div>
                          <div className="bg-cyan-400 p-3"></div>
                          <div className="bg-pink-400 p-3"></div>
                          <div className="bg-purple-400 p-3"></div>
                        </div>
                        <div className="px-4 text-sm">
                          <div className="flex items-center gap-1 my-1">
                            <div>
                              <BsPencil />
                            </div>
                            <div>Edit</div>
                          </div>
                          <div className="flex items-center gap-1">
                            <div>
                              <BsTrash3 />
                            </div>
                            <div> Delete</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  </>
                )}
              </div>
              <div className="boardScroll overflow-y-auto max-h-[63vh] mb-2">
                {completed.map((t, key) => (
                  <>
                    <div key={key} onClick={() => setIsTaskOpen(true)}>
                      <TaskCard title={t.title} />
                    </div>
                    {isTaskOpen && (
                      <TaskView
                        onClose={closeTask}
                        data={{
                          title: t.title,
                          desc: t.desc,
                          p: t.priority,
                          status: "In-Progress",
                        }}
                      />
                    )}
                  </>
                ))}
              </div>
              <div
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className="border  hover:bg-gray-200 hover:text-white border-gray-200 text-gray-400 py-1 rounded-md text-center mx-2"
              >
                Add a Card
              </div>
            </div>
          </div>

          {!createCard && (
            <div
              onClick={() => {
                setCreateCard(true);
              }}
              className="addCard px-32 flex justify-center items-center h-fit bg-[#F6F6F6] mx-3 text-white rounded-md py-2"
            >
              <AiOutlinePlusCircle className="text-3xl" />
            </div>
          )}

          {createCard && (
            <div className="bg-white mx-3 px-2 py-1 h-fit rounded-md w-72">
              <div className="flex justify-between items-center mb-3 mt-3 ml-2">
                <form className="flex items-center" onSubmit={createList}>
                  <div className="flex justify-center items-center">
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => {
                        setCardName(e.target.value);
                      }}
                      className="text-[#283b91]  focus:outline-none"
                      placeholder="Card Name"
                    />
                  </div>
                  <button type="submit">
                    <MdPlaylistAdd className="text-[#283b91] mr-2" />
                  </button>
                  <IoMdClose
                    className="text-[#283b91] mr-2"
                    onClick={() => {
                      setCreateCard(false);
                    }}
                  />
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && <TaskModal onClose={closeModal} />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    token: state.user.token,
    baseUrl: state.user.baseUrl,
    isLogin: state.user.isLogin,
  };
};

export default connect(mapStateToProps)(Board);
