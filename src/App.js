import './index.css';
import { useState } from 'react';
import Sidebar from './app/shared/templates/Sidebar';
import { Routes, Route } from "react-router-dom";
import Dashboard from './app/modules/Dashboard';
import Login from './app/modules/Login';
function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Routes>
        <Route element={<Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />} >
        <Route exact path="/" element={<Dashboard isSidebarOpen={isSidebarOpen}/>} />
        </Route>
        <Route path="/login" element={<Login/>} />
    </Routes>
  );
}

export default App;
