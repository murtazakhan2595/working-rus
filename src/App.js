/* eslint-disable react-hooks/exhaustive-deps */

import "./index.css";
import { useState, useEffect } from "react";
import Sidebar from "./app/shared/templates/Sidebar";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Err404 from "./app/modules/Error/Err404.jsx";
import Err401 from "./app/modules/Error/Err401.jsx";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { PageLoader } from "components";
import { setUserLogout, setToken } from "./state/slices/UserSlice.js";
import { handleUpdateProfile } from "data/Data";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import "./index.css";
import { SidebarRoutes, LoginRoutes, GeneralRoutes } from "constants/routes";

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
       
        {GeneralRoutes.map((route) => {
          return <Route path={route.path} element={route.component} />;
        })}
        <Route path="*" element={<Err404 />} />
      </Routes>
    </>
  );
}

export default App;
