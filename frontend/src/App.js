import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPopup from "./componets/LoginPopup";
import NewUser from './componets/new_user';
import Dnd1 from './componets/FullDnd';
function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPopup />} />
        <Route path="/newUser" element={<NewUser />} />
        <Route path="/Dnd1" element={<Dnd1 />} />
      </Routes>
    </Router>

              
      {/* <DragAndDropAdvanced /> */}
      {/* <Login_Amir /> */}
      
    </div>
  );
}

export default App;
