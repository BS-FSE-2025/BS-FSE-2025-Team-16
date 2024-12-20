import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPopup from "./componets/LoginPopup";
import NewUser from './componets/new_user';
import Dnd1 from './componets/FullDnd';
import LandingPage from './componets/landing page/src/LandingPage';
import SuppliersPage from './componets/supplier_page/Supplier_list';
import CreateProject from './componets/createProject/create_a_Project';
function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/newUser" element={<NewUser />} />
        <Route path="/Dnd1" element={<Dnd1 />} />
        <Route path="/supplier" element={<SuppliersPage />} />
        <Route path="/CreateProject" element={<CreateProject />} />
        {/* <Route path="/LandingPage" element={<LandingPage />} /> */}
      </Routes>
    </Router>

              
      {/* <DragAndDropAdvanced /> */}
      {/* <Login_Amir /> */}
      
    </div>
  );
}

export default App;
