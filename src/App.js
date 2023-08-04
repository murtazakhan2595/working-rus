import './index.css';
import { useState } from 'react';
import Sidebar from './app/shared/templates/Sidebar';
import { Routes, Route } from "react-router-dom";
import Dashboard from './app/modules/Dashboard';
import Login from './app/modules/Login';
function App() {
  let width = window.screen.width;
  const [isSidebarOpen, setIsSidebarOpen] = useState(width <= 1280 ? false :true);

  return (
    <Routes>
        <Route element={<Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />} >
        <Route exact path="/" element={<Dashboard/>} />
        </Route>
        <Route path="/login" element={<Login/>} />
    </Routes>
  );
}

export default App;
