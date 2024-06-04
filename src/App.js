/* eslint-disable react-hooks/exhaustive-deps */
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import Sidebar from "./app/shared/templates/Sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./app/modules/Dashboard";
import Login from "./app/modules/Login";
import Board from "./app/modules/Board";
import RecruitmentForm from "./app/modules/RecruitmentData/RecruitmentForm.jsx";
import ApplicantsDataTable from "./app/modules/RecruitmentData/ApplicantsDataTable.jsx";
import JobsDataTable from "./app/modules/RecruitmentData/JobsDataTable.jsx";
import ViewEmployee from "./app/modules/Employees/Screens/View";
import Err404 from "./app/modules/Error/Err404.jsx";
import Err401 from "./app/modules/Error/Err401.jsx";
import UpdateEmpForm from "./app/modules/UpdateEmployee/UpdateEmpForm.jsx";
import './assets/css/globle.css'
import axios from "axios";
import Cookies from "universal-cookie";
import PageLoader from './components/PageLoader.jsx';
import {
  setUserLogout,
  setUserProfile,
  setToken,
} from "./state/slices/UserSlice.js";
import BoardList from "./app/modules/BoardList";
import EmpForm from "./app/modules/Employees/EmpForm";
import CreateEmployee from "./app/modules/Employees/Screens/Create.jsx";
import EmpDataSheet from "./app/modules/EmployeesData/EmpDataSheet";
import JobDescription from "./app/modules/RecruitmentData/JobDescription.jsx";
import JobApplicationForm from "./app/modules/RecruitmentData/JobApplicationForm.jsx";
import LeaveApplicationForm from "./app/modules/LeaveApplication/LeaveApplicationForm.jsx";

import LeaveApplicationListHR from "./app/modules/LeaveApplication/LeaveApplicationListHR.jsx";
import LeaveBalance from "./app/modules/LeaveApplication/LeaveBalance.jsx";
import LeaveRequestHR from "./app/modules/LeaveApplication/LeaveRequestHR.jsx";
import LeaveRequestManager from "./app/modules/LeaveApplication/LeaveRequestManager.jsx";
import LeaveCalender from "./app/modules/LeaveApplication/LeaveCalender.jsx";
import EditDataForm from "./app/modules/EmployeesData/EditDataForm.jsx";
import ViewEmpProfile from "./app/modules/Settings/Profile";
import Profile from "./app/modules/Employees/Screens/Profile";
import Test from "./app/modules/Profile/Test.jsx";
import LeaveBalanceEmployee from "./app/modules/LeaveApplication/LeaveBalanceEmployee.jsx";
import LeaveBalanceManager from "./app/modules/LeaveApplication/LeaveBalanceManager.jsx";
import ApplicationStatus from "./app/modules/LeaveApplication/ApplicationStatus.jsx";
import LeaveBalanceHR from "./app/modules/LeaveApplication/LeaveBalanceHR.jsx";
import LeaveApplicationListManager from "./app/modules/LeaveApplication/LeaveApplicationListManager.jsx";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import MyDtr from "./app/modules/DTR/MyDtr.jsx";
import CreateTask from "./app/modules/DTR/CreateTask.jsx";
import ForgotPassword from "./app/modules/Login/ForgotPassword.jsx";
import ResetPassword from "./app/modules/Login/ResetPassword.jsx";
import ComingSoon from "./app/modules/comingSoon/ComingSoon.jsx";
import Welcome from "./app/modules/Employees/Welcome.jsx";
import OnboardComplete from "./app/modules/Employees/OnboardComplete.jsx";

function App() {
  let userProfile = useSelector((state) => state.user.userProfile);
  let isLogin = useSelector((state) => state.user.isLogin);
  let token = useSelector((state) => state.user.token);
  let baseUrl = useSelector((state) => state.user.baseUrl);
  let dispatch = useDispatch();

  let width = window.screen.width;
  let val = width <= 1279 ? false : true;
  const [isSidebarOpen, setIsSidebarOpen] = useState(val);
  const [loading, setLoading] = useState(true);

  const cookies = new Cookies();
  token = cookies.get("token");
  const location = useLocation();

  const handleUpdateProfile = (data) => {
    let updateProfile = {
      id: data.id,
      username: data.username,
      is_filled: data.is_filled,
      role: data.user_role,
    };
    // setUserProfile(updateProfile);
    dispatch(setUserProfile(updateProfile));
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
        dispatch(setToken(token));
        cookies.set("token", token, { path: "*" });
        setLoading(false);
        return;
      }
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // Token expired or invalid
        dispatch(setUserLogout());
      } else {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLogin || isLogin === null) {
      getProfile();
    }
  }, [location]);

  if (loading) {
    return <PageLoader />; // Render the loader if loading is true
  }
  return (
    <>
      {(!userProfile ||
        !userProfile.hasOwnProperty("is_filled") ||
        (isLogin && userProfile.is_filled === null)) && <PageLoader />}
      <Routes>
        {isLogin && (
          <>
            {userProfile.is_filled === true && (
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
                    path="/coming-soon"
                    element={<ComingSoon isSidebarOpen={isSidebarOpen} />}
                  />
                  <Route
                    exact
                    path="/"
                    element={
                      userProfile.role === 2 ? (
                        <Dashboard isSidebarOpen={isSidebarOpen} />
                      ) : (
                        <Dashboard isSidebarOpen={isSidebarOpen} />
                      )
                    }
                  />
                  <Route
                    path="/board/:id"
                    element={<Board isSidebarOpen={isSidebarOpen} />}
                  />
                  {/* <Route path="/profile" element={<UpdateEmpForm />} /> */}
                  <Route path="/profile/:id" element={<UpdateEmpForm />} />
                  <Route path="/profile" element={<ViewEmpProfile />} />
                  <Route path="/project/:id" element={<BoardList />} />
                  {userProfile.role === 1 && (
                    <>
                      <Route
                        exact
                        path="/employees"
                        element={<EmpDataSheet />}
                      />
                      <Route exact path="/test" element={<Test />} />
                      <Route
                        exact
                        path="/add-employee"
                        element={<CreateEmployee />}
                      />
                      <Route
                        path="/edit-employee/:id"
                        element={<Profile />}
                      />
                      <Route path="/user/:id" element={<ViewEmployee />} />

                      <Route path="/job-post" element={<RecruitmentForm />} />
                      <Route
                        path="/edit-post/:id"
                        element={<RecruitmentForm />}
                      />
                      <Route
                        path="/applicants/:id"
                        element={<ApplicantsDataTable />}
                      />
                      <Route path="/jobs" element={<JobsDataTable />} />

                      <Route
                        path="/leave-application"
                        element={
                          <LeaveApplicationForm isSidebarOpen={isSidebarOpen} />
                        }
                      />

                      <Route
                        path="/leave-list"
                        element={
                          <LeaveApplicationListHR
                            isSidebarOpen={isSidebarOpen}
                          />
                        }
                      />
                      <Route
                        path="/leave-request/:id"
                        element={
                          <LeaveRequestManager isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route
                        path="/leave-balance"
                        element={<LeaveBalance isSidebarOpen={isSidebarOpen} />}
                      />
                      <Route
                        path="/leave-application-status"
                        element={
                          <ApplicationStatus isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route
                        path="/leave-request-hr/:id"
                        element={
                          <LeaveRequestHR isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route
                        path="/leave-calender"
                        element={
                          <LeaveCalender isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route path="/create-task" element={<CreateTask />} />
                      <Route path="/my-dtr" element={<MyDtr />} />
                    </>
                  )}
                  {(userProfile.role === 2 || userProfile.role === 4) && (
                    <>
                      <Route
                        path="/leave-application"
                        element={<LeaveApplicationForm />}
                      />

                      <Route
                        path="/leave-list"
                        element={
                          <LeaveApplicationListManager
                            isSidebarOpen={isSidebarOpen}
                          />
                        }
                      />
                      <Route
                        path="/leave-balance"
                        element={<LeaveBalance isSidebarOpen={isSidebarOpen} />}
                      />
                      <Route
                        path="/leave-balance-manager"
                        element={
                          <LeaveBalanceManager isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route
                        path="/leave-balance-employee"
                        element={
                          <LeaveBalanceEmployee isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route
                        path="/leave-application-status"
                        element={
                          <ApplicationStatus isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route
                        path="/leave-request/:id"
                        element={
                          <LeaveRequestManager isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route path="/my-dtr" element={<MyDtr />} />
                      <Route path="/create-task" element={<CreateTask />} />
                    </>
                  )}
                  {userProfile.role === 3 && (
                    <>
                      <Route
                        exact
                        path="/employees"
                        element={<EmpDataSheet />}
                      />
                      <Route
                        exact
                        path="/add-employee"
                        element={<CreateEmployee />}
                      />
                      <Route path="/user/:id" element={<ViewEmployee />} />

                      <Route path="/job-post" element={<RecruitmentForm />} />
                      <Route
                        path="/edit-post/:id"
                        element={<RecruitmentForm />}
                      />
                      <Route
                        path="/applicants/:id"
                        element={<ApplicantsDataTable />}
                      />
                      <Route path="/jobs" element={<JobsDataTable />} />
                      <Route
                        path="/leave-application"
                        element={<LeaveApplicationForm />}
                      />

                      <Route
                        path="/leave-list"
                        element={
                          <LeaveApplicationListHR
                            isSidebarOpen={isSidebarOpen}
                          />
                        }
                      />
                      <Route
                        path="/leave-balance"
                        element={<LeaveBalance isSidebarOpen={isSidebarOpen} />}
                      />
                      <Route
                        path="/leave-balance-hr"
                        element={
                          <LeaveBalanceHR isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route
                        path="/leave-application-status"
                        element={
                          <ApplicationStatus isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route
                        path="/leave-calender"
                        element={
                          <LeaveCalender isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route
                        path="/leave-request/:id"
                        element={
                          <LeaveRequestManager isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route
                        path="/leave-request-hr/:id"
                        element={
                          <LeaveRequestHR isSidebarOpen={isSidebarOpen} />
                        }
                      />
                      <Route path="/create-task" element={<CreateTask />} />
                    </>
                  )}
                </Route>
                {(userProfile.role !== 1 || userProfile.role !== 2) && (
                  <Route path="/recruitment" element={<Err401 />} />
                )}
                {(userProfile.role !== 1 || userProfile.role !== 2) && (
                  <Route path="/applicants/:id" element={<Err401 />} />
                )}
                {(userProfile.role !== 1 || userProfile.role !== 2) && (
                  <Route path="/jobs" element={<Err401 />} />
                )}
                {(userProfile.role !== 1 || userProfile.role !== 2) && (
                  <Route path="/user/:id" element={<Err401 />} />
                )}
                {(userProfile.role !== 1 || userProfile.role !== 2) && (
                  <Route exact path="/emp-dataform" element={<Err401 />} />
                )}
                {(userProfile.role !== 1 || userProfile.role !== 2) && (
                  <Route exact path="/employees" element={<Err401 />} />
                )}
              </>
            )}
            {userProfile.is_filled === false && (
              <>
                <Route exact path="/welcome" element={<Welcome />} />
                <Route exact path="/onboard-completion" element={<OnboardComplete />} />
                <Route exact path="/" element={<EmpForm />} />
              </>
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
        <Route path="/apply/:id" element={<JobApplicationForm />} />
        <Route path="/job-description/:id" element={<JobDescription />} />
        {/* forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirm-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
