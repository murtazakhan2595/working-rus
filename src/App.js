/* eslint-disable react-hooks/exhaustive-deps */
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import { useState, useEffect } from "react";
import Sidebar from "./app/shared/templates/Sidebar";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./app/modules/Dashboard";
import Login from "./app/modules/Login";
import Board from "./app/modules/Board";
import {
  Applications,
  Jobs,
  CreateUpdateJob,
  JobDescription,
  JobApplicationForm,
} from "./app/modules/RecruitmentData";
import {
  LeaveApplications,
  MyLeaves,
  CreateLeaveRequest,
} from "app/modules/LeaveManagment";
import ViewEmployee from "./app/modules/Employees/Screens/View";
import Err404 from "./app/modules/Error/Err404.jsx";
import Err401 from "./app/modules/Error/Err401.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/globle.css";
import axios from "axios";
import {
  setUserLogout,
  setUserProfile,
  setToken,
} from "./state/slices/UserSlice.js";
import { handleUpdateProfile } from "data/Data";
import BoardList from "./app/modules/BoardList";
import CreateUpdateEmployee from "./app/modules/Employees/Screens/Create.jsx";
import LeaveApplicationForm from "./app/modules/LeaveApplication/LeaveApplicationForm.jsx";
import Employee from "./app/modules/Employees/Employee.jsx";
import LeaveApplicationListHR from "./app/modules/LeaveApplication/LeaveApplicationListHR.jsx";
import LeaveBalance from "./app/modules/LeaveApplication/LeaveBalance.jsx";
import LeaveRequestHR from "./app/modules/LeaveApplication/LeaveRequestHR.jsx";
import LeaveRequestManager from "./app/modules/LeaveApplication/LeaveRequestManager.jsx";
import LeaveCalender from "./app/modules/LeaveApplication/LeaveCalender.jsx";
import { EditEmployeeProfile } from "./app/modules/Employees/Screens/Profile";
import Test from "./app/modules/Profile/Test.jsx";
import LeaveBalanceEmployee from "./app/modules/LeaveApplication/LeaveBalanceEmployee.jsx";
import LeaveBalanceManager from "./app/modules/LeaveApplication/LeaveBalanceManager.jsx";
import ApplicationStatus from "./app/modules/LeaveApplication/ApplicationStatus.jsx";
import LeaveBalanceHR from "./app/modules/LeaveApplication/LeaveBalanceHR.jsx";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import MyDtr from "./app/modules/DTR/MyDtr.jsx";
import CreateTask from "./app/modules/DTR/CreateTask.jsx";
import ForgotPassword from "./app/modules/Login/ForgotPassword.jsx";
import ResetPassword from "./app/modules/Login/ResetPassword.jsx";
import ComingSoon from "./app/modules/comingSoon/ComingSoon.jsx";
import PageLoader from "./components/PageLoader.jsx";
import Services from "../src/app/shared/templates/Sidebar/Services.jsx";
import CreateEmployeeProfile from "./app/modules/Employees/Screens/AddProfile/CreateEmployeeProfile.jsx";

function App() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const userProfile = useSelector((state) => state.user.userProfile);
  const token = window.localStorage.getItem("token");
  const baseUrl = useSelector((state) => state.user.baseUrl);
  let dispatch = useDispatch();

  let width = window.screen.width;
  let val = width <= 1279 ? false : true;
  const [isSidebarOpen, setIsSidebarOpen] = useState(val);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(userProfile.role);
  const navigate = useNavigate();
  const location = useLocation();

  // const handleUpdateProfile = (data) => {
  //   let updateProfile = {
  //     id: data.id,
  //     username: data.username,
  //     is_filled: data.is_filled,
  //     role: data.user_role,
  //   };
  //   // setUserProfile(updateProfile);
  //   dispatch(setUserProfile(updateProfile));
  // };

  const getProfile = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("i am getProfile respnse from app.js", response);
      if (response.status === 200) {
        setUserRole(response.data.user_role);
        if (!response.data.is_filled) {
          navigate("/create-profile");
        }
        handleUpdateProfile(dispatch, response.data);
        dispatch(setToken(token));
        window.localStorage.setItem("token", token);
        setLoading(false);
        return;
      }
    } catch (error) {
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        // // Token expired or invalid
        const protectedRoutes = [
          "/apply",
          "/job-description",
          "/forgot-password",
          "/confirm-password",
        ];
        const isProtectedRoute = protectedRoutes.some((route) =>
          location.pathname.startsWith(route)
        );

        if (!isProtectedRoute) {
          dispatch(setUserLogout());
          navigate("/login");
        }
      } else {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLogin || isLogin === null) {
      setLoading(true);
      getProfile();
    }
  }, []);

  useEffect(() => {
    setUserRole(userProfile.user_role);
  }, [userProfile]);

  if (loading) {
    return <PageLoader />; // Render the loader if loading is true
  }
  console.log(userRole, userProfile);
  return (
    <>
      <Routes>
        {isLogin && (
          <>
            <Route
              exact
              path="/create-profile"
              element={<CreateEmployeeProfile />}
            />
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
                path="/services"
                element={<Services isSidebarOpen={isSidebarOpen} />}
              />
              <Route
                exact
                path="/"
                element={<Dashboard isSidebarOpen={isSidebarOpen} />}
              />
              <Route
                path="/board/:id"
                element={<Board isSidebarOpen={isSidebarOpen} />}
              />
              <Route
                path="/my-profile"
                element={<ViewEmployee profileView />}
              />
              <Route exact path="/test" element={<Test />} />

              <Route path="/edit-post/:id" element={<CreateUpdateJob />} />

              <Route path="/leave-list" element={<LeaveApplicationListHR />} />
              <Route
                path="/leave-request/:id"
                element={<LeaveRequestManager isSidebarOpen={isSidebarOpen} />}
              />
              <Route path="/leave-balance" element={<LeaveBalance />} />
              <Route path="/leave-request" element={<CreateLeaveRequest />} />
              <Route
                path="/leave-application-status"
                element={<ApplicationStatus isSidebarOpen={isSidebarOpen} />}
              />
              <Route
                path="/leave-request-hr/:id"
                element={<LeaveRequestHR isSidebarOpen={isSidebarOpen} />}
              />
              <Route path="/my-team" element={<ComingSoon />} />
              <Route path="/calender" element={<ComingSoon />} />
              <Route path="/attendence" element={<ComingSoon />} />
              <Route path="/my-leaves" element={<MyLeaves />} />
              <Route path="/files-data" element={<ComingSoon />} />
              <Route path="/announcement" element={<ComingSoon />} />
              <Route path="/recognition" element={<ComingSoon />} />
              <Route path="/my-travel-details" element={<ComingSoon />} />
              <Route path="/letter-request" element={<ComingSoon />} />
              <Route
                path="/leave-balance-manager"
                element={<LeaveBalanceManager isSidebarOpen={isSidebarOpen} />}
              />
              <Route
                path="/leave-balance-employee"
                element={<LeaveBalanceEmployee isSidebarOpen={isSidebarOpen} />}
              />
              <Route path="/edit-post/:id" element={<CreateUpdateJob />} />
              <Route
                path="/leave-balance-hr"
                element={<LeaveBalanceHR isSidebarOpen={isSidebarOpen} />}
              />
              <Route path="/leave-calender" element={<LeaveCalender />} />
              {userRole === 1 && (
                <>
                  <Route path="/create-task" element={<CreateTask />} />
                  <Route path="/my-dtr" element={<MyDtr />} />
                  <Route path="/reports" element={<ComingSoon />} />
                </>
              )}

              {(userRole === 1 || userRole === 3) && (
                <>
                  <Route
                    exact
                    path="/profile-management"
                    element={<Employee />}
                  />
                  <Route path="/settings" element={<ComingSoon />} />
                  <Route
                    exact
                    path="/travel-details"
                    element={<ComingSoon />}
                  />
                  <Route path="/exit-clearance" element={<ComingSoon />} />
                  <Route path="/customise-employees" element={<ComingSoon />} />
                  <Route path="/relocation" element={<ComingSoon />} />
                  <Route
                    exact
                    path="/create-employee"
                    element={<CreateUpdateEmployee />}
                  />
                  <Route
                    path="/edit-employee"
                    element={<CreateUpdateEmployee />}
                  />
                  <Route
                    path="/profile/:id"
                    element={<EditEmployeeProfile />}
                  />
                  <Route path="/payroll" element={<ComingSoon />} />
                  <Route path="/attendance" element={<ComingSoon />} />
                  <Route path="/development-plan" element={<ComingSoon />} />
                  <Route path="/user/:id" element={<ViewEmployee />} />
                </>
              )}
              {(userRole === 1 || userRole === 2 || userRole === 3) && (
                <>
                  <Route
                    path="/personnel-requisition"
                    element={<ComingSoon />}
                  />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/job-post" element={<CreateUpdateJob />} />
                  <Route path="/applicants/:id" element={<Applications />} />
                  <Route path="/applicants" element={<Applications />} />
                  <Route path="/tests" element={<Test />} />
                  <Route path="/referals" element={<ComingSoon />} />
                  <Route path="/learn" element={<ComingSoon />} />
                  <Route path="/career-planning" element={<ComingSoon />} />
                  <Route path="/on-boarding" element={<ComingSoon />} />
                  <Route path="/employee-evaluation" element={<ComingSoon />} />
                  <Route path="/project/:id" element={<BoardList />} />
                  <Route
                    path="/leave-application"
                    element={<LeaveApplications />}
                  />
                </>
              )}
            </Route>
            {(userRole !== 1 || userRole !== 2) && (
              <Route path="/recruitment" element={<Err401 />} />
            )}
            {(userRole !== 1 || userRole !== 2) && (
              <Route path="/applicants/:id" element={<Err401 />} />
            )}
            {(userRole !== 1 || userRole !== 2) && (
              <Route exact path="/emp-dataform" element={<Err401 />} />
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
        <Route path="/login" element={<Login />} />
        <Route path="/apply/:id" element={<JobApplicationForm />} />
        <Route path="/job-description/:id" element={<JobDescription />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/confirm-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
