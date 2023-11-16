/* eslint-disable react-hooks/exhaustive-deps */
import "./index.css";
import { useState, useEffect } from "react";
import Sidebar from "./app/shared/templates/Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./app/modules/Dashboard";
import Login from "./app/modules/Login";
import Board from "./app/modules/Board";
import Err404 from "./app/modules/Error/Err404.jsx";

import axios from "axios";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import {
  setUserLogout,
  setUserProfile,
  setToken,
} from "./state/actions/UserAction";
import BoardList from "./app/modules/BoardList";
import EmpForm from "./app/Employees/EmpForm";
import EmpDataForm from "./app/modules/EmployeesData/EmpDataForm";
import EmpDataSheet from "./app/modules/EmployeesData/EmpDataSheet";
import RecruitmentForm from './app/modules/Recruitment Data/RecruitmentForm.jsx'
import ApplicantsDataTable from "./app/modules/Recruitment Data/ApplicantsDataTable.jsx";
import JobsDataTable from "./app/modules/Recruitment Data/JobsDataTable.jsx";
import ViewEmployee from "./app/modules/EmployeesData/ViewEmployee.jsx";

function App({ setUserProfile, userProfile,baseUrl, isLogin, setToken, setUserLogout }) {
  let width = window.screen.width;
  let val = width <= 1280 ? false : true;
  const [isSidebarOpen, setIsSidebarOpen] = useState(val);

  const cookies = new Cookies();
  let token = cookies.get("token");
  const location = useLocation();

  const handleUpdateProfile = (data) => {
    let updateProfile = { id: data.id, username: data.username ,is_filled:data.is_filled};
    setUserProfile(updateProfile);
  };

  const getProfile = async () => {
    try {
      let response = await axios.get(`${baseUrl}/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        handleUpdateProfile(response.data);
        setToken(token);
        cookies.set("token", token, { path: "*" });
        return;
      }
    } catch (error) {
      setUserLogout();
    }
  };

  useEffect(() => {
    getProfile();
  }, [location]);

  return (
    <>
      <Routes>
        {isLogin ? (
          <>
          {!userProfile.is_filled ?
              <Route
              exact
              path="/"
              element={<EmpForm isSidebarOpen={isSidebarOpen} />}
            />
         : 
            <Route
              element={
                <Sidebar
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                />
              }
            >
              <Route
                exact
                path="/"
                element={<Dashboard isSidebarOpen={isSidebarOpen} />}
              />
              <Route
                exact
                path="/emp-data"
                element={<EmpDataSheet/>}
              />
              <Route
                exact
                path="/emp-dataform"
                element={<EmpDataForm/>}
              />
              <Route
                exact
                path="/recruitment-form"
                element={<RecruitmentForm />}
              />

              <Route
                exact
                path="/applicants-datatable"
                element={<ApplicantsDataTable />}
              />

              <Route
                exact
                path="/jobs-datatable"
                element={<JobsDataTable />}
              />

              <Route
                exact
                path="/user/:id"
                element={<ViewEmployee />}
              />
             
              <Route path="/board/:id" element={<Board />} />
              <Route path="/project/:id" element={<BoardList />} />
            </Route>
}
            <Route path="*" element={<Err404 />} />
          </>
        ) : (
          ""
        )}
        {!isLogin && (
          <>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Err404 />} />
          </>
        )}
      </Routes>

      {isLogin === null && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
      )}
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userProfile,
    baseUrl: state.user.baseUrl,
    isLogin: state.user.isLogin,
  };
};

export default connect(mapStateToProps, {
  setUserLogout,
  setUserProfile,
  setToken,
})(App);
