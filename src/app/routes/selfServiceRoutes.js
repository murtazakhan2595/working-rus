import React from "react";
import { Navigate } from "react-router-dom";

// Import your components
import Exit from "../modules/SelfService/Exit/Exit";
import EOSSettlementDetails from "../modules/SelfService/Exit/EOSSettlementDetails";

const selfServiceRoutes = [
  {
    path: "/self-service",
    element: <Navigate to="/self-service/dashboard" />,
  },
  {
    path: "/self-service/exit",
    element: <Exit />,
  },
  {
    path: "/self-service/exit/eos-settlement/:id",
    element: <EOSSettlementDetails />,
  },
  // Add other self-service routes as needed
];

export default selfServiceRoutes; 