import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { useParams , useNavigate } from "react-router-dom";

const BoardList = ({ userProfile, baseUrl, token }) => {
  let { id } = useParams();
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate()
  const getBoards = async (url = `${baseUrl}/board/?search={"project_id":[${id}]}`) => {
    try {
      await axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setBoardList(response.data.results);
          }
        });
    } catch (error) {}
  };

  useEffect(() =>{ getBoards()}, [id]);
  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-5 text-center w-[70%]">BoardList</div>
      <div className="mt-10 w-[70%]">
      <div className="flex gap-10 flex-row border-b-2">
            <div className="font-semibold">SNO</div>
            <div className="font-semibold">Board Name</div>
          </div>
        {boardList.length !== 0 ? boardList.map((board, index) => (
          <div className="flex gap-16 flex-row border-b" key={index}>
            <div >{index+1}</div>
            <div className="cursor-pointer hover:text-blue-500" onClick={()=>{navigate(`/board/${board.id}`)}}>{board.name}</div>
          </div>
        )) : <div className="text-center">Project is Empty</div>}
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

export default connect(mapStateToProps)(BoardList);
