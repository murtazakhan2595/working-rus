/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import "./index.css";
import { useState, useEffect } from "react";
import Sidebar from "./app/shared/templates/Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./app/modules/Dashboard";
import Login from "./app/modules/Login";
import Board from "./app/modules/Board";
import RecruitmentForm from "./app/modules/RecruitmentData/RecruitmentForm.jsx";
import ApplicantsDataTable from "./app/modules/RecruitmentData/ApplicantsDataTable.jsx";
import JobsDataTable from "./app/modules/RecruitmentData/JobsDataTable.jsx";
import ViewEmployee from "./app/modules/EmployeesData/ViewEmployee.jsx";
import Err404 from "./app/modules/Error/Err404.jsx";
import Err401 from "./app/modules/Error/Err401.jsx";
import UpdateEmpForm from "./app/modules/UpdateEmployee/UpdateEmpForm.jsx";

import axios from "axios";
import Cookies from "universal-cookie";
import { connect } from "react-redux";
import {
  setUserLogout,
  setUserProfile,
  setToken,
} from "./state/actions/UserAction";
import BoardList from "./app/modules/BoardList";
import EmpForm from "./app/modules/Employees/EmpForm";
import EmpDataForm from "./app/modules/EmployeesData/EmpDataForm";
import EmpDataSheet from "./app/modules/EmployeesData/EmpDataSheet";

function App({
  setUserProfile,
  userProfile,
  baseUrl,
  isLogin,
  setToken,
  setUserLogout,
}) {
  let width = window.screen.width;
  let val = width <= 1280 ? false : true;
  const [isSidebarOpen, setIsSidebarOpen] = useState(val);
  const navigate = useNavigate();

  const cookies = new Cookies();
  let token = cookies.get("token");
  const location = useLocation();

  const handleUpdateProfile = (data) => {
    let updateProfile = {
      id: data.id,
      username: data.username,
      is_filled: data.is_filled,
      role: data.user_role,
    };
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
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Token expired or invalid
        setUserLogout();
        navigate("/");
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };
  
  useEffect(() => {
    if (isLogin || isLogin === null){
      getProfile();
    }
  }, [location]);

  return (
    <>
      {(isLogin === null || userProfile.is_filled === undefined) && (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
      )}

      <Routes>
        {isLogin && (
          <>
            {userProfile.is_filled === true ? (
              <>
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
                  <Route path="/board/:id" element={<Board />} />
                  <Route path="/profile" element={<UpdateEmpForm />} />
                  <Route path="/project/:id" element={<BoardList />} />
                  {(userProfile.role === 1 || userProfile.role === 2) && (
                    <>
                      <Route
                        exact
                        path="/emp-data"
                        element={<EmpDataSheet />}
                      />
                      <Route
                        exact
                        path="/emp-dataform"
                        element={<EmpDataForm />}
                      />
                      <Route
                        path="/recruitment-form"
                        element={<RecruitmentForm />}
                      />
                      <Route
                        path="/applicants-datatable"
                        element={<ApplicantsDataTable />}
                      />
                      <Route
                        path="/jobs-datatable"
                        element={<JobsDataTable />}
                      />
                      <Route path="/user/:id" element={<ViewEmployee />} />
                    </>
                  )}
                </Route>
                {(userProfile.role !== 1 || userProfile.role !== 2) && (
                  <Route path="/recruitment-form" element={<Err401 />} />
                )}
                {(userProfile.role !== 1 || userProfile.role !== 2) && (
                  <Route path="/applicants-datatable" element={<Err401 />} />
                )}
                {(userProfile.role !== 1 || userProfile.role !== 2) && (
                  <Route path="/jobs-datatable" element={<Err401 />} />
                )}
                {(userProfile.role !== 1 || userProfile.role !== 2) && (
                  <Route path="/user/:id" element={<Err401 />} />
                )}
                {(userProfile.role !== 1 || userProfile.role !== 2) && (
                  <Route exact path="/emp-dataform" element={<Err401 />} />
                )}
                {(userProfile.role !== 1 || userProfile.role !== 2) && (
                  <Route exact path="/emp-data" element={<Err401 />} />
                )}
              </>
            ) : (
              <Route exact path="/" element={<EmpForm />} />
            )}
            <Route path="*" element={<Err404 />} />
          </>
        )}
        {!isLogin && (
          <>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Err404 />} />
          </>
        )}
      </Routes>
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
