/* eslint-disable react-hooks/exhaustive-deps */

import "./index.css";
import { useState, useEffect, useMemo } from "react";
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
import { doesNodeExistInTree } from "utils/renderValues";
import { getNodeExistInTree } from "utils/renderValues";
import Error from "app/modules/Error";

function App() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const ModuleList = useSelector(
    (state) => state.roles_permissions.user_permitted_modules
  );
  const Modules_Permitted = useMemo(() => {
    return { code_name: "DASHBOARD", childrens: ModuleList };
  }, [ModuleList]);

  const token = window.localStorage.getItem("token");
  const baseUrl = useSelector((state) => state.user.baseUrl);
  let dispatch = useDispatch();
  let width = window.screen.width;
  let val = width <= 1279 ? false : true;
  const [isSidebarOpen, setIsSidebarOpen] = useState(val);
  const [loading, setLoading] = useState(true);
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
        if (!response.data.is_filled) {
          navigate("/create-profile");
        }
        await handleUpdateProfile(dispatch, response.data);
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

  if (loading) {
    return <PageLoader height="100vh" />; // Render the loader if loading is true
  }
  return (
    <>
      <Routes>
        {isLogin && (
          <>
            {LoginRoutes.map((route) => {
              return (
                <Route path={route?.path || "#"} element={route.component} />
              );
            })}
            <Route
              element={
                <Sidebar
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={setIsSidebarOpen}
                  ModuleList={ModuleList}
                />
              }
            >
              {SidebarRoutes.map((route) => {
                const hasAccess = getNodeExistInTree(
                  Modules_Permitted,
                  route.name,
                  "code_name"
                );
                if (!hasAccess && route.name !== "CHANGE_PASSWORD")
                  return <Route path="*" element={<Error errorType={401} />} />;

                return (
                  <Route
                    key={route.path || route.name}
                    path={route.path || "#"}
                    element={route.component}
                  />
                );
              })}

              <Route path="*" element={<Err404 />} />
            </Route>
          </>
        )}

        {GeneralRoutes.map((route) => {
          return <Route path={route.path} element={route.component} />;
        })}

        {/* Test routes for error pages */}
        <Route path="/test-401" element={<Err401 />} />

        <Route path="*" element={<Err404 />} />
      </Routes>
    </>
  );
}

export default App;
