import React from "react";
import { Navigate } from "react-router-dom";
import { SELF_SERVICE_PERMISSIONS } from "../modules/SelfService/permissions/constants";
import { ProtectedRoute } from "../modules/SelfService/components/ProtectedRoute";

// Import your components
import MyProfile from "../modules/SelfService/MyProfile";
import MyAttendance from "../modules/SelfService/MyAttendance";
import MyDTR from "../modules/SelfService/MyDTR";
import MyShiftCalendar from "../modules/SelfService/MyShiftCalendar";
import MyLeaveTracker from "../modules/SelfService/MyLeaveTracker";
import MyPayroll from "../modules/SelfService/MyPayroll";
import MyClaims from "../modules/SelfService/MyClaims";
import MyTransfers from "../modules/SelfService/MyTransfers";
import MyDocuments from "../modules/SelfService/MyDocuments";
import MyAssets from "../modules/SelfService/MyAssets";
import Exit from "../modules/SelfService/Exit";
import EOSSettlementDetails from "../modules/SelfService/Exit/EOSSettlementDetails";

const selfServiceRoutes = [
  {
    path: "/self-service",
    element: <Navigate to="/self-service/profile" />,
  },
  // Profile Routes
  {
    path: "/self-service/profile",
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.PROFILE.PERSONAL_INFO.VIEW]}
        component={MyProfile}
      />
    ),
  },
  // Attendance Routes
  {
    path: "/self-service/attendance",
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.ATTENDANCE.VIEW_RECORDS]}
        component={MyAttendance}
      />
    ),
  },
  // DTR Routes
  {
    path: "/self-service/dtr",
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.DTR.VIEW]}
        component={MyDTR}
      />
    ),
  },
  // Shift Calendar Routes
  {
    path: "/self-service/shift-calendar",
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.SHIFT_CALENDAR.VIEW]}
        component={MyShiftCalendar}
      />
    ),
  },
  // Leave Routes
  {
    path: "/self-service/leave",
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.LEAVE.VIEW]}
        component={MyLeaveTracker}
      />
    ),
  },
  // Payroll Routes
  {
    path: "/self-service/payroll",
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.PAYROLL.VIEW]}
        component={MyPayroll}
      />
    ),
  },
  // Claims Routes
  {
    path: "/self-service/claims",
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.CLAIMS.VIEW]}
        component={MyClaims}
      />
    ),
  },
  // Transfers Routes
  {
    path: "/self-service/transfers",
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.TRANSFERS.VIEW]}
        component={MyTransfers}
      />
    ),
  },
  // Documents Routes
  {
    path: "/self-service/documents",
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.DOCUMENTS.VIEW]}
        component={MyDocuments}
      />
    ),
  },
  // Assets Routes
  {
    path: "/self-service/assets",
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.ASSETS.VIEW]}
        component={MyAssets}
      />
    ),
  },
  // Exit Routes
  {
    path: "/self-service/exit",
    element: (
      <ProtectedRoute
        permissions={[SELF_SERVICE_PERMISSIONS.EXIT.VIEW_REQUESTS]}
        component={Exit}
      />
    ),
  },
  {
    path: "/self-service/exit/eos-settlement/:id",
    element: <EOSSettlementDetails />,
  },
  // Add other self-service routes as needed
];

export default selfServiceRoutes; 