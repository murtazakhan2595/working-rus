import React from "react";
import { connect } from "react-redux";
import { IoIosSearch } from "react-icons/io";
import { RiArrowDownSFill } from "react-icons/ri";
import { BsPencil, BsTrash3, BsBookmark } from "react-icons/bs";
import { AiTwotoneStar, AiOutlineMore ,AiOutlinePlusCircle} from "react-icons/ai";
import { FiFilter } from "react-icons/fi";
import { Link } from "react-router-dom";
import './index.css'
const Board = ({ userProfile, baseUrl, token, isLogin }) => {
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
            HRMS Project
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

      <div className="flex">
        {/* Box 1 */}
        <div className="bg-white ml-10 mr-3 px-2 pt-1 pb-3 h-fit rounded-md w-72">
          <div className="flex justify-between items-center mb-3 mt-3 ml-2">
            <div className="flex justify-center items-center">
              <div className="text-[#283b91]">Task Screen </div>
              <div className="bg-gray-200 rounded-full px-1 text-sm ml-2 text-[#283b91]">3</div>
            </div>
            <AiOutlineMore />
          </div>
          <div className="boardScroll overflow-y-auto max-h-[63vh] mb-2">
          {[1, 2, 3 ].map((key) => (
            <div key={key}>
              <div className="bg-[#F2F2F2] rounded-md p-3 m-2">
                <div className="opacity-70">
                  My Bords sections, multiple project details, to accumulate
                  ideas etc.
                </div>
                <hr className=" bg-white h-[2px] my-2" />
                <div className="flex justify-between">
                  <BsBookmark className="text-xs text- opacity-50" />
                  <BsTrash3 className="text-xs opacity-50 " />
                </div>
              </div>
            </div>
          ))}
          </div>
          <div className="border  hover:bg-gray-200 hover:text-white border-gray-200 text-gray-400 py-1 rounded-md text-center mx-2">
            Add a Card
          </div>
        </div>

        {/* Box 2 */}
        <div className="bg-[#BFE1EC] mx-3 px-2 pt-1 pb-3 h-fit rounded-md w-72">
          <div className="flex justify-between items-center mb-3 mt-3 ml-2">
            <div className="flex justify-center items-center">
              <div className="text-[#283b91]">Perfomance </div>
              <div className="bg-gray-200 rounded-full px-1 text-sm ml-2 text-[#283b91]">8</div>
            </div>
            <AiOutlineMore />
          </div>
          <div className="boardScroll overflow-y-auto h-[63vh] mb-2">
          {[1, 2, 3 , 4 , 5 , 6 , 7 , 8].map((key) => (
            <div key={key}>
              <div className="bg-[#F2F2F2] rounded-md p-3 m-2">
                <div className="opacity-70">
                  My Bords sections, multiple project details, to accumulate
                  ideas etc.
                </div>
                <hr className=" bg-white h-[2px] my-2" />
                <div className="flex justify-between">
                  <BsBookmark className="text-xs text- opacity-50" />
                  <BsTrash3 className="text-xs opacity-50 " />
                </div>
              </div>
            </div>
          ))}
          </div>
          <div className="border  hover:bg-white hover:text-gray-400 bg-gray-200 text-white py-1 rounded-md text-center mx-2">
            Add a Card
          </div>
        </div>


        {/* Box 3 */}
        <div className="bg-white mx-3 px-2 pt-1 pb-3 h-fit rounded-md w-72">
          <div className="flex justify-between items-center mb-3 mt-3 ml-2">
            <div className="flex justify-center items-center">
              <div className="text-[#283b91]">Perfomance </div>
              <div className="bg-gray-200 rounded-full px-1 text-sm ml-2 text-[#283b91]">3</div>
            </div>
            <AiOutlineMore />
          </div>
          <div className="boardScroll overflow-y-auto max-h-[63vh] mb-2">
          {[1, 2, 3].map((key) => (
            <div key={key}>
              <div className="bg-[#F2F2F2] rounded-md p-3 m-2">
                <div className="opacity-70">
                  My Bords sections, multiple project details, to accumulate
                  ideas etc.
                </div>
                <hr className=" bg-white h-[2px] my-2" />
                <div className="flex justify-between">
                  <BsBookmark className="text-xs text- opacity-50" />
                  <BsTrash3 className="text-xs opacity-50 " />
                </div>
              </div>
            </div>
          ))}
          </div>
          <div className="border  hover:bg-gray-200 hover:text-white border-gray-200 text-gray-400 py-1 rounded-md text-center mx-2">
            Add a Card
          </div>
        </div>

        <div className="addCard w-72 flex justify-center items-center h-fit bg-[#F6F6F6] mx-3 text-white rounded-md py-2">
            <AiOutlinePlusCircle className="text-3xl"/>
          </div>
      </div>
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
