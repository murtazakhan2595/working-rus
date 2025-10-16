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
import { getNodeExistInTree } from "utils/renderValues";
import Error from "app/modules/Error";
// import useAccessCheck from "app/hooks/useAccessCheck";
import {fetchInterviewOptions} from "./state/slices/ScreenedInterview";
import ChatbrixWidget from "./components/ChatbrixWidget";

function App() {
  // Prevent body scroll while inside the dropdown
  useEffect(() => {
    const handleWheel = (e) => {
      const scrollable = e.target.closest(
        '[data-radix-popper-content], [data-radix-popper-content-wrapper], [role="listbox"]'
      );
      if (!scrollable) return;

      // Ensure the element can scroll
      if (scrollable.scrollHeight <= scrollable.clientHeight) return;

      const delta = e.deltaY;
      const atTop = scrollable.scrollTop === 0;
      const atBottom =
        scrollable.scrollTop + scrollable.clientHeight >=
        scrollable.scrollHeight - 1;

      // Prevent body scroll while inside the dropdown
      if ((delta < 0 && !atTop) || (delta > 0 && !atBottom)) {
        e.stopPropagation();
        e.preventDefault();
        scrollable.scrollTop += delta;
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, []);

  const isLogin = useSelector((state) => state.user.isLogin);
  const ModuleList = useSelector(
    (state) => state.roles_permissions.user_permitted_modules
  );
  const Modules_Permitted = useMemo(() => {
    return { code_name: "DASHBOARD", childrens: ModuleList };
  }, [ModuleList]);

  // API access check - runs on every page load
  // const { isChecking, hasAccess } = useAccessCheck();

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
        if (response.data?.clearance_required) {
          navigate("/clearance-revoke");
        }
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
      console.error("Error fetching data:", error);
      const pathname = location.pathname;
      const errorResponse = error.response;
      if (
        errorResponse &&
        (errorResponse?.status === 401 || errorResponse?.status === 403)
      ) {
        // // Token expired or invalid
        const protectedRoutes = [
          "/demographics-form",
          "/applicant-offer",
          "/forgot-password",
          "/confirm-password",
          "/access-denied",
        ];
        const isProtectedRoute = protectedRoutes.some((route) =>
          pathname.startsWith(route)
        );

        if (!isProtectedRoute) {
          dispatch(setUserLogout());
          navigate("/login");
        }
      } else if (pathname === "/" && errorResponse?.status === 404) {
        dispatch(setUserLogout());
        navigate("/login");
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isLogin || isLogin === null) {
      setLoading(true);
      getProfile();
    }
    // dispatch(fetchInterviewOptions());
  }, [dispatch]);

  if (loading) {
    return <PageLoader height="100vh" />;
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
      {/* <ChatbrixWidget />/ */}
    </>
  );
}

export default App;
