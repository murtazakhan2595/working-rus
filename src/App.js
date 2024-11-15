/* eslint-disable react-hooks/exhaustive-deps */

// import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { useState, useEffect } from "react";
import Sidebar from "./app/shared/templates/Sidebar";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Dashboard from "./app/modules/Dashboard";
import Login from "./app/modules/Login";
import {
  Applications,
  Jobs,
  CreateUpdateJob,
  JobDescription,
  JobApplicationForm,
} from "./app/modules/RecruitmentData";
import {
  LeaveTracker,
  MyLeaveTracker,
  LeaveRequests,
} from "app/modules/LeaveTracker";
import { Projects, Board } from "app/modules/TaskManagment";
import ViewEmployee from "./app/modules/Employees/Screens/View";
import Err404 from "./app/modules/Error/Err404.jsx";
import Err401 from "./app/modules/Error/Err401.jsx";
import "react-toastify/dist/ReactToastify.css";
// removed globle css as it is not used in the project
// import "./assets/css/globle.css";
import axios from "axios";
import { setUserLogout, setToken } from "./state/slices/UserSlice.js";
import { handleUpdateProfile } from "data/Data";
import CreateUpdateEmployee from "./app/modules/Employees/Screens/Create.jsx";
import Employee from "./app/modules/Employees/Employee.jsx";
import { EditEmployeeProfile } from "./app/modules/Employees/Screens/Profile";
import Test from "./app/modules/Profile/Test.jsx";
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
import EmployeesExit from "app/modules/EmployeesExit";
import { ExitAndClearance } from "app/modules/ExitAndClearance";
import "./index.css";
import { SidebarRoutes, LoginRoutes, GeneralRoutes } from "constants/routes";
import {
  Payslip,
  EmployeeSalaryDetails,
  EmployeesPayroll,
  MyPayroll,
  SalarySetup,
  SalarySetupDetail,
  PayRun,
  CreatePayRun,
  PayRunDetails,
} from "app/modules/payroll";
import { ClaimRequest, MyClaims } from "app/modules/claims";
import Attendance from "app/modules/Attendance";
import StyleGuide from "./app/modules/StyleGuide";

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
    setUserRole(userProfile.role);
  }, [userProfile]);

  if (loading) {
    return <PageLoader />; // Render the loader if loading is true
  }
  console.log(SidebarRoutes, userProfile);
  return (
    <>
      <Routes>
        {isLogin && (
          <>
            {LoginRoutes.map((route) => {
              return <Route path={route.path} element={route.component} />;
            })}
            <Route
              element={
                <Sidebar
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                  userRole={userRole}
                />
              }
            >
              {SidebarRoutes.map((route) => {
                return <Route path={route.path} element={route.component} />;
              })}

              <Route path="*" element={<Err404 />} />
            </Route>
          </>
        )}
        {/* {!isLogin && (
          <>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Err404 />} />
          </>
        )} */}
        {GeneralRoutes.map((route) => {
          return <Route path={route.path} element={route.component} />;
        })}
        <Route path="*" element={<Err404 />} />
      </Routes>
    </>
  );
}

export default App;
